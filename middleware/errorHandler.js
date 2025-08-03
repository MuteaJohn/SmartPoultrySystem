// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error details to console for dev for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; //Ensures 500 status if none was previously set
  res.status(statusCode).json({
    message: err.message,
    // In production, you might not want to send the stack trace
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;