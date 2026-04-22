/**
 * useGame Hook - Simple game WITHOUT duplicates
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

  const myBetRef = useRef(null);
  const balanceRef = useRef(1000);
  const timersRef = useRef({});

  useEffect(() => {
    myBetRef.current = myBet;
    balanceRef.current = balance;
  }, [myBet, balance]);

  // Single game loop WITHOUT duplicates - uses phase transitions properly
  useEffect(() => {
    console.log("🔄 Game started");

    const tick = () => {
      setGameState((s) => {
        // Phase: OPEN_BETS - countdown
        if (s.phase === "OPEN_BETS") {
          if (s.timeLeft > 0) {
            return { ...s, timeLeft: s.timeLeft - 1 };
          } else {
            // Time's up - roll dice
            const dice = Math.floor(Math.random() * 6) + 1;
            const winner = dice <= 3 ? "SMALL" : "BIG";
            console.log("🎲 ROLLING!:", dice, winner);
            return {
              ...s,
              phase: "ROLLING",
              timeLeft: 0,
              diceValue: dice,
              winner,
            };
          }
        }

        // Phase: Rolling -> result after delay
        if (s.phase === "ROLLING" && !timersRef.current.resultPending) {
          timersRef.current.resultPending = true;
          setTimeout(() => {
            console.log("📊 RESULT:", s.diceValue, s.winner);
            setGameState((s2) => ({ ...s2, phase: "RESULT_CALCULATED" }));
          }, 3000);
        }

        // Phase: RESULT -> settlement after delay
        if (
          s.phase === "RESULT_CALCULATED" &&
          !timersRef.current.settlePending
        ) {
          timersRef.current.settlePending = true;
          setTimeout(() => {
            console.log("💰 SETTLEMENT");
            setGameState((s3) => ({ ...s3, phase: "SETTLEMENT" }));
          }, 3000);
        }

        // Phase: SETTLEMENT - process win/lose, then new round
        if (s.phase === "SETTLEMENT" && !timersRef.current.newRoundPending) {
          timersRef.current.newRoundPending = true;

          // Process bet
          const bet = myBetRef.current;
          if (bet && s.winner) {
            if (bet.choice === s.winner) {
              balanceRef.current = balanceRef.current + bet.amount;
              setBalance(balanceRef.current);
              setMyBet({ ...bet, status: "WIN" });
              console.log("🎉 WIN!", bet.amount);
            } else {
              setMyBet({ ...bet, status: "LOSE" });
              console.log("❌ LOSE");
            }
          }

          // New round
          setTimeout(() => {
            console.log("🔄 NEW ROUND");
            timersRef.current = {}; // Reset flags
            setGameState({
              phase: "OPEN_BETS",
              roundId: "demo_" + Date.now(),
              timeLeft: 15,
              diceValue: null,
              winner: null,
            });
          }, 3000);
        }

        return s;
      });
    };

    // Single timer - NOT multiple
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const placeBet = useCallback(
    (amount, choice) => {
      if (gameState.phase !== "OPEN_BETS")
        return { success: false, error: "Betting closed" };
      if (balance < amount)
        return { success: false, error: "Insufficient balance" };

      setBalance((prev) => prev - amount);
      setMyBet({ amount, choice, status: "pending" });
      console.log("💰 Bet:", choice, amount);
      return { success: true };
    },
    [gameState.phase, balance],
  );

  const updateGameState = useCallback(
    (ns) => setGameState((p) => ({ ...p, ...ns })),
    [],
  );

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
