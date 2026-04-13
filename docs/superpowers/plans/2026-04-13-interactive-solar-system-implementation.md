# Interactive Solar System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a classroom-friendly interactive solar system web app with orbital animation, a right-side planet info panel, a top-left mission chip, a simple time-control bar, and a comparison overlay for size and distance learning.

**Architecture:** Build a Vite + React + TypeScript application where orbital math and educational rules live in pure modules, shared app state is owned by one hook, the solar system itself is rendered in a dedicated canvas component, and text-heavy UI stays in DOM components. Keep display scaling helpers separate from real-world values so the app can stay visually legible while still teaching accurate comparisons through copy and comparison views.

**Tech Stack:** Vite, React, TypeScript, HTML Canvas, CSS variables, Vitest, React Testing Library, jsdom, npm

---

**Spec reference:** `docs/superpowers/specs/2026-04-13-interactive-solar-system-design.md`

**Execution notes:**
- Use `@frontend-skill` when making layout and motion decisions.
- Use `@subagent-driven-development` if you want each task executed with independent worker/review loops.
- Current workspace is not a git repository. If `.git/` is absent during execution, treat each commit step as a local checkpoint note instead of a real commit.

## Scope Guardrails

- Ship only the approved MVP: orbital scene, mission chip, planet info panel, time controls, comparison view, responsive/mobile support, and accessibility basics.
- Do not add backend storage, leaderboards, accounts, narration, 3D rendering, or printable worksheets in this plan.
- Keep the comparison feature inside the same frontend app. No route splitting is needed.

## File Structure

- Create: `package.json` — app scripts and dependency list
- Create: `tsconfig.json` — TypeScript compiler options
- Create: `tsconfig.node.json` — Vite/node config typing
- Create: `vite.config.ts` — Vite React setup
- Create: `vitest.config.ts` — Vitest + jsdom configuration
- Create: `index.html` — Vite entry document
- Create: `public/planets/mercury.webp` — local planet image asset
- Create: `public/planets/venus.webp` — local planet image asset
- Create: `public/planets/earth.webp` — local planet image asset
- Create: `public/planets/mars.webp` — local planet image asset
- Create: `public/planets/jupiter.webp` — local planet image asset
- Create: `public/planets/saturn.webp` — local planet image asset
- Create: `public/planets/uranus.webp` — local planet image asset
- Create: `public/planets/neptune.webp` — local planet image asset
- Create: `src/main.tsx` — React bootstrap
- Create: `src/App.tsx` — top-level composition of canvas and UI surfaces
- Create: `src/styles/app.css` — theme tokens, layout, responsive rules, reduced-motion support
- Create: `src/test/setup.ts` — RTL and jest-dom setup
- Create: `src/types/solar-system.ts` — shared domain types
- Create: `src/data/planets.ts` — eight-planet dataset and scale notice copy
- Create: `src/data/missions.ts` — short classroom-friendly mission prompts
- Create: `src/lib/orbits.ts` — pure orbit angle update helpers
- Create: `src/lib/hitTest.ts` — map canvas clicks to the nearest rendered planet
- Create: `src/lib/comparisons.ts` — size/distance comparison helpers
- Create: `src/hooks/useSolarSystemApp.ts` — app state, actions, and timed simulation updates
- Create: `src/components/solar/SolarSystemCanvas.tsx` — canvas render loop and click handling
- Create: `src/components/ui/MissionChip.tsx` — top-left mission display
- Create: `src/components/ui/PlanetInfoPanel.tsx` — right-side desktop panel and empty state
- Create: `src/components/ui/ControlBar.tsx` — play/pause, time slider, reset, comparison button
- Create: `src/components/ui/ComparisonSheet.tsx` — size/distance comparison overlay
- Create: `src/components/ui/ScaleNotice.tsx` — “학습용 시각화” 안내
- Create: `src/components/ui/MobileInfoSheet.tsx` — mobile bottom sheet wrapper for planet details
- Test: `src/App.test.tsx`
- Test: `src/data/planets.test.ts`
- Test: `src/lib/orbits.test.ts`
- Test: `src/lib/hitTest.test.ts`
- Test: `src/lib/comparisons.test.ts`
- Test: `src/hooks/useSolarSystemApp.test.tsx`
- Test: `src/components/ui/ControlBar.test.tsx`
- Test: `src/components/ui/PlanetInfoPanel.test.tsx`
- Test: `src/components/ui/ComparisonSheet.test.tsx`

## Verification Targets

- `npm run test -- --run` passes
- `npm run build` passes
- Manual smoke check confirms:
  - planets animate at different speeds
  - the sun, orbit rings, and planets render crisply without blur on high-DPR screens
  - clicking a planet updates the detail panel
  - moving the speed slider changes orbit speed
  - comparison overlay opens and switches between size/distance views
  - mobile layout hides the desktop panel and moves planet details into a bottom sheet

### Task 1: Scaffold the Vite React app and shell test harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/app.css`
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Create the package manifest and scripts**

```json
{
  "name": "interactive-solar-system",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "jsdom": "^24.1.1",
    "typescript": "^5.5.4",
    "vite": "^5.3.4",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`  
Expected: packages install cleanly and `package-lock.json` is created

- [ ] **Step 3: Write the failing app shell test**

```tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App shell", () => {
  it("renders the classroom shell labels", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "내 손안의 우주" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("행성을 눌러 자세히 살펴보세요.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "시간 빨리 감기" })
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the shell test to verify it fails**

Run: `npm run test -- src/App.test.tsx --run`  
Expected: FAIL because `App` does not yet render the heading, empty panel copy, and slider

- [ ] **Step 5: Implement the minimum app shell**

```tsx
export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>내 손안의 우주</h1>
      </header>

      <main className="app-main">
        <section aria-label="태양계 관찰 무대" className="scene-stage" />
        <aside aria-label="행성 정보 패널" className="info-panel">
          <p>행성을 눌러 자세히 살펴보세요.</p>
        </aside>
      </main>

      <footer className="control-bar">
        <label>
          <span className="sr-only">시간 빨리 감기</span>
          <input aria-label="시간 빨리 감기" type="range" min="1" max="20" />
        </label>
      </footer>
    </div>
  );
}
```

- [ ] **Step 6: Run the shell test to verify it passes**

Run: `npm run test -- src/App.test.tsx --run`  
Expected: PASS

- [ ] **Step 7: Run a build smoke check**

Run: `npm run build`  
Expected: Vite production build completes successfully

- [ ] **Step 8: Commit or checkpoint**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.node.json vite.config.ts vitest.config.ts index.html src/main.tsx src/App.tsx src/styles/app.css src/test/setup.ts src/App.test.tsx
git commit -m "feat: scaffold solar system app shell"
```

### Task 2: Add the planet dataset, mission prompts, and comparison helpers

**Files:**
- Create: `src/types/solar-system.ts`
- Create: `src/data/planets.ts`
- Create: `src/data/missions.ts`
- Create: `src/lib/comparisons.ts`
- Test: `src/data/planets.test.ts`
- Test: `src/lib/comparisons.test.ts`

- [ ] **Step 1: Write failing data tests**

```ts
import { planets, scaleNotice } from "./planets";

describe("planet data", () => {
  it("contains the eight planets in solar order", () => {
    expect(planets.map((planet) => planet.id)).toEqual([
      "mercury",
      "venus",
      "earth",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
    ]);
  });

  it("includes the learning scale notice", () => {
    expect(scaleNotice).toMatch(/표현을 조정/);
  });

  it("includes local images and next-step prompts", () => {
    expect(planets.every((planet) => planet.imageSrc.startsWith("/planets/"))).toBe(true);
    expect(planets.every((planet) => planet.nextExplorationPrompt.length > 0)).toBe(true);
  });
});
```

```ts
import { buildComparisonRows } from "./comparisons";
import { planets } from "../data/planets";

describe("buildComparisonRows", () => {
  it("sorts planets by size for size comparisons", () => {
    const rows = buildComparisonRows(planets, "size");
    expect(rows[0].id).toBe("jupiter");
    expect(rows.at(-1)?.id).toBe("mercury");
  });
});
```

- [ ] **Step 2: Run the data tests to verify they fail**

Run: `npm run test -- src/data/planets.test.ts src/lib/comparisons.test.ts --run`  
Expected: FAIL because the data and helper modules do not exist yet

- [ ] **Step 3: Define the shared types**

```ts
export type PlanetId =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export interface PlanetRecord {
  id: PlanetId;
  nameKo: string;
  nameEn: string;
  color: string;
  orbitRadius: number;
  visualRadius: number;
  orbitalPeriodDays: number;
  distanceFromSunAU: number;
  diameterEarths: number;
  imageSrc: string;
  summary: string;
  facts: string[];
  nextExplorationPrompt: string;
}

export type ComparisonMode = "size" | "distance";
```

- [ ] **Step 4: Implement the dataset, local image asset paths, and mission content**

Use NASA public-domain planet imagery or equivalent classroom-safe assets, convert them to lightweight `.webp` files, and place them under `public/planets/` before wiring the dataset below.

```ts
export const scaleNotice =
  "보기 쉽게 일부 크기와 거리 표현을 조정했습니다. 비교는 안내 문장과 비교 보기 화면을 함께 참고하세요.";

export const planets: PlanetRecord[] = [
  {
    id: "mercury",
    nameKo: "수성",
    nameEn: "Mercury",
    color: "#b7b0a2",
    orbitRadius: 48,
    visualRadius: 5,
    orbitalPeriodDays: 88,
    distanceFromSunAU: 0.39,
    diameterEarths: 0.38,
    imageSrc: "/planets/mercury.webp",
    summary: "태양에 가장 가까워 빠르게 한 바퀴를 도는 행성이에요.",
    facts: ["태양과 가장 가깝다", "공전 속도가 가장 빠르다"],
    nextExplorationPrompt: "다음으로 금성을 눌러 지구와의 크기 차이를 살펴보세요.",
  },
  {
    id: "venus",
    nameKo: "금성",
    nameEn: "Venus",
    color: "#ccb487",
    orbitRadius: 74,
    visualRadius: 8,
    orbitalPeriodDays: 225,
    distanceFromSunAU: 0.72,
    diameterEarths: 0.95,
    imageSrc: "/planets/venus.webp",
    summary: "두꺼운 구름 때문에 밝게 보이는 행성이에요.",
    facts: ["지구와 크기가 비슷하다", "밝게 보인다"],
    nextExplorationPrompt: "다음으로 지구를 눌러 금성과 얼마나 비슷한지 비교해 보세요.",
  },
  {
    id: "earth",
    nameKo: "지구",
    nameEn: "Earth",
    color: "#7cc7ff",
    orbitRadius: 104,
    visualRadius: 8,
    orbitalPeriodDays: 365,
    distanceFromSunAU: 1,
    diameterEarths: 1,
    imageSrc: "/planets/earth.webp",
    summary: "우리가 살고 있는 행성이며 비교 기준으로 사용해요.",
    facts: ["생명체가 사는 행성", "비교 기준 행성"],
    nextExplorationPrompt: "다음으로 화성을 눌러 지구보다 얼마나 작은지 확인해 보세요.",
  },
  {
    id: "mars",
    nameKo: "화성",
    nameEn: "Mars",
    color: "#d77c55",
    orbitRadius: 132,
    visualRadius: 6,
    orbitalPeriodDays: 687,
    distanceFromSunAU: 1.52,
    diameterEarths: 0.53,
    imageSrc: "/planets/mars.webp",
    summary: "붉은빛이 도는 작은 행성이에요.",
    facts: ["붉게 보인다", "지구보다 작다"],
    nextExplorationPrompt: "다음으로 목성을 눌러 크기 차이가 얼마나 큰지 살펴보세요.",
  },
  {
    id: "jupiter",
    nameKo: "목성",
    nameEn: "Jupiter",
    color: "#c5a06d",
    orbitRadius: 182,
    visualRadius: 18,
    orbitalPeriodDays: 4333,
    distanceFromSunAU: 5.2,
    diameterEarths: 11.2,
    imageSrc: "/planets/jupiter.webp",
    summary: "태양계에서 가장 큰 행성이에요.",
    facts: ["가장 크다", "줄무늬가 보인다"],
    nextExplorationPrompt: "다음으로 토성을 눌러 큰 행성끼리 어떻게 다른지 비교해 보세요.",
  },
  {
    id: "saturn",
    nameKo: "토성",
    nameEn: "Saturn",
    color: "#dfd4a6",
    orbitRadius: 236,
    visualRadius: 15,
    orbitalPeriodDays: 10759,
    distanceFromSunAU: 9.58,
    diameterEarths: 9.45,
    imageSrc: "/planets/saturn.webp",
    summary: "넓은 고리로 유명한 큰 행성이에요.",
    facts: ["고리가 있다", "매우 크다"],
    nextExplorationPrompt: "다음으로 천왕성을 눌러 바깥 행성의 공전 속도를 비교해 보세요.",
  },
  {
    id: "uranus",
    nameKo: "천왕성",
    nameEn: "Uranus",
    color: "#8fd8d7",
    orbitRadius: 286,
    visualRadius: 12,
    orbitalPeriodDays: 30687,
    distanceFromSunAU: 19.2,
    diameterEarths: 4.01,
    imageSrc: "/planets/uranus.webp",
    summary: "푸른빛을 띠는 차가운 바깥 행성이에요.",
    facts: ["멀리 있다", "푸른빛이 돈다"],
    nextExplorationPrompt: "다음으로 해왕성을 눌러 태양에서 더 멀리 있는 행성을 찾아보세요.",
  },
  {
    id: "neptune",
    nameKo: "해왕성",
    nameEn: "Neptune",
    color: "#6f8fff",
    orbitRadius: 332,
    visualRadius: 12,
    orbitalPeriodDays: 60190,
    distanceFromSunAU: 30.05,
    diameterEarths: 3.88,
    imageSrc: "/planets/neptune.webp",
    summary: "태양에서 가장 멀리 있는 행성이에요.",
    facts: ["태양에서 가장 멀다", "공전이 매우 느리다"],
    nextExplorationPrompt: "다음으로 수성을 눌러 가장 빠른 행성과 가장 느린 행성을 비교해 보세요.",
  },
];

export const missions = [
  "가장 빠르게 공전하는 행성을 찾아보세요.",
  "태양에서 가장 먼 행성을 찾아보세요.",
  "가장 큰 행성을 찾아보세요.",
  "지구와 크기가 비슷한 행성을 찾아보세요.",
];
```

- [ ] **Step 5: Implement the comparison helper**

```ts
export function buildComparisonRows(
  planetList: PlanetRecord[],
  mode: ComparisonMode
) {
  const accessor =
    mode === "size"
      ? (planet: PlanetRecord) => planet.diameterEarths
      : (planet: PlanetRecord) => planet.distanceFromSunAU;

  return [...planetList]
    .sort((a, b) => accessor(b) - accessor(a))
    .map((planet) => ({
      id: planet.id,
      label: planet.nameKo,
      value: accessor(planet),
    }));
}
```

- [ ] **Step 6: Run the data tests to verify they pass**

Run: `npm run test -- src/data/planets.test.ts src/lib/comparisons.test.ts --run`  
Expected: PASS

- [ ] **Step 7: Commit or checkpoint**

```bash
git add src/types/solar-system.ts src/data/planets.ts src/data/missions.ts src/lib/comparisons.ts src/data/planets.test.ts src/lib/comparisons.test.ts
git commit -m "feat: add solar system learning data"
```

### Task 3: Build pure orbit math and the shared application state hook

**Files:**
- Create: `src/lib/orbits.ts`
- Create: `src/hooks/useSolarSystemApp.ts`
- Test: `src/lib/orbits.test.ts`
- Test: `src/hooks/useSolarSystemApp.test.tsx`

- [ ] **Step 1: Write the failing orbit and state tests**

```ts
import { advanceAngles } from "./orbits";

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
```

```tsx
import { renderHook, act } from "@testing-library/react";
import { useSolarSystemApp } from "./useSolarSystemApp";

it("updates selected planet and comparison mode", () => {
  const { result } = renderHook(() => useSolarSystemApp());

  act(() => result.current.selectPlanet("mars"));
  act(() => result.current.openComparison("distance"));

  expect(result.current.selectedPlanetId).toBe("mars");
  expect(result.current.comparisonMode).toBe("distance");
  expect(result.current.isComparisonOpen).toBe(true);
});
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `npm run test -- src/lib/orbits.test.ts src/hooks/useSolarSystemApp.test.tsx --run`  
Expected: FAIL because the modules do not exist yet

- [ ] **Step 3: Implement the orbit math module**

```ts
type AngleMap = Record<string, number>;

export function advanceAngles(
  current: AngleMap,
  planets: Array<{ id: string; orbitalPeriodDays: number }>,
  deltaMs: number,
  speedMultiplier: number
) {
  const next: AngleMap = { ...current };
  const simulationDays = (deltaMs / 1000) * speedMultiplier * 12;

  for (const planet of planets) {
    const degreesPerDay = 360 / planet.orbitalPeriodDays;
    next[planet.id] =
      (current[planet.id] + degreesPerDay * simulationDays) % 360;
  }

  return next;
}
```

- [ ] **Step 4: Implement the shared app hook**

```tsx
export function useSolarSystemApp() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(6);
  const [selectedPlanetId, setSelectedPlanetId] = useState<PlanetId | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("size");
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [angles, setAngles] = useState<Record<PlanetId, number>>({
    mercury: 0,
    venus: 40,
    earth: 90,
    mars: 140,
    jupiter: 180,
    saturn: 220,
    uranus: 260,
    neptune: 300,
  });

  useEffect(() => {
    if (!isPlaying) return;

    let frameId = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      setAngles((current) => advanceAngles(current, planets, now - previous, speedMultiplier));
      previous = now;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speedMultiplier]);

  return {
    planets,
    missions,
    angles,
    isPlaying,
    speedMultiplier,
    selectedPlanetId,
    comparisonMode,
    isComparisonOpen,
    selectPlanet: setSelectedPlanetId,
    togglePlaying: () => setIsPlaying((value) => !value),
    setSpeedMultiplier,
    resetScene: () => window.location.reload(),
    openComparison: (mode: ComparisonMode) => {
      setComparisonMode(mode);
      setIsComparisonOpen(true);
    },
    closeComparison: () => setIsComparisonOpen(false),
  };
}
```

- [ ] **Step 5: Replace the reload shortcut with a deterministic reset**

```tsx
const initialAngles: Record<PlanetId, number> = {
  mercury: 0,
  venus: 40,
  earth: 90,
  mars: 140,
  jupiter: 180,
  saturn: 220,
  uranus: 260,
  neptune: 300,
};

const resetScene = () => {
  setAngles(initialAngles);
  setSelectedPlanetId(null);
  setIsComparisonOpen(false);
  setIsPlaying(true);
  setSpeedMultiplier(6);
};
```

- [ ] **Step 6: Run the orbit and hook tests to verify they pass**

Run: `npm run test -- src/lib/orbits.test.ts src/hooks/useSolarSystemApp.test.tsx --run`  
Expected: PASS

- [ ] **Step 7: Commit or checkpoint**

```bash
git add src/lib/orbits.ts src/hooks/useSolarSystemApp.ts src/lib/orbits.test.ts src/hooks/useSolarSystemApp.test.tsx
git commit -m "feat: add orbit math and app state hook"
```

### Task 4: Render the solar system scene responsively and support planet selection

**Files:**
- Create: `src/lib/hitTest.ts`
- Create: `src/components/solar/SolarSystemCanvas.tsx`
- Modify: `src/App.tsx`
- Test: `src/lib/hitTest.test.ts`

- [ ] **Step 1: Write the failing hit-test module test**

```ts
import { pickPlanetAtPoint } from "./hitTest";

it("returns the clicked planet when the pointer is inside its radius", () => {
  const planet = pickPlanetAtPoint(
    [
      { id: "earth", x: 100, y: 100, radius: 10 },
      { id: "mars", x: 150, y: 100, radius: 8 },
    ],
    { x: 104, y: 98 }
  );

  expect(planet).toBe("earth");
});
```

- [ ] **Step 2: Run the hit-test to verify it fails**

Run: `npm run test -- src/lib/hitTest.test.ts --run`  
Expected: FAIL because the helper does not exist yet

- [ ] **Step 3: Implement the hit-test helper**

```ts
export function pickPlanetAtPoint(
  items: Array<{ id: string; x: number; y: number; radius: number }>,
  point: { x: number; y: number }
) {
  const match = items.findLast((item) => {
    const dx = point.x - item.x;
    const dy = point.y - item.y;
    return Math.hypot(dx, dy) <= item.radius + 4;
  });

  return match?.id ?? null;
}
```

- [ ] **Step 4: Implement responsive canvas sizing with device-pixel-ratio support**

Inside the `useEffect` block, after confirming that `canvas` and `context` both exist, add a resize helper and clean it up on unmount.

```tsx
const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { width: rect.width, height: rect.height };
};

const resizeObserver = new ResizeObserver(() => {
  draw();
});

resizeObserver.observe(canvas);
return () => resizeObserver.disconnect();
```

- [ ] **Step 5: Implement the full canvas draw pass**

```tsx
export function SolarSystemCanvas({
  planets,
  angles,
  onPlanetSelect,
}: {
  planets: PlanetRecord[];
  angles: Record<PlanetId, number>;
  onPlanetSelect: (planetId: PlanetId) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const planetPositionsRef = useRef<
    Array<{ id: PlanetId; x: number; y: number; radius: number }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const { width, height } = resizeCanvas();
      const centerX = width / 2;
      const centerY = height / 2;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#071224";
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(143, 184, 255, 0.22)";
      planets.forEach((planet) => {
        context.beginPath();
        context.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
        context.stroke();
      });

      context.beginPath();
      context.fillStyle = "#ffcb53";
      context.arc(centerX, centerY, 24, 0, Math.PI * 2);
      context.fill();

      planetPositionsRef.current = planets.map((planet) => {
        const radians = (angles[planet.id] * Math.PI) / 180;
        const x = centerX + Math.cos(radians) * planet.orbitRadius;
        const y = centerY + Math.sin(radians) * planet.orbitRadius;
        context.beginPath();
        context.fillStyle = planet.color;
        context.arc(x, y, planet.visualRadius, 0, Math.PI * 2);
        context.fill();
        return { id: planet.id, x, y, radius: planet.visualRadius };
      });
    };

    draw();
  }, [angles, planets]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="태양계 관찰 무대"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const planetId = pickPlanetAtPoint(planetPositionsRef.current, {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });

        if (planetId) onPlanetSelect(planetId);
      }}
    />
  );
}
```

- [ ] **Step 6: Integrate the canvas into `App.tsx`**

```tsx
const app = useSolarSystemApp();

<section className="scene-stage">
  <SolarSystemCanvas
    planets={app.planets}
    angles={app.angles}
    onPlanetSelect={app.selectPlanet}
  />
</section>;
```

- [ ] **Step 7: Run the hit-test, shell tests, and build smoke check**

Run: `npm run test -- src/lib/hitTest.test.ts src/App.test.tsx --run`  
Expected: PASS

Run: `npm run build`  
Expected: PASS and the renderer compiles without DOM/canvas typing issues

- [ ] **Step 8: Commit or checkpoint**

```bash
git add src/lib/hitTest.ts src/lib/hitTest.test.ts src/components/solar/SolarSystemCanvas.tsx src/App.tsx
git commit -m "feat: render solar system canvas and selection"
```

### Task 5: Build the mission chip, info panel, control bar, and scale notice

**Files:**
- Create: `src/components/ui/MissionChip.tsx`
- Create: `src/components/ui/PlanetInfoPanel.tsx`
- Create: `src/components/ui/ControlBar.tsx`
- Create: `src/components/ui/ScaleNotice.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`
- Test: `src/components/ui/ControlBar.test.tsx`
- Test: `src/components/ui/PlanetInfoPanel.test.tsx`

- [ ] **Step 1: Write the failing component tests**

```tsx
import { render, screen } from "@testing-library/react";
import { PlanetInfoPanel } from "./PlanetInfoPanel";
import { planets } from "../../data/planets";

it("renders an empty state before selection", () => {
  render(<PlanetInfoPanel planet={null} />);
  expect(screen.getByText("행성을 눌러 자세히 살펴보세요.")).toBeInTheDocument();
});

it("renders details for the selected planet", () => {
  render(<PlanetInfoPanel planet={planets[3]} />);
  expect(screen.getByRole("heading", { name: "화성" })).toBeInTheDocument();
  expect(screen.getByText(/붉은빛/)).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "화성 실제 모습" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /다음 탐색/i })).toBeInTheDocument();
});
```

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ControlBar } from "./ControlBar";

it("calls handlers for play toggle and comparison", async () => {
  const user = userEvent.setup();
  const onTogglePlaying = vi.fn();
  const onOpenComparison = vi.fn();

  render(
    <ControlBar
      isPlaying
      speedMultiplier={6}
      onTogglePlaying={onTogglePlaying}
      onSpeedChange={() => {}}
      onReset={() => {}}
      onOpenComparison={onOpenComparison}
    />
  );

  await user.click(screen.getByRole("button", { name: "일시정지" }));
  await user.click(screen.getByRole("button", { name: "비교 보기" }));

  expect(onTogglePlaying).toHaveBeenCalledTimes(1);
  expect(onOpenComparison).toHaveBeenCalledWith("size");
});
```

- [ ] **Step 2: Run the UI component tests to verify they fail**

Run: `npm run test -- src/components/ui/ControlBar.test.tsx src/components/ui/PlanetInfoPanel.test.tsx --run`  
Expected: FAIL because the UI components do not exist yet

- [ ] **Step 3: Implement the mission chip and scale notice**

```tsx
export function MissionChip({ mission }: { mission: string }) {
  return (
    <section className="mission-chip" aria-label="오늘의 관찰 미션">
      <span className="mission-chip__label">오늘의 미션</span>
      <p>{mission}</p>
    </section>
  );
}

export function ScaleNotice({ message }: { message: string }) {
  return <p className="scale-notice">{message}</p>;
}
```

- [ ] **Step 4: Implement the planet info panel**

```tsx
export function PlanetInfoPanel({ planet }: { planet: PlanetRecord | null }) {
  if (!planet) {
    return (
      <aside className="info-panel" aria-label="행성 정보 패널">
        <p>행성을 눌러 자세히 살펴보세요.</p>
      </aside>
    );
  }

  return (
    <aside className="info-panel" aria-label="행성 정보 패널">
      <img src={planet.imageSrc} alt={`${planet.nameKo} 실제 모습`} />
      <h2>{planet.nameKo}</h2>
      <p>{planet.summary}</p>
      <dl>
        <div>
          <dt>크기</dt>
          <dd>지구의 {planet.diameterEarths}배</dd>
        </div>
        <div>
          <dt>거리</dt>
          <dd>태양에서 {planet.distanceFromSunAU} AU</dd>
        </div>
        <div>
          <dt>공전</dt>
          <dd>{planet.orbitalPeriodDays}일</dd>
        </div>
      </dl>
      <button type="button">다음 탐색: {planet.nextExplorationPrompt}</button>
    </aside>
  );
}
```

- [ ] **Step 5: Implement the control bar**

```tsx
export function ControlBar(props: {
  isPlaying: boolean;
  speedMultiplier: number;
  onTogglePlaying: () => void;
  onSpeedChange: (next: number) => void;
  onReset: () => void;
  onOpenComparison: (mode: "size") => void;
}) {
  return (
    <footer className="control-bar">
      <button onClick={props.onTogglePlaying}>
        {props.isPlaying ? "일시정지" : "재생"}
      </button>
      <label className="control-bar__slider">
        <span>시간 빨리 감기</span>
        <input
          aria-label="시간 빨리 감기"
          type="range"
          min="1"
          max="20"
          value={props.speedMultiplier}
          onChange={(event) => props.onSpeedChange(Number(event.target.value))}
        />
      </label>
      <button onClick={props.onReset}>초기화</button>
      <button onClick={() => props.onOpenComparison("size")}>비교 보기</button>
    </footer>
  );
}
```

- [ ] **Step 6: Compose the UI in `App.tsx` and add styling hooks**

```tsx
const selectedPlanet = app.selectedPlanetId
  ? app.planets.find((planet) => planet.id === app.selectedPlanetId) ?? null
  : null;

<MissionChip mission={app.missions[0]} />
<PlanetInfoPanel planet={selectedPlanet} />
<ScaleNotice message={scaleNotice} />
<ControlBar
  isPlaying={app.isPlaying}
  speedMultiplier={app.speedMultiplier}
  onTogglePlaying={app.togglePlaying}
  onSpeedChange={app.setSpeedMultiplier}
  onReset={app.resetScene}
  onOpenComparison={app.openComparison}
/>
```

- [ ] **Step 7: Run the UI component tests to verify they pass**

Run: `npm run test -- src/components/ui/ControlBar.test.tsx src/components/ui/PlanetInfoPanel.test.tsx src/App.test.tsx --run`  
Expected: PASS

- [ ] **Step 8: Commit or checkpoint**

```bash
git add src/components/ui/MissionChip.tsx src/components/ui/PlanetInfoPanel.tsx src/components/ui/ControlBar.tsx src/components/ui/ScaleNotice.tsx src/components/ui/ControlBar.test.tsx src/components/ui/PlanetInfoPanel.test.tsx src/App.tsx src/styles/app.css
git commit -m "feat: add classroom ui surfaces"
```

### Task 6: Add the comparison overlay and the mobile bottom-sheet behavior

**Files:**
- Create: `src/components/ui/ComparisonSheet.tsx`
- Create: `src/components/ui/MobileInfoSheet.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`
- Test: `src/components/ui/ComparisonSheet.test.tsx`

- [ ] **Step 1: Write the failing comparison sheet test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComparisonSheet } from "./ComparisonSheet";
import { planets } from "../../data/planets";

it("switches from size view to distance view", async () => {
  const user = userEvent.setup();

  render(
    <ComparisonSheet
      isOpen
      mode="size"
      planets={planets}
      onClose={() => {}}
      onModeChange={() => {}}
    />
  );

  expect(screen.getByText("크기 비교")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "거리 비교" }));
});
```

- [ ] **Step 2: Run the comparison test to verify it fails**

Run: `npm run test -- src/components/ui/ComparisonSheet.test.tsx --run`  
Expected: FAIL because the comparison component does not exist yet

- [ ] **Step 3: Implement the comparison overlay**

```tsx
export function ComparisonSheet(props: {
  isOpen: boolean;
  mode: ComparisonMode;
  planets: PlanetRecord[];
  onClose: () => void;
  onModeChange: (mode: ComparisonMode) => void;
}) {
  if (!props.isOpen) return null;

  const rows = buildComparisonRows(props.planets, props.mode);

  return (
    <section className="comparison-sheet" aria-label="행성 비교 보기">
      <header>
        <h2>{props.mode === "size" ? "크기 비교" : "거리 비교"}</h2>
        <button onClick={props.onClose}>닫기</button>
      </header>
      <div className="comparison-sheet__tabs">
        <button onClick={() => props.onModeChange("size")}>크기 비교</button>
        <button onClick={() => props.onModeChange("distance")}>거리 비교</button>
      </div>
      <ol>
        {rows.map((row) => (
          <li key={row.id}>
            <span>{row.label}</span>
            <span>{row.value}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 4: Implement the mobile detail wrapper**

```tsx
export function MobileInfoSheet({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className="mobile-info-sheet"
      data-open={isOpen}
      aria-label="행성 정보 바텀 시트"
    >
      {children}
    </section>
  );
}
```

- [ ] **Step 5: Integrate responsive layout rules**

```css
.desktop-info-panel {
  display: block;
}

.mobile-info-sheet {
  display: none;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(calc(100% - 88px));
}

.mobile-info-sheet[data-open="true"] {
  transform: translateY(0);
}

@media (max-width: 900px) {
  .app-main {
    grid-template-columns: 1fr;
  }

  .desktop-info-panel {
    display: none;
  }

  .mobile-info-sheet {
    display: block;
  }

  .control-bar {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Wire the overlay and mobile sheet into `App.tsx`**

```tsx
<ComparisonSheet
  isOpen={app.isComparisonOpen}
  mode={app.comparisonMode}
  planets={app.planets}
  onClose={app.closeComparison}
  onModeChange={(mode) => app.openComparison(mode)}
/>

<aside className="desktop-info-panel">
  <PlanetInfoPanel planet={selectedPlanet} />
</aside>

<MobileInfoSheet isOpen={true}>
  <PlanetInfoPanel planet={selectedPlanet} />
</MobileInfoSheet>
```

- [ ] **Step 7: Run a mobile-specific smoke check**

Run: `npm run dev`  
Expected: local Vite URL appears

Verify manually in a narrow viewport:
- the desktop info panel is hidden
- the mobile bottom sheet is visible before any planet is selected
- the empty guidance copy is visible before selection
- selecting a planet updates the bottom sheet content
- the comparison overlay opens and closes cleanly on mobile

- [ ] **Step 8: Run the comparison test and the full suite**

Run: `npm run test -- --run`  
Expected: PASS

- [ ] **Step 9: Commit or checkpoint**

```bash
git add src/components/ui/ComparisonSheet.tsx src/components/ui/MobileInfoSheet.tsx src/components/ui/ComparisonSheet.test.tsx src/App.tsx src/styles/app.css
git commit -m "feat: add comparison overlay and mobile sheet"
```

### Task 7: Polish the visual system, accessibility, and manual verification

**Files:**
- Modify: `src/styles/app.css`
- Modify: `src/App.tsx`
- Modify: `src/components/solar/SolarSystemCanvas.tsx`
- Modify: `src/components/ui/ControlBar.tsx`
- Modify: `src/components/ui/ComparisonSheet.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Add the final shell accessibility assertions**

```tsx
it("keeps the comparison overlay out of the DOM until opened", () => {
  render(<App />);
  expect(screen.queryByLabelText("행성 비교 보기")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the app integration test to verify it fails**

Run: `npm run test -- src/App.test.tsx --run`  
Expected: FAIL until the final accessibility wiring is complete

- [ ] **Step 3: Polish visuals and motion restraint**

```css
:root {
  --bg: #071224;
  --panel: rgba(6, 16, 32, 0.86);
  --text: #eff6ff;
  --accent: #8fb8ff;
  --sun: #ffcb53;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 4: Add keyboard- and screen-reader-safe labels**

```tsx
<button aria-label={isPlaying ? "일시정지" : "재생"} />
<button aria-label="비교 보기" />
<button aria-label="닫기" />
<canvas aria-label="태양계 관찰 무대" />
```

- [ ] **Step 5: Run the full suite and build**

Run: `npm run test -- --run`  
Expected: PASS

Run: `npm run build`  
Expected: PASS

- [ ] **Step 6: Manual smoke check in the browser**

Run: `npm run dev`  
Expected: local Vite URL appears

Verify manually:
- the top-left mission chip is visible without covering the orbit center
- the right-side info panel updates when a planet is clicked
- the bottom slider changes the speed noticeably
- the comparison overlay opens and closes cleanly
- on a narrow viewport, the planet details move below the scene as a bottom sheet

- [ ] **Step 7: Commit or checkpoint**

```bash
git add src/App.tsx src/App.test.tsx src/components/solar/SolarSystemCanvas.tsx src/components/ui/ControlBar.tsx src/components/ui/ComparisonSheet.tsx src/styles/app.css
git commit -m "feat: polish solar system classroom experience"
```

## Final Review Checklist

- Orbit speed differences are driven by the real orbital period field, not hard-coded per-component animation values.
- The canvas is only responsible for drawing and hit mapping; educational copy stays in data/UI modules.
- The scale notice is always present somewhere visible.
- The info panel always includes a planet image and a next-step exploration prompt.
- The default scene stays readable on desktop and mobile without comparison mode open.
- No feature exceeds the approved MVP from the spec.
