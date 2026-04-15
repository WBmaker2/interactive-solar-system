import { useEffect, useState } from "react";

import { missions } from "../data/missions";
import { planets } from "../data/planets";
import { evaluateMission } from "../lib/missions";
import { defaultSpeedMultiplier } from "../lib/speed-options";
import type { ComparisonMode, PlanetId } from "../types/solar-system";

function createInitialMissionProgress() {
  return {
    currentMissionIndex: 0,
    completedMissionIds: [] as string[],
  };
}

const missionAutoAdvanceDelayMs = 10_000;

export function useSolarSystemApp() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(defaultSpeedMultiplier);
  const [selectedPlanetId, setSelectedPlanetId] = useState<PlanetId | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("size");
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [missionProgress, setMissionProgress] = useState(createInitialMissionProgress);
  const [sceneResetVersion, setSceneResetVersion] = useState(0);
  const currentMission = missions[missionProgress.currentMissionIndex] ?? null;
  const isCurrentMissionComplete = currentMission
    ? missionProgress.completedMissionIds.includes(currentMission.id)
    : false;

  useEffect(() => {
    if (currentMission === null || !isCurrentMissionComplete) {
      return;
    }

    const completedMissionId = currentMission.id;
    const timeoutId = window.setTimeout(() => {
      setMissionProgress((currentProgress) => {
        const missionAtCurrentIndex = missions[currentProgress.currentMissionIndex] ?? null;

        if (
          missionAtCurrentIndex === null ||
          missionAtCurrentIndex.id !== completedMissionId ||
          !currentProgress.completedMissionIds.includes(completedMissionId)
        ) {
          return currentProgress;
        }

        return {
          ...currentProgress,
          currentMissionIndex: Math.min(currentProgress.currentMissionIndex + 1, missions.length),
        };
      });
    }, missionAutoAdvanceDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentMission, isCurrentMissionComplete]);

  const selectPlanet = (planetId: PlanetId | null) => {
    setSelectedPlanetId(planetId);

    if (planetId === null) {
      return;
    }

    setMissionProgress((currentProgress) => {
      const mission = missions[currentProgress.currentMissionIndex] ?? null;

      if (mission === null) {
        return currentProgress;
      }

      if (currentProgress.completedMissionIds.includes(mission.id)) {
        return currentProgress;
      }

      const evaluation = evaluateMission(mission, { selectedPlanetId: planetId });

      if (!evaluation.isComplete) {
        return currentProgress;
      }

      return {
        ...currentProgress,
        completedMissionIds: [...currentProgress.completedMissionIds, mission.id],
      };
    });
  };

  const togglePlaying = () => {
    setIsPlaying((value) => !value);
  };

  const resetScene = () => {
    setSelectedPlanetId(null);
    setComparisonMode("size");
    setIsComparisonOpen(false);
    setIsPlaying(true);
    setSpeedMultiplier(defaultSpeedMultiplier);
    setMissionProgress(createInitialMissionProgress());
    setSceneResetVersion((version) => version + 1);
  };

  const openComparison = (mode: ComparisonMode) => {
    setComparisonMode(mode);
    setIsComparisonOpen(true);
  };

  const closeComparison = () => {
    setIsComparisonOpen(false);
  };

  return {
    planets,
    missions,
    isPlaying,
    speedMultiplier,
    selectedPlanetId,
    comparisonMode,
    isComparisonOpen,
    currentMission,
    currentMissionIndex: missionProgress.currentMissionIndex,
    completedMissionIds: missionProgress.completedMissionIds,
    isCurrentMissionComplete,
    sceneResetVersion,
    selectPlanet,
    togglePlaying,
    setSpeedMultiplier,
    resetScene,
    openComparison,
    closeComparison,
  };
}
