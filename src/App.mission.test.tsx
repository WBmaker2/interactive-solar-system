import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { missions } from "./data/missions";
import { planets } from "./data/planets";
import type { ComparisonMode, PlanetId } from "./types/solar-system";

const mockUseSolarSystemApp = vi.fn();

vi.mock("./hooks/useSolarSystemApp", () => ({
  useSolarSystemApp: () => mockUseSolarSystemApp(),
}));

import App from "./App";

const angles: Record<PlanetId, number> = {
  mercury: 0,
  venus: 40,
  earth: 90,
  mars: 140,
  jupiter: 180,
  saturn: 220,
  uranus: 260,
  neptune: 300,
};

function createHookState(overrides: Partial<ReturnType<typeof mockUseSolarSystemApp>> = {}) {
  return {
    planets,
    angles,
    selectedPlanetId: null,
    isPlaying: true,
    speedMultiplier: 6,
    currentMission: missions[0],
    isCurrentMissionComplete: false,
    comparisonMode: "size" as ComparisonMode,
    isComparisonOpen: false,
    selectPlanet: vi.fn(),
    togglePlaying: vi.fn(),
    setSpeedMultiplier: vi.fn(),
    resetScene: vi.fn(),
    openComparison: vi.fn(),
    closeComparison: vi.fn(),
    ...overrides,
  };
}

describe("App mission strip", () => {
  beforeEach(() => {
    mockUseSolarSystemApp.mockReset();
    mockUseSolarSystemApp.mockReturnValue(createHookState());
  });

  it("shows the completed status for the current mission", () => {
    mockUseSolarSystemApp.mockReturnValue(
      createHookState({
        currentMission: missions[0],
        isCurrentMissionComplete: true,
      }),
    );

    render(<App />);

    expect(screen.getByText("완료")).toBeInTheDocument();
    expect(screen.getByText(missions[0].prompt)).toBeInTheDocument();
  });

  it("shows the all-clear message when no mission is left", () => {
    mockUseSolarSystemApp.mockReturnValue(
      createHookState({
        currentMission: null,
        isCurrentMissionComplete: false,
      }),
    );

    render(<App />);

    expect(screen.getByText("모든 미션을 완료했어요.")).toBeInTheDocument();
    expect(screen.queryByText("진행 중")).not.toBeInTheDocument();
    expect(screen.queryByText("완료")).not.toBeInTheDocument();
  });
});
