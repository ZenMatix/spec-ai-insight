// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const nodemailer = require("nodemailer");
// const fs = require("fs");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Ensure 'uploads' folder exists
// const UPLOADS_DIR = "uploads";
// if (!fs.existsSync(UPLOADS_DIR)) {
//     fs.mkdirSync(UPLOADS_DIR);
// }

// // Multer setup (stores files temporarily)
// const upload = multer({ dest: UPLOADS_DIR });

// // Email transporter setup using Gmail SMTP
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // Handle file and form submission
// app.post("/send-email", upload.single("file"), async (req, res) => {
//     try {
//         const { name, email, message } = req.body;
//         const file = req.file;

//         if (!name || !email || !message || !file) {
//             return res.status(400).json({ message: "All fields are required." });
//         }

//         // Email details
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: process.env.EMAIL_USER, // Send to yourself
//             subject: "New File Submission From Vdospec",
//             text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//             attachments: [
//                 {
//                     filename: file.originalname,
//                     path: file.path,
//                 },
//             ],
//         };

//         // Send email
//         await transporter.sendMail(mailOptions);
//         console.log("✅ Email sent successfully");

//         // Delete the file after sending
//         fs.unlinkSync(file.path);

//         res.json({ message: "Email sent successfully with attachment!" });
//     } catch (error) {
//         console.error("❌ Error sending email:", error.message);
//         res.status(500).json({ message: "Failed to send email.", error: error.message });
//     }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Ensure 'uploads' folder exists
const UPLOADS_DIR = "uploads";
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Multer setup (stores files temporarily)
const upload = multer({ dest: UPLOADS_DIR });

// Email transporter setup using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Handle form submission (file optional)
app.post("/send-email", upload.single("file"), async (req, res) => {
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
        await transporter.sendMail(mailOptions);
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

