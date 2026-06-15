import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLivePrices } from "./useLivePrices";

describe("useLivePrices", () => {
  it("accepts an empty market ID array", () => {
    expect(() => {
      renderHook(() => useLivePrices([]));
    }).not.toThrow();
  });

  it("accepts multiple market IDs", () => {
    expect(() => {
      renderHook(() => useLivePrices(["m1", "m2"]));
    }).not.toThrow();
  });

  it("returns undefined because the hook is void", () => {
    const { result } = renderHook(() => useLivePrices(["m1"]));

    expect(result.current).toBeUndefined();
  });

  it("remains stable across rerenders with the same IDs", () => {
    const { rerender } = renderHook(
      ({ marketIds }: { marketIds: string[] }) => useLivePrices(marketIds),
      { initialProps: { marketIds: ["m1"] } },
    );

    expect(() => {
      rerender({ marketIds: ["m1"] });
    }).not.toThrow();
  });

  // Phase 4: seed marketPriceAtomFamily, subscribe to WebSocket/simulation, cleanup on unmount
  describe.todo("Phase 4 — live price subscription");
});
