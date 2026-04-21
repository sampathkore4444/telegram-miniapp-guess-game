/**
 * Bet Model
 * Represents a bet in a game round
 */

const { prisma } = require("../database/prisma");

class BetModel {
  /**
   * Create a new bet
   * @param {Object} data - Bet data
   * @returns {Promise<Object>} Created bet
   */
  static async create(data) {
    return await prisma.bet.create({
      data: {
        roundId: data.roundId,
        userId: data.userId,
        amount: data.amount,
        choice: data.choice,
        payout: data.payout || 0,
        result: data.result || null,
      },
    });
  }

  /**
   * Find bet by ID
   * @param {string} id - Bet ID
   * @returns {Promise<Object>} Bet or null
   */
  static async findById(id) {
    return await prisma.bet.findUnique({
      where: { id },
    });
  }

  /**
   * Get bets by round ID
   * @param {string} roundId - Round ID
   * @returns {Promise<Array>} Bets
   */
  static async findByRoundId(roundId) {
    return await prisma.bet.findMany({
      where: { roundId },
    });
  }

  /**
   * Get bets by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Bets
   */
  static async findByUserId(userId) {
    return await prisma.bet.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });
  }

  /**
   * Get user's bet in a specific round
   * @param {string} roundId - Round ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Bet or null
   */
  static async findUserBetInRound(roundId, userId) {
    return await prisma.bet.findFirst({
      where: {
        roundId,
        userId,
      },
    });
  }

  /**
   * Update bet result
   * @param {string} id - Bet ID
   * @param {Object} result - Result data
   * @returns {Promise<Object>} Updated bet
   */
  static async updateResult(id, result) {
    return await prisma.bet.update({
      where: { id },
      data: {
        payout: result.payout,
        result: result.result,
      },
    });
  }

  /**
   * Get user bet history
   * @param {string} userId - User ID
   * @param {number} limit - Number of bets
   * @returns {Promise<Array>} Bets
   */
  static async getUserHistory(userId, limit = 20) {
    return await prisma.bet.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }

  /**
   * Get winning bets for a round
   * @param {string} roundId - Round ID
   * @returns {Promise<Array>} Winning bets
   */
  static async getWinningBets(roundId) {
    return await prisma.bet.findMany({
      where: {
        roundId,
        result: "WIN",
      },
    });
  }

  /**
   * Get total pool for a round
   * @param {string} roundId - Round ID
   * @returns {Promise<number>} Total amount
   */
  static async getTotalPool(roundId) {
    const bets = await prisma.bet.aggregate({
      where: { roundId },
      _sum: {
        amount: true,
      },
    });
    return bets._sum.amount || 0;
  }

  /**
   * Delete bet
   * @param {string} id - Bet ID
   * @returns {Promise<Object>} Deleted bet
   */
  static async delete(id) {
    return await prisma.bet.delete({
      where: { id },
    });
  }
}

module.exports = { BetModel };
