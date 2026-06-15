import { CardSkeleton } from "@/components/cards/CardSkeleton";
import { EVENTS_GRID_CLASSES } from "@/lib/constants/eventsGrid";

const SKELETON_COUNT = 10;

/**
 * Grid of card skeletons matching the live events grid layout.
 */
export function EventsGridSkeleton() {
  return (
    <div
      className={EVENTS_GRID_CLASSES}
      aria-busy="true"
      aria-label="Loading markets"
    >
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <CardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}
