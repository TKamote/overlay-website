import React, { useState } from "react";
import OverlayContainer from "../components/OverlayContainer";
import TournamentsPage from "./TournamentsPage";
import "./HomeScreen.css";

const HomeScreen: React.FC = () => {
  const [activeSection, setActiveSection] = useState("overlay");

  const renderSection = () => {
    switch (activeSection) {
      case "overlay":
        return <OverlayContainer />;
      case "tournaments":
        return <TournamentsPage />;
      case "settings":
        return <div className="settings-section">Settings Section</div>;
      case "players":
        return <div className="players-section">Players Section</div>;
      default:
        return <OverlayContainer />;
    }
  };

  return (
    <div className="home-screen">
      <header className="home-header">
        <h1 className="home-title">Owens Cup Tournament Manager</h1>
        <nav className="home-nav">
          <button
            className={`nav-btn ${activeSection === "overlay" ? "active" : ""}`}
            onClick={() => setActiveSection("overlay")}
          >
            Overlay
          </button>
          <button
            className={`nav-btn ${
              activeSection === "tournaments" ? "active" : ""
            }`}
            onClick={() => setActiveSection("tournaments")}
          >
            Tournaments
          </button>
          <button
            className={`nav-btn ${activeSection === "players" ? "active" : ""}`}
            onClick={() => setActiveSection("players")}
          >
            Players
          </button>
          <button
            className={`nav-btn ${
              activeSection === "settings" ? "active" : ""
            }`}
            onClick={() => setActiveSection("settings")}
          >
            Settings
          </button>
        </nav>
      </header>

      <main className="home-main">{renderSection()}</main>
    </div>
  );
};

export default HomeScreen;
