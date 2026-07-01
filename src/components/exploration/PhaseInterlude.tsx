import React, { useState } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { ARCHIVE_BY_ID } from '../../content/archiveCatalog';
import type { InterludeScene, InspectableObject } from '../../content/types';
import ArchiveCardModal from '../archive/ArchiveCardModal';
import ArchiveExhibitTile, { getExhibitRotation } from './ArchiveExhibitTile';
import { GAME_CURSOR } from '../../utils/gameCursor';

interface PhaseInterludeProps {
  scene: InterludeScene;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  audio: { playClick: () => void; playTick: () => void; playSuccessBell: () => void };
  onUnlockEntry: (entryId: string) => void;
  onComplete: () => void;
  continueLabel?: string;
}

function CorkExhibitWall({ sectorLabel }: { sectorLabel: string }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundColor: '#c4a574',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(0,0,0,0.04) 0 2px, transparent 3px),
          radial-gradient(circle at 70% 60%, rgba(0,0,0,0.03) 0 1px, transparent 2px),
          linear-gradient(135deg, rgba(0,0,0,0.06) 0%, transparent 50%)
        `,
        backgroundSize: '24px 24px, 18px 18px, 100% 100%',
      }}
    >
      <div className="absolute inset-3 border-2 border-dashed border-black/15" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#faf4ea] border-2 border-black px-4 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
        <span className="font-serif font-black text-[9px] md:text-[10px] uppercase tracking-widest text-black whitespace-nowrap">
          {sectorLabel} // EXHIBIT WALL
        </span>
      </div>
    </div>
  );
}

export default function PhaseInterlude({
  scene,
  isMuted,
  setIsMuted,
  audio,
  onUnlockEntry,
  onComplete,
  continueLabel = '继续叙事研讨 // PROCEED',
}: PhaseInterludeProps) {
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  const totalObjects = scene.objects.length;
  const activeEntry = activeEntryId ? ARCHIVE_BY_ID[activeEntryId] : null;

  const inspectObject = (obj: InspectableObject) => {
    audio.playClick();
    onUnlockEntry(obj.archiveEntryId);
    setViewedIds((prev) => new Set(prev).add(obj.id));
    setActiveEntryId(obj.archiveEntryId);
    const entry = ARCHIVE_BY_ID[obj.archiveEntryId];
    if (entry?.blueprintId) {
      onUnlockEntry(`unlocked-bp-${entry.blueprintId}`);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto my-4 border-4 border-black p-4 md:p-6 bg-[#faf4ea] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden font-mono select-none no-print ${GAME_CURSOR.default}`}>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="flex items-center justify-between border-b border-black/20 pb-2 mb-2 text-[10px] tracking-widest text-black/60">
        <div>
          <span className="font-bold text-black">{scene.sectorLabel}</span>
          <span className="text-[#d94141] ml-2">● 档案展示墙</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1">
            {scene.objects.map((obj) => (
              <div
                key={obj.id}
                className={`w-2 h-2 border border-black/30 ${
                  viewedIds.has(obj.id) ? 'bg-[#d94141]' : 'bg-transparent'
                }`}
                title={obj.name}
              />
            ))}
            <span className="ml-1.5 text-[9px]">
              {viewedIds.size}/{totalObjects}
            </span>
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="hover:text-black flex items-center space-x-1 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3 h-3 text-[#d94141]" /> : <Volume2 className="w-3 h-3" />}
            <span>[{isMuted ? '已静音' : '声音: 开启'}]</span>
          </button>
        </div>
      </div>

      <div className="bg-[#faf6eb] border-2 border-black p-2 mb-3 text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-[#d94141] font-bold uppercase">{scene.title}</span>
        <span className="text-black/50 mx-2">//</span>
        <span className="text-black/70">{scene.subtitle}</span>
        <p className="text-black/50 mt-1 text-[9px]">
          档案展示墙 · 点击任意照片查看详细介绍 · 已阅条目同步至研究档案馆
        </p>
      </div>

      {/* Exhibit wall */}
      <div className="relative w-full border-2 border-black overflow-hidden rounded-sm min-h-[420px] md:min-h-[480px]">
        <CorkExhibitWall sectorLabel={scene.sectorLabel} />

        <div className="relative z-10 p-4 md:p-6 pt-12 md:pt-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {scene.objects.map((obj) => (
              <div key={obj.id}>
                <ArchiveExhibitTile
                  name={obj.name}
                  archiveEntryId={obj.archiveEntryId}
                  isViewed={viewedIds.has(obj.id)}
                  rotation={getExhibitRotation(obj.id)}
                  onClick={() => inspectObject(obj)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-4 pb-3 text-center">
          <p className="text-[8px] text-black/45 uppercase tracking-widest">
            CLASSIFIED EXHIBIT // 1968 COGNITIVE CALIBRATION ARCHIVES
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            audio.playClick();
            onComplete();
          }}
          className="flex items-center justify-center space-x-2 bg-black text-[#faf6eb] border-2 border-black px-6 py-3 text-xs font-bold uppercase hover:bg-[#faf6eb] hover:text-black transition-all shadow-[3px_3px_0px_0px_rgba(217,65,65,1)] cursor-pointer"
        >
          <span>{continueLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {activeEntry && (
        <ArchiveCardModal
          entry={activeEntry}
          onClose={() => {
            audio.playSuccessBell();
            setActiveEntryId(null);
          }}
        />
      )}
    </div>
  );
}
