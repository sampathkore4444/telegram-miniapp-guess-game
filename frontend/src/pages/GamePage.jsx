import React from "react";
import { useGame } from "../hooks/useGame";
import DiceArea from "../components/game/DiceArea";
import ChoiceButtons from "../components/game/ChoiceButtons";
import BetSelector from "../components/game/BetSelector";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

/**
 * GamePage - Main game screen
 */
function GamePage() {
  const {
    gameState,
    balance,
    selectedBet,
    selectedChoice,
    setSelectedBet,
    setSelectedChoice,
    placeBet,
    isBettingOpen,
    isRolling,
  } = useGame();

  const handleRoll = () => {
    if (selectedChoice && selectedBet) {
      placeBet(selectedChoice, selectedBet);
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header - Balance & Level */}
      <Card className="mb-4 flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-gold-400">🎯</span>
          <span className="text-xl font-bold text-gold-400">
            {balance.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">🏆</span>
          <span className="text-gray-400">
            Level {gameState?.playerLevel || 1}
          </span>
        </div>
      </Card>

      {/* Dice Area */}
      <div className="flex-1 flex items-center justify-center">
        <DiceArea
          diceValue={gameState?.diceResult}
          phase={gameState?.phase}
          winner={gameState?.winner}
        />
      </div>

      {/* Timer */}
      {isBettingOpen && (
        <div className="text-center mb-4">
          <span className="text-4xl font-bold text-white">
            {gameState?.timeLeft || 0}
          </span>
        </div>
      )}

      {/* Choice Buttons */}
      <div className="mb-4">
        <ChoiceButtons
          selectedChoice={selectedChoice}
          onSelect={setSelectedChoice}
          disabled={!isBettingOpen}
        />
      </div>

      {/* Bet Selector */}
      <div className="mb-4">
        <BetSelector
          selectedBet={selectedBet}
          onSelect={setSelectedBet}
          disabled={!isBettingOpen}
        />
      </div>

      {/* Roll Button */}
      <Button
        variant="big"
        size="lg"
        fullWidth
        onClick={handleRoll}
        disabled={!isBettingOpen || !selectedChoice || !selectedBet}
      >
        {isRolling ? "🎲 Rolling..." : "▶ ROLL ◀"}
      </Button>

      {/* Result Message */}
      {gameState?.result && (
        <div
          className={`text-center mt-4 text-xl font-bold ${
            gameState.result === "WIN" ? "text-green-400" : "text-red-400"
          }`}
        >
          {gameState.result === "WIN"
            ? `🎉 You Won +${gameState.payout}!`
            : `❌ You Lost -${selectedBet}!`}
        </div>
      )}
    </div>
  );
}

export default GamePage;
