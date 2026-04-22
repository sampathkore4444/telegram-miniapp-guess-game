/**
 * useGame Hook - Demo mode with proper game loop timers
 */

import { useState, useCallback, useEffect, useRef } from "react";

export function useGame() {
  const [gameState, setGameState] = useState({
    phase: "OPEN_BETS",
    roundId: "demo_1",
    timeLeft: 15,
    diceValue: null,
    winner: null,
  });

  const [balance, setBalance] = useState(1000);
  const [myBet, setMyBet] = useState(null);
  const [isConnected] = useState(true);

  // Use ref to track bet in intervals (avoids stale closure)
  const myBetRef = useRef(null);
  const balanceRef = useRef(1000);

  // Keep ref in sync with state
  useEffect(() => {
    myBetRef.current = myBet;
    if (myBet) {
      balanceRef.current = balance;
    }
  }, [myBet, balance]);

  // Game loop - uses ref to track state without causing re-renders in timer
  useEffect(() => {
    let currentDiceRoll = null;
    let currentWinner = null;
    const timers = [];

    // Main countdown timer - counts down every 1 second during OPEN_BETS
    const countdownTimer = setInterval(() => {
      setGameState((s) => {
        if (s.phase !== "OPEN_BETS") return s;

        const newTime = s.timeLeft - 1;
        if (newTime <= 0) {
          // Time's up - generate dice result
          currentDiceRoll = Math.floor(Math.random() * 6) + 1;
          currentWinner = currentDiceRoll <= 3 ? "SMALL" : "BIG";
          console.log(
            "🎲 Rolling! Dice:",
            currentDiceRoll,
            "Winner:",
            currentWinner,
          );
          return {
            ...s,
            phase: "ROLLING",
            timeLeft: 0,
            diceValue: currentDiceRoll,
            winner: currentWinner,
          };
        }
        return { ...s, timeLeft: newTime };
      });
    }, 1000);
    timers.push(countdownTimer);

    // Phase transition watcher - checks every 500ms for phase changes
    const phaseWatcher = setInterval(() => {
      setGameState((s) => {
        // ROLLING -> RESULT_CALCULATED after ~3s
        if (s.phase === "ROLLING" && s.diceValue) {
          console.log("Result:", s.diceValue, s.winner);
          return { ...s, phase: "RESULT_CALCULATED" };
        }
        // RESULT_CALCULATED -> SETTLEMENT after ~3s
        if (s.phase === "RESULT_CALCULATED") {
          return { ...s, phase: "SETTLEMENT" };
        }
        // SETTLEMENT -> Calculate winnings and new round
        if (s.phase === "SETTLEMENT") {
          // Use ref to get current bet value
          const currentBet = myBetRef.current;
          console.log("Settling bet:", currentBet, "Winner:", s.winner);
          if (currentBet && s.winner) {
            const playerWon = currentBet.choice === s.winner;
            if (playerWon) {
              balanceRef.current = balanceRef.current + currentBet.amount;
              setBalance(balanceRef.current);
              setMyBet({ ...currentBet, status: "WIN" });
              console.log("🎉 Won!", currentBet.amount);
            } else {
              setMyBet({ ...currentBet, status: "LOSE" });
              console.log("❌ Lost");
            }
          }
          console.log("New round starting...");
          setMyBet(null);
          return {
            phase: "OPEN_BETS",
            roundId: "demo_" + Date.now(),
            timeLeft: 15,
            diceValue: null,
            winner: null,
          };
        }
        return s;
      });
    }, 500);
    timers.push(phaseWatcher);

    return () => {
      timers.forEach((t) => clearInterval(t));
    };
  }, []);

  // Place bet
  const placeBet = useCallback(
    (amount, choice) => {
      if (gameState.phase !== "OPEN_BETS") {
        return { success: false, error: "Betting closed" };
      }
      if (balance < amount) {
        return { success: false, error: "Insufficient balance" };
      }

      setBalance((prev) => prev - amount);
      setMyBet({ amount, choice, status: "pending" });
      return { success: true };
    },
    [gameState.phase, balance],
  );

  const updateGameState = useCallback((newState) => {
    setGameState((prev) => ({ ...prev, ...newState }));
  }, []);

  return {
    gameState,
    balance,
    myBet,
    isConnected,
    placeBet,
    updateGameState,
    handleBetResult: () => {},
    setIsConnected: () => {},
  };
}

export default useGame;
