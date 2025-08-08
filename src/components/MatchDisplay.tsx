import React from "react";
import { useData } from "../contexts/DataContext";
import "./MatchDisplay.css";

const MatchDisplay: React.FC = () => {
  const { data } = useData();

  if (data.isLoading) {
    return <div className="match-display-loading">Loading match data...</div>;
  }

  if (data.error) {
    return <div className="match-display-error">Error: {data.error}</div>;
  }

  // Extract live data from Firebase
  const rawData = data.rawData;
  const semiFinal1 = rawData?.semiFinal1;
  const semiFinal2 = rawData?.semiFinal2;
  const final = rawData?.final;

  // Get live scores from tournaments
  const tournaments = data.tournaments;
  const semiFinal1Tournament = tournaments.find((t) => t.id === "semi-final-1");
  const semiFinal2Tournament = tournaments.find((t) => t.id === "semi-final-2");
  const finalTournament = tournaments.find((t) => t.id === "tournament-final");

  return (
    <div className="match-display">
      <div className="match-header">
        <h3>Live Matches</h3>
        <div className="refresh-icon">🔄</div>
      </div>

      {/* Main Score Summary - Show overall tournament score */}
      {semiFinal1Tournament?.overallScore && (
        <div className="main-score-card">
          <div className="team-score left-team">
            <div className="team-icon">🏆</div>
            <div className="team-name">
              {semiFinal1Tournament.overallScore.team1Name}
            </div>
            <div className="score">
              {semiFinal1Tournament.overallScore.team1Score}
            </div>
          </div>
          <div className="score-separator">-</div>
          <div className="team-score right-team">
            <div className="score">
              {semiFinal1Tournament.overallScore.team2Score}
            </div>
            <div className="team-name">
              {semiFinal1Tournament.overallScore.team2Name}
            </div>
            <div className="team-icon">🛡️</div>
          </div>
        </div>
      )}

      {/* SemiFinal 1 */}
      {semiFinal1 && (
        <div className="match-card">
          <div className="match-card-header">
            <h4>SemiFinal 1</h4>
            <div className="match-actions">
              <span className="refresh-icon">🔄</span>
            </div>
          </div>
          <div className="match-details">
            <p>Current Match: {semiFinal1.currentMatch || "Not started"}</p>
            <p>Winner: {semiFinal1.winner || "None"}</p>
            <p>Race to {rawData?.raceToScore || 5}</p>
          </div>
          {semiFinal1Tournament?.overallScore && (
            <div className="team-scores">
              <div className="team-score-card left">
                <div className="team-icon">🏆</div>
                <div className="team-name">
                  {semiFinal1Tournament.overallScore.team1Name}
                </div>
                <div className="score">
                  {semiFinal1Tournament.overallScore.team1Score}
                </div>
                {semiFinal1.winner ===
                  semiFinal1Tournament.overallScore.team1Name && (
                  <div className="status-badge completed">Winner</div>
                )}
              </div>
              <div className="team-score-card right">
                <div className="team-icon">🛡️</div>
                <div className="team-name">
                  {semiFinal1Tournament.overallScore.team2Name}
                </div>
                <div className="score">
                  {semiFinal1Tournament.overallScore.team2Score}
                </div>
                {semiFinal1.winner ===
                  semiFinal1Tournament.overallScore.team2Name && (
                  <div className="status-badge completed">Winner</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SemiFinal 2 */}
      {semiFinal2 && (
        <div className="match-card">
          <div className="match-card-header">
            <h4>SemiFinal 2</h4>
            <div className="match-actions">
              <span className="refresh-icon">🔄</span>
            </div>
          </div>
          <div className="match-details">
            <p>Current Match: {semiFinal2.currentMatch || "Not started"}</p>
            <p>Winner: {semiFinal2.winner || "None"}</p>
            <p>Race to {rawData?.raceToScore || 5}</p>
          </div>
          {semiFinal2Tournament?.overallScore && (
            <div className="team-scores">
              <div className="team-score-card left">
                <div className="team-icon">🏆</div>
                <div className="team-name">
                  {semiFinal2Tournament.overallScore.team1Name}
                </div>
                <div className="score">
                  {semiFinal2Tournament.overallScore.team1Score}
                </div>
                {semiFinal2.winner ===
                  semiFinal2Tournament.overallScore.team1Name && (
                  <div className="status-badge completed">Winner</div>
                )}
              </div>
              <div className="team-score-card right">
                <div className="team-icon">🛡️</div>
                <div className="team-name">
                  {semiFinal2Tournament.overallScore.team2Name}
                </div>
                <div className="score">
                  {semiFinal2Tournament.overallScore.team2Score}
                </div>
                {semiFinal2.winner ===
                  semiFinal2Tournament.overallScore.team2Name && (
                  <div className="status-badge completed">Winner</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Final */}
      {final && (
        <div className="match-card">
          <div className="match-card-header">
            <h4>Final</h4>
            <div className="match-actions">
              <span className="refresh-icon">🔄</span>
            </div>
          </div>
          <div className="match-details">
            <p>Current Match: {final.currentMatch || "Not started"}</p>
            <p>Winner: {final.winner || "None"}</p>
            <p>Race to {rawData?.raceToScore || 5}</p>
          </div>
          {finalTournament?.overallScore && (
            <div className="team-scores">
              <div className="team-score-card left">
                <div className="team-icon">🏆</div>
                <div className="team-name">
                  {finalTournament.overallScore.team1Name}
                </div>
                <div className="score">
                  {finalTournament.overallScore.team1Score}
                </div>
                {final.winner === finalTournament.overallScore.team1Name && (
                  <div className="status-badge completed">Winner</div>
                )}
              </div>
              <div className="team-score-card right">
                <div className="team-icon">🛡️</div>
                <div className="team-name">
                  {finalTournament.overallScore.team2Name}
                </div>
                <div className="score">
                  {finalTournament.overallScore.team2Score}
                </div>
                {final.winner === finalTournament.overallScore.team2Name && (
                  <div className="status-badge completed">Winner</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show message if no live matches */}
      {!semiFinal1 && !semiFinal2 && !final && (
        <div className="match-card">
          <div className="match-details">
            <p>No active matches found</p>
            <p>Check back later for live updates</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDisplay;
