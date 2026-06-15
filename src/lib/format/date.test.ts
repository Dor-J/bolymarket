import { describe, expect, it } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  it("formats a valid ISO date", () => {
    expect(formatDate("2026-07-20T00:00:00.000Z")).toBe("Jul 20, 2026");
  });

  it("returns fallback for undefined", () => {
    expect(formatDate(undefined)).toBe("—");
  });

  it("returns fallback for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("—");
  });
});
