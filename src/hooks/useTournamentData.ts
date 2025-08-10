import { useState, useEffect, useCallback } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import db from "../config/firebase";
import type {
  FirebaseDocumentData,
  CentralizedData,
  Team,
  Tournament,
  FirebaseTournamentStage,
} from "../types/tournament";

export const useTournamentData = (userId: string) => {
  const [data, setData] = useState<CentralizedData>({
    rawData: null,
    tournaments: [],
    teams: [],
    isLoading: true,
    lastUpdated: new Date(),
    error: null,
  });

  const processFirebaseData = useCallback(
    (rawData: FirebaseDocumentData): CentralizedData => {
      const teams: Team[] = rawData.confirmedTeams || [];
      const tournaments: Tournament[] = [];

      const processStage = (
        stageData: FirebaseTournamentStage | undefined,
        stageName: string,
        stageId: string
      ): Tournament | null => {
        if (!stageData) {
          return null;
        }

        const matches = stageData.matches || [];
        const team1Id = matches.length > 0 ? matches[0].team1Id : "";
        const team2Id = matches.length > 0 ? matches[0].team2Id : "";

        const team1 = teams.find((t) => t.id === team1Id);
        const team2 = teams.find((t) => t.id === team2Id);

        const team1Score = matches.reduce(
          (acc, m) =>
            acc + (m.team1Id === team1Id ? m.team1Score : m.team2Score),
          0
        );
        const team2Score = matches.reduce(
          (acc, m) =>
            acc + (m.team1Id === team2Id ? m.team1Score : m.team2Score),
          0
        );

        return {
          id: stageId,
          name: `${rawData.tournamentName || "Tournament"} - ${stageName}`,
          status: stageData.isCompleted ? "finished" : "active",
          matches: matches,
          teams: teams.filter((t) => t.id === team1Id || t.id === team2Id),
          overallScore: {
            team1Id,
            team2Id,
            team1Score,
            team2Score,
            team1Name: team1?.name || "N/A",
            team2Name: team2?.name || "N/A",
          },
        };
      };

      const rounds = rawData.rounds || {};

      const semiFinal1 = processStage(
        rounds.semiFinal1,
        "Semifinal A",
        "semi-final-1"
      );
      if (semiFinal1) tournaments.push(semiFinal1);

      const semiFinal2 = processStage(
        rounds.semiFinal2,
        "Semifinal B",
        "semi-final-2"
      );
      if (semiFinal2) tournaments.push(semiFinal2);

      const final = processStage(rounds.final, "Final", "final");
      if (final) tournaments.push(final);

      return {
        rawData,
        tournaments,
        teams,
        isLoading: false,
        lastUpdated: new Date(),
        error: null,
      };
    },
    []
  );

  useEffect(() => {
    if (!userId) {
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: "No user ID provided. Cannot fetch data.",
      }));
      return;
    }

    const docRef = doc(db, "users", userId, "tournament", "current");

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const rawData = docSnapshot.data() as FirebaseDocumentData;
          const processedData = processFirebaseData(rawData);
          setData(processedData);
        } else {
          setData((prev) => ({
            ...prev,
            rawData: null,
            tournaments: [],
            teams: [],
            isLoading: false,
            error: "No tournament data found for this user.",
          }));
        }
      },
      (err) => {
        console.error("Firebase subscription error:", err);
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message,
        }));
      }
    );

    return () => unsubscribe();
  }, [userId, processFirebaseData]);

  return { data };
};
