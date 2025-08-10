import React from "react";
import { useData } from "../hooks/useData";
import "./PlayersRanking.css";

interface SimplePlayer {
  id: string;
  name: string;
  team: string;
}

const PlayersRanking: React.FC = () => {
  const { data } = useData();

  if (data.isLoading) {
    return <div className="players-ranking-container">Loading...</div>;
  }

  if (data.error) {
    return <div className="players-ranking-container">Error: {data.error}</div>;
  }

  if (!data.teams || data.teams.length === 0) {
    return <div className="players-ranking-container">No teams found.</div>;
  }

  try {
    const allPlayers: SimplePlayer[] = data.teams.flatMap((team) =>
      team.players.map((player) => ({
        id: `${team.id}-${player.id}`,
        name: player.name,
        team: team.name,
      }))
    );

    return (
      <div className="players-ranking-container">
        <h1>Player Roster</h1>
        <div className="rankings-table">
          <div className="table-header">
            <div className="player-name-header">Name</div>
            <div className="team-header">Team</div>
            <div className="points-header">Points</div>
          </div>
          <div className="table-body">
            {allPlayers.map((player) => (
              <div key={player.id} className="player-row">
                <div className="player-name">{player.name}</div>
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
