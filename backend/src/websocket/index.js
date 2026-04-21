/**
 * WebSocket Event Handlers
 */

const jwt = require("jsonwebtoken");
const constants = require("../core/constants");
const config = require("../core/config");

/**
 * Initialize WebSocket handlers
 * @param {Server} io - Socket.IO server instance
 * @param {Object} services - Service instances
 */
function initializeWebSocket(io, services) {
  const { gameService, walletService, leaderboardService } = services;

  // Authentication middleware for WebSocket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user.userId;
    console.log(`[WS] Player connected: ${userId}`);

    // Join player's personal room for targeted messages
    socket.join(userId);

    // Send initial game state
    if (gameService) {
      const gameState = gameService.getGameState();
      socket.emit(constants.WS_EVENTS.GAME_STATE, {
        type: constants.WS_EVENTS.GAME_STATE,
        roundId: gameState?.roundId,
        phase: gameState?.phase,
        timeLeft: config.game.bettingDuration,
      });
    }

    // Send player balance
    if (walletService) {
      const balance = await walletService.getBalance(userId);
      socket.emit(constants.WS_EVENTS.WALLET_UPDATE, {
        type: constants.WS_EVENTS.WALLET_UPDATE,
        balance,
        change: "0",
      });
    }

    // Handle PLACE_BET event
    socket.on(constants.WS_EVENTS.PLACE_BET, async (data) => {
      try {
        const { choice, amount } = data;

        if (!gameService) {
          socket.emit(constants.WS_EVENTS.BET_REJECTED, {
            type: constants.WS_EVENTS.BET_REJECTED,
            reason: "Game service unavailable",
          });
          return;
        }

        const result = await gameService.placeBet(userId, choice, amount);

        if (result.success) {
          socket.emit(constants.WS_EVENTS.BET_ACCEPTED, {
            type: constants.WS_EVENTS.BET_ACCEPTED,
            status: result.status,
          });

          // Update balance
          if (walletService) {
            const balance = await walletService.getBalance(userId);
            socket.emit(constants.WS_EVENTS.WALLET_UPDATE, {
              type: constants.WS_EVENTS.WALLET_UPDATE,
              balance,
              change: `-${amount}`,
            });
          }
        } else {
          socket.emit(constants.WS_EVENTS.BET_REJECTED, {
            type: constants.WS_EVENTS.BET_REJECTED,
            reason: result.reason,
          });
        }
      } catch (error) {
        console.error(`[WS] Place bet error: ${error.message}`);
        socket.emit(constants.WS_EVENTS.BET_REJECTED, {
          type: constants.WS_EVENTS.BET_REJECTED,
          reason: "Internal error",
        });
      }
    });

    // Handle JOIN_GAME event
    socket.on(constants.WS_EVENTS.JOIN_GAME, () => {
      console.log(`[WS] Player joined game: ${userId}`);

      if (gameService) {
        const gameState = gameService.getGameState();
        socket.emit(constants.WS_EVENTS.GAME_STATE, {
          type: constants.WS_EVENTS.GAME_STATE,
          roundId: gameState?.roundId,
          phase: gameState?.phase,
          timeLeft: config.game.bettingDuration,
        });
      }
    });

    // Handle CLAIM_REWARD event
    socket.on(constants.WS_EVENTS.CLAIM_REWARD, async () => {
      try {
        // Check if player qualifies for bonus
        // In production, check Redis for bonus eligibility

        const bonusAmount = Math.floor(Math.random() * 50) + 10;

        if (walletService) {
          await walletService.addToBalance(userId, bonusAmount);
          const balance = await walletService.getBalance(userId);

          socket.emit(constants.WS_EVENTS.WALLET_UPDATE, {
            type: constants.WS_EVENTS.WALLET_UPDATE,
            balance,
            change: `+${bonusAmount}`,
          });
        }

        console.log(`[WS] Bonus claimed: ${userId} - ${bonusAmount}`);
      } catch (error) {
        console.error(`[WS] Claim reward error: ${error.message}`);
      }
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(`[WS] Player disconnected: ${userId} - ${reason}`);
    });
  });
}

module.exports = { initializeWebSocket };
