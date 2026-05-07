import { Composition, registerRoot } from "remotion";

import { EarthRotationLoop } from "./EarthRotationLoop";

function RemotionRoot() {
  return (
    <Composition
      component={EarthRotationLoop}
      durationInFrames={150}
      fps={30}
      height={540}
      id="EarthRotationLoop"
      width={960}
    />
  );
}

registerRoot(RemotionRoot);
