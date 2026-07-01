import { getActiveBlueprintId } from './experimentRun';
import { getExperimentBlueprint } from './experimentAssignments';
import type { ExperimentRecord, ResearchBoardNodeStatus, ResearchDepartment } from './types';

export const RESEARCH_DEPARTMENTS: ResearchDepartment[] = [
  {
    id: 'foundation_calibration',
    title: 'FOUNDATION CALIBRATION',
    subtitle: '基础校准部',
    experimentLevels: [0, 1, 2],
    classificationLabel: 'DEPT-A // CLASS 2',
    annotation: '突触对齐 · 视神经基准线已建立。优先完成义肢接口与光学追踪。',
    nodePositions: [
      { level: 0, x: 18, y: 38, rotation: -4 },
      { level: 1, x: 48, y: 32, rotation: 2 },
      { level: 2, x: 78, y: 40, rotation: -2 },
    ],
  },
  {
    id: 'biological_observation',
    title: 'BIOLOGICAL OBSERVATION',
    subtitle: '生物观测部',
    experimentLevels: [3, 4, 5],
    classificationLabel: 'DEPT-B // NEURAL',
    annotation: '脑波遥测区。注意梦境记录仪与记忆重建仪的交叉污染。',
    nodePositions: [
      { level: 3, x: 20, y: 42, rotation: 3 },
      { level: 4, x: 50, y: 35, rotation: -3 },
      { level: 5, x: 80, y: 44, rotation: 1 },
    ],
  },
  {
    id: 'infrastructure_analysis',
    title: 'INFRASTRUCTURE ANALYSIS',
    subtitle: '基础设施分析部',
    experimentLevels: [6, 7, 8, 9],
    classificationLabel: 'DEPT-C // SYSTEMS',
    annotation: '概率引擎 → 大气管理局 → 世界模拟。宏观系统链式验证。',
    nodePositions: [
      { level: 6, x: 14, y: 38, rotation: -2 },
      { level: 7, x: 38, y: 32, rotation: 4 },
      { level: 8, x: 62, y: 40, rotation: -3 },
      { level: 9, x: 86, y: 36, rotation: 2 },
    ],
  },
  {
    id: 'identity_verification',
    title: 'IDENTITY VERIFICATION',
    subtitle: '身份验证部',
    experimentLevels: [10, 11, 12],
    classificationLabel: 'DEPT-D // STRICT 1A',
    annotation: '终极协议。镜像主体档案与 #402 海洋卷宗 — 禁止跳过任何节点。',
    nodePositions: [
      { level: 10, x: 22, y: 40, rotation: -5 },
      { level: 11, x: 52, y: 34, rotation: 3 },
      { level: 12, x: 82, y: 42, rotation: -1 },
    ],
  },
];

/** Red-string connection pairs (level → level) within and across departments. */
export const RESEARCH_BOARD_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12],
];

export function getUnlockedDepartmentCount(completedPhase: number): number {
  return Math.min(4, Math.max(1, completedPhase + 1));
}

export function getDepartmentForLevel(level: number): ResearchDepartment {
  return RESEARCH_DEPARTMENTS.find((d) => d.experimentLevels.includes(level))!;
}

export function getDepartmentIndex(deptId: string): number {
  return RESEARCH_DEPARTMENTS.findIndex((d) => d.id === deptId);
}

export function isLevelVerified(level: number, foundDiffs: Record<number, number[]>): boolean {
  return (foundDiffs[level]?.length ?? 0) >= 5;
}

export function getNodeStatus(
  level: number,
  completedPhase: number,
  currentLevel: number,
  foundDiffs: Record<number, number[]>,
): ResearchBoardNodeStatus {
  const dept = getDepartmentForLevel(level);
  const deptIdx = getDepartmentIndex(dept.id);
  const unlockedDepts = getUnlockedDepartmentCount(completedPhase);

  if (deptIdx >= unlockedDepts) return 'department_locked';
  if (isLevelVerified(level, foundDiffs)) return 'verified';
  if (level <= currentLevel) return 'available';
  return 'locked';
}

export function getArchiveEntryIdForLevel(level: number): string {
  const bpId = getActiveBlueprintId(level);
  return `unlocked-bp-${bpId}`;
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function getResearcherBoardComment(completedPhase: number): string {
  switch (completedPhase) {
    case 1:
      return '「基础校准部的三份蓝图已全部钉上规划墙。你的观察轨迹已被红线串联——生物观测部的档案区现已开放。别盯着字符串看太久，它们会开始自己移动。」';
    case 2:
      return '「生物观测序列验证完毕。基础设施分析部的节点刚刚解除封条——概率引擎与世界模拟舱的耦合比预期更紧。我在镜像节点旁留了一则手写警告。」';
    case 3:
      return '「系统链已闭合至身份验证部。最后一排蓝图使用 1A 密级图钉固定。主体 #402，规划墙上的红线现在全部指向你。」';
    default:
      return '「规划墙已同步至最新校准状态。继续按序列推进。」';
  }
}

export function getExperimentTitle(level: number): string {
  return getExperimentBlueprint(level).title;
}

export function getStatusLabel(status: ResearchBoardNodeStatus): string {
  switch (status) {
    case 'verified':
      return '✓ VERIFIED';
    case 'available':
      return 'UNLOCKED // ACTIVE';
    case 'locked':
      return 'SCHEDULED // LOCKED';
    case 'department_locked':
      return 'Research Department Locked';
  }
}

export interface BoardNodeViewModel {
  level: number;
  x: number;
  y: number;
  rotation: number;
  status: ResearchBoardNodeStatus;
  title: string;
  experimentLabel: string;
  record?: ExperimentRecord;
}

export function buildBoardNodes(
  completedPhase: number,
  currentLevel: number,
  foundDiffs: Record<number, number[]>,
  records: Record<number, ExperimentRecord>,
): BoardNodeViewModel[] {
  const nodes: BoardNodeViewModel[] = [];
  for (const dept of RESEARCH_DEPARTMENTS) {
    for (const pos of dept.nodePositions) {
      nodes.push({
        level: pos.level,
        x: pos.x,
        y: pos.y,
        rotation: pos.rotation,
        status: getNodeStatus(pos.level, completedPhase, currentLevel, foundDiffs),
        title: getExperimentTitle(pos.level),
        experimentLabel: `EXP ${String(pos.level + 1).padStart(2, '0')}`,
        record: records[pos.level],
      });
    }
  }
  return nodes;
}

/** Global % position for red-string endpoints (approximate board layout). */
export function getGlobalNodePosition(level: number): { x: number; y: number } {
  const deptIdx = RESEARCH_DEPARTMENTS.findIndex((d) => d.experimentLevels.includes(level));
  const dept = RESEARCH_DEPARTMENTS[deptIdx];
  const pos = dept.nodePositions.find((p) => p.level === level)!;
  const col = deptIdx % 2;
  const row = Math.floor(deptIdx / 2);
  return {
    x: col * 50 + (pos.x / 100) * 48 + 2,
    y: row * 50 + (pos.y / 100) * 46 + 4,
  };
}
