import { describe, expect, it } from "vitest";
import { formatCents, formatPercent, getYesDisplayPrice } from "./price";

describe("formatPercent", () => {
  it("formats whole percentages", () => {
    expect(formatPercent(0.16)).toBe("16%");
    expect(formatPercent(0)).toBe("0%");
    expect(formatPercent(1)).toBe("100%");
  });

  it("formats decimal percentages", () => {
    expect(formatPercent(0.163, 1)).toBe("16.3%");
  });

  it("clamps out-of-range values", () => {
    expect(formatPercent(-0.1)).toBe("0%");
    expect(formatPercent(1.5)).toBe("100%");
  });
});

describe("formatCents", () => {
  it("formats cent values", () => {
    expect(formatCents(0.163)).toBe("16.3¢");
    expect(formatCents(0.16)).toBe("16¢");
  });

  it("clamps invalid values", () => {
    expect(formatCents(Number.NaN)).toBe("0¢");
  });
});

describe("getYesDisplayPrice", () => {
  it("prefers the Yes outcome", () => {
    expect(
      getYesDisplayPrice([
        { name: "Yes", price: 0.28 },
        { name: "No", price: 0.72 },
      ]),
    ).toBe(0.28);
  });

  it("falls back to the first outcome", () => {
    expect(getYesDisplayPrice([{ name: "Candidate", price: 0.4 }])).toBe(0.4);
  });
});
