import type { Event } from '@/types/polymarket';
import { FeaturedCarousel } from './FeaturedCarousel';
import { HomeFeaturedSidebar } from './HomeFeaturedSidebar';
import { cn } from '@/lib/cn';

export interface HomeFeaturedSectionProps {
  events: Event[];
  className?: string;
}

/**
 * Home featured row with carousel (left) and hot-topics sidebar (right) on large screens.
 */
export function HomeFeaturedSection({ events, className }: HomeFeaturedSectionProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <>
      <div className={cn('mb-6 lg:hidden', className)}>
        <FeaturedCarousel events={events} layout="standalone" />
      </div>

      <div
        className={cn(
          'hidden w-full flex-col px-4 lg:mx-auto lg:mb-3 lg:flex lg:max-w-[1350px] lg:px-6',
          className,
        )}
      >
        <div className="flex w-full flex-row items-stretch gap-8 pt-0 lg:pt-6">
          <FeaturedCarousel events={events} layout="sidebar" />
          <HomeFeaturedSidebar />
        </div>
      </div>
    </>
  );
}
