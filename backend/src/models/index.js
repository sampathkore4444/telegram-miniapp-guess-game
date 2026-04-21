/**
 * Models Index
 * Export all database models
 */

const { UserModel } = require("./User");
const { GameRoundModel } = require("./GameRound");
const { BetModel } = require("./Bet");
const { TransactionModel } = require("./Transaction");

module.exports = {
  UserModel,
  GameRoundModel,
  BetModel,
  TransactionModel,
};
