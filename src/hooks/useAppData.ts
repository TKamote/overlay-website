import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";

// Custom hook to use the data
export const useAppData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within a DataProvider");
  }
  return context;
};
