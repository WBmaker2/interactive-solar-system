import {
  describeDistance,
  describeOrbitalPeriod,
  describePlanetSize,
  formatPlanetMetricValue,
} from "../../lib/planet-interpretation";
import type { PlanetRecord } from "../../types/solar-system";

interface PlanetMetricsProps {
  planet: PlanetRecord;
  className?: string;
}

export default function PlanetMetrics({ planet, className }: PlanetMetricsProps) {
  return (
    <details className={`planet-metrics ${className ?? ""}`.trim()}>
      <summary className="planet-metrics__summary">자세한 숫자 보기</summary>
      <dl className="planet-metrics__list">
        <div>
          <dt>크기</dt>
          <dd>
            <span className="planet-metrics__value">
              지구의 {formatPlanetMetricValue(planet.diameterEarths, "배")}
            </span>
            <span className="planet-metrics__note">
              {describePlanetSize(planet.diameterEarths)}
            </span>
          </dd>
        </div>
        <div>
          <dt>태양과의 거리</dt>
          <dd>
            <span className="planet-metrics__value">
              {formatPlanetMetricValue(planet.distanceFromSunAU, "AU")}
            </span>
            <span className="planet-metrics__note">
              {describeDistance(planet.distanceFromSunAU)}
            </span>
          </dd>
        </div>
        <div>
          <dt>공전</dt>
          <dd>
            <span className="planet-metrics__value">
              {formatPlanetMetricValue(planet.orbitalPeriodDays, "일")}
            </span>
            <span className="planet-metrics__note">
              {describeOrbitalPeriod(planet.orbitalPeriodDays)}
            </span>
          </dd>
        </div>
      </dl>
    </details>
  );
}
