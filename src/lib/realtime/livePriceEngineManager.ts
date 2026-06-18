import type { Store } from 'jotai/vanilla/store';
import {
  commitOutcomePriceTick,
  pruneStaleOutcomePrices,
} from '@/lib/atoms/prices';
import { configureCoalesceFlush } from '@/lib/prices/coalesceTicks';
import type { OutcomePriceSeed } from '@/lib/prices/visibleOutcomeKeys';
import { createLivePriceEngine } from './priceSourceFactory';
import type { PriceSource } from './types';

const STOP_DEBOUNCE_MS = 300;

interface LivePriceSubscriber {
  outcomeKeys: string[];
  seeds: OutcomePriceSeed[];
  outcomeKeysSignature: string;
  seedsSignature: string;
}

let engine: PriceSource | null = null;
let store: Store | null = null;
const subscribers = new Map<symbol, LivePriceSubscriber>();
let pendingStop: ReturnType<typeof setTimeout> | null = null;
let coalesceFlushConfigured = false;

function getOutcomeKeysSignature(outcomeKeys: string[]): string {
  return outcomeKeys.join('|');
}

function getSeedsSignature(seeds: OutcomePriceSeed[]): string {
  return seeds
    .map((seed) =>
      [
        seed.outcomeKey,
        seed.price.toFixed(6),
        seed.assetId ?? '',
        seed.eventSlug ?? '',
        seed.marketSlug ?? '',
      ].join(':'),
    )
    .sort()
    .join('|');
}

function createSubscriber(
  outcomeKeys: string[],
  seeds: OutcomePriceSeed[],
): LivePriceSubscriber {
  return {
    outcomeKeys,
    seeds,
    outcomeKeysSignature: getOutcomeKeysSignature(outcomeKeys),
    seedsSignature: getSeedsSignature(seeds),
  };
}

function getEngine(): PriceSource {
  if (!engine) {
    engine = createLivePriceEngine();
  }

  return engine;
}

function mergeSubscriberState(): {
  outcomeKeys: string[];
  seeds: OutcomePriceSeed[];
} {
  const seedByKey = new Map<string, OutcomePriceSeed>();
  const outcomeKeys = new Set<string>();

  for (const subscriber of subscribers.values()) {
    for (const key of subscriber.outcomeKeys) {
      outcomeKeys.add(key);
    }

    for (const seed of subscriber.seeds) {
      seedByKey.set(seed.outcomeKey, seed);
    }
  }

  return {
    outcomeKeys: Array.from(outcomeKeys).sort(),
    seeds: Array.from(seedByKey.values()),
  };
}

function syncEngine(): void {
  if (!store || subscribers.size === 0) {
    return;
  }

  const { outcomeKeys, seeds } = mergeSubscriberState();
  pruneStaleOutcomePrices(new Set(outcomeKeys));

  if (outcomeKeys.length === 0) {
    engine?.stop();
    return;
  }

  getEngine().start(outcomeKeys, store, seeds);
}

function configureFlushForStore(activeStore: Store): void {
  configureCoalesceFlush(({ outcomeKey, value }) => {
    commitOutcomePriceTick(activeStore, outcomeKey, value);
  });
  coalesceFlushConfigured = true;
}

function resetFlush(): void {
  if (!coalesceFlushConfigured) {
    return;
  }

  configureCoalesceFlush(null);
  coalesceFlushConfigured = false;
}

function scheduleStop(): void {
  if (pendingStop) {
    clearTimeout(pendingStop);
  }

  pendingStop = setTimeout(() => {
    pendingStop = null;
    if (subscribers.size === 0 && engine) {
      engine.stop();
      resetFlush();
    }
  }, STOP_DEBOUNCE_MS);
}

export interface LivePriceEngineLease {
  /** Updates the subscriber's visible outcome keys and seeds. */
  update(outcomeKeys: string[], seeds: OutcomePriceSeed[]): void;
  /** Releases the lease; disconnect is debounced for React Strict Mode. */
  release(): void;
}

/**
 * Acquires a shared live-price engine lease (ref-counted singleton).
 */
export function acquireLivePriceEngine(
  activeStore: Store,
  outcomeKeys: string[],
  seeds: OutcomePriceSeed[],
): LivePriceEngineLease {
  if (pendingStop) {
    clearTimeout(pendingStop);
    pendingStop = null;
  }

  store = activeStore;
  configureFlushForStore(activeStore);
  const id = Symbol('live-price-subscriber');
  subscribers.set(id, createSubscriber(outcomeKeys, seeds));
  syncEngine();

  return {
    update(nextOutcomeKeys, nextSeeds) {
      if (!subscribers.has(id)) {
        return;
      }

      const current = subscribers.get(id);
      const next = createSubscriber(nextOutcomeKeys, nextSeeds);
      if (
        current?.outcomeKeysSignature === next.outcomeKeysSignature &&
        current.seedsSignature === next.seedsSignature
      ) {
        return;
      }

      subscribers.set(id, next);
      syncEngine();
    },
    release() {
      subscribers.delete(id);
      if (subscribers.size === 0) {
        scheduleStop();
        return;
      }

      syncEngine();
    },
  };
}

/** Clears singleton state — test helper only. */
export function resetLivePriceEngineForTests(): void {
  if (pendingStop) {
    clearTimeout(pendingStop);
    pendingStop = null;
  }

  engine?.stop();
  resetFlush();
  engine = null;
  store = null;
  subscribers.clear();
}
