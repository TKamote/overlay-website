import type {
  OverlayData,
  Tournament,
  Player,
  Match,
  TournamentManager,
} from "../types/tournament";
import { findBestFeaturedMatch } from "./matchUtils";
import { TournamentManager as TournamentManagerClass } from "../services/TournamentManager";

export const samplePlayers: Player[] = [
  {
    id: "1",
    name: "John Smith",
    score: 15,
    team: "Team Alpha",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    score: 12,
    team: "Team Beta",
  },
  {
    id: "3",
    name: "Mike Davis",
    score: 18,
    team: "Team Alpha",
  },
  {
    id: "4",
    name: "Emma Wilson",
    score: 9,
    team: "Team Beta",
  },
];

export const sampleMatches: Match[] = [
  {
    id: "match-1",
    player1: samplePlayers[0], // John Smith
    player2: samplePlayers[1], // Sarah Johnson
    player1Wins: 4,
    player2Wins: 3,
    raceTo: 5,
    isFeatured: true,
    status: "active",
  },
  {
    id: "match-2",
    player1: samplePlayers[2], // Mike Davis
    player2: samplePlayers[3], // Emma Wilson
    player1Wins: 4,
    player2Wins: 0,
    raceTo: 5,
    isFeatured: false,
    status: "active",
  },
  {
    id: "match-3",
    player1: samplePlayers[0], // John Smith
    player2: samplePlayers[2], // Mike Davis
    player1Wins: 3,
    player2Wins: 2,
    raceTo: 5,
    isFeatured: false,
    status: "active",
  },
];

export const sampleTournamentA: Tournament = {
  id: "tournament-a",
  name: "Owens Cup 2024 - Semifinal A",
  status: "active",
  players: samplePlayers,
  matches: sampleMatches,
  currentRound: 3,
  totalRounds: 5,
  overallScore: {
    team1Score: 1,
    team2Score: 0,
    team1Name: "Alpha",
    team2Name: "Beta",
  },
  featuredMatch: findBestFeaturedMatch(sampleMatches),
};

export const sampleTournamentB: Tournament = {
  id: "tournament-b",
  name: "Owens Cup 2024 - Semifinal B",
  status: "active",
  players: [
    { id: "5", name: "Alex Chen", score: 8, team: "Gamma" },
    { id: "6", name: "Maria Rodriguez", score: 6, team: "Delta" },
    { id: "7", name: "David Kim", score: 9, team: "Gamma" },
    { id: "8", name: "Lisa Wang", score: 4, team: "Delta" },
  ],
  matches: [
    {
      id: "match-4",
      player1: { id: "5", name: "Alex Chen", score: 8, team: "Gamma" },
      player2: {
        id: "6",
        name: "Maria Rodriguez",
        score: 6,
        team: "Delta",
      },
      player1Wins: 3,
      player2Wins: 2,
      raceTo: 5,
      isFeatured: false,
      status: "active",
    },
    {
      id: "match-5",
      player1: { id: "7", name: "David Kim", score: 9, team: "Gamma" },
      player2: { id: "8", name: "Lisa Wang", score: 4, team: "Delta" },
      player1Wins: 4,
      player2Wins: 1,
      raceTo: 5,
      isFeatured: true,
      status: "active",
    },
  ],
  currentRound: 2,
  totalRounds: 3,
  overallScore: {
    team1Score: 1,
    team2Score: 0,
    team1Name: "Gamma",
    team2Name: "Delta",
  },
  featuredMatch: findBestFeaturedMatch([
    {
      id: "match-4",
      player1: { id: "5", name: "Alex Chen", score: 8, team: "Gamma" },
      player2: {
        id: "6",
        name: "Maria Rodriguez",
        score: 6,
        team: "Delta",
      },
      player1Wins: 3,
      player2Wins: 2,
      raceTo: 5,
      isFeatured: false,
      status: "active",
    },
    {
      id: "match-5",
      player1: { id: "7", name: "David Kim", score: 9, team: "Gamma" },
      player2: { id: "8", name: "Lisa Wang", score: 4, team: "Delta" },
      player1Wins: 4,
      player2Wins: 1,
      raceTo: 5,
      isFeatured: true,
      status: "active",
    },
  ]),
};

export const sampleTournamentManager: TournamentManager = {
  tournaments: {
    "tournament-a": sampleTournamentA,
    "tournament-b": sampleTournamentB,
    "tournament-final": {
      id: "tournament-final",
      name: "Owens Cup 2024 - FINAL",
      status: "active" as const,
      players: [
        { id: "final-1", name: "Champion Player", score: 0, team: "Champions" },
        { id: "final-2", name: "Runner Up", score: 0, team: "Runners" },
      ],
      matches: [
        {
          id: "final-match-1",
          player1: {
            id: "final-1",
            name: "Champion Player",
            score: 0,
            team: "Champions",
          },
          player2: {
            id: "final-2",
            name: "Runner Up",
            score: 0,
            team: "Runners",
          },
          player1Wins: 0,
          player2Wins: 0,
          raceTo: 7,
          isFeatured: true,
          status: "active" as const,
        },
      ],
      currentRound: 1,
      totalRounds: 1,
      overallScore: {
        team1Score: 0,
        team2Score: 0,
        team1Name: "Champions",
        team2Name: "Runners",
      },
      featuredMatch: {
        id: "final-match-1",
        player1: {
          id: "final-1",
          name: "Champion Player",
          score: 0,
          team: "Champions",
        },
        player2: {
          id: "final-2",
          name: "Runner Up",
          score: 0,
          team: "Runners",
        },
        player1Wins: 0,
        player2Wins: 0,
        raceTo: 7,
        isFeatured: true,
        status: "active" as const,
      },
    },
  },
  activeTournamentId: "tournament-a",
  globalFeaturedMatch: null, // Will be calculated by manager
  globalOverallScore: null, // Will be calculated by manager
};

// Create a manager instance and populate it
export const createSampleTournamentManager = (): TournamentManagerClass => {
  const manager = new TournamentManagerClass();
  manager.addTournament(sampleTournamentA);
  manager.addTournament(sampleTournamentB);
  return manager;
};

export const sampleOverlayData: OverlayData = {
  tournamentManager: sampleTournamentManager,
  isVisible: true,
  displayMode: "scoreboard",
  displaySize: "full-screen",
  gameState: "in-game",
};
