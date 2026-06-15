import type { Store } from 'jotai/vanilla/store';
import type { OutcomePriceSeed } from '@/lib/prices/visibleOutcomeKeys';
import { createLivePriceEngine } from './priceSourceFactory';
import type { PriceSource } from './types';

const STOP_DEBOUNCE_MS = 300;

interface LivePriceSubscriber {
  outcomeKeys: string[];
  seeds: OutcomePriceSeed[];
}

let engine: PriceSource | null = null;
let store: Store | null = null;
const subscribers = new Map<symbol, LivePriceSubscriber>();
let pendingStop: ReturnType<typeof setTimeout> | null = null;

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
  getEngine().start(outcomeKeys, store, seeds);
}

function scheduleStop(): void {
  if (pendingStop) {
    clearTimeout(pendingStop);
  }

  pendingStop = setTimeout(() => {
    pendingStop = null;
    if (subscribers.size === 0 && engine) {
      engine.stop();
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
  const id = Symbol('live-price-subscriber');
  subscribers.set(id, { outcomeKeys, seeds });
  syncEngine();

  return {
    update(nextOutcomeKeys, nextSeeds) {
      if (!subscribers.has(id)) {
        return;
      }

      subscribers.set(id, {
        outcomeKeys: nextOutcomeKeys,
        seeds: nextSeeds,
      });
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
  engine = null;
  store = null;
  subscribers.clear();
}
