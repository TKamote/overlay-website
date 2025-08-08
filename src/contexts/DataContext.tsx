import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";
import db from "../services/firebase";
import type {
  TeamData,
  FirebaseDocumentData,
  Tournament,
  Match,
  Player,
} from "../types/tournament";

// Centralized data structure
interface CentralizedData {
  // Raw Firebase data
  rawData: FirebaseDocumentData | null;

  // Processed tournament data
  tournaments: Tournament[];

  // Teams information
  teams: TeamData[];

  // All players across all teams
  allPlayers: Player[];

  // Current active matches
  activeMatches: Match[];

  // Rankings data
  playerRankings: PlayerRanking[];

  // Loading states
  isLoading: boolean;
  lastUpdated: Date;

  // Error handling
  error: string | null;
}

interface PlayerRanking {
  playerId: string;
  playerName: string;
  teamName: string;
  wins: number;
  losses: number;
  winRate: number;
}

interface DataContextType {
  data: CentralizedData;
  refreshData: () => void;
  getTeamById: (teamId: string) => TeamData | undefined;
  getPlayerById: (playerId: string) => Player | undefined;
  getActiveTournament: () => Tournament | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
  userId?: string;
}

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  userId = "hyBfhSIYRsMno2VYRRfIgPT8EmN2",
}) => {
  const [data, setData] = useState<CentralizedData>({
    rawData: null,
    tournaments: [],
    teams: [],
    allPlayers: [],
    activeMatches: [],
    playerRankings: [],
    isLoading: true,
    lastUpdated: new Date(),
    error: null,
  });

  // Process raw Firebase data into structured format
  const processFirebaseData = (
    rawData: FirebaseDocumentData
  ): CentralizedData => {
    const teams: TeamData[] = [];
    const allPlayers: Player[] = [];
    const tournaments: Tournament[] = [];
    const activeMatches: Match[] = [];
    const playerRankings: PlayerRanking[] = [];

    // Extract teams from confirmedTeams or other sources
    if (rawData.confirmedTeams) {
      teams.push(...rawData.confirmedTeams);
    }

    // Extract players from teams
    teams.forEach((team) => {
      if (team.players) {
        const teamPlayers = team.players.split(",").map((playerName) => ({
          id: `${team.id}-${playerName.trim()}`,
          name: playerName.trim(),
          team: team.name,
          score: 0, // Will be calculated from matches
          wins: 0, // Will be calculated from matches
          losses: 0, // Will be calculated from matches
        }));
        allPlayers.push(...teamPlayers);
      }
    });

    // Process semifinal tournaments
    if (rawData.semiFinal1) {
      const semiFinal1: Tournament = {
        id: "semi-final-1",
        name: "Owens Cup 2024 - Semifinal A",
        status: "active",
        players: allPlayers.filter((p) =>
          teams.some(
            (t) =>
              t.name === p.team &&
              (t.name === rawData.semiFinal1?.teams?.[0]?.name ||
                t.name === rawData.semiFinal1?.teams?.[1]?.name)
          )
        ),
        matches: [], // Will be populated from match data
        currentRound: 1,
        totalRounds: 3,
        overallScore: {
          team1Score: rawData.semiFinal1?.teamScores?.[0] || 0,
          team2Score: rawData.semiFinal1?.teamScores?.[1] || 0,
          team1Name:
            teams.find((t) => t.name === rawData.semiFinal1?.teams?.[0]?.name)
              ?.name || "Team 1",
          team2Name:
            teams.find((t) => t.name === rawData.semiFinal1?.teams?.[1]?.name)
              ?.name || "Team 2",
        },
      };
      tournaments.push(semiFinal1);
    }

    if (rawData.semiFinal2) {
      const semiFinal2: Tournament = {
        id: "semi-final-2",
        name: "Owens Cup 2024 - Semifinal B",
        status: "active",
        players: allPlayers.filter((p) =>
          teams.some(
            (t) =>
              t.name === p.team &&
              (t.name === rawData.semiFinal2?.teams?.[0]?.name ||
                t.name === rawData.semiFinal2?.teams?.[1]?.name)
          )
        ),
        matches: [],
        currentRound: 1,
        totalRounds: 3,
        overallScore: {
          team1Score: rawData.semiFinal2?.teamScores?.[0] || 0,
          team2Score: rawData.semiFinal2?.teamScores?.[1] || 0,
          team1Name:
            teams.find((t) => t.name === rawData.semiFinal2?.teams?.[0]?.name)
              ?.name || "Team 3",
          team2Name:
            teams.find((t) => t.name === rawData.semiFinal2?.teams?.[1]?.name)
              ?.name || "Team 4",
        },
      };
      tournaments.push(semiFinal2);
    }

    // Process final tournament
    if (rawData.final) {
      const final: Tournament = {
        id: "tournament-final",
        name: "Owens Cup 2024 - FINAL",
        status: "active",
        players: allPlayers,
        matches: [],
        currentRound: 3,
        totalRounds: 3,
        overallScore: {
          team1Score:
            rawData.final?.teamScores?.[0] || rawData.final?.team1Score || 0,
          team2Score:
            rawData.final?.teamScores?.[1] || rawData.final?.team2Score || 0,
          team1Name: rawData.final?.teams?.[0]?.name || "Warriors",
          team2Name: rawData.final?.teams?.[1]?.name || "Cavs",
        },
      };
      tournaments.push(final);
    }

    // Calculate player rankings based on match data
    // This would be calculated from actual match results
    playerRankings.push(
      ...allPlayers
        .map((player) => ({
          playerId: player.id,
          playerName: player.name,
          teamName: player.team || "",
          wins: player.wins || 0,
          losses: player.losses || 0,
          winRate:
            (player.losses || 0) > 0
              ? (player.wins || 0) / ((player.wins || 0) + (player.losses || 0))
              : (player.wins || 0) > 0
              ? 1
              : 0,
        }))
        .sort((a, b) => b.winRate - a.winRate)
    );

    return {
      rawData,
      tournaments,
      teams,
      allPlayers,
      activeMatches,
      playerRankings,
      isLoading: false,
      lastUpdated: new Date(),
      error: null,
    };
  };

  // Set up real-time Firebase listener
  useEffect(() => {
    console.log("Setting up real-time Firebase listener...");

    const userTournamentRef = doc(db, "users", userId, "tournament", "current");

    // Real-time listener - more efficient than polling
    const unsubscribe = onSnapshot(
      userTournamentRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const rawData = docSnapshot.data() as FirebaseDocumentData;
          console.log("Real-time Firebase update received:", rawData);

          const processedData = processFirebaseData(rawData);
          setData(processedData);
        } else {
          console.log("No tournament data found");
          setData((prev) => ({
            ...prev,
            isLoading: false,
            error: "No tournament data found",
          }));
        }
      },
      (error) => {
        console.error("Firebase listener error:", error);
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
      }
    );

    // Cleanup listener on unmount
    return () => {
      console.log("Cleaning up Firebase listener");
      unsubscribe();
    };
  }, [userId]);

  // Helper functions
  const getTeamById = (teamId: string) => {
    return data.teams.find((team) => team.id === teamId);
  };

  const getPlayerById = (playerId: string) => {
    return data.allPlayers.find((player) => player.id === playerId);
  };

  const getActiveTournament = () => {
    return data.tournaments.find((t) => t.status === "active");
  };

  const refreshData = () => {
    setData((prev) => ({ ...prev, isLoading: true }));
  };

  const contextValue: DataContextType = {
    data,
    refreshData,
    getTeamById,
    getPlayerById,
    getActiveTournament,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
