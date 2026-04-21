import React from "react";
import { clsx } from "clsx";

/**
 * BetSelector Component - Select bet amount
 * @param {Object} props
 * @param {number} props.selectedBet - Currently selected bet amount
 * @param {Function} props.onSelect - Callback when bet is selected
 * @param {boolean} props.disabled - Whether selector is disabled
 */
function BetSelector({ selectedBet, onSelect, disabled = false }) {
  const betAmounts = [50, 100, 200, 500];

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-gray-400 text-sm mr-2">Bet:</span>
      <div className="flex gap-2">
        {betAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => onSelect(amount)}
            disabled={disabled}
            className={clsx(
              "px-4 py-2 rounded-lg font-medium transition-all duration-200",
              selectedBet === amount
                ? "bg-gold-500 text-dark-900 shadow-lg shadow-gold-500/30"
                : "bg-dark-700 text-gray-300 hover:bg-dark-600",
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
