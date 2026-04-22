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
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const prisma = req.app.get("prisma");
    if (!prisma) {
      return res.status(constants.HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        error: "Database not available",
      });
    }

    // Fetch user's bets with round info
    const bets = await prisma.bet.findMany({
      where: { userId: user.userId },
      include: {
        round: {
          select: {
            id: true,
            diceResult: true,
            createdAt: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
      take: limit,
      skip: offset,
    });

    // Transform to history format
    const history = bets.map((bet) => ({
      round: bet.roundId,
      result: bet.choice,
      dice: bet.round?.diceResult || 0,
      profit:
        bet.result === "WIN"
          ? bet.payout - bet.amount
          : bet.result === "LOSE"
            ? -bet.amount
            : 0,
      timestamp:
        bet.round?.createdAt?.toISOString() || bet.timestamp.toISOString(),
      status: bet.result || "PENDING",
    }));

    res.json({ history });
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
