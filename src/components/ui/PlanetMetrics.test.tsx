import { render, screen } from "@testing-library/react";

import { planets } from "../../data/planets";
import PlanetMetrics from "./PlanetMetrics";

describe("PlanetMetrics", () => {
  it("keeps numeric metrics inside an optional detail disclosure", () => {
    render(<PlanetMetrics planet={planets[0]} />);

    expect(screen.getByText("자세한 숫자 보기")).toBeInTheDocument();
    expect(screen.getByText("지구의 0.38배")).toBeInTheDocument();
    expect(screen.getByText("지구보다 훨씬 작아요")).toBeInTheDocument();
    expect(screen.getByText("0.39 AU")).toBeInTheDocument();
    expect(screen.getByText("88일")).toBeInTheDocument();
  });
});
