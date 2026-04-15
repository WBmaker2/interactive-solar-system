import type { MissionDefinition } from "../types/solar-system";

export const missions: MissionDefinition[] = [
  {
    id: "fastest-planet",
    goalType: "selectPlanet",
    prompt: "가장 빠르게 도는 행성을 찾아보세요.",
    hint: "태양에 가장 가까운 행성을 먼저 떠올려 보세요.",
    completionExplanation: {
      answer: "수성",
      reason: "수성은 태양에 가장 가까워서 가장 빠르게 한 바퀴를 돌아요.",
      caution: "자전이 빠르다는 뜻이 아니라 공전이 빠르다는 뜻이에요.",
    },
    targetPlanetId: "mercury",
  },
  {
    id: "farthest-planet",
    goalType: "selectPlanet",
    prompt: "태양에서 가장 먼 행성을 찾아보세요.",
    hint: "태양계의 가장 바깥쪽 행성을 생각해 보세요.",
    completionExplanation: {
      answer: "해왕성",
      reason: "해왕성은 태양계에서 가장 바깥쪽에 있어서 태양과 가장 멀어요.",
      caution: "화면 속 간격보다 실제 우주에서는 훨씬 더 멀리 떨어져 있어요.",
    },
    targetPlanetId: "neptune",
  },
  {
    id: "largest-planet",
    goalType: "selectPlanet",
    prompt: "가장 큰 행성을 찾아보세요.",
    hint: "가스 행성 중에서 가장 압도적으로 큰 행성을 찾아보세요.",
    completionExplanation: {
      answer: "목성",
      reason: "목성은 지구보다 훨씬 커서 태양계에서 가장 큰 행성이에요.",
      caution: "크기가 크다고 태양에서 가장 멀거나 가장 느린 것은 아니에요.",
    },
    targetPlanetId: "jupiter",
  },
  {
    id: "earth-like-planet",
    goalType: "selectPlanet",
    prompt: "지구와 크기가 비슷한 행성을 찾아보세요.",
    hint: "지구와 크기가 아주 비슷한 행성을 떠올려 보세요.",
    completionExplanation: {
      answer: "금성",
      reason: "금성은 지구 지름의 약 0.95배라서 크기가 매우 비슷해요.",
      caution: "크기가 비슷하다고 환경까지 비슷한 것은 아니에요.",
    },
    targetPlanetId: "venus",
  },
];
