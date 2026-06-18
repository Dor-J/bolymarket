'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useStore } from 'jotai';
import { seedOutcomePrices } from '@/lib/atoms/seedPrices';
import type { OutcomePriceSeed } from '@/lib/prices/visibleOutcomeKeys';
import { getOutcomeKeysFromSeeds } from '@/lib/prices/visibleOutcomeKeys';
import {
  acquireLivePriceEngine,
  type LivePriceEngineLease,
} from '@/lib/realtime/livePriceEngineManager';

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
  const leaseRef = useRef<LivePriceEngineLease | null>(null);

  const seedsSignature = useMemo(() => getSeedsSignature(seeds), [seeds]);
  const outcomeKeys = useMemo(
    () => getOutcomeKeysFromSeeds(seeds).slice().sort(),
    [seeds],
  );

  useEffect(() => {
    const lease = acquireLivePriceEngine(store, [], []);
    leaseRef.current = lease;
    return () => {
      leaseRef.current = null;
      lease.release();
    };
  }, [store]);

  useEffect(() => {
    seedOutcomePrices(store, seeds);
  }, [store, seeds, seedsSignature]);

  useEffect(() => {
    leaseRef.current?.update(outcomeKeys, seeds);
  }, [outcomeKeys, seeds, store]);
}
