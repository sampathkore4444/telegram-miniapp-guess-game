import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Reusable Badge Component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.variant - Badge variant (default, success, warning, error, gold)
 * @param {string} props.size - Badge size (sm, md)
 * @param {string} props.className - Additional classes
 */
function Badge({ children, variant = "default", size = "md", className }) {
  const variantClasses = {
    default: "bg-dark-700 text-gray-300",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    error: "bg-red-500/20 text-red-400",
    gold: "bg-gold-500/20 text-gold-400",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const classes = twMerge(
    "inline-flex items-center font-medium rounded-full",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  return <span className={classes}>{children}</span>;
}

export default Badge;
