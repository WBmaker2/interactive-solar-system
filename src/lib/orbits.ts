import type { PlanetId } from "../types/solar-system";

export type AngleMap = Record<string, number>;

export interface OrbitPlanet {
  id: PlanetId | string;
  orbitalPeriodDays: number;
}

export const SIMULATION_DAYS_PER_SECOND = 12;

function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function advanceAngles<T extends AngleMap>(
  current: T,
  planets: OrbitPlanet[],
  deltaMs: number,
  speedMultiplier: number
) {
  const next: AngleMap = { ...current };
  const simulationDays = (deltaMs / 1000) * speedMultiplier * SIMULATION_DAYS_PER_SECOND;

  for (const planet of planets) {
    const degreesPerDay = 360 / planet.orbitalPeriodDays;
    const currentAngle = current[planet.id] ?? 0;
    next[planet.id] = normalizeAngle(currentAngle + degreesPerDay * simulationDays);
  }

  return next as T;
}
