/**
 * Environment Configuration
 * Uses dotenv for development, env vars for production
 */

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // Server
  port: parseInt(process.env.PORT || "3000", 10),
  env: process.env.NODE_ENV || "development",

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  // Telegram
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || "",
  },

  // Database
  database: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://user:password@localhost:5432/dicegame",
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || "",
  },

  // Game Configuration
  game: {
    bettingDuration: parseInt(process.env.BETTING_DURATION || "8", 10),
    rollingDuration: parseInt(process.env.ROLLING_DURATION || "3", 10),
    settlementDuration: parseInt(process.env.SETTLEMENT_DURATION || "1", 10),
    minBet: parseInt(process.env.MIN_BET || "50", 10),
    maxBet: parseInt(process.env.MAX_BET || "1000", 10),
    payoutMultiplier: parseInt(process.env.PAYOUT_MULTIPLIER || "2", 10),
  },

  // Wallet Configuration
  wallet: {
    initialBalance: parseInt(process.env.INITIAL_BALANCE || "1000", 10),
    minBalance: parseInt(process.env.MIN_BALANCE || "100", 10),
    dailyLossLimit: parseInt(process.env.DAILY_LOSS_LIMIT || "1000", 10),
    cooldownPeriod: parseInt(process.env.COOLDOWN_PERIOD || "86400000", 10),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
  },

  // Redis Keys
  redisKeys: {
    player: (userId) => `player:${userId}:session`,
    playerBalance: (userId) => `player:${userId}:balance`,
    round: (roundId) => `round:${roundId}`,
    activeRound: "round:active",
    leaderboard: "leaderboard:global",
    bets: (roundId) => `round:${roundId}:bets`,
  },

  // Leaderboard Configuration
  leaderboard: {
    refreshInterval: parseInt(
      process.env.LEADERBOARD_REFRESH_INTERVAL || "60000",
      10,
    ),
    topCount: parseInt(process.env.LEADERBOARD_TOP_COUNT || "100", 10),
  },

  // Game Phases
  gamePhases: {
    INIT: "INIT",
    OPEN_BETS: "OPEN_BETS",
    LOCKED: "LOCKED",
    ROLLING: "ROLLING",
    RESULT_CALCULATED: "RESULT_CALCULATED",
    SETTLEMENT: "SETTLEMENT",
    CLOSED: "CLOSED",
  },
};
