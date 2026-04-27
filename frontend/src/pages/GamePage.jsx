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

// Format timestamp to relative time (e.g., "2m ago")
function formatTimestamp(timestamp) {
  if (!timestamp) return "";
  try {
    // Handle ISO string or Date object
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "";
  }
}

function GamePage() {
  const {
    gameState,
    balance,
    myBet,
    placeBet,
    history,
    demoHistory,
    recentResults,
    historyLoading,
    fetchHistory,
  } = useGame();
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [theme, setTheme] = useState("dark");

  const handlePlaceBet = (choice) => {
    const result = placeBet(selectedAmount, choice);
    if (result.success) {
      setSelectedChoice(choice);
    }
  };

  // Manual trigger for testing - FORCE ROLLING
  // Note: This uses the gameState setter from useGame hook if available
  const forceRoll = () => {
    console.log("Force roll triggered - requires gameContext integration");
  };

  // Get phase info
  const getPhaseInfo = () => {
    console.log("Current phase:", gameState.phase); // Debug log
    switch (gameState.phase) {
      case "OPEN_BETS":
        return { text: "🎯 Place Your Bet!", color: "text-green-400" };
      case "LOCKED":
        return { text: "🔒 Bets Closed", color: "text-red-400" };
      case "ROLLING":
        return {
          text: "🎲🎲 ROLLING NOW! 🎲🎲",
          color: "text-yellow-400 text-2xl animate-pulse",
        };
      case "RESULT_CALCULATED":
        return {
          text: "🎉 Result: " + (gameState.winner || ""),
          color: "text-gold-500",
        };
      case "SETTLEMENT":
        return { text: "💰 Settling bet...", color: "text-green-400" };
      default:
        return { text: "⏳ Waiting...", color: "text-gray-400" };
    }
  };

  const phaseInfo = getPhaseInfo();

  // Use real history from API, fallback to demo history from local play, or empty
  const historyData =
    history && history.length > 0
      ? history
      : demoHistory && demoHistory.length > 0
        ? demoHistory
        : [];

  // Calculate total profit
  const totalProfit = historyData.reduce((sum, h) => sum + h.profit, 0);
  const wins = historyData.filter((h) => h.profit > 0).length;
  const losses = historyData.filter((h) => h.profit < 0).length;

  const leaderboardData = [
    {
      rank: 1,
      username: "Player123",
      profit: 15420,
      winRate: 68,
      change: "up",
    },
    {
      rank: 2,
      username: "LuckyDice",
      profit: 12350,
      winRate: 62,
      change: "up",
    },
    {
      rank: 3,
      username: "BigWinner",
      profit: 10890,
      winRate: 55,
      change: "down",
    },
    { rank: 4, username: "You", profit: 4520, winRate: 58, change: "up" },
    { rank: 5, username: "ProGamer", profit: 3200, winRate: 51, change: "up" },
    {
      rank: 6,
      username: "DiceMaster",
      profit: 2150,
      winRate: 48,
      change: "up",
    },
    {
      rank: 7,
      username: "LuckyStar",
      profit: 1800,
      winRate: 45,
      change: "down",
    },
    { rank: 8, username: "GamerPro", profit: 950, winRate: 42, change: "up" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🎲</span>
            <h1 className="text-xl font-bold gradient-text">BIG/SMALL</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="gold" className="text-xs">
              VIP 1
            </Badge>
            <div className="bg-slate-700/80 px-4 py-2 rounded-xl flex items-center gap-2 shadow-md">
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
        <Card variant="glass" className="text-center py-4 bg-slate-800/50">
          <div
            className={`text-lg font-bold ${phaseInfo.color} ${gameState.phase === "ROLLING" ? "animate-pulse" : ""}`}
          >
            {phaseInfo.text}
          </div>
        </Card>

        {/* Dice Area */}
        <Card
          variant="default"
          className="flex-1 flex flex-col items-center justify-center py-8 min-h-[280px] bg-slate-800/80"
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

        {/* Results - Improved Recent Section */}
        <Card variant="glass" className="mt-auto pt-4 bg-slate-800/50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-xs uppercase tracking-wider">
              Recent Results
            </span>
            <span className="text-gold-500 text-xs">
              {wins}W - {losses}L
            </span>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {(recentResults.length > 0
              ? recentResults
              : [
                  { result: "BIG", dice: 4 },
                  { result: "SMALL", dice: 2 },
                  { result: "BIG", dice: 6 },
                  { result: "SMALL", dice: 1 },
                  { result: "BIG", dice: 5 },
                ]
            )
              .slice(0, 5)
              .map((r, i) => (
                <div
                  key={i}
                  className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg ${
                    r.result === "BIG"
                      ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
                      : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  }`}
                >
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-dark-950 flex items-center justify-center text-[8px] font-bold text-white border-2 border-dark-800">
                    {r.dice}
                  </span>
                  <span className="text-lg">{r.dice}</span>
                </div>
              ))}
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 backdrop-blur-md border-t border-slate-700 py-3 shadow-lg">
        <div className="max-w-md mx-auto px-4 flex justify-center gap-6 text-sm">
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1 text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <span className="text-lg">📊</span>
            <span className="hidden sm:inline">History</span>
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-1 text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <span className="text-lg">👥</span>
            <span className="hidden sm:inline">Leaderboard</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1 text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <span className="text-lg">⚙️</span>
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </footer>

      {/* History Modal - Table Structure */}
      {showHistory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "375px",
              borderRadius: "12px",
              padding: "16px",
              overflow: "auto",
              backgroundColor: "#111827",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}
              >
                📊 History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9ca3af",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Summary Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#1f2937",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#9ca3af", fontSize: "11px" }}>Total P/L</p>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: totalProfit >= 0 ? "#22c55e" : "#ef4444",
                  }}
                >
                  {totalProfit >= 0 ? "+" : ""}
                  {totalProfit.toLocaleString()}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "#1f2937",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#9ca3af", fontSize: "11px" }}>Wins</p>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#22c55e",
                  }}
                >
                  {wins}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "#1f2937",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#9ca3af", fontSize: "11px" }}>Losses</p>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#ef4444",
                  }}
                >
                  {losses}
                </p>
              </div>
            </div>

            {/* HTML Table with forced alignment using inline styles */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#1f2937" }}>
                  <th
                    style={{
                      width: "25%",
                      padding: "8px",
                      textAlign: "center",
                      color: "#d1d5db",
                      fontWeight: "bold",
                    }}
                  >
                    Round
                  </th>
                  <th
                    style={{
                      width: "25%",
                      padding: "8px",
                      textAlign: "center",
                      color: "#d1d5db",
                      fontWeight: "bold",
                    }}
                  >
                    Result
                  </th>
                  <th
                    style={{
                      width: "25%",
                      padding: "8px",
                      textAlign: "center",
                      color: "#d1d5db",
                      fontWeight: "bold",
                    }}
                  >
                    Dice
                  </th>
                  <th
                    style={{
                      width: "25%",
                      padding: "8px",
                      textAlign: "center",
                      color: "#d1d5db",
                      fontWeight: "bold",
                    }}
                  >
                    P/L
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #374151" }}>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <div style={{ color: "white", fontWeight: "500" }}>
                        #{item.round}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: "10px" }}>
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <span
                        style={{
                          backgroundColor:
                            item.result === "BIG" ? "#dc2626" : "#2563eb",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "10px",
                          display: "inline-block",
                        }}
                      >
                        {item.result}
                      </span>
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#374151",
                          color: "white",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {item.dice}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        color: item.profit >= 0 ? "#22c55e" : "#ef4444",
                        fontWeight: "bold",
                      }}
                    >
                      {item.profit >= 0 ? "+" : ""}
                      {item.profit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leaderboard Modal - Table Structure */}
      {showLeaderboard && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "375px",
              borderRadius: "12px",
              padding: "16px",
              overflow: "auto",
              backgroundColor: "#111827",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}
              >
                👥 Leaderboard
              </h2>
              <button
                onClick={() => setShowLeaderboard(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9ca3af",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Table Header */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#1f2937" }}>
                  <th
                    style={{
                      width: "15%",
                      padding: "8px",
                      textAlign: "center",
                      color: "#d1d5db",
                      fontWeight: "bold",
                    }}
                  >
                    Rank
                  </th>
                  <th
                    style={{
                      width: "40%",
                      padding: "8px",
                      textAlign: "left",
                      color: "#d1d5db",
                      fontWeight: "bold",
                      paddingLeft: "8px",
                    }}
                  >
                    Player
                  </th>
                  <th
                    style={{
                      width: "20%",
                      padding: "8px",
                      textAlign: "center",
                      color: "#d1d5db",
                      fontWeight: "bold",
                    }}
                  >
                    Win%
                  </th>
                  <th
                    style={{
                      width: "25%",
                      padding: "8px",
                      textAlign: "right",
                      color: "#d1d5db",
                      fontWeight: "bold",
                      paddingRight: "8px",
                    }}
                  >
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((player, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid #374151",
                      backgroundColor:
                        player.username === "You"
                          ? "rgba(234,179,8,0.1)"
                          : "transparent",
                    }}
                  >
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          fontWeight: "bold",
                          fontSize: "11px",
                          backgroundColor:
                            i === 0
                              ? "#eab308"
                              : i === 1
                                ? "#9ca3af"
                                : i === 2
                                  ? "#d97706"
                                  : "#4b5563",
                          color:
                            i === 0 ? "black" : i === 1 ? "black" : "white",
                        }}
                      >
                        {player.rank}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        paddingLeft: "8px",
                      }}
                    >
                      <span
                        style={{
                          color:
                            player.username === "You" ? "#eab308" : "white",
                          fontWeight:
                            player.username === "You" ? "bold" : "normal",
                        }}
                      >
                        {player.username}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        color: player.winRate >= 50 ? "#22c55e" : "#eab308",
                      }}
                    >
                      {player.winRate}%
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        paddingRight: "8px",
                        color: player.profit >= 0 ? "#22c55e" : "#ef4444",
                        fontWeight: "bold",
                      }}
                    >
                      {player.profit >= 0 ? "+" : ""}
                      {player.profit.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Top 3 Podium */}
            <div
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #374151",
              }}
            >
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "11px",
                  textAlign: "center",
                  marginBottom: "12px",
                }}
              >
                Top 3
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  gap: "8px",
                }}
              >
                {leaderboardData[1] && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "24px", marginBottom: "4px" }}>
                      {leaderboardData[1].username === "You" ? "⭐" : "🥈"}
                    </span>
                    <div
                      style={{
                        width: "64px",
                        height: "48px",
                        backgroundColor: "#9ca3af",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {leaderboardData[1].profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
                {leaderboardData[0] && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "24px", marginBottom: "4px" }}>
                      {leaderboardData[0].username === "You" ? "⭐" : "🥇"}
                    </span>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        backgroundColor: "#eab308",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {leaderboardData[0].profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
                {leaderboardData[2] && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "24px", marginBottom: "4px" }}>
                      {leaderboardData[2].username === "You" ? "⭐" : "🥉"}
                    </span>
                    <div
                      style={{
                        width: "64px",
                        height: "40px",
                        backgroundColor: "#d97706",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "11px",
                        }}
                      >
                        {leaderboardData[2].profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "375px",
              borderRadius: "12px",
              padding: "24px",
              backgroundColor: "#111827",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}
              >
                ⚙️ Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9ca3af",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Sound Setting */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0",
                borderBottom: "1px solid #374151",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span style={{ fontSize: "20px" }}>🔊</span>
                <div>
                  <p style={{ color: "white", fontWeight: "500" }}>
                    Sound Effects
                  </p>
                  <p style={{ color: "#9ca3af", fontSize: "11px" }}>
                    Game sounds and notifications
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                style={{
                  width: "56px",
                  height: "32px",
                  borderRadius: "16px",
                  border: "none",
                  backgroundColor: soundEnabled ? "#22c55e" : "#4b5563",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    position: "absolute",
                    top: "4px",
                    left: soundEnabled ? "28px" : "4px",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>

            {/* Haptic Setting */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0",
                borderBottom: "1px solid #374151",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span style={{ fontSize: "20px" }}>📳</span>
                <div>
                  <p style={{ color: "white", fontWeight: "500" }}>
                    Haptic Feedback
                  </p>
                  <p style={{ color: "#9ca3af", fontSize: "11px" }}>
                    Vibration on actions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHapticEnabled(!hapticEnabled)}
                style={{
                  width: "56px",
                  height: "32px",
                  borderRadius: "16px",
                  border: "none",
                  backgroundColor: hapticEnabled ? "#22c55e" : "#4b5563",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    position: "absolute",
                    top: "4px",
                    left: hapticEnabled ? "28px" : "4px",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>

            {/* Theme Setting */}
            <div
              style={{ padding: "16px 0", borderBottom: "1px solid #374151" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <span style={{ fontSize: "20px" }}>🎨</span>
                <div>
                  <p style={{ color: "white", fontWeight: "500" }}>Theme</p>
                  <p style={{ color: "#9ca3af", fontSize: "11px" }}>
                    Choose your preferred look
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {["dark", "light", "auto"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{
                      flex: 1,
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor: theme === t ? "#f59e0b" : "#374151",
                      color: theme === t ? "black" : "#9ca3af",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div style={{ padding: "16px 0" }}>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "11px",
                  textAlign: "center",
                }}
              >
                BIG/SMALL v1.0.0 • Made with 🎲
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;
