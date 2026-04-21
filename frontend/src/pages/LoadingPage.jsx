import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * LoadingPage - Initial loading screen while authenticating
 */
function LoadingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/game");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900">
      {/* Logo/Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gold-400 mb-2">🎲</h1>
        <h2 className="text-2xl font-bold text-white">BIG / SMALL</h2>
        <p className="text-gray-400">Dice Game</p>
      </div>

      {/* Loading spinner */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default LoadingPage;
