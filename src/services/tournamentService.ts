import { doc, getDoc, addDoc, deleteDoc, collection } from "firebase/firestore";
import db from "../config/firebase";

/**
 * Archives the current tournament document by copying it to the 'history'
 * collection and then deleting the 'current' tournament document.
 * @param userId The ID of the user whose tournament is to be archived.
 */
export const archiveCurrentTournament = async (
  userId: string
): Promise<void> => {
  if (!userId) {
    throw new Error("User ID is required to archive a tournament.");
  }

  const currentTournamentRef = doc(
    db,
    "users",
    userId,
    "tournament",
    "current"
  );
  const historyCollectionRef = collection(db, "users", userId, "history");

  try {
    // 1. Get the current tournament data
    const docSnap = await getDoc(currentTournamentRef);

    if (!docSnap.exists()) {
      throw new Error("No current tournament found to archive.");
    }

    const tournamentData = docSnap.data();

    // Add a timestamp for when the tournament was archived
    const archivedData = {
      ...tournamentData,
      archivedAt: new Date(),
    };

    // 2. Add the data as a new document in the 'history' collection
    await addDoc(historyCollectionRef, archivedData);

    // 3. Delete the 'current' tournament document
    await deleteDoc(currentTournamentRef);

    console.log("Tournament archived successfully!");
  } catch (error) {
    console.error("Error archiving tournament:", error);
    throw new Error("Failed to archive the tournament.");
  }
};
