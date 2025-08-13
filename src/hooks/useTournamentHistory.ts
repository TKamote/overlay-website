import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import db from "../config/firebase";
import type { FirebaseDocumentData } from "../types/tournament";

// Extend the base type to include the fields we add during archiving/fetching
export interface ArchivedTournament extends FirebaseDocumentData {
  id: string; // The Firestore document ID
  archivedAt: Date; // The timestamp when it was archived
}

export const useTournamentHistory = (userId: string) => {
  const [history, setHistory] = useState<ArchivedTournament[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      // Not an error, just no user to fetch for.
      return;
    }

    setIsLoading(true);
    const historyCollectionRef = collection(db, "users", userId, "history");
    const q = query(historyCollectionRef, orderBy("archivedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const historyData = querySnapshot.docs.map((doc) => {
          const data = doc.data() as FirebaseDocumentData & { archivedAt: any };
          return {
            ...data,
            id: doc.id,
            // Convert Firestore Timestamp to JS Date
            archivedAt: data.archivedAt?.toDate
              ? data.archivedAt.toDate()
              : new Date(),
          };
        });
        setHistory(historyData);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching tournament history:", err);
        setError("Failed to fetch tournament history.");
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  return { history, isLoading, error };
};
