import React from 'react';
import { SketchyRedCircle } from './SketchyRedCircle';
import { PUZZLE_HOTSPOTS } from '../content/puzzleHotspots';
import { puzzleHitCursor } from '../utils/gameCursor';

interface PuzzleHitAreasProps {
  puzzleIndex: number;
  side: 'left' | 'right';
  foundDiffs: number[];
  onFindDiff: (index: number) => void;
  onMiss: () => void;
  /** When true, left-panel clicks near hotspots nudge player to the copy panel. */
  rightPanelOnly?: boolean;
  onLeftPanelHint?: () => void;
}

/**
 * Shared clickable regions — coordinates synced with puzzleHotspots.ts.
 * Differences are validated on 图板 B (right / copy panel) only.
 */
export const PuzzleHitAreas: React.FC<PuzzleHitAreasProps> = ({
  puzzleIndex,
  side,
  foundDiffs,
  onFindDiff,
  onMiss,
  rightPanelOnly = true,
  onLeftPanelHint,
}) => {
  const hotspots = PUZZLE_HOTSPOTS[puzzleIndex];
  if (!hotspots) return null;

  return (
    <>
      {hotspots.map((spot, idx) => (
        <circle
          key={idx}
          cx={spot.cx}
          cy={spot.cy}
          r={spot.r}
          className={`fill-transparent stroke-transparent ${puzzleHitCursor(side, rightPanelOnly)}`}
          onClick={(e) => {
            e.stopPropagation();
            if (rightPanelOnly && side === 'left') {
              onLeftPanelHint?.();
              return;
            }
            onFindDiff(idx);
          }}
        />
      ))}
      {foundDiffs.map((idx) => {
        const spot = hotspots[idx];
        if (!spot) return null;
        return <SketchyRedCircle key={idx} cx={spot.cx} cy={spot.cy} r={spot.markR} />;
      })}
    </>
  );
};
