import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const textureWidth = 520;
const sphereSize = 250;

function getLoopProgress(frame: number, durationInFrames: number) {
  return frame / durationInFrames;
}

export function EarthRotationLoop() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = getLoopProgress(frame, durationInFrames);
  const textureOffset = -progress * textureWidth;
  const cloudOffset = -progress * textureWidth * 1.28;
  const glow = interpolate(
    Math.sin(progress * Math.PI * 2),
    [-1, 1],
    [0.72, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 50% 50%, rgba(42, 105, 174, 0.14), transparent 31%), linear-gradient(135deg, #101924 0%, #0b111d 54%, #080d16 100%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 300,
          position: "relative",
          width: 360,
        }}
      >
        <div
          style={{
            filter: `drop-shadow(0 0 ${30 * glow}px rgba(83, 170, 255, 0.5))`,
            height: sphereSize,
            left: 55,
            position: "absolute",
            top: 28,
            transform: "rotate(-11deg)",
            width: sphereSize,
          }}
        >
          <div
            style={{
              background: "linear-gradient(115deg, #0d5ec7 0%, #2e93ff 48%, #082b6f 100%)",
              borderRadius: "50%",
              boxShadow:
                "inset -42px 0 48px rgba(3, 16, 48, 0.54), inset 20px 0 32px rgba(135, 220, 255, 0.24), 0 18px 54px rgba(0, 0, 0, 0.34)",
              height: "100%",
              overflow: "hidden",
              position: "relative",
              width: "100%",
            }}
          >
            <div
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 11% 32%, rgba(80, 178, 114, 0.96) 0 7%, transparent 8%), radial-gradient(ellipse at 22% 55%, rgba(226, 202, 126, 0.88) 0 6%, transparent 7%), radial-gradient(ellipse at 37% 34%, rgba(74, 170, 100, 0.96) 0 8%, transparent 9%), radial-gradient(ellipse at 51% 60%, rgba(92, 184, 112, 0.9) 0 10%, transparent 11%), radial-gradient(ellipse at 68% 31%, rgba(219, 195, 116, 0.86) 0 7%, transparent 8%), radial-gradient(ellipse at 82% 56%, rgba(68, 164, 105, 0.95) 0 10%, transparent 11%), linear-gradient(90deg, rgba(8, 61, 151, 0.82) 0 15%, rgba(25, 118, 210, 0.7) 15% 32%, rgba(6, 83, 185, 0.78) 32% 48%, rgba(45, 153, 238, 0.58) 48% 62%, rgba(4, 71, 168, 0.82) 62% 79%, rgba(28, 135, 225, 0.66) 79% 100%)",
                backgroundRepeat: "repeat-x",
                backgroundSize: `${textureWidth}px 100%`,
                height: "100%",
                left: -textureWidth / 2,
                mixBlendMode: "screen",
                position: "absolute",
                top: 0,
                transform: `translateX(${textureOffset}px)`,
                width: textureWidth * 3,
              }}
            />

            <div
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 8% 24%, rgba(255, 255, 255, 0.62) 0 7%, transparent 8%), radial-gradient(ellipse at 29% 72%, rgba(255, 255, 255, 0.42) 0 8%, transparent 9%), radial-gradient(ellipse at 48% 20%, rgba(255, 255, 255, 0.58) 0 5%, transparent 6%), radial-gradient(ellipse at 72% 58%, rgba(255, 255, 255, 0.44) 0 7%, transparent 8%), linear-gradient(90deg, transparent 0 8%, rgba(255, 255, 255, 0.18) 8% 14%, transparent 14% 33%, rgba(255, 255, 255, 0.2) 33% 39%, transparent 39% 100%)",
                backgroundRepeat: "repeat-x",
                backgroundSize: `${textureWidth}px 100%`,
                filter: "blur(1.2px)",
                height: "100%",
                left: -textureWidth / 2,
                opacity: 0.62,
                position: "absolute",
                top: 0,
                transform: `translateX(${cloudOffset}px)`,
                width: textureWidth * 3,
              }}
            />

            <div
              style={{
                background:
                  "radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.48), transparent 21%), linear-gradient(90deg, rgba(0, 0, 0, 0.42) 0%, transparent 29%, transparent 60%, rgba(0, 0, 0, 0.58) 100%)",
                height: "100%",
                inset: 0,
                position: "absolute",
                width: "100%",
              }}
            />
          </div>
        </div>

        <div
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(218, 236, 255, 0.72) 17%, rgba(218, 236, 255, 0.72) 83%, transparent 100%)",
            borderRadius: 999,
            boxShadow: "0 0 10px rgba(162, 210, 255, 0.25)",
            height: 312,
            left: 179,
            opacity: 0.78,
            position: "absolute",
            top: -7,
            transform: "rotate(-11deg)",
            transformOrigin: "50% 50%",
            width: 5,
            zIndex: 8,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}
