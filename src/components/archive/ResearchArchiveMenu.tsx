import React, { useState } from 'react';
import { X, FileText, Image, Mic, FlaskConical, Layers } from 'lucide-react';
import type { ArchiveEntry, ArchiveEntryType } from '../../content/types';
import type { ResearchArchiveState } from '../../hooks/useResearchArchive';
import { GAME_CURSOR } from '../../utils/gameCursor';

interface ResearchArchiveMenuProps {
  archive: ResearchArchiveState;
  onClose: () => void;
  onOpenEntry: (entry: ArchiveEntry) => void;
}

const TYPE_ICONS: Record<ArchiveEntryType, React.ReactNode> = {
  blueprint: <Layers className="w-3.5 h-3.5" />,
  document: <FileText className="w-3.5 h-3.5" />,
  photo: <Image className="w-3.5 h-3.5" />,
  transcript: <Mic className="w-3.5 h-3.5" />,
  experiment_note: <FlaskConical className="w-3.5 h-3.5" />,
};

export default function ResearchArchiveMenu({
  archive,
  onClose,
  onOpenEntry,
}: ResearchArchiveMenuProps) {
  const [filter, setFilter] = useState<ArchiveEntryType | 'all'>('all');

  const filtered =
    filter === 'all'
      ? archive.entries
      : archive.entriesByType[filter];

  return (
    <div className={`fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[10000] no-print ${GAME_CURSOR.default}`}>
      <div className="max-w-2xl w-full max-h-[85vh] flex flex-col bg-[#faf4ea] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-2 border-black p-4 shrink-0">
          <div>
            <span className="font-mono text-[9px] text-[#d94141] font-bold uppercase tracking-widest">
              研究档案馆 // RESEARCH ARCHIVE
            </span>
            <h2 className="font-serif font-black text-2xl uppercase tracking-tight text-black">
              已解锁收藏
            </h2>
            <p className="font-mono text-[9px] text-black/50 mt-0.5">
              共 {archive.entries.length} 条记录 · 1968 中央大型机备份
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 border-2 border-black hover:bg-black hover:text-[#faf6eb] cursor-pointer"
            aria-label="关闭档案馆"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 p-3 border-b border-black/15 shrink-0">
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="全部" />
          {(Object.keys(archive.typeLabels) as ArchiveEntryType[]).map((type) => (
            <span key={type}>
              <FilterChip
                active={filter === type}
                onClick={() => setFilter(type)}
                label={archive.typeLabels[type]}
                count={archive.entriesByType[type].length}
              />
            </span>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {filtered.length === 0 ? (
            <p className="font-mono text-xs text-black/40 italic text-center py-12">
              尚无解锁条目。在阶段间歇探索场景中按 E 检视物件，或完成实验以解锁蓝图。
            </p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((entry) => (
                <li key={entry.id}>
                  <button
                    onClick={() => onOpenEntry(entry)}
                    className="w-full text-left flex items-start space-x-3 p-3 border-2 border-black bg-[#faf6eb] hover:bg-black hover:text-[#faf6eb] transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(217,65,65,1)]"
                  >
                    <span className="mt-0.5 shrink-0">{TYPE_ICONS[entry.type]}</span>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[8px] opacity-60 uppercase block">
                        {archive.typeLabels[entry.type]} · {entry.date}
                      </span>
                      <span className="font-serif font-bold text-sm block truncate">{entry.title}</span>
                      <span className="font-mono text-[9px] opacity-70 truncate block">{entry.classification}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[9px] uppercase px-2 py-1 border cursor-pointer transition-colors ${
        active
          ? 'bg-black text-[#faf6eb] border-black font-bold'
          : 'bg-white border-black/30 text-black/60 hover:border-black'
      }`}
    >
      {label}
      {count !== undefined && count > 0 ? ` (${count})` : ''}
    </button>
  );
}
