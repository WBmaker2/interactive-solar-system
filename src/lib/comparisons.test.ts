import { describe, expect, it } from "vitest";
import { planets } from "../data/planets";
import { buildComparisonRows } from "./comparisons";

describe("buildComparisonRows", () => {
  it("sorts planets by size and preserves label/value output", () => {
    const rows = buildComparisonRows(planets, "size");

    expect(rows.map((row) => row.id)).toEqual([
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
      "earth",
      "venus",
      "mars",
      "mercury",
    ]);
    expect(rows[0]).toEqual({
      id: "jupiter",
      label: "목성",
      value: 11.2,
    });
    expect(rows[4]).toEqual({
      id: "earth",
      label: "지구",
      value: 1,
    });
    expect(rows.at(-1)).toEqual({
      id: "mercury",
      label: "수성",
      value: 0.38,
    });
  });

  it("sorts planets by distance and preserves label/value output", () => {
    const rows = buildComparisonRows(planets, "distance");

    expect(rows.map((row) => row.id)).toEqual([
      "neptune",
      "uranus",
      "saturn",
      "jupiter",
      "mars",
      "earth",
      "venus",
      "mercury",
    ]);
    expect(rows[0]).toEqual({
      id: "neptune",
      label: "해왕성",
      value: 30.05,
    });
    expect(rows[4]).toEqual({
      id: "mars",
      label: "화성",
      value: 1.52,
    });
    expect(rows.at(-1)).toEqual({
      id: "mercury",
      label: "수성",
      value: 0.39,
    });
  });
});
