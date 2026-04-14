import { describe, expect, it } from "vitest";
import { missions } from "./missions";

describe("missions", () => {
  it("exports a non-empty list of unique structured mission definitions", () => {
    expect(Array.isArray(missions)).toBe(true);
    expect(missions.length).toBeGreaterThan(0);
    expect(
      missions.every(
        (mission) =>
          typeof mission === "object" &&
          mission !== null &&
          typeof mission.id === "string" &&
          mission.goalType === "selectPlanet" &&
          typeof mission.prompt === "string" &&
          typeof mission.targetPlanetId === "string",
      ),
    ).toBe(true);
    expect(missions.every((mission) => mission.prompt.trim().length > 0)).toBe(true);
    expect(new Set(missions.map((mission) => mission.id)).size).toBe(missions.length);
  });

  it("keeps the structured missions readable and varied", () => {
    expect(missions).toEqual([
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
    ]);
  });
});
