import React from "react";
import { useData } from "../contexts/DataContext";
import "./Match1Display.css";

const Match1Display: React.FC = () => {
  const { data } = useData();

  if (data.isLoading) {
    return <div className="match1-loading">Loading Match 1 data...</div>;
  }

  if (data.error) {
    return <div className="match1-error">Error: {data.error}</div>;
  }

  // Extract Match 1 (Semifinal 1) data from Firebase
  const rawData = data.rawData;
  const semiFinal1 = rawData?.semiFinal1;
  const confirmedTeams = rawData?.confirmedTeams || [];

  // Get teams for Match 1 from confirmedTeams array
  const team1 = confirmedTeams[0];
  const team2 = confirmedTeams[1];

  // Get scores from the correct fields
  const team1Score = semiFinal1?.team1Score || semiFinal1?.teamScores?.[0] || 0;
  const team2Score = semiFinal1?.team2Score || semiFinal1?.teamScores?.[1] || 0;

  // Get players for Match 1
  const match1Players = data.allPlayers.filter(
    (player) => player.team === team1?.name || player.team === team2?.name
  );

  const team1Players = match1Players.filter(
    (player) => player.team === team1?.name
  );
  const team2Players = match1Players.filter(
    (player) => player.team === team2?.name
  );

  return (
    <div className="match1-display">
      <div className="match1-header">
        <h3>Match 1: Semifinal 1</h3>
        {rawData?.tournamentName && (
          <p className="tournament-name">{rawData.tournamentName}</p>
        )}
      </div>

      {/* Main Match Score */}
      <div className="main-match-score">
        <div className="team-score left-team">
          <div className="team-icon">{team1?.icon || "🏆"}</div>
          <div className="team-name">{team1?.name || "Team 1"}</div>
          <div className="score">{team1Score}</div>
        </div>
        <div className="score-separator">-</div>
        <div className="team-score right-team">
          <div className="score">{team2Score}</div>
          <div className="team-name">{team2?.name || "Team 2"}</div>
          <div className="team-icon">{team2?.icon || "🛡️"}</div>
        </div>
      </div>

      {/* Individual Matches Section */}
      {semiFinal1 && (
        <div className="individual-matches-section">
          <h4>Individual Matches</h4>
          <div className="matches-grid">
            {[1, 2, 3, 4, 5].map((matchNum) => {
              const match =
                semiFinal1[`match${matchNum}` as keyof typeof semiFinal1];
              if (
                !match ||
                typeof match !== "object" ||
                !("team1Score" in match)
              )
                return null;

              return (
                <div key={matchNum} className="individual-match-card">
                  <div className="match-header">
                    <h5>Match {matchNum}</h5>
                    {(match as any).winner && (
                      <span className="winner-badge">
                        🏆 {(match as any).winner}
                      </span>
                    )}
                  </div>
                  <div className="match-score">
                    <span className="team-score">
                      {(match as any).team1Score || 0}
                    </span>
                    <span className="score-separator">-</span>
                    <span className="team-score">
                      {(match as any).team2Score || 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Match 1: Team Match */}
      <div className="match-card">
        <div className="match-card-header">
          <h4>Match 1: Team Match</h4>
        </div>
        <div className="match-details">
          <p>Players: {team1Players.map((p) => p.name).join(", ")}</p>
          <p>Race to {rawData?.raceToScore || 5}</p>
        </div>
        <div className="team-scores">
          <div className="team-score-card left">
            <div className="team-icon">{team1?.icon || "🏆"}</div>
            <div className="team-name">{team1?.name || "Team 1"}</div>
            <div className="score">{team1Score}</div>
            {semiFinal1?.winner === team1?.name && (
              <div className="status-badge completed">Completed</div>
            )}
          </div>
          <div className="team-score-card right">
            <div className="team-icon">{team2?.icon || "🛡️"}</div>
            <div className="team-name">{team2?.name || "Team 2"}</div>
            <div className="score">{team2Score}</div>
            {semiFinal1?.winner === team2?.name && (
              <div className="status-badge completed">Completed</div>
            )}
          </div>
        </div>
      </div>

      {/* Players Section - Side by Side */}
      <div className="players-section">
        <h4>All Players</h4>
        <div className="players-container">
          <div className="team-players left-team">
            <h5>{team1?.name || "Team 1"} Players:</h5>
            <div className="players-list">
              {team1Players.map((player) => (
                <div key={player.id} className="player-item">
                  <span className="player-name">{player.name}</span>
                  <span className="player-stats">
                    W: {player.wins || 0} L: {player.losses || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="team-players right-team">
            <h5>{team2?.name || "Team 2"} Players:</h5>
            <div className="players-list">
              {team2Players.map((player) => (
                <div key={player.id} className="player-item">
                  <span className="player-name">{player.name}</span>
                  <span className="player-stats">
                    W: {player.wins || 0} L: {player.losses || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Match Status */}
      <div className="match-status-card">
        <div className="status-header">
          <h4>Match Status</h4>
        </div>
        <div className="status-details">
          <p>Current Match: {semiFinal1?.currentMatch || "Not started"}</p>
          <p>Winner: {semiFinal1?.winner || "None"}</p>
          <p>Race to {rawData?.raceToScore || 5}</p>
        </div>
      </div>

      {/* Match Progress */}
      <div className="match-progress-card">
        <h4>Match Progress</h4>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                (Math.max(team1Score, team2Score) /
                  (rawData?.raceToScore || 5)) *
                100
              }%`,
            }}
          ></div>
        </div>
        <div className="progress-text">
          {Math.max(team1Score, team2Score)} / {rawData?.raceToScore || 5}{" "}
          points
        </div>
      </div>

      {/* Winner Announcement */}
      {semiFinal1?.winner && (
        <div className="winner-announcement">
          <div className="winner-badge">
            <span className="trophy">🏆</span>
            <span className="winner-text">WINNER: {semiFinal1.winner}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Match1Display;
