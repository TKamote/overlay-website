import React from "react";
import type { Player } from "../types/tournament";
import { formatScore, formatPlayerName } from "../utils/helpers";
import "./ScoreBoard.css";

interface ScoreBoardProps {
  players: Player[];
  tournamentName: string;
  displaySize?: "overlay" | "full-screen";
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  players,
  tournamentName,
  displaySize = "full-screen",
}) => {
  return (
    <div className="scoreboard" data-display-size={displaySize}>
      <div className="tournament-header">
        <h2>{tournamentName}</h2>
      </div>

      <div className="players-container">
        {players.map((player) => (
          <div key={player.id} className="player-row">
            <div className="player-info">
              <span className="player-name">
                {formatPlayerName(player.name)}
              </span>
              {player.team && (
                <span className="player-team">({player.team})</span>
              )}
            </div>
            <div className="player-score">{formatScore(player.score)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;
