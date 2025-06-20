const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Get OpenRouter API key from environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("Error: OPENROUTER_API_KEY not found in environment variables");
  process.exit(1);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use timestamp + original name to avoid conflicts
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
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

// Store document content in memory (in production, use a database)
const documentStore = new Map();

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
app.post("/api/upload", upload.single('document'), async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});