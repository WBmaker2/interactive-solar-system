import { render, screen } from "@testing-library/react";
import { planets } from "../../data/planets";
import PlanetInfoPanel from "./PlanetInfoPanel";

describe("PlanetInfoPanel", () => {
  it("shows an empty state before a planet is selected", () => {
    render(<PlanetInfoPanel planet={null} />);

    expect(screen.getByRole("heading", { name: "행성을 눌러 보세요" })).toBeInTheDocument();
    expect(
      screen.getByText(/숫자와 쉬운 설명을 함께/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/시간을 바꿔 가며 다시 살펴보세요/i)
    ).toBeInTheDocument();
  });

  it("shows selected planet details including image, facts, and next-step guidance", () => {
    render(<PlanetInfoPanel planet={planets[0]} />);

    expect(screen.getByRole("heading", { name: "수성" })).toBeInTheDocument();
    expect(
      screen.getByAltText("수성의 실제 모습")
    ).toBeInTheDocument();
    expect(screen.getByText("태양에 가장 가까워 빠르게 한 바퀴를 도는 행성이에요.")).toBeInTheDocument();
    expect(screen.getByText("자세한 숫자 보기")).toBeInTheDocument();
    expect(screen.getByText("지구의 0.38배")).toBeInTheDocument();
    expect(screen.getByText("지구보다 훨씬 작아요")).toBeInTheDocument();
    expect(screen.getByText("0.39 AU")).toBeInTheDocument();
    expect(screen.getByText("태양에 아주 가까워요")).toBeInTheDocument();
    expect(screen.getByText("88일")).toBeInTheDocument();
    expect(screen.getByText("한 바퀴 도는 데 아주 짧은 시간이 걸려요")).toBeInTheDocument();
    expect(screen.getByText("태양과 가장 가깝다")).toBeInTheDocument();
    expect(screen.getByText("이미지 출처")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "NASA Science Photojournal" })
    ).toHaveAttribute(
      "href",
      "https://science.nasa.gov/photojournal/mercury-globe-0n-180e/"
    );
    expect(
      screen.getByText(/NASA\/Johns Hopkins University Applied Physics Laboratory/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText("다음으로 금성을 눌러 지구와의 크기 차이를 살펴보세요.")
    ).toBeInTheDocument();
  });
});
