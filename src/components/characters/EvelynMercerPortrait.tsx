import React, { useState } from 'react';

/** Original Unsplash portrait used in phase-dialogue monitor feed. */
export const DR_MERCER_UNSPLASH_URL =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';

/** Locally generated archival portrait (1960s lab psychologist). */
export const DR_MERCER_GENERATED_URL = '/assets/dr-evelyn-mercer-portrait.png';

interface EvelynMercerPortraitProps {
  size?: number;
  /** card = intro interview; monitor = phase dialogue CRT feed */
  variant?: 'card' | 'monitor';
  /** Override photo source; defaults: card → generated, monitor → unsplash */
  photoSource?: 'generated' | 'unsplash';
  className?: string;
}

function SvgFallback({ isMonitor }: { isMonitor: boolean }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${isMonitor ? 'opacity-90' : ''}`}
    >
      <rect width="80" height="80" fill={isMonitor ? '#1a1814' : '#faf4ea'} />
      <circle cx="40" cy="36" r="16" fill="#faf4ea" stroke="#000" strokeWidth="1.5" />
      <path d="M 24,36 q 16,-18 32,0" stroke="#000" strokeWidth="2" />
      <circle cx="33" cy="36" r="5" stroke="#000" strokeWidth="1.5" />
      <circle cx="47" cy="36" r="5" stroke="#000" strokeWidth="1.5" />
      <line x1="38" y1="36" x2="42" y2="36" stroke="#000" strokeWidth="1.5" />
      <path d="M 22,60 Q 30,56 40,64 Q 50,56 58,60 L 62,80 L 18,80 Z" stroke="#000" strokeWidth="1.5" fill="#faf6eb" />
    </svg>
  );
}

/**
 * Dr. Evelyn Mercer portrait — generated archival photo (card) or Unsplash feed (monitor).
 */
export default function EvelynMercerPortrait({
  size = 80,
  variant = 'card',
  photoSource,
  className = '',
}: EvelynMercerPortraitProps) {
  const isMonitor = variant === 'monitor';
  const src =
    photoSource === 'unsplash' || (photoSource === undefined && isMonitor)
      ? DR_MERCER_UNSPLASH_URL
      : DR_MERCER_GENERATED_URL;

  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className={`relative w-full h-full overflow-hidden ${
          isMonitor
            ? 'border-4 border-black bg-neutral-900'
            : 'border-2 border-black bg-[#faf6eb] p-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]'
        }`}
      >
        {!imgFailed ? (
          <img
            src={src}
            alt="伊芙琳·默瑟博士 Dr. Evelyn Mercer"
            className={`absolute inset-0 w-full h-full object-cover ${
              isMonitor ? 'mix-blend-luminosity opacity-85 scale-105' : 'object-[center_20%]'
            }`}
            onError={() => setImgFailed(true)}
            draggable={false}
          />
        ) : (
          <SvgFallback isMonitor={isMonitor} />
        )}

        {isMonitor && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
          </>
        )}

        {!isMonitor && (
          <div className="absolute inset-0 border border-black/10 pointer-events-none m-1" />
        )}
      </div>

      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#d94141] animate-ping pointer-events-none" />
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#d94141] pointer-events-none" />

      {isMonitor && (
        <>
          <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/50 px-1.5 py-0.5 rounded-sm pointer-events-none z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d94141] animate-pulse" />
            <span className="font-mono text-[7px] text-[#d94141] font-bold">REC</span>
          </div>
          <div className="absolute bottom-1 inset-x-1 text-center text-white/75 font-mono text-[7px] uppercase tracking-widest bg-black/60 py-0.5 border border-white/10 pointer-events-none z-10">
            DR. MERCER
          </div>
        </>
      )}
    </div>
  );
}
