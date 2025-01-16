const express = require("express");
const authRoute = require("./router/authRoute");
const CookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const errorMiddleware = require("./middleware/error.middleware");
const app = express();
app.use(express.json());
app.use(CookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.status(200).json({
    data: "now the set up is ready for the login system",
  });
});
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "OOPS not found",
  });
});

// when the AppError initate it make a new instace of the error  then we need a middleware  to response then make a middleware
app.use(errorMiddleware);
module.exports = app;
