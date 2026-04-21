/**
 * Auth Routes
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const config = require("../core/config");
const constants = require("../core/constants");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * POST /api/auth/telegram-login
 * Login with Telegram initData
 */
router.post("/telegram-login", async (req, res) => {
  try {
    const { initData } = req.body;

    if (!initData) {
      return res.status(constants.HTTP_STATUS.BAD_REQUEST).json({
        error: "initData is required",
      });
    }

    // Parse initData (simplified - in production, verify with Telegram)
    const params = new URLSearchParams(initData);
    const userData = JSON.parse(params.get("user") || "{}");

    const telegramId = parseInt(params.get("user_id"));
    const username = userData.first_name || "Player";

    if (!telegramId) {
      return res.status(constants.HTTP_STATUS.BAD_REQUEST).json({
        error: "Invalid Telegram data",
      });
    }

    // Generate JWT token
    const userId = uuidv4();
    const token = jwt.sign(
      {
        userId,
        telegramId,
        username,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );

    // Return user data (balance will be fetched from Redis/DB)
    res.json({
      user_id: userId,
      username,
      wallet_balance: config.wallet.initialBalance,
      session_token: token,
    });
  } catch (error) {
    console.error("[Auth] Login error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

/**
 * POST /api/auth/refresh-token
 * Refresh JWT token
 */
router.post("/refresh-token", authMiddleware, async (req, res) => {
  try {
    const { user } = req;

    const newToken = jwt.sign(
      {
        userId: user.userId,
        telegramId: user.telegramId,
        username: user.username,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );

    res.json({
      token: newToken,
    });
  } catch (error) {
    console.error("[Auth] Token refresh error:", error);
    res.status(constants.HTTP_STATUS.INTERNAL_ERROR).json({
      error: constants.ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify token validity
 */
router.get("/verify", authMiddleware, async (req, res) => {
  const { user } = req;

  res.json({
    valid: true,
    user: {
      userId: user.userId,
      username: user.username,
      telegramId: user.telegramId,
    },
  });
});

module.exports = router;
