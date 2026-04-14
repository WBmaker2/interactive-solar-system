import { useEffect, useRef, useState } from "react";

import { missions } from "../data/missions";
import { planets } from "../data/planets";
import { evaluateMission } from "../lib/missions";
import type { ComparisonMode, PlanetId } from "../types/solar-system";
import { advanceAngles } from "../lib/orbits";

const initialAngles: Record<PlanetId, number> = {
  mercury: 0,
  venus: 40,
  earth: 90,
  mars: 140,
  jupiter: 180,
  saturn: 220,
  uranus: 260,
  neptune: 300,
};

const initialSpeedMultiplier = 6;

function createInitialAngles() {
  return { ...initialAngles };
}

function createInitialMissionProgress() {
  return {
    currentMissionIndex: 0,
    completedMissionIds: [] as string[],
    shouldAdvanceMission: false,
  };
}

export function useSolarSystemApp() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(initialSpeedMultiplier);
  const [selectedPlanetId, setSelectedPlanetId] = useState<PlanetId | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("size");
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [missionProgress, setMissionProgress] = useState(createInitialMissionProgress);
  const [angles, setAngles] = useState<Record<PlanetId, number>>(createInitialAngles);
  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const currentMission = missions[missionProgress.currentMissionIndex] ?? null;
  const isCurrentMissionComplete = currentMission
    ? missionProgress.completedMissionIds.includes(currentMission.id)
    : false;

  useEffect(() => {
    if (!isPlaying) {
      previousTimeRef.current = null;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    const tick = (now: number) => {
      const previousTime = previousTimeRef.current ?? now;
      const deltaMs = now - previousTime;

      setAngles((current) => advanceAngles(current, planets, deltaMs, speedMultiplier));
      previousTimeRef.current = now;
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      previousTimeRef.current = null;
    };
  }, [isPlaying, speedMultiplier]);

  const selectPlanet = (planetId: PlanetId | null) => {
    setSelectedPlanetId(planetId);

    setMissionProgress((currentProgress) => {
      let nextProgress = currentProgress;

      if (currentProgress.shouldAdvanceMission) {
        nextProgress = {
          ...nextProgress,
          currentMissionIndex: Math.min(currentProgress.currentMissionIndex + 1, missions.length),
          shouldAdvanceMission: false,
        };
      }

      if (planetId === null) {
        return nextProgress;
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
    setAngles(createInitialAngles());
    setSelectedPlanetId(null);
    setComparisonMode("size");
    setIsComparisonOpen(false);
    setIsPlaying(true);
    setSpeedMultiplier(initialSpeedMultiplier);
    setMissionProgress(createInitialMissionProgress());
    previousTimeRef.current = null;
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
    angles,
    isPlaying,
    speedMultiplier,
    selectedPlanetId,
    comparisonMode,
    isComparisonOpen,
    currentMission,
    currentMissionIndex: missionProgress.currentMissionIndex,
    completedMissionIds: missionProgress.completedMissionIds,
    isCurrentMissionComplete,
    selectPlanet,
    togglePlaying,
    setSpeedMultiplier,
    resetScene,
    openComparison,
    closeComparison,
  };
}
