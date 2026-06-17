'use client';

import type { Event } from '@/types/polymarket';
import { OutcomeList } from './OutcomeList';

export interface EventSportsDetailProps {
  event: Event;
}

/**
 * Sports match event detail with odds-focused outcome list.
 */
export function EventSportsDetail({ event }: EventSportsDetailProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold tracking-wide text-neutral-500 uppercase">
        <span>Moneyline</span>
        <span>Spread</span>
        <span>Total</span>
      </div>
      <OutcomeList event={event} />
    </div>
  );
}
