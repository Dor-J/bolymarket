import { describe, expect, it } from "vitest";
import {
  deriveEllipsisOutcomeDisplayName,
  deriveOutcomeDisplayName,
} from "./deriveOutcomeDisplayName";

describe("deriveEllipsisOutcomeDisplayName", () => {
  it("extracts the segment that fills an ellipsis title", () => {
    expect(
      deriveEllipsisOutcomeDisplayName({
        eventTitle: "Netanyahu out by...?",
        marketQuestion: "Netanyahu out by end of 2026?",
      }),
    ).toBe("end of 2026");
  });

  it("supports unicode ellipsis titles", () => {
    expect(
      deriveEllipsisOutcomeDisplayName({
        eventTitle: "Netanyahu out by…?",
        marketQuestion: "Netanyahu out by July 31?",
      }),
    ).toBe("July 31");
  });

  it("returns null when the event title is not an ellipsis template", () => {
    expect(
      deriveEllipsisOutcomeDisplayName({
        eventTitle: "World Cup Winner",
        marketQuestion: "Will France win the World Cup?",
      }),
    ).toBeNull();
  });
});

describe("deriveOutcomeDisplayName", () => {
  it("prefers ellipsis replacements over the fallback label", () => {
    expect(
      deriveOutcomeDisplayName({
        eventTitle: "Netanyahu out by...?",
        marketQuestion: "Netanyahu out by March 31?",
        fallback: "Netanyahu out",
      }),
    ).toBe("March 31");
  });
});
