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
const upload = require("../middleware/multer.middleware");
const authRoute = express.Router();

authRoute.get("/", sample);
authRoute.post("/signup", upload.single("avatar"), singUp);
authRoute.post("/signin", signin);
authRoute.get("/profile", authToken, profile);
authRoute.delete("/logout", logout);
authRoute.post("/resetPasswordlink", resetPasswordlink);
authRoute.post("/resetPassword/:id", resetPassword);

module.exports = authRoute;
