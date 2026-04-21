/**
 * Error Handling Middleware
 */

const constants = require("../core/constants");

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  console.error("[Error]", err);

  // Default error
  let status = constants.HTTP_STATUS.INTERNAL_ERROR;
  let message = constants.ERROR_MESSAGES.INTERNAL_ERROR;

  // Handle specific error types
  if (err.name === "ValidationError") {
    status = constants.HTTP_STATUS.BAD_REQUEST;
    message = err.message;
  } else if (err.name === "UnauthorizedError") {
    status = constants.HTTP_STATUS.UNAUTHORIZED;
    message = constants.ERROR_MESSAGES.UNAUTHORIZED;
  } else if (err.name === "CastError") {
    status = constants.HTTP_STATUS.BAD_REQUEST;
    message = "Invalid ID format";
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Not found handler
 */
const notFoundHandler = (req, res) => {
  res.status(constants.HTTP_STATUS.NOT_FOUND).json({
    error: "Endpoint not found",
  });
};

module.exports = { errorHandler, notFoundHandler };
