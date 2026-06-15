import { describe, expect, it } from "vitest";
import { getOutcomeColor, OUTCOME_COLORS } from "./colors";

describe("getOutcomeColor", () => {
  it("returns palette colors by index", () => {
    expect(getOutcomeColor(0)).toBe(OUTCOME_COLORS[0]);
    expect(getOutcomeColor(1)).toBe(OUTCOME_COLORS[1]);
  });

  it("wraps indices beyond the palette length", () => {
    expect(getOutcomeColor(OUTCOME_COLORS.length)).toBe(OUTCOME_COLORS[0]);
    expect(getOutcomeColor(OUTCOME_COLORS.length + 2)).toBe(OUTCOME_COLORS[2]);
  });
});
