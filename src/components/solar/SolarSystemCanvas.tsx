import {
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent,
} from "react";

import { hitTestPlanet, type PlanetHitTarget } from "../../lib/hitTest";
import type { PlanetId, PlanetRecord } from "../../types/solar-system";

interface ScenePlanet {
  planet: PlanetRecord;
  x: number;
  y: number;
  displayRadius: number;
  hitRadius: number;
}

interface SolarSystemCanvasProps {
  planets: PlanetRecord[];
  angles: Record<PlanetId, number>;
  selectedPlanetId: PlanetId | null;
  onPlanetSelect: (planetId: PlanetId | null) => void;
}

const scenePadding = 28;
const minPlanetRadius = 4;
const maxPlanetRadius = 24;

function buildScene(
  width: number,
  height: number,
  planets: PlanetRecord[],
  angles: Record<PlanetId, number>
) {
  const maxOrbitRadius = planets[planets.length - 1]?.orbitRadius ?? 1;
  const usableRadius = Math.max(0, Math.min(width, height) / 2 - scenePadding);
  const orbitScale = usableRadius / maxOrbitRadius;
  const centerX = width / 2;
  const centerY = height / 2;
  const sunRadius = Math.max(22, Math.min(38, Math.min(width, height) * 0.075));

  const scenePlanets = planets.map((planet) => {
    const angle = ((angles[planet.id] ?? 0) - 90) * (Math.PI / 180);
    const orbitRadius = planet.orbitRadius * orbitScale;
    const displayRadius = Math.min(
      maxPlanetRadius,
      Math.max(minPlanetRadius, planet.visualRadius * orbitScale)
    );
    const x = centerX + Math.cos(angle) * orbitRadius;
    const y = centerY + Math.sin(angle) * orbitRadius;

    return {
      planet,
      x,
      y,
      displayRadius,
      hitRadius: Math.max(displayRadius + 6, 10),
    };
  });

  return {
    centerX,
    centerY,
    orbitScale,
    sunRadius,
    scenePlanets,
  };
}

function drawScene(
  canvas: HTMLCanvasElement,
  planets: PlanetRecord[],
  angles: Record<PlanetId, number>,
  selectedPlanetId: PlanetId | null,
  targetsRef: MutableRefObject<PlanetHitTarget[]>
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
  angles,
  selectedPlanetId,
  onPlanetSelect,
}: SolarSystemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const sceneTargetRef = useRef<PlanetHitTarget[]>([]);
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
    const canvas = canvasRef.current;

    if (!canvas || canvasSize.width <= 0 || canvasSize.height <= 0) {
      return;
    }

    drawScene(canvas, planets, angles, selectedPlanetId, sceneTargetRef);
  }, [angles, canvasSize.height, canvasSize.width, planets, selectedPlanetId]);

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
    </section>
  );
}
