module.exports = globalErrorHandler = (err, req, res, next) => {
  // immediately make visible in the server
  console.error("Global error handler caught:", err);

  const errorDetails = {
    message: err.message,
    route: req.originalUrl,
    method: req.method,
    time: new Date(),
  };

  // log details to the console for development
  console.log(
    "Error details from middleware:",
    JSON.stringify(errorDetails, null, 2),
  );

  console.log("Error Stack:\n");
  err.stack.split("\n").forEach((line) => console.log(line));

  // if response already started, defer to express's default error handling
  if (res.headersSent) {
    return next(err);
  }

  // provide fallback error code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ success: false, message });
};
