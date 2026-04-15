import { useEffect, useRef } from "react";

import type { PlanetRecord } from "../../types/solar-system";

interface MotionGuideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planet: PlanetRecord | null;
}

function getContextMessage(planet: PlanetRecord | null) {
  if (!planet) {
    return "메인 화면은 행성이 태양 주위를 도는 공전을 중심으로 보여줘요.";
  }

  if (planet.id === "earth") {
    return "지구는 자전으로 낮과 밤이 생기고, 공전으로 1년이 생겨요.";
  }

  return `${planet.nameKo}도 스스로 돌고, 태양 주위를 돌아요. 메인 화면에서는 이 공전을 더 크게 보고 있어요.`;
}

export default function MotionGuideDialog({
  isOpen,
  onClose,
  planet,
}: MotionGuideDialogProps) {
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

  return (
    <aside
      aria-label="자전과 공전"
      aria-modal="true"
      className="motion-guide"
      ref={dialogRef}
      role="dialog"
    >
      <div className="motion-guide__scrim" onClick={onClose} aria-hidden="true" />

      <section className="motion-guide__panel">
        <header className="motion-guide__header">
          <div className="motion-guide__heading">
            <p className="motion-guide__eyebrow">과학 개념</p>
            <h2>자전과 공전</h2>
            <p className="motion-guide__lead">
              둘 다 도는 움직임이지만, 어디를 기준으로 도는지가 달라요.
            </p>
          </div>

          <button
            type="button"
            className="motion-guide__close"
            onClick={onClose}
            ref={closeButtonRef}
          >
            닫기
          </button>
        </header>

        <div className="motion-guide__cards">
          <article className="motion-guide__card">
            <div className="motion-guide__visual motion-guide__visual--spin" aria-hidden="true">
              <span className="motion-guide__planet" />
              <span className="motion-guide__axis" />
            </div>
            <h3>자전</h3>
            <p>행성이 스스로 도는 것</p>
          </article>

          <article className="motion-guide__card">
            <div className="motion-guide__visual motion-guide__visual--orbit" aria-hidden="true">
              <span className="motion-guide__sun" />
              <span className="motion-guide__orbit-ring" />
              <span className="motion-guide__orbit-planet" />
            </div>
            <h3>공전</h3>
            <p>행성이 태양 주위를 도는 것</p>
          </article>
        </div>

        <p className="motion-guide__context">{getContextMessage(planet)}</p>
      </section>
    </aside>
  );
}
