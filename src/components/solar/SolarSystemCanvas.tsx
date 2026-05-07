import {
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent,
} from "react";

import { hitTestPlanet, type PlanetHitTarget } from "../../lib/hitTest";
import { advanceAngles } from "../../lib/orbits";
import { buildScene, createInitialAngles } from "../../lib/scene";
import type { PlanetId, PlanetRecord } from "../../types/solar-system";

interface SolarSystemCanvasProps {
  planets: PlanetRecord[];
  selectedPlanetId: PlanetId | null;
  isPlaying: boolean;
  speedMultiplier: number;
  sceneResetVersion: number;
  onPlanetSelect: (planetId: PlanetId | null) => void;
}

function drawScene(
  canvas: HTMLCanvasElement,
  planets: PlanetRecord[],
  angles: Record<PlanetId, number>,
  selectedPlanetId: PlanetId | null,
  targetsRef: MutableRefObject<PlanetHitTarget[]>,
) {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (width <= 0 || height <= 0) {
    return;
  }

  const devicePixelRatio = window.devicePixelRatio || 1;
  const renderWidth = Math.max(1, Math.round(width * devicePixelRatio));
  const renderHeight = Math.max(1, Math.round(height * devicePixelRatio));

  if (canvas.width !== renderWidth) {
    canvas.width = renderWidth;
  }

  if (canvas.height !== renderHeight) {
    canvas.height = renderHeight;
  }

  const scene = buildScene(width, height, planets, angles);
  targetsRef.current = scene.scenePlanets.map((scenePlanet) => ({
    id: scenePlanet.planet.id,
    x: scenePlanet.x,
    y: scenePlanet.y,
    radius: scenePlanet.hitRadius,
  }));

  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  context.clearRect(0, 0, width, height);

  context.strokeStyle = "rgba(255, 255, 255, 0.12)";
  context.lineWidth = 1;
  for (const planet of planets) {
    context.beginPath();
    context.arc(
      scene.centerX,
      scene.centerY,
      planet.orbitRadius * scene.orbitScale,
      0,
      Math.PI * 2
    );
    context.stroke();
  }

  const sunGradient = context.createRadialGradient(
    scene.centerX,
    scene.centerY,
    scene.sunRadius * 0.2,
    scene.centerX,
    scene.centerY,
    scene.sunRadius * 2.2
  );
  sunGradient.addColorStop(0, "#fff6cc");
  sunGradient.addColorStop(0.4, "#f3bf44");
  sunGradient.addColorStop(1, "rgba(243, 191, 68, 0)");

  context.save();
  context.fillStyle = sunGradient;
  context.beginPath();
  context.arc(scene.centerX, scene.centerY, scene.sunRadius * 2, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 30;
  context.shadowColor = "rgba(255, 188, 64, 0.55)";
  context.fillStyle = "#f7c85f";
  context.beginPath();
  context.arc(scene.centerX, scene.centerY, scene.sunRadius, 0, Math.PI * 2);
  context.fill();
  context.restore();

  for (const scenePlanet of scene.scenePlanets) {
    const { planet, x, y, displayRadius } = scenePlanet;

    context.save();
    const fill = context.createRadialGradient(
      x - displayRadius * 0.35,
      y - displayRadius * 0.35,
      displayRadius * 0.15,
      x,
      y,
      displayRadius
    );
    fill.addColorStop(0, "#ffffff");
    fill.addColorStop(0.22, planet.color);
    fill.addColorStop(1, planet.color);

    context.fillStyle = fill;
    context.beginPath();
    context.arc(x, y, displayRadius, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "rgba(255, 255, 255, 0.22)";
    context.lineWidth = Math.max(1, displayRadius * 0.12);
    context.stroke();

    if (scenePlanet.planet.id === selectedPlanetId) {
      context.strokeStyle = "rgba(255, 255, 255, 0.9)";
      context.lineWidth = 2;
      context.shadowBlur = 18;
      context.shadowColor = "rgba(255, 255, 255, 0.65)";
      context.beginPath();
      context.arc(x, y, displayRadius + 5, 0, Math.PI * 2);
      context.stroke();
    }

    context.restore();
  }
}

export default function SolarSystemCanvas({
  planets,
  selectedPlanetId,
  isPlaying,
  speedMultiplier,
  sceneResetVersion,
  onPlanetSelect,
}: SolarSystemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const sceneTargetRef = useRef<PlanetHitTarget[]>([]);
  const anglesRef = useRef(createInitialAngles());
  const appliedResetVersionRef = useRef(sceneResetVersion);
  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const selectedPlanetIdRef = useRef(selectedPlanetId);
  const speedMultiplierRef = useRef(speedMultiplier);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const updateSize = () => {
      setCanvasSize({
        width: stage.clientWidth,
        height: stage.clientHeight,
      });
    };

    updateSize();

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateSize);

    if (observer) {
      observer.observe(stage);
    } else {
      window.addEventListener("resize", updateSize);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      } else {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);

  useLayoutEffect(() => {
    selectedPlanetIdRef.current = selectedPlanetId;
    speedMultiplierRef.current = speedMultiplier;

    if (isPlaying) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas || canvasSize.width <= 0 || canvasSize.height <= 0) {
      return;
    }

    drawScene(canvas, planets, anglesRef.current, selectedPlanetIdRef.current, sceneTargetRef);
  }, [
    canvasSize.height,
    canvasSize.width,
    isPlaying,
    planets,
    selectedPlanetId,
    speedMultiplier,
  ]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || canvasSize.width <= 0 || canvasSize.height <= 0) {
      return;
    }

    const stopLoop = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      previousTimeRef.current = null;
    };

    if (appliedResetVersionRef.current !== sceneResetVersion) {
      anglesRef.current = createInitialAngles();
      appliedResetVersionRef.current = sceneResetVersion;
    }

    stopLoop();
    drawScene(canvas, planets, anglesRef.current, selectedPlanetIdRef.current, sceneTargetRef);

    if (!isPlaying) {
      return stopLoop;
    }

    const tick = (now: number) => {
      const previousTime = previousTimeRef.current ?? now;
      const deltaMs = now - previousTime;

      anglesRef.current = advanceAngles(
        anglesRef.current,
        planets,
        deltaMs,
        speedMultiplierRef.current,
      );
      previousTimeRef.current = now;
      drawScene(canvas, planets, anglesRef.current, selectedPlanetIdRef.current, sceneTargetRef);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return stopLoop;
  }, [
    canvasSize.height,
    canvasSize.width,
    isPlaying,
    planets,
    sceneResetVersion,
  ]);

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const planetId = hitTestPlanet(x, y, sceneTargetRef.current);

    onPlanetSelect(planetId);
  };

  return (
    <section
      ref={stageRef}
      aria-label="태양계 관찰 무대"
      className="scene-stage"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label="태양계 궤도 시각화"
        onPointerDown={handlePointerDown}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
      <div className="scene-stage__planet-controls" role="group" aria-label="행성 바로 선택">
        {planets.map((planet) => (
          <button
            key={planet.id}
            type="button"
            className="scene-stage__planet-button"
            aria-pressed={planet.id === selectedPlanetId}
            aria-label={`${planet.nameKo} 선택`}
            onClick={() => onPlanetSelect(planet.id)}
          >
            {planet.nameKo}
          </button>
        ))}
      </div>
    </section>
  );
}
