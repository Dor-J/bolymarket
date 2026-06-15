'use client';

import { useEffect, useMemo } from 'react';
import { useStore } from 'jotai';
import {
  commitOutcomePriceTick,
  pruneStaleOutcomePrices,
} from '@/lib/atoms/prices';
import { seedOutcomePrices } from '@/lib/atoms/seedPrices';
import { configureCoalesceFlush } from '@/lib/prices/coalesceTicks';
import type { OutcomePriceSeed } from '@/lib/prices/visibleOutcomeKeys';
import {
  getOutcomeKeysFromSeeds,
  getOutcomeKeysSignature,
} from '@/lib/prices/visibleOutcomeKeys';
import { acquireLivePriceEngine } from '@/lib/realtime/livePriceEngineManager';

function getSeedsSignature(seeds: OutcomePriceSeed[]): string {
  return seeds
    .map((seed) => `${seed.outcomeKey}:${seed.price.toFixed(6)}`)
    .sort()
    .join('|');
}

/**
 * Seeds outcome price atoms and starts the shared live price engine for visible keys.
 */
export function useLivePrices(seeds: OutcomePriceSeed[]): void {
  const store = useStore();

  const seedsSignature = useMemo(() => getSeedsSignature(seeds), [seeds]);
  const outcomeKeysSignature = useMemo(
    () => getOutcomeKeysSignature(seeds),
    [seeds],
  );
  const outcomeKeys = useMemo(
    () => getOutcomeKeysFromSeeds(seeds).slice().sort(),
    [outcomeKeysSignature],
  );

  useEffect(() => {
    configureCoalesceFlush(({ outcomeKey, value }) => {
      commitOutcomePriceTick(store, outcomeKey, value);
    });

    return () => {
      configureCoalesceFlush(null);
    };
  }, [store]);

  useEffect(() => {
    seedOutcomePrices(store, seeds);
  }, [store, seeds, seedsSignature]);

  useEffect(() => {
    const activeKeys = new Set(outcomeKeys);
    pruneStaleOutcomePrices(activeKeys);

    const lease = acquireLivePriceEngine(store, outcomeKeys, seeds);

    return () => {
      lease.release();
    };
  }, [store, outcomeKeys, seedsSignature]);
}
