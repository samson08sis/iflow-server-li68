class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

function handleError(res, error) {
  const status = error.statusCode || 500;
  res.status(status).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}

module.exports = { AppError, handleError };
