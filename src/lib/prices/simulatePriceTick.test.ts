import { describe, expect, it } from "vitest";
import { simulatePriceTick } from "./simulatePriceTick";

describe("simulatePriceTick", () => {
  it("stays within simulation bounds", () => {
    for (let index = 0; index < 50; index += 1) {
      const next = simulatePriceTick(0.5);
      expect(next).toBeGreaterThanOrEqual(0.01);
      expect(next).toBeLessThanOrEqual(0.99);
    }
  });

  it("respects a custom max step", () => {
    const next = simulatePriceTick(0.5, { maxStep: 0.001 });
    expect(Math.abs(next - 0.5)).toBeLessThanOrEqual(0.001);
  });

  it("clamps extreme starting values", () => {
    expect(simulatePriceTick(0.001)).toBeGreaterThanOrEqual(0.01);
    expect(simulatePriceTick(0.999)).toBeLessThanOrEqual(0.99);
  });
});
