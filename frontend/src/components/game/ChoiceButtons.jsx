import React from "react";
import { clsx } from "clsx";

/**
 * ChoiceButtons Component - BIG/SMALL selection
 * @param {Object} props
 * @param {string} props.selectedChoice - Currently selected choice ('BIG' or 'SMALL')
 * @param {Function} props.onSelect - Callback when choice is selected
 * @param {boolean} props.disabled - Whether buttons are disabled
 */
function ChoiceButtons({ selectedChoice, onSelect, disabled = false }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* BIG Button */}
      <button
        onClick={() => onSelect("BIG")}
        disabled={disabled}
        className={clsx(
          "w-32 h-32 rounded-2xl flex flex-col items-center justify-center font-bold text-xl transition-all duration-300",
          selectedChoice === "BIG"
            ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50 transform scale-105"
            : "bg-dark-700 text-gray-400 hover:bg-dark-600 hover:scale-102",
          disabled && "opacity-50 cursor-not-allowed hover:scale-100",
        )}
      >
        <span className="text-3xl mb-1">🎲</span>
        <span>BIG</span>
        <span className="text-sm font-normal opacity-75">4-6</span>
      </button>

      {/* SMALL Button */}
      <button
        onClick={() => onSelect("SMALL")}
        disabled={disabled}
        className={clsx(
          "w-32 h-32 rounded-2xl flex flex-col items-center justify-center font-bold text-xl transition-all duration-300",
          selectedChoice === "SMALL"
            ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 transform scale-105"
            : "bg-dark-700 text-gray-400 hover:bg-dark-600 hover:scale-102",
          disabled && "opacity-50 cursor-not-allowed hover:scale-100",
        )}
      >
        <span className="text-3xl mb-1">🎲</span>
        <span>SMALL</span>
        <span className="text-sm font-normal opacity-75">1-3</span>
      </button>
    </div>
  );
}

export default ChoiceButtons;
