import React from 'react';
import { SketchyRedCircle } from './SketchyRedCircle';
import { PuzzleHitAreas } from './PuzzleHitAreas';

// Local Hatching and Engraving Defs for self-containment
const SVGDefs: React.FC = () => (
  <defs>
    <pattern id="extra-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#1a1a1a" strokeWidth="1" />
    </pattern>
    <pattern id="extra-hatch-dense" width="4" height="4" patternTransform="rotate(135 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="4" stroke="#1a1a1a" strokeWidth="1" />
    </pattern>
    <pattern id="extra-tech-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="none" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.015" />
      <circle cx="20" cy="20" r="1" fill="#1a1a1a" opacity="0.03" />
    </pattern>
  </defs>
);

interface PuzzleProps {
  side: 'left' | 'right';
  foundDiffs: number[];
  onFindDiff: (index: number) => void;
  onMiss: () => void;
  onLeftPanelHint?: () => void;
}

// Helper to draw standard technical framing
const TechnicalFrame: React.FC<{ title: string; subtitle: string; refNo: string }> = ({ title, subtitle, refNo }) => (
  <g opacity="0.7" className="font-mono text-[9px]" pointerEvents="none" stroke="none">
    <rect x="15" y="15" width="470" height="470" fill="none" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="5, 5" opacity="0.15" />
    <text x="35" y="45" className="font-bold tracking-wider fill-[#1a1a1a]">{title}</text>
    <text x="465" y="45" className="font-bold tracking-wider fill-[#1a1a1a]" textAnchor="end">{refNo}</text>
    <text x="250" y="465" className="fill-[#1a1a1a] opacity-50" textAnchor="middle">{subtitle}</text>
  </g>
);

// --------------------------------------------------------------------
// PUZZLE 4: THE MNEMONIC VAULT
// --------------------------------------------------------------------
export const PuzzleFourSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss, onLeftPanelHint }) => {
  const isLeft = side === 'left';
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full select-none bg-[#faf6eb] border-2 border-black" onClick={onMiss} style={{ filter: 'contrast(1.05) brightness(0.98)' }}>
      <SVGDefs />
      <rect width="500" height="500" fill="url(#extra-tech-grid)" pointerEvents="none" />
      <TechnicalFrame title="标本编号 IV // 记忆保管库" subtitle="图 4 - 模拟齿轮式打孔卡索引与检索核心" refNo="ARCHIVE REF: MNEM-402" />

      {/* Main Cabinet outline */}
      <g stroke="#1a1a1a" strokeWidth="1.5" fill="none">
        <rect x="80" y="80" width="340" height="340" rx="3" />
        <line x1="80" y1="220" x2="420" y2="220" />
      </g>

      {/* Difference 3: Pressure Gauge Pointer */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <circle cx="120" cy="150" r="22" />
        <circle cx="120" cy="150" r="18" strokeDasharray="2,2" />
        {isLeft ? (
          <line x1="120" y1="150" x2="135" y2="135" strokeWidth="2" /> // pointing up-right
        ) : (
          <line x1="120" y1="150" x2="120" y2="168" strokeWidth="2" stroke="#d94141" /> // pointing down
        )}
      </g>

      {/* Difference 0: Punch Card Data Holes (Center) */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none">
        <rect x="200" y="120" width="100" height="80" fill="#faf4ea" strokeWidth="1.5" />
        <path d="M 290,120 L 300,130 L 300,200 L 200,200 L 200,120 Z" fill="none" /> {/* Punch card cut corner */}
        
        {/* Punch card data columns */}
        {isLeft ? (
          // Detailed 8 holes punched
          <g fill="#1a1a1a" stroke="none">
            <circle cx="215" cy="140" r="3" /> <circle cx="215" cy="160" r="3" />
            <circle cx="235" cy="150" r="3" /> <circle cx="235" cy="180" r="3" />
            <circle cx="255" cy="140" r="3" /> <circle cx="255" cy="170" r="3" />
            <circle cx="275" cy="160" r="3" /> <circle cx="275" cy="180" r="3" />
          </g>
        ) : (
          // Only 4 holes punched
          <g fill="#1a1a1a" stroke="none">
            <circle cx="215" cy="140" r="3" />
            <circle cx="235" cy="180" r="3" />
            <circle cx="255" cy="140" r="3" />
            <circle cx="275" cy="160" r="3" />
          </g>
        )}
      </g>

      {/* Difference 1: Left Index Gear Crank */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <circle cx="140" cy="320" r="30" />
        {isLeft ? (
          // Detailed teeth on rim
          <g strokeWidth="1">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              return (
                <line 
                  key={i}
                  x1={140 + Math.cos(rad) * 30}
                  y1={320 + Math.sin(rad) * 30}
                  x2={140 + Math.cos(rad) * 35}
                  y2={320 + Math.sin(rad) * 35}
                />
              );
            })}
          </g>
        ) : (
          // Smooth wheel with missing teeth (only 4 ticks)
          <g strokeWidth="1">
            <line x1="140" y1="290" x2="140" y2="285" stroke="#d94141" />
            <line x1="140" y1="350" x2="140" y2="355" stroke="#d94141" />
            <line x1="110" y1="320" x2="105" y2="320" stroke="#d94141" />
            <line x1="170" y1="320" x2="175" y2="320" stroke="#d94141" />
          </g>
        )}
        <circle cx="140" cy="320" r="10" fill="#faf6eb" />
        <circle cx="140" cy="320" r="4" fill="#1a1a1a" />
      </g>

      {/* Difference 2: Right Catalog Drawer & Brass Handle */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="290" y="280" width="100" height="70" rx="2" />
        <rect x="310" y="300" width="60" height="25" rx="1" fill="#faf4ea" />
        {isLeft ? (
          <text x="340" y="316" className="font-mono text-[8px] font-bold fill-[#1a1a1a]" stroke="none" textAnchor="middle">M-402</text>
        ) : (
          // Empty label holder in right
          <line x1="320" y1="312" x2="360" y2="312" strokeWidth="1" strokeDasharray="2,2" stroke="#d94141" />
        )}
      </g>

      {/* Difference 4: Right metal edge tick rulers */}
      <g stroke="#1a1a1a" strokeWidth="1">
        {isLeft ? (
          // Detailed sub-millimeter tick marks
          Array.from({ length: 21 }).map((_, i) => (
            <line key={i} x1="410" y1={120 + i * 10} x2={i % 5 === 0 ? "395" : "403"} y2={120 + i * 10} />
          ))
        ) : (
          // Tick marks missing completely
          <line x1="410" y1="120" x2="410" y2="320" strokeDasharray="5,5" stroke="#d94141" />
        )}
      </g>

      <PuzzleHitAreas puzzleIndex={3} side={side} foundDiffs={foundDiffs} onFindDiff={onFindDiff} onMiss={onMiss} onLeftPanelHint={onLeftPanelHint} />
    </svg>
  );
};

// --------------------------------------------------------------------
// PUZZLE 5: THE ONEIRIC RECORDER
// --------------------------------------------------------------------
export const PuzzleFiveSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss, onLeftPanelHint }) => {
  const isLeft = side === 'left';
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full select-none bg-[#faf6eb] border-2 border-black" onClick={onMiss} style={{ filter: 'contrast(1.05) brightness(0.98)' }}>
      <SVGDefs />
      <rect width="500" height="500" fill="url(#extra-tech-grid)" pointerEvents="none" />
      <TechnicalFrame title="标本编号 V // 梦境记录仪" subtitle="图 5 - 双脑区微弱脑波传感器与自动绘图仪" refNo="ARCHIVE REF: ONER-1968" />

      {/* Main Console Layout */}
      <rect x="70" y="80" width="360" height="340" rx="2" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <line x1="70" y1="260" x2="430" y2="260" stroke="#1a1a1a" strokeWidth="1.5" />

      {/* Difference 4: Cooling ventilation slats (top left) */}
      <g stroke="#1a1a1a" strokeWidth="1.5">
        {isLeft ? (
          // Detailed cooling vents
          Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={270 + i * 10} y1="120" x2={270 + i * 10} y2="140" />
          ))
        ) : (
          // Mapped or closed
          <rect x="265" y="118" width="55" height="24" fill="url(#extra-hatch-dense)" />
        )}
      </g>

      {/* Difference 1: Electrode pins on the head sensor */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <circle cx="180" cy="200" r="28" />
        <ellipse cx="180" cy="200" rx="20" ry="10" />
        {isLeft ? (
          // Three electrode terminal leads splayed
          <g strokeWidth="2">
            <line x1="180" y1="172" x2="180" y2="155" />
            <line x1="160" y1="180" x2="145" y2="165" />
            <line x1="200" y1="180" x2="215" y2="165" />
          </g>
        ) : (
          // Two leads only (missing central)
          <g strokeWidth="2" stroke="#d94141">
            <line x1="160" y1="180" x2="145" y2="165" />
            <line x1="200" y1="180" x2="215" y2="165" />
          </g>
        )}
      </g>

      {/* Difference 2: Dual Concentric Spool (Right) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <circle cx="380" cy="200" r="20" />
        {isLeft ? (
          <circle cx="380" cy="200" r="14" strokeWidth="1.5" />
        ) : (
          // Single loop
          <circle cx="380" cy="200" r="6" stroke="#d94141" strokeWidth="1.5" />
        )}
        <circle cx="380" cy="200" r="4" fill="#1a1a1a" />
      </g>

      {/* Difference 0: Paper Recording trace scroll (Bottom Left) */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none">
        <rect x="100" y="290" width="160" height="110" rx="1" fill="#faf4ea" strokeWidth="1.2" />
        {/* Horizontal grid lines */}
        <line x1="100" y1="310" x2="260" y2="310" strokeDasharray="2,2" opacity="0.3" />
        <line x1="100" y1="330" x2="260" y2="330" strokeDasharray="2,2" opacity="0.3" />
        <line x1="100" y1="350" x2="260" y2="350" strokeDasharray="2,2" opacity="0.3" />
        <line x1="100" y1="370" x2="260" y2="370" strokeDasharray="2,2" opacity="0.3" />
        
        {/* Waveform */}
        {isLeft ? (
          // Detailed double waves (harmonics)
          <g strokeWidth="1.5">
            <path d="M 100,320 Q 120,290 140,330 T 180,340 T 220,320 T 260,330" />
            <path d="M 100,350 Q 115,380 135,340 T 175,360 T 215,350 T 260,360" opacity="0.5" strokeWidth="0.8" />
          </g>
        ) : (
          // Waveform 2 is flat-lined
          <g strokeWidth="1.5">
            <path d="M 100,320 Q 120,290 140,330 T 180,340 T 220,320 T 260,330" />
            <line x1="100" y1="355" x2="260" y2="355" stroke="#d94141" strokeWidth="1.5" />
          </g>
        )}
      </g>

      {/* Difference 3: Waste ribbon tape bin (Bottom Right) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="290" y="290" width="110" height="110" rx="1" />
        {isLeft ? (
          // Pile of detailed curled coiled paper tape lines inside bin
          <g opacity="0.85">
            <path d="M 310,380 C 310,340 330,340 330,380 S 350,380 350,340" />
            <path d="M 320,390 C 330,360 350,360 360,390" />
            <path d="M 340,385 C 345,350 365,350 375,385" strokeWidth="0.8" />
            <path d="M 305,370 C 315,350 330,370 340,350" />
          </g>
        ) : (
          // Empty bin (clean)
          <line x1="300" y1="380" x2="390" y2="380" strokeDasharray="3,3" stroke="#d94141" opacity="0.5" />
        )}
        <text x="345" y="305" className="font-mono text-[6px] fill-[#1a1a1a] opacity-50" textAnchor="middle" stroke="none">REEL OUTPUT</text>
      </g>

      <PuzzleHitAreas puzzleIndex={4} side={side} foundDiffs={foundDiffs} onFindDiff={onFindDiff} onMiss={onMiss} onLeftPanelHint={onLeftPanelHint} />
    </svg>
  );
};

// --------------------------------------------------------------------
// PUZZLE 6: THE MEMORY RECONSTRUCTION APPARATUS
// --------------------------------------------------------------------
export const PuzzleSixSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss, onLeftPanelHint }) => {
  const isLeft = side === 'left';
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full select-none bg-[#faf6eb] border-2 border-black" onClick={onMiss} style={{ filter: 'contrast(1.05) brightness(0.98)' }}>
      <SVGDefs />
      <rect width="500" height="500" fill="url(#extra-tech-grid)" pointerEvents="none" />
      <TechnicalFrame title="标本编号 VI // 记忆重建仪" subtitle="图 6 - 光学摄影底片断层扫描与海马体重塑镜" refNo="ARCHIVE REF: RECON-MOD-8" />

      {/* Chassis and rails */}
      <line x1="50" y1="360" x2="450" y2="360" stroke="#1a1a1a" strokeWidth="3" />
      <rect x="100" y="160" width="100" height="150" fill="none" stroke="#1a1a1a" strokeWidth="1.5" /> {/* Left Projector unit */}
      
      {/* Central focus cone */}
      <path d="M 200,200 L 300,160 L 300,310 L 200,270 Z" fill="none" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />

      {/* Difference 0: Projector lens alignment screws */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none">
        <circle cx="150" cy="220" r="24" />
        <circle cx="150" cy="220" r="16" />
        {isLeft ? (
          // 4 screws at 90-deg angles
          <g fill="#1a1a1a" stroke="none">
            <circle cx="150" cy="200" r="2.5" />
            <circle cx="150" cy="240" r="2.5" />
            <circle cx="130" cy="220" r="2.5" />
            <circle cx="170" cy="220" r="2.5" />
          </g>
        ) : (
          // Missing left/right screws
          <g fill="#1a1a1a" stroke="none">
            <circle cx="150" cy="200" r="2.5" />
            <circle cx="150" cy="240" r="2.5" />
            <circle cx="130" cy="220" r="1" fill="#d94141" />
            <circle cx="170" cy="220" r="1" fill="#d94141" />
          </g>
        )}
      </g>

      {/* Difference 1: Reconstructed Silhouette Plate (Right side screen) */}
      <g stroke="#1a1a1a" strokeWidth="1.5" fill="none">
        <rect x="300" y="150" width="100" height="170" fill="#faf4ea" />
        {isLeft ? (
          // Fine woodcut engraved portrait profile of face
          <g strokeWidth="0.8">
            <path d="M 345,185 C 330,200 330,215 340,225 C 345,230 335,235 342,245 C 350,255 365,255 365,255" />
            <ellipse cx="355" cy="210" rx="15" ry="25" fill="none" strokeDasharray="1,2" opacity="0.5" />
            <line x1="335" y1="265" x2="365" y2="265" />
            <text x="350" y="170" className="font-mono text-[5px] fill-[#1a1a1a]" stroke="none" textAnchor="middle">SUBJECT_RECON</text>
          </g>
        ) : (
          // Blank reflective panel (Difference)
          <g>
            <line x1="310" y1="160" x2="390" y2="310" strokeWidth="0.5" strokeDasharray="3,3" stroke="#d94141" opacity="0.4" />
            <text x="350" y="230" className="font-mono text-[7px] fill-[#d94141] font-bold" stroke="none" textAnchor="middle">NO_IMAGE_FOUND</text>
          </g>
        )}
      </g>

      {/* Difference 2: Light Ray Refraction Lines through Central Lens */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none">
        <line x1="180" y1="220" x2="320" y2="220" strokeWidth="2" strokeDasharray="4,2" />
        {isLeft ? (
          // Extra dual branching diagnostic rays
          <g strokeWidth="0.8" strokeDasharray="2,2">
            <path d="M 200,220 L 250,180 L 300,220" />
            <path d="M 200,220 L 250,260 L 300,220" />
          </g>
        ) : (
          // Only single diagonal ray
          <path d="M 200,220 L 250,180 L 300,220" strokeWidth="0.8" strokeDasharray="2,2" stroke="#d94141" />
        )}
      </g>

      {/* Difference 3: Gear teeth track below left carriage */}
      <g stroke="#1a1a1a" strokeWidth="1">
        <rect x="110" y="340" width="280" height="15" rx="1" fill="none" />
        {isLeft ? (
          // Fine vertical track gears
          Array.from({ length: 28 }).map((_, i) => (
            <line key={i} x1={115 + i * 9} y1="340" x2={115 + i * 9} y2="348" />
          ))
        ) : (
          // Completely smooth line inside (no gears)
          <line x1="110" y1="347" x2="390" y2="347" strokeWidth="2" stroke="#d94141" strokeDasharray="4,4" />
        )}
      </g>

      {/* Difference 4: Cooling oil reservoir fluid level (far right) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="365" y="325" width="30" height="50" rx="1" />
        {isLeft ? (
          // Filled to 75% with hatching
          <g>
            <rect x="365" y="340" width="30" height="35" fill="url(#extra-hatch)" />
            <line x1="365" y1="340" x2="395" y2="340" strokeWidth="1.5" />
          </g>
        ) : (
          // Completely empty (Difference)
          <line x1="365" y1="370" x2="395" y2="370" strokeWidth="1.5" stroke="#d94141" strokeDasharray="2,1" />
        )}
      </g>

      <PuzzleHitAreas puzzleIndex={5} side={side} foundDiffs={foundDiffs} onFindDiff={onFindDiff} onMiss={onMiss} onLeftPanelHint={onLeftPanelHint} />
    </svg>
  );
};

// --------------------------------------------------------------------
// PUZZLE 7: THE PROBABILISTIC FUTURE ENGINE
// --------------------------------------------------------------------
export const PuzzleSevenSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss }) => {
  const isLeft = side === 'left';
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full select-none bg-[#faf6eb] border-2 border-black" onClick={onMiss} style={{ filter: 'contrast(1.05) brightness(0.98)' }}>
      <SVGDefs />
      <rect width="500" height="500" fill="url(#extra-tech-grid)" pointerEvents="none" />
      <TechnicalFrame title="标本编号 VII // 概率未来引擎" subtitle="图 7 - 多维差速计算圆盘与正态预测曲线" refNo="ARCHIVE REF: FUT-PROB-1968" />

      {/* Concentric computational rings */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none" strokeDasharray="3,3">
        <circle cx="250" cy="250" r="160" />
        <circle cx="250" cy="250" r="130" strokeDasharray="1,1" />
        <circle cx="250" cy="250" r="90" strokeWidth="1.5" strokeDasharray="none" />
      </g>

      {/* Difference 0: Outer calculating orbit ticks */}
      <g stroke="#1a1a1a" strokeWidth="1">
        {isLeft ? (
          // 12 ticks
          Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return (
              <line key={i} x1={250 + Math.cos(rad) * 160} y1={250 + Math.sin(rad) * 160} x2={250 + Math.cos(rad) * 175} y2={250 + Math.sin(rad) * 175} />
            );
          })
        ) : (
          // Only 6 ticks (Difference)
          Array.from({ length: 6 }).map((_, i) => {
            const rad = (i * 60 * Math.PI) / 180;
            return (
              <line key={i} x1={250 + Math.cos(rad) * 160} y1={250 + Math.sin(rad) * 160} x2={250 + Math.cos(rad) * 172} y2={250 + Math.sin(rad) * 172} stroke="#d94141" strokeWidth="1.5" />
            );
          })
        )}
      </g>

      {/* Difference 1: Central wheel spokes */}
      <g stroke="#1a1a1a" strokeWidth="1.5" fill="none">
        <circle cx="250" cy="250" r="30" />
        {isLeft ? (
          // 6 detailed radial spokes
          Array.from({ length: 6 }).map((_, i) => {
            const rad = (i * 60 * Math.PI) / 180;
            return (
              <line key={i} x1="250" y1="250" x2={250 + Math.cos(rad) * 30} y2={250 + Math.sin(rad) * 30} />
            );
          })
        ) : (
          // Solid disk with 3 small inner holes instead of spokes
          <g>
            <circle cx="250" cy="250" r="30" fill="url(#extra-hatch)" />
            <circle cx="250" cy="242" r="4" fill="#faf6eb" stroke="#d94141" strokeWidth="1" />
            <circle cx="243" cy="255" r="4" fill="#faf6eb" stroke="#d94141" strokeWidth="1" />
            <circle cx="257" cy="255" r="4" fill="#faf6eb" stroke="#d94141" strokeWidth="1" />
          </g>
        )}
        <circle cx="250" cy="250" r="8" fill="#1a1a1a" />
      </g>

      {/* Difference 2: Bottom-left probability graph curve */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="70" y="320" width="100" height="80" rx="1" fill="#faf4ea" />
        {isLeft ? (
          // Gaussian distribution Bell curve
          <path d="M 75,390 C 100,390 110,330 120,330 C 130,330 140,390 165,390" strokeWidth="2.0" />
        ) : (
          // Plain linear diagonal (Difference)
          <line x1="75" y1="385" x2="165" y2="330" strokeWidth="2.0" stroke="#d94141" />
        )}
        <line x1="120" y1="320" x2="120" y2="400" strokeDasharray="1,2" opacity="0.4" />
      </g>

      {/* Difference 3: Bottom-right slider controller weight value */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="330" y="320" width="100" height="80" rx="1" />
        <line x1="380" y1="330" x2="380" y2="390" strokeWidth="1.5" />
        {isLeft ? (
          // High active marker position (0.99)
          <g>
            <rect x="365" y="335" width="30" height="12" fill="#1a1a1a" rx="1" />
            <text x="380" y="344" className="font-mono text-[7px] fill-[#faf6eb]" stroke="none" textAnchor="middle">0.99</text>
          </g>
        ) : (
          // Low marker position (0.01) (Difference)
          <g>
            <rect x="365" y="372" width="30" height="12" fill="#d94141" rx="1" stroke="#1a1a1a" />
            <text x="380" y="381" className="font-mono text-[7px] fill-[#faf6eb]" stroke="none" textAnchor="middle">0.01</text>
          </g>
        )}
      </g>

      {/* Difference 4: Right balance pendulum rings */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none">
        <line x1="410" y1="130" x2="410" y2="210" strokeWidth="1.5" />
        {isLeft ? (
          // Two stacked heavy brass balancing rings
          <g fill="#1a1a1a">
            <rect x="398" y="180" width="24" height="8" rx="1" />
            <rect x="401" y="189" width="18" height="8" rx="1" />
          </g>
        ) : (
          // Single balancing weight (Difference)
          <rect x="398" y="180" width="24" height="10" rx="1" fill="#d94141" />
        )}
      </g>

      {/* Clickable hotspots */}
      <circle cx={250} cy={100} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(0); }} />
      <circle cx={250} cy={250} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(1); }} />
      <circle cx={120} cy={360} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(2); }} />
      <circle cx={380} cy={360} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(3); }} />
      <circle cx={410} cy={200} r={58} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(4); }} />

      {/* Overlays */}
      {foundDiffs.includes(0) && <SketchyRedCircle cx={250} cy={100} r={24} />}
      {foundDiffs.includes(1) && <SketchyRedCircle cx={250} cy={250} r={24} />}
      {foundDiffs.includes(2) && <SketchyRedCircle cx={120} cy={360} r={24} />}
      {foundDiffs.includes(3) && <SketchyRedCircle cx={380} cy={360} r={24} />}
      {foundDiffs.includes(4) && <SketchyRedCircle cx={410} cy={200} r={20} />}
    </svg>
  );
};

// --------------------------------------------------------------------
// PUZZLE 8: THE ATMOSPHERIC BUREAU
// --------------------------------------------------------------------
export const PuzzleEightSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss }) => {
  const isLeft = side === 'left';
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full select-none bg-[#faf6eb] border-2 border-black" onClick={onMiss} style={{ filter: 'contrast(1.05) brightness(0.98)' }}>
      <SVGDefs />
      <rect width="500" height="500" fill="url(#extra-tech-grid)" pointerEvents="none" />
      <TechnicalFrame title="标本编号 VIII // 大气管理局" subtitle="图 8 - 电离舱闪电激发与精密液位气压机" refNo="ARCHIVE REF: ATMO-CLIM-8" />

      {/* Central barometric glass sphere */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <circle cx="250" cy="220" r="50" />
        <circle cx="250" cy="220" r="46" strokeDasharray="1,3" opacity="0.5" />
        
        {/* Difference 0: Water/Vapor fluid level inside sphere */}
        {isLeft ? (
          // High water line with turbulent vapor curves
          <g>
            <path d="M 203,230 Q 225,215 250,225 T 297,230" strokeWidth="1.5" />
            <path d="M 220,195 Q 235,180 250,195 T 280,190" strokeWidth="0.8" opacity="0.6" />
          </g>
        ) : (
          // Calm low water line (Difference)
          <path d="M 201,245 L 299,245" strokeWidth="1.5" stroke="#d94141" />
        )}
      </g>

      {/* Difference 1: Electricity discharges from Left Spark Tower */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <line x1="130" y1="170" x2="130" y2="270" strokeWidth="2" />
        <circle cx="130" cy="170" r="6" fill="#1a1a1a" />
        {isLeft ? (
          // High discharge sparks splaying toward central sphere
          <g strokeWidth="1.5">
            <path d="M 136,170 Q 160,150 195,185" />
            <path d="M 136,170 Q 155,185 198,205" />
            <circle cx="155" cy="160" r="1.5" fill="#1a1a1a" />
          </g>
        ) : (
          // Cold and empty (Difference)
          <circle cx="130" cy="170" r="2" fill="#faf6eb" stroke="#d94141" />
        )}
      </g>

      {/* Difference 2: Right compass direction wind vane arrow */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <circle cx="360" cy="160" r="18" />
        {isLeft ? (
          // Pointing North-East
          <line x1="348" y1="172" x2="372" y2="148" strokeWidth="2" markerEnd="url(#arrow)" />
        ) : (
          // Pointing South-West (Difference)
          <line x1="372" y1="148" x2="348" y2="172" strokeWidth="2" stroke="#d94141" />
        )}
        <text x="360" y="138" className="font-mono text-[5px] fill-[#1a1a1a]" stroke="none" textAnchor="middle">N</text>
      </g>

      {/* Difference 3: Pressure release valve knurling (Bottom Left) */}
      <g stroke="#1a1a1a" strokeWidth="1.5" fill="none">
        <circle cx="150" cy="360" r="18" />
        <circle cx="150" cy="360" r="12" />
        {isLeft ? (
          // Tightly spaced radial grip teeth
          Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return (
              <line key={i} x1={150 + Math.cos(rad) * 12} y1={360 + Math.sin(rad) * 12} x2={150 + Math.cos(rad) * 18} y2={360 + Math.sin(rad) * 18} />
            );
          })
        ) : (
          // Completely smooth ring surface (Difference)
          <circle cx="150" cy="360" r="15" stroke="#d94141" strokeWidth="1" strokeDasharray="3,3" />
        )}
      </g>

      {/* Difference 4: Condensation drip drops (Bottom Right) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="335" y="320" width="30" height="50" rx="1" />
        <line x1="350" y1="280" x2="350" y2="320" strokeWidth="1.5" />
        {isLeft ? (
          // 3 falling water droplets
          <g fill="#1a1a1a">
            <path d="M 350,330 Q 348,335 350,338 Q 352,335 350,330" />
            <path d="M 350,345 Q 348,350 350,353 Q 352,350 350,345" />
            <path d="M 350,360 Q 348,365 350,368 Q 352,365 350,360" />
          </g>
        ) : (
          // Dry glass tube (Difference)
          <line x1="340" y1="345" x2="360" y2="345" stroke="#d94141" strokeWidth="1" />
        )}
      </g>

      {/* Clickable hotspots */}
      <circle cx={250} cy={220} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(0); }} />
      <circle cx={130} cy={170} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(1); }} />
      <circle cx={360} cy={160} r={58} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(2); }} />
      <circle cx={150} cy={360} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(3); }} />
      <circle cx={350} cy={360} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(4); }} />

      {/* Overlays */}
      {foundDiffs.includes(0) && <SketchyRedCircle cx={250} cy={220} r={24} />}
      {foundDiffs.includes(1) && <SketchyRedCircle cx={130} cy={170} r={24} />}
      {foundDiffs.includes(2) && <SketchyRedCircle cx={360} cy={160} r={20} />}
      {foundDiffs.includes(3) && <SketchyRedCircle cx={150} cy={360} r={24} />}
      {foundDiffs.includes(4) && <SketchyRedCircle cx={350} cy={360} r={22} />}
    </svg>
  );
};

// --------------------------------------------------------------------
// PUZZLE 9: THE WORLD SIMULATION CHAMBER
// --------------------------------------------------------------------
export const PuzzleNineSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss }) => {
  const isLeft = side === 'left';
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full select-none bg-[#faf6eb] border-2 border-black" onClick={onMiss} style={{ filter: 'contrast(1.05) brightness(0.98)' }}>
      <SVGDefs />
      <rect width="500" height="500" fill="url(#extra-tech-grid)" pointerEvents="none" />
      <TechnicalFrame title="标本编号 IX // 世界模拟舱" subtitle="图 9 - 宏观城市建模、交通枢纽与穹顶微循环系统" refNo="ARCHIVE REF: SIM-GLOB-12" />

      {/* Heavy base stand */}
      <rect x="100" y="380" width="300" height="30" rx="2" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d="M 250,80 C 130,80 80,240 80,380 L 420,380 C 420,240 370,80 250,80 Z" fill="none" stroke="#1a1a1a" strokeWidth="2" /> {/* Dome Glass */}

      {/* Difference 4: Dome top ventilation fan blades */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none">
        <circle cx="250" cy="120" r="15" />
        {isLeft ? (
          // Active fan blade slices
          <g>
            <path d="M 250,120 L 250,105 M 250,120 L 250,135 M 250,120 L 235,120 M 250,120 L 265,120" strokeWidth="1.5" />
            <path d="M 250,120 L 239,109 M 250,120 L 261,131 M 250,120 L 239,131 M 250,120 L 261,109" />
          </g>
        ) : (
          // Solid blank cover plate (Difference)
          <circle cx="250" cy="120" r="14" fill="#1a1a1a" />
        )}
      </g>

      {/* Difference 0: Factory chimney smoke plumes (West Side) */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none">
        <rect x="140" y="240" width="40" height="30" />
        <line x1="150" y1="240" x2="150" y2="210" strokeWidth="2.5" />
        <line x1="170" y1="240" x2="170" y2="215" strokeWidth="2.5" />
        {isLeft ? (
          // 2 plumes of billowing gas
          <g>
            <path d="M 150,210 Q 135,180 145,160 T 130,140" strokeWidth="1.2" />
            <path d="M 170,215 Q 185,190 175,170 T 190,150" strokeWidth="1" />
          </g>
        ) : (
          // Clean chimney output (Difference)
          <circle cx="150" cy="205" r="1.5" fill="#faf6eb" stroke="#d94141" />
        )}
      </g>

      {/* Difference 3: Transmission waves from eastern hill radio tower */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <path d="M 330,260 L 350,220 L 370,260 Z" />
        <line x1="350" y1="220" x2="350" y2="190" strokeWidth="1.5" />
        <circle cx="350" cy="190" r="3" fill="#1a1a1a" />
        {isLeft ? (
          // Radio wave concentric arcs
          <g opacity="0.65">
            <path d="M 345,185 A 8,8 0 0,1 355,185" />
            <path d="M 340,180 A 15,15 0 0,1 360,180" />
            <path d="M 335,175 A 22,22 0 0,1 365,175" />
          </g>
        ) : (
          // Single flat line arrow (Difference)
          <line x1="350" y1="180" x2="350" y2="170" stroke="#d94141" strokeWidth="1.5" />
        )}
      </g>

      {/* Difference 1: Miniature Suspension Bridge Tension Cables (Bottom Center) */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none">
        <line x1="220" y1="340" x2="280" y2="340" strokeWidth="2" />
        <line x1="230" y1="340" x2="230" y2="310" strokeWidth="1.5" />
        <line x1="270" y1="340" x2="270" y2="310" strokeWidth="1.5" />
        {isLeft ? (
          // Delicate bridge cable ties
          <g strokeWidth="0.8">
            <path d="M 220,340 Q 250,310 280,340" strokeWidth="1.2" />
            <line x1="240" y1="324" x2="240" y2="340" />
            <line x1="250" y1="321" x2="250" y2="340" />
            <line x1="260" y1="324" x2="260" y2="340" />
          </g>
        ) : (
          // Bare solid girder block with no cable curves
          <rect x="230" y="330" width="40" height="10" fill="url(#extra-hatch-dense)" stroke="#d94141" strokeWidth="0.8" />
        )}
      </g>

      {/* Difference 2: Bottom locking rim hex bolts */}
      <g stroke="#1a1a1a" strokeWidth="1">
        {isLeft ? (
          // 6 bolts equally spaced along base
          <g fill="#1a1a1a" stroke="none">
            <circle cx="130" cy="395" r="3.5" />
            <circle cx="178" cy="395" r="3.5" />
            <circle cx="226" cy="395" r="3.5" />
            <circle cx="274" cy="395" r="3.5" />
            <circle cx="322" cy="395" r="3.5" />
            <circle cx="370" cy="395" r="3.5" />
          </g>
        ) : (
          // Only 4 bolts (Difference)
          <g fill="#1a1a1a" stroke="none">
            <circle cx="130" cy="395" r="3.5" />
            <circle cx="210" cy="395" r="3.5" />
            <circle cx="290" cy="395" r="3.5" />
            <circle cx="370" cy="395" r="3.5" />
            {/* missing 2 locations represented with bare holes */}
            <circle cx="178" cy="395" r="1.5" fill="#d94141" />
            <circle cx="322" cy="395" r="1.5" fill="#d94141" />
          </g>
        )}
      </g>

      {/* Clickable hotspots */}
      <circle cx={160} cy={200} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(0); }} />
      <circle cx={250} cy={330} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(1); }} />
      <circle cx={250} cy={395} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(2); }} />
      <circle cx={350} cy={190} r={58} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(3); }} />
      <circle cx={250} cy={120} r={54} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(4); }} />

      {/* Overlays */}
      {foundDiffs.includes(0) && <SketchyRedCircle cx={160} cy={200} r={24} />}
      {foundDiffs.includes(1) && <SketchyRedCircle cx={250} cy={330} r={24} />}
      {foundDiffs.includes(2) && <SketchyRedCircle cx={250} cy={395} r={24} />}
      {foundDiffs.includes(3) && <SketchyRedCircle cx={350} cy={190} r={20} />}
      {foundDiffs.includes(4) && <SketchyRedCircle cx={250} cy={120} r={18} />}
    </svg>
  );
};

// --------------------------------------------------------------------
// PUZZLE 10: THE OBSERVER
// --------------------------------------------------------------------
export const PuzzleTenSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss }) => {
  const isLeft = side === 'left';
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full select-none bg-[#faf6eb] border-2 border-black" onClick={onMiss} style={{ filter: 'contrast(1.05) brightness(0.98)' }}>
      <SVGDefs />
      <rect width="500" height="500" fill="url(#extra-tech-grid)" pointerEvents="none" />
      <TechnicalFrame title="标本编号 X // 观测者视差角" subtitle="图 10 - 生物突触视网膜镜与机器传感器双向投射" refNo="ARCHIVE REF: OBSV-402-B" />

      {/* Central Viewfinder ring */}
      <g stroke="#1a1a1a" strokeWidth="1.5" fill="none">
        <circle cx="250" cy="250" r="110" />
        <circle cx="250" cy="250" r="102" strokeDasharray="3,3" opacity="0.5" />
      </g>

      {/* Difference 2: Coordinate system crosshair grids */}
      <g stroke="#1a1a1a" strokeWidth="0.8">
        <line x1="140" y1="250" x2="360" y2="250" strokeDasharray="10,5" />
        <line x1="250" y1="140" x2="250" y2="360" strokeDasharray="10,5" />
        {isLeft ? (
          // Extra trigonometric angle arc sweeps
          <g fill="none">
            <path d="M 280,250 A 30,30 0 0,0 271,229" strokeWidth="1.2" />
            <text x="282" y="224" className="font-mono text-[6px] fill-[#1a1a1a]" stroke="none">φ=32.4°</text>
          </g>
        ) : (
          // Straight diagonal line only (Difference)
          <line x1="250" y1="250" x2="320" y2="180" stroke="#d94141" strokeWidth="1.2" />
        )}
      </g>

      {/* Difference 0: Observer eye pupil and retina core (Left) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="90" y="160" width="100" height="80" rx="1" />
        <ellipse cx="140" cy="200" rx="30" ry="18" />
        {isLeft ? (
          // High-precision dilated circular concentric iris
          <g>
            <circle cx="140" cy="200" r="12" fill="#1a1a1a" />
            <circle cx="140" cy="200" r="16" strokeDasharray="1,1" />
            <line x1="140" y1="180" x2="140" y2="220" strokeWidth="0.5" />
          </g>
        ) : (
          // Extremely contracted microscopic pupil (Difference)
          <g fill="#1a1a1a">
            <circle cx="140" cy="200" r="3" />
            <ellipse cx="140" cy="200" rx="20" ry="12" stroke="#d94141" />
          </g>
        )}
      </g>

      {/* Difference 1: Sensor working indicators on motherboard array (Right) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="310" y="160" width="100" height="80" rx="1" />
        <rect x="325" y="180" width="70" height="40" fill="url(#extra-hatch-dense)" />
        {isLeft ? (
          // 4 illuminated indicator bulbs (clean circles)
          <g fill="#faf6eb" stroke="#1a1a1a">
            <circle cx="335" cy="210" r="3.5" fill="#1a1a1a" />
            <circle cx="350" cy="210" r="3.5" fill="#1a1a1a" />
            <circle cx="365" cy="210" r="3.5" fill="#1a1a1a" />
            <circle cx="380" cy="210" r="3.5" fill="#1a1a1a" />
          </g>
        ) : (
          // Only 2 bulbs are lit (Difference)
          <g fill="#faf6eb" stroke="#1a1a1a">
            <circle cx="335" cy="210" r="3.5" fill="#1a1a1a" />
            <circle cx="350" cy="210" r="3.5" fill="#1a1a1a" />
            <circle cx="365" cy="210" r="1" fill="#faf6eb" stroke="#d94141" />
            <circle cx="380" cy="210" r="1" fill="#faf6eb" stroke="#d94141" />
          </g>
        )}
      </g>

      {/* Difference 4: Top ribbon telemetry cable lines */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="270" y="100" width="60" height="40" />
        {isLeft ? (
          // 5 parallel high-density rib cables
          <g strokeWidth="0.8">
            <line x1="280" y1="100" x2="280" y2="140" />
            <line x1="290" y1="100" x2="290" y2="140" />
            <line x1="300" y1="100" x2="300" y2="140" />
            <line x1="310" y1="100" x2="310" y2="140" />
            <line x1="320" y1="100" x2="320" y2="140" />
          </g>
        ) : (
          // Smooth single wire path (Difference)
          <line x1="300" y1="100" x2="300" y2="140" strokeWidth="3" stroke="#d94141" />
        )}
      </g>

      {/* Difference 3: Bottom Mode Selection lever position */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="150" y="350" width="200" height="40" rx="1" />
        <line x1="210" y1="370" x2="290" y2="370" strokeWidth="3" />
        {isLeft ? (
          // Slipped to Left (OBSERVE)
          <g>
            <circle cx="210" cy="370" r="8" fill="#1a1a1a" />
            <text x="210" y="343" className="font-mono text-[6px] fill-[#1a1a1a] font-bold" stroke="none" textAnchor="middle">OBSERVE</text>
          </g>
        ) : (
          // Slipped to Right (CALIBRATE) (Difference)
          <g>
            <circle cx="290" cy="370" r="8" fill="#d94141" stroke="#1a1a1a" />
            <text x="290" y="343" className="font-mono text-[6px] fill-[#d94141] font-bold" stroke="none" textAnchor="middle">CALIBRATE</text>
          </g>
        )}
      </g>

      {/* Clickable hotspots */}
      <circle cx={140} cy={200} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(0); }} />
      <circle cx={350} cy={200} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(1); }} />
      <circle cx={250} cy={250} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(2); }} />
      <circle cx={210} cy={380} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(3); }} />
      <circle cx={300} cy={130} r={58} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(4); }} />

      {/* Overlays */}
      {foundDiffs.includes(0) && <SketchyRedCircle cx={140} cy={200} r={24} />}
      {foundDiffs.includes(1) && <SketchyRedCircle cx={350} cy={200} r={24} />}
      {foundDiffs.includes(2) && <SketchyRedCircle cx={250} cy={250} r={24} />}
      {foundDiffs.includes(3) && <SketchyRedCircle cx={210} cy={380} r={22} />}
      {foundDiffs.includes(4) && <SketchyRedCircle cx={300} cy={130} r={18} />}
    </svg>
  );
};

// --------------------------------------------------------------------
// PUZZLE 11: THE MIRROR SUBJECT
// --------------------------------------------------------------------
export const PuzzleElevenSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss }) => {
  const isLeft = side === 'left';
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full select-none bg-[#faf6eb] border-2 border-black" onClick={onMiss} style={{ filter: 'contrast(1.05) brightness(0.98)' }}>
      <SVGDefs />
      <rect width="500" height="500" fill="url(#extra-tech-grid)" pointerEvents="none" />
      <TechnicalFrame title="标本编号 XI // 镜像主体" subtitle="图 11 - 双侧颅脑一致性定位与高倍率视神经校准" refNo="ARCHIVE REF: MIRR-SUBJ-402" />

      {/* Highly symmetrical double-headed phrenology chart */}
      <path d="M 250,100 C 180,100 130,150 130,220 C 130,260 150,280 150,320 L 210,380 L 250,380 Z" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d="M 250,100 C 320,100 370,150 370,220 C 370,260 350,280 350,320 L 290,380 L 250,380 Z" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <line x1="250" y1="100" x2="250" y2="420" strokeWidth="1" strokeDasharray="5,5" /> {/* Symmetrical division line */}

      {/* Difference 0: Cerebral map "MEMORIA" zone (Left hemisphere only) */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none">
        {isLeft ? (
          // Detailed phrenological section
          <g>
            <path d="M 180,130 Q 210,120 230,150 Z" fill="url(#extra-hatch)" />
            <text x="205" y="142" className="font-mono text-[5px] fill-[#1a1a1a] font-bold" stroke="none" textAnchor="middle">MEMORIA</text>
          </g>
        ) : (
          // Blank unmapped sector (Difference)
          <path d="M 180,130 Q 210,120 230,150 Z" stroke="#d94141" strokeDasharray="2,2" />
        )}
      </g>

      {/* Difference 1: Left brain probe/electrode wire bundle */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <circle cx="130" cy="260" r="5" fill="#1a1a1a" />
        {isLeft ? (
          // 3 active splaying neural wires
          <g strokeWidth="1">
            <path d="M 125,260 Q 100,240 85,250" />
            <path d="M 125,260 Q 95,265 80,270" />
            <path d="M 125,260 Q 100,290 85,300" />
          </g>
        ) : (
          // Single wire hook (Difference)
          <path d="M 125,260 Q 90,270 80,280" stroke="#d94141" strokeWidth="1.5" />
        )}
      </g>

      {/* Difference 2: Collar connection metal hinge bolt (Bottom center) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <circle cx="230" cy="380" r="10" />
        {isLeft ? (
          // Detailed dual slot screw driver groove
          <g strokeWidth="1.8">
            <line x1="223" y1="380" x2="237" y2="380" />
            <line x1="230" y1="373" x2="230" y2="387" />
          </g>
        ) : (
          // Smooth circular flat rivet (Difference)
          <circle cx="230" cy="380" r="4" fill="#d94141" />
        )}
      </g>

      {/* Difference 3: Right side dashboard gauge needle */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="300" y="290" width="60" height="40" rx="1" fill="#faf4ea" />
        <path d="M 310,325 A 20,20 0 0,1 350,325" />
        {isLeft ? (
          // Points to high extreme (8.4)
          <line x1="330" y1="325" x2="345" y2="310" strokeWidth="2" />
        ) : (
          // Points to median center (4.2) (Difference)
          <line x1="330" y1="325" x2="330" y2="305" strokeWidth="2" stroke="#d94141" />
        )}
      </g>

      {/* Difference 4: Right outer calibration scale lines */}
      <g stroke="#1a1a1a" strokeWidth="1">
        {isLeft ? (
          // Fine ticks spaced 5mm (10 ticks)
          Array.from({ length: 11 }).map((_, i) => (
            <line key={i} x1="420" y1={200 + i * 8} x2="435" y2={200 + i * 8} />
          ))
        ) : (
          // Coarse ticks spaced 10mm (only 5 ticks) (Difference)
          Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1="420" y1={200 + i * 16} x2="435" y2={200 + i * 16} stroke="#d94141" strokeWidth="1.5" />
          ))
        )}
      </g>

      {/* Clickable hotspots */}
      <circle cx={205} cy={135} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(0); }} />
      <circle cx={130} cy={260} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(1); }} />
      <circle cx={230} cy={380} r={58} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(2); }} />
      <circle cx={350} cy={320} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(3); }} />
      <circle cx={420} cy={260} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(4); }} />

      {/* Overlays */}
      {foundDiffs.includes(0) && <SketchyRedCircle cx={205} cy={135} r={24} />}
      {foundDiffs.includes(1) && <SketchyRedCircle cx={130} cy={260} r={24} />}
      {foundDiffs.includes(2) && <SketchyRedCircle cx={230} cy={380} r={20} />}
      {foundDiffs.includes(3) && <SketchyRedCircle cx={350} cy={320} r={22} />}
      {foundDiffs.includes(4) && <SketchyRedCircle cx={420} cy={260} r={24} />}
    </svg>
  );
};

// --------------------------------------------------------------------
// PUZZLE 12: SUBJECT #402
// --------------------------------------------------------------------
export const PuzzleTwelveSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss }) => {
  const isLeft = side === 'left';
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full select-none bg-[#faf6eb] border-2 border-black" onClick={onMiss} style={{ filter: 'contrast(1.05) brightness(0.98)' }}>
      <SVGDefs />
      <rect width="500" height="500" fill="url(#extra-tech-grid)" pointerEvents="none" />
      <TechnicalFrame title="机密标本卷宗 // 主体 #402" subtitle="图 12 - 历次测试对象照片、物理指纹及档案归档柜" refNo="STRICTLY SECRET // CLASS 1A" />

      {/* Main folder sheet background */}
      <rect x="70" y="80" width="360" height="340" rx="4" fill="#faf4ea" stroke="#1a1a1a" strokeWidth="1.5" />
      <line x1="70" y1="280" x2="430" y2="280" stroke="#1a1a1a" strokeWidth="1.5" />

      {/* Difference 2: Paper clip style holding notes (Top Center) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        {isLeft ? (
          // Classical wire double paper clip
          <path d="M 240,90 Q 250,65 260,90 T 250,115 T 245,100" strokeWidth="1.5" />
        ) : (
          // Heavy metal bulldog spring clip clamp (Difference)
          <path d="M 235,90 L 265,90 L 265,105 L 235,105 Z M 240,90 L 250,75 L 260,90 Z" fill="url(#extra-hatch-dense)" stroke="#d94141" strokeWidth="1" />
        )}
      </g>

      {/* Difference 0: Polaroid photo profile of face with glasses */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="110" y="140" width="100" height="110" fill="none" />
        <rect x="120" y="150" width="80" height="80" fill="#1a1a1a" />
        {isLeft ? (
          // White ink outline of glasses/beard on the dark face profile
          <g stroke="#faf6eb" strokeWidth="1.5">
            <circle cx="150" cy="180" r="8" />
            <circle cx="170" cy="180" r="8" />
            <line x1="158" y1="180" x2="162" y2="180" />
            <path d="M 135,210 Q 160,225 185,210" strokeWidth="1" />
          </g>
        ) : (
          // Blank pitch-black outline with no facial specs (Difference)
          <circle cx="160" cy="180" r="2" fill="#faf6eb" stroke="#d94141" />
        )}
        <text x="160" y="244" className="font-mono text-[5px] fill-[#1a1a1a] font-bold" stroke="none" textAnchor="middle">SUBJECT_REF_1968</text>
      </g>

      {/* Difference 1: Classified Ink Seal stamp (Right center) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <circle cx="340" cy="180" r="30" strokeDasharray="3,3" />
        {isLeft ? (
          <g stroke="#1a1a1a">
            <circle cx="340" cy="180" r="25" />
            <text x="340" y="184" className="font-mono text-[6px] fill-[#1a1a1a] font-bold" stroke="none" textAnchor="middle">CLASSIFIED</text>
          </g>
        ) : (
          // Modified stamp reading UNCONFIRMED
          <g stroke="#d94141">
            <circle cx="340" cy="180" r="25" />
            <text x="340" y="184" className="font-mono text-[5px] fill-[#d94141] font-bold" stroke="none" textAnchor="middle">UNCONFIRMED</text>
          </g>
        )}
      </g>

      {/* Difference 4: Second drawer labels (Bottom Left Cabinet) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="110" y="320" width="100" height="70" rx="1" />
        <rect x="125" y="340" width="70" height="20" rx="0.5" fill="#faf4ea" />
        {isLeft ? (
          <text x="160" y="352" className="font-mono text-[7px] fill-[#1a1a1a] font-bold" stroke="none" textAnchor="middle">EXP 01-12</text>
        ) : (
          // Altered drawer label (Difference)
          <text x="160" y="352" className="font-mono text-[7px] fill-[#d94141] font-bold" stroke="none" textAnchor="middle">CLOSED</text>
        )}
      </g>

      {/* Difference 3: Red margin ink annotations (Bottom Right) */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        <rect x="250" y="310" width="140" height="80" strokeDasharray="3,1" opacity="0.4" />
        {isLeft ? (
          <g stroke="none">
            <text x="260" y="335" className="font-serif italic text-[8px] fill-[#d94141] font-semibold" stroke="none">监测协议已激活...</text>
            <text x="260" y="355" className="font-serif italic text-[7px] fill-[#d94141]" stroke="none">"眼部敏锐度指标正常"</text>
            <text x="260" y="375" className="font-mono text-[5px] fill-[#1a1a1a] opacity-50" stroke="none">BELL-LAB-68-SEC</text>
          </g>
        ) : (
          // Spookier altered note (Difference)
          <g stroke="none">
            <text x="260" y="335" className="font-serif italic text-[8px] fill-[#d94141] font-bold" stroke="none">替换该实验主体...</text>
            <text x="260" y="355" className="font-serif italic text-[7px] fill-[#d94141]" stroke="none">"他发现了这个抽屉"</text>
            <text x="260" y="375" className="font-mono text-[5px] fill-[#d94141]" stroke="none">TERMINATE_REF_402</text>
          </g>
        )}
      </g>

      {/* Clickable hotspots */}
      <circle cx={160} cy={220} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(0); }} />
      <circle cx={340} cy={180} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(1); }} />
      <circle cx={250} cy={100} r={58} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(2); }} />
      <circle cx={320} cy={360} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(3); }} />
      <circle cx={160} cy={350} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(4); }} />

      {/* Overlays */}
      {foundDiffs.includes(0) && <SketchyRedCircle cx={160} cy={220} r={24} />}
      {foundDiffs.includes(1) && <SketchyRedCircle cx={340} cy={180} r={24} />}
      {foundDiffs.includes(2) && <SketchyRedCircle cx={250} cy={100} r={20} />}
      {foundDiffs.includes(3) && <SketchyRedCircle cx={320} cy={360} r={24} />}
      {foundDiffs.includes(4) && <SketchyRedCircle cx={160} cy={350} r={24} />}
    </svg>
  );
};

// --------------------------------------------------------------------
// PUZZLE 13: CALIBRATION COMPLETE (FINAL LEVEL)
// --------------------------------------------------------------------
export const PuzzleThirteenSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss }) => {
  // Purely identical, abstract, circular calibrator target
  // Clicking any quadrant records observer focus.
  return (
    <svg viewBox="0 0 500 500" className="w-full h-full select-none bg-[#faf6eb] border-2 border-black" onClick={onMiss} style={{ filter: 'contrast(1.05) brightness(0.98)' }}>
      <SVGDefs />
      <rect width="500" height="500" fill="url(#extra-tech-grid)" pointerEvents="none" />
      <TechnicalFrame title="最终标本 XIII // 认知校准终点" subtitle="图 13 - 终极视线微运动定焦测量与反射机制" refNo="ARCHIVE REF: COGN-FINAL" />

      {/* Mesmerizing symmetrical circular lens focus moiré geometric pattern */}
      <g stroke="#1a1a1a" strokeWidth="0.8" fill="none">
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx="250" cy="250" r={10 + i * 11} strokeDasharray={i % 3 === 0 ? "5,5" : "none"} />
        ))}
        {Array.from({ length: 24 }).map((_, i) => {
          const rad = (i * 15 * Math.PI) / 180;
          return (
            <line key={i} x1="250" y1="250" x2={250 + Math.cos(rad) * 210} y2={250 + Math.sin(rad) * 210} strokeWidth="0.5" opacity="0.4" />
          );
        })}
        {/* Quadrant focus circles */}
        <circle cx="150" cy="150" r="16" strokeWidth="1.5" />
        <circle cx="350" cy="150" r="16" strokeWidth="1.5" />
        <circle cx="150" cy="350" r="16" strokeWidth="1.5" />
        <circle cx="350" cy="350" r="16" strokeWidth="1.5" />
        <circle cx="250" cy="250" r="16" strokeWidth="2.0" />
      </g>

      {/* Clickable hotspots */}
      <circle cx={250} cy={250} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(0); }} />
      <circle cx={150} cy={150} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(1); }} />
      <circle cx={350} cy={150} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(2); }} />
      <circle cx={150} cy={350} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(3); }} />
      <circle cx={350} cy={350} r={62} className="fill-transparent stroke-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); onFindDiff(4); }} />

      {/* Overlays */}
      {foundDiffs.includes(0) && <SketchyRedCircle cx={250} cy={250} r={24} />}
      {foundDiffs.includes(1) && <SketchyRedCircle cx={150} cy={150} r={24} />}
      {foundDiffs.includes(2) && <SketchyRedCircle cx={350} cy={150} r={24} />}
      {foundDiffs.includes(3) && <SketchyRedCircle cx={150} cy={350} r={24} />}
      {foundDiffs.includes(4) && <SketchyRedCircle cx={350} cy={350} r={24} />}
    </svg>
  );
};
