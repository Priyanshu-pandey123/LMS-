const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.status(200).json({
    data: "now the set up is ready for the login system",
  });
});

module.exports = app;
