export type PlanetId =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export type ComparisonMode = "size" | "distance";
export type MissionGoalType = "selectPlanet";

export interface MissionDefinition {
  id: string;
  goalType: MissionGoalType;
  prompt: string;
  hint: string;
  targetPlanetId: PlanetId;
}

export interface MissionEvaluationContext {
  selectedPlanetId: PlanetId | null;
}

export interface MissionEvaluationResult {
  isComplete: boolean;
  progress: number;
}

export interface PlanetRecord {
  id: PlanetId;
  nameKo: string;
  nameEn: string;
  color: string;
  orbitRadius: number;
  visualRadius: number;
  orbitalPeriodDays: number;
  distanceFromSunAU: number;
  diameterEarths: number;
  imageSrc: string;
  imageSourceLabel: string;
  imageSourceUrl: string;
  imageCredit: string;
  summary: string;
  facts: string[];
  nextExplorationPrompt: string;
}

export interface ComparisonRow {
  id: PlanetId;
  label: string;
  value: number;
}
