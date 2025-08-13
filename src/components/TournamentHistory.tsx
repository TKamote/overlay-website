import React from "react";
import { useTournamentHistory } from "../hooks/useTournamentHistory";
import { useData } from "../hooks/useData";
import "./TournamentHistory.css";

const TournamentHistory: React.FC = () => {
  const { userId } = useData();
  const { history, isLoading, error } = useTournamentHistory(userId);

  if (isLoading) {
    return (
      <div className="history-container">Loading tournament history...</div>
    );
  }

  if (error) {
    return <div className="history-container error">Error: {error}</div>;
  }

  if (history.length === 0) {
    return (
      <div className="history-container">No completed tournaments found.</div>
    );
  }

  return (
    <div className="history-container">
      <h2>Tournament History</h2>
      <ul className="history-list">
        {history.map((tourney) => (
          <li key={tourney.id} className="history-item">
            <span className="tournament-name">{tourney.tournamentName}</span>
            <span className="archived-date">
              Archived on: {tourney.archivedAt.toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentHistory;
