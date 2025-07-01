const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure 'uploads' folder exists
const UPLOADS_DIR = "uploads";
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Store document content in memory (in production, use a database)
const documentStore = new Map();

//Contact Form Email Sending: 

// Parse email port
const emailPort = parseInt(process.env.SMTP_EMAIL_PORT, 10);

// Nodemailer transporter using SMTP_ env variables
const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_EMAIL_HOST,
  port: emailPort,
  secure: emailPort === 465, // true for SSL (465), false for TLS (587)
  auth: {
    user: process.env.SMTP_EMAIL_USER,
    pass: process.env.SMTP_EMAIL_PASS,
  },
});

// HTML email template
const generateEmailTemplate = ({ name, email, company, message, type }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>New Inquiry from ${name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f6f8;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #fff;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #1e293b;
          color: white;
          padding: 24px 32px;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .content {
          padding: 32px;
        }
        .label {
          font-weight: bold;
          color: #1e293b;
          margin-top: 16px;
          margin-bottom: 4px;
        }
        .value {
          margin-bottom: 12px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888;
          background-color: #f8fafc;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Inquiry from ${name}</h1>
        </div>
        <div class="content">
          <p>You received a new inquiry via the Vdospec AI contact form:</p>

          <div class="label">Name</div>
          <div class="value">${name}</div>

          <div class="label">Email</div>
          <div class="value">${email}</div>

          <div class="label">Company</div>
          <div class="value">${company || 'N/A'}</div>

          <div class="label">Inquiry Type</div>
          <div class="value">${type || 'General'}</div>

          <div class="label">Message</div>
          <div class="value">${message}</div>

          
        </div>
        <div class="footer">
          © 2025 Vdospec AI · Automated form submission
        </div>
      </div>
    </body>
    </html>
  `;
};

// API endpoint for form submission
app.post("/api/inquiry-email", async (req, res) => {
  const { name, email, company, message, type } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  // Validate email format (basic)
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValidEmail) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_EMAIL_USER}>`,
    to: "inquiry@vdospec.com", // your receiving email
    replyTo: email,
    subject: `New Inquiry from ${name}`,
    html: generateEmailTemplate({ name, email, company, message, type }),
  };

  try {
    await smtpTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent from ${email} (${name})`);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    res.status(500).json({ error: "Failed to send email. Try again later." });
  }
});

//OpenRouter Message Sending: 

// Get OpenRouter API key from environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("Error: OPENROUTER_API_KEY not found in environment variables");
  process.exit(1);
}

// Configure multer for file uploads (OpenRouter section)
const openRouterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Use timestamp + original name to avoid conflicts
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const openRouterUpload = multer({
  storage: openRouterStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF, DOC, DOCX, TXT files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed!'), false);
    }
  }
});

// Helper function to extract text from different file types
async function extractTextFromFile(filePath, mimetype) {
  try {
    switch (mimetype) {
      case 'application/pdf':
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        return pdfData.text;
        
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxBuffer = fs.readFileSync(filePath);
        const docxResult = await mammoth.extractRawText({ buffer: docxBuffer });
        return docxResult.value;
        
      case 'application/msword':
        // For older .doc files, you might need additional libraries
        // For now, we'll return an error message
        throw new Error('Legacy .doc files are not supported. Please convert to .docx format.');
        
      case 'text/plain':
        return fs.readFileSync(filePath, 'utf8');
        
      default:
        throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}

// Helper function to call OpenRouter API
async function getOpenRouterResponse(prompt, documentContext = null) {
  let systemMessage = "You are a helpful AI assistant.";
  
  if (documentContext) {
    systemMessage = `You are a helpful AI assistant. The user has uploaded a document. Here is the content of the document:

---DOCUMENT CONTENT---
${documentContext}
---END DOCUMENT CONTENT---

Please answer questions based on this document content. If the user asks questions about the document, refer to the content above.`;
  }

  const messages = [
    {
      role: "system",
      content: systemMessage
    },
    {
      role: "user",
      content: prompt
    }
  ];

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: messages,
      stream: true
    },
    {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3001",
        "X-Title": "Pulse AI Chat"
      },
      responseType: "stream"
    }
  );
  return response.data;
}

// Upload document endpoint
app.post("/api/upload", openRouterUpload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileId = req.file.filename;
    
    // Extract text from the uploaded file
    const extractedText = await extractTextFromFile(filePath, req.file.mimetype);
    
    // Store the document content with metadata
    documentStore.set(fileId, {
      filename: req.file.originalname,
      content: extractedText,
      uploadDate: new Date(),
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    // Clean up the uploaded file (optional, since we've extracted the text)
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      fileId: fileId,
      filename: req.file.originalname,
      size: req.file.size,
      message: "Document uploaded and processed successfully"
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error cleaning up file:", unlinkError);
      }
    }
    
    res.status(500).json({ 
      error: error.message || "Failed to process uploaded document" 
    });
  }
});

// Get document info endpoint
app.get("/api/document/:fileId", (req, res) => {
  const { fileId } = req.params;
  const document = documentStore.get(fileId);
  
  if (!document) {
    return res.status(404).json({ error: "Document not found" });
  }
  
  res.json({
    fileId: fileId,
    filename: document.filename,
    uploadDate: document.uploadDate,
    size: document.size,
    mimetype: document.mimetype
  });
});

// Delete document endpoint
app.delete("/api/document/:fileId", (req, res) => {
  const { fileId } = req.params;
  
  if (documentStore.has(fileId)) {
    documentStore.delete(fileId);
    res.json({ success: true, message: "Document deleted successfully" });
  } else {
    res.status(404).json({ error: "Document not found" });
  }
});

// Updated message endpoint to handle document context
app.post("/api/message", async (req, res) => {
  const { message: userMessage, documentId } = req.body;

  if (!userMessage || typeof userMessage !== "string") {
    return res.status(400).json({ error: "Invalid or missing message" });
  }

  const startTime = Date.now();

  try {
    // Get document context if documentId is provided
    let documentContext = null;
    if (documentId && documentStore.has(documentId)) {
      const document = documentStore.get(documentId);
      documentContext = document.content;
    }

    const stream = await getOpenRouterResponse(userMessage, documentContext);

    // Set headers for streaming response
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let buffer = "";

    stream.on("data", (chunk) => {
      const chunkStr = chunk.toString();
      buffer += chunkStr;
      
      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        if (line.trim() === "") continue;
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              res.write(content);
            }
          } catch (parseError) {
            console.warn("Failed to parse chunk:", data);
          }
        }
      }
    });

    stream.on("end", () => {
      const duration = Date.now() - startTime;
      console.log(`OpenRouter responded in ${duration} ms`);
      res.end();
    });

    stream.on("error", (error) => {
      console.error("OpenRouter stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to stream response from OpenRouter" });
      } else {
        res.end();
      }
    });
  } catch (error) {
    console.error("OpenRouter error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});

//Human Response Email Sending: 

// Multer setup for human response (stores files temporarily)
const humanResponseUpload = multer({ dest: UPLOADS_DIR });

// Email transporter setup using Gmail SMTP
const gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Handle form submission (file optional)
app.post("/send-email", humanResponseUpload.single("file"), async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const file = req.file; // May be undefined

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, Email, and Message are required fields." });
        }

        // Email details
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: "New Submission From Vdospec",
            text: `Name: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ""}Message: ${message}`,
            attachments: file
                ? [{ filename: file.originalname, path: file.path }]
                : [],
        };

        // Send email
        await gmailTransporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully");

        // Delete file after sending (if uploaded)
        if (file) {
            fs.unlinkSync(file.path);
        }

        res.json({ message: "Submitted successfully!" });
    } catch (error) {
        console.error("❌ Error submitting form:", error.message);
        res.status(500).json({ message: "Failed to submit.", error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});