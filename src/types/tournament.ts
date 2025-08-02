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

export interface Tournament {
  id: string;
  name: string;
  status: "upcoming" | "active" | "finished";
  players: Player[];
  matches: Match[];
  currentRound?: number;
  totalRounds?: number;
  overallScore?: TeamScore;
  featuredMatch?: Match; // Best match in this tournament
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
