import { render, screen } from "@testing-library/react";
import { planets } from "../../data/planets";
import MobileInfoSheet from "./MobileInfoSheet";

describe("MobileInfoSheet", () => {
  it("keeps the guidance visible before selection and opens with selection", () => {
    const { rerender } = render(<MobileInfoSheet planet={null} />);

    expect(
      screen.getByRole("complementary", { name: "행성 정보 바텀 시트" })
    ).toHaveAttribute("data-open", "false");
    expect(screen.getByRole("heading", { name: "아래에서 바로 확인해요" })).toBeInTheDocument();

    rerender(<MobileInfoSheet planet={planets[2]} />);

    expect(
      screen.getByRole("complementary", { name: "행성 정보 바텀 시트" })
    ).toHaveAttribute("data-open", "true");
    expect(screen.getByRole("heading", { name: "지구" })).toBeInTheDocument();
    expect(screen.getByText("자세한 숫자 보기")).toBeInTheDocument();
    expect(screen.getByText("지구의 1배")).toBeInTheDocument();
    expect(screen.getByText("지구와 비슷한 크기예요")).toBeInTheDocument();
    expect(screen.getByText("태양과 가까운 편이에요")).toBeInTheDocument();
    expect(screen.getByText("365일")).toBeInTheDocument();
    expect(screen.getByText("1년 안에 한 바퀴를 돌아요")).toBeInTheDocument();
    expect(screen.getByText("우리가 살고 있는 행성이며 비교 기준으로 사용해요.")).toBeInTheDocument();
    expect(screen.getByText("먼저 살펴볼 점")).toBeInTheDocument();
    expect(screen.getByText("이미지 출처")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "NASA Science Photojournal" })
    ).toHaveAttribute("href", "https://science.nasa.gov/photojournal/earth/");
    expect(screen.getByText(/제공: NASA$/)).toBeInTheDocument();
  });
});
