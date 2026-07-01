import { useCallback, useMemo, useState } from 'react';
import { ARCHIVE_BY_ID } from '../content/archiveCatalog';
import { BLUEPRINT_BY_ID } from '../content/blueprintLibrary';
import type { ArchiveEntry, ArchiveEntryType } from '../content/types';

const ARCHIVE_TYPE_LABELS: Record<ArchiveEntryType, string> = {
  blueprint: '蓝图',
  document: '文献',
  photo: '照片',
  transcript: '音频转写',
  experiment_note: '实验笔记',
};

function blueprintToArchiveEntry(blueprintId: string): ArchiveEntry | null {
  const bp = BLUEPRINT_BY_ID[blueprintId];
  if (!bp) return null;
  return {
    id: `unlocked-bp-${blueprintId}`,
    type: 'blueprint',
    title: bp.title,
    date: '1968-06-25',
    classification: `BLUEPRINT // ${bp.category.toUpperCase().replace(/_/g, '-')}`,
    body: `${bp.description}\n\n视觉提示：${bp.visualPrompt}\n\n难度层级：${bp.difficultyTier} | 差异类型：${bp.differenceTypes.join(', ')}`,
    blueprintId,
    tags: [bp.category],
  };
}

export interface ResearchArchiveState {
  unlockedIds: Set<string>;
  unlockEntry: (entryId: string) => void;
  unlockBlueprint: (blueprintId: string) => void;
  unlockExperimentBlueprint: (level: number, blueprintId: string) => void;
  isUnlocked: (entryId: string) => boolean;
  entries: ArchiveEntry[];
  entriesByType: Record<ArchiveEntryType, ArchiveEntry[]>;
  typeLabels: typeof ARCHIVE_TYPE_LABELS;
}

export function useResearchArchive(): ResearchArchiveState {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(() => new Set());

  const unlockEntry = useCallback((entryId: string) => {
    setUnlockedIds((prev) => {
      if (prev.has(entryId)) return prev;
      const next = new Set(prev);
      next.add(entryId);
      return next;
    });
  }, []);

  const unlockBlueprint = useCallback((blueprintId: string) => {
    const entry = blueprintToArchiveEntry(blueprintId);
    if (entry) {
      unlockEntry(entry.id);
    }
    const catalogEntry = Object.values(ARCHIVE_BY_ID).find((e) => e.blueprintId === blueprintId);
    if (catalogEntry) {
      unlockEntry(catalogEntry.id);
    }
  }, [unlockEntry]);

  const unlockExperimentBlueprint = useCallback((_level: number, blueprintId: string) => {
    unlockBlueprint(blueprintId);
  }, [unlockBlueprint]);

  const isUnlocked = useCallback((entryId: string) => unlockedIds.has(entryId), [unlockedIds]);

  const entries = useMemo(() => {
    const list: ArchiveEntry[] = [];
    unlockedIds.forEach((id) => {
      if (ARCHIVE_BY_ID[id]) {
        list.push(ARCHIVE_BY_ID[id]);
      } else if (id.startsWith('unlocked-bp-')) {
        const bpId = id.replace('unlocked-bp-', '');
        const bpEntry = blueprintToArchiveEntry(bpId);
        if (bpEntry) list.push(bpEntry);
      }
    });
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [unlockedIds]);

  const entriesByType = useMemo(() => {
    const grouped: Record<ArchiveEntryType, ArchiveEntry[]> = {
      blueprint: [],
      document: [],
      photo: [],
      transcript: [],
      experiment_note: [],
    };
    entries.forEach((e) => grouped[e.type].push(e));
    return grouped;
  }, [entries]);

  return {
    unlockedIds,
    unlockEntry,
    unlockBlueprint,
    unlockExperimentBlueprint,
    isUnlocked,
    entries,
    entriesByType,
    typeLabels: ARCHIVE_TYPE_LABELS,
  };
}
