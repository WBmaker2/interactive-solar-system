import { describe, expect, it } from "vitest";

import { planets } from "../data/planets";
import { buildScene, createInitialAngles } from "./scene";

function toPositionMap(scene: ReturnType<typeof buildScene>) {
  return new Map(
    scene.scenePlanets.map((scenePlanet) => [
      scenePlanet.planet.id,
      {
        x: scenePlanet.x,
        y: scenePlanet.y,
        radius: scenePlanet.displayRadius,
      },
    ]),
  );
}

describe("scene", () => {
  it("creates the same initial angles every time", () => {
    expect(createInitialAngles()).toEqual({
      mercury: 0,
      venus: 40,
      earth: 90,
      mars: 140,
      jupiter: 180,
      saturn: 220,
      uranus: 260,
      neptune: 300,
    });
  });

  it("builds orbit layout independently of planet array order", () => {
    const angles = createInitialAngles();
    const originalScene = buildScene(800, 600, planets, angles);
    const reversedScene = buildScene(800, 600, [...planets].reverse(), angles);

    expect(reversedScene.orbitScale).toBeCloseTo(originalScene.orbitScale);
    expect(reversedScene.centerX).toBe(originalScene.centerX);
    expect(reversedScene.centerY).toBe(originalScene.centerY);

    const originalPositions = toPositionMap(originalScene);
    const reversedPositions = toPositionMap(reversedScene);

    for (const planet of planets) {
      const original = originalPositions.get(planet.id);
      const reversed = reversedPositions.get(planet.id);

      expect(reversed).toBeDefined();
      expect(original).toBeDefined();
      expect(reversed?.x).toBeCloseTo(original?.x ?? 0);
      expect(reversed?.y).toBeCloseTo(original?.y ?? 0);
      expect(reversed?.radius).toBeCloseTo(original?.radius ?? 0);
    }
  });
});
