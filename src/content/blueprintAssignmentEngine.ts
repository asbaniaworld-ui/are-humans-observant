import type { BlueprintCategory, BlueprintTheme } from './types';

export interface BlueprintAssignmentRules {
  /** Number of experiment levels (default 13). */
  experimentCount?: number;
  /** Blueprint id pinned to the final level (protocol finale). */
  finalBlueprintId?: string;
}

const DEFAULT_RULES: Required<BlueprintAssignmentRules> = {
  experimentCount: 13,
  finalBlueprintId: 'bp-calibration-focus',
};

/** Campaign phase target for experiment level index (0–12). */
export function targetPhaseForLevel(level: number): 1 | 2 | 3 | 4 {
  if (level <= 2) return 1;
  if (level <= 5) return 2;
  if (level <= 9) return 3;
  return 4;
}

/** Preferred difficulty tier for experiment level — ramps across the campaign. */
export function targetDifficultyForLevel(level: number): 1 | 2 | 3 | 4 | 5 {
  if (level <= 1) return 1;
  if (level <= 3) return 2;
  if (level <= 6) return 3;
  if (level <= 10) return 4;
  return 5;
}

function scoreBlueprint(
  bp: BlueprintTheme,
  level: number,
  targetPhase: number,
  targetDifficulty: number,
  prevCategory: BlueprintCategory | null,
): number {
  let score = (bp.assignmentPriority ?? 0) * 1000;
  score -= Math.abs(bp.phase - targetPhase) * 40;
  score -= Math.abs(bp.difficultyTier - targetDifficulty) * 25;
  score -= Math.abs(bp.estimatedComplexity - targetDifficulty) * 10;
  if (prevCategory && bp.category === prevCategory) score -= 500;
  if (bp.puzzleIndex === level) score += 200;
  return score;
}

/**
 * Data-driven experiment → blueprint assignment.
 * Rules: unique blueprints, no consecutive duplicate category, phase + difficulty ramp,
 * puzzleIndex must match level (preserves existing SVG puzzle mapping).
 */
export function buildExperimentAssignments(
  library: BlueprintTheme[],
  rules: BlueprintAssignmentRules = {},
): string[] {
  const { experimentCount, finalBlueprintId } = { ...DEFAULT_RULES, ...rules };
  const used = new Set<string>();
  const result: string[] = [];
  let prevCategory: BlueprintCategory | null = null;

  for (let level = 0; level < experimentCount; level++) {
    if (level === experimentCount - 1 && finalBlueprintId) {
      const finale = library.find((b) => b.id === finalBlueprintId);
      if (!finale) throw new Error(`Final blueprint not found: ${finalBlueprintId}`);
      if (finale.puzzleIndex !== level) {
        throw new Error(`Final blueprint puzzleIndex must be ${level}, got ${finale.puzzleIndex}`);
      }
      result.push(finalBlueprintId);
      used.add(finalBlueprintId);
      break;
    }

    const targetPhase = targetPhaseForLevel(level);
    const targetDifficulty = targetDifficultyForLevel(level);

    let pool = library.filter(
      (bp) => !used.has(bp.id) && bp.puzzleIndex === level && bp.category !== prevCategory,
    );
    if (pool.length === 0) {
      pool = library.filter((bp) => !used.has(bp.id) && bp.puzzleIndex === level);
    }
    if (pool.length === 0) {
      throw new Error(
        `Blueprint assignment failed at level ${level}: no unused blueprint with puzzleIndex ${level}`,
      );
    }

    pool.sort(
      (a, b) =>
        scoreBlueprint(b, level, targetPhase, targetDifficulty, prevCategory) -
        scoreBlueprint(a, level, targetPhase, targetDifficulty, prevCategory),
    );

    const picked = pool[0]!;
    result.push(picked.id);
    used.add(picked.id);
    prevCategory = picked.category;
  }

  return result;
}

export function validateAssignmentIds(library: BlueprintTheme[], ids: string[]): boolean {
  if (ids.length === 0) return false;
  const byId = Object.fromEntries(library.map((b) => [b.id, b]));
  let prev: BlueprintCategory | null = null;
  const seen = new Set<string>();

  for (let level = 0; level < ids.length; level++) {
    const id = ids[level];
    if (seen.has(id)) return false;
    seen.add(id);
    const bp = byId[id];
    if (!bp) return false;
    if (bp.puzzleIndex !== level) return false;
    if (bp.category === prev) return false;
    prev = bp.category;
  }
  return true;
}

export function getBlueprintsByCategory(library: BlueprintTheme[]): Record<BlueprintCategory, BlueprintTheme[]> {
  const grouped = {} as Record<BlueprintCategory, BlueprintTheme[]>;
  for (const bp of library) {
    if (!grouped[bp.category]) grouped[bp.category] = [];
    grouped[bp.category].push(bp);
  }
  return grouped;
}

export function getBlueprintsByPhase(library: BlueprintTheme[], phase: 1 | 2 | 3 | 4): BlueprintTheme[] {
  return library.filter((bp) => bp.phase === phase);
}

export function getUnassignedBlueprints(library: BlueprintTheme[], assignedIds: string[]): BlueprintTheme[] {
  const used = new Set(assignedIds);
  return library.filter((bp) => !used.has(bp.id));
}
