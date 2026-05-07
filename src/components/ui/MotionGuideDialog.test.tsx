import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { planets } from "../../data/planets";
import MotionGuideDialog from "./MotionGuideDialog";

const originalMatchMedia = window.matchMedia;

describe("MotionGuideDialog", () => {
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: originalMatchMedia,
      writable: true,
    });
  });

  it("renders nothing while closed", () => {
    const { container } = render(
      <MotionGuideDialog
        isOpen={false}
        onClose={vi.fn()}
        planet={null}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("shows the rotation and orbit learning cards with contextual text", () => {
    const { container } = render(
      <MotionGuideDialog
        isOpen={true}
        onClose={vi.fn()}
        planet={planets.find((planet) => planet.id === "earth") ?? null}
      />
    );

    expect(screen.getByRole("heading", { name: "자전과 공전" })).toBeInTheDocument();
    expect(screen.getByText("행성이 스스로 도는 것")).toBeInTheDocument();
    expect(screen.getByText("행성이 태양 주위를 도는 것")).toBeInTheDocument();
    expect(
      screen.getByText("지구는 자전으로 낮과 밤이 생기고, 공전으로 1년이 생겨요.")
    ).toBeInTheDocument();
    const rotationVideo = container.querySelector(".motion-guide__rotation-video");
    const rotationPoster = container.querySelector(".motion-guide__rotation-poster");

    expect(rotationPoster).toHaveAttribute("src", "/learning/earth-rotation-poster.png");
    expect(rotationVideo).toHaveAttribute("poster", "/learning/earth-rotation-poster.png");
    expect(rotationVideo?.querySelector("source")).toHaveAttribute(
      "src",
      "/learning/earth-rotation.mp4"
    );
    expect(container.querySelector(".motion-guide__orbit-rotator")).toBeInTheDocument();
    expect(
      container.querySelector(".motion-guide__orbit-rotator .motion-guide__orbit-planet")
    ).toBeInTheDocument();
  });

  it("shows only the poster when reduced motion is requested", async () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
      writable: true,
    });

    const { container } = render(
      <MotionGuideDialog
        isOpen={true}
        onClose={vi.fn()}
        planet={null}
      />
    );

    await waitFor(() =>
      expect(container.querySelector(".motion-guide__rotation-video")).not.toBeInTheDocument()
    );
    expect(container.querySelector(".motion-guide__rotation-poster")).toHaveAttribute(
      "src",
      "/learning/earth-rotation-poster.png"
    );
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <MotionGuideDialog
        isOpen={true}
        onClose={onClose}
        planet={null}
      />
    );

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
