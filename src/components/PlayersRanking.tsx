import React from "react";
import { useData } from "../hooks/useData";
import { TeamIcon } from "./TeamIcon";
import "./PlayersRanking.css";

interface SimplePlayer {
  id: string;
  name: string;
  team: string;
  teamIcon?: string;
  teamColor?: string;
}

const PlayersRanking: React.FC = () => {
  const { data } = useData();

  if (data.isLoading) {
    return <div className="ranking-layout">Loading...</div>;
  }

  if (data.error) {
    return <div className="ranking-layout">Error: {data.error}</div>;
  }

  if (!data.teams || data.teams.length === 0) {
    return <div className="ranking-layout">No teams found.</div>;
  }

  try {
    const allPlayers: SimplePlayer[] = data.teams.flatMap((team) =>
      team.players.map((player) => ({
        id: `${team.id}-${player.id}`,
        name: player.name,
        team: team.name,
        teamIcon: team.icon,
        teamColor: team.color,
      }))
    );

    const teams = data.teams || [];

    return (
      <div className="ranking-layout">
        <div className="players-ranking-container glass-card">
          <h1>Players Ranking</h1>
          <div className="rankings-table">
            <div className="table-header">
              <div className="rank-header">Rank</div>
              <div className="avatar-header">Avatar</div>
              <div className="player-name-header">Name</div>
              <div className="team-logo-header">Logo</div>
              <div className="team-header">Team</div>
              <div className="points-header">Points</div>
            </div>
            <div className="table-body">
              {allPlayers.map((player, index) => (
                <div key={player.id} className="player-row">
                  <div className="rank">{index + 1}</div>
                  <div className="player-avatar">
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"
                      alt="Player Avatar"
                    />
                  </div>
                  <div className="player-name">{player.name}</div>
                  <div className="team-logo">
                    <TeamIcon
                      iconName={player.teamIcon}
                      backgroundColor={player.teamColor}
                    />
                  </div>
                  <div className="team-name">{player.team}</div>
                  <div className="points">—</div>
                </div>
              ))}
            </div>
          </div>
          {allPlayers.length === 0 && (
            <div className="no-players">No players to display.</div>
          )}
        </div>

        <div className="teams-ranking-container glass-card">
          <h1>Teams Ranking</h1>
          <div className="rankings-table">
            <div className="table-header">
              <div className="rank-header">Rank</div>
              <div className="team-logo-header">Logo</div>
              <div className="team-name-header">Team</div>
              <div className="points-header">Points</div>
            </div>
            <div className="table-body">
              {teams.map((team, index) => (
                <div key={team.id} className="team-row">
                  <div className="rank">{index + 1}</div>
                  <div className="team-logo">
                    <TeamIcon
                      iconName={team.icon}
                      backgroundColor={team.color}
                    />
                  </div>
                  <div className="team-name">{team.name}</div>
                  <div className="points">—</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering PlayersRanking:", error);
    return (
      <div className="players-ranking-container error">
        <h2>Error Displaying Roster</h2>
        <p>There was an issue processing the player data.</p>
        <pre>{error instanceof Error ? error.message : String(error)}</pre>
      </div>
    );
  }
};

export default PlayersRanking;
