import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Reusable Card Component - Enhanced with rich styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card variant (default, highlight, glass, gradient, border)
 * @param {string} props.size - Card size (sm, md, lg)
 * @param {string} props.className - Additional classes
 * @param {string} props Interactive - Interactive hover state
 */
function Card({
  children,
  variant = "default",
  size = "md",
  interactive = false,
  className,
  ...props
}) {
  const variantClasses = {
    // Default dark card
    default: `
      bg-dark-800 rounded-2xl
      shadow-lg shadow-dark-900/30
    `,
    // Highlight card (gold border)
    highlight: `
      bg-dark-800 rounded-2xl 
      border-2 border-gold-500/40
      shadow-lg shadow-dark-900/30
      ring-1 ring-gold-500/20
    `,
    // Glass morphism card
    glass: `
      bg-dark-800/60 backdrop-blur-md 
      rounded-2xl 
      border border-white/10
      shadow-xl shadow-black/20
    `,
    // Gradient card
    gradient: `
      bg-gradient-to-br from-dark-800 to-dark-900 
      rounded-2xl
      border border-dark-700/50
      shadow-lg shadow-dark-900/30
    `,
    // Border only card
    border: `
      bg-transparent 
      rounded-2xl 
      border border-dark-700
      hover:border-dark-600
    `,
    // Success / Green card
    success: `
      bg-green-900/20 rounded-2xl 
      border border-green-500/30
      shadow-lg shadow-green-500/10
    `,
    // Error / Red card
    danger: `
      bg-red-900/20 rounded-2xl 
      border border-red-500/30
      shadow-lg shadow-red-500/10
    `,
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const interactiveClasses =
    interactive &&
    `
    transition-all duration-200 
    hover:scale-[1.02] hover:-translate-y-1
    hover:shadow-xl hover:shadow-dark-900/40
    cursor-pointer
  `;

  const classes = twMerge(
    variantClasses[variant],
    sizeClasses[size],
    interactiveClasses,
    className,
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

/**
 * Section Card with title and action
 */
export function SectionCard({
  title,
  action,
  children,
  className = "",
  ...props
}) {
  return (
    <Card variant="glass" className={clsx("", className)} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-gray-400 text-sm uppercase tracking-wider font-medium">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </Card>
  );
}

/**
 * Stat Card Component
 */
export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "gold",
  className = "",
  ...props
}) {
  const colorClasses = {
    gold: "text-gold-500",
    green: "text-green-500",
    red: "text-red-500",
    blue: "text-blue-500",
  };

  return (
    <Card variant="gradient" interactive className={className} {...props}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className={clsx("text-2xl font-bold mt-1", colorClasses[color])}>
            {value}
          </p>
          {trend && (
            <p
              className={clsx(
                "text-xs mt-1",
                trend > 0 ? "text-green-400" : "text-red-400",
              )}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && <span className="text-2xl opacity-60">{icon}</span>}
      </div>
    </Card>
  );
}

export default Card;
