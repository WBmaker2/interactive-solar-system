import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { missions } from "../data/missions";
import { useSolarSystemApp } from "./useSolarSystemApp";

describe("useSolarSystemApp", () => {
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

  it("selecting the correct planet marks the mission complete before advancing", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("mercury"));

    expect(result.current.selectedPlanetId).toBe("mercury");
    expect(result.current.completedMissionIds).toEqual([missions[0].id]);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.isCurrentMissionComplete).toBe(true);

    act(() => result.current.selectPlanet("mercury"));

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

    act(() => result.current.selectPlanet("mercury"));

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
    expect(result.current.speedMultiplier).toBe(6);

    act(() => result.current.togglePlaying());
    act(() => result.current.setSpeedMultiplier(12));

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.speedMultiplier).toBe(12);
  });

  it("resets the scene deterministically without reloading", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("mercury"));
    act(() => result.current.openComparison("distance"));
    act(() => result.current.togglePlaying());
    act(() => result.current.setSpeedMultiplier(12));
    const resetVersionBefore = result.current.sceneResetVersion;
    expect(result.current.isCurrentMissionComplete).toBe(true);
    act(() => result.current.resetScene());

    expect(result.current.selectedPlanetId).toBeNull();
    expect(result.current.comparisonMode).toBe("size");
    expect(result.current.isComparisonOpen).toBe(false);
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.speedMultiplier).toBe(6);
    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.completedMissionIds).toEqual([]);
    expect(result.current.isCurrentMissionComplete).toBe(false);
    expect(result.current.sceneResetVersion).toBe(resetVersionBefore + 1);
  });
});
