/**
 * Environment Configuration
 */

module.exports = {
  // Server
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // JWT
  jwt: {
    secret:
      process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
    expiresIn: "7d",
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
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || "",
  },

  // Game Configuration
  game: {
    bettingDuration: 8, // seconds
    rollingDuration: 3, // seconds
    settlementDuration: 1, // seconds
    minBet: 50,
    maxBet: 1000,
    payoutMultiplier: 2,
  },

  // Wallet Configuration
  wallet: {
    initialBalance: 1000,
    minBalance: 100,
    dailyLossLimit: 1000,
    cooldownPeriod: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Leaderboard
  leaderboard: {
    refreshInterval: 5000, // 5 seconds
    topCount: 100,
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
