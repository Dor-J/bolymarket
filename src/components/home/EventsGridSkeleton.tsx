import { CardSkeleton } from "@/components/cards/CardSkeleton";
import { EVENTS_GRID_CLASSES } from "@/lib/constants/eventsGrid";

const SKELETON_COUNT = 10;

export interface EventsGridSkeletonProps {
  heading?: string;
  showFeatured?: boolean;
}

/**
 * Grid of card skeletons matching the live events grid layout.
 */
export function EventsGridSkeleton({
  heading = 'All markets',
  showFeatured = false,
}: EventsGridSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading markets">
      {showFeatured ? (
        <div className="mb-6 hidden lg:block">
          <h2 className="mb-3 text-xl leading-6 font-semibold text-text">
            Featured markets
          </h2>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={`featured-skeleton-${index}`} className="w-[320px] shrink-0">
                <CardSkeleton />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <h2 className="mb-4 text-xl leading-6 font-semibold text-text">
        {heading}
      </h2>

      <div className={EVENTS_GRID_CLASSES}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <CardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
}
