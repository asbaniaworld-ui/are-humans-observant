import type { ResearchBoardNodeStatus } from '../content/types';

/** Shared cursor classes — keep gameplay affordances consistent. */
export const GAME_CURSOR = {
  /** Non-interactive chrome, backgrounds, text. */
  default: 'cursor-game-default',
  /** Buttons, menu items, dialogue options. */
  action: 'cursor-game-action',
  /** Archive photos / exhibit tiles / verified board cards. */
  inspect: 'cursor-game-inspect',
  /** Spot-the-difference target panel (图板 B). */
  spot: 'cursor-game-spot',
  /** Reference-only panel (图板 A) — clicks redirect attention right. */
  reference: 'cursor-game-reference',
  /** Locked, disabled, or not yet available. */
  locked: 'cursor-game-locked',
} as const;

export function puzzlePanelCursor(side: 'left' | 'right', cleared = false): string {
  if (cleared) return GAME_CURSOR.default;
  return side === 'left' ? GAME_CURSOR.reference : GAME_CURSOR.spot;
}

export function boardNodeCursor(status: ResearchBoardNodeStatus): string {
  if (status === 'verified') return GAME_CURSOR.inspect;
  return GAME_CURSOR.locked;
}

export function boardNodeDisabled(status: ResearchBoardNodeStatus): boolean {
  return status !== 'verified';
}

export function puzzleHitCursor(side: 'left' | 'right', rightPanelOnly = true): string {
  if (rightPanelOnly && side === 'left') return GAME_CURSOR.reference;
  return GAME_CURSOR.spot;
}
