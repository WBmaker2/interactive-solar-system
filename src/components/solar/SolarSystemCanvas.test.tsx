import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { planets } from "../../data/planets";
import { advanceAngles } from "../../lib/orbits";
import { buildScene, createInitialAngles } from "../../lib/scene";
import { installCanvasTestEnvironment } from "../../test/canvasTestUtils";
import SolarSystemCanvas from "./SolarSystemCanvas";

describe("SolarSystemCanvas", () => {
  let env: ReturnType<typeof installCanvasTestEnvironment>;
  const canvas = () => screen.getByLabelText("태양계 궤도 시각화");

  const clickPlanet = (x: number, y: number) => {
    canvas().dispatchEvent(
      new MouseEvent("pointerdown", {
        bubbles: true,
        button: 0,
        clientX: x,
        clientY: y,
      }),
    );
  };

  beforeEach(() => {
    env = installCanvasTestEnvironment();
  });

  afterEach(() => {
    env.cleanup();
  });

  it("highlights the selected planet and routes pointer hits to the current scene", async () => {
    const onPlanetSelect = vi.fn();

    render(
      <SolarSystemCanvas
        isPlaying={false}
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={0}
        selectedPlanetId="earth"
        speedMultiplier={6}
      />,
    );

    await waitFor(() => {
      expect(env.contextMock.arc).toHaveBeenCalled();
    });

    const scene = buildScene(800, 600, planets, createInitialAngles());
    const mercury = scene.scenePlanets.find((scenePlanet) => scenePlanet.planet.id === "mercury");
    const earth = scene.scenePlanets.find((scenePlanet) => scenePlanet.planet.id === "earth");

    expect(mercury).toBeDefined();
    expect(earth).toBeDefined();

    const highlightCall = env.contextMock.arc.mock.calls.find(([x, y, radius]) => {
      return (
        Math.abs(x - (earth?.x ?? 0)) < 0.001 &&
        Math.abs(y - (earth?.y ?? 0)) < 0.001 &&
        Math.abs(radius - ((earth?.displayRadius ?? 0) + 5)) < 0.001
      );
    });

    expect(highlightCall).toBeDefined();

    clickPlanet((mercury?.x ?? 0) + 1, (mercury?.y ?? 0) + 1);

    expect(onPlanetSelect).toHaveBeenCalledWith("mercury");
  });

  it("offers accessible planet selection buttons outside pointer hit testing", async () => {
    const onPlanetSelect = vi.fn();

    render(
      <SolarSystemCanvas
        isPlaying={false}
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={0}
        selectedPlanetId={null}
        speedMultiplier={1}
      />,
    );

    const controls = screen.getByRole("group", { name: "행성 바로 선택" });
    const earthButton = screen.getByRole("button", { name: "지구 선택" });

    expect(controls).toBeInTheDocument();
    earthButton.click();

    expect(onPlanetSelect).toHaveBeenCalledWith("earth");
  });

  it("updates hit targets after animation frames advance", async () => {
    const onPlanetSelect = vi.fn();

    render(
      <SolarSystemCanvas
        isPlaying
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={0}
        selectedPlanetId={null}
        speedMultiplier={6}
      />,
    );

    await waitFor(() => {
      expect(env.requestAnimationFrameMock).toHaveBeenCalledTimes(1);
    });

    env.flushAnimationFrame(1000);
    env.flushAnimationFrame(2000);

    const nextAngles = advanceAngles(createInitialAngles(), planets, 1000, 6);
    const nextScene = buildScene(800, 600, planets, nextAngles);
    const mercury = nextScene.scenePlanets.find((scenePlanet) => scenePlanet.planet.id === "mercury");

    expect(mercury).toBeDefined();

    clickPlanet((mercury?.x ?? 0) + 1, (mercury?.y ?? 0) + 1);

    expect(onPlanetSelect).toHaveBeenCalledWith("mercury");
  });

  it("stops requesting frames when paused", async () => {
    const onPlanetSelect = vi.fn();

    const { rerender } = render(
      <SolarSystemCanvas
        isPlaying
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={0}
        selectedPlanetId={null}
        speedMultiplier={6}
      />,
    );

    await waitFor(() => {
      expect(env.requestAnimationFrameMock).toHaveBeenCalledTimes(1);
    });

    const scheduledFrameId = env.requestAnimationFrameMock.mock.results[0]?.value as number;

    rerender(
      <SolarSystemCanvas
        isPlaying={false}
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={0}
        selectedPlanetId={null}
        speedMultiplier={6}
      />,
    );

    expect(env.cancelAnimationFrameMock).toHaveBeenCalledWith(scheduledFrameId);
    expect(env.getScheduledFrameCount()).toBe(0);
  });

  it("uses the latest speed multiplier for future animation frames", async () => {
    const onPlanetSelect = vi.fn();

    const { rerender } = render(
      <SolarSystemCanvas
        isPlaying
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={0}
        selectedPlanetId={null}
        speedMultiplier={6}
      />,
    );

    await waitFor(() => {
      expect(env.requestAnimationFrameMock).toHaveBeenCalledTimes(1);
    });

    env.flushAnimationFrame(1000);
    env.flushAnimationFrame(2000);

    rerender(
      <SolarSystemCanvas
        isPlaying
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={0}
        selectedPlanetId={null}
        speedMultiplier={12}
      />,
    );

    env.flushAnimationFrame(3000);
    env.flushAnimationFrame(4000);

    const expectedAngles = advanceAngles(
      advanceAngles(
        advanceAngles(createInitialAngles(), planets, 1000, 6),
        planets,
        1000,
        12,
      ),
      planets,
      1000,
      12,
    );
    const expectedScene = buildScene(800, 600, planets, expectedAngles);
    const mercury = expectedScene.scenePlanets.find(
      (scenePlanet) => scenePlanet.planet.id === "mercury",
    );

    expect(mercury).toBeDefined();

    clickPlanet((mercury?.x ?? 0) + 1, (mercury?.y ?? 0) + 1);

    expect(onPlanetSelect).toHaveBeenCalledWith("mercury");
  });

  it("keeps the animation loop alive when selection or speed changes", async () => {
    const onPlanetSelect = vi.fn();

    const { rerender } = render(
      <SolarSystemCanvas
        isPlaying
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={0}
        selectedPlanetId={null}
        speedMultiplier={1}
      />,
    );

    await waitFor(() => {
      expect(env.requestAnimationFrameMock).toHaveBeenCalledTimes(1);
    });

    rerender(
      <SolarSystemCanvas
        isPlaying
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={0}
        selectedPlanetId="earth"
        speedMultiplier={10}
      />,
    );

    expect(env.cancelAnimationFrameMock).not.toHaveBeenCalled();
    expect(env.requestAnimationFrameMock).toHaveBeenCalledTimes(1);
  });

  it("restores the initial orbit positions after reset", async () => {
    const onPlanetSelect = vi.fn();

    const { rerender } = render(
      <SolarSystemCanvas
        isPlaying
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={0}
        selectedPlanetId={null}
        speedMultiplier={6}
      />,
    );

    await waitFor(() => {
      expect(env.requestAnimationFrameMock).toHaveBeenCalledTimes(1);
    });

    env.flushAnimationFrame(1000);
    env.flushAnimationFrame(2000);

    const initialScene = buildScene(800, 600, planets, createInitialAngles());
    const mercury = initialScene.scenePlanets.find((scenePlanet) => scenePlanet.planet.id === "mercury");

    expect(mercury).toBeDefined();

    rerender(
      <SolarSystemCanvas
        isPlaying={false}
        onPlanetSelect={onPlanetSelect}
        planets={planets}
        sceneResetVersion={1}
        selectedPlanetId={null}
        speedMultiplier={6}
      />,
    );

    clickPlanet((mercury?.x ?? 0) + 1, (mercury?.y ?? 0) + 1);

    expect(onPlanetSelect).toHaveBeenCalledWith("mercury");
  });
});
