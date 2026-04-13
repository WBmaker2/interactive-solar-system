import { describe, expect, it } from "vitest";

import { advanceAngles } from "./orbits";

describe("advanceAngles", () => {
  it("moves mercury further than neptune for the same time delta", () => {
    const next = advanceAngles(
      { mercury: 0, neptune: 0 },
      [
        { id: "mercury", orbitalPeriodDays: 88 },
        { id: "neptune", orbitalPeriodDays: 60190 },
      ],
      16,
      10
    );

    expect(next.mercury).toBeGreaterThan(next.neptune);
  });

  it("wraps angles within a full turn", () => {
    const next = advanceAngles(
      { earth: 355 },
      [{ id: "earth", orbitalPeriodDays: 365 }],
      1000,
      365
    );

    expect(next.earth).toBeGreaterThanOrEqual(0);
    expect(next.earth).toBeLessThan(360);
  });
});
