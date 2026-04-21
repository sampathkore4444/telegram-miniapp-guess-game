import React, { useState, useEffect } from "react";

/**
 * DiceArea - Animated dice display
 */
function DiceArea({ diceValue, phase, winner }) {
  const [displayValue, setDisplayValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [resultDots, setResultDots] = useState([]);

  const isRollingPhase = phase === "ROLLING";
  const hasResult = phase === "RESULT_CALCULATED" || phase === "SETTLEMENT";

  // Handle rolling animation
  useEffect(() => {
    if (isRollingPhase) {
      setIsRolling(true);
      setDisplayValue(null);

      // Rapid random display with shake effect
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 100);

      // Stop after 2.5 seconds
      setTimeout(() => {
        clearInterval(interval);
        setIsRolling(false);
        setDisplayValue(diceValue || Math.floor(Math.random() * 6) + 1);
      }, 2500);

      return () => clearInterval(interval);
    } else if (diceValue) {
      setDisplayValue(diceValue);
    }
  }, [isRollingPhase, diceValue]);

  // Calculate result dots
  useEffect(() => {
    if (displayValue) {
      const faces = {
        1: [[0, 1, 0]],
        2: [
          [1, 0, 0],
          [0, 0, 1],
        ],
        3: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
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
      const allDots = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (
            faces[displayValue] &&
            faces[displayValue][row] &&
            faces[displayValue][row][col]
          ) {
            allDots.push({ r: row, c: col });
          }
        }
      }
      setResultDots(allDots);
    }
  }, [displayValue]);

  // Get dot positions
  const getDotStyle = (r, c) => ({
    position: "absolute",
    top: `${20 + r * 30}%`,
    left: `${20 + c * 30}%`,
  });

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Rolling indicator */}
      {isRollingPhase && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-gold-500 font-bold animate-pulse">
          🎲 ROLLING...
        </div>
      )}

      {/* The Dice - large and clear */}
      <div
        className={`
          w-36 h-36 mx-auto rounded-2xl flex items-center justify-center
          transition-all duration-300
          ${isRollingPhase ? "bg-gradient-to-br from-yellow-100 to-yellow-300 shadow-[0_0_30px_rgba(251,191,36,0.6)]" : "bg-gradient-to-br from-white to-gray-200 shadow-2xl"}
          ${isRollingPhase ? "animate-spin" : ""}
        `}
        style={{
          transform: isRollingPhase
            ? "rotateX(15deg) scale(1.1)"
            : "rotateX(0deg) scale(1)",
          boxShadow: isRollingPhase
            ? "0 0 40px rgba(251, 191, 36, 0.8)"
            : "0 15px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        {displayValue ? (
          // Show dice dots
          <div className="relative w-24 h-24">
            {resultDots.map((dot, i) => (
              <div
                key={i}
                className="absolute w-5 h-5 bg-gray-800 rounded-full shadow-inner"
                style={getDotStyle(dot.r, dot.c)}
              />
            ))}
          </div>
        ) : isRollingPhase ? (
          // Rolling - show random numbers
          <span className="text-5xl font-bold text-gray-700 animate-pulse">
            {Math.floor(Math.random() * 6) + 1}
          </span>
        ) : (
          // Waiting
          <span className="text-5xl font-bold text-gray-400">?</span>
        )}
      </div>

      {/* Result badge */}
      {hasResult && winner && (
        <div className="absolute -top-2 -right-2 z-10">
          <div
            className={`
            px-4 py-2 rounded-full text-xl font-bold animate-scaleIn
            ${winner === "BIG" ? "bg-red-500 text-white" : "bg-blue-500 text-white"}
          `}
          >
            {winner === "BIG" ? "🔴 BIG" : "🔵 SMALL"}
          </div>
        </div>
      )}

      {/* Result overlay */}
      {hasResult && winner && (
        <div
          className={`
          absolute inset-0 flex items-center justify-center rounded-2xl text-2xl font-bold animate-fadeIn
          ${winner === "BIG" ? "bg-red-500/20" : "bg-blue-500/20"}
        `}
        >
          <span
            className={`
            text-3xl font-bold
            ${winner === "BIG" ? "text-red-500" : "text-blue-500"}
          `}
          >
            🎉 {winner === "BIG" ? "BIG WINS!" : "SMALL WINS!"}
          </span>
        </div>
      )}
    </div>
  );
}

export default DiceArea;
