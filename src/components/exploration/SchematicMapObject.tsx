import React from 'react';
import { getSchematicObjectKind, SchematicObjectIllustration } from './schematicIllustrations';

interface SchematicMapObjectProps {
  name: string;
  objectId: string;
  englishTag?: string;
  accent?: string;
  isNearby: boolean;
  isInspected: boolean;
  onClick: () => void;
}

/** Schematic map marker — matches PlayableIntro lab sector 00 style (line-art on map). */
export default function SchematicMapObject({
  name,
  objectId,
  englishTag,
  accent,
  isNearby,
  isInspected,
  onClick,
}: SchematicMapObjectProps) {
  const kind = getSchematicObjectKind(objectId);
  const isTerminal = kind === 'mirror' || kind === 'rack';
  const isConsole = kind === 'chart';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute w-full h-full text-left cursor-pointer transition-transform hover:scale-[1.03] focus:outline-none ${
        isNearby ? 'z-[400]' : 'z-auto'
      }`}
    >
      <div
        className={`relative w-full h-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${
          isTerminal ? 'bg-emerald-950/20' : 'bg-[#faf4ea]'
        } ${isNearby ? 'ring-4 ring-[#d94141] ring-offset-1 border-[#d94141]' : ''} ${
          isInspected ? 'opacity-90' : ''
        }`}
      >
        {kind === 'blueprint' || kind === 'document' || kind === 'machine' ? (
          <div className="w-full h-full p-1 flex flex-col justify-between">
            {englishTag && (
              <span className="text-[5px] font-black uppercase text-[#d94141] tracking-tighter leading-none">
                {englishTag}
              </span>
            )}
            <div className="flex-1 border border-dashed border-black/40 bg-white/50 flex items-center justify-center min-h-[16px] my-0.5">
              <SchematicObjectIllustration kind={kind} accent={accent} />
            </div>
            <span className="text-[4px] text-black/50 tracking-tighter leading-none line-clamp-2">{name}</span>
          </div>
        ) : kind === 'cabinet' ? (
          <div className="w-full h-full p-1 flex flex-col">
            <div className="flex-1">
              <SchematicObjectIllustration kind={kind} accent={accent} />
            </div>
            <span className="text-[4px] uppercase text-black/40 font-bold text-center mt-0.5 leading-none">{name}</span>
          </div>
        ) : isTerminal ? (
          <div className="w-full h-full p-1 flex flex-col justify-between">
            <SchematicObjectIllustration kind={kind} accent={accent} />
            <span className="text-[4px] text-black/50 font-bold uppercase text-center leading-none">{name}</span>
          </div>
        ) : isConsole ? (
          <div className="w-full h-full p-1 flex flex-col justify-between">
            <SchematicObjectIllustration kind={kind} accent={accent} />
            <span className="text-[4px] text-center text-black/50 font-bold uppercase leading-none">{name}</span>
          </div>
        ) : (
          <div className="w-full h-full p-1 flex flex-col justify-between">
            <div className="flex-1 border border-dashed border-black/30 flex items-center justify-center min-h-[16px]">
              <SchematicObjectIllustration kind={kind} accent={accent} />
            </div>
            <span className="text-[4px] text-black/50 font-bold uppercase text-center leading-none line-clamp-2">{name}</span>
          </div>
        )}

        {isInspected && (
          <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-green-100 border border-green-800/40 flex items-center justify-center text-[6px] text-green-900 font-bold">
            ✓
          </div>
        )}
      </div>
    </button>
  );
}
