const { Db } = require("mongodb");
const mongoose = require("mongoose");

async function dBConnection() {
  try {
    const db = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected:");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

dBConnection();
module.exports = dBConnection;
