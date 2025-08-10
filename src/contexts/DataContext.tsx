import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
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

const DataContext = createContext<DataContextType>({
  data: {
    rawData: null,
    tournaments: [],
    teams: [],
    allPlayers: [],
    activeMatches: [],
    playerRankings: [],
    isLoading: true,
    lastUpdated: new Date(),
    error: null,
  },
  refreshData: () => {},
  getTeamById: () => undefined,
  getPlayerById: () => undefined,
  getActiveTournament: () => undefined,
});

export const useData = () => {
  console.log("useData hook called");
  const context = useContext(DataContext);
  console.log("useData context value:", context);
  return context;
};

interface DataProviderProps {
  children: ReactNode;
  userId?: string;
}

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  userId = import.meta.env.VITE_FIREBASE_USER_ID ||
    "quGTVYdwKDhiF7TNIsk40brjRg33", // Configurable user ID
}) => {
  console.log("DataProvider rendering with userId:", userId);
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

  // Firebase path for tournament data - updated to match actual Firebase structure
  const FIREBASE_PATH = `users/${userId}/tournament/current`;

  // Process raw Firebase data into structured format
  const processFirebaseData = (rawData: any): CentralizedData => {
    const teams: TeamData[] = [];
    const allPlayers: Player[] = [];
    const tournaments: Tournament[] = [];
    const activeMatches: Match[] = [];
    const playerRankings: PlayerRanking[] = [];

    console.log("Processing Firebase data:", rawData);

    // Extract teams from confirmedTeams - YOUR ACTUAL DATA STRUCTURE
    if (rawData.confirmedTeams && Array.isArray(rawData.confirmedTeams)) {
      teams.push(
        ...rawData.confirmedTeams.map((team: any) => ({
          id: team.id,
          name: team.name,
          captain: team.captain,
          manager: team.manager,
          color: team.color,
          icon: team.icon,
          players: team.players
            ? team.players.map((p: any) => p.name).join(", ")
            : "",
        }))
      );
    }

    // Extract players from teams
    teams.forEach((team) => {
      if (rawData.confirmedTeams) {
        const teamData = rawData.confirmedTeams.find(
          (t: any) => t.id === team.id
        );
        if (teamData && teamData.players && Array.isArray(teamData.players)) {
          const teamPlayers = teamData.players.map((player: any) => ({
            id: player.id,
            name: player.name,
            team: team.name,
            score: 0,
            wins: 0,
            losses: 0,
          }));
          allPlayers.push(...teamPlayers);
        }
      }
    });

    // Process semifinal tournaments - YOUR ACTUAL DATA STRUCTURE
    if (rawData.semiFinal1) {
      const semiFinal1Data = rawData.semiFinal1;
      const team1 = teams.find(
        (t) => t.id === semiFinal1Data.matches?.[0]?.team1Id
      );
      const team2 = teams.find(
        (t) => t.id === semiFinal1Data.matches?.[0]?.team2Id
      );

      const semiFinal1: Tournament = {
        id: "semi-final-1",
        name: `${rawData.tournamentName || "PBS Invitational"} - Semifinal A`,
        status: semiFinal1Data.isCompleted ? "finished" : "active",
        players: allPlayers.filter((p) =>
          teams.some(
            (t) =>
              t.name === p.team && (t.id === team1?.id || t.id === team2?.id)
          )
        ),
        matches:
          semiFinal1Data.matches?.map((match: any) => ({
            id: match.id,
            player1: {
              id: match.team1Id,
              name: team1?.name || "Team 1",
              score: 0,
              team: team1?.name,
            },
            player2: {
              id: match.team2Id,
              name: team2?.name || "Team 2",
              score: 0,
              team: team2?.name,
            },
            player1Wins: match.team1Score || 0,
            player2Wins: match.team2Score || 0,
            raceTo: parseInt(rawData.raceToScore) || 5,
            isFeatured: false,
            status: match.isCompleted ? "finished" : "active",
          })) || [],
        currentRound: 1,
        totalRounds: 3,
        overallScore: {
          team1Score: team1
            ? semiFinal1Data.matches?.reduce(
                (sum: number, m: any) => sum + (m.team1Score || 0),
                0
              ) || 0
            : 0,
          team2Score: team2
            ? semiFinal1Data.matches?.reduce(
                (sum: number, m: any) => sum + (m.team2Score || 0),
                0
              ) || 0
            : 0,
          team1Name: team1?.name || "Team 1",
          team2Name: team2?.name || "Team 2",
        },
      };
      tournaments.push(semiFinal1);
    }

    if (rawData.semiFinal2) {
      const semiFinal2Data = rawData.semiFinal2;
      const team1 = teams.find(
        (t) => t.id === semiFinal2Data.matches?.[0]?.team1Id
      );
      const team2 = teams.find(
        (t) => t.id === semiFinal2Data.matches?.[0]?.team2Id
      );

      const semiFinal2: Tournament = {
        id: "semi-final-2",
        name: `${rawData.tournamentName || "PBS Invitational"} - Semifinal B`,
        status: semiFinal2Data.isCompleted ? "finished" : "active",
        players: allPlayers.filter((p) =>
          teams.some(
            (t) =>
              t.name === p.team && (t.id === team1?.id || t.id === team2?.id)
          )
        ),
        matches:
          semiFinal2Data.matches?.map((match: any) => ({
            id: match.id,
            player1: {
              id: match.team1Id,
              name: team1?.name || "Team 1",
              score: 0,
              team: team1?.name,
            },
            player2: {
              id: match.team2Id,
              name: team2?.name || "Team 2",
              score: 0,
              team: team2?.name,
            },
            player1Wins: match.team1Score || 0,
            player2Wins: match.team2Score || 0,
            raceTo: parseInt(rawData.raceToScore) || 5,
            isFeatured: false,
            status: match.isCompleted ? "finished" : "active",
          })) || [],
        currentRound: 1,
        totalRounds: 3,
        overallScore: {
          team1Score: team1
            ? semiFinal2Data.matches?.reduce(
                (sum: number, m: any) => sum + (m.team1Score || 0),
                0
              ) || 0
            : 0,
          team2Score: team2
            ? semiFinal2Data.matches?.reduce(
                (sum: number, m: any) => sum + (m.team2Score || 0),
                0
              ) || 0
            : 0,
          team1Name: team1?.name || "Team 1",
          team2Name: team2?.name || "Team 2",
        },
      };
      tournaments.push(semiFinal2);
    }

    // Process final tournament - YOUR ACTUAL DATA STRUCTURE
    if (rawData.final) {
      const finalData = rawData.final;
      const team1 = teams.find((t) => t.id === finalData.matches?.[0]?.team1Id);
      const team2 = teams.find((t) => t.id === finalData.matches?.[0]?.team2Id);

      const final: Tournament = {
        id: "tournament-final",
        name: `${rawData.tournamentName || "PBS Invitational"} - FINAL`,
        status: finalData.isCompleted ? "finished" : "active",
        players: allPlayers,
        matches:
          finalData.matches?.map((match: any) => ({
            id: match.id,
            player1: {
              id: match.team1Id,
              name: team1?.name || "Team 1",
              score: 0,
              team: team1?.name,
            },
            player2: {
              id: match.team2Id,
              name: team2?.name || "Team 2",
              score: 0,
              team: team2?.name,
            },
            player1Wins: match.team1Score || 0,
            player2Wins: match.team2Score || 0,
            raceTo: parseInt(rawData.raceToScore) || 5,
            isFeatured: false,
            status: match.isCompleted ? "finished" : "active",
          })) || [],
        currentRound: 3,
        totalRounds: 3,
        overallScore: {
          team1Score: team1
            ? finalData.matches?.reduce(
                (sum: number, m: any) => sum + (m.team1Score || 0),
                0
              ) || 0
            : 0,
          team2Score: team2
            ? finalData.matches?.reduce(
                (sum: number, m: any) => sum + (m.team2Score || 0),
                0
              ) || 0
            : 0,
          team1Name: team1?.name || "Team 1",
          team2Name: team2?.name || "Team 2",
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
    console.log("Connecting to Firebase path:", FIREBASE_PATH);
    console.log("Using user ID:", userId);

    const docRef = doc(db, "users", userId, "tournament", "current");
    console.log("Document reference created:", docRef.path);

    // Real-time listener for Firebase data
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        console.log("Firebase snapshot received");
        console.log("Document exists:", docSnapshot.exists());
        console.log("Document ID:", docSnapshot.id);
        console.log("Document path:", docSnapshot.ref.path);

        if (docSnapshot.exists()) {
          console.log("✅ Firebase data received from:", FIREBASE_PATH);
          const rawData = docSnapshot.data() as FirebaseDocumentData;
          console.log("Firebase data:", rawData);
          console.log("Data keys:", Object.keys(rawData));

          const processedData = processFirebaseData(rawData);
          setData(processedData);
        } else {
          console.log("❌ No data found at:", FIREBASE_PATH);
          console.log("Document does not exist or is empty");
          setData((prev) => ({
            ...prev,
            isLoading: false,
            error:
              "No tournament data found at users/" +
              userId +
              "/tournament/current",
          }));
        }
      },
      (error) => {
        console.error("Firebase listener error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
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

  console.log("DataProvider providing context value:", contextValue);

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
