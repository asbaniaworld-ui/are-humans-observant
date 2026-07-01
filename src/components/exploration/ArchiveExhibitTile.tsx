import React, { useState } from 'react';
import { getArchiveImageUrl } from '../../content/archiveImages';
import { GAME_CURSOR } from '../../utils/gameCursor';

interface ArchiveExhibitTileProps {
  name: string;
  archiveEntryId: string;
  isViewed: boolean;
  rotation?: number;
  onClick: () => void;
}

export default function ArchiveExhibitTile({
  name,
  archiveEntryId,
  isViewed,
  rotation = 0,
  onClick,
}: ArchiveExhibitTileProps) {
  const imageUrl = getArchiveImageUrl(archiveEntryId);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left w-full focus:outline-none ${GAME_CURSOR.inspect}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Push pin */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-3 h-3 rounded-full bg-[#8b0000] border border-black/40 shadow-sm" />

      <div
        className={`relative border-2 border-black bg-[#faf4ea] p-1.5 shadow-[4px_5px_0px_0px_rgba(0,0,0,0.85)] transition-all group-hover:-translate-y-1 group-hover:shadow-[5px_7px_0px_0px_rgba(217,65,65,0.9)] ${
          isViewed ? 'ring-1 ring-[#d94141]/40' : ''
        }`}
      >
        <div className="aspect-[4/3] w-full overflow-hidden border border-black/20 bg-[#e8e0d4] relative">
          {imageUrl && !imgFailed ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover sepia-[0.25] contrast-[1.05] brightness-[0.92] group-hover:sepia-[0.1] group-hover:brightness-100 transition-all"
              onError={() => setImgFailed(true)}
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#faf6eb]">
              <span className="text-[8px] text-black/30 uppercase font-mono px-2 text-center">NO PHOTO</span>
            </div>
          )}

          {/* Museum label */}
          <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[#faf6eb] px-1.5 py-1">
            <span className="text-[7px] md:text-[8px] font-bold uppercase leading-tight line-clamp-2 block">{name}</span>
          </div>
        </div>

        {isViewed && (
          <div className="absolute top-1 right-1 bg-green-100 border border-green-800/40 text-green-900 text-[7px] font-bold px-1 py-0.5">
            ✓ 已阅
          </div>
        )}

        <div className="mt-1 text-center">
          <span className="text-[6px] text-black/40 uppercase tracking-widest group-hover:text-[#d94141] transition-colors">
            点击查看 // INSPECT
          </span>
        </div>
      </div>
    </button>
  );
}

/** Stable slight tilt per object id for gallery wall organic layout. */
export function getExhibitRotation(objectId: string): number {
  let hash = 0;
  for (let i = 0; i < objectId.length; i++) {
    hash = (hash + objectId.charCodeAt(i) * (i + 3)) % 11;
  }
  return hash - 5;
}
