import React from "react";
import type { TournamentManager, Tournament } from "../types/tournament";

interface TournamentInfoProps {
  tournamentManager: TournamentManager;
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({
  tournamentManager,
}) => {
  const tournaments = Object.values(tournamentManager.tournaments);

  return (
    <div className="tournament-info">
      <div className="main-tournament-header">
        <h1 className="main-tournament-name">OWENS CUP</h1>
        <div className="live-badge">
          <span className="status-badge status-active">LIVE</span>
        </div>
      </div>

      <div className="tournament-cards">
        {tournaments.map((tournament: Tournament) => (
          <div key={tournament.id} className="tournament-card">
            <div className="tournament-card-header">
              <h3 className="tournament-card-name">
                {tournament.name.includes("Semifinal A")
                  ? "SEMIFINAL A"
                  : "SEMIFINAL B"}
              </h3>
            </div>

            {tournament.overallScore && (
              <div className="tournament-overall-score">
                <div className="tournament-score-display">
                  <div className="tournament-team-score">
                    <span className="tournament-team-name">
                      {tournament.overallScore.team1Name}
                    </span>
                    <span className="tournament-team-points">
                      {tournament.overallScore.team1Score}
                    </span>
                  </div>
                  <div className="tournament-score-separator">-</div>
                  <div className="tournament-team-score">
                    <span className="tournament-team-points">
                      {tournament.overallScore.team2Score}
                    </span>
                    <span className="tournament-team-name">
                      {tournament.overallScore.team2Name}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {tournament.featuredMatch && (
              <div className="tournament-featured-match">
                <div className="tournament-match-display">
                  <div className="tournament-match-player">
                    <span className="tournament-player-name">
                      {tournament.featuredMatch.player1.name}
                    </span>
                    <span className="tournament-player-wins">
                      {tournament.featuredMatch.player1Wins}
                    </span>
                  </div>
                  <div className="tournament-match-vs">vs</div>
                  <div className="tournament-match-player">
                    <span className="tournament-player-wins">
                      {tournament.featuredMatch.player2Wins}
                    </span>
                    <span className="tournament-player-name">
                      {tournament.featuredMatch.player2.name}
                    </span>
                  </div>
                </div>
                <div className="tournament-match-status">
                  Race to {tournament.featuredMatch.raceTo}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentInfo;
