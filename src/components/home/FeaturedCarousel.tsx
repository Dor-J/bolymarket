'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Event } from '@/types/polymarket';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { FeaturedEventPreview } from './FeaturedEventPreview';

export interface FeaturedCarouselProps {
  events: Event[];
  className?: string;
  /** `sidebar` — desktop column inside the home featured row; `standalone` — full-width mobile/default. */
  layout?: 'standalone' | 'sidebar';
}

/**
 * Featured markets hero carousel with Polymarket-style event previews.
 */
export function FeaturedCarousel({
  events,
  className,
  layout = 'standalone',
}: FeaturedCarouselProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = events.length;

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) {
        return;
      }

      const normalized = ((index % slideCount) + slideCount) % slideCount;
      setActiveIndex(normalized);
    },
    [slideCount],
  );

  const resolvedIndex =
    slideCount === 0 ? 0 : Math.min(activeIndex, slideCount - 1);
  const activeEvent = events[resolvedIndex];
  const activeEventId = activeEvent?.id ?? '';
  const hasMountedSlide = useRef(false);
  const previousEventId = useRef(activeEventId);
  const shouldAnimateSlide =
    hasMountedSlide.current &&
    previousEventId.current !== activeEventId &&
    !reducedMotion;

  useEffect(() => {
    if (!activeEventId) {
      return;
    }

    hasMountedSlide.current = true;
    previousEventId.current = activeEventId;
  }, [activeEventId]);

  if (events.length === 0 || !activeEvent) {
    return null;
  }

  const isSidebar = layout === 'sidebar';

  return (
    <section
      aria-label="Featured markets"
      className={cn(
        isSidebar
          ? 'group/carousel flex w-full flex-col gap-4'
          : 'mb-6',
        className,
      )}
    >
      <div className={cn('flex items-center justify-between gap-3', !isSidebar && 'mb-3')}>
        <h2 className="text-xl leading-6 font-semibold text-text">
          Featured markets
        </h2>

        {slideCount > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous featured market"
              onClick={() => {
                goTo(activeIndex - 1);
              }}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full',
                'bg-surface-2 text-text-secondary hover:bg-neutral-100',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              )}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next featured market"
              onClick={() => {
                goTo(activeIndex + 1);
              }}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-full',
                'bg-surface-2 text-text-secondary hover:bg-neutral-100',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              )}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      <div className="group/carousel relative">
        <div className="min-h-[min(480px,60vh)] lg:max-h-[500px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeEvent.id}
              initial={shouldAnimateSlide ? { opacity: 0, x: 12 } : false}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, x: -12 }}
              transition={{
                duration: reducedMotion ? 0 : 0.2,
              }}
              className="h-full"
            >
              <FeaturedEventPreview
                event={activeEvent}
                isActive
                className="h-full min-h-[min(480px,60vh)]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {slideCount > 1 ? (
          <div className="mt-3 flex items-center justify-center gap-2">
            {events.map((event, index) => (
              <button
                key={event.id}
                type="button"
                aria-label={`Show featured market ${index + 1}`}
                aria-current={index === resolvedIndex ? 'true' : undefined}
                onClick={() => {
                  goTo(index);
                }}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === activeIndex
                    ? 'w-6 bg-brand'
                    : 'w-2 bg-neutral-200 hover:bg-neutral-300',
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
