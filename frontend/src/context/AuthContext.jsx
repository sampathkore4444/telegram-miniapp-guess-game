import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api.service";

/**
 * Auth Context
 * Manages user authentication and profile
 */

const AuthContext = createContext(null);

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [balance, setBalance] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from Telegram
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication
  const initializeAuth = async () => {
    try {
      // Get initData from Telegram
      const initData = window.Telegram?.WebApp?.initData || "";

      if (initData) {
        // Login with Telegram
        const response = await apiService.loginWithTelegram(initData);

        if (response.token) {
          setToken(response.token);
          setUser({
            userId: response.user_id,
            username: response.username,
          });
          setBalance(response.wallet_balance);
        }
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update balance
  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  const value = {
    user,
    token,
    balance,
    isLoading,
    updateBalance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
