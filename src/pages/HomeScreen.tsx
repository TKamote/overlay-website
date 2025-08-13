import React, { useState, useEffect } from "react";
import { useData } from "../hooks/useData";
import "./HomeScreen.css";
import AllMatchesDisplay from "../components/AllMatchesDisplay";
import TournamentInfo from "../components/TournamentInfo";
import PlayersRanking from "../components/PlayersRanking";
import OverallScoreDisplay from "../components/OverallScoreDisplay";
import TournamentHistory from "../components/TournamentHistory";

const HomeScreen: React.FC = () => {
  const { data } = useData();
  const [activeTab, setActiveTab] = useState("overall");

  useEffect(() => {
    // When the live tournament disappears, reset the view to the history tab.
    if (data.error) {
      setActiveTab("history");
    }
  }, [data.error]);

  if (data.isLoading) {
    return <div className="loading-container">Loading tournament data...</div>;
  }

  const hasLiveTournament = !data.error;
  const displayedTab = hasLiveTournament ? activeTab : "history";

  const renderContent = () => {
    if (!hasLiveTournament) {
      return <TournamentHistory />;
    }

    switch (activeTab) {
      case "overall":
        return <OverallScoreDisplay tournaments={data.tournaments} />;
      case "allMatches":
        return <AllMatchesDisplay />;
      case "details":
        return <TournamentInfo />;
      case "ranking":
        return <PlayersRanking />;
      case "history":
        return <TournamentHistory />;
      default:
        // This case should ideally not be reached if there's a live tournament,
        // but as a fallback, show the history.
        return <TournamentHistory />;
    }
  };

  return (
    <div className="home-screen glass-card">
      <h1>{data.rawData?.tournamentName || "Tournament Dashboard"}</h1>
      <div className="tabs">
        <button
          className={displayedTab === "overall" ? "active" : ""}
          onClick={() => setActiveTab("overall")}
          disabled={!hasLiveTournament}
        >
          Overall Match
        </button>
        <button
          className={displayedTab === "allMatches" ? "active" : ""}
          onClick={() => setActiveTab("allMatches")}
          disabled={!hasLiveTournament}
        >
          All Matches
        </button>
        <button
          className={displayedTab === "details" ? "active" : ""}
          onClick={() => setActiveTab("details")}
          disabled={!hasLiveTournament}
        >
          Tournament Info
        </button>
        <button
          className={displayedTab === "ranking" ? "active" : ""}
          onClick={() => setActiveTab("ranking")}
          disabled={!hasLiveTournament}
        >
          Ranking
        </button>
        <button
          className={displayedTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Tournament History
        </button>
      </div>
      <div className="tab-content">
        {data.isLoading ? (
          <div className="loading-container">Loading tournament data...</div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
