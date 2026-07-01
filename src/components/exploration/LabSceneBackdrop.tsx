import React from 'react';

const VIEW_W = 1000;
const VIEW_H = 400;

interface LabSceneBackdropProps {
  sectorLabel: string;
  /** Optional subtle basement water stain */
  variant?: 'default' | 'basement';
}

/** Shared 2.5D schematic lab floor — matches PlayableIntro sector 00. */
export default function LabSceneBackdrop({ sectorLabel, variant = 'default' }: LabSceneBackdropProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width={VIEW_W} height="180" fill="#faf6eb" />
      <rect x="0" y="180" width={VIEW_W} height="220" fill="#f0ebe0" />
      <line x1="0" y1="180" x2={VIEW_W} y2="180" stroke="#000" strokeWidth="2.5" />

      {[150, 300, 500, 700, 850].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="#000" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.2" />
      ))}

      <line x1="120" y1="180" x2="0" y2="400" stroke="#000" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
      <line x1="320" y1="180" x2="200" y2="400" stroke="#000" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
      <line x1="520" y1="180" x2="450" y2="400" stroke="#000" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
      <line x1="720" y1="180" x2="700" y2="400" stroke="#000" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
      <line x1="920" y1="180" x2="950" y2="400" stroke="#000" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />

      <path
        d="M 0,340 l 1000,0 M 100,340 v 8 M 200,340 v 8 M 300,340 v 8 M 400,340 v 8 M 500,340 v 8 M 600,340 v 8 M 700,340 v 8 M 800,340 v 8 M 900,340 v 8"
        stroke="#000"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.45"
      />

      <rect x="70" y="25" width="280" height="28" stroke="#000" strokeWidth="1.5" fill="#faf6eb" opacity="0.8" />
      <text x="210" y="42" textAnchor="middle" className="fill-black font-serif font-bold text-[9px] tracking-widest uppercase">
        {sectorLabel}
      </text>

      {variant === 'basement' && (
        <rect x="0" y="300" width={VIEW_W} height="40" fill="#1a3a5c" opacity="0.08" />
      )}
    </svg>
  );
}
