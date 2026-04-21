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
import Loader from "../components/ui/Loader";

function GamePage() {
  const { gameState, balance, myBet, placeBet, updateGameState } = useGame();
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [selectedChoice, setSelectedChoice] = useState(null);

  // Simulate game state for demo
  useEffect(() => {
    updateGameState({
      phase: "OPEN_BETS",
      roundId: "demo_round",
      timeLeft: 8,
      diceValue: null,
      winner: null,
    });
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
        return { text: "Place Your Bet", color: "text-green-400" };
      case "LOCKED":
        return { text: "Bets Closed", color: "text-red-400" };
      case "ROLLING":
        return { text: "Rolling...", color: "text-gold-500" };
      case "RESULT_CALCULATED":
        return { text: "Result", color: "text-gold-500" };
      default:
        return { text: "Waiting...", color: "text-gray-400" };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <header className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎲</span>
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
            className={`text-lg font-bold ${phaseInfo.color} flex items-center justify-center gap-2`}
          >
            {gameState.phase === "ROLLING" && <Loader type="dots" size="sm" />}
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

        {/* Bet Amount Selection */}
        <Card variant="glass" className="py-4">
          <div className="text-center mb-3">
            <span className="text-gray-400 text-sm uppercase tracking-wider">
              Bet Amount
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
            {["BIG", "SMALL", "BIG", "SMALL", "SMALL"].map((result, i) => (
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
        <div className="max-w-md mx-auto px-4 flex justify-center gap-6 text-sm text-gray-500">
          <button className="hover:text-gold-500 transition-colors">
            📊 History
          </button>
          <button className="hover:text-gold-500 transition-colors">
            👥 Leaderboard
          </button>
          <button className="hover:text-gold-500 transition-colors">
            ⚙️ Settings
          </button>
        </div>
      </footer>
    </div>
  );
}

export default GamePage;
