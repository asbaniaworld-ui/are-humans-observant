import React from 'react';

interface InterludePlayerProps {
  isWalking: boolean;
  walkCycle: number;
}

/** Subject #402 explorer — matches PlayableIntro silhouette. */
export default function InterludePlayer({ isWalking, walkCycle }: InterludePlayerProps) {
  const leg1Angle = isWalking ? Math.sin(walkCycle) * 22 : 0;
  const leg2Angle = isWalking ? -Math.sin(walkCycle) * 22 : 0;
  const l1x = 28 + Math.sin((leg1Angle * Math.PI) / 180) * 30;
  const l1y = 72 + Math.cos((leg1Angle * Math.PI) / 180) * 30;
  const l2x = 36 + Math.sin((leg2Angle * Math.PI) / 180) * 30;
  const l2y = 72 + Math.cos((leg2Angle * Math.PI) / 180) * 30;
  const armAngle = isWalking ? -Math.sin(walkCycle) * 20 : 0;
  const ax = 18 + Math.sin((armAngle * Math.PI) / 180) * 18;
  const ay = 60 + Math.cos((armAngle * Math.PI) / 180) * 12;

  return (
    <svg width="64" height="110" viewBox="0 0 64 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="104" rx="14" ry="3" fill="#000" className="opacity-15" />
      <g stroke="#000" strokeWidth="2.5" strokeLinecap="round">
        <line x1="28" y1="72" x2={l1x} y2={l1y} />
        <path
          d={`M ${l1x - 3} ${l1y} L ${l1x + 7} ${l1y} L ${l1x + 8} ${l1y + 4} L ${l1x - 4} ${l1y + 4} Z`}
          fill="#111"
          stroke="#000"
          strokeWidth="1"
        />
        <line x1="36" y1="72" x2={l2x} y2={l2y} />
        <path
          d={`M ${l2x - 3} ${l2y} L ${l2x + 7} ${l2y} L ${l2x + 8} ${l2y + 4} L ${l2x - 4} ${l2y + 4} Z`}
          fill="#111"
          stroke="#000"
          strokeWidth="1"
        />
      </g>
      <path d="M 22,42 L 42,42 L 46,72 L 18,72 Z" fill="#faf4ea" stroke="#000" strokeWidth="2" />
      <path d="M 22,42 L 36,72" stroke="#4a3b32" strokeWidth="2" />
      <line x1="20" y1="56" x2="44" y2="56" stroke="#000" strokeWidth="2" />
      <rect x="28" y="53" width="8" height="6" stroke="#000" strokeWidth="1.5" fill="#faf6eb" />
      <circle cx="32" cy="28" r="11" fill="#faf4ea" stroke="#000" strokeWidth="2" />
      <rect x="22" y="24" width="8" height="6" stroke="#000" strokeWidth="1.5" fill="#e0f2fe" fillOpacity="0.4" />
      <rect x="34" y="24" width="8" height="6" stroke="#000" strokeWidth="1.5" fill="#e0f2fe" fillOpacity="0.4" />
      <line x1="30" y1="27" x2="34" y2="27" stroke="#000" strokeWidth="1.5" />
      <path d="M 26,18 L 32,10 L 38,18 Z" fill="#b45309" stroke="#000" strokeWidth="1" />
      <circle cx="32" cy="10" r="2" fill="#d94141" className="animate-pulse" />
      <g stroke="#000" strokeWidth="2" strokeLinecap="round">
        <line x1="22" y1="44" x2={ax} y2={ay} />
        <circle cx={ax} cy={ay} r="2.5" fill="#faf4ea" stroke="#000" strokeWidth="1" />
      </g>
    </svg>
  );
}
