import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserTournamentData, fetchInitialData } from "../services/firebase";

// Data interfaces
interface Team {
  id: string;
  name: string;
  captain: string;
  manager: string;
  color: string;
  icon?: string;
  players: Player[];
}

interface Player {
  id: string;
  name: string;
  team: string;
  points?: number;
}

interface Match {
  id: string;
  player1: Player;
  player2: Player;
  player1Wins: number;
  player2Wins: number;
  raceTo: number;
  status: "upcoming" | "active" | "finished";
}

interface AppData {
  teams: Team[];
  players: Player[];
  matches: Match[];
  loading: boolean;
  error: string | null;
}

// Sample fallback data
const fallbackData = {
  teams: [
    {
      id: "team-1",
      name: "Warriors",
      captain: "John Smith",
      manager: "Mike Johnson",
      color: "Blue",
      players: [
        { id: "p1", name: "John Smith", team: "Warriors", points: 15 },
        { id: "p2", name: "Mike Davis", team: "Warriors", points: 18 },
        { id: "p3", name: "Chris Lee", team: "Warriors", points: 11 },
      ],
    },
    {
      id: "team-2",
      name: "Cavs",
      captain: "Sarah Wilson",
      manager: "David Brown",
      color: "Red",
      players: [
        { id: "p4", name: "Sarah Johnson", team: "Cavs", points: 12 },
        { id: "p5", name: "Emma Wilson", team: "Cavs", points: 9 },
        { id: "p6", name: "Sophie Brown", team: "Cavs", points: 7 },
      ],
    },
    {
      id: "team-3",
      name: "Lakers",
      captain: "Alex Chen",
      manager: "Lisa Wang",
      color: "Purple",
      players: [
        { id: "p7", name: "Alex Chen", team: "Lakers", points: 8 },
        { id: "p8", name: "David Kim", team: "Lakers", points: 9 },
      ],
    },
    {
      id: "team-4",
      name: "Heat",
      captain: "Tom Davis",
      manager: "Emma Rodriguez",
      color: "Orange",
      players: [
        { id: "p9", name: "Maria Rodriguez", team: "Heat", points: 6 },
        { id: "p10", name: "Lisa Wang", team: "Heat", points: 4 },
      ],
    },
  ],
  players: [
    { id: "p1", name: "John Smith", team: "Warriors", points: 15 },
    { id: "p2", name: "Mike Davis", team: "Warriors", points: 18 },
    { id: "p3", name: "Chris Lee", team: "Warriors", points: 11 },
    { id: "p4", name: "Sarah Johnson", team: "Cavs", points: 12 },
    { id: "p5", name: "Emma Wilson", team: "Cavs", points: 9 },
    { id: "p6", name: "Sophie Brown", team: "Cavs", points: 7 },
    { id: "p7", name: "Alex Chen", team: "Lakers", points: 8 },
    { id: "p8", name: "David Kim", team: "Lakers", points: 9 },
    { id: "p9", name: "Maria Rodriguez", team: "Heat", points: 6 },
    { id: "p10", name: "Lisa Wang", team: "Heat", points: 4 },
  ],
};

// Create context
const DataContext = createContext<AppData | undefined>(undefined);

// Data Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<AppData>({
    teams: [],
    players: [],
    matches: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log("🔄 Starting to fetch data...");
      setData((prev) => ({ ...prev, loading: true, error: null }));

      let firebaseData = fallbackData; // Start with fallback data

      try {
        // Try to get user-specific data first
        console.log("📡 Trying user-specific data...");
        const userData = await getUserTournamentData();
        console.log("📦 User-specific Firebase response:", userData);

        if (userData && userData.teams && userData.teams.length > 0) {
          firebaseData = userData;
        } else {
          throw new Error("No user data found");
        }
      } catch (userError) {
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
              teams: generalData.teams.map((team: any) => ({
                id: team.id,
                name: team.name,
                captain: team.captain || "Captain",
                manager: team.manager || "Manager",
                color: team.color || "Blue",
                icon: team.icon,
                players: team.players || [],
              })),
              tournaments: generalData.tournaments,
            };
          } else {
            throw new Error("No general data found");
          }
        } catch (generalError) {
          console.log("⚠️ General collections failed, using fallback data...");
          firebaseData = fallbackData;
        }
      }

      // Transform data to our format
      const teams = firebaseData.teams || [];
      console.log("🏀 Teams loaded:", teams);

      const players = teams.flatMap((team: any) => {
        // Handle different players data formats from Firebase
        let teamPlayers = [];

        if (Array.isArray(team.players)) {
          // If it's already an array, use it
          teamPlayers = team.players;
        } else if (team.players && typeof team.players === "object") {
          // If it's an object, convert it to array (RN app format)
          teamPlayers = Object.values(team.players);
        } else if (typeof team.players === "string") {
          // If it's a comma-separated string, split it into array
          teamPlayers = team.players.split(",").map((name: string) => ({
            name: name.trim(),
            team: team.name,
          }));
        }

        console.log(`🔍 Team "${team.name}" players data:`, {
          teamName: team.name,
          playersType: typeof team.players,
          playersIsArray: Array.isArray(team.players),
          playersValue: team.players,
          playersLength: teamPlayers.length,
          convertedPlayers: teamPlayers,
        });

        return teamPlayers.map((player: any) => ({
          id: player.id || `player-${Math.random()}`,
          name: player.name,
          team: team.name,
          points: player.points || 0,
        }));
      });
      console.log("👥 Players loaded:", players);

      // For now, matches will be static until we implement dynamic updates
      const matches: Match[] = [];

      setData({
        teams,
        players,
        matches,
        loading: false,
        error: null,
      });

      console.log("✅ Data loaded successfully:", {
        teams,
        players,
        matches,
      });
    };

    fetchData();
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

// Custom hook to use the data
export const useAppData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within a DataProvider");
  }
  return context;
};
