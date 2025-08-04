import React from "react";
import type { Match } from "../types/tournament";
import { useAppData } from "../contexts/DataContext";
import "./TournamentsPage.css";

const TournamentsPage: React.FC = () => {
  const { teams, loading, error } = useAppData();

  if (loading) {
    return (
      <div className="tournament-grid">
        <div className="loading-message">Loading tournament data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tournament-grid">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  // Get team names from Firebase data
  const teamNames = teams.map((team) => team.name);
  const warriors =
    teamNames.find((name) => name.toLowerCase().includes("warrior")) ||
    "Warriors";
  const cavs =
    teamNames.find((name) => name.toLowerCase().includes("cav")) || "Cavs";
  const lakers =
    teamNames.find((name) => name.toLowerCase().includes("laker")) || "Lakers";
  const heat =
    teamNames.find((name) => name.toLowerCase().includes("heat")) || "Heat";

  // Static data - no more complex Firebase logic
  const semifinal1Matches: Match[] = Array.from({ length: 9 }, (_, i) => ({
    id: `semifinal1-match-${i + 1}`,
    player1: { id: `p1-${i}`, name: "Player", score: 0, team: warriors },
    player2: { id: `p2-${i}`, name: "Player", score: 0, team: cavs },
    player1Wins: [3, 2, 4, 1, 3, 2, 4, 1, 3][i] || 0,
    player2Wins: [2, 3, 1, 4, 2, 3, 1, 4, 2][i] || 0,
    raceTo: 5,
    isFeatured: false,
    status: i < 3 ? "active" : i < 6 ? "upcoming" : "finished",
  }));

  const semifinal2Matches: Match[] = Array.from({ length: 9 }, (_, i) => ({
    id: `semifinal2-match-${i + 1}`,
    player1: { id: `p1-${i}`, name: "Player", score: 0, team: lakers },
    player2: { id: `p2-${i}`, name: "Player", score: 0, team: heat },
    player1Wins: [4, 3, 2, 4, 3, 2, 4, 3, 2][i] || 0,
    player2Wins: [1, 2, 3, 1, 2, 3, 1, 2, 3][i] || 0,
    raceTo: 5,
    isFeatured: false,
    status: i < 3 ? "active" : i < 6 ? "upcoming" : "finished",
  }));

  const finalsMatches: Match[] = Array.from({ length: 9 }, (_, i) => ({
    id: `finals-match-${i + 1}`,
    player1: { id: `p1-${i}`, name: "Player", score: 0, team: lakers },
    player2: { id: `p2-${i}`, name: "Player", score: 0, team: warriors },
    player1Wins: [2, 3, 1, 4, 2, 3, 1, 4, 2][i] || 0,
    player2Wins: [1, 2, 3, 1, 2, 3, 1, 2, 3][i] || 0,
    raceTo: 5,
    isFeatured: false,
    status: i < 3 ? "active" : i < 6 ? "upcoming" : "finished",
  }));

  const getPlayerDisplay = (matchIndex: number): string => {
    const matchTypes = [
      "5 players", // M1: Team Match
      "P2, P3", // M2: 1st Doubles
      "P1", // M3: 1st Singles (Best Player)
      "P4, P5", // M4: 2nd Doubles
      "P2", // M5: 2nd Singles
      "5 players", // M6: 2nd Team Match
      "P1, P3", // M7: 3rd Doubles
      "Px", // M8: 3rd Singles (Captain's Pick)
      "Py", // M9: 4th Singles (Captain's Pick)
    ];
    return matchTypes[matchIndex] || "Player";
  };

  const getMatchTitle = (matchIndex: number): string => {
    const matchTitles = [
      "M1: 1ST TEAM MATCH",
      "M2: 1ST DOUBLES",
      "M3: 1ST SINGLES (BEST PLAYER)",
      "M4: 2ND DOUBLES",
      "M5: 2ND SINGLES",
      "M6: 2ND TEAM MATCH",
      "M7: 3RD DOUBLES",
      "M8: 3RD SINGLES (CAPTAIN'S PICK)",
      "M9: 4TH SINGLES (CAPTAIN'S PICK)",
    ];
    return matchTitles[matchIndex] || `Match ${matchIndex + 1}`;
  };

  const renderMatches = (matches: Match[]) => (
    <div className="individual-matches">
      <h3 className="matches-title">INDIVIDUAL MATCHES</h3>
      <div className="matches-container">
        {matches.map((match, index) => (
          <div key={match.id} className="match-card">
            <div className="match-header">
              <span className="match-title">{getMatchTitle(index)}</span>
            </div>
            <div className="match-details">
              <div className="match-info">
                <span className="match-players">
                  {getPlayerDisplay(index)} ({match.player1.team})
                </span>
                <span className="opposing-players">
                  {getPlayerDisplay(index)} ({match.player2.team})
                </span>
              </div>
              <div className="match-score">
                <span className="team-score">
                  {match.player1.team}{" "}
                  <span className="score-number">{match.player1Wins}</span>
                </span>
                <span className="score-separator">-</span>
                <span className="team-score">
                  <span className="score-number">{match.player2Wins}</span>{" "}
                  {match.player2.team}
                </span>
              </div>
              <div className="match-race-display">
                <span className="race-to-text">RACE TO {match.raceTo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="tournament-grid">
      {/* Semifinal 1 Column */}
      <div className="tournament-column">
        <div className="column-header">
          <h2>Semifinal 1</h2>
          <div className="overall-score">
            <span className="team-name">{warriors}</span>
            <span className="score">3</span>
            <span className="score-separator">-</span>
            <span className="score">2</span>
            <span className="team-name">{cavs}</span>
          </div>
        </div>
        <div className="matches-section">
          {renderMatches(semifinal1Matches)}
        </div>
      </div>

      {/* Finals Column */}
      <div className="tournament-column">
        <div className="column-header">
          <h2>Finals</h2>
          <div className="overall-score">
            <span className="team-name">{lakers}</span>
            <span className="score">2</span>
            <span className="score-separator">-</span>
            <span className="score">1</span>
            <span className="team-name">{warriors}</span>
          </div>
        </div>
        <div className="matches-section">{renderMatches(finalsMatches)}</div>
      </div>

      {/* Semifinal 2 Column */}
      <div className="tournament-column">
        <div className="column-header">
          <h2>Semifinal 2</h2>
          <div className="overall-score">
            <span className="team-name">{lakers}</span>
            <span className="score">4</span>
            <span className="score-separator">-</span>
            <span className="score">1</span>
            <span className="team-name">{heat}</span>
          </div>
        </div>
        <div className="matches-section">
          {renderMatches(semifinal2Matches)}
        </div>
      </div>
    </div>
  );
};

export default TournamentsPage;
