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
    render(
      <MissionChip
        label="지구와 크기가 비슷한 행성을 찾아보세요."
        status="completed"
        explanation={{
          answer: "금성",
          reason: "금성은 지구 지름의 약 0.95배라서 크기가 매우 비슷해요.",
          caution: "크기가 비슷하다고 환경까지 비슷한 것은 아니에요.",
        }}
      />
    );

    expect(screen.getByText("완료")).toBeInTheDocument();
    expect(
      screen
        .getByText("지구와 크기가 비슷한 행성을 찾아보세요.")
        .closest(".mission-chip")
    ).toHaveClass("mission-chip--completed");
    expect(screen.getByText("정답")).toBeInTheDocument();
    expect(screen.getByText("왜 그럴까요?")).toBeInTheDocument();
    expect(screen.getByText("헷갈리기 쉬운 점")).toBeInTheDocument();
    expect(screen.getByText("금성")).toBeInTheDocument();
    expect(
      screen.getByText("금성은 지구 지름의 약 0.95배라서 크기가 매우 비슷해요.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("크기가 비슷하다고 환경까지 비슷한 것은 아니에요.")
    ).toBeInTheDocument();
  });

  it("does not render the explanation while the mission is still active", () => {
    render(
      <MissionChip
        label="지구와 크기가 비슷한 행성을 찾아보세요."
        status="active"
        explanation={{
          answer: "금성",
          reason: "금성은 지구 지름의 약 0.95배라서 크기가 매우 비슷해요.",
          caution: "크기가 비슷하다고 환경까지 비슷한 것은 아니에요.",
        }}
      />
    );

    expect(screen.queryByText("정답")).not.toBeInTheDocument();
    expect(
      screen.queryByText("금성은 지구 지름의 약 0.95배라서 크기가 매우 비슷해요.")
    ).not.toBeInTheDocument();
  });
});
