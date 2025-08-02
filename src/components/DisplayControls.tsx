import React from "react";

interface DisplayControlsProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
}

const DisplayControls: React.FC<DisplayControlsProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="display-controls">
      <h3>Display Mode Controls</h3>
      <div className="control-buttons">
        <button
          className={`control-btn ${
            currentMode === "scoreboard" ? "active" : ""
          }`}
          onClick={() => onModeChange("scoreboard")}
        >
          Scoreboard
        </button>
        <button
          className={`control-btn ${
            currentMode === "tournament-info" ? "active" : ""
          }`}
          onClick={() => onModeChange("tournament-info")}
        >
          Tournament Info
        </button>
        <button
          className={`control-btn ${
            currentMode === "player-info" ? "active" : ""
          }`}
          onClick={() => onModeChange("player-info")}
        >
          Player Info
        </button>
        <button
          className={`control-btn ${currentMode === "timer" ? "active" : ""}`}
          onClick={() => onModeChange("timer")}
        >
          Timer
        </button>
        <button
          className={`control-btn ${
            currentMode === "rankings" ? "active" : ""
          }`}
          onClick={() => onModeChange("rankings")}
        >
          Rankings
        </button>
      </div>
    </div>
  );
};

export default DisplayControls;
