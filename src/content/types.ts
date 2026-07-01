/** Shared content types for the Cognitive Calibration Program #402-B expansion. */

export type BlueprintCategory =
  | 'mechanical_engineering'
  | 'human_anatomy'
  | 'biology'
  | 'architecture'
  | 'astronomy'
  | 'transportation'
  | 'communication'
  | 'weather_systems'
  | 'energy_infrastructure'
  | 'ocean_research'
  | 'future_city'
  | 'archive_documents';

export type DifferenceType =
  | 'missing_element'
  | 'altered_label'
  | 'geometry_shift'
  | 'count_mismatch'
  | 'texture_density'
  | 'pointer_rotation'
  | 'line_interruption'
  | 'symmetry_break'
  | 'gaze_calibration';

export type ArchiveEntryType =
  | 'blueprint'
  | 'document'
  | 'photo'
  | 'transcript'
  | 'experiment_note';

export interface BlueprintTheme {
  id: string;
  title: string;
  phase: 1 | 2 | 3 | 4;
  category: BlueprintCategory;
  description: string;
  visualPrompt: string;
  /** Primary difficulty tier (1–5), increases across campaign phases. */
  difficultyTier: 1 | 2 | 3 | 4 | 5;
  /** Human-readable complexity estimate (defaults to difficultyTier). */
  estimatedComplexity: 1 | 2 | 3 | 4 | 5;
  differenceTypes: DifferenceType[];
  /** Index into existing Puzzle SVG components (0–12). */
  puzzleIndex: number;
  /**
   * Assignment priority when multiple blueprints share a puzzleIndex.
   * Higher wins tie-breaks; canonical campaign blueprints use 100.
   */
  assignmentPriority?: number;
}

export interface InspectableObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  archiveEntryId: string;
  /** Minimal scene marker color accent */
  accent?: string;
}

export interface InterludeScene {
  id: string;
  title: string;
  subtitle: string;
  sectorLabel: string;
  phase: 1 | 2 | 3 | 4;
  worldWidth: number;
  objects: InspectableObject[];
  /** Optional second scene played in sequence (Phase 3 → Workshop then Basement). */
  followUpSceneId?: string;
}

export interface ArchiveEntry {
  id: string;
  type: ArchiveEntryType;
  title: string;
  date: string;
  classification: string;
  body: string;
  /** Archival photo shown in inspect modal (not on schematic map). */
  imageUrl?: string;
  blueprintId?: string;
  sceneId?: string;
  tags?: string[];
}

/** Per-experiment completion stats shown on the Research Board. */
export interface ExperimentRecord {
  accuracy: number;
  durationSec: number;
  completedAt: number;
}

export type ResearchBoardNodeStatus = 'verified' | 'available' | 'locked' | 'department_locked';

export interface ResearchDepartment {
  id: string;
  title: string;
  subtitle: string;
  /** Experiment level indices (0–12) assigned to this department. */
  experimentLevels: number[];
  /** Pin positions on the board wall (% of department panel). */
  nodePositions: { level: number; x: number; y: number; rotation: number }[];
  annotation: string;
  classificationLabel: string;
}

export const CATEGORY_LABELS: Record<BlueprintCategory, string> = {
  mechanical_engineering: '机械工程',
  human_anatomy: '人体解剖',
  biology: '生物学',
  architecture: '建筑学',
  astronomy: '天文学',
  transportation: '交通运输',
  communication: '通信工程',
  weather_systems: '气象系统',
  energy_infrastructure: '能源基础设施',
  ocean_research: '海洋研究',
  future_city: '未来城市',
  archive_documents: '档案文献',
};
