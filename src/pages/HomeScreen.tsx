import React, { useState } from "react";
import OverlayContainer from "../components/OverlayContainer";
import TournamentsPage from "./TournamentsPage";
import DebugPage from "./DebugPage";
import TournamentHistory from "../components/TournamentHistory";
import TeamsList from "../components/TeamsList";
import PlayersRanking from "../components/PlayersRanking";
import "./HomeScreen.css";

const HomeScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "overlay" | "tournaments" | "debug" | "history" | "teams" | "rankings"
  >("overlay");

  const renderPage = () => {
    switch (currentPage) {
      case "overlay":
        return <OverlayContainer />;
      case "tournaments":
        return <TournamentsPage />;
      case "debug":
        return <DebugPage />;
      case "history":
        return <TournamentHistory />;
      case "teams":
        return <TeamsList />;
      case "rankings":
        return <PlayersRanking />;
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
          className={`nav-button ${currentPage === "debug" ? "active" : ""}`}
          onClick={() => setCurrentPage("debug")}
        >
          DEBUG
        </button>
        <button
          className={`nav-button ${currentPage === "teams" ? "active" : ""}`}
          onClick={() => setCurrentPage("teams")}
        >
          TEAMS
        </button>
        <button
          className={`nav-button ${currentPage === "rankings" ? "active" : ""}`}
          onClick={() => setCurrentPage("rankings")}
        >
          RANKINGS
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
