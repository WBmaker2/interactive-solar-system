import { render, screen } from "@testing-library/react";

import { planets } from "../../data/planets";
import PlanetFacts from "./PlanetFacts";

describe("PlanetFacts", () => {
  it("renders planet facts as the basic first-read information", () => {
    render(<PlanetFacts planet={planets[0]} title="먼저 살펴볼 점" />);

    expect(screen.getByRole("heading", { name: "먼저 살펴볼 점" })).toBeInTheDocument();
    expect(screen.getByText("태양과 가장 가깝다")).toBeInTheDocument();
    expect(screen.getByText("공전 속도가 가장 빠르다")).toBeInTheDocument();
  });
});
