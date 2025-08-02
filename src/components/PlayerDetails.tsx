import React from "react";
import type { Player } from "../types/tournament";
import { formatScore, formatPlayerName } from "../utils/helpers";
import "./PlayerDetails.css";

interface PlayerDetailsProps {
  players: Player[];
  displaySize?: "overlay" | "full-screen";
}

const PlayerDetails: React.FC<PlayerDetailsProps> = ({
  players,
  displaySize = "full-screen",
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="player-details" data-display-size={displaySize}>
      <div className="player-details-header">
        <h2>Player Rankings</h2>
        <span className="player-count">{players.length} Players</span>
      </div>

      <div className="player-list">
        {sortedPlayers.map((player, index) => (
          <div key={player.id} className="player-card">
            <div className="player-rank">
              <span className="rank-number">#{index + 1}</span>
            </div>

            <div className="player-info-detailed">
              <div className="player-name-detailed">
                {formatPlayerName(player.name, 25)}
              </div>
              <div className="player-team-detailed">
                {player.team || "No Team"}
              </div>
            </div>

            <div className="player-stats">
              <div className="player-score-detailed">
                {formatScore(player.score)} pts
              </div>
              <div className="player-position">
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerDetails;
