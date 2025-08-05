import { createContext } from "react";

// Data interfaces
export interface Team {
  id: string;
  name: string;
  captain: string;
  manager: string;
  color: string;
  icon?: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  team: string;
  points: number;
}

export interface Match {
  id: string;
  player1: Player;
  player2: Player;
  player1Wins: number;
  player2Wins: number;
  raceTo: number;
  status: "upcoming" | "active" | "finished";
}

export interface TournamentInfo {
  name: string;
  organizer: string;
  raceToScore: string;
  champion: string | null;
}

export interface AppData {
  teams: Team[];
  players: Player[];
  matches: Match[];
  tournamentInfo: TournamentInfo | null;
  loading: boolean;
  error: string | null;
}

// Create context
export const DataContext = createContext<AppData | undefined>(undefined);
