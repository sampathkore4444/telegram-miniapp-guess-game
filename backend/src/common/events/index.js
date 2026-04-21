/**
 * WebSocket Event Types Schema
 */

/**
 * @typedef {Object} GameStateEvent
 * @property {string} type - 'GAME_STATE'
 * @property {number} roundId
 * @property {string} phase
 * @property {number} timeLeft
 * @property {number} balance
 */

/**
 * @typedef {Object} BetRequestEvent
 * @property {string} event - 'PLACE_BET'
 * @property {number} roundId
 * @property {string} choice - 'BIG' or 'SMALL'
 * @property {number} amount
 */

/**
 * @typedef {Object} BetAcceptedEvent
 * @property {string} type - 'BET_ACCEPTED'
 * @property {string} status - 'bet_accepted'
 */

/**
 * @typedef {Object} BetRejectedEvent
 * @property {string} type - 'BET_REJECTED'
 * @property {string} reason
 */

/**
 * @typedef {Object} DiceResultEvent
 * @property {string} type - 'DICE_RESULT'
 * @property {number} dice
 * @property {string} winner - 'BIG' or 'SMALL'
 */

/**
 * @typedef {Object} SettlementEvent
 * @property {string} type - 'BET_SETTLEMENT'
 * @property {number} amount
 * @property {number} reward
 * @property {string} result - 'WIN' or 'LOSE'
 */

/**
 * @typedef {Object} WalletUpdateEvent
 * @property {string} type - 'WALLET_UPDATE'
 * @property {number} balance
 * @property {string} change - '+100' or '-50'
 */

/**
 * @typedef {Object} NewRoundEvent
 * @property {string} type - 'NEW_ROUND_STARTED'
 * @property {number} roundId
 * @property {number} timeLeft
 */

module.exports = {};
