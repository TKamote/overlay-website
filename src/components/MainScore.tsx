import React from "react";
import { useAppData } from "../hooks/useAppData";
import type { Match } from "../contexts/AppContext";
import "./MainScore.css";

interface TournamentMatch {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
}

interface TournamentStage {
  title: string;
  matches: TournamentMatch[];
}

const MainScore: React.FC = () => {
  const { teams, matches, loading, error } = useAppData();

  if (loading) {
    return (
      <div className="score-grid">
        <div className="loading-message">Loading tournament data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="score-grid">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  // Check if we have enough teams for tournament structure
  if (teams.length < 4) {
    return (
      <div className="score-grid">
        <div className="tournament-setup-message">
          <h3>Tournament Setup</h3>
          <p>Waiting for all 4 teams to be finalized...</p>
          <p>Teams added: {teams.length}/4</p>
        </div>
      </div>
    );
  }

  // Use real team data - first 2 teams vs last 2 teams
  const semifinal1Team1 = teams[0]?.name || "Team 1";
  const semifinal1Team2 = teams[1]?.name || "Team 2";
  const semifinal2Team1 = teams[2]?.name || "Team 3";
  const semifinal2Team2 = teams[3]?.name || "Team 4";

  // Calculate real scores from match data
  let semifinal1Score1 = 0;
  let semifinal1Score2 = 0;
  let semifinal2Score1 = 0;
  let semifinal2Score2 = 0;

  if (matches && matches.length > 0) {
    console.log("🎯 Using real match data for MainScore:", matches);
    console.log("🔍 Total matches found:", matches.length);
    console.log(
      "🔍 All match IDs:",
      matches.map((m: Match) => m.id)
    );

    // Get individual match scores (found by recursive search)
    const individualMatches = matches.filter((match: Match) =>
      match.id.includes("individual-match")
    );
    console.log("🔍 Individual matches found:", individualMatches);
    console.log("🔍 Individual match count:", individualMatches.length);

    if (individualMatches.length > 0) {
      console.log("🔍 All individual matches found:", individualMatches);

      // Find the match that corresponds to the first semifinal (WBB vs PinoySargo)
      const semifinal1Match = individualMatches.find(
        (match: Match) =>
          match.player1?.team === "WBB" || match.player2?.team === "PinoySargo"
      );

      if (semifinal1Match) {
        console.log("🎯 Found semifinal 1 match:", semifinal1Match);
        semifinal1Score1 = semifinal1Match.player1Wins;
        semifinal1Score2 = semifinal1Match.player2Wins;
        console.log(
          "📊 Semifinal 1 scores (WBB vs PinoySargo):",
          semifinal1Score1,
          semifinal1Score2
        );
      } else {
        // Fallback to first match if no specific match found
        const firstIndividualMatch = individualMatches[0];
        console.log(
          "🎯 Using first individual match as fallback:",
          firstIndividualMatch
        );
        semifinal1Score1 = firstIndividualMatch.player1Wins;
        semifinal1Score2 = firstIndividualMatch.player2Wins;
        console.log(
          "📊 Using first match scores for semifinal 1:",
          semifinal1Score1,
          semifinal1Score2
        );
      }

      // Find the match that corresponds to the second semifinal (Team SG vs Karambola)
      const semifinal2Match = individualMatches.find(
        (match: Match) =>
          match.player1?.team === "Team SG" ||
          match.player2?.team === "Karambola"
      );

      if (semifinal2Match) {
        console.log("🎯 Found semifinal 2 match:", semifinal2Match);
        semifinal2Score1 = semifinal2Match.player1Wins;
        semifinal2Score2 = semifinal2Match.player2Wins;
        console.log(
          "📊 Semifinal 2 scores (Team SG vs Karambola):",
          semifinal2Score1,
          semifinal2Score2
        );
      } else if (individualMatches.length > 1) {
        // Fallback to second match if no specific match found
        const secondIndividualMatch = individualMatches[1];
        console.log(
          "🎯 Using second individual match as fallback:",
          secondIndividualMatch
        );
        semifinal2Score1 = secondIndividualMatch.player1Wins;
        semifinal2Score2 = secondIndividualMatch.player2Wins;
        console.log(
          "📊 Using second match scores for semifinal 2:",
          semifinal2Score1,
          semifinal2Score2
        );
      } else {
        console.log("⚠️ No second match found for semifinal 2");
      }

      console.log(
        "🔍 Individual match details:",
        individualMatches.map((m: Match) => ({
          id: m.id,
          p1: m.player1Wins,
          p2: m.player2Wins,
          team1: m.player1?.team,
          team2: m.player2?.team,
        }))
      );
    } else {
      console.log("❌ No individual matches found");
      // Fallback to current-match if no individual matches found
      const currentMatch = matches.find(
        (match: Match) => match.id === "current-match"
      );
      if (currentMatch) {
        console.log("🎯 Found current match:", currentMatch);
        console.log(
          "🎯 Current match scores:",
          currentMatch.player1Wins,
          currentMatch.player2Wins
        );

        // Use the current match scores directly for semifinal 1
        semifinal1Score1 = currentMatch.player1Wins;
        semifinal1Score2 = currentMatch.player2Wins;

        console.log(
          "📊 Using current match scores for semifinal 1:",
          semifinal1Score1,
          semifinal1Score2
        );
      } else {
        console.log("❌ No current match found either");
      }
    }
  } else {
    console.log("❌ No matches found at all");
  }

  // Tournament data with real scores
  const tournamentData: TournamentStage[] = [
    {
      title: "SEMIFINAL 1",
      matches: [
        {
          team1: semifinal1Team1,
          team2: semifinal1Team2,
          score1: semifinal1Score1,
          score2: semifinal1Score2,
        },
      ],
    },
    {
      title: "SEMIFINAL 2",
      matches: [
        {
          team1: semifinal2Team1,
          team2: semifinal2Team2,
          score1: semifinal2Score1,
          score2: semifinal2Score2,
        },
      ],
    },
    {
      title: "FINALS",
      matches: [
        {
          team1:
            semifinal1Score1 > semifinal1Score2
              ? semifinal1Team1
              : semifinal1Team2,
          team2:
            semifinal2Score1 > semifinal2Score2
              ? semifinal2Team1
              : semifinal2Team2,
          score1: 0,
          score2: 0,
        },
      ],
    },
  ];

  const renderMatch = (match: TournamentMatch) => (
    <div key={`${match.team1}-${match.team2}`} className="match-container">
      <div className="teams-row">
        <span className="team-name">{match.team1}</span>
        <span className="vs-text">VS</span>
        <span className="team-name">{match.team2}</span>
      </div>
      <div className="score-row">
        <span key={`score1-${match.team1}-${match.team2}`} className="score">
          {match.score1}
        </span>
        <span className="score-separator">-</span>
        <span key={`score2-${match.team1}-${match.team2}`} className="score">
          {match.score2}
        </span>
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
