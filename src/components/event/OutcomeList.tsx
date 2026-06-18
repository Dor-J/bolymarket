"use client";

import type { Event } from "@/types/polymarket";
import { flattenOutcomes } from "@/lib/event/flattenOutcomes";
import { OutcomeRow } from "./OutcomeRow";

export interface OutcomeListProps {
  event: Event;
}

/**
 * Full outcome list for the event detail page.
 */
export function OutcomeList({ event }: OutcomeListProps) {
  const rows = flattenOutcomes(event);

  if (rows.length === 0) {
    return null;
  }

  return (
    <section aria-label="Outcomes">
      {rows.map((row) => (
        <OutcomeRow
          key={`${row.marketId}-${row.outcomeId}`}
          marketId={row.marketId}
          outcomeId={row.outcomeId}
          name={row.name}
          volume={row.volume}
          yesPrice={row.yesPrice}
          noPrice={row.noPrice}
          image={row.image ?? event.image}
        />
      ))}
    </section>
  );
}
