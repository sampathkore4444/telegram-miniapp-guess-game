import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Reusable Button Component - Enhanced with rich styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, danger, big, small, ghost, outline)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.fullWidth - Full width button
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 * @param {string} props.icon - Icon element
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className,
  icon,
  ...props
}) {
  const baseClasses =
    "font-bold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";

  const variantClasses = {
    // Primary gold button with glow
    primary: `
      bg-gradient-to-r from-gold-600 to-gold-500 text-dark-900 
      hover:from-gold-500 hover:to-gold-400 
      shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40
      hover:scale-[1.02]
    `,
    // Secondary dark button
    secondary: `
      bg-dark-700 text-white 
      hover:bg-dark-600 hover:scale-[1.02]
      border border-dark-600 hover:border-dark-500
      shadow-lg shadow-dark-900/50
    `,
    // Danger red button
    danger: `
      bg-gradient-to-r from-red-600 to-red-500 text-white 
      hover:from-red-500 hover:to-red-400 
      shadow-lg shadow-red-500/25 hover:shadow-red-500/40
      hover:scale-[1.02]
    `,
    // Big gradient button (for main actions)
    big: `
      bg-gradient-to-r from-red-600 via-pink-500 to-red-600 text-white 
      hover:from-red-500 hover:via-pink-400 hover:to-red-500
      shadow-xl shadow-red-500/30 hover:shadow-red-500/50
      hover:scale-[1.03]
      text-lg px-8 py-4
    `,
    // Small compact button
    small: `
      bg-dark-800 text-gray-300 
      hover:bg-dark-700 hover:text-white
      border border-dark-600 hover:border-dark-500
      text-sm
    `,
    // Ghost button (transparent)
    ghost: `
      bg-transparent text-gray-400 
      hover:bg-dark-800 hover:text-white
    `,
    // Outline button with border
    outline: `
      bg-transparent text-gold-500 
      hover:bg-gold-500/10
      border-2 border-gold-500/50 hover:border-gold-500
    `,
    // Success green button
    success: `
      bg-gradient-to-r from-green-600 to-green-500 text-white 
      hover:from-green-500 hover:to-green-400 
      shadow-lg shadow-green-500/25 hover:shadow-green-500/40
      hover:scale-[1.02]
    `,
    // Blue button
    info: `
      bg-gradient-to-r from-blue-600 to-blue-500 text-white 
      hover:from-blue-500 hover:to-blue-400 
      shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
      hover:scale-[1.02]
    `,
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
    xl: "px-10 py-4 text-xl",
  };

  const classes = twMerge(
    baseClasses,
    variantClasses[variant],
    variant !== "big" && sizeClasses[size],
    fullWidth && "w-full",
    className,
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {/* Shimmer effect for primary/big buttons */}
      {(variant === "primary" || variant === "big" || variant === "danger") &&
        !disabled && (
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="text-lg">{icon}</span>}
            {children}
          </>
        )}
      </span>
    </button>
  );
}

/**
 * Icon Button Component
 */
export function IconButton({
  icon,
  size = "md",
  variant = "ghost",
  className = "",
  ...props
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <Button
      variant={variant}
      className={clsx(
        "!p-0 flex items-center justify-center",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <span className="text-xl">{icon}</span>
    </Button>
  );
}

/**
 * Button Group Component
 */
export function ButtonGroup({ children, className = "" }) {
  return (
    <div
      className={clsx(
        "flex rounded-xl overflow-hidden border border-dark-700",
        className,
      )}
    >
      {React.Children.map(children, (child, index) => (
        <div className={clsx("flex-1", index > 0 && "-ml-px")}>
          {React.cloneElement(child, {
            className: clsx(child.props.className, "rounded-none w-full"),
          })}
        </div>
      ))}
    </div>
  );
}

export default Button;
