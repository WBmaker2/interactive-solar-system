import type {
  ComparisonMode,
  ComparisonRow,
  PlanetRecord,
} from "../types/solar-system";

export function buildComparisonRows(
  planetList: PlanetRecord[],
  mode: ComparisonMode
): ComparisonRow[] {
  const accessor =
    mode === "size"
      ? (planet: PlanetRecord) => planet.diameterEarths
      : (planet: PlanetRecord) => planet.distanceFromSunAU;

  return [...planetList]
    .sort((a, b) => accessor(b) - accessor(a))
    .map((planet) => ({
      id: planet.id,
      label: planet.nameKo,
      value: accessor(planet),
    }));
}

