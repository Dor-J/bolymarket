import { createStore } from "jotai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  commitOutcomePriceTick,
  outcomePriceAtomFamily,
  seedOutcomePrice,
} from "@/lib/atoms/prices";
import {
  configureCoalesceFlush,
  flushPendingTicksForTests,
  resetCoalesceTicksForTests,
} from "@/lib/prices/coalesceTicks";
import { createSimulationEngine } from "./simulationEngine";

describe("createSimulationEngine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetCoalesceTicksForTests();
  });

  it("enqueues ticks for active outcome keys", () => {
    const store = createStore();
    seedOutcomePrice(store, "m1:yes", 0.5);

    configureCoalesceFlush(({ outcomeKey, value }) => {
      commitOutcomePriceTick(store, outcomeKey, value);
    });

    const engine = createSimulationEngine({ intervalMs: 1000, maxStep: 0.02 });
    engine.start(["m1:yes"], store);

    vi.advanceTimersByTime(1500);
    flushPendingTicksForTests();

    engine.stop();

    expect(store.get(outcomePriceAtomFamily("m1:yes"))?.value).not.toBe(0.5);
  });

  it("stops scheduling ticks after stop()", () => {
    const store = createStore();
    seedOutcomePrice(store, "m1:yes", 0.5);

    configureCoalesceFlush(({ outcomeKey, value }) => {
      commitOutcomePriceTick(store, outcomeKey, value);
    });

    const engine = createSimulationEngine({ intervalMs: 500, maxStep: 0.02 });
    engine.start(["m1:yes"], store);
    engine.stop();

    const valueAfterStop = store.get(outcomePriceAtomFamily("m1:yes"))?.value;
    vi.advanceTimersByTime(3000);
    flushPendingTicksForTests();

    expect(store.get(outcomePriceAtomFamily("m1:yes"))?.value).toBe(
      valueAfterStop,
    );
  });
});
