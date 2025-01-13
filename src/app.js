const express = require("express");
const authRoute = require("./router/authRoute");
const CookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(CookieParser());
app.use("/api/auth", authRoute);

app.use("/", (req, res) => {
  res.status(200).json({
    data: "now the set up is ready for the login system",
  });
});

module.exports = app;
