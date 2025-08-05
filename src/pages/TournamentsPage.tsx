import React from "react";
import { useAppData } from "../hooks/useAppData";
import type { Match } from "../contexts/AppContext";
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

  // Check if we have enough teams for tournament structure
  if (teams.length < 4) {
    return (
      <div className="tournament-grid">
        <div className="tournament-setup-message">
          <h3>Tournament Setup</h3>
          <p>Waiting for all 4 teams to be finalized...</p>
          <p>Teams added: {teams.length}/4</p>
        </div>
      </div>
    );
  }

  // Use real team data
  const semifinal1Team1 = teams[0]?.name || "Team 1";
  const semifinal1Team2 = teams[1]?.name || "Team 2";
  const semifinal2Team1 = teams[2]?.name || "Team 3";
  const semifinal2Team2 = teams[3]?.name || "Team 4";

  // Static data with real team names
  const semifinal1Matches: Match[] = Array.from({ length: 9 }, (_, i) => ({
    id: `semifinal1-match-${i + 1}`,
    player1: {
      id: `p1-${i}`,
      name: "Player",
      team: semifinal1Team1,
      points: 0,
    },
    player2: {
      id: `p2-${i}`,
      name: "Player",
      team: semifinal1Team2,
      points: 0,
    },
    player1Wins: [3, 2, 4, 1, 3, 2, 4, 1, 3][i] || 0,
    player2Wins: [2, 3, 1, 4, 2, 3, 1, 4, 2][i] || 0,
    raceTo: 5,
    status: i < 3 ? "active" : i < 6 ? "upcoming" : "finished",
  }));

  const semifinal2Matches: Match[] = Array.from({ length: 9 }, (_, i) => ({
    id: `semifinal2-match-${i + 1}`,
    player1: {
      id: `p1-${i}`,
      name: "Player",
      team: semifinal2Team1,
      points: 0,
    },
    player2: {
      id: `p2-${i}`,
      name: "Player",
      team: semifinal2Team2,
      points: 0,
    },
    player1Wins: [4, 3, 2, 4, 3, 2, 4, 3, 2][i] || 0,
    player2Wins: [1, 2, 3, 1, 2, 3, 1, 2, 3][i] || 0,
    raceTo: 5,
    status: i < 3 ? "active" : i < 6 ? "upcoming" : "finished",
  }));

  const finalsMatches: Match[] = Array.from({ length: 9 }, (_, i) => ({
    id: `finals-match-${i + 1}`,
    player1: {
      id: `p1-${i}`,
      name: "Player",
      team: semifinal1Team1,
      points: 0,
    },
    player2: {
      id: `p2-${i}`,
      name: "Player",
      team: semifinal2Team1,
      points: 0,
    },
    player1Wins: [2, 3, 1, 4, 2, 3, 1, 4, 2][i] || 0,
    player2Wins: [1, 2, 3, 1, 2, 3, 1, 2, 3][i] || 0,
    raceTo: 5,
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
            <span className="team-name">{semifinal1Team1}</span>
            <span className="score">3</span>
            <span className="score-separator">-</span>
            <span className="score">2</span>
            <span className="team-name">{semifinal1Team2}</span>
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
            <span className="team-name">{semifinal1Team1}</span>
            <span className="score">2</span>
            <span className="score-separator">-</span>
            <span className="score">1</span>
            <span className="team-name">{semifinal2Team1}</span>
          </div>
        </div>
        <div className="matches-section">{renderMatches(finalsMatches)}</div>
      </div>

      {/* Semifinal 2 Column */}
      <div className="tournament-column">
        <div className="column-header">
          <h2>Semifinal 2</h2>
          <div className="overall-score">
            <span className="team-name">{semifinal2Team1}</span>
            <span className="score">4</span>
            <span className="score-separator">-</span>
            <span className="score">1</span>
            <span className="team-name">{semifinal2Team2}</span>
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
