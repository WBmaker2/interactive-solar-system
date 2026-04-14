import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { missions } from "../data/missions";
import { useSolarSystemApp } from "./useSolarSystemApp";

type RafCallback = FrameRequestCallback;

describe("useSolarSystemApp", () => {
  let frameId = 0;
  const scheduledFrames = new Map<number, RafCallback>();

  const requestAnimationFrameMock = (callback: RafCallback) => {
    frameId += 1;
    scheduledFrames.set(frameId, callback);
    return frameId;
  };

  const cancelAnimationFrameMock = (id: number) => {
    scheduledFrames.delete(id);
  };

  const flushFrames = (now: number) => {
    const callbacks = Array.from(scheduledFrames.entries());
    scheduledFrames.clear();

    for (const [, callback] of callbacks) {
      callback(now);
    }
  };

  beforeEach(() => {
    frameId = 0;
    scheduledFrames.clear();
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    scheduledFrames.clear();
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

  it("wrong planet selection does not progress the mission", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("venus"));

    expect(result.current.selectedPlanetId).toBe("venus");
    expect(result.current.completedMissionIds).toEqual([]);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.isCurrentMissionComplete).toBe(false);
  });

  it("advances angles while playing and pauses the loop when stopped", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => {
      flushFrames(16);
      flushFrames(32);
    });

    const angleWhilePlaying = result.current.angles.mercury;
    expect(angleWhilePlaying).toBeGreaterThan(0);

    act(() => result.current.togglePlaying());

    act(() => {
      flushFrames(48);
      flushFrames(64);
    });

    expect(result.current.angles.mercury).toBe(angleWhilePlaying);
  });

  it("reacts to speed changes in the animation loop", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => {
      flushFrames(16);
      flushFrames(32);
    });

    const angleAtDefaultSpeed = result.current.angles.mercury;

    act(() => result.current.setSpeedMultiplier(12));

    act(() => {
      flushFrames(48);
      flushFrames(64);
    });

    const angleAtFasterSpeed = result.current.angles.mercury;

    expect(angleAtFasterSpeed).toBeGreaterThan(angleAtDefaultSpeed);
    expect(angleAtFasterSpeed - angleAtDefaultSpeed).toBeGreaterThan(0.4);
  });

  it("resets the scene deterministically without reloading", () => {
    const { result } = renderHook(() => useSolarSystemApp());

    act(() => result.current.selectPlanet("mercury"));
    act(() => result.current.openComparison("distance"));
    act(() => result.current.togglePlaying());
    act(() => result.current.setSpeedMultiplier(12));
    expect(result.current.isCurrentMissionComplete).toBe(true);
    act(() => result.current.resetScene());

    expect(result.current.selectedPlanetId).toBeNull();
    expect(result.current.comparisonMode).toBe("size");
    expect(result.current.isComparisonOpen).toBe(false);
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.speedMultiplier).toBe(6);
    expect(result.current.angles).toEqual({
      mercury: 0,
      venus: 40,
      earth: 90,
      mars: 140,
      jupiter: 180,
      saturn: 220,
      uranus: 260,
      neptune: 300,
    });
    expect(result.current.currentMission?.id).toBe(missions[0].id);
    expect(result.current.currentMissionIndex).toBe(0);
    expect(result.current.completedMissionIds).toEqual([]);
    expect(result.current.isCurrentMissionComplete).toBe(false);
  });
});
