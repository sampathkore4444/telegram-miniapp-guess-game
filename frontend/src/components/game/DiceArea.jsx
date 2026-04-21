import React from "react";
import { clsx } from "clsx";

/**
 * DiceArea Component - Animated dice display
 * @param {Object} props
 * @param {number} props.diceValue - Current dice value (1-6)
 * @param {string} props.phase - Current game phase
 * @param {string} props.winner - Winner if round ended
 */
function DiceArea({ diceValue, phase, winner }) {
  const isRolling = phase === "ROLLING";
  const hasResult = phase === "RESULT_CALCULATED" || phase === "SETTLEMENT";

  // Get dice faces
  const diceFaces = {
    1: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    2: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    3: [
      [1, 0, 0],
      [0, 1, 0],
      [1, 0, 1],
    ],
    4: [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
    ],
    5: [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ],
    6: [
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
    ],
  };

  // Get dot positions for display
  const getDots = (face) => {
    const dots = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (face[row][col]) {
          dots.push(
            <span
              key={`${row}-${col}`}
              className="w-3 h-3 bg-white rounded-full"
              style={{
                position: "absolute",
                top: `${20 + row * 30}%`,
                left: `${20 + col * 30}%`,
              }}
            />,
          );
        }
      }
    }
    return dots;
  };

  return (
    <div className="relative w-40 h-40 mx-auto">
      {/* Dice container with rotation animation */}
      <div
        className={clsx(
          "w-full h-full bg-gradient-to-br from-white to-gray-200 rounded-2xl shadow-2xl flex items-center justify-center",
          isRolling && "animate-spin",
          hasResult && winner === "BIG" && "ring-4 ring-red-500",
          hasResult && winner === "SMALL" && "ring-4 ring-blue-500",
        )}
        style={{
          boxShadow:
            "0 10px 40px rgba(0, 0, 0, 0.4), inset 0 -5px 20px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Show dice face or question mark */}
        {diceValue ? (
          <div className="relative w-24 h-24">
            {getDots(diceFaces[diceValue])}
          </div>
        ) : (
          <span
            className={clsx(
              "text-5xl font-bold text-gray-400",
              isRolling && "animate-pulse",
            )}
          >
            ?
          </span>
        )}
      </div>

      {/* Result indicator */}
      {hasResult && (
        <div
          className={clsx(
            "absolute -top-2 -right-2 px-3 py-1 rounded-full text-sm font-bold",
            winner === "BIG"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white",
          )}
        >
          {winner}
        </div>
      )}
    </div>
  );
}

export default DiceArea;
