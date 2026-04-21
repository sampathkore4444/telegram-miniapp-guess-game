import React from "react";
import { clsx } from "clsx";

/**
 * Loader Component - Multiple loading states with enhanced animations
 * @param {Object} props
 * @param {string} props.type - Loader type (spinner, dots, pulse, dice, diceRoll)
 * @param {string} props.size - Size (sm, md, lg, xl)
 * @param {string} props.color - Color theme (gold, white, red, green)
 */
function Loader({ type = "spinner", size = "md", color = "gold" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
    xl: "w-16 h-16 border-4",
  };

  const colorClasses = {
    gold: "border-gold-500 border-t-transparent",
    white: "border-white border-t-transparent",
    red: "border-red-500 border-t-transparent",
    green: "border-green-500 border-t-transparent",
  };

  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };

  // Spinner loader with glow
  if (type === "spinner") {
    return (
      <div className="relative">
        <div
          className={clsx(
            "animate-spin rounded-full border-2",
            sizeClasses[size],
            colorClasses[color],
          )}
        />
        {/* Glow effect */}
        <div
          className={clsx(
            "absolute inset-0 animate-spin rounded-full border-2 opacity-50",
            sizeClasses[size],
            colorClasses[color],
          )}
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
    );
  }

  // Dots loader with wave effect
  if (type === "dots") {
    return (
      <div className="flex gap-2 items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              "rounded-full animate-bounce",
              dotSizes[size],
              color === "gold" && "bg-gold-500",
              color === "white" && "bg-white",
              color === "red" && "bg-red-500",
              color === "green" && "bg-green-500",
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.6s",
            }}
          />
        ))}
      </div>
    );
  }

  // Pulse loader with ring effect
  if (type === "pulse") {
    return (
      <div className="flex gap-3 items-center">
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative">
            <div
              className={clsx(
                "rounded-full animate-ping absolute inset-0 opacity-75",
                dotSizes[size],
                color === "gold" && "bg-gold-500",
                color === "white" && "bg-white",
                color === "red" && "bg-red-500",
                color === "green" && "bg-green-500",
              )}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
            <div
              className={clsx(
                "rounded-full relative",
                dotSizes[size],
                color === "gold" && "bg-gold-500",
                color === "white" && "bg-white",
                color === "red" && "bg-red-500",
                color === "green" && "bg-green-500",
              )}
            />
          </div>
        ))}
      </div>
    );
  }

  // Dice rolling loader with bounce
  if (type === "dice") {
    return (
      <div className="relative">
        {/* Glow ring */}
        <div
          className={clsx(
            "absolute inset-0 rounded-2xl bg-gold-500/20 blur-xl",
            size === "lg" && "scale-150",
          )}
        />

        {/* Dice container */}
        <div
          className={clsx(
            "relative bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center shadow-xl",
            size === "sm" && "w-10 h-10",
            size === "md" && "w-14 h-14",
            size === "lg" && "w-20 h-20",
            size === "xl" && "w-24 h-24",
            "animate-bounce",
          )}
          style={{
            animationDuration: "1s",
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(245, 158, 11, 0.2)",
          }}
        >
          <span
            className={clsx(
              "select-none",
              size === "sm" && "text-xl",
              size === "md" && "text-2xl",
              size === "lg" && "text-4xl",
              size === "xl" && "text-5xl",
              "animate-pulse",
            )}
          >
            🎲
          </span>
        </div>

        {/* Rolling indicator */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1 h-1 rounded-full bg-gold-500 animate-pulse" />
          <div
            className="w-1 h-1 rounded-full bg-gold-500 animate-pulse"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-1 h-1 rounded-full bg-gold-500 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>
    );
  }

  // Dice roll animation with multiple states
  if (type === "diceRoll") {
    return (
      <div className="relative">
        <div
          className={clsx(
            "relative bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center animate-spin shadow-xl",
            size === "sm" && "w-10 h-10",
            size === "md" && "w-14 h-14",
            size === "lg" && "w-20 h-20",
            size === "xl" && "w-24 h-24",
          )}
          style={{
            animationDuration: "0.5s",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          <span
            className={clsx(
              "select-none",
              size === "sm" && "text-xl",
              size === "md" && "text-2xl",
              size === "lg" && "text-4xl",
              size === "xl" && "text-5xl",
            )}
          >
            🎲
          </span>
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
 * Loading Overlay Component - Enhanced
 */
export function LoadingOverlay({ show, message = "Loading..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-dark-800/90 backdrop-blur-md border border-dark-700 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl">
        <Loader type="dice" size="lg" />
        <p className="text-white font-medium">{message}</p>
        <div className="w-32 h-1 bg-dark-700 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
            style={{
              animation: "loadingProgress 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Button with Loading State - Enhanced
 */
export function LoadingButton({
  loading,
  children,
  loaderType = "dots",
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "relative transition-all duration-200",
        loading && "opacity-70 cursor-not-allowed",
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader type={loaderType} size="sm" />
          <span>{props.loadingText || "Processing..."}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Skeleton Loader Component
 */
export function Skeleton({ className = "", variant = "text" }) {
  const variants = {
    text: "h-4 rounded",
    title: "h-6 rounded-lg",
    avatar: "w-12 h-12 rounded-full",
    card: "h-32 rounded-xl",
  };

  return (
    <div
      className={clsx(
        "animate-pulse bg-dark-700",
        variants[variant],
        className,
      )}
    />
  );
}

export default Loader;
