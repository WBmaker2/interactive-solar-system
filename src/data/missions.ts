import type { MissionDefinition } from "../types/solar-system";

export const missions: MissionDefinition[] = [
  {
    id: "fastest-planet",
    goalType: "selectPlanet",
    prompt: "가장 빠르게 도는 행성을 찾아보세요.",
    hint: "태양에 가장 가까운 행성을 먼저 떠올려 보세요.",
    targetPlanetId: "mercury",
  },
  {
    id: "farthest-planet",
    goalType: "selectPlanet",
    prompt: "태양에서 가장 먼 행성을 찾아보세요.",
    hint: "태양계의 가장 바깥쪽 행성을 생각해 보세요.",
    targetPlanetId: "neptune",
  },
  {
    id: "largest-planet",
    goalType: "selectPlanet",
    prompt: "가장 큰 행성을 찾아보세요.",
    hint: "가스 행성 중에서 가장 압도적으로 큰 행성을 찾아보세요.",
    targetPlanetId: "jupiter",
  },
  {
    id: "earth-like-planet",
    goalType: "selectPlanet",
    prompt: "지구와 비슷한 행성을 찾아보세요.",
    hint: "지구와 크기가 아주 비슷한 행성을 떠올려 보세요.",
    targetPlanetId: "venus",
  },
];
