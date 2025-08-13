import { useMemo, type ReactNode, useCallback } from "react";
import { useTournamentData } from "../hooks/useTournamentData";
import { DataContext } from "./DataContext";
import type { Tournament, Team } from "../types/tournament";

interface DataProviderProps {
  children: ReactNode;
  userId?: string;
}

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  userId = (import.meta.env.VITE_FIREBASE_USER_ID as string) ||
    "quGTVYdwKDhiF7TNIsk4ObrjRg33",
}) => {
  const { data } = useTournamentData(userId);

  const getActiveTournament = useCallback((): Tournament | undefined => {
    return data.tournaments.find((t) => t.status === "active");
  }, [data.tournaments]);

  const getTeamById = useCallback(
    (id: string): Team | undefined => {
      return data.teams.find((t) => t.id === id);
    },
    [data.teams]
  );

  const contextValue = useMemo(
    () => ({
      userId, // Expose the userId
      data,
      getActiveTournament,
      getTeamById,
    }),
    [userId, data, getActiveTournament, getTeamById]
  );

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
