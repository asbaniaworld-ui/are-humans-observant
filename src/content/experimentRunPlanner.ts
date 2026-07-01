import type { BlueprintCategory, BlueprintTheme } from './types';
import { targetPhaseForLevel, targetDifficultyForLevel } from './blueprintAssignmentEngine';

export { targetPhaseForLevel, targetDifficultyForLevel };

/** Preferred categories per campaign observation phase. */
export const PHASE_CATEGORY_PREFERENCES: Record<1 | 2 | 3 | 4, BlueprintCategory[]> = {
  1: [
    'mechanical_engineering',
    'architecture',
    'astronomy',
    'energy_infrastructure',
    'biology',
  ],
  2: [
    'human_anatomy',
    'biology',
    'archive_documents',
    'communication',
    'mechanical_engineering',
  ],
  3: [
    'weather_systems',
    'energy_infrastructure',
    'astronomy',
    'communication',
    'future_city',
    'transportation',
    'architecture',
    'biology',
  ],
  4: [
    'ocean_research',
    'human_anatomy',
    'archive_documents',
    'future_city',
    'transportation',
  ],
};

export interface ExperimentRunPlan {
  blueprintIds: string[];
  /** Visual SVG index per experiment level (shuffled each run for levels 0–11). */
  puzzleIndices: number[];
  seed: number;
}

export interface RandomAssignmentOptions {
  experimentCount?: number;
  finalBlueprintId?: string;
  seed?: number;
}

const DEFAULT_OPTIONS: Required<Pick<RandomAssignmentOptions, 'experimentCount' | 'finalBlueprintId'>> = {
  experimentCount: 13,
  finalBlueprintId: 'bp-calibration-focus',
};

/** Seeded PRNG (mulberry32). */
export function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleWithRng<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function scoreBlueprintForRun(
  bp: BlueprintTheme,
  targetPhase: number,
  targetDifficulty: number,
  prevCategory: BlueprintCategory | null,
  preferredCategories: BlueprintCategory[],
  rng: () => number,
): number {
  let score = 0;
  if (preferredCategories.includes(bp.category)) score += 120;
  score -= Math.abs(bp.phase - targetPhase) * 45;
  score -= Math.abs(bp.difficultyTier - targetDifficulty) * 28;
  score -= Math.abs(bp.estimatedComplexity - targetDifficulty) * 12;
  if (prevCategory && bp.category === prevCategory) score -= 600;
  score += rng() * 40;
  return score;
}

function pickBlueprintForLevel(
  library: BlueprintTheme[],
  usedIds: Set<string>,
  level: number,
  prevCategory: BlueprintCategory | null,
  rng: () => number,
  excludeId?: string,
): BlueprintTheme | null {
  const targetPhase = targetPhaseForLevel(level);
  const targetDifficulty = targetDifficultyForLevel(level);
  const preferred = PHASE_CATEGORY_PREFERENCES[targetPhase];

  const base = library.filter((bp) => !usedIds.has(bp.id) && bp.id !== excludeId);

  const attempts: Array<(bp: BlueprintTheme) => boolean> = [
    (bp) => preferred.includes(bp.category) && bp.category !== prevCategory,
    (bp) => preferred.includes(bp.category),
    (bp) => bp.phase === targetPhase && bp.category !== prevCategory,
    (bp) => bp.phase === targetPhase,
    (bp) => Math.abs(bp.phase - targetPhase) <= 1 && bp.category !== prevCategory,
    (bp) => bp.category !== prevCategory,
    () => true,
  ];

  for (const filter of attempts) {
    const pool = base.filter(filter);
    if (pool.length === 0) continue;
    pool.sort(
      (a, b) =>
        scoreBlueprintForRun(b, targetPhase, targetDifficulty, prevCategory, preferred, rng) -
        scoreBlueprintForRun(a, targetPhase, targetDifficulty, prevCategory, preferred, rng),
    );
    return pool[0]!;
  }

  return null;
}

/**
 * Random per-run experiment plan.
 * - Unique blueprint per level
 * - No consecutive duplicate category
 * - Phase / difficulty weighted selection with fallback
 * - Shuffled puzzle visuals (0–11) so illustration art changes each run
 * - Final level pinned to calibration finale visual (puzzle 12)
 */
export function buildRandomExperimentRun(
  library: BlueprintTheme[],
  options: RandomAssignmentOptions = {},
): ExperimentRunPlan {
  const { experimentCount, finalBlueprintId } = { ...DEFAULT_OPTIONS, ...options };
  const seed = options.seed ?? (Date.now() ^ (Math.random() * 0x7fffffff)) >>> 0;
  const rng = createRng(seed);

  const finale = library.find((b) => b.id === finalBlueprintId);
  if (!finale) throw new Error(`Final blueprint not found: ${finalBlueprintId}`);

  const blueprintIds: string[] = new Array(experimentCount);
  const puzzleIndices: number[] = new Array(experimentCount);
  const usedIds = new Set<string>();

  const visualSlots = shuffleWithRng(
    Array.from({ length: experimentCount - 1 }, (_, i) => i),
    rng,
  );

  let prevCategory: BlueprintCategory | null = null;

  for (let level = 0; level < experimentCount - 1; level++) {
    const picked = pickBlueprintForLevel(library, usedIds, level, prevCategory, rng, finalBlueprintId);
    if (!picked) {
      throw new Error(`Random blueprint assignment failed at level ${level}: pool exhausted`);
    }
    blueprintIds[level] = picked.id;
    puzzleIndices[level] = visualSlots[level]!;
    usedIds.add(picked.id);
    prevCategory = picked.category;
  }

  blueprintIds[experimentCount - 1] = finalBlueprintId;
  puzzleIndices[experimentCount - 1] = finale.puzzleIndex;
  usedIds.add(finalBlueprintId);

  return { blueprintIds, puzzleIndices, seed };
}

export function validateExperimentRunPlan(
  library: BlueprintTheme[],
  plan: ExperimentRunPlan,
): boolean {
  if (plan.blueprintIds.length !== plan.puzzleIndices.length || plan.blueprintIds.length === 0) {
    return false;
  }

  const byId = Object.fromEntries(library.map((b) => [b.id, b]));
  const seenIds = new Set<string>();
  let prev: BlueprintCategory | null = null;

  const finaleIdx = plan.blueprintIds.length - 1;
  const visuals = plan.puzzleIndices.slice(0, finaleIdx);
  const uniqueVisuals = new Set(visuals);
  if (uniqueVisuals.size !== visuals.length) return false;

  for (let level = 0; level < plan.blueprintIds.length; level++) {
    const id = plan.blueprintIds[level];
    if (seenIds.has(id)) return false;
    seenIds.add(id);
    const bp = byId[id];
    if (!bp) return false;
    if (level < finaleIdx && bp.category === prev) return false;
    prev = bp.category;
  }

  return plan.puzzleIndices[finaleIdx] === 12;
}
