const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 400;
  const message = err.message || "something went wrong";
  return res.status(400).json({
    success: false,
    message: message,
    stack: err.stack,
  });
};

module.exports = errorMiddleware;
