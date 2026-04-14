import type { MissionDefinition } from "../types/solar-system";

export const missions: MissionDefinition[] = [
  {
    id: "fastest-planet",
    goalType: "selectPlanet",
    prompt: "가장 빠르게 도는 행성을 찾아보세요.",
    targetPlanetId: "mercury",
  },
  {
    id: "farthest-planet",
    goalType: "selectPlanet",
    prompt: "태양에서 가장 먼 행성을 찾아보세요.",
    targetPlanetId: "neptune",
  },
  {
    id: "largest-planet",
    goalType: "selectPlanet",
    prompt: "가장 큰 행성을 찾아보세요.",
    targetPlanetId: "jupiter",
  },
  {
    id: "earth-like-planet",
    goalType: "selectPlanet",
    prompt: "지구와 비슷한 행성을 찾아보세요.",
    targetPlanetId: "venus",
  },
];
