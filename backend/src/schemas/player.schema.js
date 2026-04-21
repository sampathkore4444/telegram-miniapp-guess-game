/**
 * Player Schema - Request/Response validation using Zod
 */

const z = require("zod");

// ============================================
// REQUEST SCHEMAS
// ============================================

// No POST requests for player (read-only personal data)

// ============================================
// RESPONSE SCHEMAS
// ============================================

/**
 * Profile Response
 */
const profileResponse = z.object({
  user_id: z.string(),
  username: z.string(),
  telegram_id: z.number(),
  balance: z.number(),
  level: z.number(),
  win_streak: z.number(),
});

/**
 * Wallet Response
 */
const walletResponse = z.object({
  balance: z.number(),
  transactions: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      roundId: z.string().nullable(),
      amount: z.number(),
      type: z.string(),
      balanceAfter: z.number(),
      timestamp: z.string(),
    }),
  ),
});

/**
 * Claim Daily Bonus Response
 */
const claimDailyBonusResponse = z.object({
  success: z.boolean(),
  bonus: z.number(),
});

module.exports = {
  // Response schemas
  profileResponse,
  walletResponse,
  claimDailyBonusResponse,
};
