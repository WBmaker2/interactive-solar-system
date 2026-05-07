import type { PlanetRecord } from "../../types/solar-system";
import PlanetFacts from "./PlanetFacts";
import PlanetImageAttribution from "./PlanetImageAttribution";
import PlanetMetrics from "./PlanetMetrics";

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

          <PlanetFacts
            className="mobile-info-sheet__facts-section"
            planet={planet}
            title="먼저 살펴볼 점"
          />

          <p className="mobile-info-sheet__next">{planet.nextExplorationPrompt}</p>

          <PlanetMetrics planet={planet} />

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
