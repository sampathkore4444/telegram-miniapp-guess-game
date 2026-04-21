/**
 * Leaderboard Routes
 */

const express = require("express");
const {
  authMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/auth.middleware");
const constants = require("../core/constants");

const router = express.Router();

/**
 * GET /api/leaderboard/global
 * Get global leaderboard
 */
router.get("/global", optionalAuthMiddleware, async (req, res) => {
  try {
    const leaderboardService = req.app.get("leaderboardService");

    let entries = [];
    if (leaderboardService) {
      entries = await leaderboardService.getTopPlayers(100);
    }

    res.json({
      leaderboard: entries,
    });
  } catch (error) {
    console.error("[Leaderboard] Get global error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

/**
 * GET /api/leaderboard/daily
 * Get daily leaderboard
 */
router.get("/daily", optionalAuthMiddleware, async (req, res) => {
  try {
    const leaderboardService = req.app.get("leaderboardService");

    let entries = [];
    if (leaderboardService) {
      entries = await leaderboardService.getDailyLeaderboard();
    }

    res.json({
      leaderboard: entries,
    });
  } catch (error) {
    console.error("[Leaderboard] Get daily error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

/**
 * GET /api/leaderboard/me
 * Get current player's rank
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const leaderboardService = req.app.get("leaderboardService");

    let rank = null;
    let around = [];
    if (leaderboardService) {
      rank = await leaderboardService.getPlayerRank(user.userId);
      around = await leaderboardService.getPlayersAround(user.userId, 5);
    }

    res.json({
      rank,
      around,
    });
  } catch (error) {
    console.error("[Leaderboard] Get my rank error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

module.exports = router;
