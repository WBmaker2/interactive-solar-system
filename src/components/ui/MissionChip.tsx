import type { MissionCompletionExplanation } from "../../types/solar-system";

interface MissionChipProps {
  label: string;
  hint?: string;
  status?: "active" | "completed";
  explanation?: MissionCompletionExplanation;
}

const statusLabels = {
  active: "진행 중",
  completed: "완료",
};

export default function MissionChip({
  label,
  hint,
  status = "active",
  explanation,
}: MissionChipProps) {
  const showExplanation = status === "completed" && explanation;
  const showHint = status === "active" && hint;

  return (
    <div className={`mission-chip mission-chip--${status}`}>
      <span className="mission-chip__status">{statusLabels[status]}</span>
      <span className="mission-chip__label">{label}</span>

      {showHint ? (
        <p className="mission-chip__hint">
          <span className="mission-chip__hint-label">힌트</span>
          <span className="mission-chip__hint-text">{hint}</span>
        </p>
      ) : null}

      {showExplanation ? (
        <dl className="mission-chip__explanation" aria-label="미션 정답 설명">
          <div className="mission-chip__explanation-row">
            <dt className="mission-chip__explanation-term">정답</dt>
            <dd className="mission-chip__explanation-detail">{explanation.answer}</dd>
          </div>
          <div className="mission-chip__explanation-row">
            <dt className="mission-chip__explanation-term">왜 그럴까요?</dt>
            <dd className="mission-chip__explanation-detail">{explanation.reason}</dd>
          </div>
          <div className="mission-chip__explanation-row">
            <dt className="mission-chip__explanation-term">헷갈리기 쉬운 점</dt>
            <dd className="mission-chip__explanation-detail">{explanation.caution}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
