"use client";

import Link from "next/link";
import { memo } from "react";
import { MarketThumbnail } from "@/components/market/MarketThumbnail";
import { PriceDisplay } from "@/components/market/PriceDisplay";
import { LiveBadge } from "@/components/markets/LiveBadge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { formatVolume } from "@/lib/format/volume";
import { getYesNoFromMarket } from "@/lib/cards/mapEventToCardProps";
import { getWorldCupTeamFlagUrl } from "@/lib/sports/worldCupFlags";
import type { Event, Market } from "@/types/polymarket";
import { cn } from "@/lib/cn";

export interface SportsMatchCardProps {
  event: Event;
  isLive?: boolean;
}

const teamColors = ["#144b8f", "#11733f", "#e04020"];

const cardShellClasses = cn(
  "group/card relative flex min-h-[180px] h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card pt-3",
  "shadow-md shadow-black/4 transition hover:-translate-y-px hover:shadow-md hover:shadow-black/8",
  "focus-within:ring-2 focus-within:ring-ring focus-within:outline-none",
);

function getShortLabel(label: string): string {
  if (/^draw$/i.test(label)) {
    return "DRAW";
  }

  return label.split(/\s+/)[0] ?? label;
}

function isDrawLabel(label: string): boolean {
  return /^draw$/i.test(label);
}

interface SportsMatchOutcome {
  market: Market;
  outcomeId: string;
  name: string;
  price: number;
  image?: string;
  href: string;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getMatchTeams(title: string): [string, string] | null {
  const parts = title
    .split(/\s+(?:vs\.?|v)\s+|\s+[\u2013-]\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  return [parts[0]!, parts[1]!];
}

function getMarketHaystack(market: Market): string {
  return normalizeText(`${market.question} ${market.slug ?? ""}`);
}

function getMarketHref(
  eventSlug: string,
  market: Market,
  outcomeIndex: number,
): string {
  const params = new URLSearchParams();

  if (market.slug) {
    params.set("marketSlug", market.slug);
  }

  params.set("outcomeIndex", String(outcomeIndex));

  return `/event/${eventSlug}?${params.toString()}`;
}

function findBinaryMarket(
  markets: Market[],
  matcher: (market: Market) => boolean,
): Market | undefined {
  return markets.find(
    (market) => market.outcomes.length === 2 && matcher(market),
  );
}

function getBinaryOutcome(
  eventSlug: string,
  market: Market,
  name: string,
  image?: string,
): SportsMatchOutcome {
  const { yesPrice, yesOutcomeId } = getYesNoFromMarket(market);

  return {
    market,
    outcomeId: yesOutcomeId,
    name,
    price: yesPrice,
    image,
    href: getMarketHref(eventSlug, market, 0),
  };
}

function getSportsMatchOutcomes(event: Event): SportsMatchOutcome[] {
  const teams = getMatchTeams(event.title);

  if (teams) {
    const [leftTeam, rightTeam] = teams;
    const leftNeedle = normalizeText(leftTeam);
    const rightNeedle = normalizeText(rightTeam);
    const drawMarket = findBinaryMarket(event.markets, (market) =>
      /\bdraw\b/.test(getMarketHaystack(market)),
    );
    const leftMarket = findBinaryMarket(event.markets, (market) => {
      const haystack = getMarketHaystack(market);
      return !/\bdraw\b/.test(haystack) && haystack.includes(leftNeedle);
    });
    const rightMarket = findBinaryMarket(event.markets, (market) => {
      const haystack = getMarketHaystack(market);
      return !/\bdraw\b/.test(haystack) && haystack.includes(rightNeedle);
    });

    if (leftMarket && rightMarket) {
      const outcomes = [
        getBinaryOutcome(
          event.slug,
          leftMarket,
          leftTeam,
          leftMarket.image ?? getWorldCupTeamFlagUrl(leftTeam),
        ),
        drawMarket
          ? getBinaryOutcome(event.slug, drawMarket, "DRAW", drawMarket.image)
          : undefined,
        getBinaryOutcome(
          event.slug,
          rightMarket,
          rightTeam,
          rightMarket.image ?? getWorldCupTeamFlagUrl(rightTeam),
        ),
      ].filter((outcome): outcome is SportsMatchOutcome => Boolean(outcome));

      if (outcomes.length >= 2) {
        return outcomes;
      }
    }
  }

  const market = event.markets[0];
  const outcomes = market?.outcomes.slice(0, 3) ?? [];

  if (!market || outcomes.length < 2) {
    return [];
  }

  return outcomes.map((outcome, index) => ({
    market,
    outcomeId: outcome.id,
    name: outcome.name,
    price: outcome.price,
    image: event.image,
    href: getMarketHref(event.slug, market, index),
  }));
}

/**
 * Sports / esports match card with team rows and outcome buttons.
 */
export const SportsMatchCard = memo(function SportsMatchCard({
  event,
  isLive,
}: SportsMatchCardProps) {
  const outcomes = getSportsMatchOutcomes(event);
  const href = `/event/${event.slug}`;

  if (outcomes.length < 2) {
    return null;
  }

  const teamRows = outcomes
    .filter((outcome) => !isDrawLabel(outcome.name))
    .slice(0, 2);
  const displayedRows = teamRows.length >= 2 ? teamRows : outcomes.slice(0, 2);

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
          {displayedRows.map((outcome, index) => (
            <div
              key={`${outcome.market.id}-${outcome.outcomeId}`}
              className="group/row flex h-9 w-full items-center justify-between"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <MarketThumbnail
                  title={outcome.name}
                  image={outcome.image ?? event.image}
                  size={28}
                  className="rounded-sm object-contain"
                />
                {isLive ? (
                  <>
                    <span className="w-4 text-center text-sm font-medium text-text-primary">
                      {index}
                    </span>
                    <span className="h-3 w-0.5 rounded-full bg-border" />
                  </>
                ) : null}
                <p className="truncate text-sm leading-5 font-medium text-text decoration-2 group-hover/row:underline">
                  {outcome.name}
                </p>
              </div>
              <PriceDisplay
                marketId={outcome.market.id}
                outcomeId={outcome.outcomeId}
                initialPrice={outcome.price}
                className="shrink-0 text-xl leading-6 font-semibold text-text-primary"
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
                  key={`${outcome.market.id}-${outcome.outcomeId}`}
                  href={outcome.href}
                  className={cn(
                    "group relative flex h-10 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-sm px-2",
                    "text-sm font-semibold transition active:scale-[97%]",
                    isDrawLabel(outcome.name) &&
                      "max-w-[72px] shrink-0 border border-border hover:bg-surface-2",
                  )}
                >
                  <span
                    className="relative z-1 truncate transition group-hover:text-white"
                    style={{
                      color: isDrawLabel(outcome.name) ? undefined : color,
                    }}
                  >
                    {getShortLabel(outcome.name)}
                  </span>
                  {!isDrawLabel(outcome.name) ? (
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
              <p className="truncate">{formatVolume(event.volume)}</p>
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
