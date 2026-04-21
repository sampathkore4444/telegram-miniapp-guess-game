import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { AuthProvider } from "./context/AuthContext";
import GamePage from "./pages/GamePage";
import LoadingPage from "./pages/LoadingPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <div className="min-h-screen bg-dark-900 text-white">
            <Routes>
              <Route path="/" element={<LoadingPage />} />
              <Route path="/game" element={<GamePage />} />
            </Routes>
          </div>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
