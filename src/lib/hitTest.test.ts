import { describe, expect, it } from "vitest";

import { hitTestPlanet } from "./hitTest";

describe("hitTestPlanet", () => {
  it("returns the closest planet inside its hit radius", () => {
    const target = hitTestPlanet(12, 10, [
      { id: "mercury", x: 10, y: 10, radius: 6 },
      { id: "venus", x: 25, y: 10, radius: 8 },
    ]);

    expect(target).toBe("mercury");
  });

  it("returns null when the pointer misses every planet", () => {
    expect(
      hitTestPlanet(100, 100, [
        { id: "earth", x: 10, y: 10, radius: 10 },
      ])
    ).toBeNull();
  });
});
