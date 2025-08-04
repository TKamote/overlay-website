import React, { useState, useEffect } from "react";
import MainScore from "../components/MainScore";
import TournamentsPage from "./TournamentsPage";
import Information from "../components/Information";
import "./HomeScreen.css";

const HomeScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "overlay" | "tournaments" | "history"
  >("overlay");

  // Countdown timer state
  const [countdown, setCountdown] = useState(30 * 60); // 30 minutes in seconds
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [hasLiveMatch, setHasLiveMatch] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (!isCountdownActive) return;

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          setIsCountdownActive(false);
          setHasLiveMatch(true);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountdownActive]);

  // Format countdown to mm:ss
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const renderPage = () => {
    switch (currentPage) {
      case "overlay":
        return <MainScore />;
      case "tournaments":
        return <TournamentsPage />;
      case "history":
        return <Information />;
      default:
        return <MainScore />;
    }
  };

  return (
    <div className="home-screen">
      {/* Countdown Timer */}
      {isCountdownActive && (
        <div className="countdown-timer">
          <span className="countdown-text">Tournament Starts in</span>
          <span className="countdown-time">[{formatCountdown(countdown)}]</span>
        </div>
      )}

      {/* Live Indicator at Home Screen Level */}
      {hasLiveMatch && (
        <div className="home-live-indicator">
          <span className="live-dot"></span>
          LIVE
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="navigation">
        <button
          className={`nav-button ${currentPage === "overlay" ? "active" : ""}`}
          onClick={() => setCurrentPage("overlay")}
        >
          MAIN SCORE
        </button>
        <button
          className={`nav-button ${
            currentPage === "tournaments" ? "active" : ""
          }`}
          onClick={() => setCurrentPage("tournaments")}
        >
          TOURNAMENTS
        </button>
        <button
          className={`nav-button ${currentPage === "history" ? "active" : ""}`}
          onClick={() => setCurrentPage("history")}
        >
          INFORMATION
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">{renderPage()}</main>
    </div>
  );
};

export default HomeScreen;
