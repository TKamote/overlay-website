import React from "react";
import type { Player } from "../types/tournament";
import { formatScore } from "../utils/helpers";

interface MiniScoreboardProps {
  players: Player[];
  tournamentName: string;
}

const MiniScoreboard: React.FC<MiniScoreboardProps> = ({
  players,
  tournamentName,
}) => {
  // Show only top 2 players for overlay
  const topPlayers = players.slice(0, 2);

  return (
    <div className="mini-scoreboard">
      <div className="mini-tournament-name">{tournamentName}</div>
      <div className="mini-players">
        {topPlayers.map((player) => (
          <div key={player.id} className="mini-player">
            <span className="mini-player-name">{player.name}</span>
            <span className="mini-player-score">
              {formatScore(player.score)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniScoreboard;
