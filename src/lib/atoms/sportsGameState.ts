import { atom, type PrimitiveAtom } from 'jotai';
import { atomFamily } from 'jotai-family';
import type { SportsGameState } from '@/types/polymarket';

/**
 * Per-game live state keyed by `gameId`.
 */
export const sportsGameStateAtomFamily = atomFamily<
  string,
  PrimitiveAtom<SportsGameState | null>
>(() => atom<SportsGameState | null>(null));

/**
 * Removes cached game state atoms that are no longer visible.
 */
export function pruneStaleSportsGameStates(activeGameIds: ReadonlySet<string>): void {
  for (const gameId of sportsGameStateAtomFamily.getParams()) {
    if (!activeGameIds.has(gameId)) {
      sportsGameStateAtomFamily.remove(gameId);
    }
  }
}
