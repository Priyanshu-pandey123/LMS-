const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// Create a transporter object for email sending

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your App Password
  },
});

/**
 * Sends a password reset email
 * @param {string} to - Recipient email
 * @param {string} resetToken - Unique password reset token
 */
const sendPasswordResetEmail = async (to, resetToken) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetToken}`,
      html: `<h2>Password Reset</h2>
             <p>Click the link below to reset your password:</p>
             <a href="${resetToken}">${resetToken}</a>
             <p>If you didn't request this, ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

module.exports = sendPasswordResetEmail;
