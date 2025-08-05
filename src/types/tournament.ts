export interface Player {
  id: string;
  name: string;
  score: number;
  team?: string;
}

export interface Match {
  id: string;
  player1: Player;
  player2: Player;
  player1Wins: number;
  player2Wins: number;
  raceTo: number;
  isFeatured: boolean;
  status: "upcoming" | "active" | "finished";
}

export interface TeamScore {
  team1Score: number;
  team2Score: number;
  team1Name: string;
  team2Name: string;
}

// New interfaces for the real data structure
export interface ConfirmedTeam {
  id: number;
  name: string;
  captain: string;
  manager: string;
  color: string;
  icon: string;
  players: string; // Comma-separated string
}

export interface MatchScore {
  matchIndex: number;
  team0Score: number;
  team1Score: number;
}

export interface TournamentStage {
  currentMatch: number;
  matchScores: MatchScore[];
  modalVisible: boolean;
  teamScores: number[];
  winner: string | null;
}

export interface TournamentData {
  confirmedTeams: ConfirmedTeam[];
  final: TournamentStage;
  semiFinal1: TournamentStage;
  semiFinal2: TournamentStage;
  tournamentChampion: string | null;
  tournamentName: string;
  organizer: string;
  raceToScore: string;
  updatedAt: Date | string | number; // timestamp
}

export interface Tournament {
  id: string;
  name: string;
  status: "upcoming" | "active" | "finished";
  players: Player[];
  matches: Match[];
  currentRound?: number;
  totalRounds?: number;
  overallScore?: TeamScore;
  featuredMatch?: Match | null; // Best match in this tournament
}

export interface TournamentManager {
  tournaments: { [tournamentId: string]: Tournament };
  activeTournamentId: string;
  globalFeaturedMatch: Match | null; // Best match across all tournaments
  globalOverallScore: TeamScore | null; // Combined team scores
}

export interface OverlayData {
  tournamentManager: TournamentManager;
  isVisible: boolean;
  gameState: "in-game" | "timeout" | "break";
}

// Firebase data types
export interface FirebaseTournament {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface FirebaseTeam {
  id: string;
  name: string;
  tournamentId?: string;
  [key: string]: unknown;
}
