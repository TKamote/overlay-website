import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// OwensCup Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual API key
  authDomain: "owenscup.firebaseapp.com",
  projectId: "owenscup",
  storageBucket: "owenscup.firebasestorage.app",
  messagingSenderId: "719761938656",
  appId: "1:719761GTVYdwKDhiF7TNIsk40brjRg33:android:af1796bfe8a9848d0a9885",
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

export default db;
