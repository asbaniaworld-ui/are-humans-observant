import { BLUEPRINT_LIBRARY } from './blueprintLibrary';
import {
  buildRandomExperimentRun,
  type ExperimentRunPlan,
  validateExperimentRunPlan,
} from './experimentRunPlanner';

let activeRun: ExperimentRunPlan | null = null;

/** Initialize a new per-playthrough blueprint assignment (call on new game). */
export function initExperimentRun(seed?: number): ExperimentRunPlan {
  activeRun = buildRandomExperimentRun(BLUEPRINT_LIBRARY, { seed });
  return activeRun;
}

/** Active run plan, or a freshly generated default if none exists yet. */
export function getActiveExperimentRun(): ExperimentRunPlan {
  if (!activeRun) {
    activeRun = buildRandomExperimentRun(BLUEPRINT_LIBRARY);
  }
  return activeRun;
}

export function getActiveBlueprintId(level: number): string {
  const run = getActiveExperimentRun();
  return run.blueprintIds[level] ?? run.blueprintIds[0]!;
}

export function getActivePuzzleIndex(level: number): number {
  const run = getActiveExperimentRun();
  return run.puzzleIndices[level] ?? 0;
}

export function validateActiveExperimentRun(): boolean {
  return validateExperimentRunPlan(BLUEPRINT_LIBRARY, getActiveExperimentRun());
}

export { buildRandomExperimentRun, validateExperimentRunPlan, type ExperimentRunPlan };
