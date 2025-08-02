import React, { useState, useEffect } from "react";
import type { OverlayData } from "../types/tournament";
import { getUserTournamentData } from "../services/firebase";
import { sampleOverlayData } from "../utils/testData";
import TournamentInfo from "./TournamentInfo";
import ScoreBoard from "./ScoreBoard";
import Timer from "./Timer";
import PlayerDetails from "./PlayerDetails";
import "./OverlayContainer.css";
import { doc, getDoc } from "firebase/firestore";
import db from "../services/firebase";

const OverlayContainer: React.FC = () => {
  const [overlayData, setOverlayData] = useState<OverlayData | null>(null);
  const [displayMode, setDisplayMode] = useState("tournament-info");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Loading Firebase data...");

      const { teams, rawData } = await getUserTournamentData();
      console.log("Loaded teams:", teams);
      console.log("Raw Firebase data:", rawData);

      if (teams.length > 0 && rawData) {
        console.log("Processing real Firebase data...");

        // Check if Finals are active by looking for final data
        const hasFinalData =
          rawData.final &&
          (rawData.final.teamScores ||
            rawData.final.teams ||
            rawData.final.team1Score !== undefined ||
            rawData.final.team2Score !== undefined);

        console.log("Has final data:", hasFinalData);
        console.log("Final data structure:", rawData.final);

        // Create tournament data from Firebase teams with real scores
        const tournamentData = {
          ...sampleOverlayData,
          tournamentManager: {
            ...sampleOverlayData.tournamentManager,
            tournaments: {
              "tournament-a": {
                id: "tournament-a",
                name: "Owens Cup 2024 - Semifinal A",
                status: "active" as const,
                players: [], // Will populate from teams
                matches: [],
                currentRound: 1,
                totalRounds: 3,
                overallScore: {
                  team1Score: rawData?.semiFinal1?.teamScores?.[0] || 0,
                  team2Score: rawData?.semiFinal1?.teamScores?.[1] || 0,
                  team1Name: teams[0]?.name || "Team 1",
                  team2Name: teams[1]?.name || "Team 2",
                },
                featuredMatch: undefined,
              },
              "tournament-b": {
                id: "tournament-b",
                name: "Owens Cup 2024 - Semifinal B",
                status: "active" as const,
                players: [], // Will populate from teams
                matches: [],
                currentRound: 1,
                totalRounds: 3,
                overallScore: {
                  team1Score: rawData?.semiFinal2?.teamScores?.[0] || 0,
                  team2Score: rawData?.semiFinal2?.teamScores?.[1] || 0,
                  team1Name: teams[2]?.name || "Team 3",
                  team2Name: teams[3]?.name || "Team 4",
                },
                featuredMatch: undefined,
              },
              "tournament-final": {
                id: "tournament-final",
                name: "Owens Cup 2024 - FINAL",
                status: "active" as const,
                players: [], // Will populate from teams
                matches: [],
                currentRound: 3,
                totalRounds: 3,
                overallScore: {
                  team1Score:
                    rawData?.final?.teamScores?.[0] ||
                    rawData?.final?.team1Score ||
                    0,
                  team2Score:
                    rawData?.final?.teamScores?.[1] ||
                    rawData?.final?.team2Score ||
                    0,
                  team1Name: "Warriors", // Based on your mobile app data
                  team2Name: "Cavs", // Based on your mobile app data
                },
                featuredMatch: undefined,
              },
            },
          },
        };

        setOverlayData(tournamentData);
        setLastUpdate(new Date());
        console.log(
          "Set real Firebase data - Updated at:",
          new Date().toLocaleTimeString()
        );
        console.log("Tournament data set:", tournamentData);
        console.log(
          "Final tournament data:",
          tournamentData.tournamentManager.tournaments["tournament-final"]
        );
      } else {
        // Fallback to sample data
        setOverlayData(sampleOverlayData);
        console.log("Using sample data (no Firebase data)");
      }
    } catch (error) {
      console.error("Error loading Firebase data:", error);
      setOverlayData(sampleOverlayData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadData();

    // Set up auto-refresh every 20 seconds
    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing overlay data...");
      loadData();
    }, 20000); // 20 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  if (loading) {
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

  if (!overlayData || !overlayData.isVisible) {
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
  const activeTournament =
    tournamentManager.tournaments[tournamentManager.activeTournamentId];

  const handleModeChange = (mode: string) => {
    setDisplayMode(mode);
  };

  const renderComponent = () => {
    switch (displayMode) {
      case "tournament-info":
        return (
          <TournamentInfo
            tournamentManager={tournamentManager}
            displaySize="overlay"
          />
        );
      case "scoreboard":
        return (
          <ScoreBoard
            players={activeTournament?.players || []}
            tournamentName={activeTournament?.name || ""}
            displaySize="overlay"
          />
        );
      case "timer":
        return (
          <Timer initialTime={300} isRunning={false} displaySize="overlay" />
        );
      case "player-info":
        return (
          <PlayerDetails
            players={activeTournament?.players || []}
            displaySize="overlay"
          />
        );
      default:
        return (
          <TournamentInfo
            tournamentManager={tournamentManager}
            displaySize="overlay"
          />
        );
    }
  };

  return (
    <div className="overlay-section">
      <div className="overlay-content">{renderComponent()}</div>

      {/* Last update indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          fontSize: "12px",
          color: "#666",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        Last update: {lastUpdate.toLocaleTimeString()}
      </div>

      <div className="overlay-controls">
        <div className="mode-controls">
          <button
            className={`mode-btn ${
              displayMode === "tournament-info" ? "active" : ""
            }`}
            onClick={() => handleModeChange("tournament-info")}
          >
            Tournament
          </button>
          <button
            className={`mode-btn ${
              displayMode === "scoreboard" ? "active" : ""
            }`}
            onClick={() => handleModeChange("scoreboard")}
          >
            Scoreboard
          </button>
          <button
            className={`mode-btn ${displayMode === "timer" ? "active" : ""}`}
            onClick={() => handleModeChange("timer")}
          >
            Timer
          </button>
          <button
            className={`mode-btn ${
              displayMode === "player-info" ? "active" : ""
            }`}
            onClick={() => handleModeChange("player-info")}
          >
            Players
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverlayContainer;
