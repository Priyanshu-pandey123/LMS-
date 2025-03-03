const JWT = require("jsonwebtoken");

const authToken = (req, res, next) => {
  const token = (req.cookies && req?.cookies?.token) || null;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "unautorized access",
    });
  }
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "unauthorized access" + err.message,
    });
  }
  next();
};

module.exports = authToken;
