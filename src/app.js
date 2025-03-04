const express = require("express");
const authRoute = require("./router/authRoute");
const CookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const errorMiddleware = require("./middleware/error.middleware");
const leadRoutes = require("./router/leadRoute");
const authToken = require("./middleware/authToke");
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://43.204.229.77",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming request origin:", origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.error("Not allowed by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(CookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);
app.use("/api/lead", authToken, leadRoutes);
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.status(200).json({
    data: "now the set up is ready for the  Prtree  Backecnd Services",
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
