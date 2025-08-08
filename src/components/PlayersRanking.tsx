import React from "react";
import { useData } from "../contexts/DataContext";
import "./PlayersRanking.css";

const PlayersRanking: React.FC = () => {
  const { data } = useData();

  if (data.isLoading) {
    return <div className="players-ranking-loading">Loading rankings...</div>;
  }

  if (data.error) {
    return <div className="players-ranking-error">Error: {data.error}</div>;
  }

  return (
    <div className="players-ranking">
      <h2>Player Rankings</h2>
      <div className="rankings-table">
        <div className="rankings-header">
          <span className="rank">Rank</span>
          <span className="player-name">Player</span>
          <span className="team-name">Team</span>
          <span className="wins">Wins</span>
          <span className="losses">Losses</span>
          <span className="win-rate">Win Rate</span>
        </div>
        {data.playerRankings.map((player, index) => (
          <div key={player.playerId} className="ranking-row">
            <span className="rank">#{index + 1}</span>
            <span className="player-name">{player.playerName}</span>
            <span className="team-name">{player.teamName}</span>
            <span className="wins">{player.wins}</span>
            <span className="losses">{player.losses}</span>
            <span className="win-rate">
              {player.winRate > 0
                ? `${(player.winRate * 100).toFixed(1)}%`
                : "0%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersRanking;
