import React from "react";
import type { OverlayData } from "../types/tournament";
import { useData } from "../contexts/DataContext";
import TournamentInfo from "./TournamentInfo";
import "./OverlayContainer.css";

const OverlayContainer: React.FC = () => {
  const { data, getActiveTournament } = useData();

  // Convert centralized data to overlay format
  const overlayData: OverlayData = {
    tournamentManager: {
      tournaments: data.tournaments.reduce((acc, tournament) => {
        acc[tournament.id] = tournament;
        return acc;
      }, {} as { [key: string]: any }),
      activeTournamentId: getActiveTournament()?.id || "tournament-final",
      globalFeaturedMatch: null,
      globalOverallScore: getActiveTournament()?.overallScore || null,
    },
    isVisible: true,
    displayMode: "tournament-info",
    displaySize: "full-screen",
    gameState: "in-game",
  };

  if (data.isLoading) {
    return (
      <div
        className="loading"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
          color: "blue",
        }}
      >
        Loading tournament data...
      </div>
    );
  }

  if (data.error) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "red",
          color: "white",
          fontSize: "18px",
        }}
      >
        <h2>❌ Error loading data: {data.error}</h2>
      </div>
    );
  }

  if (!overlayData.isVisible) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "red",
          color: "white",
          fontSize: "18px",
        }}
      >
        <h2>❌ No overlay data available</h2>
      </div>
    );
  }

  const { tournamentManager } = overlayData;

  return (
    <div className="overlay-container">
      {/* Main Content - Only Tournament Info */}
      <main className="overlay-main">
        <TournamentInfo
          tournamentManager={tournamentManager}
          displaySize="overlay"
        />
      </main>

      {/* Last Updated Info */}
      <div className="last-updated">
        Last updated: {data.lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default OverlayContainer;
