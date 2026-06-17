'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Event } from '@/types/polymarket';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { FeaturedCarouselControls } from './FeaturedCarouselControls';
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
          <FeaturedCarouselControls
            events={events}
            activeIndex={resolvedIndex}
            onSelect={goTo}
            onPrevious={() => {
              goTo(activeIndex - 1);
            }}
            onNext={() => {
              goTo(activeIndex + 1);
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
