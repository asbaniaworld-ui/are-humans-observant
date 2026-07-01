import React from 'react';

export const SketchyRedCircle: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => {
  const d = `
    M ${cx - r},${cy}
    C ${cx - r},${cy - r * 1.1} ${cx + r * 1.1},${cy - r * 0.9} ${cx + r},${cy}
    C ${cx + r * 0.9},${cy + r * 1.1} ${cx - r * 1.1},${cy + r * 0.85} ${cx - r - 2},${cy + 2}
    C ${cx - r * 0.8},${cy - r * 0.9} ${cx + r * 0.8},${cy - r * 1.1} ${cx + r - 3},${cy - 3}
  `;
  return (
    <g className="animate-draw-circle">
      <path
        d={d}
        fill="none"
        stroke="#d94141"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="600"
        strokeDashoffset="600"
        className="animate-[draw_1s_ease-out_forwards]"
        style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.15))' }}
      />
    </g>
  );
};
