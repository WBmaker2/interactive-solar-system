import type { PlanetRecord } from "../../types/solar-system";
import PlanetFacts from "./PlanetFacts";
import PlanetImageAttribution from "./PlanetImageAttribution";
import PlanetMetrics from "./PlanetMetrics";

interface PlanetInfoPanelProps {
  planet: PlanetRecord | null;
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
            <figcaption className="info-panel__figure-caption">
              <PlanetImageAttribution planet={planet} />
            </figcaption>
          </figure>

          <p className="info-panel__summary">{planet.summary}</p>

          <PlanetFacts
            className="info-panel__facts"
            planet={planet}
            title="이런 점을 살펴보세요"
          />

          <section className="info-panel__next" aria-label="다음 탐색 안내">
            <h3 className="info-panel__section-title">다음 관찰 포인트</h3>
            <p>{planet.nextExplorationPrompt}</p>
          </section>

          <PlanetMetrics planet={planet} />
        </div>
      ) : (
        <div className="info-panel__empty">
          <p className="info-panel__eyebrow">행성 탐색</p>
          <h2 className="info-panel__title">행성을 눌러 보세요</h2>
          <p className="info-panel__summary">
            아직 선택된 행성이 없습니다. 행성을 누르면 숫자와 쉬운 설명을 함께
            볼 수 있어요.
          </p>
          <p className="info-panel__empty-hint">
            먼저 수성이나 지구를 눌러 보고, 아래 조작 바에서 시간을 바꿔 가며
            다시 살펴보세요.
          </p>
        </div>
      )}
    </aside>
  );
}
