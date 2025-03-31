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
// const sendPasswordResetEmail = async (to, resetToken) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to,
//       subject: "Password Reset Request",
//       text: `Click the link to reset your password: ${resetToken}`,
//       html: `<h2>Password Reset</h2>
//              <p>Click the link below to reset your password:</p>
//              <a href="${resetToken}">${resetToken}</a>
//              <p>If you didn't request this, ignore this email.</p>`,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending password reset email:", error);
//     throw error;
//   }
// };
const sendPasswordResetEmail = async (to, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject: "Reset Your Password",
      text: `Click the link below to reset your password: ${resetLink}`,
      html: `<h2>Password Reset Request</h2>
             <p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>If you didn't request this, ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

const sendLeadNotificationEmail = async (data) => {
  try {
    const ownerEmail = "business@savincommunication.com";
    const mailOptions = {
      from: process.env.EMAIL,
      to: ownerEmail,
      subject: "New Lead Generated",
      text: `A new lead has been generated:\n\n- Name: ${data?.name}\n- Email: ${data?.email} Number:${data?.phone} `,
      html: `<h2>New Lead Notification</h2>
             <p>A new lead has been generated with the following details:</p>
             <ul>
               <li><strong>Name:</strong> ${data?.name}</li>
               <li><strong>Email:</strong> ${data?.email}</li>
                <li><strong>Email:</strong> ${data?.phone}</li>
             </ul>
             <p>Check your CRM for more details.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Lead notification email sent to owner.");
  } catch (error) {
    console.error("Error sending lead notification email:", error);
    throw error;
  }
};
module.exports = {
  sendLeadNotificationEmail,
  sendPasswordResetEmail,
};
