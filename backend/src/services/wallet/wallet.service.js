/**
 * Wallet Service - Handles player balance and transactions
 */

const config = require("../../core/config");
const { getRedis } = require("../../database/redis");
const { prisma } = require("../../database/prisma");

class WalletService {
  constructor() {
    console.log("[Wallet] Service initialized");
  }

  /**
   * Get player balance
   * @param {string} userId - Player ID
   * @returns {number} Current balance
   */
  async getBalance(userId) {
    const redis = getRedis();
    if (redis) {
      const balance = await redis.get(config.redisKeys.playerBalance(userId));
      return parseInt(balance) || config.wallet.initialBalance;
    }
    return config.wallet.initialBalance;
  }

  /**
   * Set player balance (for initialization)
   * @param {string} userId - Player ID
   * @param {number} balance - Initial balance
   */
  async setBalance(userId, balance) {
    const redis = getRedis();
    if (redis) {
      await redis.set(config.redisKeys.playerBalance(userId), balance);
    }
  }

  /**
   * Add to player balance
   * @param {string} userId - Player ID
   * @param {number} amount - Amount to add
   * @returns {number} New balance
   */
  async addToBalance(userId, amount) {
    const redis = getRedis();
    if (redis) {
      const newBalance = await redis.incrby(
        config.redisKeys.playerBalance(userId),
        amount,
      );
      return newBalance;
    }
    return 0;
  }

  /**
   * Deduct from player balance
   * @param {string} userId - Player ID
   * @param {number} amount - Amount to deduct
   * @returns {number} New balance (0 if insufficient)
   */
  async deductFromBalance(userId, amount) {
    const redis = getRedis();
    if (redis) {
      const currentBalance = await this.getBalance(userId);
      if (currentBalance < amount) {
        return 0;
      }
      const newBalance = await redis.decrby(
        config.redisKeys.playerBalance(userId),
        amount,
      );
      return newBalance;
    }
    return 0;
  }

  /**
   * Record transaction in database
   * @param {Object} transactionData - Transaction details
   */
  async recordTransaction(transactionData) {
    try {
      await prisma.transaction.create({
        data: {
          userId: transactionData.userId,
          roundId: transactionData.roundId,
          amount: transactionData.amount,
          type: transactionData.type,
          balanceAfter: transactionData.balanceAfter,
        },
      });
    } catch (error) {
      console.error("[Wallet] Failed to record transaction:", error);
    }
  }

  /**
   * Get transaction history
   * @param {string} userId - Player ID
   * @param {number} limit - Number of records
   * @returns {Array} Transaction history
   */
  async getTransactionHistory(userId, limit = 20) {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take: limit,
      });
      return transactions;
    } catch (error) {
      console.error("[Wallet] Failed to get transaction history:", error);
      return [];
    }
  }

  /**
   * Check if player can bet (within loss limits)
   * @param {string} userId - Player ID
   * @returns {boolean} Can place bet
   */
  async canPlaceBet(userId) {
    const redis = getRedis();
    if (!redis) return true;

    const todayLossKey = `player:${userId}:dailyLoss`;
    const todayLoss = parseInt(await redis.get(todayLossKey)) || 0;

    return todayLoss < config.wallet.dailyLossLimit;
  }

  /**
   * Record daily loss
   * @param {string} userId - Player ID
   * @param {number} loss - Loss amount
   */
  async recordDailyLoss(userId, loss) {
    const redis = getRedis();
    if (!redis) return;

    const todayLossKey = `player:${userId}:dailyLoss`;
    await redis.incrby(todayLossKey, loss);

    // Set expiry for end of day
    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const ttl = Math.floor((endOfDay - now) / 1000);
    await redis.expire(todayLossKey, ttl);
  }
}

module.exports = { WalletService };
