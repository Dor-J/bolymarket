import type { SportsGame, SportsGameState } from '@/types/polymarket';
import { normalizeMatchupKey } from './buildSportsGameCard';

/**
 * Returns lookup keys used to resolve live state for a sports game row.
 */
export function getGameStateLookupKeys(game: SportsGame): string[] {
  const keys = new Set<string>([game.gameId, game.slug, game.matchupKey]);

  if (game.wsGameId) {
    keys.add(game.wsGameId);
  }

  return Array.from(keys).filter(Boolean);
}

/**
 * Resolves live game state from a map of keyed states.
 */
export function resolveGameStateForGame(
  game: SportsGame,
  states: ReadonlyMap<string, SportsGameState | null | undefined>,
): SportsGameState | null {
  for (const key of getGameStateLookupKeys(game)) {
    const state = states.get(key);
    if (state) {
      return state;
    }
  }

  const matchupKey = normalizeMatchupKey(game.title);
  for (const [key, state] of states) {
    if (!state?.slug) {
      continue;
    }

    if (normalizeMatchupKey(state.slug) === matchupKey) {
      return state;
    }
  }

  return null;
}
