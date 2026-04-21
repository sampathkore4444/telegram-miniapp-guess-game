/**
 * Game Service - Core Game Logic
 * Handles round management, betting, dice rolling, and settlement
 */

const crypto = require("crypto");
const config = require("../../core/config");
const constants = require("../../core/constants");
const { getRedis } = require("../../database/redis");
const { prisma } = require("../../database/prisma");

class GameService {
  constructor(io) {
    this.io = io;
    this.currentRound = null;
    this.roundTimer = null;
    this.startNewRound();
  }

  /**
   * Generate a secure random dice roll
   * @returns {number} Dice value between 1-6
   */
  generateDiceRoll() {
    const buffer = crypto.randomBytes(4);
    const randomNumber = buffer.readUInt32BE(0);
    return (randomNumber % 6) + 1;
  }

  /**
   * Determine winner based on dice roll
   * @param {number} dice - Dice value
   * @returns {string} 'BIG' or 'SMALL'
   */
  determineWinner(dice) {
    return constants.BIG_RANGE.includes(dice) ? "BIG" : "SMALL";
  }

  /**
   * Start a new game round
   */
  async startNewRound() {
    const roundId = Date.now();
    const phase = config.gamePhases.OPEN_BETS;

    this.currentRound = {
      id: roundId,
      phase,
      diceResult: null,
      totalPool: 0,
      bigBets: 0,
      smallBets: 0,
      playerCount: 0,
      bets: new Map(), // Store bets in memory for fast access
      createdAt: new Date(),
    };

    // Store in Redis
    const redis = getRedis();
    if (redis) {
      await redis.hset(config.redisKeys.round(roundId), {
        id: roundId,
        phase,
        diceResult: null,
        totalPool: 0,
        bigBets: 0,
        smallBets: 0,
        playerCount: 0,
      });
      await redis.set(config.redisKeys.activeRound, roundId);
    }

    // Broadcast new round to all clients
    this.io.emit(constants.WS_EVENTS.NEW_ROUND_STARTED, {
      type: constants.WS_EVENTS.NEW_ROUND_STARTED,
      roundId,
      timeLeft: config.game.bettingDuration,
    });

    // Start betting timer
    this.startBettingTimer();

    console.log(`[Game] New round started: ${roundId}`);
  }

  /**
   * Start the betting phase timer
   */
  startBettingTimer() {
    if (this.roundTimer) {
      clearTimeout(this.roundTimer);
    }

    let timeLeft = config.game.bettingDuration;

    this.roundTimer = setInterval(() => {
      timeLeft--;

      // Broadcast timer update
      this.io.emit(constants.WS_EVENTS.GAME_STATE, {
        type: constants.WS_EVENTS.GAME_STATE,
        roundId: this.currentRound.id,
        phase: this.currentRound.phase,
        timeLeft,
      });

      if (timeLeft <= 0) {
        clearInterval(this.roundTimer);
        this.rollDice();
      }
    }, 1000);
  }

  /**
   * Roll the dice and determine result
   */
  async rollDice() {
    if (!this.currentRound) return;

    this.currentRound.phase = config.gamePhases.ROLLING;

    // Generate dice result
    const diceResult = this.generateDiceRoll();
    const winner = this.determineWinner(diceResult);

    this.currentRound.diceResult = diceResult;
    this.currentRound.phase = config.gamePhases.RESULT_CALCULATED;

    // Broadcast result
    this.io.emit(constants.WS_EVENTS.DICE_RESULT, {
      type: constants.WS_EVENTS.DICE_RESULT,
      dice: diceResult,
      winner,
    });

    console.log(`[Game] Dice rolled: ${diceResult} - Winner: ${winner}`);

    // Process settlements after delay
    setTimeout(() => {
      this.settleBets(winner);
    }, config.game.rollingDuration * 1000);
  }

  /**
   * Settle all bets for the current round
   * @param {string} winner - 'BIG' or 'SMALL'
   */
  async settleBets(winner) {
    if (!this.currentRound) return;

    this.currentRound.phase = config.gamePhases.SETTLEMENT;

    // Process each bet
    for (const [userId, bet] of this.currentRound.bets) {
      const playerWon = bet.choice === winner;
      const payout = playerWon ? bet.amount * config.game.payoutMultiplier : 0;
      const result = playerWon ? "WIN" : "LOSE";

      // Calculate actual winnings (payout - original bet)
      const netReward = payout - bet.amount;

      // Update player balance
      this.updatePlayerBalance(userId, netReward);

      // Emit settlement to specific player
      this.io.to(userId).emit(constants.WS_EVENTS.BET_SETTLEMENT, {
        type: constants.WS_EVENTS.BET_SETTLEMENT,
        amount: bet.amount,
        reward: payout,
        result,
      });
    }

    console.log(`[Game] Settled ${this.currentRound.bets.size} bets`);

    // Start new round after settlement
    setTimeout(() => {
      this.startNewRound();
    }, config.game.settlementDuration * 1000);
  }

  /**
   * Update player balance
   * @param {string} userId - Player ID
   * @param {number} change - Balance change amount
   */
  async updatePlayerBalance(userId, change) {
    const redis = getRedis();
    if (redis) {
      const key = config.redisKeys.playerBalance(userId);
      await redis.incrby(key, change);
    }
  }

  /**
   * Place a bet
   * @param {string} userId - Player ID
   * @param {string} choice - 'BIG' or 'SMALL'
   * @param {number} amount - Bet amount
   * @returns {Object} Bet result
   */
  async placeBet(userId, choice, amount) {
    // Validate round is open
    if (this.currentRound.phase !== config.gamePhases.OPEN_BETS) {
      return {
        success: false,
        reason: constants.ERROR_MESSAGES.BETTING_CLOSED,
      };
    }

    // Validate bet amount
    if (!constants.BET_AMOUNTS.includes(amount)) {
      return {
        success: false,
        reason: constants.ERROR_MESSAGES.INVALID_BET_AMOUNT,
      };
    }

    // Validate choice
    if (!["BIG", "SMALL"].includes(choice)) {
      return {
        success: false,
        reason: constants.ERROR_MESSAGES.INVALID_CHOICE,
      };
    }

    // Check player balance
    const redis = getRedis();
    let balance = 0;
    if (redis) {
      const balanceStr = await redis.get(
        config.redisKeys.playerBalance(userId),
      );
      balance = parseInt(balanceStr) || config.wallet.initialBalance;
    }

    if (balance < amount) {
      return {
        success: false,
        reason: constants.ERROR_MESSAGES.INSUFFICIENT_BALANCE,
      };
    }

    // Deduct bet from balance
    if (redis) {
      await redis.decrby(config.redisKeys.playerBalance(userId), amount);
    }

    // Store bet
    this.currentRound.bets.set(userId, {
      userId,
      choice,
      amount,
      timestamp: new Date(),
    });

    // Update round totals
    if (choice === "BIG") {
      this.currentRound.bigBets += amount;
    } else {
      this.currentRound.smallBets += amount;
    }
    this.currentRound.totalPool += amount;
    this.currentRound.playerCount = this.currentRound.bets.size;

    console.log(`[Game] Bet placed: ${userId} - ${choice} - ${amount}`);

    return { success: true, status: "bet_accepted" };
  }

  /**
   * Get current game state
   * @returns {Object} Current game state
   */
  getGameState() {
    if (!this.currentRound) return null;

    return {
      roundId: this.currentRound.id,
      phase: this.currentRound.phase,
      totalPool: this.currentRound.totalPool,
      playerCount: this.currentRound.playerCount,
    };
  }
}

module.exports = { GameService };
