import React from "react";
import { clsx } from "clsx";

/**
 * Loader Component - Multiple loading states
 * @param {Object} props
 * @param {string} props.type - Loader type (spinner, dots, pulse, dice)
 * @param {string} props.size - Size (sm, md, lg)
 * @param {string} props.color - Color theme (gold, white, red)
 */
function Loader({ type = "spinner", size = "md", color = "gold" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorClasses = {
    gold: "border-gold-500 border-t-transparent",
    white: "border-white border-t-transparent",
    red: "border-red-500 border-t-transparent",
  };

  // Spinner loader
  if (type === "spinner") {
    return (
      <div
        className={clsx(
          "animate-spin rounded-full border-2",
          sizeClasses[size],
          colorClasses[color],
        )}
      />
    );
  }

  // Dots loader
  if (type === "dots") {
    return (
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              "rounded-full animate-bounce",
              sizeClasses.sm,
              colorClasses[color].split(" ")[0],
              "bg-current",
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  // Pulse loader
  if (type === "pulse") {
    return (
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              "w-2 h-2 rounded-full animate-pulse",
              colorClasses[color].split(" ")[0],
              "bg-current",
            )}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    );
  }

  // Dice rolling loader
  if (type === "dice") {
    return (
      <div className="relative">
        <div
          className={clsx(
            "w-16 h-16 bg-white rounded-2xl flex items-center justify-center animate-bounce",
            "shadow-lg",
          )}
        >
          <span className="text-2xl animate-pulse">🎲</span>
        </div>
      </div>
    );
  }

  // Default spinner
  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-2",
        sizeClasses[size],
        colorClasses[color],
      )}
    />
  );
}

/**
 * Loading Overlay Component
 */
export function LoadingOverlay({ show, message = "Loading..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-800 p-6 rounded-xl flex flex-col items-center gap-4">
        <Loader type="spinner" size="lg" />
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
}

/**
 * Button with Loading State
 */
export function LoadingButton({
  loading,
  children,
  loaderType = "dots",
  ...props
}) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader type={loaderType} size="sm" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Loader;
