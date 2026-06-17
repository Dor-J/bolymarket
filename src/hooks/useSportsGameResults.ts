'use client';

import { useEffect } from 'react';
import { useStore } from 'jotai';
import { pruneStaleSportsGameStates } from '@/lib/atoms/sportsGameState';
import { acquireSportsWebSocketEngine } from '@/lib/realtime/sportsWebSocketEngine';

/**
 * Subscribes to the Sports WebSocket for visible game ids.
 */
export function useSportsGameResults(gameIds: string[]): void {
  const store = useStore();

  useEffect(() => {
    const activeIds = new Set(gameIds);
    pruneStaleSportsGameStates(activeIds);

    if (gameIds.length === 0) {
      return undefined;
    }

    const lease = acquireSportsWebSocketEngine(store);
    return () => {
      lease.release();
    };
  }, [store, gameIds.join('|')]);
}
