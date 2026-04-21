/**
 * BIG/SMALL Dice Game Backend
 * Main Entry Point
 */

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Core imports
const config = require("./core/config");
const constants = require("./core/constants");
const { initializeDatabase } = require("./database/prisma");
const { initializeRedis } = require("./database/redis");

// Routes imports
const authRoutes = require("./routes/auth.routes");
const gameRoutes = require("./routes/game.routes");
const playerRoutes = require("./routes/player.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");

// WebSocket imports
const { initializeWebSocket } = require("./websocket");

// Middleware imports
const { errorHandler } = require("./middleware/error.middleware");
const { authMiddleware } = require("./middleware/auth.middleware");

// Services imports
const { GameService } = require("./services/game/game.service");
const { WalletService } = require("./services/wallet/wallet.service");
const {
  LeaderboardService,
} = require("./services/leaderboard/leaderboard.service");

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: config.cors.origin,
    methods: ["GET", "POST"],
  },
});

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
});
app.use(limiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Error handling middleware
app.use(errorHandler);

// Initialize services singleton
let gameService;
let walletService;
let leaderboardService;

/**
 * Initialize all services and connections
 */
async function initializeApp() {
  try {
    // Initialize database
    await initializeDatabase();
    console.log("✓ Database connected");

    // Initialize Redis
    await initializeRedis();
    console.log("✓ Redis connected");

    // Initialize services
    gameService = new GameService(io);
    walletService = new WalletService();
    leaderboardService = new LeaderboardService();

    // Attach services to request for dependency injection
    app.set("gameService", gameService);
    app.set("walletService", walletService);
    app.set("leaderboardService", leaderboardService);

    // Initialize WebSocket handlers
    initializeWebSocket(io, { gameService, walletService, leaderboardService });

    console.log("✓ All services initialized");
  } catch (error) {
    console.error("Failed to initialize app:", error);
    process.exit(1);
  }
}

/**
 * Start the server
 */
async function startServer() {
  await initializeApp();

  httpServer.listen(config.port, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║     BIG/SMALL Dice Game Server Running              ║
╠═══════════════════════════════════════════════════════╣
║  Port: ${config.port}                                    ║
║  Mode: ${config.env}                                    ║
║  WS:  Socket.IO ${constants.SOCKET_IO_VERSION}                         ║
╚═══════════════════════════════════════════════════════╝
    `);
  });
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = { app, io };
