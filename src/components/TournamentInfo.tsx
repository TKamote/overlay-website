import React from "react";
import { useData } from "../contexts/DataContext";
import {
  FaTrophy,
  FaShieldAlt,
  FaStar,
  FaCrown,
  FaQuestionCircle,
} from "react-icons/fa";
import "./TournamentInfo.css";

const iconMap: { [key: string]: React.ElementType } = {
  trophy: FaTrophy,
  shield: FaShieldAlt,
  star: FaStar,
  crown: FaCrown,
  default: FaQuestionCircle,
};

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

  const teams = data.teams || [];
  if (teams.length === 0) {
    return <div className="tournament-info">No teams found</div>;
  }

  const { tournamentName, organizer, lastUpdated } = data.rawData || {};

  return (
    <div className="tournament-info-grid" data-display-size={displaySize}>
      <div className="team-column">
        {teams.map((team) => (
          <div key={team.id} className="team-card-container">
            <div className="team-header">
              <div
                className="ti-icon-container"
                style={{ backgroundColor: team.color }}
              >
                {React.createElement(
                  iconMap[team.icon?.toLowerCase() || "default"]
                )}
              </div>
              <div className="team-name-id">
                <h3 className="team-name">{team.name}</h3>
                <p className="team-id">Team {team.id}</p>
              </div>
            </div>
            <div className="team-details">
              <div className="detail-item">
                <span className="detail-label">Manager:</span>
                <span className="detail-value">{team.manager}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Captain:</span>
                <span className="detail-value">{team.captain}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Players:</span>
                <span className="detail-value">
                  {team.players.map((p) => p.name).join(", ")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="center-column">
        {tournamentName && (
          <div className="tournament-meta">
            <h1>{tournamentName}</h1>
            {organizer && <p>Organized by: {organizer}</p>}
            {lastUpdated && (
              <p>Last Updated: {new Date(lastUpdated).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </div>

      <div className="right-column">
        <div className="placeholder-card">
          <h3>Past Champion</h3>
          <p>TBD</p>
        </div>
        <div className="placeholder-card">
          <h3>Runner Ups</h3>
          <p>TBD</p>
        </div>
      </div>
    </div>
  );
};

export default TournamentInfo;
