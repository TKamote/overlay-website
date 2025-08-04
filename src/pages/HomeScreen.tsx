import React, { useState, useEffect } from "react";
import MainScore from "../components/MainScore";
import TournamentsPage from "./TournamentsPage";
import Information from "../components/Information";
import "./HomeScreen.css";

const HomeScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "overlay" | "tournaments" | "history"
  >("overlay");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (page: "overlay" | "tournaments" | "history") => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="home-screen">
      {/* Header with 3 containers */}
      <header className="header">
        {/* Left: Logo */}
        <div className="header-left">
          <img src="/playstore.png" alt="Tournament Logo" className="logo" />
        </div>

        {/* Center: Navigation (Desktop) */}
        <nav className="navigation desktop-nav">
          <button
            className={`nav-button ${
              currentPage === "overlay" ? "active" : ""
            }`}
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
            className={`nav-button ${
              currentPage === "history" ? "active" : ""
            }`}
            onClick={() => setCurrentPage("history")}
          >
            INFORMATION
          </button>
        </nav>

        {/* Right: Burger Menu (Mobile) */}
        <div className="header-right">
          {/* Desktop Timer/Live Indicator */}
          <div className="desktop-timer-container">
            {/* Countdown Timer */}
            {isCountdownActive && (
              <div className="countdown-timer">
                <span className="countdown-text">Tournament Starts in</span>
                <span className="countdown-time">
                  [{formatCountdown(countdown)}]
                </span>
              </div>
            )}

            {/* Live Indicator */}
            {hasLiveMatch && (
              <div className="home-live-indicator">
                <span className="live-dot"></span>
                LIVE
              </div>
            )}
          </div>

          {/* Burger Menu (Mobile) */}
          <button className="burger-menu" onClick={toggleMobileMenu}>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav">
          <button
            className={`mobile-nav-button ${
              currentPage === "overlay" ? "active" : ""
            }`}
            onClick={() => handleNavClick("overlay")}
          >
            MAIN SCORE
          </button>
          <button
            className={`mobile-nav-button ${
              currentPage === "tournaments" ? "active" : ""
            }`}
            onClick={() => handleNavClick("tournaments")}
          >
            TOURNAMENTS
          </button>
          <button
            className={`mobile-nav-button ${
              currentPage === "history" ? "active" : ""
            }`}
            onClick={() => handleNavClick("history")}
          >
            INFORMATION
          </button>
        </div>
      )}

      {/* Timer/Live Indicator (Mobile - positioned below header) */}
      <div className="mobile-timer-container">
        {/* Countdown Timer */}
        {isCountdownActive && (
          <div className="countdown-timer">
            <span className="countdown-text">Tournament Starts in</span>
            <span className="countdown-time">
              [{formatCountdown(countdown)}]
            </span>
          </div>
        )}

        {/* Live Indicator */}
        {hasLiveMatch && (
          <div className="home-live-indicator">
            <span className="live-dot"></span>
            LIVE
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="main-content">{renderPage()}</main>
    </div>
  );
};

export default HomeScreen;
