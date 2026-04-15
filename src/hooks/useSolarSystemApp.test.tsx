import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { missions } from "../data/missions";
import { useSolarSystemApp } from "./useSolarSystemApp";

describe("useSolarSystemApp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates selected planet and comparison mode", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("mars"));
    act(() => result.current.openComparison("distance"));

    expect(result.current.selectedPlanetId).toBe("mars");
    expect(result.current.comparisonMode).toBe("distance");
    expect(result.current.isComparisonOpen).toBe(true);
  });

  it("starts with the first mission active", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.completedMissionIds).toEqual([]);
    expect(result.current.isCurrentMissionComplete).toBe(false);
  });

  it("keeps the completed mission visible for 10 seconds before auto-advancing", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("mercury"));

    expect(result.current.selectedPlanetId).toBe("mercury");
    expect(result.current.completedMissionIds).toEqual([missions[0].id]);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.isCurrentMissionComplete).toBe(true);

    act(() => {
      vi.advanceTimersByTime(9_999);
    });

    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.isCurrentMissionComplete).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current.currentMissionIndex).toBe(1);
    expect(result.current.currentMission?.id).toBe(missions[1].id);
    expect(result.current.isCurrentMissionComplete).toBe(false);
  });

  it("does not skip a mission when selectPlanet is called twice in one event", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => {
      result.current.selectPlanet("mercury");
      result.current.selectPlanet("mercury");
    });

    expect(result.current.completedMissionIds).toEqual([missions[0].id]);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.isCurrentMissionComplete).toBe(true);

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.currentMissionIndex).toBe(1);
    expect(result.current.currentMission?.id).toBe(missions[1].id);
    expect(result.current.isCurrentMissionComplete).toBe(false);
  });

  it("ignores null selection for mission advancement", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("mercury"));
    act(() => result.current.selectPlanet(null));

    expect(result.current.selectedPlanetId).toBeNull();
    expect(result.current.completedMissionIds).toEqual([missions[0].id]);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.isCurrentMissionComplete).toBe(true);

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.currentMissionIndex).toBe(1);
    expect(result.current.currentMission?.id).toBe(missions[1].id);
    expect(result.current.isCurrentMissionComplete).toBe(false);
  });

  it("wrong planet selection does not progress the mission", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("venus"));

    expect(result.current.selectedPlanetId).toBe("venus");
    expect(result.current.completedMissionIds).toEqual([]);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.isCurrentMissionComplete).toBe(false);
  });

  it("tracks play and speed controls as UI state", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.speedMultiplier).toBe(1);

    act(() => result.current.togglePlaying());
    act(() => result.current.setSpeedMultiplier(0.5));

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.speedMultiplier).toBe(0.5);
  });

  it("resets the scene deterministically without reloading", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("mercury"));
    act(() => result.current.openComparison("distance"));
    act(() => result.current.togglePlaying());
    act(() => result.current.setSpeedMultiplier(10));
    const resetVersionBefore = result.current.sceneResetVersion;
    expect(result.current.isCurrentMissionComplete).toBe(true);
    act(() => result.current.resetScene());

    expect(result.current.selectedPlanetId).toBeNull();
    expect(result.current.comparisonMode).toBe("size");
    expect(result.current.isComparisonOpen).toBe(false);
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.speedMultiplier).toBe(1);
    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.completedMissionIds).toEqual([]);
    expect(result.current.isCurrentMissionComplete).toBe(false);
    expect(result.current.sceneResetVersion).toBe(resetVersionBefore + 1);
  });

  it("shows the final explanation for 10 seconds before clearing all missions", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("mercury"));
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    act(() => result.current.selectPlanet("neptune"));
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    act(() => result.current.selectPlanet("jupiter"));
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    act(() => result.current.selectPlanet("venus"));

    expect(result.current.currentMission?.id).toBe(missions[3].id);
    expect(result.current.isCurrentMissionComplete).toBe(true);

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.currentMission).toBeNull();
    expect(result.current.currentMissionIndex).toBe(missions.length);
    expect(result.current.isCurrentMissionComplete).toBe(false);
  });

  it("cancels a pending auto-advance when the scene resets", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("mercury"));

    expect(result.current.isCurrentMissionComplete).toBe(true);

    act(() => result.current.resetScene());
    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.completedMissionIds).toEqual([]);
    expect(result.current.isCurrentMissionComplete).toBe(false);
  });
});
