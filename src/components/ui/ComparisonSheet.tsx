import { useEffect, useRef } from "react";

import { buildComparisonRows } from "../../lib/comparisons";
import type {
  ComparisonMode,
  PlanetRecord,
} from "../../types/solar-system";

interface ComparisonSheetProps {
  isOpen: boolean;
  mode: ComparisonMode;
  planets: PlanetRecord[];
  onClose: () => void;
  onModeChange: (mode: ComparisonMode) => void;
}

function formatValue(value: number) {
  const rounded = value.toFixed(2);
  return rounded.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function getModeLabel(mode: ComparisonMode) {
  return mode === "size" ? "크기 비교" : "거리 비교";
}

export default function ComparisonSheet({
  isOpen,
  mode,
  planets,
  onClose,
  onModeChange,
}: ComparisonSheetProps) {
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const rows = buildComparisonRows(planets, mode);
  const maxValue = rows.reduce((maximum, row) => Math.max(maximum, row.value), 0) || 1;
  const activeLabel = getModeLabel(mode);

  return (
    <aside
      aria-label="태양계 비교 보기"
      aria-modal="true"
      className="comparison-sheet"
      ref={dialogRef}
      role="dialog"
    >
      <div className="comparison-sheet__scrim" onClick={onClose} aria-hidden="true" />

      <section className="comparison-sheet__panel" aria-label={activeLabel}>
        <header className="comparison-sheet__header">
          <div className="comparison-sheet__heading">
            <p className="comparison-sheet__eyebrow">비교 보기</p>
            <h2>{activeLabel}</h2>
            <p className="comparison-sheet__lead">
              행성들을 큰 순서, 또는 태양과 먼 순서로 나란히 살펴보세요.
            </p>
          </div>

          <button
            type="button"
            className="comparison-sheet__close"
            onClick={onClose}
            ref={closeButtonRef}
          >
            닫기
          </button>
        </header>

        <div
          className="comparison-sheet__tabs"
          role="tablist"
          aria-label="비교 기준"
        >
          {(["size", "distance"] as ComparisonMode[]).map((nextMode) => {
            const selected = nextMode === mode;

            return (
              <button
                key={nextMode}
                type="button"
                className="comparison-sheet__tab"
                aria-selected={selected}
                role="tab"
                onClick={() => onModeChange(nextMode)}
              >
                {getModeLabel(nextMode)}
              </button>
            );
          })}
        </div>

        <div className="comparison-sheet__body" role="tabpanel" aria-label={activeLabel}>
          <ol className="comparison-sheet__list">
            {rows.map((row, index) => {
              const percentage = (row.value / maxValue) * 100;
              const valueLabel =
                mode === "size"
                  ? `지구의 ${formatValue(row.value)}배`
                  : `${formatValue(row.value)} AU`;

              return (
                <li key={row.id} className="comparison-sheet__row">
                  <div className="comparison-sheet__row-meta">
                    <span className="comparison-sheet__rank">{index + 1}</span>
                    <span className="comparison-sheet__label">{row.label}</span>
                    <span className="comparison-sheet__value">{valueLabel}</span>
                  </div>

                  <div className="comparison-sheet__track" aria-hidden="true">
                    <span
                      className="comparison-sheet__fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </aside>
  );
}
