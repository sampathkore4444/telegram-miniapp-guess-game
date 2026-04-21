/**
 * Game Schema - Request/Response validation using Zod
 */

const z = require("zod");

// ============================================
// REQUEST SCHEMAS
// ============================================

/**
 * Place Bet Request
 */
const placeBetRequest = z.object({
  choice: z.enum(["BIG", "SMALL"], {
    errorMap: () => ({ message: "Choice must be BIG or SMALL" }),
  }),
  amount: z
    .number()
    .int()
    .min(50)
    .max(1000, "Bet amount must be between 50 and 1000"),
});

// ============================================
// RESPONSE SCHEMAS
// ============================================

/**
 * Game State Response
 */
const gameStateResponse = z.object({
  roundId: z.number().nullable(),
  phase: z.string(),
  totalPool: z.number().nullable(),
  playerCount: z.number().nullable(),
});

/**
 * Bet Accepted Response
 */
const betAcceptedResponse = z.object({
  status: z.literal("bet_accepted"),
});

/**
 * Bet Rejected Response
 */
const betRejectedResponse = z.object({
  type: z.literal("BET_REJECTED"),
  reason: z.string(),
});

/**
 * Dice Result Response
 */
const diceResultResponse = z.object({
  type: z.literal("DICE_RESULT"),
  dice: z.number().min(1).max(6),
  winner: z.enum(["BIG", "SMALL"]),
});

/**
 * Bet Settlement Response
 */
const betSettlementResponse = z.object({
  type: z.literal("BET_SETTLEMENT"),
  amount: z.number(),
  reward: z.number(),
  result: z.enum(["WIN", "LOSE"]),
});

/**
 * Game History Response
 */
const gameHistoryResponse = z.object({
  history: z.array(
    z.object({
      round_id: z.number(),
      choice: z.string(),
      amount: z.number(),
      result: z.string().nullable(),
      payout: z.number(),
    }),
  ),
});

module.exports = {
  // Request schemas
  placeBetRequest,
  // Response schemas
  gameStateResponse,
  betAcceptedResponse,
  betRejectedResponse,
  diceResultResponse,
  betSettlementResponse,
  gameHistoryResponse,
};
