import React from "react";
import "./MainScore.css";

interface Match {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
}

interface TournamentStage {
  title: string;
  matches: Match[];
}

const MainScore: React.FC = () => {
  // Sample tournament data - in a real app this would come from props or API
  const tournamentData: TournamentStage[] = [
    {
      title: "SEMIFINAL 1",
      matches: [
        {
          team1: "Warriors",
          team2: "Cavs",
          score1: 3,
          score2: 2,
        },
      ],
    },
    {
      title: "SEMIFINAL 2",
      matches: [
        {
          team1: "Lakers",
          team2: "Heat",
          score1: 4,
          score2: 1,
        },
      ],
    },
    {
      title: "FINALS",
      matches: [
        {
          team1: "Lakers",
          team2: "Warriors",
          score1: 2,
          score2: 1,
        },
      ],
    },
  ];

  const renderMatch = (match: Match) => (
    <div key={`${match.team1}-${match.team2}`} className="match-container">
      <div className="teams-row">
        <span className="team-name">{match.team1}</span>
        <span className="vs-text">VS</span>
        <span className="team-name">{match.team2}</span>
      </div>
      <div className="score-row">
        <span className="score">{match.score1}</span>
        <span className="score-separator">-</span>
        <span className="score">{match.score2}</span>
      </div>
    </div>
  );

  return (
    <div className="score-grid">
      <div className="semifinal-container">
        {/* Semifinal 1 */}
        <div className="semifinal-card">
          <h3>{tournamentData[0].title}</h3>
          {tournamentData[0].matches.map((match) => renderMatch(match))}
        </div>

        {/* Semifinal 2 */}
        <div className="semifinal-card">
          <h3>{tournamentData[1].title}</h3>
          {tournamentData[1].matches.map((match) => renderMatch(match))}
        </div>
      </div>

      {/* Finals */}
      <div className="finals-card">
        <h3>{tournamentData[2].title}</h3>
        {tournamentData[2].matches.map((match) => renderMatch(match))}
      </div>
    </div>
  );
};

export default MainScore;
