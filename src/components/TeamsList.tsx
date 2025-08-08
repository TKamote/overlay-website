import React from "react";
import { useData } from "../contexts/DataContext";
import AllMatchesDisplay from "./AllMatchesDisplay";
import "./TeamsList.css";

const TeamsList: React.FC = () => {
  const { data } = useData();

  if (data.isLoading) {
    return <div className="teams-list-loading">Loading teams...</div>;
  }

  if (data.error) {
    return <div className="teams-list-error">Error: {data.error}</div>;
  }

  return (
    <div className="teams-list">
      <h2>Tournament Teams ({data.teams.length})</h2>
      <div className="teams-three-column-layout">
        {/* Left Column - Teams List */}
        <div className="teams-column">
          <h3>Teams List</h3>
          <div className="teams-grid">
            {data.teams.map((team) => (
              <div key={team.id} className="team-card">
                <div className="team-header">
                  <div
                    className="team-icon"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.icon}
                  </div>
                  <h3 className="team-name">{team.name}</h3>
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

        {/* Middle Column - Tournament Structure */}
        <div className="teams-column">
          <h3>Tournament Structure</h3>
          <div className="tournament-structure">
            {data.rawData && (
              <>
                <div className="structure-card">
                  <h4>Tournament Name</h4>
                  <p>{data.rawData.tournamentName}</p>
                </div>
                <div className="structure-card">
                  <h4>Organizer</h4>
                  <p>{data.rawData.organizer}</p>
                </div>
                <div className="structure-card">
                  <h4>Race To Score</h4>
                  <p>{data.rawData.raceToScore}</p>
                </div>
                <div className="structure-card">
                  <h4>SemiFinal 1</h4>
                  <p>Current Match: {data.rawData.semiFinal1?.currentMatch}</p>
                  <p>Winner: {data.rawData.semiFinal1?.winner || "None"}</p>
                </div>
                <div className="structure-card">
                  <h4>SemiFinal 2</h4>
                  <p>Current Match: {data.rawData.semiFinal2?.currentMatch}</p>
                  <p>Winner: {data.rawData.semiFinal2?.winner || "None"}</p>
                </div>
                <div className="structure-card">
                  <h4>Final</h4>
                  <p>Current Match: {data.rawData.final?.currentMatch}</p>
                  <p>Winner: {data.rawData.final?.winner || "None"}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column - All Active Matches */}
        <div className="teams-column">
          <h3>All Active Matches</h3>
          <div className="matches-section">
            <AllMatchesDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsList;
