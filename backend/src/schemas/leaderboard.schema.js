/**
 * Leaderboard Schema - Request/Response validation using Zod
 */

const z = require("zod");

// ============================================
// REQUEST SCHEMAS
// ============================================

// No POST requests for leaderboard (read-only)

// ============================================
// RESPONSE SCHEMAS
// ============================================

/**
 * Leaderboard Entry
 */
const leaderboardEntry = z.object({
  rank: z.number(),
  userId: z.string(),
  username: z.string(),
  coins: z.number(),
});

/**
 * Global Leaderboard Response
 */
const globalLeaderboardResponse = z.object({
  leaderboard: z.array(leaderboardEntry),
});

/**
 * Daily Leaderboard Response
 */
const dailyLeaderboardResponse = z.object({
  leaderboard: z.array(leaderboardEntry),
});

/**
 * My Rank Response
 */
const myRankResponse = z.object({
  rank: z.number().nullable(),
  around: z.array(
    leaderboardEntry.extend({
      isCurrentPlayer: z.boolean(),
    }),
  ),
});

module.exports = {
  // Response schemas
  leaderboardEntry,
  globalLeaderboardResponse,
  dailyLeaderboardResponse,
  myRankResponse,
};
