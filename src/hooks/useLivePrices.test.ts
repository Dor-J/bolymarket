import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { outcomePriceAtomFamily } from "@/lib/atoms/prices";
import { createJotaiStore, renderHookWithProviders } from "@/test/test-utils";
import { useLivePrices } from "./useLivePrices";

const mockStart = vi.fn();
const mockStop = vi.fn();

vi.mock("@/lib/realtime/priceSourceFactory", () => ({
  createLivePriceEngine: () => ({
    start: mockStart,
    stop: mockStop,
  }),
}));

describe("useLivePrices", () => {
  beforeEach(() => {
    mockStart.mockClear();
    mockStop.mockClear();
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

  it("starts the live price engine with outcome keys and seeds", async () => {
    const seeds = [
      {
        outcomeKey: "market-1:outcome-yes",
        price: 0.6,
        assetId: "token-yes",
        eventSlug: "event-slug",
      },
    ];

    renderHookWithProviders(() => useLivePrices(seeds));

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockStart).toHaveBeenCalledWith(
      ["market-1:outcome-yes"],
      expect.any(Object),
      seeds,
    );
  });

  it("stops the live price engine on unmount", async () => {
    const { unmount } = renderHookWithProviders(() =>
      useLivePrices([{ outcomeKey: "m1:yes", price: 0.5 }]),
    );

    await act(async () => {
      await Promise.resolve();
    });

    unmount();

    expect(mockStop).toHaveBeenCalled();
  });

  it("does not restart the engine when seeds get a new array reference with the same keys", async () => {
    const seeds = [{ outcomeKey: "market-1:outcome-yes", price: 0.6 }];
    const { rerender } = renderHookWithProviders(
      ({ nextSeeds }) => useLivePrices(nextSeeds),
      { initialProps: { nextSeeds: seeds } },
    );

    await act(async () => {
      await Promise.resolve();
    });

    mockStart.mockClear();
    mockStop.mockClear();

    rerender({ nextSeeds: [...seeds] });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockStop).not.toHaveBeenCalled();
    expect(mockStart).not.toHaveBeenCalled();
  });
});
