import React, { useEffect, useState } from "react";

function DiceArea({ diceValue, phase, winner }) {
  const [displayValue, setDisplayValue] = useState(null);
  const isRolling = phase === "ROLLING";
  const hasResult = phase === "RESULT_CALCULATED" || phase === "SETTLEMENT";

  useEffect(() => {
    if (isRolling) {
      let count = 0;
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
        if (++count > 10) {
          clearInterval(interval);
          setDisplayValue(diceValue);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(diceValue);
    }
  }, [isRolling, diceValue]);

  const getDots = (val) => {
    const patterns = {
      1: [[1, 1, 1]],
      2: [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1],
      ],
      3: [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
      ],
      4: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
      5: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
      6: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
    };
    const dots = [];
    patterns[val]?.forEach((row, r) =>
      row.forEach((cell, c) => cell && dots.push({ r, c })),
    );
    return dots;
  };

  return (
    <div style={styles.container}>
      {isRolling && (
        <div style={styles.overlay}>
          <div style={styles.rollingText}>ROLLING</div>
        </div>
      )}
      <div style={styles.dice}>
        {getDots(displayValue || 1).map((d) => (
          <div key={d.r * 3 + d.c} style={styles.dot} />
        ))}
      </div>
      {hasResult && displayValue && (
        <div style={styles.result}>
          <div style={styles.resultText}>{winner || displayValue}</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: 120,
    height: 120,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dice: {
    width: 80,
    height: 80,
    borderRadius: 12,
    background: "linear-gradient(135deg, #334155, #1e293b, #334155)",
    border: "2px solid #475569",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
    padding: 8,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2)",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: "#e2e8f0",
    margin: 2,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rollingText: {
    color: "#fbbf24",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  result: {
    position: "absolute",
    bottom: -24,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1e293b",
    padding: "2px 8px",
    borderRadius: 6,
    border: "1px solid #475569",
  },
  resultText: {
    color: "#f1f5f9",
    fontSize: 11,
    fontWeight: "bold",
  },
};

export default DiceArea;
