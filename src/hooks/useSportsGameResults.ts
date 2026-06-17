'use client';

import { useEffect } from 'react';
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

  const lookupKeys = games.flatMap((game) => getGameStateLookupKeys(game));

  useEffect(() => {
    const activeIds = new Set(lookupKeys);
    pruneStaleSportsGameStates(activeIds);

    if (lookupKeys.length === 0) {
      return undefined;
    }

    const lease = acquireSportsWebSocketEngine(store);
    return () => {
      lease.release();
    };
  }, [store, lookupKeys.join('|')]);
}
