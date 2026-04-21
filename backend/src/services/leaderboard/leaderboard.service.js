/**
 * Leaderboard Service - Manages global and daily leaderboards
 */

const config = require("../../core/config");
const { getRedis } = require("../../database/redis");
const { prisma } = require("../../database/prisma");

class LeaderboardService {
  constructor() {
    this.refreshInterval = null;
    this.startPeriodicRefresh();
    console.log("[Leaderboard] Service initialized");
  }

  /**
   * Update player score in leaderboard
   * @param {string} userId - Player ID
   * @param {number} coins - Total coins
   * @param {string} username - Player username
   */
  async updateScore(userId, coins, username) {
    const redis = getRedis();
    if (!redis) return;

    const leaderboardKey = config.redisKeys.leaderboard;

    // Update score in sorted set
    await redis.zadd(leaderboardKey, coins, userId);

    // Store username for lookup
    await redis.hset(`${leaderboardKey}:usernames`, userId, username);
  }

  /**
   * Get top players
   * @param {number} count - Number of players to fetch
   * @returns {Array} Leaderboard entries
   */
  async getTopPlayers(count = 100) {
    const redis = getRedis();
    if (!redis) return [];

    const leaderboardKey = config.redisKeys.leaderboard;
    const entries = await redis.zrevrange(
      leaderboardKey,
      0,
      count - 1,
      "WITHSCORES",
    );

    const result = [];
    for (let i = 0; i < entries.length; i += 2) {
      const userId = entries[i];
      const score = parseInt(entries[i + 1]);
      const username = await redis.hget(`${leaderboardKey}:usernames`, userId);

      result.push({
        rank: Math.floor(i / 2) + 1,
        userId,
        username: username || "Unknown",
        coins: score,
      });
    }

    return result;
  }

  /**
   * Get player rank
   * @param {string} userId - Player ID
   * @returns {number} Player rank (1-based) or null if not found
   */
  async getPlayerRank(userId) {
    const redis = getRedis();
    if (!redis) return null;

    const leaderboardKey = config.redisKeys.leaderboard;
    const rank = await redis.zrevrank(leaderboardKey, userId);

    return rank !== null ? rank + 1 : null;
  }

  /**
   * Get player around a specific player
   * @param {string} userId - Player ID
   * @param {number} count - Number of players around
   * @returns {Array} Players around the target
   */
  async getPlayersAround(userId, count = 5) {
    const redis = getRedis();
    if (!redis) return [];

    const leaderboardKey = config.redisKeys.leaderboard;
    const userRank = await redis.zrevrank(leaderboardKey, userId);

    if (userRank === null) return [];

    const start = Math.max(0, userRank - count);
    const end = userRank + count;

    const entries = await redis.zrevrange(
      leaderboardKey,
      start,
      end,
      "WITHSCORES",
    );

    const result = [];
    for (let i = 0; i < entries.length; i += 2) {
      const uid = entries[i];
      const score = parseInt(entries[i + 1]);
      const username = await redis.hget(`${leaderboardKey}:usernames`, uid);

      result.push({
        rank: start + Math.floor(i / 2) + 1,
        userId: uid,
        username: username || "Unknown",
        coins: score,
        isCurrentPlayer: uid === userId,
      });
    }

    return result;
  }

  /**
   * Start periodic refresh (for daily snapshots)
   */
  startPeriodicRefresh() {
    this.refreshInterval = setInterval(async () => {
      await this.createDailySnapshot();
    }, config.leaderboard.refreshInterval);
  }

  /**
   * Create daily snapshot in database
   */
  async createDailySnapshot() {
    try {
      const topPlayers = await this.getTopPlayers(config.leaderboard.topCount);

      if (topPlayers.length > 0) {
        await prisma.dailyLeaderboard.create({
          data: {
            date: new Date(),
            topPlayers: JSON.stringify(topPlayers),
          },
        });
      }
    } catch (error) {
      console.error("[Leaderboard] Failed to create daily snapshot:", error);
    }
  }

  /**
   * Get daily leaderboard from database
   * @param {Date} date - Date for the snapshot
   * @returns {Array} Daily leaderboard
   */
  async getDailyLeaderboard(date = new Date()) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const snapshot = await prisma.dailyLeaderboard.findFirst({
        where: {
          date: {
            gte: startOfDay,
          },
        },
        orderBy: { date: "desc" },
      });

      if (snapshot) {
        return JSON.parse(snapshot.topPlayers);
      }

      return [];
    } catch (error) {
      console.error("[Leaderboard] Failed to get daily leaderboard:", error);
      return [];
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

module.exports = { LeaderboardService };
