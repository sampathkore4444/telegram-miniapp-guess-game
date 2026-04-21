/**
 * Common Interfaces / Types
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {number} telegramId
 * @property {string} username
 * @property {number} totalCoins
 * @property {number} level
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} PlayerSession
 * @property {string} userId
 * @property {number} balance
 * @property {number} currentBet
 * @property {string} selectedChoice
 * @property {string} gameRoundId
 * @property {number} winStreak
 * @property {Date} lastActionTime
 */

/**
 * @typedef {Object} GameRound
 * @property {string} id
 * @property {string} phase
 * @property {number} diceResult
 * @property {number} totalPool
 * @property {number} bigBets
 * @property {number} smallBets
 * @property {number} playerCount
 * @property {Date} createdAt
 * @property {Date} closedAt
 */

/**
 * @typedef {Object} Bet
 * @property {string} id
 * @property {string} roundId
 * @property {string} userId
 * @property {number} amount
 * @property {string} choice - 'BIG' or 'SMALL'
 * @property {number} payout
 * @property {string} result - 'WIN' or 'LOSE'
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} userId
 * @property {string} roundId
 * @property {number} amount
 * @property {string} type - 'BET', 'WIN', 'LOSE', 'BONUS'
 * @property {number} balanceAfter
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {number} rank
 * @property {string} userId
 * @property {string} username
 * @property {number} coins
 * @property {number} winStreak
 */

module.exports = {};
