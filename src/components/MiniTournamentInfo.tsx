import React from "react";
import type { Tournament } from "../types/tournament";
import { getTournamentStatus } from "../utils/helpers";

interface MiniTournamentInfoProps {
  tournament: Tournament;
}

const MiniTournamentInfo: React.FC<MiniTournamentInfoProps> = ({
  tournament,
}) => {
  return (
    <div className="mini-tournament-info">
      <div className="mini-tournament-name">{tournament.name}</div>
      <div className="mini-tournament-status">
        <span className={`mini-status-badge status-${tournament.status}`}>
          {getTournamentStatus(tournament.status)}
        </span>
        {tournament.currentRound && tournament.totalRounds && (
          <span className="mini-round-info">
            R{tournament.currentRound}/{tournament.totalRounds}
          </span>
        )}
      </div>

      {tournament.overallScore && (
        <div className="mini-overall-score">
          <div className="mini-score-display">
            <span className="mini-team-name">
              {tournament.overallScore.team1Name}
            </span>
            <span className="mini-team-points">
              {tournament.overallScore.team1Score}
            </span>
            <span className="mini-score-separator">-</span>
            <span className="mini-team-points">
              {tournament.overallScore.team2Score}
            </span>
            <span className="mini-team-name">
              {tournament.overallScore.team2Name}
            </span>
          </div>
        </div>
      )}

      {tournament.featuredMatch && (
        <div className="mini-featured-match">
          <div className="mini-match-display">
            <span className="mini-player-name">
              {tournament.featuredMatch.player1.name}
            </span>
            <span className="mini-player-wins">
              {tournament.featuredMatch.player1Wins}
            </span>
            <span className="mini-match-vs">vs</span>
            <span className="mini-player-wins">
              {tournament.featuredMatch.player2Wins}
            </span>
            <span className="mini-player-name">
              {tournament.featuredMatch.player2.name}
            </span>
          </div>
          <div className="mini-match-status">
            Race to {tournament.featuredMatch.raceTo}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniTournamentInfo;
