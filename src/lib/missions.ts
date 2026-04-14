import type {
  MissionDefinition,
  MissionEvaluationContext,
  MissionEvaluationResult,
} from "../types/solar-system";

export function evaluateMission(
  mission: MissionDefinition,
  context: MissionEvaluationContext,
): MissionEvaluationResult {
  const isComplete = context.selectedPlanetId === mission.targetPlanetId;

  return {
    isComplete,
    progress: isComplete ? 1 : 0,
  };
}
