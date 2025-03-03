const express = require("express");
const {
  sample,
  singUp,
  signin,
  profile,
  logout,
  resetPasswordlink,
  resetPassword,
} = require("../controller/authController");
const authToken = require("../middleware/authToke");
const authRoute = express.Router();
authRoute.get("/", sample);
authRoute.post("/signup", singUp);
authRoute.post("/signin", signin);
authRoute.get("/profile", authToken, profile);
authRoute.delete("/logout", logout);
// this will generate the link for the password
authRoute.post("/resetPasswordlink", resetPasswordlink);
// this will change  the password
authRoute.post("/resetPassword/:id", resetPassword);

module.exports = authRoute;
