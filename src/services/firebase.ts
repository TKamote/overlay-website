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

// User's tournament data (actual structure)
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
      const data = userTournamentDoc.data();
      console.log("User tournament data:", data);
      console.log("Data keys:", Object.keys(data));
      console.log("Data structure details:");

      // Log each top-level property to understand the structure
      Object.entries(data).forEach(([key, value]) => {
        console.log(`Key: ${key}, Type: ${typeof value}, Value:`, value);
      });

      // Handle the actual data structure from Firebase
      let teams = [];

      if (data.confirmedTeams) {
        // Extract teams from confirmedTeams array
        teams = data.confirmedTeams.map((teamData: any, index: number) => ({
          id: teamData.id || `team-${index}`,
          name: teamData.name,
          captain: teamData.captain,
          manager: teamData.manager,
          color: teamData.color,
          icon: teamData.icon,
          players: teamData.players,
        }));
      } else if (data.semiFinal1 && data.semiFinal1.teams) {
        // Extract teams from semiFinal1
        teams = Object.entries(data.semiFinal1.teams).map(
          ([key, teamData]: [string, any]) => ({
            id: teamData.id || key,
            name: teamData.name,
            captain: teamData.captain,
            manager: teamData.manager,
            color: teamData.color,
            icon: teamData.icon,
            players: teamData.players,
          })
        );
      } else if (data.final && data.final.teams) {
        // Extract teams from final
        teams = Object.entries(data.final.teams).map(
          ([key, teamData]: [string, any]) => ({
            id: teamData.id || key,
            name: teamData.name,
            captain: teamData.captain,
            manager: teamData.manager,
            color: teamData.color,
            icon: teamData.icon,
            players: teamData.players,
          })
        );
      } else {
        // Fallback: try to extract teams from root level
        teams = Object.entries(data)
          .filter(
            ([key, value]) =>
              typeof value === "object" && value !== null && value.name
          )
          .map(([key, teamData]: [string, any]) => ({
            id: teamData.id || key,
            name: teamData.name,
            captain: teamData.captain,
            manager: teamData.manager,
            color: teamData.color,
            icon: teamData.icon,
            players: teamData.players,
          }));
      }

      console.log("Converted teams:", teams);

      // Return the complete data structure for overlay processing
      return {
        teams,
        tournaments: [],
        rawData: data, // Include the raw data for overlay processing
      };
    } else {
      console.log(
        "No user tournament data found at path: users/",
        userId,
        "/tournament/current"
      );
      console.log(
        "Document does not exist. Check the user ID and path in Firebase console."
      );
      return { teams: [], tournaments: [] };
    }
  } catch (error) {
    console.error("Error fetching user tournament data:", error);
    return { teams: [], tournaments: [] };
  }
};

// Real-time listeners
export const subscribeToTeams = (callback: (teams: any[]) => void) => {
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

export const subscribeToPlayers = (callback: (players: any[]) => void) => {
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
  callback: (tournaments: any[]) => void
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

export const subscribeToMatches = (callback: (matches: any[]) => void) => {
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
export const updateMatchScore = async (matchId: string, updates: any) => {
  const matchRef = doc(db, "matches", matchId);
  await updateDoc(matchRef, updates);
};

export const updateTeamScore = async (teamId: string, updates: any) => {
  const teamRef = doc(db, "teams", teamId);
  await updateDoc(teamRef, updates);
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
