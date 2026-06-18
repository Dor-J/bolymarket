import { atom, type PrimitiveAtom } from 'jotai';
import type { Store } from 'jotai/vanilla/store';
import { atomFamily } from 'jotai-family';
import type { SportsGameState } from '@/types/polymarket';

/**
 * Per-game live state keyed by `gameId`.
 */
export const sportsGameStateAtomFamily = atomFamily<
  string,
  PrimitiveAtom<SportsGameState | null>
>(() => atom<SportsGameState | null>(null));

const sportsGameAliasAtom = atom<Record<string, string>>({});

function serializeLookupKeys(keys: string[]): string {
  return keys.filter(Boolean).join('|');
}

/** Stable key for resolving a game from id, slug, or matchup aliases. */
export function getSportsGameStateLookupAtomKey(keys: string[]): string {
  return serializeLookupKeys(keys);
}

/** Resolves live game state through aliases while subscribing to one derived atom. */
export const sportsGameStateLookupAtomFamily = atomFamily((lookupKey: string) =>
  atom((get) => {
    const aliases = get(sportsGameAliasAtom);
    const keys = lookupKey.split('|').filter(Boolean);

    for (const key of keys) {
      const canonicalKey = aliases[key] ?? key;
      const state = get(sportsGameStateAtomFamily(canonicalKey));
      if (state) {
        return state;
      }
    }

    return null;
  }),
);

/** Stores aliases that should resolve to the canonical `gameId` state atom. */
export function setSportsGameStateAliases(
  store: Store,
  gameId: string,
  aliases: string[],
): void {
  const current = store.get(sportsGameAliasAtom);
  const next = { ...current };
  let changed = false;

  for (const alias of aliases) {
    if (alias && next[alias] !== gameId) {
      next[alias] = gameId;
      changed = true;
    }
  }

  if (changed) {
    store.set(sportsGameAliasAtom, next);
  }
}

/**
 * Removes cached game state atoms that are no longer visible.
 */
export function pruneStaleSportsGameStates(
  store: Store,
  activeGameIds: ReadonlySet<string>,
): void {
  for (const gameId of sportsGameStateAtomFamily.getParams()) {
    if (!activeGameIds.has(gameId)) {
      sportsGameStateAtomFamily.remove(gameId);
    }
  }

  for (const lookupKey of sportsGameStateLookupAtomFamily.getParams()) {
    const isActive = lookupKey
      .split('|')
      .filter(Boolean)
      .some((key) => activeGameIds.has(key));

    if (!isActive) {
      sportsGameStateLookupAtomFamily.remove(lookupKey);
    }
  }

  // Keep aliases only while their lookup key or canonical game id is visible.
  const currentAliases = store.get(sportsGameAliasAtom);
  const nextAliases: Record<string, string> = {};

  for (const [alias, gameId] of Object.entries(currentAliases)) {
    if (activeGameIds.has(alias) || activeGameIds.has(gameId)) {
      nextAliases[alias] = gameId;
    }
  }

  if (Object.keys(nextAliases).length !== Object.keys(currentAliases).length) {
    store.set(sportsGameAliasAtom, nextAliases);
  }
}
