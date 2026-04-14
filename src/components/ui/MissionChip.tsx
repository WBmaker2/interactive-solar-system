interface MissionChipProps {
  label: string;
  status?: "active" | "completed";
}

const statusLabels = {
  active: "진행 중",
  completed: "완료",
};

export default function MissionChip({ label, status = "active" }: MissionChipProps) {
  return (
    <div className={`mission-chip mission-chip--${status}`}>
      <span className="mission-chip__status">{statusLabels[status]}</span>
      <span className="mission-chip__label">{label}</span>
    </div>
  );
}
