import type { PlanetId } from "../types/solar-system";

export interface PlanetHitTarget {
  id: PlanetId;
  x: number;
  y: number;
  radius: number;
}

export function hitTestPlanet(
  x: number,
  y: number,
  targets: PlanetHitTarget[]
): PlanetId | null {
  let closestTarget: PlanetHitTarget | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const target of targets) {
    const distance = Math.hypot(x - target.x, y - target.y);

    if (distance <= target.radius && distance < closestDistance) {
      closestTarget = target;
      closestDistance = distance;
    }
  }

  return closestTarget?.id ?? null;
}
