import React from "react";
import { clsx } from "clsx";

/**
 * BetSelector Component - Select bet amount
 */
function BetSelector({ selectedAmount, onSelectAmount, disabled = false }) {
  const betAmounts = [50, 100, 200, 500];

  return (
    <div className="flex items-center justify-center gap-3">
      {betAmounts.map((amount) => (
        <button
          key={amount}
          onClick={() => onSelectAmount(amount)}
          disabled={disabled}
          className={clsx(
            "w-16 h-16 rounded-xl font-bold text-base flex flex-col items-center justify-center gap-0 transition-all duration-200",
            selectedAmount === amount
              ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-gray-900 shadow-lg shadow-amber-500/40 scale-110 border-2 border-amber-400"
              : "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200 hover:from-gray-600 hover:to-gray-700 border-2 border-gray-600",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <span>✦</span>
          <span>{amount}</span>
        </button>
      ))}
    </div>
  );
}

export default BetSelector;
