/**
 * Schemas Index
 * Export all request/response schemas
 */

const authSchemas = require("./auth.schema");
const gameSchemas = require("./game.schema");
const playerSchemas = require("./player.schema");
const leaderboardSchemas = require("./leaderboard.schema");

module.exports = {
  ...authSchemas,
  ...gameSchemas,
  ...playerSchemas,
  ...leaderboardSchemas,
};
