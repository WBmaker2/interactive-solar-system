import { describe, expect, it } from "vitest";

import {
  defaultSpeedMultiplier,
  formatSpeedMultiplier,
  getSpeedMultiplierFromSliderValue,
  getSpeedSliderValue,
  speedOptions,
} from "./speed-options";

describe("speed options", () => {
  it("keeps the curated speed list in the intended order", () => {
    expect(speedOptions).toEqual([0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(defaultSpeedMultiplier).toBe(1);
  });

  it("maps between slider values and speed multipliers", () => {
    expect(getSpeedSliderValue(0.25)).toBe(0);
    expect(getSpeedSliderValue(1)).toBe(2);
    expect(getSpeedSliderValue(10)).toBe(11);

    expect(getSpeedMultiplierFromSliderValue(0)).toBe(0.25);
    expect(getSpeedMultiplierFromSliderValue(1)).toBe(0.5);
    expect(getSpeedMultiplierFromSliderValue(2)).toBe(1);
    expect(getSpeedMultiplierFromSliderValue(11)).toBe(10);
  });

  it("formats low and whole-number speeds for the UI", () => {
    expect(formatSpeedMultiplier(0.25)).toBe("x0.25");
    expect(formatSpeedMultiplier(0.5)).toBe("x0.5");
    expect(formatSpeedMultiplier(1)).toBe("x1");
    expect(formatSpeedMultiplier(10)).toBe("x10");
  });
});
