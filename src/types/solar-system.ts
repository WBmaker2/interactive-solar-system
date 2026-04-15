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
export type SizeComparisonPresetId =
  | "earth-venus"
  | "earth-jupiter"
  | "rocky-planets"
  | "outer-giants";
export type MissionGoalType = "selectPlanet";

export interface MissionCompletionExplanation {
  answer: string;
  reason: string;
  caution: string;
}

export interface MissionDefinition {
  id: string;
  goalType: MissionGoalType;
  prompt: string;
  hint: string;
  completionExplanation: MissionCompletionExplanation;
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

export interface SizeComparisonPreset {
  id: SizeComparisonPresetId;
  label: string;
  planetIds: PlanetId[];
  caption: string;
}

export interface SizeComparisonSpotlightPlanet {
  id: PlanetId;
  label: string;
  color: string;
  diameterEarths: number;
  scalePercentage: number;
}

export interface SizeComparisonSpotlight {
  caption: string;
  planets: SizeComparisonSpotlightPlanet[];
}
