"use client";

import { useEffect, useMemo, useRef } from "react";
import { useStore } from "jotai";
import {
  commitOutcomePriceTick,
  pruneStaleOutcomePrices,
} from "@/lib/atoms/prices";
import { seedOutcomePrices } from "@/lib/atoms/seedPrices";
import { configureCoalesceFlush } from "@/lib/prices/coalesceTicks";
import type { OutcomePriceSeed } from "@/lib/prices/visibleOutcomeKeys";
import {
  getOutcomeKeysFromSeeds,
  getOutcomeKeysSignature,
} from "@/lib/prices/visibleOutcomeKeys";
import { createLivePriceEngine } from "@/lib/realtime/priceSourceFactory";

function getSeedsSignature(seeds: OutcomePriceSeed[]): string {
  return seeds
    .map((seed) => `${seed.outcomeKey}:${seed.price.toFixed(6)}`)
    .sort()
    .join("|");
}

/**
 * Seeds outcome price atoms and starts the simulation engine for visible keys.
 */
export function useLivePrices(seeds: OutcomePriceSeed[]): void {
  const store = useStore();
  const engineRef = useRef(createLivePriceEngine());
  const seedsRef = useRef(seeds);
  seedsRef.current = seeds;

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
    seedOutcomePrices(store, seedsRef.current);
  }, [store, seedsSignature]);

  useEffect(() => {
    const activeKeys = new Set(outcomeKeys);
    pruneStaleOutcomePrices(activeKeys);

    const engine = engineRef.current;
    engine.start(outcomeKeys, store, seedsRef.current);

    return () => {
      engine.stop();
    };
  }, [store, outcomeKeys]);
}
