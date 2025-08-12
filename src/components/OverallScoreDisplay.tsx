import React from "react";
import type { Tournament } from "../types/tournament";
import { useData } from "../hooks/useData";
import { TeamIcon } from "./TeamIcon";
import "./OverallScoreDisplay.css"; // Link to the new stylesheet

interface OverallScoreDisplayProps {
  tournaments: Tournament[];
}

const OverallScoreDisplay: React.FC<OverallScoreDisplayProps> = ({
  tournaments,
}) => {
  const { data } = useData();

  return (
    <div className="overall-score-container">
      {tournaments.map((tournament) => {
        const team1 = data.teams.find(
          (t) => t.id === tournament.overallScore?.team1Id
        );
        const team2 = data.teams.find(
          (t) => t.id === tournament.overallScore?.team2Id
        );

        const isFinal = tournament.id === "final";

        return (
          <div
            key={tournament.id}
            className={`stage-card glass-card ${isFinal ? "final-stage" : ""}`}
          >
            <h2 className="stage-title">
              {tournament.name.replace(/.* - /, "")}
            </h2>
            <div className="matchup-display">
              <div className="team-info left">
                {team1 ? (
                  <>
                    <TeamIcon
                      iconName={team1.icon}
                      backgroundColor={team1.color}
                      className="team-icon"
                    />
                    <span className="team-name">{team1.name}</span>
                  </>
                ) : (
                  <span className="team-name">TBD</span>
                )}
              </div>
              <div className="scores-center">
                <span className="score">
                  {tournament.overallScore?.team1Score}
                </span>
                <div className="vs-circle">VS</div>
                <span className="score">
                  {tournament.overallScore?.team2Score}
                </span>
              </div>
              <div className="team-info right">
                {team2 ? (
                  <>
                    <span className="team-name">{team2.name}</span>
                    <TeamIcon
                      iconName={team2.icon}
                      backgroundColor={team2.color}
                      className="team-icon"
                    />
                  </>
                ) : (
                  <span className="team-name">TBD</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverallScoreDisplay;
