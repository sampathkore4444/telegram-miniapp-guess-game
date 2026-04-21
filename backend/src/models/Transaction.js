/**
 * Transaction Model
 * Represents wallet transactions
 */

const { prisma } = require("../database/prisma");

class TransactionModel {
  /**
   * Create a new transaction
   * @param {Object} data - Transaction data
   * @returns {Promise<Object>} Created transaction
   */
  static async create(data) {
    return await prisma.transaction.create({
      data: {
        userId: data.userId,
        roundId: data.roundId || null,
        amount: data.amount,
        type: data.type,
        balanceAfter: data.balanceAfter,
      },
    });
  }

  /**
   * Find transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Transaction or null
   */
  static async findById(id) {
    return await prisma.transaction.findUnique({
      where: { id },
    });
  }

  /**
   * Get transactions by user ID
   * @param {string} userId - User ID
   * @param {number} limit - Number of transactions
   * @returns {Promise<Array>} Transactions
   */
  static async findByUserId(userId, limit = 20) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }

  /**
   * Get transactions by type
   * @param {string} userId - User ID
   * @param {string} type - Transaction type
   * @param {number} limit - Number of transactions
   * @returns {Promise<Array>} Transactions
   */
  static async findByType(userId, type, limit = 20) {
    return await prisma.transaction.findMany({
      where: {
        userId,
        type,
      },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }

  /**
   * Get user's total winnings
   * @param {string} userId - User ID
   * @returns {Promise<number>} Total winnings
   */
  static async getTotalWinnings(userId) {
    const result = await prisma.transaction.aggregate({
      where: {
        userId,
        type: "WIN",
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }

  /**
   * Get user's total losses
   * @param {string} userId - User ID
   * @returns {Promise<number>} Total losses
   */
  static async getTotalLosses(userId) {
    const result = await prisma.transaction.aggregate({
      where: {
        userId,
        type: "LOSE",
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }

  /**
   * Get transactions in date range
   * @param {string} userId - User ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Transactions
   */
  static async getByDateRange(userId, startDate, endDate) {
    return await prisma.transaction.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: "desc" },
    });
  }

  /**
   * Get recent transactions (all users)
   * @param {number} limit - Number of transactions
   * @returns {Promise<Array>} Transactions
   */
  static async getRecent(limit = 20) {
    return await prisma.transaction.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }

  /**
   * Delete transaction
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Deleted transaction
   */
  static async delete(id) {
    return await prisma.transaction.delete({
      where: { id },
    });
  }
}

module.exports = { TransactionModel };
