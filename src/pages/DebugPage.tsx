import React, { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import { doc, getDoc } from "firebase/firestore";
import db from "../services/firebase";

const DebugPage: React.FC = () => {
  const { data } = useData();
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Checking...");
  const [browserInfo, setBrowserInfo] = useState<any>({});

  useEffect(() => {
    // Check Firebase connection
    const checkFirebaseConnection = async () => {
      try {
        console.log("Testing Firebase connection...");
        setConnectionStatus("Testing Firebase connection...");

        // Simple test to see if Firebase is working
        const testDocRef = doc(db, "test", "test");
        await getDoc(testDocRef);
        setConnectionStatus("Firebase connected successfully");
      } catch (error) {
        console.error("Firebase connection error:", error);
        setConnectionStatus(`Firebase error: ${error}`);
      }
    };

    // Get browser information
    setBrowserInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      platform: navigator.platform,
      url: window.location.href,
      domain: window.location.hostname,
      protocol: window.location.protocol,
    });

    checkFirebaseConnection();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>🔧 Debug Page - tkamot.com</h1>

      <h2>🌐 Connection Status</h2>
      <div style={{ marginBottom: "20px" }}>
        <strong>Firebase:</strong> {connectionStatus}
      </div>

      <h2>📊 Data Status</h2>
      <div style={{ marginBottom: "20px" }}>
        <strong>Loading:</strong> {data.isLoading ? "Yes" : "No"}
        <br />
        <strong>Error:</strong> {data.error || "None"}
        <br />
        <strong>Teams:</strong> {data.teams.length}
        <br />
        <strong>Tournaments:</strong> {data.tournaments.length}
        <br />
        <strong>Last Updated:</strong> {data.lastUpdated.toLocaleString()}
      </div>

      <h2>🌍 Browser Information</h2>
      <div style={{ marginBottom: "20px" }}>
        <strong>URL:</strong> {browserInfo.url}
        <br />
        <strong>Domain:</strong> {browserInfo.domain}
        <br />
        <strong>Protocol:</strong> {browserInfo.protocol}
        <br />
        <strong>Online:</strong> {browserInfo.onLine ? "Yes" : "No"}
        <br />
        <strong>Language:</strong> {browserInfo.language}
        <br />
        <strong>Platform:</strong> {browserInfo.platform}
      </div>

      <h2>📋 Raw Data</h2>
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "10px",
          borderRadius: "5px",
          maxHeight: "300px",
          overflow: "auto",
        }}
      >
        <pre>{JSON.stringify(data.rawData, null, 2)}</pre>
      </div>

      <h2>🛠️ Troubleshooting</h2>
      <div style={{ marginTop: "20px" }}>
        <h3>If the site is not loading:</h3>
        <ol>
          <li>Check if Firebase is accessible (see connection status above)</li>
          <li>Verify your domain DNS settings point to the correct server</li>
          <li>Ensure the web server is running and serving the dist/ folder</li>
          <li>Check browser console for JavaScript errors</li>
          <li>Try accessing the site in an incognito/private window</li>
        </ol>

        <h3>Common Issues:</h3>
        <ul>
          <li>
            <strong>CORS Issues:</strong> Check if your server allows
            cross-origin requests
          </li>
          <li>
            <strong>Firebase Rules:</strong> Ensure Firebase security rules
            allow read access
          </li>
          <li>
            <strong>Network Issues:</strong> Check if the domain resolves
            correctly
          </li>
          <li>
            <strong>SSL/HTTPS:</strong> Ensure proper SSL certificate for
            tkamot.com
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DebugPage;
