import React from "react";
import { useData } from "../contexts/DataContext";
import type { Tournament } from "../types/tournament";

interface TournamentHistoryProps {
  displaySize?: "full-screen" | "overlay";
}

const TournamentHistory: React.FC<TournamentHistoryProps> = ({
  displaySize = "full-screen",
}) => {
  const { data } = useData();

  if (data.isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading tournament history...</p>
      </div>
    );
  }

  const completedTournaments = data.tournaments.filter(
    (t) => t.status === "finished"
  );

  return (
    <div className="tournament-history" data-display-size={displaySize}>
      <div className="history-header">
        <h1>TOURNAMENT HISTORY</h1>
      </div>

      <div className="history-list">
        {completedTournaments.map((tournament: Tournament) => {
          const winner = tournament.teams.find(
            (t) =>
              t.id === tournament.matches.find((m) => m.isCompleted)?.winnerId
          );
          return (
            <div key={tournament.id} className={`history-card completed`}>
              <div className="tournament-info">
                <h3>{tournament.name}</h3>
                <div className="participants">
                  <span>
                    Participants:{" "}
                    {tournament.teams.map((t) => t.name).join(", ")}
                  </span>
                </div>
              </div>

              <div className="tournament-result">
                <div className="winner-section">
                  <span className="winner-label">🏆 Winner</span>
                  <span className="winner-name">{winner?.name || "N/A"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {completedTournaments.length === 0 && (
        <div className="empty-history">
          <p>No completed tournaments yet.</p>
        </div>
      )}
    </div>
  );
};

export default TournamentHistory;
