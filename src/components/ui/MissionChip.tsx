interface MissionChipProps {
  label: string;
  active?: boolean;
}

export default function MissionChip({ label, active = false }: MissionChipProps) {
  return (
    <span className={`mission-chip${active ? " mission-chip--active" : ""}`}>
      {label}
    </span>
  );
}
