import React, { useState, useEffect } from "react";
import { getUserTournamentData } from "../services/firebase";

interface TournamentResult {
  id: string;
  name: string;
  date: string;
  winner: string;
  runnerUp: string;
  finalScore: string;
  participants: string[];
  status: "completed" | "ongoing";
}

interface TournamentHistoryProps {
  displaySize?: "full-screen" | "overlay";
}

const TournamentHistory: React.FC<TournamentHistoryProps> = ({
  displaySize = "full-screen",
}) => {
  const [tournaments, setTournaments] = useState<TournamentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournamentHistory();
  }, []);

  const loadTournamentHistory = async () => {
    try {
      setLoading(true);
      console.log("Loading tournament history from Firebase...");

      // Get current tournament data to check if there's a completed tournament
      const { teams, rawData } = await getUserTournamentData();

      const completedTournaments: TournamentResult[] = [];

      // Check if there's a completed final match
      if (rawData && rawData.final) {
        const finalScores = rawData.final.teamScores || [
          rawData.final.team1Score || 0,
          rawData.final.team2Score || 0,
        ];

        // Only add if there's a clear winner (one team has 5 points)
        if (finalScores[0] >= 5 || finalScores[1] >= 5) {
          const winner = finalScores[0] >= 5 ? "Warriors" : "Cavs";
          const runnerUp = finalScores[0] >= 5 ? "Cavs" : "Warriors";

          const completedTournament: TournamentResult = {
            id: `owens-cup-${Date.now()}`,
            name: "Owens Cup 2024 - Finals",
            date: new Date().toISOString().split("T")[0],
            winner,
            runnerUp,
            finalScore: `${finalScores[0]}-${finalScores[1]}`,
            participants: teams.map((team) => team.name),
            status: "completed",
          };

          completedTournaments.push(completedTournament);
          console.log("Found completed tournament:", completedTournament);
        }
      }

      setTournaments(completedTournaments);
      console.log("Tournament history loaded:", completedTournaments);
    } catch (error) {
      console.error("Error loading tournament history:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentTournament = async () => {
    try {
      console.log("Checking current tournament status...");

      // Get current tournament data
      const { teams, rawData } = await getUserTournamentData();

      if (rawData && rawData.final) {
        const finalScores = rawData.final.teamScores || [
          rawData.final.team1Score || 0,
          rawData.final.team2Score || 0,
        ];

        // Check if tournament is actually completed (one team has 5 points)
        if (finalScores[0] >= 5 || finalScores[1] >= 5) {
          const winner = finalScores[0] >= 5 ? "Warriors" : "Cavs";
          const runnerUp = finalScores[0] >= 5 ? "Cavs" : "Warriors";

          const completedTournament: TournamentResult = {
            id: `owens-cup-${Date.now()}`,
            name: "Owens Cup 2024 - Finals",
            date: new Date().toISOString().split("T")[0],
            winner,
            runnerUp,
            finalScore: `${finalScores[0]}-${finalScores[1]}`,
            participants: teams.map((team) => team.name),
            status: "completed",
          };

          // Add to history only if it's not already there
          setTournaments((prev) => {
            const exists = prev.some(
              (t) =>
                t.name === completedTournament.name &&
                t.finalScore === completedTournament.finalScore
            );

            if (!exists) {
              console.log(
                "Saving completed tournament to history:",
                completedTournament
              );
              alert(`Tournament completed! Winner: ${winner}`);
              return [completedTournament, ...prev];
            } else {
              alert("This tournament is already saved in history!");
              return prev;
            }
          });
        } else {
          alert("Tournament is not completed yet. Need 5 points to win!");
        }
      } else {
        alert("No final data available. Start a tournament first!");
      }
    } catch (error) {
      console.error("Error saving tournament:", error);
      alert("Error saving tournament");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading tournament history...</p>
      </div>
    );
  }

  return (
    <div className="tournament-history" data-display-size={displaySize}>
      <div className="history-header">
        <h1>TOURNAMENT HISTORY</h1>
        <button className="save-tournament-btn" onClick={saveCurrentTournament}>
          💾 Save Current Tournament
        </button>
      </div>

      <div className="history-list">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className={`history-card ${tournament.status}`}
          >
            <div className="tournament-info">
              <h3>{tournament.name}</h3>
              <p className="tournament-date">{tournament.date}</p>
              <div className="participants">
                <span>Participants: {tournament.participants.join(", ")}</span>
              </div>
            </div>

            <div className="tournament-result">
              {tournament.status === "completed" ? (
                <>
                  <div className="winner-section">
                    <span className="winner-label">🏆 Winner</span>
                    <span className="winner-name">{tournament.winner}</span>
                  </div>
                  <div className="runner-up-section">
                    <span className="runner-up-label">🥈 Runner Up</span>
                    <span className="runner-up-name">
                      {tournament.runnerUp}
                    </span>
                  </div>
                  <div className="final-score">
                    <span className="score-label">Final Score</span>
                    <span className="score-value">{tournament.finalScore}</span>
                  </div>
                </>
              ) : (
                <div className="ongoing-status">
                  <span className="status-badge status-ongoing">ONGOING</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {tournaments.length === 0 && (
        <div className="empty-history">
          <p>No completed tournaments yet.</p>
          <p>Complete a tournament (reach 5 points) to see it here!</p>
        </div>
      )}
    </div>
  );
};

export default TournamentHistory;
