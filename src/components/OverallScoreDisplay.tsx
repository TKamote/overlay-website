import React from "react";
import type { Tournament } from "../types/tournament";
import "./OverallScoreDisplay.css";

interface OverallScoreDisplayProps {
  tournaments: Tournament[];
}

const OverallScoreDisplay: React.FC<OverallScoreDisplayProps> = ({
  tournaments,
}) => {
  return (
    <div className="overall-score-display">
      {tournaments.map((tournament) => (
        <div key={tournament.id} className="tournament-summary-card">
          <h3>{tournament.name}</h3>
          <div className="overall-score-details">
            <p>
              {tournament.overallScore?.team1Name}:{" "}
              {tournament.overallScore?.team1Score}
            </p>
            <p>
              {tournament.overallScore?.team2Name}:{" "}
              {tournament.overallScore?.team2Score}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverallScoreDisplay;
