import type { PlanetRecord } from "../../types/solar-system";

interface PlanetImageAttributionProps {
  planet: PlanetRecord;
}

export default function PlanetImageAttribution({
  planet,
}: PlanetImageAttributionProps) {
  return (
    <div className="planet-image-attribution">
      <p className="planet-image-attribution__label">이미지 출처</p>
      <p className="planet-image-attribution__body">
        <a
          className="planet-image-attribution__link"
          href={planet.imageSourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          {planet.imageSourceLabel}
        </a>
        <span className="planet-image-attribution__credit">
          제공: {planet.imageCredit}
        </span>
      </p>
    </div>
  );
}
