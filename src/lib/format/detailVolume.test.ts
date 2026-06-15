import { describe, expect, it } from "vitest";
import { formatDetailVolume } from "./detailVolume";

describe("formatDetailVolume", () => {
  it("formats zero and invalid volumes", () => {
    expect(formatDetailVolume(0)).toBe("$0 Vol.");
    expect(formatDetailVolume(Number.NaN)).toBe("$0 Vol.");
    expect(formatDetailVolume(-100)).toBe("$0 Vol.");
  });

  it("formats volume with full locale precision", () => {
    expect(formatDetailVolume(2_356_072_319)).toBe("$2,356,072,319 Vol.");
    expect(formatDetailVolume(45_776_963)).toBe("$45,776,963 Vol.");
  });

  it("rounds fractional volumes", () => {
    expect(formatDetailVolume(1234.6)).toBe("$1,235 Vol.");
  });
});
