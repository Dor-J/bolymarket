import { CardSkeleton } from '@/components/cards/CardSkeleton';

const SKELETON_COUNT = 10;

const gridClasses =
  'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 min-[1300px]:grid-cols-4';

/**
 * Grid of card skeletons matching the live events grid layout.
 */
export function EventsGridSkeleton() {
  return (
    <div className={gridClasses} aria-busy="true" aria-label="Loading markets">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <CardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}
