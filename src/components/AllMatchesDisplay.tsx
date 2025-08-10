import React from "react";
import type { Tournament, Match } from "../types/tournament";
import "./AllMatchesDisplay.css";
import { useData } from "../contexts/DataContext";

const AllMatchesDisplay: React.FC = () => {
  const { data } = useData();

  if (!data || !data.tournaments.length) {
    return (
      <div className="all-matches">
        <h1>All Tournament Matches</h1>
        <div className="no-matches">
          <p>No tournament data available or no matches found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-matches">
      <h1>All Tournament Matches</h1>
      <div className="tournaments-grid">
        {data.tournaments.map((tournament: Tournament) => (
          <div key={tournament.id} className="match-section">
            <h2>{tournament.name}</h2>
            {tournament.matches.map((match: Match) => {
              const team1 = tournament.teams.find(
                (t) => t.id === match.team1Id
              );
              const team2 = tournament.teams.find(
                (t) => t.id === match.team2Id
              );

              return (
                <div key={match.id} className="match-summary">
                  <div className="team-vs-team">
                    <div className="team">
                      <span className="team-icon">{team1?.icon || "🏆"}</span>
                      <span className="team-name">
                        {team1?.name || "Team 1"}
                      </span>
                      <span className="score">{match.team1Score}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className="team">
                      <span className="score">{match.team2Score}</span>
                      <span className="team-name">
                        {team2?.name || "Team 2"}
                      </span>
                      <span className="team-icon">{team2?.icon || "🛡️"}</span>
                    </div>
                  </div>
                  {match.winnerId && (
                    <div className="winner">
                      Winner:{" "}
                      {tournament.teams.find((t) => t.id === match.winnerId)
                        ?.name || "N/A"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMatchesDisplay;
