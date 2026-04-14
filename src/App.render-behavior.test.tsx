import { act, render, screen } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { installCanvasTestEnvironment } from "./test/canvasTestUtils";

let planetInfoPanelRenderCount = 0;

vi.mock("./components/ui/PlanetInfoPanel", () => ({
  default: () => {
    planetInfoPanelRenderCount += 1;
    return <aside aria-label="행성 정보 패널 모의값" />;
  },
}));

import App from "./App";

describe("App render behavior", () => {
  let env: ReturnType<typeof installCanvasTestEnvironment>;

  beforeEach(() => {
    planetInfoPanelRenderCount = 0;
    env = installCanvasTestEnvironment();
  });

  afterEach(() => {
    env.cleanup();
  });

  it("keeps stable children from rerendering while the canvas animates", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "일시정지" })).toBeInTheDocument();
    expect(planetInfoPanelRenderCount).toBe(1);

    act(() => {
      env.flushAnimationFrame(1000);
      env.flushAnimationFrame(2000);
      env.flushAnimationFrame(3000);
    });

    expect(planetInfoPanelRenderCount).toBe(1);
  });
});
