import type { PlanetId, PlanetRecord } from "../types/solar-system";

export interface ScenePlanet {
  planet: PlanetRecord;
  x: number;
  y: number;
  displayRadius: number;
  hitRadius: number;
}

export interface SceneLayout {
  centerX: number;
  centerY: number;
  orbitScale: number;
  sunRadius: number;
  scenePlanets: ScenePlanet[];
}

export const initialPlanetAngles: Record<PlanetId, number> = {
  mercury: 0,
  venus: 40,
  earth: 90,
  mars: 140,
  jupiter: 180,
  saturn: 220,
  uranus: 260,
  neptune: 300,
};

const scenePadding = 28;
const minPlanetRadius = 4;
const maxPlanetRadius = 24;

export function createInitialAngles() {
  return { ...initialPlanetAngles };
}

export function buildScene(
  width: number,
  height: number,
  planets: PlanetRecord[],
  angles: Record<PlanetId, number>,
): SceneLayout {
  const maxOrbitRadius =
    planets.reduce((currentMax, planet) => Math.max(currentMax, planet.orbitRadius), 1) || 1;
  const usableRadius = Math.max(0, Math.min(width, height) / 2 - scenePadding);
  const orbitScale = usableRadius / maxOrbitRadius;
  const centerX = width / 2;
  const centerY = height / 2;
  const sunRadius = Math.max(22, Math.min(38, Math.min(width, height) * 0.075));

  const scenePlanets = planets.map((planet) => {
    const angle = ((angles[planet.id] ?? 0) - 90) * (Math.PI / 180);
    const orbitRadius = planet.orbitRadius * orbitScale;
    const displayRadius = Math.min(
      maxPlanetRadius,
      Math.max(minPlanetRadius, planet.visualRadius * orbitScale),
    );
    const x = centerX + Math.cos(angle) * orbitRadius;
    const y = centerY + Math.sin(angle) * orbitRadius;

    return {
      planet,
      x,
      y,
      displayRadius,
      hitRadius: Math.max(displayRadius + 6, 10),
    };
  });

  return {
    centerX,
    centerY,
    orbitScale,
    sunRadius,
    scenePlanets,
  };
}
