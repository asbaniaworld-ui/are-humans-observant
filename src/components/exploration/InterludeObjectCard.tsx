import React from 'react';

export type InterludeObjectKind =
  | 'cabinet'
  | 'photo_wall'
  | 'drawer'
  | 'chart'
  | 'document'
  | 'machine'
  | 'seal'
  | 'mirror'
  | 'chair'
  | 'projector'
  | 'rack'
  | 'cylinder'
  | 'panel'
  | 'camera'
  | 'workbench'
  | 'gear'
  | 'solder'
  | 'turbine'
  | 'robot'
  | 'tool'
  | 'audio'
  | 'ocean'
  | 'negative'
  | 'model'
  | 'protocol';

export function getInterludeObjectKind(objectId: string): InterludeObjectKind {
  if (objectId.includes('filing') || objectId.includes('cabinet')) return 'cabinet';
  if (objectId.includes('polaroid')) return 'photo_wall';
  if (objectId.includes('punch') || objectId.includes('drawer')) return 'drawer';
  if (objectId.includes('mercury') || objectId.includes('gauge') || objectId.includes('flood')) return 'chart';
  if (objectId.includes('microfilm') || objectId.includes('reader')) return 'machine';
  if (objectId.includes('seal') || objectId.includes('cal-seal')) return 'seal';
  if (objectId.includes('roster') || objectId.includes('memo') || objectId.includes('logbook') || objectId.includes('terminated') || objectId.includes('log')) return 'document';
  if (objectId.includes('mirror')) return 'mirror';
  if (objectId.includes('chair') || objectId.includes('eeg')) return 'chair';
  if (objectId.includes('projector') || objectId.includes('retina')) return 'projector';
  if (objectId.includes('vacuum') || objectId.includes('rack') || objectId.includes('wire')) return 'rack';
  if (objectId.includes('cylinder')) return 'cylinder';
  if (objectId.includes('intercom') || objectId.includes('panel')) return 'panel';
  if (objectId.includes('camera') || objectId.includes('cam')) return 'camera';
  if (objectId.includes('lathe') || objectId.includes('bench')) return 'workbench';
  if (objectId.includes('gear')) return 'gear';
  if (objectId.includes('solder')) return 'solder';
  if (objectId.includes('turbine')) return 'turbine';
  if (objectId.includes('robot')) return 'robot';
  if (objectId.includes('tool')) return 'tool';
  if (objectId.includes('audio') || objectId.includes('reel')) return 'audio';
  if (objectId.includes('ocean')) return 'ocean';
  if (objectId.includes('negative')) return 'negative';
  if (objectId.includes('city') || objectId.includes('model')) return 'model';
  if (objectId.includes('protocol') || objectId.includes('final')) return 'protocol';
  return 'document';
}

function ObjectIllustration({ kind, accent }: { kind: InterludeObjectKind; accent?: string }) {
  const stroke = '#1a1a1a';
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full opacity-75" fill="none">
      {kind === 'cabinet' && (
        <>
          <rect x="8" y="6" width="32" height="36" stroke={stroke} strokeWidth="1.2" fill="#faf6eb" />
          {[12, 22, 32].map((y) => (
            <g key={y}>
              <rect x="12" y={y} width="24" height="7" stroke={stroke} strokeWidth="0.8" />
              <circle cx="32" cy={y + 3.5} r="1" fill={stroke} />
            </g>
          ))}
        </>
      )}
      {kind === 'photo_wall' && (
        <>
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={8 + col * 12}
                y={8 + row * 12}
                width="10"
                height="10"
                stroke={stroke}
                strokeWidth="0.6"
                fill={row === 1 && col === 1 ? (accent ?? '#d94141') : '#faf6eb'}
                fillOpacity={row === 1 && col === 1 ? 0.25 : 1}
              />
            )),
          )}
        </>
      )}
      {kind === 'drawer' && (
        <>
          <rect x="10" y="12" width="28" height="24" stroke={stroke} strokeWidth="1" />
          {Array.from({ length: 5 }).map((_, i) => (
            <circle key={i} cx={14 + i * 5} cy="22" r="1.2" fill={stroke} />
          ))}
        </>
      )}
      {kind === 'chart' && (
        <>
          <rect x="16" y="8" width="16" height="32" stroke={stroke} strokeWidth="1" rx="1" />
          <path d="M 24 12 L 24 36" stroke={accent ?? '#d94141'} strokeWidth="1.2" />
          <circle cx="24" cy="18" r="2" fill={accent ?? '#d94141'} />
        </>
      )}
      {kind === 'document' && (
        <>
          <rect x="12" y="8" width="24" height="32" stroke={stroke} strokeWidth="1" fill="#faf6eb" />
          {[14, 20, 26, 32].map((y) => (
            <line key={y} x1="16" y1={y} x2="32" y2={y} stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          ))}
          {accent && <rect x="28" y="10" width="6" height="6" fill={accent} opacity="0.6" />}
        </>
      )}
      {kind === 'machine' && (
        <>
          <rect x="10" y="14" width="28" height="20" stroke={stroke} strokeWidth="1" rx="2" />
          <circle cx="24" cy="24" r="6" stroke={stroke} strokeWidth="0.8" />
          <line x1="24" y1="18" x2="24" y2="14" stroke={stroke} strokeWidth="1" />
        </>
      )}
      {kind === 'seal' && (
        <>
          <circle cx="24" cy="24" r="14" stroke={accent ?? '#d94141'} strokeWidth="1.5" fill="#faf6eb" />
          <text x="24" y="27" textAnchor="middle" fontSize="6" fill={accent ?? '#d94141'} fontWeight="bold">
            402
          </text>
        </>
      )}
      {kind === 'mirror' && (
        <>
          <rect x="8" y="14" width="32" height="20" stroke={stroke} strokeWidth="1.2" fill="rgba(16,185,129,0.12)" />
          <line x1="12" y1="18" x2="36" y2="30" stroke={stroke} strokeWidth="0.4" opacity="0.3" />
        </>
      )}
      {kind === 'chair' && (
        <>
          <rect x="16" y="22" width="16" height="14" stroke={stroke} strokeWidth="1" />
          <path d="M 20 22 L 20 12 L 28 12 L 28 22" stroke={stroke} strokeWidth="1" />
        </>
      )}
      {kind === 'projector' && (
        <>
          <path d="M 14 28 L 34 28 L 38 18 L 10 18 Z" stroke={stroke} strokeWidth="1" fill="#faf6eb" />
          <circle cx="24" cy="24" r="3" stroke={stroke} strokeWidth="0.8" />
        </>
      )}
      {kind === 'rack' && (
        <>
          {[14, 24, 34].map((x) => (
            <circle key={x} cx={x} cy="24" r="5" stroke={stroke} strokeWidth="0.8" fill="#faf6eb" />
          ))}
        </>
      )}
      {kind === 'robot' && (
        <>
          <rect x="16" y="16" width="16" height="20" stroke={stroke} strokeWidth="1" />
          <circle cx="24" cy="12" r="4" stroke={stroke} strokeWidth="0.8" />
          <line x1="18" y1="36" x2="14" y2="42" stroke={stroke} strokeWidth="1" />
          <line x1="30" y1="36" x2="34" y2="42" stroke={stroke} strokeWidth="1" />
        </>
      )}
      {kind === 'protocol' && (
        <>
          <rect x="12" y="10" width="24" height="28" stroke={accent ?? '#d94141'} strokeWidth="1.2" fill="#faf6eb" />
          <text x="24" y="28" textAnchor="middle" fontSize="5" fill={accent ?? '#d94141'}>
            1A
          </text>
        </>
      )}
      {!['cabinet', 'photo_wall', 'drawer', 'chart', 'document', 'machine', 'seal', 'mirror', 'chair', 'projector', 'rack', 'robot', 'protocol'].includes(kind) && (
        <>
          <rect x="14" y="10" width="20" height="28" stroke={stroke} strokeWidth="1" fill="#faf6eb" />
          <line x1="18" y1="18" x2="30" y2="18" stroke={stroke} strokeWidth="0.5" />
          <line x1="18" y1="24" x2="28" y2="24" stroke={stroke} strokeWidth="0.5" />
        </>
      )}
    </svg>
  );
}

interface InterludeObjectCardProps {
  name: string;
  objectId: string;
  accent?: string;
  isNearby: boolean;
  isInspected: boolean;
  onClick: () => void;
}

export default function InterludeObjectCard({
  name,
  objectId,
  accent,
  isNearby,
  isInspected,
  onClick,
}: InterludeObjectCardProps) {
  const kind = getInterludeObjectKind(objectId);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute text-left transition-all duration-200 group focus:outline-none ${
        isNearby ? 'z-[400] scale-[1.06]' : 'z-auto'
      }`}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Push pin */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#8b0000] border border-black/30 shadow-sm z-10" />

      <div
        className={`relative w-full h-full border-2 border-black bg-[#faf4ea] shadow-[3px_4px_0px_0px_rgba(0,0,0,0.85)] overflow-hidden ${
          isNearby ? 'ring-2 ring-[#d94141] ring-offset-1 border-[#d94141]' : ''
        } ${isInspected ? 'opacity-90' : 'hover:-translate-y-0.5'}`}
        style={{ transform: `rotate(${isNearby ? 0 : -0.5 + (name.length % 3) * 0.8}deg)` }}
      >
        {/* Paper texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 4px)',
          }}
        />

        <div className="relative h-full flex flex-col p-1.5 min-h-0">
          <span className="text-[8px] md:text-[9px] font-black uppercase text-[#d94141] leading-tight line-clamp-2 shrink-0 pr-1">
            {name}
          </span>

          <div className="flex-1 min-h-[24px] my-1 flex items-center justify-center border border-dashed border-black/15 bg-[#faf6eb]/80">
            <ObjectIllustration kind={kind} accent={accent} />
          </div>

          <div className="flex items-center justify-between shrink-0">
            <span className="text-[7px] text-black/45 uppercase tracking-wider">
              {isInspected ? '已检视' : '按 E 检视'}
            </span>
            {isInspected && (
              <span className="text-[7px] font-bold text-green-800 bg-green-100/80 border border-green-800/30 px-1">
                ✓
              </span>
            )}
          </div>
        </div>

        {isNearby && (
          <div className="absolute -top-2 -right-1 bg-[#d94141] text-white text-[6px] font-bold px-1 py-0.5 border border-black animate-pulse uppercase">
            ●
          </div>
        )}
      </div>
    </button>
  );
}
