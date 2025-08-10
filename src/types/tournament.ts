export interface Player {
  id: string;
  name: string;
  score: number;
  team?: string;
  wins?: number;
  losses?: number;
  designation: string; // Added designation
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  team1Score: number;
  team2Score: number;
  isCompleted: boolean;
  winnerId?: string;
}

// This represents the raw match object from Firebase
export interface FirebaseMatch {
  id: string;
  team1Id: string;
  team2Id: string;
  team1Score: number;
  team2Score: number;
  isCompleted: boolean;
  winnerId?: string;
}

export interface TeamScore {
  team1Id: string;
  team2Id: string;
  team1Score: number;
  team2Score: number;
  team1Name: string;
  team2Name: string;
}

// This represents a raw tournament stage from Firebase
export interface FirebaseTournamentStage {
  isCompleted: boolean;
  matches: FirebaseMatch[];
}

export interface Team {
  id: string;
  name: string;
  players: Player[]; // Changed from string[] to Player[]
  captain: string;
  manager: string;
  color: string;
  icon: string;
}

export interface Tournament {
  id: string;
  name: string;
  status: "upcoming" | "active" | "finished" | "pending";
  teams: Team[];
  matches: Match[];
  overallScore?: TeamScore;
}

export interface FirebaseDocumentData {
  confirmedTeams?: Team[];
  rounds?: {
    semiFinal1?: FirebaseTournamentStage;
    semiFinal2?: FirebaseTournamentStage;
    final?: FirebaseTournamentStage;
  };
  raceToScore?: number;
  tournamentName?: string;
  organizer?: string;
  lastUpdated?: string;
}

export interface CentralizedData {
  rawData: FirebaseDocumentData | null;
  tournaments: Tournament[];
  teams: Team[];
  isLoading: boolean;
  lastUpdated: Date;
  error: string | null;
}
