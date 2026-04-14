import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { missions } from "./data/missions";
import App from "./App";

describe("태양계 앱 셸", () => {
  it("renders the classroom shell landmarks and time control", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "내 손안의 우주" })
    ).toBeInTheDocument();
    expect(screen.getByText(missions[0].prompt)).toBeInTheDocument();
    expect(screen.getByText("진행 중")).toBeInTheDocument();
    expect(screen.getByRole("note", { name: "축척 안내" })).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "태양계 관찰 무대" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "행성 정보 패널" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "행성을 눌러 보세요" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "일시정지" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "비교 보기" })).toBeInTheDocument();

    const slider = screen.getByRole("slider", { name: "시간 빨리 감기" });
    expect(slider).toHaveAttribute("min", "1");
    expect(slider).toHaveAttribute("max", "20");
    expect(slider).toHaveValue("6");
    expect(
      screen.getByRole("complementary", { name: "행성 정보 바텀 시트" })
    ).toBeInTheDocument();
  });

  it("opens and closes the comparison sheet from the control bar", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "비교 보기" }));

    expect(
      screen.getByRole("heading", { name: "크기 비교" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "닫기" }));

    expect(
      screen.queryByRole("heading", { name: "크기 비교" })
    ).not.toBeInTheDocument();
  });
});
