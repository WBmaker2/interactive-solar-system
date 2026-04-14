import { describe, expect, it } from "vitest";

import { missions } from "../data/missions";
import { evaluateMission } from "./missions";

describe("evaluateMission", () => {
  it("keeps the fastest-planet mission complete when Mercury is selected", () => {
    expect(evaluateMission(missions[0], { selectedPlanetId: "mercury" })).toEqual({
      isComplete: true,
      progress: 1,
    });
  });

  it("keeps the farthest-planet mission complete when Neptune is selected", () => {
    expect(evaluateMission(missions[1], { selectedPlanetId: "neptune" })).toEqual({
      isComplete: true,
      progress: 1,
    });
  });

  it("keeps the largest-planet mission complete when Jupiter is selected", () => {
    expect(evaluateMission(missions[2], { selectedPlanetId: "jupiter" })).toEqual({
      isComplete: true,
      progress: 1,
    });
  });

  it("keeps the earth-like mission complete when Venus is selected", () => {
    expect(evaluateMission(missions[3], { selectedPlanetId: "venus" })).toEqual({
      isComplete: true,
      progress: 1,
    });
  });

  it("reports incomplete progress when the selected planet does not match", () => {
    expect(evaluateMission(missions[0], { selectedPlanetId: "venus" })).toEqual({
      isComplete: false,
      progress: 0,
    });
  });
});
