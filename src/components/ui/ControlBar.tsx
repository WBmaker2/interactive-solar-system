import type { ComparisonMode } from "../../types/solar-system";

interface ControlBarProps {
  isPlaying: boolean;
  speedMultiplier: number;
  onTogglePlaying: () => void;
  onSpeedChange: (speedMultiplier: number) => void;
  onReset: () => void;
  onOpenComparison: (mode: ComparisonMode) => void;
  onOpenMotionGuide: () => void;
}

function formatSpeedValue(value: number) {
  return `x${value}`;
}

export default function ControlBar({
  isPlaying,
  speedMultiplier,
  onTogglePlaying,
  onSpeedChange,
  onReset,
  onOpenComparison,
  onOpenMotionGuide,
}: ControlBarProps) {
  return (
    <footer className="control-bar" aria-label="태양계 조작 바">
      <div className="control-bar__actions">
        <button
          type="button"
          className="control-bar__button control-bar__button--primary"
          onClick={onTogglePlaying}
        >
          {isPlaying ? "일시정지" : "재생"}
        </button>

        <button
          type="button"
          className="control-bar__button"
          onClick={onReset}
        >
          초기화
        </button>

        <button
          type="button"
          className="control-bar__button"
          onClick={() => onOpenComparison("size")}
        >
          비교 보기
        </button>

        <button
          type="button"
          className="control-bar__button"
          onClick={onOpenMotionGuide}
        >
          자전과 공전
        </button>
      </div>

      <label className="speed-control" htmlFor="time-speed">
        <span className="speed-control__label">시간 빨리 감기</span>
        <span className="speed-control__value">{formatSpeedValue(speedMultiplier)}</span>
        <input
          id="time-speed"
          aria-label="시간 빨리 감기"
          className="speed-control__input"
          min="1"
          max="20"
          step="1"
          type="range"
          value={speedMultiplier}
          onChange={(event) => onSpeedChange(Number(event.currentTarget.value))}
        />
      </label>
    </footer>
  );
}
