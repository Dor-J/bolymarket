'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import { getOutcomeColor } from '@/lib/chart/colors';
import type { ChartOutcome } from '@/lib/chart/types';
import { getChartOutcomes } from '@/lib/event/flattenOutcomes';
import { formatBreadcrumb } from '@/lib/event/formatBreadcrumb';
import { formatVolume } from '@/lib/format/volume';
import type { Event } from '@/types/polymarket';
import { cn } from '@/lib/cn';
import { FeaturedActivityRail } from './FeaturedActivityRail';
import { FeaturedBidRail } from './FeaturedBidRail';
import { FeaturedCompactChart } from './FeaturedCompactChart';
import { FeaturedOutcomeRows } from './FeaturedOutcomeRows';

export interface FeaturedEventPreviewProps {
  event: Event;
  isActive: boolean;
  className?: string;
}

/**
 * Polymarket-style featured event preview with outcomes, chart, and activity.
 */
export function FeaturedEventPreview({
  event,
  isActive,
  className,
}: FeaturedEventPreviewProps) {
  const breadcrumb = formatBreadcrumb(event);

  const chartOutcomes = useMemo<ChartOutcome[]>(() => {
    return getChartOutcomes(event, 4).map((row, index) => ({
      id: row.outcomeId,
      marketId: row.marketId,
      name: row.name,
      price: row.yesPrice,
      color: getOutcomeColor(index),
    }));
  }, [event]);

  return (
    <article
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-[18px]',
        'border border-blue-600/10 bg-card shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]',
        'shadow-blue-500/7 dark:shadow-none',
        className,
      )}
    >
      <Link
        href={`/event/${event.slug}`}
        className="absolute inset-0 z-0"
        aria-hidden
        tabIndex={-1}
      />

      <div className="relative z-10 flex h-full flex-col gap-4 p-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <MarketThumbnail
              title={event.title}
              image={event.image}
              size={56}
              className="hidden shrink-0 rounded-md md:block"
            />
            <div className="flex min-w-0 flex-1 flex-col-reverse items-start gap-0.5">
              <h3 className="w-full min-w-0 text-2xl font-semibold text-pretty text-text md:line-clamp-1">
                <Link
                  href={`/event/${event.slug}`}
                  className="relative hover:underline"
                >
                  {event.title}
                </Link>
              </h3>
              {breadcrumb ? (
                <p className="text-sm text-text-secondary">{breadcrumb}</p>
              ) : null}
            </div>
          </div>

          <div className="relative z-20 flex shrink-0 items-center gap-1">
            <BookmarkButton slug={event.slug} />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col-reverse gap-4 overflow-hidden lg:flex-row lg:items-stretch lg:gap-6">
          <div className="relative flex min-h-0 flex-col gap-4 overflow-hidden lg:w-[40%] lg:justify-between">
            <FeaturedOutcomeRows event={event} />
            <FeaturedActivityRail event={event} />
            <p className="text-sm text-text-secondary lg:hidden">
              {formatVolume(event.volume)}
            </p>
          </div>

          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col justify-center overflow-hidden">
            <FeaturedBidRail
              event={event}
              outcomes={chartOutcomes}
              className="pointer-events-none absolute top-1/2 left-1 z-20 -translate-y-1/2"
            />
            {isActive ? (
              <FeaturedCompactChart
                outcomes={chartOutcomes}
                eventId={event.id}
              />
            ) : (
              <div className="h-[200px] w-full rounded-lg bg-surface-2/60 lg:h-[240px]" />
            )}
            <p className="mt-2 hidden text-sm text-text-secondary lg:block">
              {formatVolume(event.volume)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
