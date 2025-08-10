import React from "react";
import { useData } from "../contexts/DataContext";
import "./TournamentInfo.css";

interface TournamentInfoProps {
  displaySize?: "overlay" | "full-screen";
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({
  displaySize = "full-screen",
}) => {
  const { data } = useData();

  if (data.isLoading) {
    return <div className="tournament-info">Loading tournament...</div>;
  }

  if (data.error) {
    return <div className="tournament-info">Error: {data.error}</div>;
  }

  if (!data.tournaments || data.tournaments.length === 0) {
    return <div className="tournament-info">No tournament data</div>;
  }

  const activeTournament = data.tournaments.find((t) => t.status === "active");

  if (!activeTournament) {
    return <div className="tournament-info">No active tournament</div>;
  }

  return (
    <div className="tournament-info" data-display-size={displaySize}>
      <h1 className="main-tournament-name">
        {activeTournament.name || "OWENS CUP"}
      </h1>
      <div className="live-badge">
        <span className="status-badge status-active">LIVE</span>
      </div>

      <div className="teams-section">
        <h2>Teams</h2>
        {activeTournament.teams?.map((team) => (
          <div
            key={team.id}
            className="team-card"
            style={{ borderColor: team.color }}
          >
            <h3>{team.name}</h3>
            <p>Captain: {team.captain}</p>
            <p>Manager: {team.manager}</p>
            <div className="players">
              <h4>Players:</h4>
              <span className="player">{team.players.join(", ")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentInfo;
