import type {
  ComparisonMode,
  ComparisonRow,
  PlanetRecord,
  SizeComparisonPreset,
  SizeComparisonPresetId,
  SizeComparisonSpotlight,
} from "../types/solar-system";

export const sizeComparisonPresets: SizeComparisonPreset[] = [
  {
    id: "earth-venus",
    label: "지구와 금성",
    planetIds: ["earth", "venus"],
    caption: "금성은 지구와 거의 비슷한 크기예요.",
  },
  {
    id: "earth-jupiter",
    label: "지구와 목성",
    planetIds: ["earth", "jupiter"],
    caption: "목성은 지구보다 훨씬 커서 가장 큰 행성이에요.",
  },
  {
    id: "rocky-planets",
    label: "암석형 행성",
    planetIds: ["earth", "venus", "mars", "mercury"],
    caption: "암석형 행성끼리 보면 지구와 금성이 가장 비슷해요.",
  },
  {
    id: "outer-giants",
    label: "바깥 거대 행성",
    planetIds: ["jupiter", "saturn", "uranus", "neptune"],
    caption: "바깥쪽 큰 행성 중에서는 목성과 토성이 특히 커요.",
  },
];

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

export function buildSizeComparisonSpotlight(
  planetList: PlanetRecord[],
  presetId: SizeComparisonPresetId
): SizeComparisonSpotlight {
  const preset =
    sizeComparisonPresets.find((candidate) => candidate.id === presetId) ??
    sizeComparisonPresets[0];
  const planetById = new Map(planetList.map((planet) => [planet.id, planet]));
  const spotlightPlanets = preset.planetIds
    .map((planetId) => planetById.get(planetId))
    .filter((planet): planet is PlanetRecord => Boolean(planet));
  const maxDiameter =
    spotlightPlanets.reduce(
      (maximum, planet) => Math.max(maximum, planet.diameterEarths),
      0
    ) || 1;

  return {
    caption: preset.caption,
    planets: spotlightPlanets.map((planet) => ({
      id: planet.id,
      label: planet.nameKo,
      color: planet.color,
      diameterEarths: planet.diameterEarths,
      scalePercentage: Math.round((planet.diameterEarths / maxDiameter) * 100),
    })),
  };
}
