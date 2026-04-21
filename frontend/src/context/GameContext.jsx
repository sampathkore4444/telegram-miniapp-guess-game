import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { socketService } from "../services/socket.service";

// Game phases
const PHASES = {
  INIT: "INIT",
  OPEN_BETS: "OPEN_BETS",
  LOCKED: "LOCKED",
  ROLLING: "ROLLING",
  RESULT_CALCULATED: "RESULT_CALCULATED",
  SETTLEMENT: "SETTLEMENT",
  CLOSED: "CLOSED",
};

// Initial state
const initialState = {
  roundId: null,
  phase: PHASES.INIT,
  timeLeft: 8,
  diceValue: null,
  winner: null,
  selectedBet: 100,
  selectedChoice: null,
  lastBetResult: null,
  isPlacingBet: false,
};

// Create context
const GameContext = createContext(null);

/**
 * Game Provider Component
 * Manages game state and WebSocket communication
 */
export function GameProvider({ children }) {
  const { user, token } = useAuth();
  const [gameState, setGameState] = useState(initialState);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    // Connect to socket
    socketService.connect(token);

    // Set up event listeners
    socketService.on("connect", () => {
      setIsConnected(true);
      socketService.emit("JOIN_GAME");
    });

    socketService.on("disconnect", () => {
      setIsConnected(false);
    });

    socketService.on("GAME_STATE", (data) => {
      setGameState((prev) => ({
        ...prev,
        roundId: data.roundId,
        phase: data.phase,
        timeLeft: data.timeLeft,
      }));
    });

    socketService.on("DICE_RESULT", (data) => {
      setGameState((prev) => ({
        ...prev,
        diceValue: data.dice,
        winner: data.winner,
        phase: "RESULT_CALCULATED",
      }));
    });

    socketService.on("BET_ACCEPTED", (data) => {
      setGameState((prev) => ({
        ...prev,
        isPlacingBet: false,
        lastBetResult: { success: true, ...data },
      }));
    });

    socketService.on("BET_REJECTED", (data) => {
      setGameState((prev) => ({
        ...prev,
        isPlacingBet: false,
        lastBetResult: { success: false, reason: data.reason },
      }));
    });

    socketService.on("BET_SETTLEMENT", (data) => {
      setGameState((prev) => ({
        ...prev,
        lastBetResult: data,
      }));
    });

    socketService.on("WALLET_UPDATE", (data) => {
      // Update balance in auth context
    });

    socketService.on("NEW_ROUND_STARTED", (data) => {
      setGameState((prev) => ({
        ...prev,
        roundId: data.roundId,
        phase: "OPEN_BETS",
        timeLeft: data.timeLeft,
        diceValue: null,
        winner: null,
        lastBetResult: null,
      }));
    });

    // Cleanup on unmount
    return () => {
      socketService.off("connect");
      socketService.off("disconnect");
      socketService.off("GAME_STATE");
      socketService.off("DICE_RESULT");
      socketService.off("BET_ACCEPTED");
      socketService.off("BET_REJECTED");
      socketService.off("BET_SETTLEMENT");
      socketService.off("WALLET_UPDATE");
      socketService.off("NEW_ROUND_STARTED");
      socketService.disconnect();
    };
  }, [token]);

  // Place bet
  const placeBet = (choice, amount) => {
    if (!isConnected || gameState.phase !== "OPEN_BETS") return;

    setGameState((prev) => ({
      ...prev,
      selectedChoice: choice,
      selectedBet: amount,
      isPlacingBet: true,
    }));

    socketService.emit("PLACE_BET", {
      roundId: gameState.roundId,
      choice,
      amount,
    });
  };

  // Select bet amount
  const selectBet = (amount) => {
    setGameState((prev) => ({
      ...prev,
      selectedBet: amount,
    }));
  };

  // Select choice
  const selectChoice = (choice) => {
    setGameState((prev) => ({
      ...prev,
      selectedChoice: choice,
    }));
  };

  // Clear last bet result
  const clearLastBetResult = () => {
    setGameState((prev) => ({
      ...prev,
      lastBetResult: null,
    }));
  };

  const value = {
    gameState,
    isConnected,
    placeBet,
    selectBet,
    selectChoice,
    clearLastBetResult,
    PHASES,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * Hook to access game context
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

export default GameContext;
