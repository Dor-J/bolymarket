import type { Store } from "jotai/vanilla/store";
import { outcomePriceAtomFamily } from "@/lib/atoms/prices";
import { enqueuePriceTick } from "@/lib/prices/coalesceTicks";
import { simulatePriceTick } from "@/lib/prices/simulatePriceTick";
import type { OutcomePriceSeed } from "@/lib/prices/visibleOutcomeKeys";
import type { PriceSource, SimulationConfig } from "./types";

const DEFAULT_CONFIG: SimulationConfig = {
  intervalMs: 1200,
  maxStep: 0.015,
};

function areOutcomeKeysEqual(current: string[], next: string[]): boolean {
  if (current.length !== next.length) {
    return false;
  }

  for (let index = 0; index < current.length; index += 1) {
    if (current[index] !== next[index]) {
      return false;
    }
  }

  return true;
}

/**
 * Creates a random-walk simulation engine for visible outcome price keys.
 */
export function createSimulationEngine(
  config: Partial<SimulationConfig> = {},
): PriceSource {
  const settings = { ...DEFAULT_CONFIG, ...config };
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let activeKeys: string[] = [];
  let activeStore: Store | null = null;

  function tickRandomOutcome(): void {
    if (activeKeys.length === 0 || !activeStore) {
      return;
    }

    const outcomeKey =
      activeKeys[Math.floor(Math.random() * activeKeys.length)] ??
      activeKeys[0];
    const atom = outcomePriceAtomFamily(outcomeKey);
    const currentState = activeStore.get(atom);
    const currentValue = currentState?.value ?? 0.5;
    const nextValue = simulatePriceTick(currentValue, {
      maxStep: settings.maxStep,
    });

    enqueuePriceTick(outcomeKey, nextValue);
  }

  return {
    start(outcomeKeys: string[], store: Store, _seeds?: OutcomePriceSeed[]) {
      if (
        intervalId !== null &&
        activeStore === store &&
        areOutcomeKeysEqual(activeKeys, outcomeKeys)
      ) {
        return;
      }

      this.stop();
      activeKeys = outcomeKeys;
      activeStore = store;

      if (activeKeys.length === 0) {
        return;
      }

      const jitter = Math.random() * 400;
      intervalId = setInterval(tickRandomOutcome, settings.intervalMs + jitter);
    },
    stop() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }

      activeKeys = [];
      activeStore = null;
    },
  };
}
