'use client';

import { useStore } from 'jotai';
import { useCallback, useSyncExternalStore } from 'react';
import { outcomePriceAtomFamily } from '@/lib/atoms/prices';
import type { ChartOutcome } from '@/lib/chart/types';
import { getOutcomePriceKey } from '@/lib/prices/outcomeKey';

function buildLiveOutcomes(
  outcomes: ChartOutcome[],
  store: ReturnType<typeof useStore>,
): ChartOutcome[] {
  return outcomes.map((outcome) => {
    const outcomeKey = getOutcomePriceKey(outcome.marketId, outcome.id);
    const livePrice = store.get(outcomePriceAtomFamily(outcomeKey));

    return {
      ...outcome,
      price: livePrice?.value ?? outcome.price,
    };
  });
}

/**
 * Merges live outcome atom prices into chart outcome metadata.
 */
export function useLiveChartOutcomes(outcomes: ChartOutcome[]): ChartOutcome[] {
  const store = useStore();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const unsubs = outcomes.map((outcome) => {
        const outcomeKey = getOutcomePriceKey(outcome.marketId, outcome.id);
        return store.sub(outcomePriceAtomFamily(outcomeKey), onStoreChange);
      });

      return () => {
        for (const unsub of unsubs) {
          unsub();
        }
      };
    },
    [outcomes, store],
  );

  const getSnapshot = useCallback(
    () => buildLiveOutcomes(outcomes, store),
    [outcomes, store],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
