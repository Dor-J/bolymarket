import { CardSkeleton } from "@/components/cards/CardSkeleton";
import { EVENTS_GRID_CLASSES } from "@/lib/constants/eventsGrid";
import { cn } from "@/lib/cn";

const SKELETON_COUNT = 10;

export interface EventsGridSkeletonProps {
  heading?: string;
  showFeatured?: boolean;
  hideHeading?: boolean;
  gridClassName?: string;
  gridWrapperClassName?: string;
}

/**
 * Grid of card skeletons matching the live events grid layout.
 */
export function EventsGridSkeleton({
  heading = 'All markets',
  showFeatured = false,
  hideHeading = false,
  gridClassName = EVENTS_GRID_CLASSES,
  gridWrapperClassName,
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

      {!hideHeading ? (
        <h2 className="mb-4 text-xl leading-6 font-semibold text-text">{heading}</h2>
      ) : null}

      <div
        className={cn(
          'relative flex h-auto w-full shrink-0 flex-col gap-3 pt-px pb-10',
          gridWrapperClassName,
        )}
      >
        <div className={gridClassName}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <CardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
