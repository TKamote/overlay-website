import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import type {
  TournamentData,
  ConfirmedTeam,
  MatchScore,
} from "../types/tournament";

// OwensCup Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAA_wfbF0ytUY3Qnd0YC9qHhkXO8QPC_iE",
  authDomain: "owenscup.firebaseapp.com",
  projectId: "owenscup",
  storageBucket: "owenscup.firebasestorage.app",
  messagingSenderId: "719761938656",
  appId: "1:719761938656:android:af1796bfe8a9848d0a9885",
  measurementId: "G-E11GSM385Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection references
export const teamsCollection = collection(db, "teams");
export const playersCollection = collection(db, "players");
export const tournamentsCollection = collection(db, "tournaments");
export const matchesCollection = collection(db, "matches");

// Helper function to convert confirmedTeams to our Team format
const convertConfirmedTeamsToTeams = (confirmedTeams: ConfirmedTeam[]) => {
  return confirmedTeams.map((team) => ({
    id: team.id.toString(),
    name: team.name,
    captain: team.captain,
    manager: team.manager,
    color: team.color,
    icon: team.icon,
    players: team.players.split(",").map((playerName, playerIndex) => ({
      id: `player-${team.id}-${playerIndex}`,
      name: playerName.trim(),
      team: team.name,
      points: 0,
    })),
  }));
};

// Helper function to convert matchScores to our Match format
const convertMatchScoresToMatches = (
  matchScores: MatchScore[],
  teams: Record<string, unknown>[],
  stageName: string
) => {
  return matchScores
    .filter((match) => match.team0Score > 0 || match.team1Score > 0) // Only include matches with scores
    .map((match) => ({
      id: `${stageName}-match-${match.matchIndex}`,
      player1Wins: match.team1Score,
      player2Wins: match.team0Score,
      player1: {
        id: `p1-${stageName}-${match.matchIndex}`,
        name: teams[1]?.name || "Team 1",
        team: teams[1]?.name || "Team 1",
        points: 0,
      },
      player2: {
        id: `p2-${stageName}-${match.matchIndex}`,
        name: teams[0]?.name || "Team 2",
        team: teams[0]?.name || "Team 2",
        points: 0,
      },
      raceTo: 5, // Default race to 5
      status: "finished" as const,
    }));
};

export const getUserTournamentData = async (
  userId: string = "hyBfhSIYRsMno2VYRRfIgPT8EmN2"
) => {
  try {
    console.log("Fetching user tournament data for userId:", userId);

    // Get the user's tournament document
    const userTournamentRef = doc(db, "users", userId, "tournament", "current");
    console.log(
      "Looking for document at path: users/",
      userId,
      "/tournament/current"
    );

    const userTournamentDoc = await getDoc(userTournamentRef);

    if (userTournamentDoc.exists()) {
      const data = userTournamentDoc.data() as TournamentData;
      console.log("User tournament data:", data);
      console.log("Data keys:", Object.keys(data));

      // Handle the new data structure
      let teams = [];
      let matches = [];

      if (data.confirmedTeams && data.confirmedTeams.length > 0) {
        console.log("✅ Found confirmedTeams:", data.confirmedTeams);

        // Convert confirmedTeams to our Team format
        teams = convertConfirmedTeamsToTeams(data.confirmedTeams);
        console.log("🏀 Converted teams:", teams);

        // Extract players from teams
        const players = teams.flatMap(
          (team: Record<string, unknown>) =>
            (
              team as {
                players: {
                  id: string;
                  name: string;
                  team: string;
                  points: number;
                }[];
              }
            ).players
        );
        console.log("👥 Players extracted:", players);

        // Process matches from different stages
        const allMatches = [];

        // Process semiFinal1 matches
        if (data.semiFinal1 && data.semiFinal1.matchScores) {
          const semiFinal1Matches = convertMatchScoresToMatches(
            data.semiFinal1.matchScores,
            teams,
            "semiFinal1"
          );
          allMatches.push(...semiFinal1Matches);
          console.log("🎯 SemiFinal1 matches:", semiFinal1Matches);
        }

        // Process semiFinal2 matches
        if (data.semiFinal2 && data.semiFinal2.matchScores) {
          const semiFinal2Matches = convertMatchScoresToMatches(
            data.semiFinal2.matchScores,
            teams,
            "semiFinal2"
          );
          allMatches.push(...semiFinal2Matches);
          console.log("🎯 SemiFinal2 matches:", semiFinal2Matches);
        }

        // Process final matches
        if (data.final && data.final.matchScores) {
          const finalMatches = convertMatchScoresToMatches(
            data.final.matchScores,
            teams,
            "final"
          );
          allMatches.push(...finalMatches);
          console.log("🎯 Final matches:", finalMatches);
        }

        matches = allMatches;
        console.log("✅ Total matches processed:", matches.length);

        return {
          teams,
          players,
          matches,
          tournaments: [],
          rawData: data,
          tournamentInfo: {
            name: data.tournamentName,
            organizer: data.organizer,
            raceToScore: data.raceToScore,
            champion: data.tournamentChampion,
          },
        };
      } else {
        console.log("❌ No confirmedTeams found in data");
        return { teams: [], players: [], tournaments: [] };
      }
    } else {
      console.log(
        "No user tournament data found at path: users/",
        userId,
        "/tournament/current"
      );
      return { teams: [], players: [], tournaments: [] };
    }
  } catch (error) {
    console.error("Error fetching user tournament data:", error);
    return { teams: [], players: [], tournaments: [] };
  }
};

// Real-time listeners
export const subscribeToTeams = (
  callback: (teams: Record<string, unknown>[]) => void
) => {
  return onSnapshot(
    teamsCollection,
    (snapshot) => {
      const teams = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(teams);
    },
    (error) => {
      console.error("Error subscribing to teams:", error);
    }
  );
};

export const subscribeToPlayers = (
  callback: (players: Record<string, unknown>[]) => void
) => {
  return onSnapshot(
    playersCollection,
    (snapshot) => {
      const players = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(players);
    },
    (error) => {
      console.error("Error subscribing to players:", error);
    }
  );
};

export const subscribeToTournaments = (
  callback: (tournaments: Record<string, unknown>[]) => void
) => {
  return onSnapshot(
    tournamentsCollection,
    (snapshot) => {
      const tournaments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(tournaments);
    },
    (error) => {
      console.error("Error subscribing to tournaments:", error);
    }
  );
};

export const subscribeToMatches = (
  callback: (matches: Record<string, unknown>[]) => void
) => {
  return onSnapshot(
    matchesCollection,
    (snapshot) => {
      const matches = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(matches);
    },
    (error) => {
      console.error("Error subscribing to matches:", error);
    }
  );
};

// Update functions
export const updateMatchScore = async (
  matchId: string,
  updates: Record<string, unknown>
) => {
  const matchRef = doc(db, "matches", matchId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateDoc(matchRef, updates as any);
};

export const updateTeamScore = async (
  teamId: string,
  updates: Record<string, unknown>
) => {
  const teamRef = doc(db, "teams", teamId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateDoc(teamRef, updates as any);
};

// Initial data fetcher
export const fetchInitialData = async () => {
  try {
    console.log("Fetching initial data from Firebase...");

    // Get tournaments
    const tournamentsSnapshot = await getDocs(tournamentsCollection);
    const tournaments = tournamentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Tournaments found:", tournaments);

    // Get teams
    const teamsSnapshot = await getDocs(teamsCollection);
    const teams = teamsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Teams found:", teams);

    return { tournaments, teams };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return { tournaments: [], teams: [] };
  }
};

export default db;
