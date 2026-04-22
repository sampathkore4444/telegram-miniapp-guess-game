import React, { useEffect, useState } from "react";

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
        if (count > 15) {
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
    const f = {
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
    let d = [];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) if (f[val]?.[r]?.[c]) d.push({ r, c });
    return d;
  };
  const dots = displayValue ? getDots(displayValue) : [];
  const dp = (r, c) => ({ top: `${20 + r * 30}%`, left: `${20 + c * 30}%` });
  const isBig = winner === "BIG",
    isSmall = winner === "SMALL";
  const gBg = isRollingPhase
    ? "linear-gradient(135deg,#fbbf24,#f59e0b,#ea580c)"
    : isBig
      ? "linear-gradient(135deg,#dc2626,#ef4444)"
      : isSmall
        ? "linear-gradient(135deg,#2563eb,#3b82f6)"
        : "linear-gradient(135deg,#f3f4f6,#d1d5db)";
  const gBor = isRollingPhase
    ? "#fcd34d"
    : isBig
      ? "#fca5a5"
      : isSmall
        ? "#93c5fd"
        : "#e5e7eb";

  return (
    <div
      style={{
        width: "200px",
        height: "200px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "16px",
              background: gBg,
              boxShadow:
                "0 0 40px rgba(251,191,36,0.8),0 15px 30px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `4px solid ${gBor}`,
              animation: "spin 0.3s linear infinite",
            }}
          >
            <span style={{ fontSize: "60px", lineHeight: 1 }}>🎲</span>
          </div>
          <div
            style={{
              marginTop: "12px",
              padding: "6px 20px",
              borderRadius: "30px",
              background: "linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)",
              border: `3px solid ${gBor}`,
              animation: "pulse 1s ease-in-out infinite",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 900,
                color: "white",
                letterSpacing: "2px",
              }}
            >
              🎲 ROLLING 🎲
            </span>
          </div>
        </div>
      )}
      {!isRollingPhase && hasResult && displayValue && (
        <>
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "14px",
              background: gBg,
              boxShadow:
                "0 15px 30px rgba(0,0,0,0.3),inset 0 -5px 8px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `4px solid ${gBor}`,
            }}
          >
            <div
              style={{ position: "relative", width: "70px", height: "70px" }}
            >
              {dots.map((d, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: isBig
                      ? "#7f1d1d"
                      : isSmall
                        ? "#1e3a8a"
                        : "#1f2937",
                    ...dp(d.r, d.c),
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              padding: "6px 14px",
              borderRadius: "30px",
              background: isBig ? "#dc2626" : "#2563eb",
              border: `3px solid ${gBor}`,
              animation: "bounce 0.6s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 900, color: "white" }}>
              {isBig ? "🔴 BIG" : "🔵 SMALL"}
            </span>
          </div>
          <div style={{ position: "absolute", bottom: "-6px" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 900,
                color: isBig ? "#dc2626" : "#2563eb",
                animation: "bounce 0.6s ease-in-out infinite",
              }}
            >
              🎉 {isBig ? "BIG WINS!" : "SMALL WINS!"}
            </span>
          </div>
        </>
      )}
      {!isRollingPhase && !hasResult && (
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "14px",
            background: gBg,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `3px solid ${gBor}`,
          }}
        >
          <span style={{ fontSize: "40px", fontWeight: 700, color: "#9ca3af" }}>
            ?
          </span>
        </div>
      )}
    </div>
  );
}
export default DiceArea;
