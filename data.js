const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_AP_SECRET,
});

CLOUDINARY_CLOUDNAME = "ddgxf28zp";
CLOUDINARY_API_KEY = "629295113442294";
CLOUDINARY_AP_SECRET = "v5KYjlrfuRUEle1jlZbGhhMlues";
// if (password !== confirmPassword) {
//   return res.status(400).json({
//     status: false,
//     message: "Password and Confirm Password not same:",
// //   });
// DB_URL =
//   "mongodb+srv://prince678p:xgc2z8A1pgUe0XLD@prtree.eqo6h.mongodb.net/?retryWrites=true&w=majority&appName=prTree";
// JWT_SECRET = "Prince12@#";

// FRONTEND_URL = "http://localhost:5173";
// EMAIL_PASSWORD = "rcrzzenyqszfiake";
// EMAIL = "prince678p@gmail.com";
