import { render, screen } from "@testing-library/react";
import { planets } from "../../data/planets";
import PlanetInfoPanel from "./PlanetInfoPanel";

describe("PlanetInfoPanel", () => {
  it("shows an empty state before a planet is selected", () => {
    render(<PlanetInfoPanel planet={null} />);

    expect(screen.getByRole("heading", { name: "행성을 눌러 보세요" })).toBeInTheDocument();
    expect(
      screen.getByText(/아직 선택된 행성이 없습니다/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/먼저 수성이나 지구를 눌러 보고/i)
    ).toBeInTheDocument();
  });

  it("shows selected planet details including image, facts, and next-step guidance", () => {
    render(<PlanetInfoPanel planet={planets[0]} />);

    expect(screen.getByRole("heading", { name: "수성" })).toBeInTheDocument();
    expect(
      screen.getByAltText("수성의 실제 모습")
    ).toBeInTheDocument();
    expect(screen.getByText("태양에 가장 가까워 빠르게 한 바퀴를 도는 행성이에요.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "기초 수치" })).toBeInTheDocument();
    expect(screen.getByText("지구의 0.38배")).toBeInTheDocument();
    expect(screen.getByText("0.39 AU")).toBeInTheDocument();
    expect(screen.getByText("88일")).toBeInTheDocument();
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
