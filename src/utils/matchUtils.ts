import type { Match } from "../types/tournament";

export const findBestFeaturedMatch = (matches: Match[]): Match | null => {
  // Find all matches where at least one player is on the hill
  const hillMatches = matches.filter((match) => {
    const player1OnHill = match.player1Wins === match.raceTo - 1;
    const player2OnHill = match.player2Wins === match.raceTo - 1;
    return player1OnHill || player2OnHill;
  });

  if (hillMatches.length === 0) {
    return null;
  }

  // If only one hill match, return it
  if (hillMatches.length === 1) {
    return hillMatches[0];
  }

  // If multiple hill matches, find the closest one (smallest difference)
  return hillMatches.reduce((closest, current) => {
    const closestDiff = Math.abs(closest.player1Wins - closest.player2Wins);
    const currentDiff = Math.abs(current.player1Wins - current.player2Wins);

    // Prefer hill-hill matches (difference = 0) over lopsided ones
    if (currentDiff < closestDiff) {
      return current;
    }

    // If same difference, prefer the one with higher total score (more action)
    if (currentDiff === closestDiff) {
      const closestTotal = closest.player1Wins + closest.player2Wins;
      const currentTotal = current.player1Wins + current.player2Wins;
      return currentTotal > closestTotal ? current : closest;
    }

    return closest;
  });
};

export const isHillHill = (match: Match): boolean => {
  return (
    match.player1Wins === match.raceTo - 1 &&
    match.player2Wins === match.raceTo - 1
  );
};

export const isPlayerOnHill = (match: Match, playerIndex: 1 | 2): boolean => {
  if (playerIndex === 1) {
    return match.player1Wins === match.raceTo - 1;
  }
  return match.player2Wins === match.raceTo - 1;
};
