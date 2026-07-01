import React from 'react';
import { PuzzleHitAreas } from './PuzzleHitAreas';

export { SketchyRedCircle } from './SketchyRedCircle';

// Common Hatching and Engraving Defs
const SVGDefs: React.FC = () => (
  <defs>
    {/* Clean diagonal hatching for general shading */}
    <pattern id="hatch-1" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#1a1a1a" strokeWidth="1" />
    </pattern>
    {/* Dense hatching for deep shadows */}
    <pattern id="hatch-dense" width="4" height="4" patternTransform="rotate(135 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="4" stroke="#1a1a1a" strokeWidth="1" />
    </pattern>
    {/* Vintage print stippling dot pattern */}
    <pattern id="stipple-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#1a1a1a" opacity="0.8" />
      <circle cx="7" cy="7" r="1.2" fill="#1a1a1a" opacity="0.8" />
      <circle cx="8" cy="2" r="0.8" fill="#1a1a1a" opacity="0.5" />
    </pattern>
    {/* Blueprint grid pattern */}
    <pattern id="tech-grid" width="40" height="40" patternUnits="userSpaceOnUse">
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

// --------------------------------------------------------------------
// PUZZLE 1: THE CREATION OF INTELLECT (Human & Robot Hand)
// Differences:
// 0: Robot Wrist Screw (Left has screw, Right is blank hole with threads)
// 1: Spark Branch (Left has detailed jagged multi-branch sparks, Right has single arc line)
// 2: Robot Index Joint Hinge (Left has ribbed hinge cylinder, Right is flat metal plate)
// 3: Robot Palm Connection Wire (Left has spiral spring power cord, Right is missing)
// 4: Human Wrist Shading (Left has full woodcut cross-hatching, Right has simple light hatching)
// --------------------------------------------------------------------
export const PuzzleOneSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss, onLeftPanelHint }) => {
  const isLeft = side === 'left';

  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full select-none bg-[#faf6eb] border-2 border-black"
      onClick={onMiss}
      style={{ filter: 'contrast(1.05) brightness(0.98)' }}
    >
      <SVGDefs />

      {/* Technical Grid Overlay */}
      <rect width="500" height="500" fill="url(#tech-grid)" pointerEvents="none" />

      {/* Blueprint Calibration Drafting Circles & Lines */}
      <g stroke="#1a1a1a" strokeWidth="0.5" opacity="0.03" pointerEvents="none">
        <circle cx="250" cy="250" r="190" fill="none" strokeDasharray="3,6" />
        <circle cx="250" cy="250" r="120" fill="none" strokeDasharray="1,4" />
        <line x1="20" y1="250" x2="480" y2="250" strokeDasharray="5,5" />
        <line x1="250" y1="20" x2="250" y2="480" strokeDasharray="5,5" />
        {/* Angle projection lines */}
        <line x1="50" y1="50" x2="450" y2="450" strokeDasharray="2,4" />
        <line x1="450" y1="50" x2="50" y2="450" strokeDasharray="2,4" />
      </g>

      {/* Technical Ruler Markings around the frame */}
      <g stroke="#1a1a1a" strokeWidth="0.8" opacity="0.1" className="font-mono text-[7px] fill-[#1a1a1a]" pointerEvents="none">
        {/* Top Ruler */}
        <line x1="15" y1="15" x2="485" y2="15" />
        {Array.from({ length: 48 }).map((_, i) => {
          const x = 15 + i * 10;
          const isMajor = i % 5 === 0;
          return (
            <g key={`top-${i}`}>
              <line x1={x} y1="15" x2={x} y2={isMajor ? "23" : "19"} />
              {isMajor && i > 0 && i < 45 && (
                <text x={x} y="28" textAnchor="middle" stroke="none" opacity="0.6">{i * 10}</text>
              )}
            </g>
          );
        })}
        {/* Left Ruler */}
        <line x1="15" y1="15" x2="15" y2="485" />
        {Array.from({ length: 48 }).map((_, i) => {
          const y = 15 + i * 10;
          const isMajor = i % 5 === 0;
          return (
            <g key={`left-${i}`}>
              <line x1="15" y1={y} x2={isMajor ? "23" : "19"} y2={y} />
              {isMajor && i > 0 && i < 45 && (
                <text x="31" y={y + 3} textAnchor="start" stroke="none" opacity="0.6">{i * 10}</text>
              )}
            </g>
          );
        })}
      </g>

      {/* Border outline inside */}
      <rect x="15" y="15" width="470" height="470" fill="none" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="5, 5" opacity="0.2" pointerEvents="none" />

      {/* Label overlays */}
      <text x="35" y="50" className="font-mono text-[10px] uppercase font-bold tracking-wider fill-[#1a1a1a]" opacity="0.7" stroke="none">
        标本编号 I-A // 神经突触联合义肢手
      </text>
      <text x="465" y="50" className="font-mono text-[10px] uppercase font-bold tracking-wider fill-[#1a1a1a]" opacity="0.7" textAnchor="end" stroke="none">
        坐标: 34.02-N // BELL LABS MEMO 1968
      </text>
      <text x="250" y="465" className="font-mono text-[8px] uppercase font-bold tracking-widest fill-[#1a1a1a]" opacity="0.6" textAnchor="middle" stroke="none">
        图 1 - 突触关联耦合与神经遥测电回路
      </text>

      {/* VINTAGE DRAFTING LABELS / CALLOUTS */}
      <g stroke="#1a1a1a" strokeWidth="0.8" opacity="0.6" className="font-mono text-[7px] fill-[#1a1a1a]" pointerEvents="none">
        {/* Callout A */}
        <path d="M 120,200 L 140,180 L 180,180" fill="none" />
        <polygon points="120,200 124,196 121,194" fill="#1a1a1a" />
        <text x="185" y="183" stroke="none">FIG 1.a: ORGANIC INTERFACE NODE</text>

        {/* Callout B */}
        <path d="M 320,200 L 300,180 L 260,180" fill="none" />
        <polygon points="320,200 316,196 319,194" fill="#1a1a1a" />
        <text x="255" y="183" textAnchor="end" stroke="none">SEC 4.c: SYNAPSE RECEPTOR</text>

        {/* Callout C */}
        <path d="M 90,320 L 110,340 L 150,340" fill="none" />
        <polygon points="90,320 94,324 91,326" fill="#1a1a1a" />
        <text x="155" y="343" stroke="none">EPIDERMAL SHEATH SHADING</text>

        {/* Callout D */}
        <path d="M 430,130 L 415,150 L 370,150" fill="none" />
        <polygon points="430,130 426,134 429,136" fill="#1a1a1a" />
        <text x="365" y="153" textAnchor="end" stroke="none">ACTUATOR HOUSING // PAT. 3402</text>
      </g>

      {/* HUMAN HAND - EXQUISITE 19TH-CENTURY WOODCUT ENGRAVING ARTWORK */}
      <g stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Hand Silhouette Outline */}
        <path d="M 15,335 C 35,335 52,330 72,324 C 92,314 102,295 112,280 L 126,275 C 131,273 136,277 136,283 L 131,305 C 121,330 106,350 81,365 C 61,375 31,380 15,380" />
        <path d="M 112,280 C 117,270 127,265 137,270 C 147,275 157,265 162,255 C 167,245 172,243 182,245 C 187,247 192,243 187,237 C 177,225 162,225 152,230 C 144,235 132,240 122,235 C 112,230 92,245 87,255" />
        
        {/* Anatomical shading lines following the contours of the skin (Woodcut Engraving effect) */}
        <path d="M 30,335 C 45,332 60,324 70,314" strokeWidth="0.8" opacity="0.5" />
        <path d="M 40,340 C 55,336 70,326 80,312" strokeWidth="0.8" opacity="0.5" />
        <path d="M 50,345 C 65,340 80,328 90,310" strokeWidth="0.8" opacity="0.5" />
        <path d="M 60,350 C 75,344 90,330 98,308" strokeWidth="0.8" opacity="0.5" />
        <path d="M 70,355 C 82,348 95,332 102,305" strokeWidth="0.8" opacity="0.5" />
        <path d="M 80,360 C 92,352 102,332 108,302" strokeWidth="0.8" opacity="0.5" />

        {/* Detailed Creases, Veins and Muscle Contours on Human Arm */}
        <path d="M 60,330 C 75,320 90,310 100,295" strokeWidth="1" opacity="0.4" />
        <path d="M 45,345 C 65,335 80,325 90,305" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.3" />
        {/* Veins */}
        <path d="M 55,360 Q 75,345 92,342 Q 105,330 115,295" strokeWidth="1.2" opacity="0.5" />
        <path d="M 75,362 Q 88,355 102,330" strokeWidth="0.8" opacity="0.4" />

        {/* Human Thumb (highly contoured joint) */}
        <path d="M 117,270 C 112,260 107,250 107,240 C 107,230 114,225 122,230 C 127,233 132,240 134,243" />
        {/* Thumbnail */}
        <path d="M 108,236 C 110,231 114,230 118,232" strokeWidth="1" />
        <path d="M 111,234 L 115,238" strokeWidth="0.8" opacity="0.5" />

        {/* Human Index Finger (Pointing with organic joint folds) */}
        <path d="M 148,247 L 175,243 C 185,241 190,245 195,245 C 198,245 200,247 201,248 L 202,248" />
        <path d="M 148,253 L 172,250 C 182,248 188,253 194,253 C 196,253 198,252 199,251 L 200,251" />
        {/* Index Fingernail & joint lines */}
        <path d="M 194,245 Q 198,245 199,248 L 197,250 Z" fill="#1a1a1a" opacity="0.3" />
        <path d="M 172,244 Q 174,249 173,252" strokeWidth="1" opacity="0.6" />
        <path d="M 185,243 Q 186,247 185,250" strokeWidth="1" opacity="0.6" />
        <path d="M 158,246 Q 159,251 158,253" strokeWidth="1" opacity="0.6" />

        {/* Human Middle Finger (Curled with shading lines) */}
        <path d="M 145,259 C 155,259 165,255 170,259 C 175,263 172,269 165,269 C 158,269 148,265 142,265" />
        {/* Ring Finger (Curled) */}
        <path d="M 138,267 C 148,267 158,263 162,267 C 166,271 163,276 155,276 C 148,276 140,272 135,272" />
        {/* Pinky Finger (Curled) */}
        <path d="M 132,275 C 140,275 148,271 151,275 C 154,279 150,283 142,283 C 135,283 130,279 125,279" />

        {/* Human skin creases / palm shading lines */}
        <path d="M 125,255 Q 135,260 140,253" strokeWidth="1" opacity="0.7" />
        <path d="M 112,250 Q 120,253 124,247" strokeWidth="1" opacity="0.7" />
        <path d="M 152,271 Q 158,274 160,269" strokeWidth="1" opacity="0.6" />
        
        {/* Human Shading (Hatching) - DIFFERENCE 4 */}
        <g strokeWidth="0.8" opacity="0.85">
          {isLeft ? (
            // Full exquisite woodcut cross-hatching (highly detailed engraving feel)
            <>
              {/* Primary hatching */}
              <line x1="15" y1="340" x2="55" y2="380" />
              <line x1="22" y1="340" x2="62" y2="380" />
              <line x1="29" y1="340" x2="69" y2="380" />
              <line x1="36" y1="340" x2="76" y2="380" />
              <line x1="43" y1="340" x2="83" y2="380" />
              <line x1="50" y1="340" x2="90" y2="380" />
              <line x1="57" y1="340" x2="97" y2="380" />
              <line x1="64" y1="340" x2="104" y2="380" />
              <line x1="71" y1="340" x2="111" y2="380" />
              <line x1="78" y1="340" x2="118" y2="380" />
              <line x1="85" y1="340" x2="125" y2="380" />
              <line x1="92" y1="340" x2="132" y2="380" />
              <line x1="99" y1="340" x2="139" y2="380" />
              
              {/* Secondary dense cross-hatching */}
              <line x1="55" y1="340" x2="15" y2="380" strokeWidth="0.6" />
              <line x1="62" y1="340" x2="22" y2="380" strokeWidth="0.6" />
              <line x1="69" y1="340" x2="29" y2="380" strokeWidth="0.6" />
              <line x1="76" y1="340" x2="36" y2="380" strokeWidth="0.6" />
              <line x1="83" y1="340" x2="43" y2="380" strokeWidth="0.6" />
              <line x1="90" y1="340" x2="50" y2="380" strokeWidth="0.6" />
              <line x1="97" y1="340" x2="57" y2="380" strokeWidth="0.6" />
              <line x1="104" y1="340" x2="64" y2="380" strokeWidth="0.6" />
              <line x1="111" y1="340" x2="71" y2="380" strokeWidth="0.6" />
              <line x1="118" y1="340" x2="78" y2="380" strokeWidth="0.6" />
              <line x1="125" y1="340" x2="85" y2="380" strokeWidth="0.6" />
            </>
          ) : (
            // Missing/sparse simple single-direction light hatching
            <>
              <line x1="15" y1="340" x2="55" y2="380" />
              <line x1="36" y1="340" x2="76" y2="380" />
              <line x1="57" y1="340" x2="97" y2="380" />
              <line x1="78" y1="340" x2="118" y2="380" />
            </>
          )}
        </g>
      </g>

      {/* THE ELECTRIC SPARK OF LIFE (High Voltage Telemetry Arc) - DIFFERENCE 1 */}
      <g stroke="#1a1a1a" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {isLeft ? (
          // Complex, gorgeous multi-branch electrical spark with voltage nodes and magnetic field lines
          <>
            <path d="M 201,248 L 220,238 L 235,255 L 255,237 L 270,253 L 290,245" strokeWidth="2.5" />
            {/* Fine secondary jagged bolt filaments */}
            <path d="M 220,238 L 214,221" strokeWidth="1.2" />
            <path d="M 220,238 L 228,225" strokeWidth="0.8" />
            <path d="M 235,255 L 243,272" strokeWidth="1.2" />
            <path d="M 235,255 L 224,268" strokeWidth="0.8" />
            <path d="M 255,237 L 250,218" strokeWidth="1.2" />
            <path d="M 270,253 L 282,267" strokeWidth="1.2" />
            <path d="M 270,253 L 261,268" strokeWidth="0.8" />
            <path d="M 215,245 L 230,260" strokeWidth="1" />
            <path d="M 250,240 L 260,255" strokeWidth="1" />
            
            {/* Floating energy ions & field charge indicators */}
            <circle cx="210" cy="228" r="1.5" fill="#1a1a1a" />
            <circle cx="246" cy="268" r="1.5" fill="#1a1a1a" />
            <circle cx="265" cy="224" r="1" fill="#1a1a1a" />
            <circle cx="282" cy="263" r="1.5" fill="#1a1a1a" />
            <circle cx="230" cy="215" r="1" fill="#1a1a1a" />
            
            {/* Field concentric circles representing electric potential */}
            <circle cx="240" cy="245" r="12" strokeWidth="0.5" strokeDasharray="1,3" opacity="0.6" />
            <circle cx="240" cy="245" r="24" strokeWidth="0.5" strokeDasharray="1,5" opacity="0.4" />
            <circle cx="240" cy="245" r="36" strokeWidth="0.5" strokeDasharray="2,6" opacity="0.2" />
          </>
        ) : (
          // Simplified, flat, single-line electric arc
          <>
            <path d="M 201,248 L 225,241 L 245,250 L 265,240 L 290,245" strokeWidth="2.5" />
            <path d="M 245,250 L 252,263" strokeWidth="1.2" />
            <circle cx="210" cy="230" r="1" fill="#1a1a1a" />
            <circle cx="282" cy="260" r="1" fill="#1a1a1a" />
          </>
        )}
      </g>

      {/* ROBOTIC HAND - 1968 MECHANICAL ENGINEERING Bell Labs Style */}
      <g stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Robot Forearm / Wrist base housing */}
        <path d="M 485,135 L 435,125 L 395,135 L 365,175 L 370,215 L 415,225 L 455,215 L 485,195" fill="url(#hatch-1)" />
        <path d="M 435,125 L 415,225" strokeWidth="1.5" />
        <path d="M 395,135 L 370,215" strokeWidth="1.5" />
        
        {/* Robot wrist plate detailing */}
        <rect x="435" y="140" width="45" height="50" rx="3" fill="#faf6eb" />
        <line x1="435" y1="165" x2="480" y2="165" strokeWidth="1.5" />
        
        {/* Detailed engineering micro-shading on the metal plate */}
        <line x1="440" y1="145" x2="475" y2="145" strokeWidth="0.8" strokeDasharray="1,1" opacity="0.6" />
        <line x1="440" y1="185" x2="475" y2="185" strokeWidth="0.8" strokeDasharray="1,1" opacity="0.6" />
        
        <circle cx="458" cy="152" r="3.5" fill="url(#hatch-dense)" />
        <circle cx="458" cy="178" r="3.5" fill="url(#hatch-dense)" />
        
        {/* DIFFERENCE 0: Robot Wrist Calibration Screw */}
        {isLeft ? (
          // Left has screw head (Circle with detailed cross slot & thread relief shadow)
          <g>
            <circle cx="410" cy="110" r="6" fill="#faf6eb" strokeWidth="2" />
            <line x1="406" y1="106" x2="414" y2="114" strokeWidth="2" />
            <line x1="414" y1="106" x2="406" y2="114" strokeWidth="0.8" opacity="0.6" />
            <path d="M 401,114 Q 407,119 418,114" strokeWidth="1" opacity="0.4" />
            {/* Fine threads on the body shaft */}
            <line x1="407" y1="116" x2="413" y2="116" strokeWidth="1" />
            <line x1="408" y1="119" x2="412" y2="119" strokeWidth="1" />
          </g>
        ) : (
          // Right is just a threaded empty screw hole
          <g>
            <circle cx="410" cy="110" r="6" strokeWidth="2" fill="url(#hatch-dense)" />
            {/* Inner thread lines showing empty space inside metal block */}
            <line x1="406" y1="108" x2="414" y2="108" strokeWidth="1" opacity="0.8" />
            <line x1="405" y1="112" x2="415" y2="112" strokeWidth="1" opacity="0.8" />
          </g>
        )}

        {/* Robot Palm Chassis with nested gears and pneumatic pistons */}
        <path d="M 365,175 L 325,185 L 305,215 L 315,265 L 345,295 L 370,215" fill="#faf6eb" />
        <circle cx="335" cy="240" r="10" strokeWidth="1.5" />
        <circle cx="335" cy="240" r="4" fill="#1a1a1a" />
        {/* Fine teeth on the internal gear core */}
        <line x1="335" y1="228" x2="335" y2="232" strokeWidth="1" />
        <line x1="335" y1="248" x2="335" y2="252" strokeWidth="1" />
        <line x1="323" y1="240" x2="327" y2="240" strokeWidth="1" />
        <line x1="343" y1="240" x2="347" y2="240" strokeWidth="1" />
        
        {/* Piston assemblies */}
        <line x1="335" y1="187" x2="335" y2="230" strokeWidth="2.5" />
        <rect x="330" y="195" width="10" height="15" rx="1" fill="url(#hatch-dense)" />

        {/* Robot Thumb Assembly */}
        <path d="M 355,180 L 335,145 L 345,130 L 365,160" />
        <line x1="335" y1="145" x2="365" y2="160" strokeWidth="1" />
        {/* Thumb joint pivot bolt */}
        <circle cx="355" cy="180" r="4.5" fill="#1a1a1a" />

        {/* Robot Index Finger (Pointing) */}
        {/* Base segment */}
        <path d="M 305,215 L 285,225 L 270,220 L 290,205 Z" fill="url(#hatch-dense)" />
        
        {/* Knuckle Ribbed Sleeve (bellows mechanism) - DIFFERENCE 2 */}
        {isLeft ? (
          // Left has detailed heavy-duty bellows joint with five distinct technical ribs
          <g fill="#faf6eb">
            <rect x="255" y="217" width="22" height="16" rx="2" strokeWidth="2" />
            <line x1="259" y1="217" x2="259" y2="233" strokeWidth="1.5" />
            <line x1="263" y1="217" x2="263" y2="233" strokeWidth="1.5" />
            <line x1="267" y1="217" x2="267" y2="233" strokeWidth="1.5" />
            <line x1="271" y1="217" x2="271" y2="233" strokeWidth="1.5" />
            <line x1="275" y1="217" x2="275" y2="233" strokeWidth="1.5" />
            {/* Fine micro-shading around the knuckle bellow ribs */}
            <circle cx="261" cy="225" r="0.8" fill="#1a1a1a" />
            <circle cx="269" cy="225" r="0.8" fill="#1a1a1a" />
          </g>
        ) : (
          // Right is just a plain, flat metal plate sleeve
          <g fill="#faf6eb">
            <rect x="255" y="217" width="22" height="16" rx="2" strokeWidth="2" />
            <line x1="266" y1="217" x2="266" y2="233" strokeWidth="1" opacity="0.5" />
          </g>
        )}

        {/* Fingertip Segment with optical receptor core */}
        <path d="M 255,224 L 285,245 L 285,251 L 250,228 Z" fill="#faf6eb" />
        <circle cx="285" cy="245" r="3" fill="#1a1a1a" />
        {/* Terminal sensor dots */}
        <circle cx="289" cy="248" r="1" fill="#1a1a1a" />
        <line x1="285" y1="245" x2="275" y2="238" strokeWidth="1" opacity="0.6" />

        {/* Robot Middle Finger (Curled with pivot joints) */}
        <path d="M 310,245 L 280,260 L 285,270 C 305,260 315,255 315,250" />
        <circle cx="282" cy="265" r="2.5" fill="#1a1a1a" />
        
        {/* Robot Ring Finger (Curled) */}
        <path d="M 315,265 L 290,280 L 295,290 C 310,280 320,275 320,270" />
        <circle cx="292" cy="285" r="2.5" fill="#1a1a1a" />

        {/* Robot Pinky Finger (Curled) */}
        <path d="M 320,280 L 300,295 L 305,305 C 317,295 325,290 325,285" />
        
        {/* Robot Wrist wire connection - DIFFERENCE 3 */}
        {isLeft ? (
          // Left has elegant double-coiled spring-wound feedback wire looping downward
          <g>
            <path d="M 405,205 C 415,225 460,250 445,270 C 430,290 415,285 410,310" strokeWidth="1.2" strokeDasharray="3,3" />
            <path d="M 408,208 C 418,228 462,253 447,273 Q 432,293 413,313" strokeWidth="0.8" opacity="0.7" />
            {/* Electrical binding post node */}
            <circle cx="405" cy="205" r="3.5" fill="#1a1a1a" />
            <circle cx="410" cy="310" r="3" fill="#1a1a1a" />
          </g>
        ) : (
          // Right has no feedback wire whatsoever (empty space)
          null
        )}

        {/* Mechanical rivets/plate alignment decals / engineering notations */}
        <circle cx="335" cy="195" r="2" fill="#1a1a1a" />
        <circle cx="313" cy="285" r="1.5" fill="#1a1a1a" />
        <circle cx="355" cy="275" r="2" fill="#1a1a1a" />
        <circle cx="470" cy="148" r="1.5" fill="#1a1a1a" />
        <circle cx="470" cy="182" r="1.5" fill="#1a1a1a" />
      </g>

      <PuzzleHitAreas
        puzzleIndex={0}
        side={side}
        foundDiffs={foundDiffs}
        onFindDiff={onFindDiff}
        onMiss={onMiss}
        onLeftPanelHint={onLeftPanelHint}
      />
    </svg>
  );
};


// --------------------------------------------------------------------
// PUZZLE 2: THE ANALYTICAL ENGINE (Cabinet & Brain in Dome)
// Differences:
// 0: Center vacuum tube filament (Left has detailed coiled glowing loops, Right has shattered bulb filaments)
// 1: System pressure needle (Left points 45 deg with detailed calibration scale, Right points 135 deg)
// 2: Bottom tape reel spokes (Left has 4 symmetric circular holes, Right has 3 triangular holes)
// 3: Auxiliary toggle switch (Left switch is UP with active indicator light, Right is DOWN with dark indicator)
// 4: Side chassis cable bundle (Left is thick steel-reinforced spiral cable, Right is smooth thin wire)
// --------------------------------------------------------------------
export const PuzzleTwoSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss, onLeftPanelHint }) => {
  const isLeft = side === 'left';

  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full select-none bg-[#faf6eb] border-2 border-black"
      onClick={onMiss}
      style={{ filter: 'contrast(1.05) brightness(0.98)' }}
    >
      <SVGDefs />

      {/* Technical Grid Overlay */}
      <rect width="500" height="500" fill="url(#tech-grid)" pointerEvents="none" />

      {/* Blueprint Circuit Diagram background detail */}
      <g stroke="#1a1a1a" strokeWidth="0.6" opacity="0.03" pointerEvents="none">
        {/* Background circuit patterns with resistors & capacitors */}
        <path d="M 20,80 L 100,80 M 100,60 L 100,100 M 110,70 L 110,90 M 110,80 L 160,80" />
        {/* Transistor symbol */}
        <path d="M 50,420 L 50,450 M 35,435 L 65,435 M 35,435 L 25,445 M 65,435 L 75,445 M 50,435 L 50,410" />
        {/* General drafting schematics */}
        <circle cx="430" cy="120" r="45" fill="none" strokeDasharray="3,3" />
        <line x1="430" y1="70" x2="430" y2="170" strokeDasharray="2,2" />
        <line x1="380" y1="120" x2="480" y2="120" strokeDasharray="2,2" />
        {/* Technical annotation formulas */}
        <text x="385" y="105" className="font-mono text-[5px] fill-[#1a1a1a] opacity-50" stroke="none">f_c = 1 / (2πRC)</text>
      </g>

      {/* Border outline inside */}
      <rect x="15" y="15" width="470" height="470" fill="none" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="5, 5" opacity="0.2" pointerEvents="none" />

      {/* Labels */}
      <text x="35" y="50" className="font-mono text-[10px] uppercase font-bold tracking-wider fill-[#1a1a1a]" opacity="0.7" stroke="none">
        标本编号 II-B // 主脑分析机
      </text>
      <text x="465" y="50" className="font-mono text-[10px] uppercase font-bold tracking-wider fill-[#1a1a1a]" opacity="0.7" textAnchor="end" stroke="none">
        型号: ENIAC-X // BELL TELEPHONE LABS 1968
      </text>
      <text x="250" y="465" className="font-mono text-[8px] uppercase font-bold tracking-widest fill-[#1a1a1a]" opacity="0.6" textAnchor="middle" stroke="none">
        图 2 - 生物协处理器逻辑大型机之电极关联
      </text>

      {/* MAIN COGNITIVE MAINFRAME CABINET */}
      <g stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Outer Heavy Steel Cabinet Chassis */}
        <rect x="80" y="140" width="340" height="300" rx="4" fill="#faf6eb" />
        {/* Bottom structural vibration legs */}
        <rect x="110" y="440" width="40" height="15" fill="url(#hatch-dense)" />
        <rect x="350" y="440" width="40" height="15" fill="url(#hatch-dense)" />
        {/* Beveled panels and dividers */}
        <line x1="80" y1="230" x2="420" y2="230" strokeWidth="2.5" />
        <line x1="80" y1="320" x2="420" y2="320" strokeWidth="2.5" />
        <line x1="250" y1="230" x2="250" y2="440" strokeWidth="1.5" />

        {/* ORNATE GLASS BRAIN DOME ON TOP */}
        <path d="M 180,140 C 180,55 320,55 320,140 Z" fill="#faf6eb" strokeWidth="2" />
        {/* Base of the dome with knurled collars */}
        <rect x="170" y="130" width="160" height="10" rx="2" fill="url(#hatch-1)" />
        
        {/* HIGHLY DETAILED REALISTIC ENGRAVING-STYLE BRAIN INSIDE DOME */}
        {/* Left hemisphere convoluted lobes */}
        <path d="M 220,110 C 215,110 208,104 212,98 C 205,94 212,84 222,87 C 220,77 232,73 238,83 C 242,75 250,77 252,85 C 255,75 264,78 262,88 L 250,110 Z" fill="#faf6eb" strokeWidth="1.5" />
        {/* Brain convolutions shading */}
        <path d="M 215,98 C 219,95 225,99 223,103" strokeWidth="0.8" opacity="0.6" />
        <path d="M 222,87 C 227,85 233,90 231,95" strokeWidth="0.8" opacity="0.6" />
        <path d="M 238,83 C 242,86 243,92 241,96" strokeWidth="0.8" opacity="0.6" />
        <path d="M 252,85 C 249,89 245,88 244,92" strokeWidth="0.8" opacity="0.6" />
        <path d="M 213,104 C 217,105 219,101 223,105" strokeWidth="0.8" opacity="0.6" />
        <path d="M 227,93 C 225,97 228,99 224,101" strokeWidth="0.8" opacity="0.6" />
        
        {/* Right hemisphere convoluted lobes */}
        <path d="M 280,110 C 285,110 292,104 288,98 C 295,94 288,84 278,87 C 280,77 268,73 262,83 C 258,75 250,77 248,85 C 245,75 236,78 238,88 L 250,110 Z" fill="#faf6eb" strokeWidth="1.5" />
        {/* Brain convolutions shading */}
        <path d="M 285,98 C 281,95 275,99 277,103" strokeWidth="0.8" opacity="0.6" />
        <path d="M 278,87 C 273,85 267,90 269,95" strokeWidth="0.8" opacity="0.6" />
        <path d="M 262,83 C 258,86 257,92 259,96" strokeWidth="0.8" opacity="0.6" />
        <path d="M 248,85 C 251,89 255,88 256,92" strokeWidth="0.8" opacity="0.6" />
        <path d="M 287,104 C 283,105 281,101 277,105" strokeWidth="0.8" opacity="0.6" />
        <path d="M 273,93 C 275,97 272,99 276,101" strokeWidth="0.8" opacity="0.6" />

        {/* Stem connection wire harness */}
        <path d="M 250,110 L 250,130" strokeWidth="3" />
        <path d="M 245,114 L 232,130" strokeWidth="1.5" />
        <path d="M 255,114 L 268,130" strokeWidth="1.5" />
        {/* Brain electrode leads and annotations */}
        <line x1="195" y1="130" x2="215" y2="100" strokeWidth="0.8" strokeDasharray="1,2" opacity="0.6" />
        <line x1="305" y1="130" x2="285" y2="100" strokeWidth="0.8" strokeDasharray="1,2" opacity="0.6" />
        <circle cx="215" cy="100" r="1.5" fill="#1a1a1a" />
        <circle cx="285" cy="100" r="1.5" fill="#1a1a1a" />

        {/* TOP PANEL: ENIAC COGNITIVE VACUUM TUBES (Left-side panel) */}
        <rect x="95" y="150" width="140" height="70" strokeWidth="1.5" fill="#faf6eb" />
        <text x="105" y="165" className="font-mono text-[8px] tracking-wider fill-[#1a1a1a] font-semibold" stroke="none">THERMIONIC VALVES</text>
        
        {/* Vacuum Tube 1 */}
        <rect x="110" y="175" width="20" height="36" rx="5" strokeWidth="1.5" />
        <line x1="120" y1="211" x2="120" y2="219" strokeWidth="1.5" />
        <path d="M 115,190 L 125,190" strokeWidth="1" opacity="0.5" />
        
        {/* Vacuum Tube 2 - DIFFERENCE 0 */}
        <rect x="150" y="175" width="20" height="36" rx="5" strokeWidth="1.5" />
        <line x1="160" y1="211" x2="160" y2="219" strokeWidth="1.5" />
        {/* Inner metal grid mesh */}
        <rect x="154" y="182" width="12" height="15" fill="url(#hatch-dense)" opacity="0.3" strokeWidth="0.5" />
        {isLeft ? (
          // Coiled glowing detailed filament (Left)
          <g>
            <path d="M 156,198 C 156,190 164,190 164,198" strokeWidth="1.8" strokeLinecap="square" />
            <path d="M 158,198 C 158,192 162,192 162,198" strokeWidth="0.8" opacity="0.7" />
            <circle cx="160" cy="191" r="1" fill="#1a1a1a" />
          </g>
        ) : (
          // Broken, shattered filament halves (Right)
          <g opacity="0.7">
            <line x1="156" y1="196" x2="158" y2="199" strokeWidth="1.5" />
            <line x1="162" y1="195" x2="164" y2="192" strokeWidth="1.5" />
            <circle cx="157" cy="204" r="0.8" fill="#1a1a1a" />
          </g>
        )}

        {/* Vacuum Tube 3 */}
        <rect x="190" y="175" width="20" height="36" rx="5" strokeWidth="1.5" />
        <line x1="200" y1="211" x2="200" y2="219" strokeWidth="1.5" />
        <path d="M 195,190 L 205,190" strokeWidth="1" opacity="0.5" />


        {/* TOP PANEL: ANALYTICAL DIAL (Right-side panel) - DIFFERENCE 1 */}
        <rect x="265" y="150" width="140" height="70" strokeWidth="1.5" fill="#faf6eb" />
        <text x="275" y="165" className="font-mono text-[8px] tracking-wider fill-[#1a1a1a] font-semibold" stroke="none">AMPLITUDE BIAS</text>
        {/* Gauge circle and bevel shadows */}
        <circle cx="335" cy="185" r="22" strokeWidth="1.5" />
        <circle cx="335" cy="185" r="19" strokeWidth="0.5" strokeDasharray="1,2" />
        {/* Dial ticks and division marks */}
        <line x1="335" y1="163" x2="335" y2="168" strokeWidth="1" />
        <line x1="335" y1="202" x2="335" y2="207" strokeWidth="1" />
        <line x1="313" y1="185" x2="318" y2="185" strokeWidth="1" />
        <line x1="352" y1="185" x2="357" y2="185" strokeWidth="1" />
        <line x1="319" y1="169" x2="323" y2="173" strokeWidth="1" />
        <line x1="351" y1="169" x2="347" y2="173" strokeWidth="1" />
        {/* Intermediary smaller scale ticks */}
        <line x1="326" y1="165" x2="329" y2="169" strokeWidth="0.6" />
        <line x1="344" y1="165" x2="341" y2="169" strokeWidth="0.6" />
        {isLeft ? (
          // Left points 45 degrees up-right (accurate calibrated setting)
          <g>
            <line x1="335" y1="185" x2="349" y2="171" strokeWidth="2.5" />
            <circle cx="335" cy="185" r="4" fill="#1a1a1a" />
            <text x="335" y="213" className="font-mono text-[6px] fill-[#1a1a1a] text-center" textAnchor="middle" stroke="none">CALIB // OK</text>
          </g>
        ) : (
          // Right points 135 degrees down-right (overloaded warning setting)
          <g>
            <line x1="335" y1="185" x2="349" y2="199" strokeWidth="2.5" />
            <circle cx="335" cy="185" r="4" fill="#1a1a1a" />
            <text x="335" y="213" className="font-mono text-[6px] fill-[#d94141] font-bold text-center" textAnchor="middle" stroke="none">WARN // OVLD</text>
          </g>
        )}


        {/* MIDDLE PANEL: INTERFACE LIGHTS & TOGGLES */}
        {/* Status Light Grid */}
        <rect x="95" y="245" width="140" height="60" strokeWidth="1.5" fill="#faf6eb" />
        <circle cx="115" cy="275" r="6" fill="url(#hatch-dense)" />
        <circle cx="140" cy="275" r="6" strokeWidth="1.5" />
        <circle cx="165" cy="275" r="6" fill="url(#hatch-dense)" />
        <circle cx="190" cy="275" r="6" strokeWidth="1.5" />
        <circle cx="215" cy="275" r="6" strokeWidth="1.5" />
        <text x="105" y="258" className="font-mono text-[7px] tracking-wider fill-[#1a1a1a]" stroke="none">REGISTER FLUX</text>

        {/* Toggles Panel - DIFFERENCE 3 */}
        <rect x="265" y="245" width="140" height="60" strokeWidth="1.5" fill="#faf6eb" />
        <text x="275" y="258" className="font-mono text-[7px] tracking-wider fill-[#1a1a1a]" stroke="none">LOGIC GATE CORES</text>
        {/* Toggle Switch 1 (UP) */}
        <line x1="290" y1="282" x2="290" y2="267" strokeWidth="3" />
        <circle cx="290" cy="267" r="3" fill="#1a1a1a" />
        <circle cx="290" cy="277" r="6" strokeWidth="1" />
        
        {/* Toggle Switch 2 (DOWN) */}
        <line x1="335" y1="272" x2="335" y2="287" strokeWidth="3" />
        <circle cx="335" cy="287" r="3" fill="#1a1a1a" />
        <circle cx="335" cy="277" r="6" strokeWidth="1" />

        {/* Toggle Switch 3 - DIFFERENCE 3 */}
        {isLeft ? (
          // Left is UP with an active tiny illuminated glow lamp
          <g>
            <line x1="380" y1="282" x2="380" y2="267" strokeWidth="3" />
            <circle cx="380" cy="267" r="3" fill="#1a1a1a" />
            <circle cx="380" cy="277" r="6" strokeWidth="1" />
            {/* Illuminated indicator dot */}
            <circle cx="395" cy="277" r="2.5" fill="#1a1a1a" />
            <circle cx="395" cy="277" r="5" strokeWidth="0.5" opacity="0.6" />
          </g>
        ) : (
          // Right is DOWN with a dark indicator lamp
          <g>
            <line x1="380" y1="272" x2="380" y2="287" strokeWidth="3" />
            <circle cx="380" cy="287" r="3" fill="#1a1a1a" />
            <circle cx="380" cy="277" r="6" strokeWidth="1" />
            {/* Dark indicator dot */}
            <circle cx="395" cy="277" r="2" strokeWidth="1" />
          </g>
        )}


        {/* BOTTOM PANEL: MAGNETIC TAPE DRIVE & MULTI-CABLE BUS */}
        {/* Magnetic Tape Drive - DIFFERENCE 2 */}
        <rect x="95" y="335" width="140" height="90" strokeWidth="1.5" fill="#faf6eb" />
        <text x="105" y="348" className="font-mono text-[7px] tracking-wider fill-[#1a1a1a]" stroke="none">MEMORY ACCUMULATOR</text>
        <circle cx="165" cy="385" r="26" strokeWidth="2" />
        <circle cx="165" cy="385" r="8" fill="#1a1a1a" />
        {isLeft ? (
          // 4 symmetric circular holes (Left)
          <g>
            <circle cx="165" cy="368" r="3.5" fill="#1a1a1a" />
            <circle cx="165" cy="402" r="3.5" fill="#1a1a1a" />
            <circle cx="148" cy="385" r="3.5" fill="#1a1a1a" />
            <circle cx="182" cy="385" r="3.5" fill="#1a1a1a" />
            {/* Inner aesthetic tape scale markings */}
            <circle cx="165" cy="385" r="18" strokeWidth="0.5" strokeDasharray="2,3" opacity="0.5" />
          </g>
        ) : (
          // 3 offset circular holes representing a different spoke design (Right)
          <g>
            <circle cx="165" cy="368" r="3.5" fill="#1a1a1a" />
            <circle cx="150" cy="395" r="3.5" fill="#1a1a1a" />
            <circle cx="180" cy="395" r="3.5" fill="#1a1a1a" />
            {/* Alternative inner spiral layout */}
            <circle cx="165" cy="385" r="15" strokeWidth="0.5" strokeDasharray="1,2" opacity="0.4" />
          </g>
        )}
        {/* Looping magnetic tape line weaving details */}
        <path d="M 105,385 L 132,385 C 132,365 198,365 198,385 L 225,385" strokeWidth="1.2" opacity="0.6" />
        <path d="M 120,405 L 210,405" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.4" />

        {/* Technical wiring - DIFFERENCE 4 */}
        <rect x="265" y="335" width="140" height="90" strokeWidth="1.5" fill="#faf6eb" />
        <text x="275" y="348" className="font-mono text-[7px] tracking-wider fill-[#1a1a1a]" stroke="none">CO-PROCESSOR TRUNK</text>
        {/* Main nested wire trunks */}
        <path d="M 280,365 Q 300,385 320,365" strokeWidth="2.5" />
        <path d="M 280,375 Q 300,395 320,375" strokeWidth="1.5" />
        
        {isLeft ? (
          // Left: Heavy industrial spiral-textured armored trunk line
          <g>
            <path d="M 340,355 Q 360,415 390,365" strokeWidth="4.5" strokeDasharray="3, 2.5" />
            <path d="M 342,357 Q 362,417 392,367" strokeWidth="1" strokeDasharray="1,4" opacity="0.5" />
            {/* Binding sleeve clamps */}
            <rect x="345" y="365" width="4" height="8" rx="0.5" fill="#1a1a1a" />
            <rect x="375" y="375" width="4" height="8" rx="0.5" fill="#1a1a1a" />
          </g>
        ) : (
          // Right: Light plain thin solid black wire
          <path d="M 340,355 Q 360,415 390,365" strokeWidth="2.5" />
        )}
        
        {/* Interfacing terminals */}
        <line x1="300" y1="390" x2="300" y2="415" strokeWidth="1.5" />
        <circle cx="300" cy="415" r="3" fill="#1a1a1a" />
        <line x1="310" y1="390" x2="310" y2="410" strokeWidth="1.5" />
        <circle cx="310" cy="410" r="3" fill="#1a1a1a" />
      </g>

      <PuzzleHitAreas puzzleIndex={1} side={side} foundDiffs={foundDiffs} onFindDiff={onFindDiff} onMiss={onMiss} onLeftPanelHint={onLeftPanelHint} />
    </svg>
  );
};


// --------------------------------------------------------------------
// PUZZLE 3: THE MECHANICAL VISION (TV Camera & Observatory Cosmos)
// Differences:
// 0: Shutter blade aperture counts (Left hexagonal lens shutter with 6 lines, Right pentagonal shutter with 5 lines)
// 1: Atomic ring electron (Left has 3 orbiting satellite antenna balls, Right has only 2)
// 2: Camera side decal symbol (Left emblem has triangle pointing UP inside double ring, Right triangle points DOWN)
// 3: Tripod neck adjustment bolts (Left has two knurled clamp-wingnuts, Right has only the top wingnut)
// 4: Oscilloscope monitor wave (Left CRT screen has a beautiful double-sine wave, Right screen has single sine wave)
// --------------------------------------------------------------------
export const PuzzleThreeSVG: React.FC<PuzzleProps> = ({ side, foundDiffs, onFindDiff, onMiss, onLeftPanelHint }) => {
  const isLeft = side === 'left';

  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full select-none bg-[#faf6eb] border-2 border-black"
      onClick={onMiss}
      style={{ filter: 'contrast(1.05) brightness(0.98)' }}
    >
      <SVGDefs />

      {/* Technical Grid Overlay */}
      <rect width="500" height="500" fill="url(#tech-grid)" pointerEvents="none" />

      {/* Faint planetary orbital charts background detail */}
      <g stroke="#1a1a1a" strokeWidth="0.6" opacity="0.03" pointerEvents="none">
        {/* Orbital equations and grid angles */}
        <ellipse cx="250" cy="250" rx="210" ry="160" fill="none" />
        <ellipse cx="250" cy="250" rx="140" ry="90" fill="none" strokeDasharray="4,4" />
        <path d="M 40,40 L 100,40 L 100,100" />
        {/* Compass direction markings */}
        <line x1="450" y1="420" x2="410" y2="420" />
        <line x1="430" y1="400" x2="430" y2="440" />
        <circle cx="430" cy="420" r="10" fill="none" />
        <text x="430" y="395" className="font-mono text-[6px] fill-[#1a1a1a] text-center" textAnchor="middle" stroke="none">N</text>
        <text x="235" y="105" className="font-mono text-[5px] fill-[#1a1a1a] opacity-50" stroke="none">θ = arcsin(v/c)</text>
      </g>

      {/* Border outline inside */}
      <rect x="15" y="15" width="470" height="470" fill="none" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="5, 5" opacity="0.2" pointerEvents="none" />

      {/* Labels */}
      <text x="35" y="50" className="font-mono text-[10px] uppercase font-bold tracking-wider fill-[#1a1a1a]" opacity="0.7" stroke="none">
        标本编号 III-C // 视网膜观测机
      </text>
      <text x="465" y="50" className="font-mono text-[10px] uppercase font-bold tracking-wider fill-[#1a1a1a]" opacity="0.7" textAnchor="end" stroke="none">
        系统: KINETICS-8 // NASA MANUAL 1968
      </text>
      <text x="250" y="465" className="font-mono text-[8px] uppercase font-bold tracking-widest fill-[#1a1a1a]" opacity="0.6" textAnchor="middle" stroke="none">
        图 3 - 高倍率天体轨迹观测与双腔光学对焦机制
      </text>

      {/* ORBITING COSMIC SPACE (Upper Right Field) - Vintage Space-Age Aesthetic */}
      <g stroke="#1a1a1a" strokeWidth="1.2" fill="none">
        {/* Planetary sphere with detailed topography shading */}
        <circle cx="410" cy="110" r="14" fill="url(#hatch-1)" />
        <circle cx="410" cy="110" r="14" strokeWidth="1.8" />
        {/* Orbit loop 1 */}
        <ellipse cx="400" cy="115" rx="55" ry="18" strokeWidth="1" strokeDasharray="3,3" transform="rotate(-15 400 115)" />
        {/* Orbit loop 2 with Satellite Nodes - DIFFERENCE 1 */}
        <ellipse cx="400" cy="115" rx="35" ry="35" strokeWidth="1" transform="rotate(30 400 115)" />
        
        {/* Spherical Sputnik-like satellites with long whip antenna lines */}
        {/* Satellite 1 */}
        <circle cx="365" cy="115" r="4.5" fill="#1a1a1a" />
        <line x1="365" y1="115" x2="350" y2="100" strokeWidth="0.8" />
        <line x1="365" y1="115" x2="353" y2="132" strokeWidth="0.8" />

        {/* Satellite 2 */}
        <circle cx="421" cy="85" r="4.5" fill="#1a1a1a" />
        <line x1="421" y1="85" x2="435" y2="70" strokeWidth="0.8" />
        <line x1="421" y1="85" x2="410" y2="68" strokeWidth="0.8" />

        {isLeft ? (
          // Left: Satellite 3 is fully operational and visible on orbit
          <g>
            <circle cx="412" cy="146" r="4.5" fill="#1a1a1a" />
            <line x1="412" y1="146" x2="425" y2="162" strokeWidth="0.8" />
            <line x1="412" y1="146" x2="400" y2="162" strokeWidth="0.8" />
            {/* Tiny magnetic flux line representing connection */}
            <path d="M 412,146 Q 395,135 410,110" strokeWidth="0.6" strokeDasharray="1,2" opacity="0.5" />
          </g>
        ) : (
          // Right: Satellite 3 is missing completely
          null
        )}
      </g>

      {/* VINTAGE CRT OSCILLOSCOPE MONITOR (Bottom Left Corner) - DIFFERENCE 4 */}
      <g stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="35" y="325" width="105" height="85" rx="4" fill="#faf6eb" />
        {/* Inner cathode tube CRT glass bezel */}
        <rect x="43" y="333" width="89" height="69" rx="2" fill="none" strokeWidth="1.5" />
        {/* CRT screen calibration graticule crosshairs */}
        <line x1="43" y1="367" x2="132" y2="367" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
        <line x1="88" y1="333" x2="88" y2="402" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
        
        {isLeft ? (
          // Left: Detailed complex double-sine wave with harmonics representing signal flux
          <g>
            <path d="M 46,367 Q 56,335 66,367 T 86,367 T 106,367 T 126,367" strokeWidth="2.5" />
            {/* Harmonic feedback ripples */}
            <path d="M 46,369 Q 56,345 66,369 T 86,369 T 106,369 T 126,369" strokeWidth="0.8" opacity="0.4" />
          </g>
        ) : (
          // Right: Basic simplified single peak sine wave
          <path d="M 46,367 Q 66,335 86,367 T 126,367" strokeWidth="2.5" />
        )}
        
        {/* Bakelite adjusting knobs on the scope bezel */}
        <circle cx="50" cy="420" r="3.5" fill="#1a1a1a" />
        <circle cx="62" cy="420" r="3.5" fill="#1a1a1a" />
        <line x1="120" y1="415" x2="135" y2="415" strokeWidth="1.5" />
        <text x="100" y="320" className="font-mono text-[6px] tracking-wider fill-[#1a1a1a] font-bold" stroke="none">BEAM TRACE</text>
      </g>

      {/* THE OBSERVATORY RACK-FOCUS TELESCOPE CAMERA */}
      <g stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Large lens shade hood featuring knurled shade rims */}
        <path d="M 210,180 L 290,180 L 310,210 L 190,210 Z" fill="url(#hatch-dense)" />
        <line x1="200" y1="195" x2="300" y2="195" strokeWidth="1" opacity="0.4" />
        
        {/* Main brass-plated lens barrel casing */}
        <rect x="215" y="210" width="70" height="40" fill="#faf6eb" />
        
        {/* SHUTTER LENS APERTURE CONTROLS - DIFFERENCE 0 */}
        <circle cx="250" cy="230" r="16" fill="#faf6eb" strokeWidth="2" />
        <circle cx="250" cy="230" r="13" strokeWidth="0.5" strokeDasharray="1,2" opacity="0.6" />
        {isLeft ? (
          // Left: 6-bladed Hexagonal Aperture Iris (exquisite mechanical blade lines)
          <g strokeWidth="1.5">
            <line x1="234" y1="230" x2="242" y2="216" />
            <line x1="242" y1="216" x2="258" y2="216" />
            <line x1="258" y1="216" x2="266" y2="230" />
            <line x1="266" y1="230" x2="258" y2="244" />
            <line x1="258" y1="244" x2="242" y2="244" />
            <line x1="242" y1="244" x2="234" y2="230" />
            {/* Shutter mechanical pivot pins */}
            <circle cx="234" cy="230" r="1" fill="#1a1a1a" />
            <circle cx="258" cy="216" r="1" fill="#1a1a1a" />
            <circle cx="258" cy="244" r="1" fill="#1a1a1a" />
          </g>
        ) : (
          // Right: 5-bladed Pentagon Aperture Iris
          <g strokeWidth="1.5">
            <line x1="250" y1="214" x2="265" y2="225" />
            <line x1="265" y1="225" x2="259" y2="243" />
            <line x1="259" y1="243" x2="241" y2="243" />
            <line x1="241" y1="243" x2="235" y2="225" />
            <line x1="235" y1="225" x2="250" y2="214" />
            {/* Shutter pivot pins */}
            <circle cx="250" cy="214" r="1" fill="#1a1a1a" />
            <circle cx="259" cy="243" r="1" fill="#1a1a1a" />
          </g>
        )}

        {/* Heavy Camera Core Housing Chassis */}
        <rect x="160" y="250" width="180" height="110" rx="4" fill="#faf6eb" strokeWidth="2.5" />
        
        {/* Metal Cooling Ventilation Grate shading */}
        <rect x="275" y="270" width="45" height="70" fill="url(#hatch-1)" />

        {/* SCIENTIFIC LAB LOGO/DECALS - DIFFERENCE 2 */}
        {isLeft ? (
          // Left: Double-bordered retro badge containing an UP-pointing triangle
          <g>
            <circle cx="210" cy="305" r="14" strokeWidth="1.5" />
            <circle cx="210" cy="305" r="11" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <polygon points="210,296 221,313 199,313" fill="#1a1a1a" />
            {/* Beautiful tiny alignment ticks */}
            <line x1="210" y1="287" x2="210" y2="291" strokeWidth="0.8" />
            <line x1="210" y1="319" x2="210" y2="323" strokeWidth="0.8" />
            <text x="210" y="326" className="font-mono text-[5px] fill-[#1a1a1a] text-center" textAnchor="middle" stroke="none">UP</text>
          </g>
        ) : (
          // Right: Double-bordered retro badge containing a DOWN-pointing triangle
          <g>
            <circle cx="210" cy="305" r="14" strokeWidth="1.5" />
            <circle cx="210" cy="305" r="11" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
            <polygon points="210,314 221,297 199,297" fill="#1a1a1a" />
            {/* Beautiful tiny alignment ticks */}
            <line x1="210" y1="287" x2="210" y2="291" strokeWidth="0.8" />
            <line x1="210" y1="319" x2="210" y2="323" strokeWidth="0.8" />
            <text x="210" y="326" className="font-mono text-[5px] fill-[#d94141] font-bold text-center" textAnchor="middle" stroke="none">DOWN</text>
          </g>
        )}

        {/* Camera Control Panel knobs & sliders */}
        <circle cx="180" cy="275" r="4.5" fill="#1a1a1a" />
        <circle cx="195" cy="275" r="4.5" fill="#1a1a1a" />
        <line x1="175" y1="330" x2="235" y2="330" strokeWidth="1.5" />
        <line x1="205" y1="325" x2="205" y2="335" strokeWidth="1.5" />

        {/* TRIPOD MOUNTING BASE & GEAR HEAD */}
        <rect x="230" y="360" width="40" height="25" rx="1" fill="#faf6eb" />
        <line x1="250" y1="385" x2="250" y2="420" strokeWidth="4" /> {/* Heavy central elevator column */}
        
        {/* Ribbed safety collar rings */}
        <rect x="240" y="394" width="20" height="6" rx="1" fill="url(#hatch-dense)" />

        {/* TRIPOD STEM ADJUSTMENT BOLTS - DIFFERENCE 3 */}
        {isLeft ? (
          // Left has dual locking wingnut clamps with fully rendered threads
          <g fill="#1a1a1a">
            {/* Top wingnut bolt clamp */}
            <rect x="254" y="388" width="14" height="6" rx="1" />
            <line x1="250" y1="391" x2="255" y2="391" strokeWidth="1.5" stroke="#1a1a1a" />
            {/* Bottom wingnut bolt clamp */}
            <rect x="254" y="408" width="14" height="6" rx="1" />
            <line x1="250" y1="411" x2="255" y2="411" strokeWidth="1.5" stroke="#1a1a1a" />
          </g>
        ) : (
          // Right is missing the lower wingnut, leaving only the bare threaded splaying out
          <g>
            {/* Top wingnut bolt clamp */}
            <rect x="254" y="388" width="14" height="6" rx="1" fill="#1a1a1a" />
            <line x1="250" y1="391" x2="255" y2="391" strokeWidth="1.5" stroke="#1a1a1a" />
            {/* Bare lower screw shaft without clamp wingnut */}
            <line x1="250" y1="411" x2="260" y2="411" strokeWidth="2" stroke="#1a1a1a" />
            <circle cx="262" cy="411" r="1" fill="#1a1a1a" />
          </g>
        )}

        {/* Splaying wood-and-iron telescopic tripod legs */}
        <path d="M 235,420 L 195,475" strokeWidth="3.5" />
        <path d="M 235,420 L 195,475" strokeWidth="1" strokeDasharray="3,1" stroke="#faf6eb" />
        <path d="M 265,420 L 305,475" strokeWidth="3.5" />
        <path d="M 265,420 L 305,475" strokeWidth="1" strokeDasharray="3,1" stroke="#faf6eb" />
        <path d="M 250,420 L 250,475" strokeWidth="2" strokeDasharray="3,3" />
      </g>

      <PuzzleHitAreas puzzleIndex={2} side={side} foundDiffs={foundDiffs} onFindDiff={onFindDiff} onMiss={onMiss} onLeftPanelHint={onLeftPanelHint} />
    </svg>
  );
};
