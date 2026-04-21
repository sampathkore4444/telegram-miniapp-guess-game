import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Reusable Card Component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card variant (default, highlight, glass)
 * @param {string} props.className - Additional classes
 */
function Card({ children, variant = "default", className, ...props }) {
  const variantClasses = {
    default: "bg-dark-800 rounded-xl",
    highlight: "bg-dark-700 rounded-xl border-2 border-gold-500/30",
    glass:
      "bg-dark-800/80 backdrop-blur-sm rounded-xl border border-dark-600/50",
  };

  const classes = twMerge("p-4", variantClasses[variant], className);

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Card;
