import React from "react";
import { useAppData } from "../contexts/DataContext";
import "./Information.css";

const Information: React.FC = () => {
  const { teams, players, loading, error } = useAppData();

  if (loading) {
    return (
      <div className="information-container">
        <div className="loading-message">Loading tournament data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="information-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  // Group players by team for the Teams column
  const playersByTeam = players.reduce(
    (
      acc: { [key: string]: { name: string; team: string; points?: number }[] },
      player
    ) => {
      if (!acc[player.team]) {
        acc[player.team] = [];
      }
      acc[player.team].push(player);
      return acc;
    },
    {}
  );

  return (
    <div className="information-container">
      {/* Teams Column */}
      <div className="information-column">
        <h2>Teams</h2>
        <div className="teams-list">
          {teams.map((team, index) => (
            <div key={team.id || index} className="team-card">
              <div className="team-header">
                <span className="team-icon">🏀</span>
                <span className="team-name">{team.name}</span>
              </div>
              <div className="team-details">
                <div className="team-stat">
                  <span className="stat-label">Captain:</span>
                  <span className="stat-value">{team.captain}</span>
                </div>
                <div className="team-stat">
                  <span className="stat-label">Manager:</span>
                  <span className="stat-value">{team.manager}</span>
                </div>
                <div className="team-stat">
                  <span className="stat-label">Color:</span>
                  <span className="stat-value">{team.color}</span>
                </div>
                <div className="team-stat">
                  <span className="stat-label">Players:</span>
                  <span className="stat-value">
                    {playersByTeam[team.name] &&
                    playersByTeam[team.name].length > 0
                      ? playersByTeam[team.name].map(
                          (player: { name: string }, index: number) => (
                            <div
                              key={index}
                              style={{ marginLeft: "10px", fontSize: "12px" }}
                            >
                              P{index + 1}: {player.name}
                            </div>
                          )
                        )
                      : "No players"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Structure Column */}
      <div className="information-column">
        <h2>Tournament Structure</h2>
        <div className="tournament-structure">
          <div className="structure-card">
            <h3>Format</h3>
            <div className="structure-details">
              <div className="structure-item">
                <span className="item-label">Type:</span>
                <span className="item-value">
                  Owen's Musconi Cup Style Tournament
                </span>
              </div>
              <div className="structure-item">
                <span className="item-label">Best of:</span>
                <span className="item-value">9 Matches</span>
              </div>
              <div className="structure-item">
                <span className="item-label">Race to:</span>
                <span className="item-value">5 Points</span>
              </div>
            </div>
          </div>

          <div className="structure-card">
            <h3>Rounds</h3>
            <div className="structure-details">
              <div className="structure-item">
                <span className="item-label">1.</span>
                <span className="item-value">Semifinal A</span>
              </div>
              <div className="structure-item">
                <span className="item-label">2.</span>
                <span className="item-value">Semifinal B</span>
              </div>
              <div className="structure-item">
                <span className="item-label">3.</span>
                <span className="item-value">Finals</span>
              </div>
            </div>
          </div>

          <div className="structure-card">
            <h3>Match Types</h3>
            <div className="structure-details">
              <div className="structure-item">
                <span className="item-label">Team Matches:</span>
                <span className="item-value">M1, M6</span>
              </div>
              <div className="structure-item">
                <span className="item-label">Doubles:</span>
                <span className="item-value">M2, M4, M7</span>
              </div>
              <div className="structure-item">
                <span className="item-label">Singles:</span>
                <span className="item-value">M3, M5, M8, M9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Players Column */}
      <div className="information-column">
        <h2>Players</h2>
        <div className="players-table-container">
          <table className="players-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player.id || index}>
                  <td className="player-name">{player.name}</td>
                  <td className="player-points">{player.points || 0}</td>
                  <td className="player-team">{player.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Information;
