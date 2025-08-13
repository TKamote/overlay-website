import React, { useState } from "react";
import type { Tournament, Match } from "../types/tournament";
import "./AllMatchesDisplay.css";
import { useData } from "../contexts/DataContext";
import { TeamIcon } from "./TeamIcon";
import { archiveCurrentTournament } from "../services/tournamentService";

const AllMatchesDisplay: React.FC = () => {
  const { data, userId } = useData();
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleArchive = async () => {
    if (!userId) {
      setError("User ID is not available.");
      return;
    }
    setIsArchiving(true);
    setError(null);
    try {
      await archiveCurrentTournament(userId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsArchiving(false);
    }
  };

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

  const finalTournament = data.tournaments.find((t) => t.id === "final");

  const isTournamentComplete =
    finalTournament?.overallScore &&
    finalTournament.overallScore.team1Score !==
      finalTournament.overallScore.team2Score &&
    (finalTournament.overallScore.team1Score === 5 ||
      finalTournament.overallScore.team2Score === 5);

  return (
    <div className="all-matches">
      {isTournamentComplete && (
        <div className="archive-section">
          <button
            onClick={handleArchive}
            disabled={isArchiving}
            className="archive-button"
          >
            {isArchiving ? "Archiving..." : "Complete & Archive Tournament"}
          </button>
          {error && <p className="archive-error">{error}</p>}
        </div>
      )}

      <div className="tournaments-grid">
        {data.tournaments.map((tournament: Tournament) => {
          const team1 = data.teams.find(
            (t) => t.id === tournament.overallScore?.team1Id
          );
          const team2 = data.teams.find(
            (t) => t.id === tournament.overallScore?.team2Id
          );

          const semiFinal1 = data.tournaments.find(
            (t) => t.id === "semi-final-1"
          );
          const semiFinal2 = data.tournaments.find(
            (t) => t.id === "semi-final-2"
          );

          const areSemifinalsFinished =
            semiFinal1?.status === "finished" &&
            semiFinal2?.status === "finished";

          const isFinalAndUndetermined =
            tournament.id === "final" && !areSemifinalsFinished;

          return (
            <div
              key={tournament.id}
              className="match-section glass-card"
              data-tournament-id={tournament.id}
            >
              <h2>{tournament.name.replace(/.* - /, "")}</h2>

              {isFinalAndUndetermined ? (
                <div className="undetermined-final">
                  <span>Winner of Semifinal A</span>
                  <span className="vs">vs</span>
                  <span>Winner of Semifinal B</span>
                </div>
              ) : (
                tournament.overallScore && (
                  <div className="overall-score-summary">
                    <div className="team-logo-wrapper">
                      <TeamIcon
                        iconName={team1?.icon}
                        className="team-icon overall"
                        backgroundColor={team1?.color}
                      />
                    </div>
                    <div className="team-name-wrapper">
                      <span className="team-name">
                        {team1?.name || "Team 1"}
                      </span>
                    </div>

                    <div className="overall-scores">
                      <span className="score">
                        {tournament.overallScore.team1Score}
                      </span>
                      <span className="vs">VS</span>
                      <span className="score">
                        {tournament.overallScore.team2Score}
                      </span>
                    </div>

                    <div className="team-name-wrapper">
                      <span className="team-name">
                        {team2?.name || "Team 2"}
                      </span>
                    </div>
                    <div className="team-logo-wrapper">
                      <TeamIcon
                        iconName={team2?.icon}
                        className="team-icon overall"
                        backgroundColor={team2?.color}
                      />
                    </div>
                  </div>
                )
              )}
              {tournament.matches.map((match: Match) => {
                const isPlaceholder =
                  isFinalAndUndetermined || !match.team1Id || !match.team2Id;

                if (isPlaceholder) {
                  return (
                    <div key={match.id} className="match-summary undetermined">
                      <div className="team-vs-team">
                        <div className="team">
                          <span className="team-name">TBD</span>
                        </div>
                        <div className="vs">vs</div>
                        <div className="team">
                          <span className="team-name">TBD</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                const team1 = data.teams.find((t) => t.id === match.team1Id);
                const team2 = data.teams.find((t) => t.id === match.team2Id);

                return (
                  <div key={match.id} className="match-summary">
                    <div className="match-title">{match.title}</div>
                    <div className="team-vs-team">
                      <div className="team team-one">
                        <TeamIcon
                          iconName={team1?.icon}
                          className="team-icon"
                          backgroundColor={team1?.color}
                        />
                        <div className="player-list">
                          {match.team1Players &&
                          match.team1Players.length > 0 ? (
                            match.team1Players.map((p) => (
                              <div key={p.id} className="player-name">
                                {p.name}
                              </div>
                            ))
                          ) : (
                            <div className="player-name">
                              {team1?.name || "Team 1"}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="match-scores">
                        <span className="score">{match.team1Score}</span>
                        <span className="vs">vs</span>
                        <span className="score">{match.team2Score}</span>
                      </div>

                      <div className="team team-two">
                        <div className="player-list">
                          {match.team2Players &&
                          match.team2Players.length > 0 ? (
                            match.team2Players.map((p) => (
                              <div key={p.id} className="player-name">
                                {p.name}
                              </div>
                            ))
                          ) : (
                            <div className="player-name">
                              {team2?.name || "Team 2"}
                            </div>
                          )}
                        </div>
                        <TeamIcon
                          iconName={team2?.icon}
                          className="team-icon"
                          backgroundColor={team2?.color}
                        />
                      </div>
                    </div>
                    {match.isCompleted && (
                      <div className="winner">
                        Winner:{" "}
                        {data.teams.find((t) => t.id === match.winnerId)
                          ?.name || "N/A"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllMatchesDisplay;
