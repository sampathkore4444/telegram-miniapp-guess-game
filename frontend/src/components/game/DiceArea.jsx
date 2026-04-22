import React, { useEffect, useState } from "react";

/**
 * DiceArea - REAL CASINO-STYLE animated dice WITH ANIMATION
 */
function DiceArea({ diceValue, phase, winner }) {
  const [displayValue, setDisplayValue] = useState(null);

  const isRollingPhase = phase === "ROLLING";
  const hasResult = phase === "RESULT_CALCULATED" || phase === "SETTLEMENT";

  useEffect(() => {
    if (isRollingPhase) {
      let count = 0;
      const spin = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
        count++;
        if (count > 20) {
          clearInterval(spin);
          setDisplayValue(diceValue);
        }
      }, 120);
      return () => clearInterval(spin);
    } else {
      setDisplayValue(diceValue);
    }
  }, [isRollingPhase, diceValue]);

  const getDots = (val) => {
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
    const dots = [];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) if (faces[val]?.[r]?.[c]) dots.push({ r, c });
    return dots;
  };

  const dots = displayValue ? getDots(displayValue) : [];
  const dotPos = (r, c) => ({
    top: `${20 + r * 30}%`,
    left: `${20 + c * 30}%`,
  });
  const isBig = winner === "BIG";
  const isSmall = winner === "SMALL";

  // Get colors
  const getBgColor = () => {
    if (isRollingPhase)
      return "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)";
    if (isBig)
      return "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #b91c1c 100%)";
    if (isSmall)
      return "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #1d4ed8 100%)";
    return "linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)";
  };

  const getBorderColor = () => {
    if (isRollingPhase) return "#fcd34d";
    if (isBig) return "#fca5a5";
    if (isSmall) return "#93c5fd";
    return "#e5e7eb";
  };

  // Inline styles for guaranteed animation
  const rollingStyle = {
    animation: "spin 0.5s linear infinite",
  };

  const bounceStyle = {
    animation: "bounce 0.6s ease-in-out infinite",
  };

  return (
    <div
      style={{
        width: "280px",
        height: "280px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ROLLING PHASE */}
      {isRollingPhase && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          {/* Spinning dice emoji */}
          <div
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "24px",
              background:
                "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)",
              boxShadow:
                "0 0 60px rgba(251, 191, 36, 0.9), 0 20px 40px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "6px solid #fcd34d",
              animation: "spin 0.3s linear infinite",
            }}
          >
            <span style={{ fontSize: "100px", lineHeight: 1 }}>🎲</span>
          </div>

          {/* Rolling text with pulse */}
          <div
            style={{
              marginTop: "24px",
              padding: "12px 40px",
              borderRadius: "50px",
              background: "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)",
              boxShadow: "0 8px 30px rgba(251, 191, 36, 0.6)",
              border: "4px solid #fcd34d",
              animation: "pulse 1s ease-in-out infinite",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: 900,
                color: "white",
                letterSpacing: "4px",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              🎲 ROLLING 🎲
            </span>
          </div>
        </div>
      )}

      {/* RESULT */}
      {!isRollingPhase && hasResult && displayValue && (
        <>
          <div
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "20px",
              background: getBgColor(),
              boxShadow:
                "0 25px 50px rgba(0,0,0,0.4), inset 0 -8px 12px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `6px solid ${getBorderColor()}`,
              transition: "all 0.5s ease",
            }}
          >
            <div
              style={{ position: "relative", width: "112px", height: "112px" }}
            >
              {dots.map((d, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: isBig
                      ? "#7f1d1d"
                      : isSmall
                        ? "#1e3a8a"
                        : "#1f2937",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                    ...dotPos(d.r, d.c),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Winner badge */}
          <div
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              padding: "12px 20px",
              borderRadius: "50px",
              background: isBig ? "#dc2626" : "#2563eb",
              border: `4px solid ${isBig ? "#fca5a5" : "#93c5fd"}`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              animation: "bounce 0.6s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: 900, color: "white" }}>
              {isBig ? "🔴 BIG" : "🔵 SMALL"}
            </span>
          </div>

          {/* Big win text */}
          <div style={{ position: "absolute", bottom: "-8px" }}>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 900,
                color: isBig ? "#dc2626" : "#2563eb",
                textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                animation: "bounce 0.6s ease-in-out infinite",
              }}
            >
              🎉 {isBig ? "BIG WINS!" : "SMALL WINS!"}
            </span>
          </div>
        </>
      )}

      {/* Waiting state */}
      {!isRollingPhase && !hasResult && (
        <div
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid #e5e7eb",
          }}
        >
          <span style={{ fontSize: "56px", fontWeight: 700, color: "#9ca3af" }}>
            ?
          </span>
        </div>
      )}
    </div>
  );
}

export default DiceArea;
