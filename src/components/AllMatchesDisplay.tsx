import React from "react";
import { useData } from "../contexts/DataContext";
import "./AllMatchesDisplay.css";

const AllMatchesDisplay: React.FC = () => {
  const { data } = useData();

  if (data.isLoading) {
    return (
      <div className="all-matches-loading">
        <div className="loading-spinner"></div>
        <p>Loading all matches...</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="all-matches-error">
        <h3>❌ Error loading matches</h3>
        <p>{data.error}</p>
      </div>
    );
  }

  const rawData = data.rawData;
  const confirmedTeams = rawData?.confirmedTeams || [];

  // Get team names
  const team1 = confirmedTeams[0]?.name || "Team 1";
  const team2 = confirmedTeams[1]?.name || "Team 2";

  // Get all active matches
  const activeMatches = [];

  // SemiFinal 1 - Individual Matches
  if (rawData?.semiFinal1) {
    const semiFinal1 = rawData.semiFinal1;

    // Look for individual match data
    const match1 = semiFinal1.match1;
    const match2 = semiFinal1.match2;
    const match3 = semiFinal1.match3;
    const match4 = semiFinal1.match4;
    const match5 = semiFinal1.match5;

    // Add individual matches if they exist
    if (match1) {
      activeMatches.push({
        id: "semi-final-1-match-1",
        name: "Semifinal 1 - Match 1",
        team1: team1,
        team2: team2,
        team1Score: match1.team1Score || 0,
        team2Score: match1.team2Score || 0,
        status: match1.winner ? "completed" : "active",
        winner: match1.winner,
        currentMatch: "Match 1",
        raceTo: rawData.raceToScore || 5,
      });
    }

    if (match2) {
      activeMatches.push({
        id: "semi-final-1-match-2",
        name: "Semifinal 1 - Match 2",
        team1: team1,
        team2: team2,
        team1Score: match2.team1Score || 0,
        team2Score: match2.team2Score || 0,
        status: match2.winner ? "completed" : "active",
        winner: match2.winner,
        currentMatch: "Match 2",
        raceTo: rawData.raceToScore || 5,
      });
    }

    if (match3) {
      activeMatches.push({
        id: "semi-final-1-match-3",
        name: "Semifinal 1 - Match 3",
        team1: team1,
        team2: team2,
        team1Score: match3.team1Score || 0,
        team2Score: match3.team2Score || 0,
        status: match3.winner ? "completed" : "active",
        winner: match3.winner,
        currentMatch: "Match 3",
        raceTo: rawData.raceToScore || 5,
      });
    }

    if (match4) {
      activeMatches.push({
        id: "semi-final-1-match-4",
        name: "Semifinal 1 - Match 4",
        team1: team1,
        team2: team2,
        team1Score: match4.team1Score || 0,
        team2Score: match4.team2Score || 0,
        status: match4.winner ? "completed" : "active",
        winner: match4.winner,
        currentMatch: "Match 4",
        raceTo: rawData.raceToScore || 5,
      });
    }

    if (match5) {
      activeMatches.push({
        id: "semi-final-1-match-5",
        name: "Semifinal 1 - Match 5",
        team1: team1,
        team2: team2,
        team1Score: match5.team1Score || 0,
        team2Score: match5.team2Score || 0,
        status: match5.winner ? "completed" : "active",
        winner: match5.winner,
        currentMatch: "Match 5",
        raceTo: rawData.raceToScore || 5,
      });
    }

    // Also add overall semifinal score
    const team1Score = semiFinal1.team1Score || semiFinal1.teamScores?.[0] || 0;
    const team2Score = semiFinal1.team2Score || semiFinal1.teamScores?.[1] || 0;

    activeMatches.push({
      id: "semi-final-1-overall",
      name: "Semifinal 1 - Overall",
      team1: team1,
      team2: team2,
      team1Score,
      team2Score,
      status: semiFinal1.winner ? "completed" : "active",
      winner: semiFinal1.winner,
      currentMatch: semiFinal1.currentMatch,
      raceTo: rawData.raceToScore || 5,
    });
  }

  // SemiFinal 2 - Individual Matches
  if (rawData?.semiFinal2) {
    const semiFinal2 = rawData.semiFinal2;

    // Look for individual match data
    const match1 = semiFinal2.match1;
    const match2 = semiFinal2.match2;
    const match3 = semiFinal2.match3;
    const match4 = semiFinal2.match4;
    const match5 = semiFinal2.match5;

    // Add individual matches if they exist
    if (match1) {
      activeMatches.push({
        id: "semi-final-2-match-1",
        name: "Semifinal 2 - Match 1",
        team1: team1,
        team2: team2,
        team1Score: match1.team1Score || 0,
        team2Score: match1.team2Score || 0,
        status: match1.winner ? "completed" : "active",
        winner: match1.winner,
        currentMatch: "Match 1",
        raceTo: rawData.raceToScore || 5,
      });
    }

    if (match2) {
      activeMatches.push({
        id: "semi-final-2-match-2",
        name: "Semifinal 2 - Match 2",
        team1: team1,
        team2: team2,
        team1Score: match2.team1Score || 0,
        team2Score: match2.team2Score || 0,
        status: match2.winner ? "completed" : "active",
        winner: match2.winner,
        currentMatch: "Match 2",
        raceTo: rawData.raceToScore || 5,
      });
    }

    if (match3) {
      activeMatches.push({
        id: "semi-final-2-match-3",
        name: "Semifinal 2 - Match 3",
        team1: team1,
        team2: team2,
        team1Score: match3.team1Score || 0,
        team2Score: match3.team2Score || 0,
        status: match3.winner ? "completed" : "active",
        winner: match3.winner,
        currentMatch: "Match 3",
        raceTo: rawData.raceToScore || 5,
      });
    }

    if (match4) {
      activeMatches.push({
        id: "semi-final-2-match-4",
        name: "Semifinal 2 - Match 4",
        team1: team1,
        team2: team2,
        team1Score: match4.team1Score || 0,
        team2Score: match4.team2Score || 0,
        status: match4.winner ? "completed" : "active",
        winner: match4.winner,
        currentMatch: "Match 4",
        raceTo: rawData.raceToScore || 5,
      });
    }

    if (match5) {
      activeMatches.push({
        id: "semi-final-2-match-5",
        name: "Semifinal 2 - Match 5",
        team1: team1,
        team2: team2,
        team1Score: match5.team1Score || 0,
        team2Score: match5.team2Score || 0,
        status: match5.winner ? "completed" : "active",
        winner: match5.winner,
        currentMatch: "Match 5",
        raceTo: rawData.raceToScore || 5,
      });
    }

    // Also add overall semifinal score
    const team1Score = semiFinal2.team1Score || semiFinal2.teamScores?.[0] || 0;
    const team2Score = semiFinal2.team2Score || semiFinal2.teamScores?.[1] || 0;

    activeMatches.push({
      id: "semi-final-2-overall",
      name: "Semifinal 2 - Overall",
      team1: team1,
      team2: team2,
      team1Score,
      team2Score,
      status: semiFinal2.winner ? "completed" : "active",
      winner: semiFinal2.winner,
      currentMatch: semiFinal2.currentMatch,
      raceTo: rawData.raceToScore || 5,
    });
  }

  // Final
  if (rawData?.final) {
    const final = rawData.final;
    const team1Score = final.team1Score || final.teamScores?.[0] || 0;
    const team2Score = final.team2Score || final.teamScores?.[1] || 0;

    activeMatches.push({
      id: "final",
      name: "Final",
      team1: team1,
      team2: team2,
      team1Score,
      team2Score,
      status: final.winner ? "completed" : "active",
      winner: final.winner,
      currentMatch: final.currentMatch,
      raceTo: rawData.raceToScore || 5,
    });
  }

  return (
    <div className="all-matches-display">
      <div className="matches-header">
        <h3>🎮 All Active Matches</h3>
        <p className="matches-subtitle">
          {activeMatches.length} match{activeMatches.length !== 1 ? "es" : ""}{" "}
          found
        </p>
      </div>

      {activeMatches.length === 0 ? (
        <div className="no-matches">
          <p>No active matches found</p>
          <p>Matches will appear here when they start</p>
        </div>
      ) : (
        <div className="matches-grid">
          {activeMatches.map((match) => (
            <div key={match.id} className={`match-card ${match.status}`}>
              <div className="match-header">
                <h4>{match.name}</h4>
                <div className={`status-badge ${match.status}`}>
                  {match.status === "completed" ? "🏆 COMPLETED" : "⚡ ACTIVE"}
                </div>
              </div>

              <div className="match-teams">
                <div
                  className={`team ${
                    match.team1Score > match.team2Score ? "leading" : ""
                  }`}
                >
                  <span className="team-name">{match.team1}</span>
                  <span className="team-score">{match.team1Score}</span>
                </div>

                <div className="vs-separator">VS</div>

                <div
                  className={`team ${
                    match.team2Score > match.team1Score ? "leading" : ""
                  }`}
                >
                  <span className="team-name">{match.team2}</span>
                  <span className="team-score">{match.team2Score}</span>
                </div>
              </div>

              <div className="match-details">
                <div className="race-to">
                  <span>Race to {match.raceTo}</span>
                </div>

                {match.currentMatch && (
                  <div className="current-match">
                    <span>Current: {match.currentMatch}</span>
                  </div>
                )}

                {match.winner && (
                  <div className="winner-announcement">
                    <span>🏆 Winner: {match.winner}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="match-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill team1-progress"
                    style={{
                      width: `${(match.team1Score / match.raceTo) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="progress-fill team2-progress"
                    style={{
                      width: `${(match.team2Score / match.raceTo) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="progress-labels">
                  <span>
                    {match.team1Score}/{match.raceTo}
                  </span>
                  <span>
                    {match.team2Score}/{match.raceTo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllMatchesDisplay;
