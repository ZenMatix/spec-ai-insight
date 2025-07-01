const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Parse EMAIL_PORT safely
const emailPort = parseInt(process.env.EMAIL_PORT, 10);

// Create transporter using .env SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: emailPort,
  secure: emailPort === 465, // true for SSL (465), false for TLS (587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
          <div class="value">${type}</div>

          <div class="label">Message</div>
          <div class="value">${message}</div>

          <p style="margin-top: 32px;">Please follow up with the sender at your earliest convenience.</p>
        </div>
        <div class="footer">
          © 2025 Vdospec AI · Automated form submission
        </div>
      </div>
    </body>
    </html>
  `;
};

// API endpoint
app.post('/api/inquiry-email', async (req, res) => {
  const { name, email, company, message, type } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: 'inquiry@vdospec.com',
    replyTo: email,
    subject: `New Inquiry from ${name}`,
    html: generateEmailTemplate({ name, email, company, message, type }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent from ${email} (${name})`);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    res.status(500).json({ error: 'Email could not be sent. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
