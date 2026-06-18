import { describe, expect, it } from "vitest";
import { createMockEvent } from "@/test/fixtures/events";
import {
  getBinaryChancePrice,
  getTopOutcomeRows,
  getYesNoFromMarket,
  mapEventToBinaryProps,
  mapEventToCardProps,
} from "./mapEventToCardProps";
import { resolveCardVariant } from "./resolveCardVariant";

describe("getYesNoFromMarket", () => {
  it("extracts yes and no prices and outcome IDs", () => {
    const result = getYesNoFromMarket({
      id: "m1",
      question: "Will it happen?",
      volume: 100,
      outcomes: [
        { id: "yes-id", name: "Yes", price: 0.28 },
        { id: "no-id", name: "No", price: 0.72 },
      ],
    });

    expect(result).toEqual({
      yesPrice: 0.28,
      noPrice: 0.72,
      yesOutcomeId: "yes-id",
      noOutcomeId: "no-id",
    });
  });

  it("falls back to first two outcomes when Yes/No labels are absent", () => {
    const result = getYesNoFromMarket({
      id: "m2",
      question: "Candidate?",
      volume: 50,
      outcomes: [
        { id: "a", name: "Candidate A", price: 0.4 },
        { id: "b", name: "Candidate B", price: 0.6 },
      ],
    });

    expect(result.yesPrice).toBe(0.4);
    expect(result.noPrice).toBe(0.6);
    expect(result.yesOutcomeId).toBe("a");
  });
});

describe("getBinaryChancePrice", () => {
  it("returns the yes display price for a binary event", () => {
    const event = createMockEvent({
      id: "1",
      slug: "binary",
      title: "Binary",
      markets: [
        {
          id: "m1",
          question: "Q?",
          volume: 1,
          outcomes: [
            { id: "yes", name: "Yes", price: 0.28 },
            { id: "no", name: "No", price: 0.72 },
          ],
        },
      ],
    });

    expect(getBinaryChancePrice(event)).toBe(0.28);
  });

  it("returns zero when the event has no markets", () => {
    const event = createMockEvent({
      id: "2",
      slug: "empty",
      title: "Empty",
      markets: [],
    });

    expect(getBinaryChancePrice(event)).toBe(0);
  });
});

describe("getTopOutcomeRows", () => {
  it("returns top two outcomes by price from a multi-outcome market", () => {
    const event = createMockEvent({
      id: "1",
      slug: "world-cup",
      title: "World Cup",
      markets: [
        {
          id: "m1",
          question: "Winner",
          volume: 100,
          outcomes: [
            { id: "spain", name: "Spain", price: 0.16 },
            { id: "france", name: "France", price: 0.2 },
            { id: "brazil", name: "Brazil", price: 0.1 },
          ],
        },
      ],
    });

    const rows = getTopOutcomeRows(event, 2);

    expect(rows).toHaveLength(2);
    expect(rows[0]?.name).toBe("France");
    expect(rows[1]?.name).toBe("Spain");
  });

  it("uses compact Polymarket-style labels for binary submarkets", () => {
    const event = createMockEvent({
      id: "2",
      slug: "world-cup-binaries",
      title: "World Cup Winner",
      markets: [
        {
          id: "m1",
          question: "Will France win the 2026 FIFA World Cup?",
          volume: 100,
          outcomes: [
            { id: "france-yes", name: "Yes", price: 0.18 },
            { id: "france-no", name: "No", price: 0.82 },
          ],
        },
        {
          id: "m2",
          question: "Will Spain win the 2026 FIFA World Cup?",
          volume: 100,
          outcomes: [
            { id: "spain-yes", name: "Yes", price: 0.14 },
            { id: "spain-no", name: "No", price: 0.86 },
          ],
        },
      ],
    });

    const rows = getTopOutcomeRows(event, 2);

    expect(rows.map((row) => row.name)).toEqual(["France", "Spain"]);
  });

  it("uses ellipsis replacements for binary submarkets", () => {
    const event = createMockEvent({
      id: "3",
      slug: "netanyahu-out-by",
      title: "Netanyahu out by...?",
      markets: [
        {
          id: "m1",
          question: "Netanyahu out by end of 2026?",
          volume: 100,
          outcomes: [
            { id: "end-2026-yes", name: "Yes", price: 0.64 },
            { id: "end-2026-no", name: "No", price: 0.36 },
          ],
        },
        {
          id: "m2",
          question: "Netanyahu out by July 31?",
          volume: 100,
          outcomes: [
            { id: "july-yes", name: "Yes", price: 0.05 },
            { id: "july-no", name: "No", price: 0.95 },
          ],
        },
      ],
    });

    const rows = getTopOutcomeRows(event, 2);

    expect(rows.map((row) => row.name)).toEqual(["end of 2026", "July 31"]);
  });
});

describe("mapEventToBinaryProps", () => {
  it("maps yes and no prices from a binary market", () => {
    const event = createMockEvent({
      id: "1",
      slug: "binary",
      title: "Binary Question",
      markets: [
        {
          id: "m1",
          question: "Will X happen?",
          volume: 100,
          outcomes: [
            { id: "yes", name: "Yes", price: 0.28 },
            { id: "no", name: "No", price: 0.72 },
          ],
        },
      ],
    });

    const props = mapEventToBinaryProps(event);

    expect(props.yesPrice).toBe(0.28);
    expect(props.noPrice).toBe(0.72);
    expect(props.slug).toBe("binary");
  });
});

describe("mapEventToCardProps", () => {
  it("routes binary events to binary props", () => {
    const event = createMockEvent({
      id: "1",
      slug: "binary",
      title: "Binary",
      markets: [
        {
          id: "m1",
          question: "Q?",
          volume: 1,
          outcomes: [
            { id: "yes", name: "Yes", price: 0.5 },
            { id: "no", name: "No", price: 0.5 },
          ],
        },
      ],
    });

    const result = mapEventToCardProps(event);

    expect(result.variant).toBe("binary");
    expect(resolveCardVariant(event)).toBe("binary");
  });

  it("routes multi-outcome events to multi props", () => {
    const event = createMockEvent({
      id: "2",
      slug: "multi",
      title: "Multi",
      markets: [
        {
          id: "m1",
          question: "A",
          volume: 1,
          outcomes: [
            { id: "a", name: "A", price: 0.3 },
            { id: "b", name: "B", price: 0.3 },
            { id: "c", name: "C", price: 0.4 },
          ],
        },
      ],
    });

    const result = mapEventToCardProps(event);

    expect(result.variant).toBe("multi-outcome");
    if (result.variant === "multi-outcome") {
      expect(result.props.outcomes.length).toBeLessThanOrEqual(2);
    }
  });
});
