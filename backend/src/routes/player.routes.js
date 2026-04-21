/**
 * Player Routes
 */

const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const config = require("../core/config");
const constants = require("../core/constants");

const router = express.Router();

/**
 * GET /api/player/profile
 * Get player profile
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const walletService = req.app.get("walletService");

    let balance = config.wallet.initialBalance;
    if (walletService) {
      balance = await walletService.getBalance(user.userId);
    }

    res.json({
      user_id: user.userId,
      username: user.username,
      telegram_id: user.telegramId,
      balance,
      level: 1,
      win_streak: 0,
    });
  } catch (error) {
    console.error("[Player] Get profile error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

/**
 * GET /api/player/wallet
 * Get player wallet info
 */
router.get("/wallet", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const walletService = req.app.get("walletService");

    let balance = config.wallet.initialBalance;
    if (walletService) {
      balance = await walletService.getBalance(user.userId);
    }

    const transactions = walletService
      ? await walletService.getTransactionHistory(user.userId, 10)
      : [];

    res.json({
      balance,
      transactions,
    });
  } catch (error) {
    console.error("[Player] Get wallet error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

/**
 * POST /api/player/claim-daily-bonus
 * Claim daily login bonus
 */
router.post("/claim-daily-bonus", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const walletService = req.app.get("walletService");

    // Check if bonus already claimed today
    // In production, check Redis/DB for daily bonus status

    const bonusAmount = 100;

    if (walletService) {
      await walletService.addToBalance(user.userId, bonusAmount);
    }

    res.json({
      success: true,
      bonus: bonusAmount,
    });
  } catch (error) {
    console.error("[Player] Claim bonus error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

module.exports = router;
