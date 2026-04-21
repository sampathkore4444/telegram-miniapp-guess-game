/**
 * GamePage Component
 * Main game interface with professional UI
 */

import React, { useState } from "react";
import { useGame } from "../hooks/useGame";
import DiceArea from "../components/game/DiceArea";
import ChoiceButtons from "../components/game/ChoiceButtons";
import BetSelector from "../components/game/BetSelector";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

function GamePage() {
  const { gameState, balance, myBet, placeBet } = useGame();
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handlePlaceBet = (choice) => {
    const result = placeBet(selectedAmount, choice);
    if (result.success) {
      setSelectedChoice(choice);
    }
  };

  // Get phase info
  const getPhaseInfo = () => {
    switch (gameState.phase) {
      case "OPEN_BETS":
        return { text: "🎯 Place Your Bet!", color: "text-green-400" };
      case "LOCKED":
        return { text: "🔒 Bets Closed", color: "text-red-400" };
      case "ROLLING":
        return { text: "🎲 Rolling...", color: "text-gold-500" };
      case "RESULT_CALCULATED":
        return {
          text: "🎉 Result: " + (gameState.winner || ""),
          color: "text-gold-500",
        };
      case "SETTLEMENT":
        return { text: "💰 Settling...", color: "text-green-400" };
      default:
        return { text: "⏳ Waiting...", color: "text-gray-400" };
    }
  };

  const phaseInfo = getPhaseInfo();

  // Mock data
  const historyData = [
    { round: 1234, result: "BIG", dice: 6, profit: 100 },
    { round: 1233, result: "SMALL", dice: 3, profit: -50 },
    { round: 1232, result: "BIG", dice: 5, profit: 100 },
    { round: 1231, result: "SMALL", dice: 2, profit: 200 },
    { round: 1230, result: "BIG", dice: 4, profit: -100 },
  ];

  const leaderboardData = [
    { rank: 1, username: "Player123", profit: 15420 },
    { rank: 2, username: "LuckyDice", profit: 12350 },
    { rank: 3, username: "BigWinner", profit: 10890 },
    { rank: 4, username: "You", profit: 4520 },
    { rank: 5, username: "ProGamer", profit: 3200 },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <header className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🎲</span>
            <h1 className="text-xl font-bold gradient-text">BIG/SMALL</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="gold" className="text-xs">
              VIP 1
            </Badge>
            <div className="bg-dark-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="text-gold-500">💰</span>
              <span className="text-white font-semibold">
                {balance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full gap-4">
        {/* Phase Indicator */}
        <Card variant="glass" className="text-center py-3">
          <div
            className={`text-lg font-bold ${phaseInfo.color} ${gameState.phase === "ROLLING" ? "animate-pulse" : ""}`}
          >
            {phaseInfo.text}
          </div>
        </Card>

        {/* Dice Area */}
        <Card
          variant="default"
          className="flex-1 flex flex-col items-center justify-center py-8 min-h-[280px]"
        >
          <DiceArea
            diceValue={gameState.diceValue}
            phase={gameState.phase}
            winner={gameState.winner}
          />

          {/* Timer */}
          {gameState.phase === "OPEN_BETS" && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-gray-400 text-sm">Bets close in</span>
              <span className="text-4xl font-bold text-gold-500 tabular-nums">
                {gameState.timeLeft}
              </span>
              <span className="text-gray-400 text-sm">s</span>
            </div>
          )}
        </Card>

        {/* Selected Amount Display */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Selected Bet:{" "}
            <span className="text-white font-bold text-xl">
              {selectedAmount}
            </span>
          </p>
        </div>

        {/* Bet Selector */}
        <Card variant="glass" className="py-4">
          <div className="text-center mb-3">
            <span className="text-gray-400 text-sm uppercase tracking-wider">
              Select Amount
            </span>
          </div>
          <BetSelector
            selectedAmount={selectedAmount}
            onSelectAmount={setSelectedAmount}
            disabled={gameState.phase !== "OPEN_BETS"}
          />
        </Card>

        {/* Choice Buttons */}
        <div className="mt-2">
          <ChoiceButtons
            onBet={handlePlaceBet}
            disabled={
              gameState.phase !== "OPEN_BETS" || myBet?.status === "pending"
            }
            selectedChoice={selectedChoice}
          />
        </div>

        {/* My Bet */}
        {myBet && (
          <Card
            variant={myBet.status === "WIN" ? "highlight" : "default"}
            className="mt-2 animate-scaleIn"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">
                  Your Bet
                </p>
                <p className="text-xl font-bold text-white mt-1">
                  {myBet.choice === "BIG" ? "🔴 BIG" : "🔵 SMALL"}
                  <span className="text-gold-500 ml-2">{myBet.amount}</span>
                </p>
              </div>
              <Badge
                variant={
                  myBet.status === "pending"
                    ? "warning"
                    : myBet.status === "WIN"
                      ? "success"
                      : "error"
                }
                className="text-lg px-4 py-2"
              >
                {myBet.status === "pending"
                  ? "⏳ Pending"
                  : myBet.status === "WIN"
                    ? "🎉 WIN!"
                    : "❌ LOSE"}
              </Badge>
            </div>
          </Card>
        )}

        {/* Results */}
        <Card variant="glass" className="mt-auto pt-4">
          <div className="text-center mb-3">
            <span className="text-gray-400 text-xs uppercase tracking-wider">
              Recent
            </span>
          </div>
          <div className="flex justify-center gap-2">
            {["BIG", "SMALL", "BIG", "SMALL", "BIG"].map((r, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${r === "BIG" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}
              >
                {r === "BIG" ? "B" : "S"}
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-dark-800/80 backdrop-blur-md border-t border-dark-700 py-3">
        <div className="max-w-md mx-auto px-4 flex justify-center gap-6 text-sm">
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1 text-gray-400 hover:text-gold-500"
          >
            📊 History
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-1 text-gray-400 hover:text-gold-500"
          >
            👥 Leaderboard
          </button>
          <button className="flex items-center gap-1 text-gray-400 hover:text-gold-500">
            ⚙️ Settings
          </button>
        </div>
      </footer>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
          <div className="bg-dark-800 w-full max-w-md rounded-t-3xl p-6 animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">📊 History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {historyData.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-dark-700 rounded-lg"
                >
                  <div>
                    <span className="text-gray-400 text-sm">#{item.round}</span>
                    <p
                      className={`font-bold ${item.result === "BIG" ? "text-red-400" : "text-blue-400"}`}
                    >
                      {item.result} ({item.dice})
                    </p>
                  </div>
                  <span
                    className={`font-bold ${item.profit >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {item.profit >= 0 ? "+" : ""}
                    {item.profit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
          <div className="bg-dark-800 w-full max-w-md rounded-t-3xl p-6 animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">👥 Leaderboard</h2>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {leaderboardData.map((player, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-3 rounded-lg ${player.username === "You" ? "bg-gold-500/20 border border-gold-500/30" : "bg-dark-700"}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-600" : "bg-dark-600"}`}
                    >
                      {player.rank}
                    </span>
                    <span
                      className={
                        player.username === "You"
                          ? "text-gold-500"
                          : "text-white"
                      }
                    >
                      {player.username}
                    </span>
                  </div>
                  <span className="text-green-400 font-bold">
                    +{player.profit.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;
