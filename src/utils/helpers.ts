export const formatScore = (score: number): string => {
  return score.toString().padStart(2, "0");
};

export const formatPlayerName = (
  name: string,
  maxLength: number = 20
): string => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + "...";
};

export const getTournamentStatus = (status: string): string => {
  switch (status) {
    case "upcoming":
      return "Upcoming";
    case "active":
      return "Live";
    case "finished":
      return "Finished";
    default:
      return status;
  }
};
