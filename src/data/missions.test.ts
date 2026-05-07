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
          typeof mission.hint === "string" &&
          typeof mission.completionExplanation === "object" &&
          mission.completionExplanation !== null &&
          typeof mission.completionExplanation.answer === "string" &&
          typeof mission.completionExplanation.reason === "string" &&
          typeof mission.completionExplanation.caution === "string" &&
          typeof mission.targetPlanetId === "string",
      ),
    ).toBe(true);
    expect(missions.every((mission) => mission.prompt.trim().length > 0)).toBe(true);
    expect(missions.every((mission) => mission.hint.trim().length > 0)).toBe(true);
    expect(new Set(missions.map((mission) => mission.id)).size).toBe(missions.length);
  });

  it("keeps the structured missions readable and varied", () => {
    const missionById = new Map(missions.map((mission) => [mission.id, mission]));

    expect(missionById.has("fastest-planet")).toBe(true);
    expect(missionById.has("earth-like-planet")).toBe(true);
    expect(missionById.get("fastest-planet")?.completionExplanation).toEqual({
      answer: "수성",
      reason: "수성은 태양에 가장 가까워서 가장 빠르게 공전해요.",
      caution: "자전이 빠르다는 뜻이 아니라 공전이 빠르다는 뜻이에요.",
    });
    expect(missionById.get("fastest-planet")?.prompt).toBe(
      "가장 빠르게 공전하는 행성을 찾아보세요."
    );
    expect(missionById.get("earth-like-planet")?.prompt).toBe(
      "지구와 크기가 비슷한 행성을 찾아보세요."
    );
    expect(missionById.get("earth-like-planet")?.completionExplanation).toEqual({
      answer: "금성",
      reason: "금성은 지구 지름의 약 0.95배라서 크기가 매우 비슷해요.",
      caution: "크기가 비슷하다고 환경까지 비슷한 것은 아니에요.",
    });
  });
});
