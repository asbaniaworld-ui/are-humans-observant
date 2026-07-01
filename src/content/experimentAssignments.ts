import { BLUEPRINT_BY_ID, BLUEPRINT_LIBRARY } from './blueprintLibrary';
import {
  getActiveBlueprintId,
  getActiveExperimentRun,
  getActivePuzzleIndex,
  initExperimentRun,
  validateActiveExperimentRun,
  buildRandomExperimentRun,
  validateExperimentRunPlan,
} from './experimentRun';
import {
  getUnassignedBlueprints,
  getBlueprintsByCategory,
  getBlueprintsByPhase,
} from './blueprintAssignmentEngine';
import type { BlueprintCategory, BlueprintTheme } from './types';
import { CATEGORY_LABELS } from './types';

export {
  initExperimentRun,
  getActiveExperimentRun,
  buildRandomExperimentRun,
  validateExperimentRunPlan,
  validateActiveExperimentRun,
};

/** @deprecated Use getActiveExperimentRun().blueprintIds — kept for compatibility. */
export function getExperimentBlueprintIds(): string[] {
  return getActiveExperimentRun().blueprintIds;
}

export function validateExperimentAssignments(): boolean {
  return validateActiveExperimentRun();
}

export function getExperimentBlueprint(level: number): BlueprintTheme {
  const id = getActiveBlueprintId(level);
  return BLUEPRINT_BY_ID[id]!;
}

export function getExperimentPuzzleIndex(level: number): number {
  return getActivePuzzleIndex(level);
}

export function getCategoryLabel(category: BlueprintCategory): string {
  return CATEGORY_LABELS[category];
}

export function getSupplementaryBlueprints(): BlueprintTheme[] {
  return getUnassignedBlueprints(BLUEPRINT_LIBRARY, getActiveExperimentRun().blueprintIds);
}

export {
  getBlueprintsByCategory,
  getBlueprintsByPhase,
  getUnassignedBlueprints,
};
