/**
 * User Model
 * Represents a player in the game
 */

const { prisma } = require("../database/prisma");

class UserModel {
  /**
   * Create a new user
   * @param {Object} data - User data
   * @returns {Promise<Object>} Created user
   */
  static async create(data) {
    return await prisma.user.create({
      data: {
        telegramId: data.telegramId,
        username: data.username,
        totalCoins: data.totalCoins || 1000,
        level: data.level || 1,
      },
    });
  }

  /**
   * Find user by Telegram ID
   * @param {number} telegramId - Telegram user ID
   * @returns {Promise<Object>} User or null
   */
  static async findByTelegramId(telegramId) {
    return await prisma.user.findUnique({
      where: { telegramId },
    });
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User or null
   */
  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Update user coins
   * @param {string} id - User ID
   * @param {number} coins - New total coins
   * @returns {Promise<Object>} Updated user
   */
  static async updateCoins(id, coins) {
    return await prisma.user.update({
      where: { id },
      data: { totalCoins: coins },
    });
  }

  /**
   * Update user level
   * @param {string} id - User ID
   * @param {number} level - New level
   * @returns {Promise<Object>} Updated user
   */
  static async updateLevel(id, level) {
    return await prisma.user.update({
      where: { id },
      data: { level },
    });
  }

  /**
   * Get all users sorted by coins
   * @param {number} limit - Number of users
   * @returns {Promise<Array>} Users
   */
  static async getTopUsers(limit = 100) {
    return await prisma.user.findMany({
      orderBy: { totalCoins: "desc" },
      take: limit,
    });
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<Object>} Deleted user
   */
  static async delete(id) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}

module.exports = { UserModel };
