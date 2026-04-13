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
  summary: string;
  facts: string[];
  nextExplorationPrompt: string;
}

export interface ComparisonRow {
  id: PlanetId;
  label: string;
  value: number;
}

