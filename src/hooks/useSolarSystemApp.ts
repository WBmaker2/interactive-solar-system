import { useEffect, useRef, useState } from "react";

import { missions } from "../data/missions";
import { planets } from "../data/planets";
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

export function useSolarSystemApp() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(initialSpeedMultiplier);
  const [selectedPlanetId, setSelectedPlanetId] = useState<PlanetId | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("size");
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [angles, setAngles] = useState<Record<PlanetId, number>>(createInitialAngles);
  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

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
    selectPlanet,
    togglePlaying,
    setSpeedMultiplier,
    resetScene,
    openComparison,
    closeComparison,
  };
}
