'use client';

import type { Event } from '@/types/polymarket';
import { SportsMarketRow } from './SportsMarketRow';

export interface SportsLeagueSectionProps {
  label: string;
  events: Event[];
}

/**
 * Sectioned sports league group with compact rows.
 */
export function SportsLeagueSection({ label, events }: SportsLeagueSectionProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <h3 className="mb-2 text-xs leading-4 font-semibold tracking-wide text-neutral-500 uppercase">
        {label}
      </h3>
      <div>
        {events.map((event) => (
          <SportsMarketRow key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
