/**
 * Auth Schema - Request/Response validation using Zod
 */

const z = require("zod");

// ============================================
// REQUEST SCHEMAS
// ============================================

/**
 * Telegram Login Request
 */
const telegramLoginRequest = z.object({
  initData: z.string().min(1, "initData is required"),
});

// ============================================
// RESPONSE SCHEMAS
// ============================================

/**
 * Auth Response
 */
const authResponse = z.object({
  user_id: z.string(),
  username: z.string(),
  wallet_balance: z.number(),
  session_token: z.string(),
});

/**
 * Token Refresh Response
 */
const tokenRefreshResponse = z.object({
  token: z.string(),
});

/**
 * Verify Response
 */
const verifyResponse = z.object({
  valid: z.boolean(),
  user: z.object({
    userId: z.string(),
    username: z.string(),
    telegramId: z.number(),
  }),
});

module.exports = {
  // Request schemas
  telegramLoginRequest,
  // Response schemas
  authResponse,
  tokenRefreshResponse,
  verifyResponse,
};
