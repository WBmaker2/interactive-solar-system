import type { PlanetRecord } from "../../types/solar-system";

interface PlanetInfoPanelProps {
  planet: PlanetRecord | null;
}

function formatValue(value: number) {
  const rounded = value.toFixed(2);
  return rounded.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

export default function PlanetInfoPanel({ planet }: PlanetInfoPanelProps) {
  return (
    <aside aria-label="행성 정보 패널" className="info-panel">
      {planet ? (
        <div className="info-panel__content">
          <header className="info-panel__header">
            <p className="info-panel__eyebrow">행성 탐색</p>
            <h2 className="info-panel__title">{planet.nameKo}</h2>
            <p className="info-panel__subtitle">{planet.nameEn}</p>
          </header>

          <figure className="info-panel__figure">
            <img
              alt={`${planet.nameKo}의 실제 모습`}
              className="info-panel__image"
              src={planet.imageSrc}
            />
          </figure>

          <p className="info-panel__summary">{planet.summary}</p>

          <section aria-label="기초 수치">
            <h3 className="info-panel__section-title">기초 수치</h3>
            <dl className="info-panel__metrics">
              <div>
                <dt>크기</dt>
                <dd>지구의 {formatValue(planet.diameterEarths)}배</dd>
              </div>
              <div>
                <dt>태양과의 거리</dt>
                <dd>{formatValue(planet.distanceFromSunAU)} AU</dd>
              </div>
              <div>
                <dt>공전</dt>
                <dd>{formatValue(planet.orbitalPeriodDays)}일</dd>
              </div>
            </dl>
          </section>

          <section className="info-panel__facts" aria-label="행성 특징">
            <h3 className="info-panel__section-title">이런 점을 살펴보세요</h3>
            <ul>
              {planet.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </section>

          <section className="info-panel__next" aria-label="다음 탐색 안내">
            <h3 className="info-panel__section-title">다음 탐색</h3>
            <p>{planet.nextExplorationPrompt}</p>
          </section>
        </div>
      ) : (
        <div className="info-panel__empty">
          <p className="info-panel__eyebrow">행성 탐색</p>
          <h2 className="info-panel__title">행성을 눌러 보세요</h2>
          <p className="info-panel__summary">
            아직 선택된 행성이 없습니다. 태양계 무대에서 행성을 클릭하면 크기,
            거리, 공전 정보를 한 번에 볼 수 있습니다.
          </p>
          <p className="info-panel__empty-hint">
            먼저 수성이나 지구를 눌러 보고, 아래 조작 바에서 시간을 빠르게
            바꿔 보세요.
          </p>
        </div>
      )}
    </aside>
  );
}
