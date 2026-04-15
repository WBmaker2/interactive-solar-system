import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { missions } from "./data/missions";
import { planets } from "./data/planets";
import type { ComparisonMode } from "./types/solar-system";

const mockUseSolarSystemApp = vi.fn();

vi.mock("./hooks/useSolarSystemApp", () => ({
  useSolarSystemApp: () => mockUseSolarSystemApp(),
}));

import App from "./App";

function createHookState(overrides: Partial<ReturnType<typeof mockUseSolarSystemApp>> = {}) {
  return {
    planets,
    selectedPlanetId: null,
    isPlaying: true,
    speedMultiplier: 1,
    currentMission: missions[0],
    isCurrentMissionComplete: false,
    comparisonMode: "size" as ComparisonMode,
    isComparisonOpen: false,
    sceneResetVersion: 0,
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

    expect(screen.getByLabelText("오늘의 미션")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByLabelText("오늘의 미션")).toHaveAttribute("aria-atomic", "true");
    expect(screen.getByText("완료")).toBeInTheDocument();
    expect(screen.getByText(missions[0].prompt)).toBeInTheDocument();
    expect(screen.getByText("정답")).toBeInTheDocument();
    expect(screen.getByText("왜 그럴까요?")).toBeInTheDocument();
    expect(screen.getByText("헷갈리기 쉬운 점")).toBeInTheDocument();
    expect(screen.getByText(missions[0].completionExplanation.answer)).toBeInTheDocument();
    expect(screen.getByText(missions[0].completionExplanation.reason)).toBeInTheDocument();
    expect(screen.getByText(missions[0].completionExplanation.caution)).toBeInTheDocument();
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

  it("keeps the explanation hidden while the mission is still active", () => {
    mockUseSolarSystemApp.mockReturnValue(
      createHookState({
        currentMission: missions[3],
        isCurrentMissionComplete: false,
      }),
    );

    render(<App />);

    expect(screen.getByText("진행 중")).toBeInTheDocument();
    expect(screen.getByText(missions[3].prompt)).toBeInTheDocument();
    expect(screen.queryByText("정답")).not.toBeInTheDocument();
  });
});
