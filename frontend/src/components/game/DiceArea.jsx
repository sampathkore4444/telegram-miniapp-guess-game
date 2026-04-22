import React, { useState, useEffect } from "react";

/**
 * DiceArea - Professional animated dice display with rich visuals
 */
function DiceArea({ diceValue, phase, winner }) {
  const [displayValue, setDisplayValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [resultDots, setResultDots] = useState([]);
  const [shakeCount, setShakeCount] = useState(0);

  const isRollingPhase = phase === "ROLLING";
  const hasResult = phase === "RESULT_CALCULATED" || phase === "SETTLEMENT";

  // Handle rolling animation
  useEffect(() => {
    if (isRollingPhase) {
      setIsRolling(true);
      setDisplayValue(null);
      setShakeCount(0);

      // Rapid shake animation
      const shakeInterval = setInterval(() => {
        setShakeCount((prev) => (prev + 1) % 10);
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 80);

      // Stop after 2.5 seconds
      setTimeout(() => {
        clearInterval(shakeInterval);
        setIsRolling(false);
        setShakeCount(0);
        // Set final value
        const finalValue = diceValue || Math.floor(Math.random() * 6) + 1;
        setDisplayValue(finalValue);
      }, 2500);

      return () => clearInterval(shakeInterval);
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
          if (faces[displayValue]?.[row]?.[col]) {
            allDots.push({ r: row, c: col });
          }
        }
      }
      setResultDots(allDots);
    }
  }, [displayValue]);

  const getDotStyle = (r, c) => ({
    position: "absolute",
    top: `${20 + r * 30}%`,
    left: `${20 + c * 30}%`,
  });

  // Get shake transform
  const getShakeTransform = () => {
    if (!isRolling) return "none";
    const offset = Math.sin((shakeCount * Math.PI) / 2) * 8;
    return `translate(${offset}px, ${offset * 0.5}px) rotate(${shakeCount * 15}deg)`;
  };

  return (
    <div className="relative w-56 h-56 mx-auto">
      {/* Rolling indicator with glow effect */}
      {isRollingPhase && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
            <span className="text-2xl animate-spin">🎲</span>
            <span className="text-white font-bold text-lg">ROLLING</span>
            <span className="text-2xl animate-spin">🎲</span>
          </div>
        </div>
      )}

      {/* Dice container with glow */}
      <div
        className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-32 h-32 rounded-3xl flex items-center justify-center
          transition-all duration-200
          ${
            isRollingPhase
              ? "bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 shadow-[0_0_60px_rgba(251,191,36,0.9)]"
              : hasResult && winner === "BIG"
                ? "bg-gradient-to-br from-red-400 to-red-600 shadow-[0_0_50px_rgba(239,68,68,0.7)]"
                : hasResult && winner === "SMALL"
                  ? "bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_0_50px_rgba(59,130,246,0.7)]"
                  : "bg-gradient-to-br from-white to-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          }
        `}
        style={{
          transform: isRollingPhase
            ? `${getShakeTransform()} scale(1.15)`
            : hasResult
              ? "scale(1.1)"
              : "scale(1)",
        }}
      >
        {displayValue ? (
          // Show dice dots with animation
          <div className="relative w-24 h-24 animate-scaleIn">
            {resultDots.map((dot, i) => (
              <div
                key={i}
                className={`absolute w-6 h-6 rounded-full shadow-inner ${
                  isRollingPhase
                    ? "bg-red-600"
                    : winner === "BIG"
                      ? "bg-red-800"
                      : winner === "SMALL"
                        ? "bg-blue-800"
                        : "bg-gray-700"
                }`}
                style={getDotStyle(dot.r, dot.c)}
              />
            ))}
          </div>
        ) : isRollingPhase ? (
          // Rolling - show shaking dots effect
          <div className="flex gap-1">
            <div
              className="w-3 h-3 bg-red-700 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-3 h-3 bg-yellow-700 rounded-full animate-bounce"
              style={{ animationDelay: "100ms" }}
            />
            <div
              className="w-3 h-3 bg-red-700 rounded-full animate-bounce"
              style={{ animationDelay: "200ms" }}
            />
          </div>
        ) : (
          // Waiting - show question mark
          <span className="text-5xl font-bold text-gray-300">?</span>
        )}
      </div>

      {/* Result badge */}
      {hasResult && winner && (
        <div className="absolute -top-2 -right-2 z-10 animate-scaleIn">
          <div
            className={`
              px-5 py-2 rounded-full text-xl font-bold shadow-xl
              ${
                winner === "BIG"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-400"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-400"
              }
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
            absolute inset-0 flex items-center justify-center rounded-3xl 
            animate-fadeIn backdrop-blur-sm
            ${winner === "BIG" ? "bg-red-500/20" : "bg-blue-500/20"}
          `}
        >
          <span
            className={`
              text-4xl font-black tracking-wider animate-bounce
              ${
                winner === "BIG"
                  ? "text-red-500 drop-shadow-lg"
                  : "text-blue-500 drop-shadow-lg"
              }
            `}
          >
            🎉 {winner} WINS!
          </span>
        </div>
      )}
    </div>
  );
}

export default DiceArea;
