/**
 * Logging Utility
 * Structured JSON logging for production
 */

const config = require("../core/config");

/**
 * Log levels
 */
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

/**
 * Current log level
 */
const currentLevel = LOG_LEVELS[config.logging.level] || LOG_LEVELS.info;

/**
 * Format log message
 */
function formatMessage(level, message, meta = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    service: "dice-game",
    environment: config.env,
    message,
    ...meta,
  };

  return config.logging.format === "json"
    ? JSON.stringify(logEntry)
    : `${logEntry.timestamp} [${level.toUpperCase()}] ${message}`;
}

/**
 * Error logger
 */
function error(message, meta) {
  if (currentLevel >= LOG_LEVELS.error) {
    console.error(formatMessage("error", message, meta));
  }
}

/**
 * Warning logger
 */
function warn(message, meta) {
  if (currentLevel >= LOG_LEVELS.warn) {
    console.warn(formatMessage("warn", message, meta));
  }
}

/**
 * Info logger
 */
function info(message, meta) {
  if (currentLevel >= LOG_LEVELS.info) {
    console.log(formatMessage("info", message, meta));
  }
}

/**
 * HTTP request logger
 */
function http(message, meta) {
  if (currentLevel >= LOG_LEVELS.http) {
    console.log(formatMessage("http", message, meta));
  }
}

/**
 * Debug logger
 */
function debug(message, meta) {
  if (currentLevel >= LOG_LEVELS.debug) {
    console.log(formatMessage("debug", message, meta));
  }
}

/**
 * Log API request
 */
function logRequest(req, res, duration) {
  http("HTTP request", {
    method: req.method,
    url: req.url,
    status: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip,
    user_agent: req.get("user-agent"),
  });
}

/**
 * Log game event
 */
function logGameEvent(event, data) {
  info(`Game event: ${event}`, data);
}

module.exports = {
  error,
  warn,
  info,
  http,
  debug,
  logRequest,
  logGameEvent,
};
