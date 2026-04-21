/**
 * useGame Hook
 * Handles game state and actions with demo mode
 */

import { useState, useCallback, useEffect, useRef } from "react";

export function useGame() {
  const [gameState, setGameState] = useState({
    phase: "OPEN_BETS",
    roundId: null,
    timeLeft: 8,
    diceValue: null,
    winner: null,
  });
  const [balance, setBalance] = useState(1000);
  const [myBet, setMyBet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const timersRef = useRef([]);

  // Demo mode - simulate full game cycle
  useEffect(() => {
    // Start demo after mount
    const startDemo = () => {
      // OPEN_BETS -> time countdown
      const timer1 = setTimeout(() => {
        setGameState((prev) => ({ ...prev, timeLeft: 6 }));
      }, 2000);

      const timer2 = setTimeout(() => {
        setGameState((prev) => ({ ...prev, timeLeft: 4 }));
      }, 4000);

      const timer3 = setTimeout(() => {
        setGameState((prev) => ({ ...prev, timeLeft: 2 }));
      }, 6000);

      // LOCKED phase
      const timer4 = setTimeout(() => {
        setGameState((prev) => ({ ...prev, phase: "LOCKED", timeLeft: 0 }));
      }, 8000);

      // ROLLING phase - triggers dice animation
      const timer5 = setTimeout(() => {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        const winnerRoll = diceRoll <= 3 ? "SMALL" : "BIG";
        setGameState((prev) => ({ ...prev, phase: "ROLLING" }));

        // After a delay, show result
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            phase: "RESULT_CALCULATED",
            diceValue: diceRoll,
            winner: winnerRoll,
          }));
        }, 2000);
      }, 10000);

      // SETTLEMENT and back to OPEN
      const timer6 = setTimeout(() => {
        setGameState((prev) => ({ ...prev, phase: "SETTLEMENT" }));
      }, 14000);

      const timer7 = setTimeout(() => {
        // Reset for new round
        setGameState({
          phase: "OPEN_BETS",
          roundId: "round_" + Date.now(),
          timeLeft: 8,
          diceValue: null,
          winner: null,
        });
        setMyBet(null);
        // Start cycle again
        startDemo();
      }, 16000);

      timersRef.current = [
        timer1,
        timer2,
        timer3,
        timer4,
        timer5,
        timer6,
        timer7,
      ];
    };

    // Start the demo
    startDemo();

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

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
    setGameState((prev) => ({ ...prev, ...newState }));
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
