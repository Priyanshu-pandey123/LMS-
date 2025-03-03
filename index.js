const dotenv = require("dotenv").config();
const app = require("./src/app");
const dBConnection = require("./src/config/mongoConfiguration");
const port = 3000;

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
