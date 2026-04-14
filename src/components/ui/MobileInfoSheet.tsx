import type { PlanetRecord } from "../../types/solar-system";
import {
  describeDistance,
  describeOrbitalPeriod,
  describePlanetSize,
  formatPlanetMetricValue,
} from "../../lib/planet-interpretation";
import PlanetImageAttribution from "./PlanetImageAttribution";

interface MobileInfoSheetProps {
  planet: PlanetRecord | null;
}

export default function MobileInfoSheet({ planet }: MobileInfoSheetProps) {
  return (
    <aside
      aria-label="행성 정보 바텀 시트"
      className="mobile-info-sheet"
      data-open={Boolean(planet)}
    >
      {planet ? (
        <div className="mobile-info-sheet__content">
          <header className="mobile-info-sheet__header">
            <p className="mobile-info-sheet__eyebrow">행성 탐색</p>
            <h2 className="mobile-info-sheet__title">{planet.nameKo}</h2>
            <p className="mobile-info-sheet__subtitle">{planet.nameEn}</p>
          </header>

          <div className="mobile-info-sheet__summary-block">
            <img
              alt={`${planet.nameKo}의 실제 모습`}
              className="mobile-info-sheet__image"
              src={planet.imageSrc}
            />
            <p className="mobile-info-sheet__summary">{planet.summary}</p>
          </div>

          <section className="mobile-info-sheet__facts-section" aria-label="행성 특징">
            <h3 className="mobile-info-sheet__section-title">먼저 살펴볼 점</h3>
            <ul className="mobile-info-sheet__facts">
              {planet.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </section>

          <p className="mobile-info-sheet__next">{planet.nextExplorationPrompt}</p>

          <section aria-label="기초 수치">
            <h3 className="mobile-info-sheet__section-title">숫자와 해석</h3>
            <dl className="mobile-info-sheet__metrics">
              <div>
                <dt>크기</dt>
                <dd>
                  <span className="mobile-info-sheet__metric-value">
                    지구의 {formatPlanetMetricValue(planet.diameterEarths, "배")}
                  </span>
                  <span className="mobile-info-sheet__metric-note">
                    {describePlanetSize(planet.diameterEarths)}
                  </span>
                </dd>
              </div>
              <div>
                <dt>거리</dt>
                <dd>
                  <span className="mobile-info-sheet__metric-value">
                    {formatPlanetMetricValue(planet.distanceFromSunAU, "AU")}
                  </span>
                  <span className="mobile-info-sheet__metric-note">
                    {describeDistance(planet.distanceFromSunAU)}
                  </span>
                </dd>
              </div>
              <div>
                <dt>공전</dt>
                <dd>
                  <span className="mobile-info-sheet__metric-value">
                    {formatPlanetMetricValue(planet.orbitalPeriodDays, "일")}
                  </span>
                  <span className="mobile-info-sheet__metric-note">
                    {describeOrbitalPeriod(planet.orbitalPeriodDays)}
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          <PlanetImageAttribution planet={planet} />
        </div>
      ) : (
        <div className="mobile-info-sheet__content mobile-info-sheet__content--empty">
          <p className="mobile-info-sheet__eyebrow">행성 탐색</p>
          <h2 className="mobile-info-sheet__title">아래에서 바로 확인해요</h2>
          <p className="mobile-info-sheet__summary">
            행성을 선택하면 숫자와 쉬운 설명, 그리고 살펴볼 점을 바로 보여줍니다.
          </p>
          <p className="mobile-info-sheet__hint">
            먼저 수성이나 지구를 눌러 보고, 시간 조절도 함께 바꿔 보세요.
          </p>
        </div>
      )}
    </aside>
  );
}
