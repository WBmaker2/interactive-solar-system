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

    render(
      <ControlBar
        isPlaying={true}
        onOpenComparison={onOpenComparison}
        onReset={onReset}
        onSpeedChange={onSpeedChange}
        onTogglePlaying={onTogglePlaying}
        speedMultiplier={8}
      />
    );

    await user.click(screen.getByRole("button", { name: "일시정지" }));
    await user.click(screen.getByRole("button", { name: "초기화" }));
    await user.click(screen.getByRole("button", { name: "비교 보기" }));
    fireEvent.change(screen.getByRole("slider", { name: "시간 빨리 감기" }), {
      target: { value: "12" },
    });

    expect(onTogglePlaying).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onOpenComparison).toHaveBeenCalledWith("size");
    expect(onSpeedChange).toHaveBeenCalledWith(12);
  });
});
