/**
 * ChoiceButtons Component
 * BIG/SMALL betting buttons
 */

import React from "react";
import { clsx } from "clsx";
import Button from "../ui/Button";

/**
 * ChoiceButtons Component
 * @param {Object} props
 * @param {Function} props.onBet - Callback when bet is placed
 * @param {boolean} props.disabled - Whether buttons are disabled
 * @param {string} props.selectedChoice - Currently selected choice
 */
function ChoiceButtons({ onBet, disabled, selectedChoice }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="big"
        size="lg"
        disabled={disabled}
        onClick={() => onBet("BIG")}
        className={clsx(selectedChoice === "BIG" && "ring-4 ring-red-500")}
      >
        <div className="text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-xl font-bold">BIG</div>
          <div className="text-sm opacity-75">4, 5, 6</div>
        </div>
      </Button>

      <Button
        variant="small"
        size="lg"
        disabled={disabled}
        onClick={() => onBet("SMALL")}
        className={clsx(selectedChoice === "SMALL" && "ring-4 ring-blue-500")}
      >
        <div className="text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-xl font-bold">SMALL</div>
          <div className="text-sm opacity-75">1, 2, 3</div>
        </div>
      </Button>
    </div>
  );
}

export default ChoiceButtons;
