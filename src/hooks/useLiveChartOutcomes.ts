'use client';

import { useStore } from 'jotai';
import { useCallback, useRef, useSyncExternalStore } from 'react';
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

function getLiveOutcomesSignature(
  outcomes: ChartOutcome[],
  store: ReturnType<typeof useStore>,
): string {
  return outcomes
    .map((outcome) => {
      const outcomeKey = getOutcomePriceKey(outcome.marketId, outcome.id);
      const livePrice = store.get(outcomePriceAtomFamily(outcomeKey));
      return `${outcome.id}:${outcome.marketId}:${livePrice?.value ?? outcome.price}`;
    })
    .join('|');
}

/**
 * Merges live outcome atom prices into chart outcome metadata.
 */
export function useLiveChartOutcomes(outcomes: ChartOutcome[]): ChartOutcome[] {
  const store = useStore();
  const snapshotRef = useRef<ChartOutcome[]>(outcomes);
  const signatureRef = useRef<string>('');

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

  const getSnapshot = useCallback(() => {
    const signature = getLiveOutcomesSignature(outcomes, store);

    if (signature === signatureRef.current) {
      return snapshotRef.current;
    }

    const next = buildLiveOutcomes(outcomes, store);
    signatureRef.current = signature;
    snapshotRef.current = next;
    return next;
  }, [outcomes, store]);

  const getServerSnapshot = useCallback(() => outcomes, [outcomes]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
