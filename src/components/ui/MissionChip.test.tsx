import { render, screen } from "@testing-library/react";

import MissionChip from "./MissionChip";

describe("MissionChip", () => {
  it("renders the active mission state", () => {
    render(<MissionChip label="가장 빠르게 도는 행성을 찾아보세요." />);

    expect(screen.getByText("진행 중")).toBeInTheDocument();
    expect(screen.getByText("가장 빠르게 도는 행성을 찾아보세요.")).toHaveClass(
      "mission-chip__label"
    );
  });

  it("renders the completed mission state", () => {
    render(<MissionChip label="미션 완료" status="completed" />);

    expect(screen.getByText("완료")).toBeInTheDocument();
    expect(screen.getByText("미션 완료").closest(".mission-chip")).toHaveClass(
      "mission-chip--completed"
    );
  });
});
