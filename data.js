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
//   });
