/** Single source of truth for spot-the-difference hit areas (500×500 viewBox). */

export interface DiffHotspot {
  cx: number;
  cy: number;
  /** Click radius in SVG units */
  r: number;
  /** Red circle overlay radius when found */
  markR: number;
}

export const PUZZLE_HOTSPOTS: Record<number, DiffHotspot[]> = {
  0: [
    { cx: 410, cy: 110, r: 52, markR: 18 }, // wrist screw
    { cx: 245, cy: 245, r: 70, markR: 35 }, // spark (center of arc cluster)
    { cx: 266, cy: 225, r: 52, markR: 20 }, // index knuckle bellows
    { cx: 418, cy: 258, r: 60, markR: 30 }, // palm feedback wire
    { cx: 72, cy: 360, r: 72, markR: 40 },  // human arm hatching
  ],
  1: [
    { cx: 160, cy: 198, r: 52, markR: 18 }, // vacuum tube filament
    { cx: 335, cy: 185, r: 60, markR: 26 }, // pressure gauge needle
    { cx: 165, cy: 385, r: 68, markR: 35 }, // tape reel spokes
    { cx: 380, cy: 272, r: 52, markR: 22 }, // toggle switch matrix
    { cx: 368, cy: 383, r: 68, markR: 30 }, // co-processor cable trunk (spiral vs plain)
  ],
  2: [
    { cx: 250, cy: 230, r: 58, markR: 22 }, // aperture blades
    { cx: 412, cy: 146, r: 52, markR: 18 }, // orbiting satellite
    { cx: 210, cy: 305, r: 58, markR: 22 }, // decal triangle
    { cx: 257, cy: 402, r: 52, markR: 18 }, // tripod wingnut
    { cx: 88, cy: 367, r: 62, markR: 28 },  // CRT waveform
  ],
  3: [
    { cx: 250, cy: 160, r: 58, markR: 24 }, // punch card holes
    { cx: 140, cy: 320, r: 58, markR: 24 }, // index gear teeth
    { cx: 340, cy: 312, r: 58, markR: 24 }, // catalog label M-402
    { cx: 120, cy: 150, r: 52, markR: 20 }, // pressure gauge pointer
    { cx: 405, cy: 220, r: 58, markR: 24 }, // edge tick rulers
  ],
  4: [
    { cx: 180, cy: 355, r: 58, markR: 24 }, // EEG flatline
    { cx: 180, cy: 168, r: 58, markR: 24 }, // electrode lead
    { cx: 380, cy: 200, r: 52, markR: 22 }, // synchro ring
    { cx: 345, cy: 355, r: 58, markR: 24 }, // waste tape bin
    { cx: 292, cy: 128, r: 50, markR: 20 }, // cooling vent slats
  ],
  5: [
    { cx: 150, cy: 220, r: 58, markR: 24 }, // lens rivets
    { cx: 350, cy: 235, r: 58, markR: 26 }, // portrait projection
    { cx: 250, cy: 220, r: 58, markR: 24 }, // refraction rays
    { cx: 250, cy: 347, r: 58, markR: 22 }, // rack gear teeth
    { cx: 380, cy: 350, r: 52, markR: 18 }, // fluid reservoir
  ],
};

export function getHotspot(puzzleIndex: number, diffIdx: number): DiffHotspot {
  return PUZZLE_HOTSPOTS[puzzleIndex]?.[diffIdx] ?? { cx: 250, cy: 250, r: 62, markR: 24 };
}

/** Overlay hint ring positions (percentage of panel). */
export function getHintOverlayStyle(puzzleIndex: number, diffIdx: number) {
  const spot = getHotspot(puzzleIndex, diffIdx);
  return {
    top: `${(spot.cy / 500) * 100}%`,
    left: `${(spot.cx / 500) * 100}%`,
    width: `${Math.min(18, (spot.r / 500) * 100 * 2.2)}%`,
    height: `${Math.min(18, (spot.r / 500) * 100 * 2.2)}%`,
    transform: 'translate(-50%, -50%)',
  };
}
