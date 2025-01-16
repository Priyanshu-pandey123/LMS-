const dotenv = require("dotenv").config();
const app = require("./src/app");
const dBConnection = require("./src/config/mongoConfiguration");
const port = 3000;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_AP_SECRET,
});

async function startServer() {
  try {
    await dBConnection();
    console.log("Database connected. Starting server...");

    app.listen(port, (err) => {
      if (err) {
        console.error("Error starting server:", err);
        return;
      }
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

startServer();
