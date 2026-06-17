"use client";

import { memo, useMemo } from "react";
import type { Event } from "@/types/polymarket";
import { getCryptoAssetLabel, isLiveEvent } from "@/lib/markets/isLiveEvent";
import { mapEventToCardProps } from "@/lib/cards/mapEventToCardProps";
import { BinaryCard } from "./BinaryCard";
import { CryptoPriceTargetCard } from "./CryptoPriceTargetCard";
import { CryptoUpDownCard } from "./CryptoUpDownCard";
import { MultiOutcomeCard } from "./MultiOutcomeCard";

export interface EventCardProps {
  event: Event;
}

/**
 * Routes an event to the correct memoized card variant.
 */
export const EventCard = memo(function EventCard({ event }: EventCardProps) {
  const mapped = useMemo(() => mapEventToCardProps(event), [event]);
  const assetLabel = useMemo(() => getCryptoAssetLabel(event), [event]);
  const isLive = useMemo(() => isLiveEvent(event), [event]);

  if (mapped.variant === "crypto-up-down") {
    return (
      <CryptoUpDownCard
        {...mapped.props}
        assetLabel={assetLabel}
        isLive={isLive}
      />
    );
  }

  if (mapped.variant === "crypto-price-target") {
    return (
      <CryptoPriceTargetCard
        {...mapped.props}
        assetLabel={assetLabel}
        isLive={isLive}
      />
    );
  }

  if (mapped.variant === "binary") {
    return <BinaryCard {...mapped.props} />;
  }

  return <MultiOutcomeCard {...mapped.props} />;
});
