'use client';

import { useAtomValue } from 'jotai';
import { sportsGameStateAtomFamily } from '@/lib/atoms/sportsGameState';
import { getGameStateLookupKeys } from '@/lib/sports/resolveGameState';
import type { SportsGame, SportsGameState } from '@/types/polymarket';

/**
 * Resolves live game state for a sports row using multiple lookup keys.
 */
export function useSportsGameState(game: SportsGame): SportsGameState | null {
  const keys = getGameStateLookupKeys(game);
  const byId = useAtomValue(sportsGameStateAtomFamily(keys[0] ?? game.gameId));
  const bySlug = useAtomValue(
    sportsGameStateAtomFamily(keys[1] ?? game.slug),
  );
  const byMatchup = useAtomValue(
    sportsGameStateAtomFamily(keys[2] ?? game.matchupKey),
  );

  return byId ?? bySlug ?? byMatchup ?? null;
}
