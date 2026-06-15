"use client";

import { memo, useMemo } from "react";
import type { Event } from "@/types/polymarket";
import { mapEventToCardProps } from "@/lib/cards/mapEventToCardProps";
import { BinaryCard } from "./BinaryCard";
import { MultiOutcomeCard } from "./MultiOutcomeCard";

export interface EventCardProps {
  event: Event;
}

/**
 * Routes an event to the correct memoized card variant.
 */
export const EventCard = memo(function EventCard({ event }: EventCardProps) {
  const mapped = useMemo(() => mapEventToCardProps(event), [event]);

  if (mapped.variant === "binary") {
    return <BinaryCard {...mapped.props} />;
  }

  return <MultiOutcomeCard {...mapped.props} />;
});
