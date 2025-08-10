// Firebase Configuration
export const FIREBASE_CONFIG = {
  // User ID for tournament data - can be changed via environment variable
  USER_ID:
    import.meta.env.VITE_FIREBASE_USER_ID || "quGTVYdwKDhiF7TNIsk40brjRg33",

  // Firebase paths
  PATHS: {
    TOURNAMENT_DATA: (userId: string) => `users/${userId}/tournament/current`,
  },

  // Collection names
  COLLECTIONS: {
    USERS: "users",
    TOURNAMENT: "tournament",
    TEAMS: "teams",
    PLAYERS: "players",
    TOURNAMENTS: "tournaments",
    MATCHES: "matches",
  },
};

// Helper function to get tournament document reference
export const getTournamentDocRef = (userId?: string) => {
  const finalUserId = userId || FIREBASE_CONFIG.USER_ID;
  return {
    path: FIREBASE_CONFIG.PATHS.TOURNAMENT_DATA(finalUserId),
    userId: finalUserId,
  };
};
