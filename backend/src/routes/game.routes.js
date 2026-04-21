/**
 * Game Routes
 */

const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");

const constants = require("../core/constants");

const router = express.Router();

/**
 * GET /api/game/state
 * Get current game state
 */
router.get("/state", authMiddleware, async (req, res) => {
  try {
    const gameService = req.app.get("gameService");

    if (!gameService) {
      return res.status(constants.HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        error: "Game service not available",
      });
    }

    const gameState = gameService.getGameState();

    res.json({
      roundId: gameState?.roundId,
      phase: gameState?.phase,
      totalPool: gameState?.totalPool,
      playerCount: gameState?.playerCount,
    });
  } catch (error) {
    console.error("[Game] Get state error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

/**
 * GET /api/game/history
 * Get player's game history
 */
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const { limit = 20, offset = 0 } = req.query;

    // In production, fetch from database
    const history = [];

    res.json({
      history,
    });
  } catch (error) {
    console.error("[Game] Get history error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

/**
 * POST /api/game/place-bet
 * Place a bet (HTTP fallback for WebSocket)
 */
router.post("/place-bet", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const { choice, amount } = req.body;
    const gameService = req.app.get("gameService");

    if (!gameService) {
      return res.status(constants.HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        error: "Game service not available",
      });
    }

    const result = await gameService.placeBet(user.userId, choice, amount);

    if (!result.success) {
      return res.status(constants.HTTP_STATUS.BAD_REQUEST).json({
        error: result.reason,
      });
    }

    res.json({
      status: result.status,
    });
  } catch (error) {
    console.error("[Game] Place bet error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

module.exports = router;
