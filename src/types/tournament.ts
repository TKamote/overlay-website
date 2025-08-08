export interface Player {
  id: string;
  name: string;
  score: number;
  team?: string;
  wins?: number;
  losses?: number;
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
  displayMode:
    | "scoreboard"
    | "player-info"
    | "tournament-info"
    | "timer"
    | "rankings";
  displaySize: "overlay" | "full-screen";
  gameState: "in-game" | "timeout" | "break";
}

// Firebase data types
export interface FirebaseTournament {
  id: string;
  name: string;
  [key: string]: any;
}

export interface FirebaseTeam {
  id: string;
  name: string;
  tournamentId?: string;
  [key: string]: any;
}

// Team data structure from Firebase
export interface TeamData {
  id: string;
  name: string;
  captain: string;
  manager: string;
  color: string;
  icon: string;
  players: string;
}

// Firebase document data structure
export interface FirebaseDocumentData {
  tournamentName?: string;
  organizer?: string;
  raceToScore?: number;
  confirmedTeams?: TeamData[];
  semiFinal1?: {
    currentMatch?: string;
    winner?: string;
    teams?: Record<string, TeamData>;
    teamScores?: number[];
    team1Score?: number;
    team2Score?: number;
    match1?: {
      team1Score?: number;
      team2Score?: number;
      winner?: string;
    };
    match2?: {
      team1Score?: number;
      team2Score?: number;
      winner?: string;
    };
    match3?: {
      team1Score?: number;
      team2Score?: number;
      winner?: string;
    };
    match4?: {
      team1Score?: number;
      team2Score?: number;
      winner?: string;
    };
    match5?: {
      team1Score?: number;
      team2Score?: number;
      winner?: string;
    };
  };
  semiFinal2?: {
    currentMatch?: string;
    winner?: string;
    teams?: Record<string, TeamData>;
    teamScores?: number[];
    team1Score?: number;
    team2Score?: number;
    match1?: {
      team1Score?: number;
      team2Score?: number;
      winner?: string;
    };
    match2?: {
      team1Score?: number;
      team2Score?: number;
      winner?: string;
    };
    match3?: {
      team1Score?: number;
      team2Score?: number;
      winner?: string;
    };
    match4?: {
      team1Score?: number;
      team2Score?: number;
      winner?: string;
    };
    match5?: {
      team1Score?: number;
      team2Score?: number;
      winner?: string;
    };
  };
  final?: {
    currentMatch?: string;
    winner?: string;
    teams?: Record<string, TeamData>;
    teamScores?: number[];
    team1Score?: number;
    team2Score?: number;
  };
  [key: string]: any;
}

// Return type for getUserTournamentData
export interface UserTournamentData {
  teams: TeamData[];
  tournaments: FirebaseTournament[];
  rawData: FirebaseDocumentData | null;
}
