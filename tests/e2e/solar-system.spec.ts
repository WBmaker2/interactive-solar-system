import { expect, test, type Locator, type Page } from "@playwright/test";

import { planets } from "../../src/data/planets";
import { buildScene, initialPlanetAngles } from "../../src/lib/scene";
import type { PlanetId } from "../../src/types/solar-system";

const appEntryPath = "./";

async function pauseSimulation(page: Page) {
  await page.getByRole("button", { name: "일시정지" }).click();
}

async function waitForScenePaint(canvas: Locator) {
  await expect(canvas).toBeVisible();
  await canvas.evaluate(
    (node) =>
      new Promise<void>((resolve) => {
        const canvasNode = node as HTMLCanvasElement;
        if (canvasNode.width > 0 && canvasNode.height > 0) {
          requestAnimationFrame(() => resolve());
          return;
        }

        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      })
  );
}

async function clickPlanet(page: Page, planetId: PlanetId) {
  const canvas = page.getByLabel("태양계 궤도 시각화");
  await waitForScenePaint(canvas);

  const box = await canvas.boundingBox();

  if (!box) {
    throw new Error("태양계 캔버스의 좌표를 읽을 수 없습니다.");
  }

  const scene = buildScene(box.width, box.height, planets, initialPlanetAngles);
  const targetPlanet = scene.scenePlanets.find(
    (scenePlanet) => scenePlanet.planet.id === planetId
  );

  if (!targetPlanet) {
    throw new Error(`행성 데이터를 찾을 수 없습니다: ${planetId}`);
  }

  await canvas.click({
    position: {
      x: targetPlanet.x,
      y: targetPlanet.y,
    },
  });
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

async function expectVideoLoaded(video: Locator) {
  await expect(video).toBeVisible();
  await expect
    .poll(async () =>
      video.evaluate((node) => {
        if (!(node instanceof HTMLVideoElement)) {
          return 0;
        }

        return node.readyState;
      })
    )
    .toBeGreaterThan(0);
}

test.describe("Interactive Solar System", () => {
  test("desktop flow: pause, click earth, and open comparison view", async ({
    page,
  }) => {
    await page.goto(appEntryPath);
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

  test("opens the motion guide and loads the rendered earth rotation loop", async ({
    page,
  }) => {
    await page.goto(appEntryPath);

    await page.getByRole("button", { name: "자전과 공전" }).click();

    const dialog = page.getByRole("dialog", { name: "자전과 공전" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { exact: true, name: "자전" })).toBeVisible();
    await expect(dialog.getByRole("heading", { exact: true, name: "공전" })).toBeVisible();

    const rotationVideo = dialog.locator(".motion-guide__rotation-video");
    await expectVideoLoaded(rotationVideo);
    await expect(rotationVideo.locator("source")).toHaveAttribute(
      "src",
      /\/learning\/earth-rotation\.mp4$/
    );

    await page.getByRole("button", { name: "닫기" }).click();
    await expect(dialog).toBeHidden();
  });

  test.describe("mobile flow", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("shows the bottom sheet and updates it after earth click", async ({
      page,
    }) => {
      await page.goto(appEntryPath);
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
