import { createContext, useContext } from "react";
import type { CentralizedData, Tournament, Team } from "../types/tournament";

export interface DataContextType {
  data: CentralizedData;
  getActiveTournament: () => Tournament | undefined;
  getTeamById: (id: string) => Team | undefined;
}

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
