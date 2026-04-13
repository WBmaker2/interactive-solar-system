import { describe, expect, it } from "vitest";
import { statSync } from "node:fs";
import { join } from "node:path";
import { planets, scaleNotice } from "./planets";

describe("planet data", () => {
  it("contains the eight planets in solar order", () => {
    expect(planets.map((planet) => planet.id)).toEqual([
      "mercury",
      "venus",
      "earth",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
    ]);
  });

  it("includes the learning scale notice", () => {
    expect(scaleNotice).toMatch(/표현을 조정/);
  });

  it("includes local images and next-step prompts", () => {
    expect(
      planets.every((planet) => planet.imageSrc.startsWith("/planets/"))
    ).toBe(true);
    expect(
      planets.every((planet) => planet.nextExplorationPrompt.length > 0)
    ).toBe(true);
    expect(
      planets.every(
        (planet) =>
          statSync(join(process.cwd(), "public", planet.imageSrc)).size > 1024
      )
    ).toBe(true);
  });
});
