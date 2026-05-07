# Remotion Earth Rotation Loop Implementation Plan

Date: 2026-05-07

## Recommendation

Use Remotion as an offline motion-production tool, not as a runtime player inside the main app.

The app should display a short rendered video loop with a normal `<video>` element. This keeps the GitHub Pages app lightweight while still giving the "자전" card a smoother, more natural Earth rotation.

## Goal

Replace the current CSS-only rotation illustration in the "자전과 공전" dialog with a natural Earth self-rotation loop.

The new visual should help elementary students immediately see that:

- 자전은 행성이 제자리에서 스스로 도는 움직임이다.
- 지구 표면 무늬가 왼쪽에서 오른쪽 또는 오른쪽에서 왼쪽으로 흐르며 회전감을 만든다.
- 축은 고정되어 있고, 행성만 회전한다.

## Non-Goals

- Do not embed `@remotion/player` in the production app.
- Do not add interactive video controls to the concept card.
- Do not reduce the main orbit scene height.
- Do not add long explanatory text to the modal.
- Do not replace the existing orbit animation unless a separate task asks for it.

## Design Decision

### Chosen Approach

Render a seamless 4-6 second Earth rotation loop with Remotion, then commit the generated asset to `public/learning/`.

Runtime app integration:

```tsx
<video autoPlay loop muted playsInline poster="/interactive-solar-system/learning/earth-rotation-poster.png">
  <source src="/interactive-solar-system/learning/earth-rotation.mp4" type="video/mp4" />
</video>
```

Vite/GitHub Pages path handling should use the existing asset path helper or `import.meta.env.BASE_URL` so the video works both locally and on `/interactive-solar-system/`.

### Why Not Runtime Remotion Player

- The concept card needs a decorative educational loop, not a frame-scrubbable editor.
- A pre-rendered video avoids increasing runtime bundle size.
- `<video>` is easier to test in Playwright and safer for GitHub Pages.
- The source Remotion composition remains editable for future design improvements.

## Visual Spec

Canvas:

- Size: 960 x 540 source composition.
- Duration: 5 seconds.
- FPS: 30.
- Loop: seamless start/end frame alignment.
- Background: transparent-looking dark space card background, matching current modal visual tone.

Earth:

- Centered sphere, about 40-45% of visual height.
- Slight axial tilt, matching the current educational axis idea.
- NASA/public-domain Earth texture or simplified generated texture with clear ocean/land/cloud contrast.
- Surface texture scrolls around the sphere with masked edges.
- Add soft terminator shadow on one side to show volume.
- Add subtle cloud layer moving at a slightly different speed.
- Keep the axis line steady so students can compare "axis fixed, planet rotates".

Accessibility and Motion:

- The visual remains `aria-hidden="true"` because nearby text explains the concept.
- Respect `prefers-reduced-motion`: show the poster image instead of autoplaying, or pause the video via CSS/React handling.
- Include a meaningful poster image so the concept still works when autoplay is blocked.

## Asset and Source Plan

Generated runtime assets:

- `public/learning/earth-rotation.mp4`
- `public/learning/earth-rotation-poster.png`

Optional source/reference assets:

- `remotion/earth-rotation/assets/earth-texture.png`
- `remotion/earth-rotation/assets/cloud-layer.png`

Remotion source:

- `remotion/earth-rotation/Root.tsx`
- `remotion/earth-rotation/EarthRotationLoop.tsx`
- `remotion/earth-rotation/render-earth-rotation.mjs`
- `remotion/earth-rotation/README.md`

The rendered video should be committed so users and GitHub Pages do not need Remotion at runtime.

## Task 1: Add Remotion Production Source

Files:

- `package.json`
- `package-lock.json`
- `remotion/earth-rotation/*`

Implementation:

- Add Remotion packages as exact dev dependencies only.
- Add scripts:
  - `remotion:earth:studio`
  - `remotion:earth:still`
  - `remotion:earth:render`
- Create a composition called `EarthRotationLoop`.
- Keep Remotion code isolated from `src/` so the app bundle does not import it.

Acceptance:

- Remotion source can be previewed locally.
- One-frame still render works for quick visual QA.
- No Remotion runtime code is imported by the Vite app.

## Task 2: Build the Earth Rotation Composition

Files:

- `remotion/earth-rotation/EarthRotationLoop.tsx`
- `remotion/earth-rotation/assets/*`

Implementation:

- Use frame-based animation for seamless texture movement.
- Mask the texture into a circular sphere.
- Add lighting/shadow layers to make the sphere feel round.
- Add a steady tilted axis line.
- Add a small label-free visual only; text remains in the existing modal content.

Acceptance:

- The first and final frame connect without a visible jump.
- The surface visibly rotates while the axis remains fixed.
- The result is visually clearer than the current CSS-only band motion.

## Task 3: Render and Commit Runtime Video Assets

Files:

- `public/learning/earth-rotation.mp4`
- `public/learning/earth-rotation-poster.png`

Implementation:

- Render the loop at a classroom-friendly size and compression.
- Keep the video short enough for fast GitHub Pages loading.
- Export a poster frame from the same composition.

Acceptance:

- `earth-rotation.mp4` loads in Chrome and Safari-compatible browsers.
- File size remains reasonable for classroom networks.
- Poster image appears before playback or when reduced motion is enabled.

## Task 4: Replace the Current CSS Rotation Visual

Files:

- `src/components/ui/MotionGuideDialog.tsx`
- `src/components/ui/MotionGuideDialog.test.tsx`
- `src/styles/app.css`

Implementation:

- Replace the current nested `span` planet-surface animation in the 자전 card with a video wrapper.
- Keep the card layout, title, and concise explanation unchanged.
- Keep the axis visible either as part of the rendered video or as a DOM overlay.
- Remove now-unused CSS keyframes/selectors only after tests confirm they are unused.

Acceptance:

- The 자전 card shows the rendered Earth rotation loop.
- The 공전 card remains unchanged and still shows the orbit animation.
- Existing dialog open/close/focus behavior remains unchanged.

## Task 5: Reduced Motion and Fallback Handling

Files:

- `src/components/ui/MotionGuideDialog.tsx`
- `src/styles/app.css`

Implementation:

- For `prefers-reduced-motion: reduce`, display the poster/still state instead of continuous autoplay if feasible.
- Ensure the explanatory text remains enough without motion.
- Keep the video muted and `playsInline`.

Acceptance:

- Reduced-motion users do not get forced continuous movement.
- No audio or browser autoplay permission issue is introduced.

## Task 6: Verification

Run:

- `npm run typecheck:test`
- `npm run test -- --run`
- `npm run build`
- `npm run test:e2e`
- `npm run check`

Manual/browser QA:

- Open the "자전과 공전" dialog.
- Confirm the 자전 visual shows smooth Earth self-rotation.
- Confirm the axis stays fixed.
- Confirm the 공전 visual still follows the orbit ring.
- Confirm mobile layout does not become too tall.
- Confirm the deployed GitHub Pages URL loads the video asset.

Expected result: all pass.

## Commit Units

1. Add Remotion source and render scripts.
2. Create Earth rotation composition and render assets.
3. Replace 자전 visual with video asset and fallback behavior.
4. Update tests and remove unused CSS.
5. Verify locally, push, and confirm GitHub Pages deployment.

## Risks and Mitigations

- Risk: Video file increases repository size.
  - Mitigation: Keep duration short, resolution modest, and compression classroom-friendly.

- Risk: Autoplay is blocked.
  - Mitigation: Use `muted`, `playsInline`, `loop`, and poster fallback.

- Risk: GitHub Pages base path breaks asset loading.
  - Mitigation: Use `import.meta.env.BASE_URL` or the existing base-path pattern and cover it with E2E.

- Risk: Remotion setup adds unnecessary runtime weight.
  - Mitigation: Keep Remotion as dev-only source; production app imports only static assets.

- Risk: Reduced-motion users see too much movement.
  - Mitigation: Pause or replace video with poster under `prefers-reduced-motion`.
