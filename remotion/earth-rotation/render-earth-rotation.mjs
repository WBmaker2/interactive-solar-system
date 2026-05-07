import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const entry = "remotion/earth-rotation/Root.tsx";
const composition = "EarthRotationLoop";
const videoOutput = "public/learning/earth-rotation.mp4";
const posterOutput = "public/learning/earth-rotation-poster.png";
const remotionBin = resolve("node_modules/.bin/remotion");

function runRemotion(args) {
  const result = spawnSync(remotionBin, args, {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

mkdirSync(dirname(videoOutput), { recursive: true });

runRemotion([
  "still",
  entry,
  composition,
  posterOutput,
  "--frame=45",
  "--overwrite",
]);

runRemotion([
  "render",
  entry,
  composition,
  videoOutput,
  "--codec=h264",
  "--crf=28",
  "--overwrite",
]);
