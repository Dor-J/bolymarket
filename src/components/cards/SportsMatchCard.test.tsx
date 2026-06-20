import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { createMockEvent } from "@/test/fixtures/events";
import { SportsMatchCard } from "./SportsMatchCard";

describe("SportsMatchCard", () => {
  it("renders multi-market World Cup matchups as team rows and moneyline buttons", () => {
    const event = createMockEvent({
      id: "sports-match",
      slug: "fifwc-bra-hai-2026-06-19",
      title: "Brazil vs. Haiti",
      category: "World Cup",
      tags: ["sports", "soccer", "world cup"],
      volume: 3_000_000,
      markets: [
        {
          id: "brazil",
          question: "Brazil to win?",
          slug: "fifwc-bra-hai-2026-06-19-bra",
          image: "https://example.com/brazil.png",
          volume: 1_000_000,
          outcomes: [
            { id: "brazil-yes", name: "Yes", price: 0.89 },
            { id: "brazil-no", name: "No", price: 0.11 },
          ],
        },
        {
          id: "draw",
          question: "Brazil vs. Haiti end in a draw?",
          slug: "fifwc-bra-hai-2026-06-19-draw",
          volume: 1_000_000,
          outcomes: [
            { id: "draw-yes", name: "Yes", price: 0.08 },
            { id: "draw-no", name: "No", price: 0.92 },
          ],
        },
        {
          id: "haiti",
          question: "Haiti to win?",
          slug: "fifwc-bra-hai-2026-06-19-hai",
          image: "https://example.com/haiti.png",
          volume: 1_000_000,
          outcomes: [
            { id: "haiti-yes", name: "Yes", price: 0.04 },
            { id: "haiti-no", name: "No", price: 0.96 },
          ],
        },
      ],
    });

    renderWithProviders(<SportsMatchCard event={event} />);

    expect(screen.getAllByText("Brazil")).toHaveLength(2);
    expect(screen.getAllByText("Haiti")).toHaveLength(2);
    expect(screen.getByText("89%")).toBeInTheDocument();
    expect(screen.getByText("4%")).toBeInTheDocument();
    expect(screen.getByText("DRAW")).toBeInTheDocument();
    expect(screen.getByText("$3.0M Vol.")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "DRAW" })).toHaveAttribute(
      "href",
      "/event/fifwc-bra-hai-2026-06-19?marketSlug=fifwc-bra-hai-2026-06-19-draw&outcomeIndex=0",
    );
  });
});
