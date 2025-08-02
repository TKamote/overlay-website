import type { Tournament, Match, TeamScore } from "../types/tournament";
import { findBestFeaturedMatch } from "../utils/matchUtils";

export class TournamentManager {
  private tournaments: { [tournamentId: string]: Tournament } = {};
  private activeTournamentId: string = "";
  private globalFeaturedMatch: Match | null = null;
  private globalOverallScore: TeamScore | null = null;

  // Core operations
  addTournament(tournament: Tournament): void {
    this.tournaments[tournament.id] = tournament;
    if (!this.activeTournamentId) {
      this.activeTournamentId = tournament.id;
    }
    this.updateGlobalData();
  }

  removeTournament(tournamentId: string): void {
    delete this.tournaments[tournamentId];
    if (this.activeTournamentId === tournamentId) {
      const remainingTournaments = Object.keys(this.tournaments);
      this.activeTournamentId = remainingTournaments[0] || "";
    }
    this.updateGlobalData();
  }

  switchActiveTournament(tournamentId: string): void {
    if (this.tournaments[tournamentId]) {
      this.activeTournamentId = tournamentId;
    }
  }

  // Match operations
  updateMatch(tournamentId: string, matchId: string, updates: Partial<Match>): void {
    const tournament = this.tournaments[tournamentId];
    if (!tournament) return;

    const matchIndex = tournament.matches.findIndex(match => match.id === matchId);
    if (matchIndex === -1) return;

    // Update the match
    tournament.matches[matchIndex] = {
      ...tournament.matches[matchIndex],
      ...updates,
    };

    // Update featured match for this tournament
    tournament.featuredMatch = findBestFeaturedMatch(tournament.matches);
    
    // Update global data
    this.updateGlobalData();
  }

  // Global data calculations
  private updateGlobalData(): void {
    this.globalFeaturedMatch = this.findGlobalFeaturedMatch();
    this.globalOverallScore = this.calculateGlobalOverallScore();
  }

  private findGlobalFeaturedMatch(): Match | null {
    const allMatches: Match[] = [];
    
    Object.values(this.tournaments).forEach(tournament => {
      allMatches.push(...tournament.matches);
    });

    return findBestFeaturedMatch(allMatches);
  }

  private calculateGlobalOverallScore(): TeamScore | null {
    const teamScores: { [teamName: string]: number } = {};

    Object.values(this.tournaments).forEach(tournament => {
      if (tournament.overallScore) {
        teamScores[tournament.overallScore.team1Name] = 
          (teamScores[tournament.overallScore.team1Name] || 0) + tournament.overallScore.team1Score;
        teamScores[tournament.overallScore.team2Name] = 
          (teamScores[tournament.overallScore.team2Name] || 0) + tournament.overallScore.team2Score;
      }
    });

    const teamNames = Object.keys(teamScores);
    if (teamNames.length < 2) return null;

    return {
      team1Name: teamNames[0],
      team2Name: teamNames[1],
      team1Score: teamScores[teamNames[0]],
      team2Score: teamScores[teamNames[1]],
    };
  }

  // Getters
  getActiveTournament(): Tournament | null {
    return this.tournaments[this.activeTournamentId] || null;
  }

  getAllTournaments(): Tournament[] {
    return Object.values(this.tournaments);
  }

  getGlobalFeaturedMatch(): Match | null {
    return this.globalFeaturedMatch;
  }

  getGlobalOverallScore(): TeamScore | null {
    return this.globalOverallScore;
  }

  getActiveTournamentId(): string {
    return this.activeTournamentId;
  }

  // Get full manager state
  getManagerState() {
    return {
      tournaments: this.tournaments,
      activeTournamentId: this.activeTournamentId,
      globalFeaturedMatch: this.globalFeaturedMatch,
      globalOverallScore: this.globalOverallScore,
    };
  }
} 