import { doc, getDoc } from "firebase/firestore";
import db from "../services/firebase";

// Debug function to extract all data from a specific document
export const debugFirebaseData = async (
  userId: string = "hyBfhSIYRsMno2VYRRfIgPT8EmN2"
) => {
  try {
    console.log("🔍 Debug: Fetching Firebase document...");

    const userTournamentRef = doc(db, "users", userId, "tournament", "current");
    const userTournamentDoc = await getDoc(userTournamentRef);

    if (userTournamentDoc.exists()) {
      const data = userTournamentDoc.data();

      console.log("🔍 Debug: Document exists!");
      console.log("🔍 Debug: Document ID:", userTournamentDoc.id);
      console.log("🔍 Debug: All field names:", Object.keys(data));
      console.log(
        "🔍 Debug: Full document data:",
        JSON.stringify(data, null, 2)
      );

      // Look for potential score fields
      const scoreFields = Object.keys(data).filter(
        (key) =>
          key.toLowerCase().includes("score") ||
          key.toLowerCase().includes("team") ||
          key.toLowerCase().includes("match")
      );

      console.log("🔍 Debug: Potential score fields:", scoreFields);

      // Check each potential score field
      scoreFields.forEach((field) => {
        console.log(`🔍 Debug: ${field}:`, data[field]);
      });

      return data;
    } else {
      console.log("❌ Debug: Document does not exist!");
      return null;
    }
  } catch (error) {
    console.error("❌ Debug: Error fetching document:", error);
    return null;
  }
};
