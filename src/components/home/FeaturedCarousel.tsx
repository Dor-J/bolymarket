'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import type { Event } from '@/types/polymarket';
import { MarketThumbnail } from '@/components/market/MarketThumbnail';
import { PriceDisplay } from '@/components/market/PriceDisplay';
import { formatVolume } from '@/lib/format/volume';
import { mapEventToCardProps } from '@/lib/cards/mapEventToCardProps';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

export interface FeaturedCarouselProps {
  events: Event[];
  className?: string;
}

/**
 * Horizontal featured markets strip matching Polymarket's hero carousel.
 */
export function FeaturedCarousel({ events, className }: FeaturedCarouselProps) {
  const reducedMotion = useReducedMotion();

  if (events.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Featured markets"
      className={cn('mb-6', className)}
    >
      <h2 className="mb-3 text-xl leading-6 font-semibold text-text">
        Featured markets
      </h2>

      <div className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
        {events.map((event, index) => {
          const mapped = mapEventToCardProps(event);

          if (mapped.variant !== 'binary') {
            return (
              <motion.div
                key={event.id}
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.25,
                  delay: reducedMotion ? 0 : index * 0.04,
                }}
                className="w-[min(320px,85vw)] shrink-0 snap-start"
              >
                <Link
                  href={`/event/${event.slug}`}
                  className={cn(
                    'group flex h-full flex-col rounded-card border border-border bg-card p-3',
                    'transition-all duration-200 hover:-translate-y-0.5 hover:border-[#caced3]',
                    'hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  )}
                >
                  <div className="flex items-start gap-2">
                    <MarketThumbnail title={event.title} image={event.image} />
                    <h3 className="line-clamp-2 min-w-0 flex-1 text-sm leading-5 font-semibold text-text">
                      {event.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-[13px] font-medium text-[#aeb4bc]">
                    {formatVolume(event.volume)}
                  </p>
                </Link>
              </motion.div>
            );
          }

          const props = mapped.props;

          return (
            <motion.div
              key={event.id}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.25,
                delay: reducedMotion ? 0 : index * 0.04,
              }}
              className="w-[min(320px,85vw)] shrink-0 snap-start"
            >
              <Link
                href={`/event/${event.slug}`}
                className={cn(
                  'group flex h-full flex-col rounded-card border border-border bg-card p-3',
                  'transition-all duration-200 hover:-translate-y-0.5 hover:border-[#caced3]',
                  'hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                )}
              >
                <div className="flex items-start gap-2">
                  <MarketThumbnail title={event.title} image={event.image} />
                  <h3 className="line-clamp-2 min-w-0 flex-1 text-sm leading-5 font-semibold text-text">
                    {event.title}
                  </h3>
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <PriceDisplay
                      marketId={props.marketId}
                      outcomeId={props.yesOutcomeId}
                      initialPrice={props.yesPrice}
                      className="text-2xl leading-7 font-semibold text-text"
                    />
                    <p className="text-xs font-semibold text-muted-foreground">
                      chance
                    </p>
                  </div>
                  <p className="text-[13px] font-medium text-[#aeb4bc]">
                    {formatVolume(event.volume)}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
