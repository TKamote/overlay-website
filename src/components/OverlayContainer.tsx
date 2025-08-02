import React, { useState, useEffect } from "react";
import type { OverlayData } from "../types/tournament";
import { wsService } from "../services/websocket";
import { sampleOverlayData } from "../utils/testData";
import ScoreBoard from "./ScoreBoard";
import TournamentInfo from "./TournamentInfo";
import PlayerDetails from "./PlayerDetails";
import Timer from "./Timer";
import MiniScoreboard from "./MiniScoreboard";
import MiniTimer from "./MiniTimer";
import MiniTournamentInfo from "./MiniTournamentInfo";
import DisplayControls from "./DisplayControls";
import ModeToggle from "./ModeToggle";

const OverlayContainer: React.FC = () => {
  const [overlayData, setOverlayData] = useState<OverlayData | null>(
    sampleOverlayData
  );

  useEffect(() => {
    // Connect to WebSocket
    wsService.connect();
    wsService.setDataUpdateCallback((data: OverlayData) => {
      setOverlayData(data);
    });

    // Cleanup on unmount
    return () => {
      wsService.disconnect();
    };
  }, []);

  if (!overlayData || !overlayData.isVisible) {
    return null;
  }

  const { tournamentManager, displayMode, displaySize, gameState } =
    overlayData;
  const activeTournament =
    tournamentManager.tournaments[tournamentManager.activeTournamentId];

  const handleModeChange = (mode: string) => {
    if (overlayData) {
      setOverlayData({
        ...overlayData,
        displayMode: mode as OverlayData["displayMode"],
      });
    }
  };

  const handleDisplaySizeChange = (size: string) => {
    if (overlayData) {
      setOverlayData({
        ...overlayData,
        displaySize: size as OverlayData["displaySize"],
      });
    }
  };

  const handleGameStateChange = (state: string) => {
    if (overlayData) {
      setOverlayData({
        ...overlayData,
        gameState: state as OverlayData["gameState"],
      });
    }
  };

  const renderComponent = () => {
    if (displaySize === "overlay") {
      // Mini overlay components
      switch (displayMode) {
        case "scoreboard":
          return (
            <MiniScoreboard
              players={activeTournament.players}
              tournamentName={activeTournament.name}
            />
          );
        case "timer":
          return <MiniTimer initialTime={300} isRunning={false} />;
        case "tournament-info":
          return <MiniTournamentInfo tournament={activeTournament} />;
        case "player-info":
        case "rankings":
          return (
            <MiniScoreboard
              players={activeTournament.players}
              tournamentName={activeTournament.name}
            />
          );
        default:
          return (
            <MiniScoreboard
              players={activeTournament.players}
              tournamentName={activeTournament.name}
            />
          );
      }
    } else {
      // Full-screen components
      switch (displayMode) {
        case "tournament-info":
          return <TournamentInfo tournamentManager={tournamentManager} />;
        case "scoreboard":
          return (
            <ScoreBoard
              players={activeTournament.players}
              tournamentName={activeTournament.name}
            />
          );
        case "player-info":
          return <PlayerDetails players={activeTournament.players} />;
        case "timer":
          return (
            <div className="timer-display">
              <h2>Match Timer</h2>
              <Timer initialTime={300} isRunning={false} />
            </div>
          );
        case "rankings":
          return <PlayerDetails players={activeTournament.players} />;
        default:
          return (
            <ScoreBoard
              players={activeTournament.players}
              tournamentName={activeTournament.name}
            />
          );
      }
    }
  };

  return (
    <div className="app-container">
      <div className="overlay-container">{renderComponent()}</div>

      <DisplayControls
        currentMode={displayMode}
        onModeChange={handleModeChange}
      />

      <ModeToggle
        displaySize={displaySize}
        gameState={gameState}
        onDisplaySizeChange={handleDisplaySizeChange}
        onGameStateChange={handleGameStateChange}
      />
    </div>
  );
};

export default OverlayContainer;
