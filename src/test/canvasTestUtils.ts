import { vi } from "vitest";

type CanvasContextMock = {
  arc: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
  createRadialGradient: ReturnType<typeof vi.fn>;
  fill: ReturnType<typeof vi.fn>;
  restore: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  setTransform: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  fillStyle?: unknown;
  lineWidth?: unknown;
  shadowBlur?: unknown;
  shadowColor?: unknown;
  strokeStyle?: unknown;
};

export function installCanvasTestEnvironment(width = 800, height = 600) {
  const scheduledFrames = new Map<number, FrameRequestCallback>();
  let frameId = 0;

  const requestAnimationFrameMock = vi.fn((callback: FrameRequestCallback) => {
    frameId += 1;
    scheduledFrames.set(frameId, callback);
    return frameId;
  });
  const cancelAnimationFrameMock = vi.fn((id: number) => {
    scheduledFrames.delete(id);
  });

  vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock);
  vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);

  const gradientMock = {
    addColorStop: vi.fn(),
  };
  const contextMock: CanvasContextMock = {
    arc: vi.fn(),
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    createRadialGradient: vi.fn(() => gradientMock),
    fill: vi.fn(),
    restore: vi.fn(),
    save: vi.fn(),
    setTransform: vi.fn(),
    stroke: vi.fn(),
  };

  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () => contextMock as unknown as CanvasRenderingContext2D,
  );

  vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue({
    bottom: height,
    height,
    left: 0,
    right: width,
    top: 0,
    width,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);

  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(width);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(height);

  const flushAnimationFrame = (now: number) => {
    const callbacks = Array.from(scheduledFrames.entries());
    scheduledFrames.clear();

    for (const [, callback] of callbacks) {
      callback(now);
    }
  };

  const cleanup = () => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    scheduledFrames.clear();
    frameId = 0;
  };

  return {
    cancelAnimationFrameMock,
    cleanup,
    contextMock,
    flushAnimationFrame,
    getScheduledFrameCount: () => scheduledFrames.size,
    requestAnimationFrameMock,
  };
}
