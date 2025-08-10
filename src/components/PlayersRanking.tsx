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

  // Get team information for logos
  const confirmedTeams = data.rawData?.confirmedTeams || [];
  const getTeamIcon = (teamName: string) => {
    const team = confirmedTeams.find((t) => t.name === teamName);
    return team?.icon || "🏆";
  };

  return (
    <div className="players-ranking">
      <h2>Player Rankings</h2>

      {/* Tournament Info */}
      {data.rawData && (
        <div className="tournament-info-section">
          <div className="tournament-details">
            <h3>{data.rawData.tournamentName || "Owens Cup 2024"}</h3>
            <p>Organizer: {data.rawData.organizer || "Unknown"}</p>
            <p>Race to: {data.rawData.raceToScore || 5}</p>
          </div>
        </div>
      )}

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
            <span className="team-name">
              <span className="team-icon">{getTeamIcon(player.teamName)}</span>
              {player.teamName}
            </span>
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

      {/* Team Summary */}
      {confirmedTeams.length > 0 && (
        <div className="teams-summary">
          <h3>Teams Overview</h3>
          <div className="teams-grid">
            {confirmedTeams.map((team) => (
              <div key={team.id} className="team-card">
                <div className="team-header">
                  <span className="team-icon">{team.icon || "🏆"}</span>
                  <h4>{team.name}</h4>
                </div>
                <div className="team-details">
                  <p>
                    <strong>Captain:</strong> {team.captain}
                  </p>
                  <p>
                    <strong>Manager:</strong> {team.manager}
                  </p>
                  <p>
                    <strong>Players:</strong> {team.players}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.playerRankings.length === 0 && (
        <div className="no-rankings">
          <p>No player rankings available yet.</p>
          <p>Player statistics will appear here as matches are played.</p>
        </div>
      )}
    </div>
  );
};

export default PlayersRanking;
