import { createStore } from 'jotai';
import { afterEach, describe, expect, it } from 'vitest';
import type { SportsGameState } from '@/types/polymarket';
import {
  getSportsGameStateLookupAtomKey,
  pruneStaleSportsGameStates,
  setSportsGameStateAliases,
  sportsGameStateAtomFamily,
  sportsGameStateLookupAtomFamily,
} from './sportsGameState';

const stateA: SportsGameState = {
  gameId: '100',
  slug: 'france-vs-brazil',
  homeTeam: 'France',
  awayTeam: 'Brazil',
  score: '1-0',
  live: true,
};

const stateB: SportsGameState = {
  gameId: '200',
  slug: 'spain-vs-germany',
  homeTeam: 'Spain',
  awayTeam: 'Germany',
  score: '0-0',
  live: false,
};

function cleanupAtomFamilies(): void {
  for (const key of sportsGameStateAtomFamily.getParams()) {
    sportsGameStateAtomFamily.remove(key);
  }

  for (const key of sportsGameStateLookupAtomFamily.getParams()) {
    sportsGameStateLookupAtomFamily.remove(key);
  }
}

describe('sportsGameState atoms', () => {
  afterEach(() => {
    cleanupAtomFamilies();
  });

  it('serializes lookup keys without empty entries', () => {
    expect(getSportsGameStateLookupAtomKey(['100', '', 'france-vs-brazil'])).toBe(
      '100|france-vs-brazil',
    );
  });

  it('resolves canonical game state directly by game id', () => {
    const store = createStore();
    store.set(sportsGameStateAtomFamily(stateA.gameId), stateA);

    const lookupKey = getSportsGameStateLookupAtomKey([stateA.gameId]);

    expect(store.get(sportsGameStateLookupAtomFamily(lookupKey))).toBe(stateA);
  });

  it('resolves slug and matchup aliases to a canonical game id atom', () => {
    const store = createStore();
    store.set(sportsGameStateAtomFamily(stateA.gameId), stateA);
    setSportsGameStateAliases(store, stateA.gameId, [
      'france-vs-brazil',
      'france brazil',
    ]);

    expect(
      store.get(sportsGameStateLookupAtomFamily('france-vs-brazil')),
    ).toBe(stateA);
    expect(store.get(sportsGameStateLookupAtomFamily('france brazil'))).toBe(
      stateA,
    );
  });

  it('allows alias ownership to move to a newer canonical game id', () => {
    const store = createStore();
    store.set(sportsGameStateAtomFamily(stateA.gameId), stateA);
    store.set(sportsGameStateAtomFamily(stateB.gameId), stateB);

    setSportsGameStateAliases(store, stateA.gameId, ['shared-slug']);
    expect(store.get(sportsGameStateLookupAtomFamily('shared-slug'))).toBe(
      stateA,
    );

    setSportsGameStateAliases(store, stateB.gameId, ['shared-slug']);
    expect(store.get(sportsGameStateLookupAtomFamily('shared-slug'))).toBe(
      stateB,
    );
  });

  it('prunes stale canonical atoms, lookup atoms, and aliases', () => {
    const store = createStore();
    store.set(sportsGameStateAtomFamily(stateA.gameId), stateA);
    store.set(sportsGameStateAtomFamily(stateB.gameId), stateB);
    setSportsGameStateAliases(store, stateA.gameId, ['france-vs-brazil']);
    setSportsGameStateAliases(store, stateB.gameId, ['spain-vs-germany']);

    expect(store.get(sportsGameStateLookupAtomFamily('spain-vs-germany'))).toBe(
      stateB,
    );

    pruneStaleSportsGameStates(store, new Set([stateA.gameId]));

    expect(store.get(sportsGameStateAtomFamily(stateA.gameId))).toBe(stateA);
    expect(store.get(sportsGameStateAtomFamily(stateB.gameId))).toBeNull();
    expect(
      store.get(sportsGameStateLookupAtomFamily('france-vs-brazil')),
    ).toBe(stateA);
    expect(
      store.get(sportsGameStateLookupAtomFamily('spain-vs-germany')),
    ).toBeNull();
  });
});
