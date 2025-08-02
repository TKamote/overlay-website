import React from "react";

interface ModeToggleProps {
  displaySize: string;
  gameState: string;
  onDisplaySizeChange: (size: string) => void;
  onGameStateChange: (state: string) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({
  displaySize,
  gameState,
  onDisplaySizeChange,
  onGameStateChange,
}) => {
  return (
    <div className="mode-toggle">
      <div className="toggle-section">
        <h4>Display Mode</h4>
        <div className="toggle-buttons">
          <button
            className={`toggle-btn ${
              displaySize === "overlay" ? "active" : ""
            }`}
            onClick={() => onDisplaySizeChange("overlay")}
          >
            Overlay
          </button>
          <button
            className={`toggle-btn ${
              displaySize === "full-screen" ? "active" : ""
            }`}
            onClick={() => onDisplaySizeChange("full-screen")}
          >
            Full Screen
          </button>
        </div>
      </div>

      <div className="toggle-section">
        <h4>Game State</h4>
        <div className="toggle-buttons">
          <button
            className={`toggle-btn ${gameState === "in-game" ? "active" : ""}`}
            onClick={() => onGameStateChange("in-game")}
          >
            In Game
          </button>
          <button
            className={`toggle-btn ${gameState === "timeout" ? "active" : ""}`}
            onClick={() => onGameStateChange("timeout")}
          >
            Timeout
          </button>
          <button
            className={`toggle-btn ${gameState === "break" ? "active" : ""}`}
            onClick={() => onGameStateChange("break")}
          >
            Break
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeToggle;
