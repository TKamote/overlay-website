import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  Firestore,
} from "firebase/firestore";
// Firebase data interfaces
interface FirebaseTeamData {
  id?: string;
  name: string;
  captain: string;
  manager: string;
  color: string;
  icon: string;
  players: string;
}

interface FirebaseUpdateData {
  [key: string]: string | number | boolean | undefined;
}

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

// Initialize Firebase with error handling
let app;
let db: Firestore;

try {
  console.log("Initializing Firebase...");
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

// Collection references
export const teamsCollection = collection(db, "teams");
export const playersCollection = collection(db, "players");
export const tournamentsCollection = collection(db, "tournaments");
export const matchesCollection = collection(db, "matches");

// User's tournament data (actual structure)
export const getUserTournamentData = async () => {
  try {
    console.log("Fetching tournament data...");
    console.log("Firebase project ID:", firebaseConfig.projectId);
    console.log("Firebase app initialized:", !!app);
    console.log("Firestore instance:", !!db);

    // Get the tournament document
    const tournamentRef = doc(db, "current");
    console.log("Looking for document at path: current");
    console.log("Document reference:", tournamentRef);

    const userTournamentDoc = await getDoc(tournamentRef);
    console.log("Document exists:", userTournamentDoc.exists());
    console.log("Document ID:", userTournamentDoc.id);
    console.log("Document path:", userTournamentDoc.ref.path);

    if (userTournamentDoc.exists()) {
      const data = userTournamentDoc.data();
      console.log("✅ User tournament data found:", data);
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
        teams = data.confirmedTeams.map(
          (teamData: FirebaseTeamData, index: number) => ({
            id: teamData.id || `team-${index}`,
            name: teamData.name,
            captain: teamData.captain,
            manager: teamData.manager,
            color: teamData.color,
            icon: teamData.icon,
            players: teamData.players,
          })
        );
      } else if (data.semiFinal1 && data.semiFinal1.teams) {
        // Extract teams from semiFinal1
        teams = Object.entries(data.semiFinal1.teams).map(([key, teamData]) => {
          const typedTeamData = teamData as FirebaseTeamData;
          return {
            id: typedTeamData.id || key,
            name: typedTeamData.name,
            captain: typedTeamData.captain,
            manager: typedTeamData.manager,
            color: typedTeamData.color,
            icon: typedTeamData.icon,
            players: typedTeamData.players,
          };
        });
      } else if (data.final && data.final.teams) {
        // Extract teams from final
        teams = Object.entries(data.final.teams).map(([key, teamData]) => {
          const typedTeamData = teamData as FirebaseTeamData;
          return {
            id: typedTeamData.id || key,
            name: typedTeamData.name,
            captain: typedTeamData.captain,
            manager: typedTeamData.manager,
            color: typedTeamData.color,
            icon: typedTeamData.icon,
            players: typedTeamData.players,
          };
        });
      } else {
        // Fallback: try to extract teams from root level
        teams = Object.entries(data)
          .filter(
            ([, value]) =>
              typeof value === "object" &&
              value !== null &&
              (value as FirebaseTeamData).name
          )
          .map(([key, teamData]: [string, FirebaseTeamData]) => ({
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
      console.log("No tournament data found at path: current");
      console.log(
        "Document does not exist. Check the path in Firebase console."
      );
      return { teams: [], tournaments: [] };
    }
  } catch (error) {
    console.error("Error fetching user tournament data:", error);
    return { teams: [], tournaments: [] };
  }
};

// Real-time listeners
export const subscribeToTeams = (callback: (teams: unknown[]) => void) => {
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

export const subscribeToPlayers = (callback: (players: unknown[]) => void) => {
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
  callback: (tournaments: unknown[]) => void
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

export const subscribeToMatches = (callback: (matches: unknown[]) => void) => {
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
  updates: FirebaseUpdateData
) => {
  const matchRef = doc(db, "matches", matchId);
  await updateDoc(matchRef, updates);
};

export const updateTeamScore = async (
  teamId: string,
  updates: FirebaseUpdateData
) => {
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
