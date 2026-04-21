/**
 * GamePage Component
 * Main game interface with professional UI
 */

import React, { useState, useEffect } from "react";
import { useGame } from "../hooks/useGame";
import DiceArea from "../components/game/DiceArea";
import ChoiceButtons from "../components/game/ChoiceButtons";
import BetSelector from "../components/game/BetSelector";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

function GamePage() {
  const { gameState, balance, myBet, placeBet, updateGameState } = useGame();
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Demo game loop
  useEffect(() => {
    // Initial state: OPEN_BETS
    updateGameState({
      phase: "OPEN_BETS",
      roundId: "demo_round",
      timeLeft: 8,
      diceValue: null,
      winner: null,
    });

    // After 5 seconds, start betting countdown
    const timer1 = setTimeout(() => {
      updateGameState({ timeLeft: 5 });
    }, 3000);

    // After 8 seconds, close bets
    const timer2 = setTimeout(() => {
      updateGameState({ phase: "LOCKED", timeLeft: 0 });
    }, 5000);

    // After 9 seconds, start rolling
    const timer3 = setTimeout(() => {
      updateGameState({ phase: "ROLLING" });
    }, 6000);

    // After 10 seconds, show result
    const timer4 = setTimeout(() => {
      const resultDice = Math.floor(Math.random() * 6) + 1;
      const resultWinner = resultDice <= 3 ? "SMALL" : "BIG";
      updateGameState({
        phase: "RESULT_CALCULATED",
        diceValue: resultDice,
        winner: resultWinner,
        timeLeft: 0,
      });
    }, 8000);

    // After 12 seconds, settlement
    const timer5 = setTimeout(() => {
      updateGameState({ phase: "SETTLEMENT" });
    }, 10000);

    // After 14 seconds, new round
    const timer6 = setTimeout(() => {
      updateGameState({
        phase: "OPEN_BETS",
        roundId: "demo_round_2",
        timeLeft: 8,
        diceValue: null,
        winner: null,
      });
      setSelectedChoice(null);
    }, 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [updateGameState]);

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
        return { text: "🎲 Rolling...", color: "text-gold-500 animate-pulse" };
      case "RESULT_CALCULATED":
        return {
          text: "🎉 Result: " + (gameState.winner || ""),
          color: "text-gold-500",
        };
      case "SETTLEMENT":
        return { text: "💰 Settling Bets...", color: "text-green-400" };
      default:
        return { text: "⏳ Waiting...", color: "text-gray-400" };
    }
  };

  const phaseInfo = getPhaseInfo();

  // Mock history data
  const historyData = [
    { round: 1234, result: "BIG", dice: 6, profit: 100 },
    { round: 1233, result: "SMALL", dice: 3, profit: -50 },
    { round: 1232, result: "BIG", dice: 5, profit: 100 },
    { round: 1231, result: "SMALL", dice: 2, profit: 200 },
    { round: 1230, result: "BIG", dice: 4, profit: -100 },
  ];

  // Mock leaderboard data
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
          <div className={`text-lg font-bold ${phaseInfo.color}`}>
            <span>{phaseInfo.text}</span>
          </div>
        </Card>

        {/* Dice Area - Main Focus */}
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

        {/* Selected Bet Amount */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Selected Bet:{" "}
            <span className="text-white font-bold text-xl">
              {selectedAmount}
            </span>
          </p>
        </div>

        {/* Bet Amount Selection */}
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

        {/* My Bet Status */}
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

        {/* Game History - Last Results */}
        <Card variant="glass" className="mt-auto pt-4">
          <div className="text-center mb-3">
            <span className="text-gray-400 text-xs uppercase tracking-wider">
              Recent Results
            </span>
          </div>
          <div className="flex justify-center gap-2">
            {["BIG", "SMALL", "BIG", "SMALL", "BIG"].map((result, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  result === "BIG"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {result === "BIG" ? "B" : "S"}
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
            className="flex items-center gap-1 text-gray-400 hover:text-gold-500 transition-colors"
          >
            📊 <span>History</span>
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-1 text-gray-400 hover:text-gold-500 transition-colors"
          >
            👥 <span>Leaderboard</span>
          </button>
          <button className="flex items-center gap-1 text-gray-400 hover:text-gold-500 transition-colors">
            ⚙️ <span>Settings</span>
          </button>
        </div>
      </footer>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center animate-fadeIn">
          <div className="bg-dark-800 w-full max-w-md rounded-t-3xl p-6 animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">📊 Bet History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {historyData.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-dark-700 rounded-lg"
                >
                  <div>
                    <span className="text-gray-400 text-sm">
                      Round #{item.round}
                    </span>
                    <p
                      className={`font-bold ${item.result === "BIG" ? "text-red-400" : "text-blue-400"}`}
                    >
                      {item.result} (🎲{item.dice})
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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center animate-fadeIn">
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
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    player.username === "You"
                      ? "bg-gold-500/20 border border-gold-500/30"
                      : "bg-dark-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        i === 0
                          ? "bg-yellow-500 text-yellow-900"
                          : i === 1
                            ? "bg-gray-400 text-gray-900"
                            : i === 2
                              ? "bg-amber-600 text-white"
                              : "bg-dark-600 text-gray-400"
                      }`}
                    >
                      {player.rank}
                    </span>
                    <span
                      className={`font-medium ${player.username === "You" ? "text-gold-500" : "text-white"}`}
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
