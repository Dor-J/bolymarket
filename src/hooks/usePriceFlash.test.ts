import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePriceFlash } from "./usePriceFlash";

describe("usePriceFlash", () => {
  it("returns neutral direction and empty flash class", () => {
    const { result } = renderHook(() => usePriceFlash(0.6, 0.4));

    expect(result.current).toEqual({
      direction: "none",
      flashClassName: "",
    });
  });

  it("returns neutral result regardless of price inputs", () => {
    const { result: higher } = renderHook(() => usePriceFlash(0.6, 0.4));
    const { result: lower } = renderHook(() => usePriceFlash(0.3, 0.8));

    expect(higher.current.direction).toBe("none");
    expect(lower.current.direction).toBe("none");
    expect(higher.current.flashClassName).toBe("");
    expect(lower.current.flashClassName).toBe("");
  });

  it("keeps a stable memoized reference when inputs are unchanged", () => {
    const { result, rerender } = renderHook(
      ({ current, previous }: { current: number; previous: number }) =>
        usePriceFlash(current, previous),
      { initialProps: { current: 0.5, previous: 0.4 } },
    );

    const firstReference = result.current;
    rerender({ current: 0.5, previous: 0.4 });

    expect(result.current).toBe(firstReference);
  });

  it("returns neutral state when inputs change before Phase 4 implementation", () => {
    const { result, rerender } = renderHook(
      ({ current, previous }: { current: number; previous: number }) =>
        usePriceFlash(current, previous),
      { initialProps: { current: 0.5, previous: 0.4 } },
    );

    rerender({ current: 0.7, previous: 0.5 });

    expect(result.current).toEqual({
      direction: "none",
      flashClassName: "",
    });
  });

  // Phase 4: direction up/down, flashClassName green/red, prefers-reduced-motion
  describe.todo("Phase 4 — flash styling on price direction change");
});
