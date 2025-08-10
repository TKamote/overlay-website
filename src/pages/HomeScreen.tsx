import React, { useState } from "react";
import { useData } from "../hooks/useData";
import "./HomeScreen.css";
import AllMatchesDisplay from "../components/AllMatchesDisplay";
import TournamentInfo from "../components/TournamentInfo";
import PlayersRanking from "../components/PlayersRanking";
import OverallScoreDisplay from "../components/OverallScoreDisplay";

const HomeScreen: React.FC = () => {
  const { data } = useData();
  const [activeTab, setActiveTab] = useState("overall");

  if (data.isLoading) {
    return <div className="loading-container">Loading tournament data...</div>;
  }

  if (data.error || !data) {
    return (
      <div className="error-container">
        Error: {data.error || "No data available"}
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overall":
        return <OverallScoreDisplay tournaments={data.tournaments} />;
      case "allMatches":
        return <AllMatchesDisplay />;
      case "details":
        return <TournamentInfo />;
      case "ranking":
        return <PlayersRanking />;
      default:
        return null;
    }
  };

  return (
    <div className="home-screen">
      <h1>{data.rawData?.tournamentName || "Tournament Dashboard"}</h1>
      <div className="tabs">
        <button
          className={activeTab === "overall" ? "active" : ""}
          onClick={() => setActiveTab("overall")}
        >
          Overall Match
        </button>
        <button
          className={activeTab === "allMatches" ? "active" : ""}
          onClick={() => setActiveTab("allMatches")}
        >
          All Matches
        </button>
        <button
          className={activeTab === "details" ? "active" : ""}
          onClick={() => setActiveTab("details")}
        >
          Tournament Info
        </button>
        <button
          className={activeTab === "ranking" ? "active" : ""}
          onClick={() => setActiveTab("ranking")}
        >
          Ranking
        </button>
      </div>
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default HomeScreen;
