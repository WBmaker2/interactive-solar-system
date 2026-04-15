import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ControlBar from "./ControlBar";

describe("ControlBar", () => {
  it("shows playback, time, reset, and comparison controls", async () => {
    const user = userEvent.setup();
    const onTogglePlaying = vi.fn();
    const onSpeedChange = vi.fn();
    const onReset = vi.fn();
    const onOpenComparison = vi.fn();
    const onOpenMotionGuide = vi.fn();

    render(
      <ControlBar
        isPlaying={true}
        onOpenComparison={onOpenComparison}
        onOpenMotionGuide={onOpenMotionGuide}
        onReset={onReset}
        onSpeedChange={onSpeedChange}
        onTogglePlaying={onTogglePlaying}
        speedMultiplier={0.5}
      />
    );

    expect(screen.getByText("x0.5")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "일시정지" }));
    await user.click(screen.getByRole("button", { name: "초기화" }));
    await user.click(screen.getByRole("button", { name: "비교 보기" }));
    await user.click(screen.getByRole("button", { name: "자전과 공전" }));
    fireEvent.change(screen.getByRole("slider", { name: "시간 빨리 감기" }), {
      target: { value: "11" },
    });

    expect(onTogglePlaying).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onOpenComparison).toHaveBeenCalledWith("size");
    expect(onOpenMotionGuide).toHaveBeenCalledTimes(1);
    expect(onSpeedChange).toHaveBeenCalledWith(10);
  });
});
