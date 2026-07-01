import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import type { ArchiveEntry } from '../../content/types';
import { GAME_CURSOR } from '../../utils/gameCursor';

interface ArchiveCardModalProps {
  entry: ArchiveEntry;
  onClose: () => void;
  onContinue?: () => void;
  showContinue?: boolean;
}

export default function ArchiveCardModal({
  entry,
  onClose,
  onContinue,
  showContinue = false,
}: ArchiveCardModalProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className={`fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-[10001] no-print ${GAME_CURSOR.default}`}>
      <div className="max-w-lg w-full bg-[#faf4ea] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(217,65,65,1)] relative animate-fade-in">
        <div className="absolute inset-2 border border-black/10 pointer-events-none" />

        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1 hover:bg-black/10 border border-black/20 ${GAME_CURSOR.action}`}
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3 mb-4 pr-8">
          <FileText className="w-8 h-8 text-[#d94141] shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#d94141] font-bold block">
              档案馆卡片 // ARCHIVE CARD
            </span>
            <h2 className="font-serif font-black text-xl uppercase tracking-tight text-black mt-1">
              {entry.title}
            </h2>
          </div>
        </div>

        {entry.imageUrl && !imgFailed && (
          <div className="mb-4 border-2 border-black overflow-hidden bg-black/5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
            <img
              src={entry.imageUrl}
              alt={entry.title}
              className="w-full h-44 md:h-52 object-cover sepia-[0.3] contrast-[1.05] brightness-[0.93]"
              onError={() => setImgFailed(true)}
              draggable={false}
            />
            <div className="px-2 py-1 bg-black/80 text-[#faf6eb] font-mono text-[7px] uppercase tracking-widest text-center">
              档案影像 // ARCHIVAL PHOTO
            </div>
          </div>
        )}

        <div className="space-y-2 font-mono text-[10px] border-y border-black/15 py-3 mb-4">
          <div className="flex justify-between">
            <span className="text-black/50">日期 // DATE:</span>
            <span className="font-bold">{entry.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/50">密级 // CLASS:</span>
            <span className="font-bold text-[#d94141]">{entry.classification}</span>
          </div>
        </div>

        <p className="font-mono text-xs leading-relaxed text-black/85 text-justify whitespace-pre-line">
          {entry.body}
        </p>

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-black/10">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[8px] uppercase px-2 py-0.5 border border-black/20 bg-[#faf6eb]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 font-mono text-[10px] font-bold uppercase border-2 border-black hover:bg-black hover:text-[#faf6eb] transition-colors cursor-pointer"
          >
            归档 // ARCHIVE
          </button>
          {showContinue && onContinue && (
            <button
              onClick={onContinue}
              className="px-4 py-2 font-mono text-[10px] font-bold uppercase bg-black text-[#faf6eb] border-2 border-black hover:bg-[#faf6eb] hover:text-black transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(217,65,65,1)]"
            >
              继续 // CONTINUE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
