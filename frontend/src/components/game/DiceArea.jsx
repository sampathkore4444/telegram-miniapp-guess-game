import React, { useState, useEffect } from "react";
import { clsx } from "clsx";

/**
 * DiceArea Component - Animated dice display with spinning effect
 * @param {Object} props
 * @param {number} props.diceValue - Current dice value (1-6)
 * @param {string} props.phase - Current game phase
 * @param {string} props.winner - Winner if round ended
 */
function DiceArea({ diceValue, phase, winner }) {
  const [displayValue, setDisplayValue] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const isRolling = phase === "ROLLING";
  const hasResult = phase === "RESULT_CALCULATED" || phase === "SETTLEMENT";

  // Handle rolling animation
  useEffect(() => {
    if (isRolling) {
      setIsSpinning(true);
      setDisplayValue(null);

      // Rapidly change display values to simulate spinning
      const spinInterval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
        setRotation((prev) => prev + 180);
      }, 100);

      // Stop spinning after 2-3 seconds and show final value
      const stopTimeout = setTimeout(() => {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setDisplayValue(diceValue);
        setRotation((prev) => prev + 180);
      }, 2500);

      return () => {
        clearInterval(spinInterval);
        clearTimeout(stopTimeout);
      };
    } else if (diceValue && !isRolling) {
      setDisplayValue(diceValue);
    }
  }, [isRolling, diceValue]);

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
              className="w-3 h-3 bg-white rounded-full shadow-sm"
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
      {/* Dice container with 3D spinning animation */}
      <div
        className={clsx(
          "w-full h-full bg-gradient-to-br from-white to-gray-200 rounded-2xl shadow-2xl flex items-center justify-center",
          isSpinning && "animate-bounce",
        )}
        style={{
          boxShadow:
            "0 10px 40px rgba(0, 0, 0, 0.4), inset 0 -5px 20px rgba(0, 0, 0, 0.1)",
          transform: `perspective(500px) rotateX(${rotation}deg)`,
          transition: isSpinning
            ? "transform 0.1s linear"
            : "transform 0.5s ease-out",
        }}
      >
        {/* Show dice face or question mark */}
        {displayValue ? (
          <div className="relative w-24 h-24">
            {getDots(diceFaces[displayValue])}
          </div>
        ) : (
          <span
            className={clsx(
              "text-5xl font-bold text-gray-400",
              isSpinning && "animate-pulse",
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
            "absolute -top-2 -right-2 px-3 py-1 rounded-full text-sm font-bold animate-scaleIn",
            winner === "BIG"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white",
          )}
        >
          {winner}
        </div>
      )}

      {/* Win/Lose overlay */}
      {hasResult && (
        <div
          className={clsx(
            "absolute inset-0 flex items-center justify-center rounded-2xl text-2xl font-bold animate-fadeIn",
            winner === "BIG" ? "bg-red-500/20" : "bg-blue-500/20",
          )}
        >
          <span
            className={clsx(
              "text-4xl font-bold",
              winner === "BIG" ? "text-red-500" : "text-blue-500",
            )}
          >
            {winner === "BIG" ? "🎉 BIG WIN!" : "🎉 SMALL WIN!"}
          </span>
        </div>
      )}
    </div>
  );
}

export default DiceArea;
