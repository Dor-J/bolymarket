'use client';

import { useAtomValue } from 'jotai';
import {
  getSportsGameStateLookupAtomKey,
  sportsGameStateLookupAtomFamily,
} from '@/lib/atoms/sportsGameState';
import { getGameStateLookupKeys } from '@/lib/sports/resolveGameState';
import type { SportsGame, SportsGameState } from '@/types/polymarket';

/**
 * Resolves live game state for a sports row using multiple lookup keys.
 */
export function useSportsGameState(game: SportsGame): SportsGameState | null {
  const keys = getGameStateLookupKeys(game);
  const lookupKey = getSportsGameStateLookupAtomKey(keys);
  return useAtomValue(sportsGameStateLookupAtomFamily(lookupKey));
}
