import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { planets } from "../../data/planets";
import ComparisonSheet from "./ComparisonSheet";

describe("ComparisonSheet", () => {
  it("shows sorted size rows, changes mode, and closes", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onModeChange = vi.fn();

    render(
      <ComparisonSheet
        isOpen={true}
        mode="size"
        onClose={onClose}
        onModeChange={onModeChange}
        planets={planets}
      />
    );

    expect(
      screen.getByRole("heading", { name: "크기 비교" })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "크기 비교" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("목성");

    await user.click(screen.getByRole("tab", { name: "거리 비교" }));
    await user.click(screen.getByRole("button", { name: "닫기" }));

    expect(onModeChange).toHaveBeenCalledWith("distance");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows size presets and updates the side-by-side spotlight", async () => {
    const user = userEvent.setup();

    render(
      <ComparisonSheet
        isOpen={true}
        mode="size"
        onClose={vi.fn()}
        onModeChange={vi.fn()}
        planets={planets}
      />
    );

    expect(
      screen.getByRole("group", { name: "대표 크기 비교" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "지구와 금성" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("region", { name: "나란히 크기 비교" })
    ).toHaveTextContent("금성은 지구와 거의 비슷한 크기예요.");

    await user.click(screen.getByRole("button", { name: "지구와 목성" }));

    expect(
      screen.getByRole("button", { name: "지구와 목성" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("region", { name: "나란히 크기 비교" })
    ).toHaveTextContent("목성은 지구보다 훨씬 커서 가장 큰 행성이에요.");
  });

  it("hides size presets when distance mode is active", () => {
    render(
      <ComparisonSheet
        isOpen={true}
        mode="distance"
        onClose={vi.fn()}
        onModeChange={vi.fn()}
        planets={planets}
      />
    );

    expect(
      screen.queryByRole("group", { name: "대표 크기 비교" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "나란히 크기 비교" })
    ).not.toBeInTheDocument();
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <ComparisonSheet
        isOpen={true}
        mode="size"
        onClose={onClose}
        onModeChange={vi.fn()}
        planets={planets}
      />
    );

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <ComparisonSheet
        isOpen={false}
        mode="size"
        onClose={vi.fn()}
        onModeChange={vi.fn()}
        planets={planets}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
