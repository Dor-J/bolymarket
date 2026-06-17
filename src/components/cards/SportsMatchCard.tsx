"use client";

import Link from "next/link";
import { memo } from "react";
import { MarketThumbnail } from "@/components/market/MarketThumbnail";
import { PriceDisplay } from "@/components/market/PriceDisplay";
import { LiveBadge } from "@/components/markets/LiveBadge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { formatVolume } from "@/lib/format/volume";
import type { Event } from "@/types/polymarket";
import { cn } from "@/lib/cn";

export interface SportsMatchCardProps {
  event: Event;
  isLive?: boolean;
}

const teamColors = ["#144b8f", "#11733f", "#e04020"];

const cardShellClasses = cn(
  "group/card relative flex min-h-[180px] h-full flex-col justify-between overflow-hidden rounded-xl border border-neutral-100 bg-card pt-3",
  "shadow-md shadow-black/4 transition hover:-translate-y-px hover:shadow-md hover:shadow-black/8",
  "focus-within:ring-2 focus-within:ring-ring focus-within:outline-none",
);

function getShortLabel(label: string): string {
  if (/^draw$/i.test(label)) {
    return "DRAW";
  }

  return label.split(/\s+/)[0] ?? label;
}

/**
 * Sports / esports match card with team rows and outcome buttons.
 */
export const SportsMatchCard = memo(function SportsMatchCard({
  event,
  isLive,
}: SportsMatchCardProps) {
  const market = event.markets[0];
  const outcomes = market?.outcomes.slice(0, 3) ?? [];
  const href = `/event/${event.slug}`;

  if (!market || outcomes.length < 2) {
    return null;
  }

  return (
    <article className={cardShellClasses}>
      <Link
        href={href}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={event.title}
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between">
        <Link
          href={href}
          className="pointer-events-auto flex w-full cursor-pointer flex-col items-center gap-1 px-3"
        >
          {outcomes.slice(0, 2).map((outcome, index) => (
            <div
              key={outcome.id}
              className="group/row flex h-9 w-full items-center justify-between"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <MarketThumbnail
                  title={outcome.name}
                  image={event.image}
                  size={28}
                  className="rounded-sm object-contain"
                />
                {isLive ? (
                  <>
                    <span className="w-4 text-center text-sm font-medium text-neutral-950">
                      {index}
                    </span>
                    <span className="h-3 w-0.5 rounded-full bg-neutral-100" />
                  </>
                ) : null}
                <p className="truncate text-sm leading-5 font-medium text-text decoration-2 group-hover/row:underline">
                  {outcome.name}
                </p>
              </div>
              <PriceDisplay
                marketId={market.id}
                outcomeId={outcome.id}
                initialPrice={outcome.price}
                className="shrink-0 text-xl leading-6 font-semibold text-neutral-950"
              />
            </div>
          ))}
        </Link>

        <div className="flex flex-col justify-end gap-1.5 px-3 pb-2">
          <div className="pointer-events-auto flex h-fit items-end justify-between gap-2">
            {outcomes.map((outcome, index) => {
              const color = teamColors[index % teamColors.length];

              return (
                <Link
                  key={outcome.id}
                  href={`${href}?outcomeIndex=${index}`}
                  className={cn(
                    "group relative flex h-10 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-sm px-2",
                    "text-sm font-semibold transition active:scale-[97%]",
                    /^draw$/i.test(outcome.name) &&
                      "max-w-[72px] shrink-0 border border-border hover:bg-neutral-25",
                  )}
                >
                  <span
                    className="relative z-1 truncate transition group-hover:text-white"
                    style={{
                      color: /^draw$/i.test(outcome.name) ? undefined : color,
                    }}
                  >
                    {getShortLabel(outcome.name)}
                  </span>
                  {!/^draw$/i.test(outcome.name) ? (
                    <span
                      className="absolute inset-0 rounded-sm opacity-10 transition group-hover:opacity-100"
                      style={{ backgroundColor: color }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="pointer-events-auto flex items-center justify-between text-[13px] leading-4 font-w490 text-neutral-500">
            <div className="flex min-w-0 items-center gap-1">
              {isLive ? <LiveBadge /> : null}
              {isLive ? <span className="opacity-50">·</span> : null}
              <p className="truncate">{formatVolume(market.volume || event.volume)}</p>
              {event.category ? (
                <>
                  <span className="opacity-50">·</span>
                  <span className="truncate">{event.category}</span>
                </>
              ) : null}
            </div>
            <BookmarkButton slug={event.slug} />
          </div>
        </div>
      </div>
    </article>
  );
});
