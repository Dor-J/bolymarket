import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as reducedMotionModule from "./useReducedMotion";
import { usePriceFlash } from "./usePriceFlash";

describe("usePriceFlash with reduced motion", () => {
  it("returns neutral styling when reduced motion is enabled", async () => {
    vi.spyOn(reducedMotionModule, "useReducedMotion").mockReturnValue(true);

    const { result } = renderHook(() => usePriceFlash(0.7, 0.5, Date.now()));

    await waitFor(() => {
      expect(result.current.direction).toBe("none");
      expect(result.current.flashClassName).toBe("");
    });
  });
});
