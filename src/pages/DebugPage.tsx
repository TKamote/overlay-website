import React, { useState, useEffect } from "react";
import { getUserTournamentData } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import db from "../services/firebase";
import type { UserTournamentData } from "../types/tournament";
import "./TournamentsPage.css"; // Reuse the same styling

const DebugPage: React.FC = () => {
  const [firebaseData, setFirebaseData] = useState<UserTournamentData>({
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
        console.log("DebugPage: Loading live Firebase data...");

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

        console.log("DebugPage: Live data loaded", {
          teams,
          tournaments,
          rawData,
        });
      } catch (error) {
        console.error("DebugPage: Error loading data", error);
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
        <div className="loading">Loading live Firebase data...</div>
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
        <h1>🔧 Live Firebase Debug Data</h1>
        <p className="subtitle">
          Real-time data from your Firebase database - Updated:{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>

      <div className="data-grid">
        {/* Raw Data Section Only */}
        <div className="data-section">
          <h2>Raw Firebase Data</h2>
          <div className="data-cards">
            <div className="data-card raw-data-card">
              <h3>Complete Firebase Document</h3>
              <div className="raw-data">
                <pre>{JSON.stringify(firebaseData.rawData, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
