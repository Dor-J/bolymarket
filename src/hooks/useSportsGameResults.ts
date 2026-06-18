'use client';

import { useEffect, useMemo } from 'react';
import { useStore } from 'jotai';
import { pruneStaleSportsGameStates } from '@/lib/atoms/sportsGameState';
import { getGameStateLookupKeys } from '@/lib/sports/resolveGameState';
import { acquireSportsWebSocketEngine } from '@/lib/realtime/sportsWebSocketEngine';
import type { SportsGame } from '@/types/polymarket';

/**
 * Subscribes to the Sports WebSocket for visible games.
 */
export function useSportsGameResults(games: SportsGame[]): void {
  const store = useStore();

  const lookupKeys = useMemo(
    () => games.flatMap((game) => getGameStateLookupKeys(game)),
    [games],
  );
  const lookupSignature = lookupKeys.join('|');

  useEffect(() => {
    const activeIds = new Set(lookupKeys);
    pruneStaleSportsGameStates(store, activeIds);

    if (lookupKeys.length === 0) {
      return undefined;
    }

    const lease = acquireSportsWebSocketEngine(store);
    return () => {
      lease.release();
    };
  }, [lookupKeys, lookupSignature, store]);
}
