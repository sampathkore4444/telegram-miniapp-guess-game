import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * API Service
 * Handles all HTTP requests to the backend
 */
export const apiService = {
  /**
   * Login with Telegram initData
   */
  async loginWithTelegram(initData) {
    const response = await api.post("/auth/telegram-login", { initData });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  /**
   * Get user profile
   */
  async getProfile() {
    const response = await api.get("/player/profile");
    return response.data;
  },

  /**
   * Get wallet info
   */
  async getWallet() {
    const response = await api.get("/player/wallet");
    return response.data;
  },

  /**
   * Get game state
   */
  async getGameState() {
    const response = await api.get("/game/state");
    return response.data;
  },

  /**
   * Get game history
   */
  async getGameHistory(limit = 20, offset = 0) {
    const response = await api.get("/game/history", {
      params: { limit, offset },
    });
    return response.data;
  },

  /**
   * Get global leaderboard
   */
  async getLeaderboard() {
    const response = await api.get("/leaderboard/global");
    return response.data;
  },

  /**
   * Get daily leaderboard
   */
  async getDailyLeaderboard() {
    const response = await api.get("/leaderboard/daily");
    return response.data;
  },

  /**
   * Get my leaderboard rank
   */
  async getMyRank() {
    const response = await api.get("/leaderboard/me");
    return response.data;
  },

  /**
   * Claim daily bonus
   */
  async claimDailyBonus() {
    const response = await api.post("/player/claim-daily-bonus");
    return response.data;
  },
};

export default apiService;
