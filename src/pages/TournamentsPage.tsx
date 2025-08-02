import React, { useState, useEffect } from "react";
import { getUserTournamentData } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import db from "../services/firebase";
import "./TournamentsPage.css";

interface FirebaseData {
  teams: any[];
  tournaments: any[];
  rawData: any;
}

const TournamentsPage: React.FC = () => {
  const [firebaseData, setFirebaseData] = useState<FirebaseData>({
    teams: [],
    tournaments: [],
    rawData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log("TournamentsPage: Loading Firebase data...");

        const { tournaments, teams } = await getUserTournamentData();

        // Get the raw data for debugging
        const userTournamentRef = doc(
          db,
          "users",
          "hyBfhSIYRsMno2VYRRfIgPT8EmN2",
          "tournament",
          "current"
        );
        const userTournamentDoc = await getDoc(userTournamentRef);
        const rawData = userTournamentDoc.exists()
          ? userTournamentDoc.data()
          : null;

        setFirebaseData({
          teams,
          tournaments,
          rawData,
        });

        console.log("TournamentsPage: Data loaded", {
          teams,
          tournaments,
          rawData,
        });
      } catch (error) {
        console.error("TournamentsPage: Error loading data", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="tournaments-page">
        <div className="loading">Loading live data from OwensCup...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tournaments-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="tournaments-page">
      <div className="page-header">
        <h1>Live OwensCup Data</h1>
        <p className="subtitle">Real-time data from your Firebase database</p>
      </div>

      <div className="data-grid">
        {/* Teams Section */}
        <div className="data-section">
          <h2>Teams ({firebaseData.teams.length})</h2>
          <div className="data-cards">
            {firebaseData.teams.map((team, index) => (
              <div key={team.id || index} className="data-card team-card">
                <h3>{team.name}</h3>
                <div className="team-stats">
                  <span className="stat">Captain: {team.captain}</span>
                  <span className="stat">Manager: {team.manager}</span>
                  <span className="stat">Color: {team.color}</span>
                  <span className="stat">Icon: {team.icon}</span>
                  <span className="stat">Players: {team.players}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Raw Data Section */}
        <div className="data-section">
          <h2>Raw Firebase Data</h2>
          <div className="data-cards">
            <div className="data-card raw-data-card">
              <h3>Tournament Info</h3>
              <div className="raw-data">
                <pre>{JSON.stringify(firebaseData.rawData, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Structure */}
        <div className="data-section">
          <h2>Tournament Structure</h2>
          <div className="data-cards">
            {firebaseData.rawData && (
              <>
                <div className="data-card tournament-card">
                  <h3>Tournament Name</h3>
                  <p>{firebaseData.rawData.tournamentName}</p>
                </div>
                <div className="data-card tournament-card">
                  <h3>Organizer</h3>
                  <p>{firebaseData.rawData.organizer}</p>
                </div>
                <div className="data-card tournament-card">
                  <h3>Race To Score</h3>
                  <p>{firebaseData.rawData.raceToScore}</p>
                </div>
                <div className="data-card tournament-card">
                  <h3>SemiFinal 1</h3>
                  <p>
                    Current Match:{" "}
                    {firebaseData.rawData.semiFinal1?.currentMatch}
                  </p>
                  <p>
                    Winner: {firebaseData.rawData.semiFinal1?.winner || "None"}
                  </p>
                </div>
                <div className="data-card tournament-card">
                  <h3>SemiFinal 2</h3>
                  <p>
                    Current Match:{" "}
                    {firebaseData.rawData.semiFinal2?.currentMatch}
                  </p>
                  <p>
                    Winner: {firebaseData.rawData.semiFinal2?.winner || "None"}
                  </p>
                </div>
                <div className="data-card tournament-card">
                  <h3>Final</h3>
                  <p>
                    Current Match: {firebaseData.rawData.final?.currentMatch}
                  </p>
                  <p>Winner: {firebaseData.rawData.final?.winner || "None"}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentsPage;
