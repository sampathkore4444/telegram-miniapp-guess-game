/**
 * GameRound Model
 * Represents a game round
 */

const { prisma } = require("../database/prisma");

class GameRoundModel {
  /**
   * Create a new game round
   * @param {Object} data - Round data
   * @returns {Promise<Object>} Created round
   */
  static async create(data) {
    return await prisma.gameRound.create({
      data: {
        id: data.id,
        phase: data.phase || "OPEN_BETS",
        diceResult: data.diceResult || null,
        totalPool: data.totalPool || 0,
        bigBets: data.bigBets || 0,
        smallBets: data.smallBets || 0,
        playerCount: data.playerCount || 0,
      },
    });
  }

  /**
   * Find round by ID
   * @param {string} id - Round ID
   * @returns {Promise<Object>} Round or null
   */
  static async findById(id) {
    return await prisma.gameRound.findUnique({
      where: { id },
    });
  }

  /**
   * Update round phase
   * @param {string} id - Round ID
   * @param {string} phase - New phase
   * @returns {Promise<Object>} Updated round
   */
  static async updatePhase(id, phase) {
    return await prisma.gameRound.update({
      where: { id },
      data: { phase },
    });
  }

  /**
   * Update round result
   * @param {string} id - Round ID
   * @param {number} diceResult - Dice result
   * @returns {Promise<Object>} Updated round
   */
  static async updateResult(id, diceResult) {
    return await prisma.gameRound.update({
      where: { id },
      data: {
        diceResult,
        phase: "RESULT_CALCULATED",
      },
    });
  }

  /**
   * Update round pool
   * @param {string} id - Round ID
   * @param {Object} pool - Pool data
   * @returns {Promise<Object>} Updated round
   */
  static async updatePool(id, pool) {
    return await prisma.gameRound.update({
      where: { id },
      data: {
        totalPool: pool.totalPool,
        bigBets: pool.bigBets,
        smallBets: pool.smallBets,
        playerCount: pool.playerCount,
      },
    });
  }

  /**
   * Close round
   * @param {string} id - Round ID
   * @returns {Promise<Object>} Updated round
   */
  static async close(id) {
    return await prisma.gameRound.update({
      where: { id },
      data: {
        phase: "CLOSED",
        closedAt: new Date(),
      },
    });
  }

  /**
   * Get recent rounds
   * @param {number} limit - Number of rounds
   * @returns {Promise<Array>} Rounds
   */
  static async getRecent(limit = 20) {
    return await prisma.gameRound.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Delete round
   * @param {string} id - Round ID
   * @returns {Promise<Object>} Deleted round
   */
  static async delete(id) {
    return await prisma.gameRound.delete({
      where: { id },
    });
  }
}

module.exports = { GameRoundModel };
