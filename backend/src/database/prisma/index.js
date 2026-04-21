/**
 * Prisma Database Client
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

/**
 * Initialize database connection
 */
async function initializeDatabase() {
  try {
    await prisma.$connect();
    console.log("✓ PostgreSQL connected via Prisma");
    return prisma;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

/**
 * Disconnect database
 */
async function disconnectDatabase() {
  await prisma.$disconnect();
}

module.exports = {
  prisma,
  initializeDatabase,
  disconnectDatabase,
};
