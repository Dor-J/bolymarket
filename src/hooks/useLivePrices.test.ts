import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { outcomePriceAtomFamily } from "@/lib/atoms/prices";
import { flushPendingTicksForTests } from "@/lib/prices/coalesceTicks";
import { createJotaiStore, renderHookWithProviders } from "@/test/test-utils";
import { useLivePrices } from "./useLivePrices";

describe("useLivePrices", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("accepts empty seeds without throwing", () => {
    expect(() => {
      renderHookWithProviders(() => useLivePrices([]));
    }).not.toThrow();
  });

  it("seeds outcome atoms from API snapshots", async () => {
    const jotaiStore = createJotaiStore();

    renderHookWithProviders(
      () =>
        useLivePrices([
          {
            outcomeKey: "market-1:outcome-yes",
            price: 0.6,
          },
        ]),
      { jotaiStore },
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(
      jotaiStore.get(outcomePriceAtomFamily("market-1:outcome-yes"))?.value,
    ).toBe(0.6);
  });

  it("updates seeded prices over time via simulation", async () => {
    const jotaiStore = createJotaiStore();

    renderHookWithProviders(
      () =>
        useLivePrices([
          {
            outcomeKey: "market-1:outcome-yes",
            price: 0.6,
          },
        ]),
      { jotaiStore },
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
      flushPendingTicksForTests();
    });

    expect(
      jotaiStore.get(outcomePriceAtomFamily("market-1:outcome-yes"))?.value,
    ).not.toBe(0.6);
  });

  it("cleans up the simulation engine on unmount", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = renderHookWithProviders(() =>
      useLivePrices([{ outcomeKey: "m1:yes", price: 0.5 }]),
    );

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("does not restart the engine when seeds get a new array reference with the same keys", async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const seeds = [{ outcomeKey: "market-1:outcome-yes", price: 0.6 }];
    const { rerender } = renderHookWithProviders(
      ({ nextSeeds }) => useLivePrices(nextSeeds),
      { initialProps: { nextSeeds: seeds } },
    );

    await act(async () => {
      await Promise.resolve();
    });

    clearIntervalSpy.mockClear();

    rerender({ nextSeeds: [...seeds] });

    await act(async () => {
      await Promise.resolve();
    });

    expect(clearIntervalSpy).not.toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
