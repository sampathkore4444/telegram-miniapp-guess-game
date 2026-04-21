/**
 * useGame Hook
 * Handles game state and actions
 */

import { useState, useEffect, useCallback } from "react";

export function useGame() {
  const [gameState, setGameState] = useState({
    phase: "INIT",
    roundId: null,
    timeLeft: 0,
    diceValue: null,
    winner: null,
  });
  const [balance, setBalance] = useState(1000);
  const [myBet, setMyBet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Place a bet
  const placeBet = useCallback(
    (amount, choice) => {
      if (gameState.phase !== "OPEN_BETS") {
        return { success: false, error: "Betting closed" };
      }
      if (balance < amount) {
        return { success: false, error: "Insufficient balance" };
      }

      // Deduct balance locally (optimistic)
      setBalance((prev) => prev - amount);
      setMyBet({ amount, choice, status: "pending" });

      return { success: true };
    },
    [gameState.phase, balance],
  );

  // Update game state from server
  const updateGameState = useCallback((newState) => {
    setGameState(newState);
  }, []);

  // Handle bet result
  const handleBetResult = useCallback((result) => {
    if (result.result === "WIN") {
      setBalance((prev) => prev + result.payout);
      setMyBet((prev) => ({ ...prev, status: "WIN", payout: result.payout }));
    } else {
      setMyBet((prev) => ({ ...prev, status: "LOSE" }));
    }
  }, []);

  return {
    gameState,
    balance,
    myBet,
    isConnected,
    placeBet,
    updateGameState,
    handleBetResult,
    setIsConnected,
  };
}

export default useGame;
