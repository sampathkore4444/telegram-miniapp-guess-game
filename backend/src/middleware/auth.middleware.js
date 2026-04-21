/**
 * Authentication Middleware
 */

const jwt = require("jsonwebtoken");
const config = require("../core/config");
const constants = require("../core/constants");

/**
 * Verify JWT token
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(constants.HTTP_STATUS.UNAUTHORIZED).json({
      error: constants.ERROR_MESSAGES.UNAUTHORIZED,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(constants.HTTP_STATUS.UNAUTHORIZED).json({
      error: constants.ERROR_MESSAGES.UNAUTHORIZED,
    });
  }
};

/**
 * Optional authentication (for public endpoints that can use user info if available)
 */
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
  } catch (error) {
    // Token invalid, but continue without user
  }

  next();
};

module.exports = { authMiddleware, optionalAuthMiddleware };
