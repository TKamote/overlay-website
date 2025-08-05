import React, { useEffect, useState } from "react";
import { getUserTournamentData, fetchInitialData } from "../services/firebase";
import { debugFirebaseData } from "../utils/debugFirebase";
import { doc, onSnapshot } from "firebase/firestore";
import db from "../services/firebase";
import { fallbackData } from "../utils/fallbackData";
import { DataContext } from "./AppContext";
import type {
  AppData,
  Team,
  Player,
  Match,
  TournamentInfo,
} from "./AppContext";

// Re-export DataContext for the hook
export { DataContext };

// Data Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<AppData>({
    teams: [],
    players: [],
    matches: [],
    tournamentInfo: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    console.log("🚀 DataProvider useEffect triggered - starting data fetch");

    const fetchData = async () => {
      console.log("🔄 Starting to fetch data...");
      setData((prev) => ({ ...prev, loading: true, error: null }));

      // Run debug function to extract all Firebase data (safely)
      try {
        console.log(
          "🔍 Running debug function to extract all Firebase data..."
        );
        await debugFirebaseData();
      } catch (debugError) {
        console.log(
          "⚠️ Debug function failed, continuing with normal data fetch:",
          debugError
        );
      }

      let firebaseData: typeof fallbackData = fallbackData; // Start with fallback data
      let tournamentInfo: TournamentInfo | null = null;

      try {
        // Try to get user-specific data first
        console.log("📡 Trying user-specific data...");
        const userData = await getUserTournamentData();
        console.log("📦 User-specific Firebase response:", userData);

        if (userData && userData.teams && userData.teams.length > 0) {
          firebaseData = userData;
          tournamentInfo = userData.tournamentInfo || null;
        } else {
          throw new Error("No user data found");
        }
      } catch {
        console.log(
          "⚠️ User-specific data failed, trying general collections..."
        );

        try {
          // Fallback to general collections
          const generalData = await fetchInitialData();
          console.log("📦 General collections response:", generalData);

          if (
            generalData &&
            generalData.teams &&
            generalData.teams.length > 0
          ) {
            // Transform general data to our format
            firebaseData = {
              teams: generalData.teams.map((team: Record<string, unknown>) => ({
                id: team.id as string,
                name: team.name as string,
                captain: (team.captain as string) || "Captain",
                manager: (team.manager as string) || "Manager",
                color: (team.color as string) || "Blue",
                icon: team.icon as string,
                players: (team.players as Player[]) || [],
              })),
              players: [],
            };
          } else {
            throw new Error("No general data found");
          }
        } catch {
          console.log("⚠️ No teams found in Firebase - showing empty state");
          firebaseData = { teams: [], players: [] };
        }
      }

      // Transform data to our format
      const teams = firebaseData.teams || [];
      console.log("🏀 Teams loaded:", teams);

      // Extract players from teams (simplified to avoid type issues)
      const players = teams.flatMap((team: Team) => {
        if (!team.players) return [];

        if (Array.isArray(team.players)) {
          return team.players.map((player: Player) => ({
            id: player.id || `player-${Math.random()}`,
            name: player.name,
            team: team.name,
            points: player.points || 0,
          }));
        } else if (typeof team.players === "string") {
          return (team.players as string)
            .split(",")
            .map((playerName: string, index: number) => ({
              id: `player-${team.id}-${index}`,
              name: playerName.trim(),
              team: team.name,
              points: 0,
            }));
        } else if (typeof team.players === "object") {
          return Object.entries(team.players as Record<string, unknown>).map(
            ([key, player]: [string, unknown]) => ({
              id: (player as Player)?.id || key,
              name: (player as Player)?.name || key,
              team: team.name,
              points: (player as Player)?.points || 0,
            })
          );
        }
        return [];
      });
      console.log("👥 Players loaded:", players);

      // Get match data from the same document
      const userDataWithMatches = await getUserTournamentData(); // Re-fetch to ensure matches are included
      const matches = userDataWithMatches?.matches || [];
      console.log("✅ Matches loaded:", matches);
      console.log("🔍 Full userDataWithMatches:", userDataWithMatches);
      console.log("🔍 Matches array length:", matches.length);
      if (matches.length > 0) {
        console.log("🔍 First match:", matches[0]);
        console.log("🔍 First match id:", matches[0].id);
        console.log(
          "🔍 First match scores:",
          matches[0].player1Wins,
          matches[0].player2Wins
        );
      }

      setData({
        teams,
        players,
        matches: matches as Match[],
        tournamentInfo,
        loading: false,
        error: null,
      });

      console.log("✅ Data loaded successfully:", {
        teams,
        players,
        matches,
        tournamentInfo,
      });
    };

    fetchData();

    // Set up real-time listener for live updates
    const userId = "hyBfhSIYRsMno2VYRRfIgPT8EmN2";
    const userTournamentRef = doc(db, "users", userId, "tournament", "current");

    const unsubscribe = onSnapshot(
      userTournamentRef,
      (doc) => {
        if (doc.exists()) {
          console.log("🔄 Real-time update received:", doc.data());

          // Re-fetch data when Firebase document changes
          fetchData();
        }
      },
      (error) => {
        console.error("Error listening to real-time updates:", error);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
