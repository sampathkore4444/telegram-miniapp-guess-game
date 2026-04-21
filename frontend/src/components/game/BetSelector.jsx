import React from "react";
import { clsx } from "clsx";

/**
 * BetSelector Component - Select bet amount
 */
function BetSelector({ selectedAmount, onSelectAmount, disabled = false }) {
  const betAmounts = [50, 100, 200, 500];

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex gap-2">
        {betAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => onSelectAmount(amount)}
            disabled={disabled}
            className={clsx(
              "px-4 py-2 rounded-lg font-medium transition-all duration-200 min-w-[60px]",
              selectedAmount === amount
                ? "bg-gold-500 text-dark-900 shadow-lg shadow-gold-500/30 scale-105"
                : "bg-dark-700 text-gray-300 hover:bg-dark-600 hover:scale-105",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {amount}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BetSelector;
