import React, { useState } from "react";
import OverlayContainer from "../components/OverlayContainer";
import TournamentsPage from "./TournamentsPage";
import TournamentHistory from "../components/TournamentHistory";
import "./HomeScreen.css";

const HomeScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "overlay" | "tournaments" | "history"
  >("overlay");

  const renderPage = () => {
    switch (currentPage) {
      case "overlay":
        return <OverlayContainer />;
      case "tournaments":
        return <TournamentsPage />;
      case "history":
        return <TournamentHistory />;
      default:
        return <OverlayContainer />;
    }
  };

  return (
    <div className="home-screen">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <button
          className={`nav-button ${currentPage === "overlay" ? "active" : ""}`}
          onClick={() => setCurrentPage("overlay")}
        >
          OVERLAY
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
          HISTORY
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">{renderPage()}</main>
    </div>
  );
};

export default HomeScreen;
