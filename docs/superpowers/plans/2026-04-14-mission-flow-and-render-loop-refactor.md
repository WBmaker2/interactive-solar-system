# Mission Flow and Render Loop Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 현재 미션을 한 번에 하나씩 안내하는 학습 흐름으로 바꾸고, 행성 공전 애니메이션이 React 전체 리렌더링에 의존하지 않도록 분리한다.

**Architecture:** 미션은 별도 도메인 규칙으로 정리해 훅이 현재 미션과 완료 여부를 관리하도록 바꾼다. 캔버스는 자체 애니메이션 루프와 mutable angle store를 사용하고, React는 선택 행성/재생 상태/배속/미션 상태 같은 UI 상태만 관리한다. 기존 화면 구조와 디자인은 유지하고, 학습 흐름과 렌더링 경계만 집중적으로 개선한다.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Playwright

---

## Scope Guardrails

- 이번 계획은 `미션 흐름`과 `렌더링 구조`만 다룬다.
- 비교 보기의 시각 리디자인, 전체 카피라이팅 재작성, 자산 교체는 범위 밖이다.
- 미션 판정은 현재 앱이 이미 추적 가능한 행동만 사용한다.
- 캔버스 렌더링은 유지하되, 선택 패널/모달 구조는 최대한 보존한다.

## File Map

### Create

- `src/lib/missions.ts`
  - 미션 판정 규칙, 현재 미션 유도 문구, 완료 조건 해석을 담당한다.
- `src/lib/missions.test.ts`
  - 미션 판정 규칙과 미션 진행 전이를 고정한다.
- `src/lib/scene.ts`
  - 오비트 스케일 계산, 최대 궤도 반지름 계산, 장면 기하 계산을 담당한다.
- `src/lib/scene.test.ts`
  - 행성 데이터 순서와 무관하게 장면 계산이 유지되는지 검증한다.

### Modify

- `src/data/missions.ts`
  - 문자열 배열을 구조화된 미션 정의로 바꾼다.
- `src/types/solar-system.ts`
  - 미션 타입, 미션 상태 타입, 필요한 파생 타입을 추가한다.
- `src/hooks/useSolarSystemApp.ts`
  - 현재 미션/완료 상태를 관리하고, 캔버스 전용 렌더링 상태와 UI 상태를 분리한다.
- `src/App.tsx`
  - 여러 미션 칩 대신 현재 미션 1개만 보여 주도록 바꾼다.
- `src/components/ui/MissionChip.tsx`
  - 현재 미션, 완료 상태, 힌트 상태를 표현할 수 있게 확장한다.
- `src/components/ui/PlanetInfoPanel.tsx`
  - 고정 순서 유도 문구를 현재 미션 힌트 기반으로 바꾸고, 수치를 해석형 문장으로 보강한다.
- `src/components/ui/MobileInfoSheet.tsx`
  - 모바일에서 요약 우선순위를 높이고, 미션 힌트형 문구를 보여 준다.
- `src/components/ui/ControlBar.tsx`
  - 비교 보기 기본 진입값을 검토하고, 현재 미션과 충돌하지 않는 조작 구조를 유지한다.
- `src/components/solar/SolarSystemCanvas.tsx`
  - 자체 애니메이션 루프와 mutable angle state를 사용하도록 바꾸고, 스케일 계산의 순서 의존을 제거한다.
- `src/lib/orbits.ts`
  - 캔버스 루프에서 재사용하기 쉽게 순수 계산 함수 경계를 정리한다.
- `src/App.test.tsx`
  - 현재 미션 1개 노출과 핵심 화면 흐름을 검증한다.
- `src/hooks/useSolarSystemApp.test.tsx`
  - 미션 진행, 초기화, 재생/일시정지, 배속 변경의 회귀를 막는다.
- `src/components/ui/PlanetInfoPanel.test.tsx`
  - 해석형 문구와 미션 힌트를 검증한다.
- `src/components/ui/MobileInfoSheet.test.tsx`
  - 모바일 요약 우선순위와 미션 힌트를 검증한다.
- `tests/e2e/solar-system.spec.ts`
  - 미션이 하나만 보이고, 행성 선택 후 패널/시트가 맞게 열리는 흐름을 고정한다.

---

### Task 1: 미션 도메인 모델 만들기

**Files:**
- Create: `src/lib/missions.ts`
- Create: `src/lib/missions.test.ts`
- Modify: `src/data/missions.ts`
- Modify: `src/types/solar-system.ts`

- [ ] **Step 1: 구조화된 미션 타입 정의 작성**

```ts
export type MissionGoalType =
  | "select-fastest-planet"
  | "select-farthest-planet"
  | "select-largest-planet"
  | "select-earth-like-planet";

export interface MissionDefinition {
  id: string;
  prompt: string;
  hint: string;
  goalType: MissionGoalType;
}
```

- [ ] **Step 2: 미션 판정 규칙에 대한 실패 테스트 작성**

```ts
it("marks the fastest-planet mission complete when Mercury is selected", () => {
  expect(evaluateMission(mission, { selectedPlanetId: "mercury" })).toEqual({
    status: "completed",
  });
});
```

- [ ] **Step 3: `src/data/missions.ts`를 객체 배열로 변경**

```ts
export const missions: MissionDefinition[] = [
  {
    id: "fastest-planet",
    prompt: "가장 빠르게 도는 행성을 찾아보세요.",
    hint: "시간을 빠르게 바꾸고 안쪽 행성을 먼저 살펴보세요.",
    goalType: "select-fastest-planet",
  },
];
```

- [ ] **Step 4: 최소 미션 판정 함수 구현**

```ts
export function evaluateMission(
  mission: MissionDefinition,
  context: MissionEvaluationContext
) {
  // selectedPlanetId를 기준으로 완료/진행중 판정
}
```

- [ ] **Step 5: 미션 단위 테스트 실행**

Run: `npm run test -- src/lib/missions.test.ts --run`  
Expected: mission evaluator 관련 테스트가 모두 PASS

- [ ] **Step 6: Commit**

```bash
git add src/data/missions.ts src/types/solar-system.ts src/lib/missions.ts src/lib/missions.test.ts
git commit -m "feat: add structured mission rules"
```

---

### Task 2: 훅에 미션 진행 상태 통합하기

**Files:**
- Modify: `src/hooks/useSolarSystemApp.ts`
- Test: `src/hooks/useSolarSystemApp.test.tsx`
- Reference: `src/lib/missions.ts`

- [ ] **Step 1: 훅 테스트에 미션 상태 기대값 추가**

```ts
it("starts with the first mission active", () => {
  expect(result.current.currentMission.id).toBe("fastest-planet");
});

it("moves to the next mission after completion", () => {
  act(() => result.current.selectPlanet("mercury"));
  expect(result.current.currentMission.id).toBe("farthest-planet");
});
```

- [ ] **Step 2: 훅 상태에 현재 미션과 완료 상태 추가**

```ts
const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
```

- [ ] **Step 3: `selectPlanet()`과 미션 판정을 연결**

```ts
const selectPlanet = (planetId: PlanetId | null) => {
  setSelectedPlanetId(planetId);
  // 현재 미션 판정 -> 완료 시 다음 미션으로 전이
};
```

- [ ] **Step 4: 초기화 시 미션 상태도 리셋**

```ts
setCurrentMissionIndex(0);
setCompletedMissionIds([]);
```

- [ ] **Step 5: 훅 테스트 실행**

Run: `npm run test -- src/hooks/useSolarSystemApp.test.tsx --run`  
Expected: 미션 시작, 완료, 초기화 관련 테스트 PASS

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useSolarSystemApp.ts src/hooks/useSolarSystemApp.test.tsx
git commit -m "feat: track mission progress in app state"
```

---

### Task 3: 현재 미션 1개만 보이는 UI로 정리하기

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/ui/MissionChip.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: 상단 UI 기대값 테스트 추가**

```ts
it("shows only the current mission prompt", () => {
  expect(screen.getByText("가장 빠르게 도는 행성을 찾아보세요.")).toBeInTheDocument();
  expect(screen.queryByText("태양에서 가장 먼 행성을 찾아보세요.")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: `App.tsx`에서 미션 목록 반복 렌더링 제거**

```tsx
<MissionChip
  label={currentMission.prompt}
  active
  hint={currentMission.hint}
  completed={isCurrentMissionCompleted}
/>
```

- [ ] **Step 3: `MissionChip.tsx`를 현재 미션용 컴포넌트로 확장**

```tsx
interface MissionChipProps {
  label: string;
  hint?: string;
  active?: boolean;
  completed?: boolean;
}
```

- [ ] **Step 4: 앱 테스트 실행**

Run: `npm run test -- src/App.test.tsx --run`  
Expected: 미션 1개 노출과 기본 화면 렌더링 테스트 PASS

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/ui/MissionChip.tsx src/App.test.tsx
git commit -m "feat: show one active mission at a time"
```

---

### Task 4: 정보 패널과 모바일 시트 문구를 학습형으로 보강하기

**Files:**
- Modify: `src/components/ui/PlanetInfoPanel.tsx`
- Modify: `src/components/ui/MobileInfoSheet.tsx`
- Modify: `src/data/planets.ts`
- Test: `src/components/ui/PlanetInfoPanel.test.tsx`
- Test: `src/components/ui/MobileInfoSheet.test.tsx`

- [ ] **Step 1: 해석형 문구에 대한 실패 테스트 작성**

```ts
expect(screen.getByText(/지구보다 작아요/)).toBeInTheDocument();
expect(screen.getByText(/현재 미션 힌트/)).toBeInTheDocument();
```

- [ ] **Step 2: 숫자 정보를 해석형 문장으로 보강**

```tsx
<dd>지구보다 조금 작아요 (지구의 0.95배)</dd>
<dd>태양에서 꽤 멀어요 (19.2 AU)</dd>
```

- [ ] **Step 3: 고정 순서형 `nextExplorationPrompt` 의존 줄이기**

```tsx
<p>{currentMissionHint}</p>
```

- [ ] **Step 4: 모바일은 요약과 힌트를 우선 배치**

```tsx
<p className="mobile-info-sheet__summary">...</p>
<p className="mobile-info-sheet__hint">...</p>
```

- [ ] **Step 5: 패널/모바일 테스트 실행**

Run: `npm run test -- src/components/ui/PlanetInfoPanel.test.tsx src/components/ui/MobileInfoSheet.test.tsx --run`  
Expected: 해석형 문구와 힌트 관련 테스트 PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/PlanetInfoPanel.tsx src/components/ui/MobileInfoSheet.tsx src/data/planets.ts src/components/ui/PlanetInfoPanel.test.tsx src/components/ui/MobileInfoSheet.test.tsx
git commit -m "feat: align planet details with mission-based learning flow"
```

---

### Task 5: 캔버스 장면 계산을 React 밖의 순수 로직으로 분리하기

**Files:**
- Create: `src/lib/scene.ts`
- Create: `src/lib/scene.test.ts`
- Modify: `src/components/solar/SolarSystemCanvas.tsx`

- [ ] **Step 1: 장면 계산 실패 테스트 작성**

```ts
it("uses the largest orbit radius instead of relying on the last array item", () => {
  expect(getMaxOrbitRadius(shuffledPlanets)).toBe(332);
});
```

- [ ] **Step 2: 장면 계산 함수 분리**

```ts
export function getMaxOrbitRadius(planets: PlanetRecord[]) {
  return planets.reduce((max, planet) => Math.max(max, planet.orbitRadius), 0);
}
```

- [ ] **Step 3: `SolarSystemCanvas.tsx`에서 `planets[planets.length - 1]` 제거**

```ts
const maxOrbitRadius = getMaxOrbitRadius(planets);
```

- [ ] **Step 4: 장면 계산 테스트 실행**

Run: `npm run test -- src/lib/scene.test.ts --run`  
Expected: 순서 의존 제거 관련 테스트 PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/scene.ts src/lib/scene.test.ts src/components/solar/SolarSystemCanvas.tsx
git commit -m "refactor: isolate scene scaling logic"
```

---

### Task 6: 캔버스가 자체 애니메이션 루프를 갖도록 바꾸기

**Files:**
- Modify: `src/hooks/useSolarSystemApp.ts`
- Modify: `src/components/solar/SolarSystemCanvas.tsx`
- Modify: `src/lib/orbits.ts`
- Test: `src/hooks/useSolarSystemApp.test.tsx`
- Test: `src/lib/orbits.test.ts`

- [ ] **Step 1: 현재 훅 테스트에 불필요한 angle state 노출이 없는지 기대값 추가**

```ts
expect("angles" in result.current).toBe(false);
```

- [ ] **Step 2: 캔버스 전용 시뮬레이션 상태 구조 설계**

```ts
interface SimulationControls {
  isPlaying: boolean;
  speedMultiplier: number;
  resetToken: number;
}
```

- [ ] **Step 3: 훅에서 angle state 제거, UI 상태만 유지**

```ts
const [resetToken, setResetToken] = useState(0);
```

- [ ] **Step 4: 캔버스 내부에서 mutable angle store + RAF 루프 구현**

```ts
const angleRef = useRef<Record<PlanetId, number>>(createInitialAngles());
// requestAnimationFrame 안에서 angleRef.current 갱신 후 draw
```

- [ ] **Step 5: 재생/일시정지/배속/초기화가 캔버스 루프와 연동되도록 연결**

```ts
<SolarSystemCanvas
  isPlaying={isPlaying}
  speedMultiplier={speedMultiplier}
  resetToken={resetToken}
/>
```

- [ ] **Step 6: 훅/오비트 테스트 실행**

Run: `npm run test -- src/hooks/useSolarSystemApp.test.tsx src/lib/orbits.test.ts --run`  
Expected: 재생, 초기화, 배속 관련 테스트 PASS

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useSolarSystemApp.ts src/components/solar/SolarSystemCanvas.tsx src/lib/orbits.ts src/hooks/useSolarSystemApp.test.tsx src/lib/orbits.test.ts
git commit -m "refactor: move orbit animation loop into canvas"
```

---

### Task 7: 핵심 상호작용 회귀를 고정하기

**Files:**
- Modify: `tests/e2e/solar-system.spec.ts`
- Modify: `src/components/ui/ComparisonSheet.test.tsx`

- [ ] **Step 1: e2e에 현재 미션 1개 노출 확인 추가**

```ts
await expect(page.getByText("가장 빠르게 도는 행성을 찾아보세요.")).toBeVisible();
await expect(page.getByText("태양에서 가장 먼 행성을 찾아보세요.")).toHaveCount(0);
```

- [ ] **Step 2: 행성 선택 후 미션 진행 여부 확인 추가**

```ts
await clickPlanet(page, "mercury");
await expect(page.getByText("태양에서 가장 먼 행성을 찾아보세요.")).toBeVisible();
```

- [ ] **Step 3: 비교 모달 접근성 테스트 보강**

```ts
expect(document.body.style.overflow).toBe("hidden");
```

- [ ] **Step 4: e2e/비교 모달 테스트 실행**

Run: `npm run test -- src/components/ui/ComparisonSheet.test.tsx --run && npm run test:e2e`  
Expected: 비교 모달 테스트 PASS, Playwright 2 passed

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/solar-system.spec.ts src/components/ui/ComparisonSheet.test.tsx
git commit -m "test: lock mission flow and modal regressions"
```

---

### Task 8: 전체 회귀 검증과 마무리

**Files:**
- Verify only

- [ ] **Step 1: 단위/컴포넌트 테스트 전체 실행**

Run: `npm run test -- --run`  
Expected: 모든 Vitest 테스트 PASS

- [ ] **Step 2: 프로덕션 빌드 실행**

Run: `npm run build`  
Expected: Vite build 성공, 에러 없음

- [ ] **Step 3: 브라우저 흐름 전체 검증**

Run: `npm run test:e2e`  
Expected: desktop/mobile 시나리오 모두 PASS

- [ ] **Step 4: 최종 검토**

- 미션이 한 번에 하나만 보이는지 확인
- 선택 패널/모바일 시트 문구가 해석형으로 바뀌었는지 확인
- 재생 중 앱 전체가 매 프레임 리렌더링되지 않는지 확인
- 장면 스케일 계산이 데이터 배열 순서와 무관한지 확인

- [ ] **Step 5: Final Commit (optional squash decision deferred to human)**

```bash
git status
git log --oneline --decorate -5
```

Expected: 작업 단위 커밋이 계획과 일치하고, 추가 수정 없이 handoff 가능

---

## Acceptance Checks

- [ ] 상단에는 현재 미션 1개만 보인다.
- [ ] 행성 선택에 따라 미션이 진행되고 다음 미션으로 넘어간다.
- [ ] 정보 패널과 모바일 시트는 숫자만 나열하지 않고 해석형 문장을 함께 보여 준다.
- [ ] 애니메이션 중에도 React 전체 트리가 매 프레임 다시 렌더링되지 않는다.
- [ ] 장면 스케일 계산은 행성 배열 순서에 의존하지 않는다.
- [ ] Vitest, build, Playwright가 모두 통과한다.

## Risks and Notes

- 미션 판정 규칙을 너무 많이 넣으면 훅이 다시 비대해질 수 있으니, 이번 범위에서는 “선택 기반” 규칙만 유지한다.
- 캔버스 루프 분리 시 선택 하이라이트와 히트 테스트 기준 좌표가 어긋나지 않도록 장면 계산 함수를 단일 소스로 유지한다.
- 모바일 바텀 시트는 정보량을 줄이되, 출처 표기와 핵심 수치까지 제거하지 않는다.
- 리렌더링 최적화는 DevTools 수치 측정까지 포함하면 좋지만, 이번 계획의 필수 완료 조건은 기능 회귀 없음이다.
