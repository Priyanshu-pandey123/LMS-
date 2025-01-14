const express = require("express");
const {
  sample,
  singUp,
  signin,
  profile,
  logout,
} = require("../controller/authController");
const authToken = require("../middleware/authToke");
const authRoute = express.Router();

authRoute.get("/", sample);
authRoute.post("/signup", singUp);
authRoute.post("/signin", signin);
authRoute.get("/profile", authToken, profile);
authRoute.delete("/logout", logout);

module.exports = authRoute;
