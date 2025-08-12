import type { FirebaseMatch, Player, Team } from "../types/tournament";

/**
 * Determines the players for a specific match based on predefined rules.
 * @param match The raw match data from Firebase.
 * @param team The team object, containing the full player roster.
 * @returns An array of Player objects who are participating in the match.
 */
export const getPlayersForMatch = (
  match: FirebaseMatch,
  team: Team
): Player[] => {
  const players = team.players || [];
  const captain = players.find((p) => p.id === team.captain);

  switch (match.matchNumber) {
    // M1: Team Match
    case 0:
      return players; // Entire team

    // M2: 1st Doubles
    case 1:
      // P2 and P3
      return players.filter((p, index) => index === 1 || index === 2);

    // M3: 1st Singles
    case 2:
      // P1 (Best Player)
      return players.slice(0, 1);

    // M4: 2nd Doubles
    case 3:
      // P4 and P5
      return players.filter((p, index) => index === 3 || index === 4);

    // M5: 2nd Singles
    case 4:
      // P2
      return players.filter((p, index) => index === 1);

    // M6: 2nd Team Match
    case 5:
      return players; // Entire team

    // M7: 3rd Doubles
    case 6:
      // P1 and P3
      return players.filter((p, index) => index === 0 || index === 2);

    // M8 & M9: Captain's Pick (provisional)
    case 7:
    case 8:
      return captain ? [captain] : [];

    default:
      return [];
  }
};

/**
 * Generates a human-readable title for a match.
 * @param match The raw match data from Firebase.
 * @returns A string representing the match title.
 */
export const getMatchTitle = (match: FirebaseMatch): string => {
  const matchNumber = (match.matchNumber ?? -1) + 1;

  switch (match.matchNumber) {
    case 0:
      return `Match ${matchNumber}: Team Match`;
    case 1:
      return `Match ${matchNumber}: 1st Doubles`;
    case 2:
      return `Match ${matchNumber}: 1st Singles`;
    case 3:
      return `Match ${matchNumber}: 2nd Doubles`;
    case 4:
      return `Match ${matchNumber}: 2nd Singles`;
    case 5:
      return `Match ${matchNumber}: 2nd Team Match`;
    case 6:
      return `Match ${matchNumber}: 3rd Doubles`;
    case 7:
      return `Match ${matchNumber}: 3rd Singles`;
    case 8:
      return `Match ${matchNumber}: 4th Singles`;
    default:
      return `Match ${matchNumber}`;
  }
};
