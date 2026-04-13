import { expect, test, type Locator, type Page } from "@playwright/test";

import { planets } from "../../src/data/planets";
import type { PlanetId } from "../../src/types/solar-system";

const scenePadding = 28;
const initialAngles: Record<PlanetId, number> = {
  mercury: 0,
  venus: 40,
  earth: 90,
  mars: 140,
  jupiter: 180,
  saturn: 220,
  uranus: 260,
  neptune: 300,
};

async function pauseSimulation(page: Page) {
  await page.getByRole("button", { name: "일시정지" }).click();
}

async function clickPlanet(page: Page, planetId: PlanetId) {
  const canvas = page.getByLabel("태양계 궤도 시각화");
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();

  if (!box) {
    throw new Error("태양계 캔버스의 좌표를 읽을 수 없습니다.");
  }

  const maxOrbitRadius = planets.at(-1)?.orbitRadius ?? 1;
  const targetPlanet = planets.find((planet) => planet.id === planetId);

  if (!targetPlanet) {
    throw new Error(`행성 데이터를 찾을 수 없습니다: ${planetId}`);
  }

  const usableRadius = Math.max(
    0,
    Math.min(box.width, box.height) / 2 - scenePadding
  );
  const orbitScale = usableRadius / maxOrbitRadius;
  const orbitRadius = targetPlanet.orbitRadius * orbitScale;
  const angle =
    ((initialAngles[planetId] ?? 0) - 90) * (Math.PI / 180);

  const clickX = box.x + box.width / 2 + Math.cos(angle) * orbitRadius;
  const clickY = box.y + box.height / 2 + Math.sin(angle) * orbitRadius;

  await page.mouse.click(clickX, clickY);
}

async function expectPlanetPanel(
  panel: Locator,
  heading: string,
  summarySnippet: string
) {
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("heading", { name: heading })).toBeVisible();
  await expect(panel.getByText(summarySnippet)).toBeVisible();
}

async function expectImageLoaded(image: Locator) {
  await expect(image).toBeVisible();
  await expect
    .poll(async () =>
      image.evaluate((node) => {
        if (!(node instanceof HTMLImageElement)) {
          return 0;
        }

        return node.naturalWidth;
      })
    )
    .toBeGreaterThan(0);
}

test.describe("Interactive Solar System", () => {
  test("desktop flow: pause, click earth, and open comparison view", async ({
    page,
  }) => {
    await page.goto("/");
    await pauseSimulation(page);

    await clickPlanet(page, "earth");

    const desktopPanel = page.getByRole("complementary", {
      name: "행성 정보 패널",
    });
    await expectPlanetPanel(
      desktopPanel,
      "지구",
      "우리가 살고 있는 행성이며 비교 기준으로 사용해요."
    );
    await expectImageLoaded(desktopPanel.getByAltText("지구의 실제 모습"));
    await expect(
      desktopPanel.getByRole("link", { name: "NASA Science Photojournal" })
    ).toHaveAttribute("href", "https://science.nasa.gov/photojournal/earth/");

    await page.getByRole("button", { name: "비교 보기" }).click();
    await expect(
      page.getByRole("dialog", { name: "태양계 비교 보기" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "크기 비교" })).toBeVisible();
    await page.getByRole("tab", { name: "거리 비교" }).click();
    await expect(page.getByRole("heading", { name: "거리 비교" })).toBeVisible();
    await page.getByRole("button", { name: "닫기" }).click();
    await expect(
      page.getByRole("dialog", { name: "태양계 비교 보기" })
    ).toBeHidden();
  });

  test.describe("mobile flow", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("shows the bottom sheet and updates it after earth click", async ({
      page,
    }) => {
      await page.goto("/");
      await pauseSimulation(page);

      const mobileSheet = page.getByRole("complementary", {
        name: "행성 정보 바텀 시트",
      });
      await expect(
        mobileSheet.getByRole("heading", { name: "아래에서 바로 확인해요" })
      ).toBeVisible();

      await clickPlanet(page, "earth");

      await expectPlanetPanel(
        mobileSheet,
        "지구",
        "우리가 살고 있는 행성이며 비교 기준으로 사용해요."
      );
      await expectImageLoaded(mobileSheet.getByAltText("지구의 실제 모습"));
      await expect(
        mobileSheet.getByRole("link", { name: "NASA Science Photojournal" })
      ).toHaveAttribute("href", "https://science.nasa.gov/photojournal/earth/");

      await page.getByRole("button", { name: "비교 보기" }).click();
      await expect(
        page.getByRole("dialog", { name: "태양계 비교 보기" })
      ).toBeVisible();
    });
  });
});
