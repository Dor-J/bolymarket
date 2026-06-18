import { describe, expect, it } from "vitest";
import { createMockEvent } from "@/test/fixtures/events";
import { flattenOutcomes, getChartOutcomes } from "./flattenOutcomes";

describe("flattenOutcomes", () => {
  it("creates one row per outcome in a multi-outcome market", () => {
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

    const rows = flattenOutcomes(event);

    expect(rows).toHaveLength(3);
    expect(rows[0]?.name).toBe("France");
  });

  it("creates one row per market for binary bundles", () => {
    const event = createMockEvent({
      id: "2",
      slug: "bundle",
      title: "Bundle",
      markets: [
        {
          id: "m1",
          question: "Market A",
          volume: 50,
          outcomes: [
            { id: "yes-a", name: "Yes", price: 0.6 },
            { id: "no-a", name: "No", price: 0.4 },
          ],
        },
        {
          id: "m2",
          question: "Market B",
          volume: 75,
          outcomes: [
            { id: "yes-b", name: "Yes", price: 0.3 },
            { id: "no-b", name: "No", price: 0.7 },
          ],
        },
      ],
    });

    expect(flattenOutcomes(event)).toHaveLength(2);
  });

  it("uses ellipsis replacements for binary bundle row names", () => {
    const event = createMockEvent({
      id: "4",
      slug: "netanyahu-out-by",
      title: "Netanyahu out by...?",
      markets: [
        {
          id: "m1",
          question: "Netanyahu out by end of 2026?",
          volume: 50,
          outcomes: [
            { id: "yes-a", name: "Yes", price: 0.64 },
            { id: "no-a", name: "No", price: 0.36 },
          ],
        },
        {
          id: "m2",
          question: "Netanyahu out by June 30?",
          volume: 75,
          outcomes: [
            { id: "yes-b", name: "Yes", price: 0.01 },
            { id: "no-b", name: "No", price: 0.99 },
          ],
        },
      ],
    });

    expect(flattenOutcomes(event).map((row) => row.name)).toEqual([
      "end of 2026",
      "June 30",
    ]);
  });
});

describe("getChartOutcomes", () => {
  it("limits chart outcomes to six rows", () => {
    const event = createMockEvent({
      id: "3",
      slug: "many",
      title: "Many",
      markets: [
        {
          id: "m1",
          question: "Winner",
          volume: 100,
          outcomes: Array.from({ length: 8 }, (_, index) => ({
            id: `o-${index}`,
            name: `Outcome ${index}`,
            price: (8 - index) / 10,
          })),
        },
      ],
    });

    expect(getChartOutcomes(event)).toHaveLength(6);
  });
});
