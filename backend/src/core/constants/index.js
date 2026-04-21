/**
 * Game Constants
 */

module.exports = {
  // Version
  SOCKET_IO_VERSION: "4.7.2",
  APP_VERSION: "1.0.0",

  // Game Constants
  DICE_MIN: 1,
  DICE_MAX: 6,
  BIG_RANGE: [4, 5, 6],
  SMALL_RANGE: [1, 2, 3],

  // Betting Options
  BET_AMOUNTS: [50, 100, 200, 500],

  // Player Level Thresholds
  LEVEL_THRESHOLDS: {
    1: 0,
    2: 1000,
    3: 5000,
    4: 20000,
    5: 100000,
  },

  // Bonus Triggers
  BONUS_TRIGGERS: {
    WIN_STREAK: 3,
    DAILY_LOGIN: "daily",
    RANDOM_DROP: "random",
  },

  // Red Packet Rewards
  RED_PACKET_TYPES: {
    COINS: "coins",
    BOOST: "boost",
    BONUS: "bonus",
  },

  RED_PACKET_RANGES: {
    COINS: [10, 100],
    BOOST: [2, 2], // 2x multiplier
    BONUS: [50, 500],
  },

  // WebSocket Events
  WS_EVENTS: {
    // Client -> Server
    PLACE_BET: "PLACE_BET",
    JOIN_GAME: "JOIN_GAME",
    CLAIM_REWARD: "CLAIM_REWARD",
    LEAVE_GAME: "LEAVE_GAME",

    // Server -> Client
    GAME_STATE: "GAME_STATE",
    BET_ACCEPTED: "BET_ACCEPTED",
    BET_REJECTED: "BET_REJECTED",
    DICE_RESULT: "DICE_RESULT",
    BET_SETTLEMENT: "BET_SETTLEMENT",
    WALLET_UPDATE: "WALLET_UPDATE",
    NEW_ROUND_STARTED: "NEW_ROUND_STARTED",
    LUCKY_PACKET_AVAILABLE: "LUCKY_PACKET_AVAILABLE",
    PLAYER_JOINED: "PLAYER_JOINED",
    PLAYER_LEFT: "PLAYER_LEFT",
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    RATE_LIMITED: 429,
    INTERNAL_ERROR: 500,
  },

  // Error Messages
  ERROR_MESSAGES: {
    INVALID_BET_AMOUNT: "Invalid bet amount",
    INSUFFICIENT_BALANCE: "Insufficient balance",
    BETTING_CLOSED: "Betting is closed for this round",
    INVALID_CHOICE: "Invalid choice. Must be BIG or SMALL",
    ROUND_NOT_FOUND: "Round not found",
    PLAYER_NOT_FOUND: "Player not found",
    UNAUTHORIZED: "Unauthorized",
    INTERNAL_ERROR: "Internal server error",
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    BET_PLACED: "Bet placed successfully",
    REWARD_CLAIMED: "Reward claimed successfully",
  },
};
