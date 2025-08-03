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

  // Check if both semifinals are completed (one team has 5 points in each)
  const semifinalA = tournaments.find((t) => t.id === "tournament-a");
  const semifinalB = tournaments.find((t) => t.id === "tournament-b");

  const semifinalACompleted =
    semifinalA?.overallScore &&
    (semifinalA.overallScore.team1Score >= 5 ||
      semifinalA.overallScore.team2Score >= 5);

  const semifinalBCompleted =
    semifinalB?.overallScore &&
    (semifinalB.overallScore.team1Score >= 5 ||
      semifinalB.overallScore.team2Score >= 5);

  const bothSemifinalsCompleted = semifinalACompleted && semifinalBCompleted;

  // Determine which tournaments to show
  const displayTournaments = isFinalsActive
    ? [finalTournament]
    : tournaments.filter((t) => t.id !== "tournament-final");

  console.log("=== TOURNAMENT DEBUG ===");
  console.log(
    "All tournaments:",
    tournaments.map((t) => ({ id: t.id, name: t.name }))
  );
  console.log("Final tournament:", finalTournament);
  console.log("Is finals active:", isFinalsActive);
  console.log("Final scores:", finalTournament?.overallScore);
  console.log("Semifinal A:", semifinalA?.overallScore);
  console.log("Semifinal B:", semifinalB?.overallScore);
  console.log("Semifinal A completed:", semifinalACompleted);
  console.log("Semifinal B completed:", semifinalBCompleted);
  console.log("Both semifinals completed:", bothSemifinalsCompleted);
  console.log(
    "Display tournaments:",
    displayTournaments.map((t) => t.id)
  );
  console.log("==========================");

  const handleStartFinals = () => {
    console.log("Starting Finals...");
    console.log("Current state before Finals:", {
      semifinalACompleted,
      semifinalBCompleted,
      isFinalsActive,
      finalTournament,
    });

    // Get the winners from semifinals
    const semifinalAWinner =
      (semifinalA?.overallScore?.team1Score || 0) >= 5
        ? semifinalA?.overallScore?.team1Name || "Unknown"
        : semifinalA?.overallScore?.team2Name || "Unknown";

    const semifinalBWinner =
      (semifinalB?.overallScore?.team1Score || 0) >= 5
        ? semifinalB?.overallScore?.team1Name || "Unknown"
        : semifinalB?.overallScore?.team2Name || "Unknown";

    console.log("Semifinal winners:", { semifinalAWinner, semifinalBWinner });

    // In a real app, this would update Firebase to start Finals
    // For now, we'll show instructions
    alert(`Finals started! 
    
Semifinal A Winner: ${semifinalAWinner}
Semifinal B Winner: ${semifinalBWinner}

Please update your mobile app to set Finals scores for these teams. The overlay will automatically switch to Finals view once you add scores.`);

    // Don't reload - let the user update Firebase manually
    // The overlay will automatically detect when Finals scores are added
  };

  return (
    <div className="tournament-info" data-display-size={displaySize}>
      <h1 className="main-tournament-name">OWENS CUP</h1>
      <div className="live-badge">
        <span className="status-badge status-active">LIVE</span>
      </div>

      {/* Show Finals transition button when both semifinals are completed */}
      {bothSemifinalsCompleted && !isFinalsActive && (
        <div className="finals-transition">
          <button className="start-finals-btn" onClick={handleStartFinals}>
            🏆 START FINALS
          </button>
        </div>
      )}

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
