/**
 * useGame Hook - Simple game WITHOUT duplicates
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { apiService } from "../services/api.service";

export function useGame() {
  const [gameState, setGameState] = useState({
    phase: "OPEN_BETS",
    roundId: 1000,
    timeLeft: 15,
    diceValue: null,
    winner: null,
  });

  const [balance, setBalance] = useState(1000);
  const [myBet, setMyBet] = useState(null);
  const [history, setHistory] = useState([]);
  const [isConnected] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [demoHistory, setDemoHistory] = useState([]);
  const [recentResults, setRecentResults] = useState([]); // Track recent dice results
  const roundCounterRef = useRef(1000); // Start from round 1000

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

          // Process bet - track demo history
          const bet = myBetRef.current;
          if (bet && s.winner) {
            const isWin = bet.choice === s.winner;
            const profit = isWin ? bet.amount : -bet.amount;

            if (isWin) {
              balanceRef.current = balanceRef.current + bet.amount;
              setBalance(balanceRef.current);
              setMyBet({ ...bet, status: "WIN" });
              console.log("🎉 WIN!", bet.amount);
            } else {
              setMyBet({ ...bet, status: "LOSE" });
              console.log("❌ LOSE");
            }

            // Add to demo history with simple round number
            roundCounterRef.current += 1;
            const demoEntry = {
              round: roundCounterRef.current,
              result: bet.choice,
              dice: s.diceValue,
              profit: profit,
              timestamp: new Date().toISOString(),
            };
            setDemoHistory((prev) => [demoEntry, ...prev].slice(0, 20));

            // Track recent dice result
            const resultEntry = { dice: s.diceValue, result: s.winner };
            setRecentResults((prev) => [resultEntry, ...prev].slice(0, 10));
          }

          // New round
          setTimeout(() => {
            console.log("🔄 NEW ROUND");
            timersRef.current = {}; // Reset flags
            roundCounterRef.current += 1;
            setGameState({
              phase: "OPEN_BETS",
              roundId: roundCounterRef.current,
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

  // Fetch game history from API
  const fetchHistory = useCallback(async (limit = 20, offset = 0) => {
    setHistoryLoading(true);
    try {
      const data = await apiService.getGameHistory(limit, offset);
      if (data.history && Array.isArray(data.history)) {
        // Transform API response to match expected format
        const formattedHistory = data.history.map((item) => ({
          round: item.round,
          result: item.result,
          dice: item.dice,
          profit: item.profit,
          timestamp: item.timestamp,
        }));
        setHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    gameState,
    balance,
    myBet,
    history,
    demoHistory,
    recentResults,
    historyLoading,
    isConnected,
    placeBet,
    updateGameState,
    fetchHistory,
    handleBetResult: () => {},
    setIsConnected: () => {},
  };
}

export default useGame;
