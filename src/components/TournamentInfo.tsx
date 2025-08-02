import React from "react";
import type { TournamentManager, Tournament } from "../types/tournament";
import "./TournamentInfo.css";

interface TournamentInfoProps {
  tournamentManager: TournamentManager;
  displaySize?: "overlay" | "full-screen";
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({
  tournamentManager,
  displaySize = "full-screen",
}) => {
  const tournaments = Object.values(tournamentManager.tournaments);

  // Check if Finals are active (any team in final has scores > 0)
  const finalTournament = tournaments.find((t) => t.id === "tournament-final");
  const isFinalsActive =
    finalTournament &&
    finalTournament.overallScore &&
    ((finalTournament.overallScore.team1Score || 0) > 0 ||
      (finalTournament.overallScore.team2Score || 0) > 0);

  console.log("Final tournament:", finalTournament);
  console.log("Is finals active:", isFinalsActive);
  console.log("Final scores:", finalTournament?.overallScore);

  // Determine which tournaments to show
  const displayTournaments = isFinalsActive
    ? [finalTournament]
    : tournaments.filter((t) => t.id !== "tournament-final");

  return (
    <div className="tournament-info" data-display-size={displaySize}>
      <h1 className="main-tournament-name">OWENS CUP</h1>
      <div className="live-badge">
        <span className="status-badge status-active">LIVE</span>
      </div>

      {displayTournaments.map((tournament: Tournament) => (
        <div key={tournament.id} className="tournament-card">
          <h3 className="tournament-card-name">
            {tournament.name.includes("Semifinal A")
              ? "SEMIFINAL A"
              : tournament.name.includes("Semifinal B")
              ? "SEMIFINAL B"
              : "FINAL"}
          </h3>

          {tournament.overallScore && (
            <div className="tournament-score-display">
              <span className="tournament-team-name">
                {tournament.overallScore.team1Name}
              </span>
              <span
                className={`tournament-team-points ${
                  tournament.overallScore.team1Score >= 5 ? "winner" : ""
                }`}
              >
                {tournament.overallScore.team1Score}
                {tournament.overallScore.team1Score >= 5 && (
                  <span className="winner-indicator">🏆</span>
                )}
              </span>
              <span className="tournament-score-separator">-</span>
              <span
                className={`tournament-team-points ${
                  tournament.overallScore.team2Score >= 5 ? "winner" : ""
                }`}
              >
                {tournament.overallScore.team2Score}
                {tournament.overallScore.team2Score >= 5 && (
                  <span className="winner-indicator">🏆</span>
                )}
              </span>
              <span className="tournament-team-name">
                {tournament.overallScore.team2Name}
              </span>
            </div>
          )}

          {tournament.featuredMatch && (
            <div className="tournament-match-display">
              <span className="tournament-player-name">
                {tournament.featuredMatch.player1.name}
              </span>
              <span className="tournament-player-wins">
                {tournament.featuredMatch.player1Wins}
              </span>
              <span className="tournament-match-vs">vs</span>
              <span className="tournament-player-wins">
                {tournament.featuredMatch.player2Wins}
              </span>
              <span className="tournament-player-name">
                {tournament.featuredMatch.player2.name}
              </span>
            </div>
          )}

          {tournament.featuredMatch && (
            <div className="tournament-match-status">
              Race to {tournament.featuredMatch.raceTo}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TournamentInfo;
