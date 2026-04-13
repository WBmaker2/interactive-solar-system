import { describe, expect, it } from "vitest";
import { missions } from "./missions";

describe("missions", () => {
  it("exports a non-empty list of unique classroom prompts", () => {
    expect(Array.isArray(missions)).toBe(true);
    expect(missions.length).toBeGreaterThan(0);
    expect(missions.every((mission) => typeof mission === "string")).toBe(true);
    expect(missions.every((mission) => mission.trim().length > 0)).toBe(true);
    expect(new Set(missions).size).toBe(missions.length);
  });

  it("keeps the prompts readable and varied", () => {
    expect(missions).toEqual([
      "가장 빠르게 도는 행성을 찾아보세요.",
      "태양에서 가장 먼 행성을 찾아보세요.",
      "가장 큰 행성을 찾아보세요.",
      "지구와 비슷한 행성을 찾아보세요.",
    ]);
  });
});
