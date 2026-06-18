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
    <div
      className={cn(
        'mb-6 w-full lg:mx-auto lg:mb-3 lg:max-w-[1350px] lg:px-6',
        className,
      )}
    >
      <div className="flex w-full flex-col items-stretch gap-8 lg:flex-row lg:pt-6">
        <FeaturedCarousel events={events} layout="sidebar" />
        <HomeFeaturedSidebar />
      </div>
    </div>
  );
}
