import { useState } from "react";

import { missions } from "../data/missions";
import { planets } from "../data/planets";
import { evaluateMission } from "../lib/missions";
import { defaultSpeedMultiplier } from "../lib/speed-options";
import type { ComparisonMode, PlanetId } from "../types/solar-system";

function createInitialMissionProgress() {
  return {
    currentMissionIndex: 0,
    completedMissionIds: [] as string[],
    shouldAdvanceMission: false,
  };
}

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

  const selectPlanet = (planetId: PlanetId | null) => {
    setSelectedPlanetId(planetId);

    if (planetId === null) {
      return;
    }

    setMissionProgress((currentProgress) => {
      let nextProgress = currentProgress;

      if (currentProgress.shouldAdvanceMission) {
        nextProgress = {
          ...nextProgress,
          currentMissionIndex: Math.min(currentProgress.currentMissionIndex + 1, missions.length),
          shouldAdvanceMission: false,
        };
      }

      const mission = missions[nextProgress.currentMissionIndex] ?? null;

      if (mission === null) {
        return nextProgress;
      }

      const evaluation = evaluateMission(mission, { selectedPlanetId: planetId });

      if (!evaluation.isComplete) {
        return nextProgress;
      }

      return {
        ...nextProgress,
        completedMissionIds: nextProgress.completedMissionIds.includes(mission.id)
          ? nextProgress.completedMissionIds
          : [...nextProgress.completedMissionIds, mission.id],
        shouldAdvanceMission: true,
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
