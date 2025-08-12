import React from "react";
import { useData } from "../hooks/useData";
import type { Tournament } from "../types/tournament";

const TournamentHistory: React.FC = () => {
  const { data } = useData();

  if (data.isLoading) {
    return <div>Loading history...</div>;
  }

  if (data.error) {
    return <div>Error loading history: {data.error}</div>;
  }

  // Filter for tournaments where the final stage is marked as "finished"
  const completedTournaments = data.tournaments.filter(
    (t: Tournament) => t.id === "final" && t.status === "finished"
  );

  if (completedTournaments.length === 0) {
    return <div>No completed tournaments yet.</div>;
  }

  return (
    <div className="tournament-history">
      <h2>Tournament History</h2>
      {completedTournaments.map((tournament) => {
        // Determine the winner from the final match's overall score
        const { overallScore } = tournament;
        let winnerId: string | undefined;
        if (overallScore) {
          if (overallScore.team1Score > overallScore.team2Score) {
            winnerId = overallScore.team1Id;
          } else if (overallScore.team2Score > overallScore.team1Score) {
            winnerId = overallScore.team2Id;
          }
        }
        const winner = data.teams.find((t) => t.id === winnerId);
        const tournamentName = tournament.name.replace(/ - Final$/, "");

        return (
          <div key={tournament.id} className="history-item">
            <h3>{tournamentName}</h3>
            <p>
              <strong>Winner:</strong> {winner ? winner.name : "N/A"}
            </p>
            <p>
              <strong>Participants:</strong>{" "}
              {data.teams.map((t) => t.name).join(", ")}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TournamentHistory;
