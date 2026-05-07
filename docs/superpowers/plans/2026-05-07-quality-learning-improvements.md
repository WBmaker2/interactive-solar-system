# Interactive Solar System Quality and Learning Improvements

Date: 2026-05-07

## Goal

Implement the full recommended improvement sequence from the May 2026 project analysis:

1. Strengthen pre-deploy quality gates and fix the test typecheck script.
2. Improve planet selection accessibility and show mission hints.
3. Stabilize the canvas render loop.
4. Split planet information into basic and detailed learning views.
5. Reduce duplicated planet information UI and keep style growth manageable.
6. Clean up unused planet image assets.

## Constraints

- Keep the existing visual language and GitHub Pages deployment target.
- Do not remove NASA image attribution.
- Preserve the main orbit stage height; learning additions must not crowd the canvas.
- Keep text concise on screen, especially in mission and mobile surfaces.
- Do not touch unrelated `.DS_Store` state except by ignoring it.

## Task 1: Quality Gates

Files:

- `.github/workflows/deploy.yml`
- `package.json`
- `tsconfig.test.json`
- `playwright.config.ts`

Implementation:

- Make `npm run typecheck:test` pass by including Vite client types.
- Add a `check` script that runs test typecheck, Vitest, build, and e2e.
- Update GitHub Pages workflow so deployment runs the same quality gate before uploading Pages artifacts.
- Install Playwright browsers in CI before e2e runs.
- Serve the production `dist/` bundle under `/interactive-solar-system/` during local e2e so build/base-path behavior matches GitHub Pages.
- After deployment, run e2e once more against the actual GitHub Pages URL.

Acceptance:

- `npm run typecheck:test` passes.
- `npm run check` passes locally.
- CI blocks deploy if tests fail.
- CI verifies the deployed Pages URL after the deploy job completes.

## Task 2: Mission and Selection Accessibility

Files:

- `src/data/missions.ts`
- `src/components/ui/MissionChip.tsx`
- `src/components/ui/MissionChip.test.tsx`
- `src/components/solar/SolarSystemCanvas.tsx`
- `src/components/solar/SolarSystemCanvas.test.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/styles/app.css`

Implementation:

- Change ambiguous mission wording from "빠르게 도는" to "빠르게 공전하는".
- Surface the mission hint while the mission is active.
- Add keyboard/screen-reader-accessible planet selection controls without reducing the orbit canvas height.
- Keep the canvas pointer interaction unchanged.

Acceptance:

- Active mission shows its hint.
- Keyboard users can select every planet.
- Existing canvas click behavior still works.

## Task 3: Canvas Loop Stability

Files:

- `src/components/solar/SolarSystemCanvas.tsx`
- `src/components/solar/SolarSystemCanvas.test.tsx`

Implementation:

- Keep the animation loop stable across speed and selected-planet changes.
- Feed latest `speedMultiplier` and `selectedPlanetId` via refs.
- Avoid canceling/restarting the loop solely because selection or speed changed.

Acceptance:

- Tests confirm selected planet and speed changes affect future frames.
- Tests confirm the loop is not restarted by selection or speed updates.

## Task 4: Basic and Detailed Planet Information

Files:

- `src/components/ui/PlanetInfoPanel.tsx`
- `src/components/ui/MobileInfoSheet.tsx`
- `src/components/ui/PlanetMetrics.tsx`
- `src/components/ui/PlanetFacts.tsx`
- related tests
- `src/styles/app.css`

Implementation:

- Extract shared planet facts and metrics rendering.
- Show basic interpretive facts before numeric details.
- Put numeric values behind a `details/summary` disclosure so students can choose deeper data.
- Keep mobile concise and avoid pushing the main orbit stage out of view.

Acceptance:

- Desktop and mobile both show shared facts/metrics through common components.
- Numeric detail is available but no longer dominates the first read.
- Existing NASA attribution remains visible.

## Task 5: Style and Asset Cleanup

Files:

- `src/styles/app.css`
- `public/planets/*.webp`
- `public/planets/nasa/uranus.jpg`
- `src/data/planets.test.ts`

Implementation:

- Add reduced-motion CSS so decorative animations calm down for users who request it.
- Add `.DS_Store` to `.gitignore`.
- Remove unused legacy planet webp files and unused dark Uranus jpg.
- Keep all currently referenced NASA assets.

Acceptance:

- No code references removed assets.
- `.DS_Store` no longer appears as an untracked file.
- Reduced-motion users get calmer motion in educational overlays.

## Final Verification

Run:

- `npm run typecheck:test`
- `npm run test -- --run`
- `npm run build`
- `npm run test:e2e`
- `npm run check`

Expected result: all pass.

## Commit Units

1. Quality gate and Pages-path e2e infrastructure.
2. Mission hint and accessible planet selection.
3. Stable canvas animation loop.
4. Shared planet facts/metrics components with concise basic-first UI.
5. Reduced-motion CSS and unused asset cleanup.
