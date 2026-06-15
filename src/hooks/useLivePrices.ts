"use client";

import { useEffect, useMemo, useRef } from "react";
import { useStore } from "jotai";
import { commitOutcomePriceTick } from "@/lib/atoms/prices";
import { seedOutcomePrices } from "@/lib/atoms/seedPrices";
import { configureCoalesceFlush } from "@/lib/prices/coalesceTicks";
import type { OutcomePriceSeed } from "@/lib/prices/visibleOutcomeKeys";
import { getOutcomeKeysFromSeeds } from "@/lib/prices/visibleOutcomeKeys";
import { createSimulationEngine } from "@/lib/realtime/simulationEngine";

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
  const engineRef = useRef(createSimulationEngine());
  const seedsSignature = useMemo(() => getSeedsSignature(seeds), [seeds]);
  const outcomeKeys = useMemo(() => getOutcomeKeysFromSeeds(seeds), [seeds]);

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
  }, [store, seedsSignature, seeds]);

  useEffect(() => {
    const engine = engineRef.current;
    engine.start(outcomeKeys, store);

    return () => {
      engine.stop();
    };
  }, [store, outcomeKeys, seedsSignature]);
}
