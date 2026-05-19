// Load environment variables first
require("dotenv").config();
const nodemailer = require("nodemailer");

// Create Gmail transporter with enhanced configuration
const createTransporter = () => {
  // Validate environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not found in environment variables');
    return null;
  }
  console.log('process.env.EMAIL_PASS',process.env.EMAIL_USER, process.env.EMAIL_PASS);
  

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password, not regular password
    },
    // Enhanced configuration
    pool: true, // Use connection pooling
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000, // Rate limiting: 1 message per second
    rateLimit: 5, // Max 5 messages per second
  });

  return transporter;
};

// Create and export transporter
const transporter = createTransporter();

// Verify connection on startup
const verifyEmailConnection = async () => {
  if (!transporter) {
    console.log('Email transporter not configured');
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ Gmail server connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Gmail connection failed:', error.message);
    return false;
  }
};

module.exports = {
  transporter,
  verifyEmailConnection,
  createTransporter,
};
