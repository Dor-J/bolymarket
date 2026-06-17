'use client';

import type { Event } from '@/types/polymarket';
import { formatVolume } from '@/lib/format/volume';
import { formatDate } from '@/lib/format/date';

export interface EventMarketContextProps {
  event: Event;
}

/**
 * Market context meta section for event detail pages.
 */
export function EventMarketContext({ event }: EventMarketContextProps) {
  return (
    <section className="space-y-2 border-t border-border pt-6">
      <h2 className="text-base leading-6 font-semibold text-text">Market Context</h2>
      <dl className="grid gap-2 text-sm text-neutral-500">
        <div className="flex justify-between gap-4">
          <dt>Volume</dt>
          <dd className="font-medium text-text">{formatVolume(event.volume)}</dd>
        </div>
        {event.endDate ? (
          <div className="flex justify-between gap-4">
            <dt>End date</dt>
            <dd className="font-medium text-text">{formatDate(event.endDate)}</dd>
          </div>
        ) : null}
        {event.category ? (
          <div className="flex justify-between gap-4">
            <dt>Category</dt>
            <dd className="font-medium text-text">{event.category}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
