/**
 * LoadingPage Component
 * Professional loading screen with animated effects
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/ui/Loader";

function LoadingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [dots, setDots] = useState("");

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      // Simulate brief loading for visual effect
      const timer = setTimeout(() => {
        navigate("/game");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center animate-fadeIn">
        {/* Logo */}
        <div className="mb-8 relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gold-500/20 rounded-3xl blur-2xl scale-110" />

          {/* Logo container */}
          <div className="relative bg-dark-800/80 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <span
                className="text-5xl animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                🎲
              </span>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold gradient-text tracking-tight">
                  BIG/SMALL
                </h1>
                <span className="text-gold-500/60 text-xs uppercase tracking-widest">
                  Dice Game
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center gap-4">
          <Loader type="dice" size="lg" />

          {/* Animated text */}
          <div className="text-center">
            <p className="text-white text-lg font-medium tracking-wide">
              Loading<span className="text-gold-500">{dots}</span>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Preparing your game experience
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-48 h-1 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
            style={{
              animation: "loadingProgress 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Tips */}
        <div className="mt-12 text-center max-w-xs">
          <p className="text-gray-600 text-xs">
            💡 Tip: Keep your device online for the best experience
          </p>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-600 text-xs">Powered by Telegram Mini App</p>
      </div>

      {/* CSS for progress bar animation */}
      <style>{`
        @keyframes loadingProgress {
          0% { width: 0%; transform: translateX(0); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default LoadingPage;
