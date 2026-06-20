import type { Event } from '@/types/polymarket';
import { cn } from '@/lib/cn';

function ChevronLeftSmallIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12px"
      height="12px"
      viewBox="0 0 12 12"
      className={className}
      aria-hidden
    >
      <polyline
        points="7.75 1.75 3.5 6 7.75 10.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronRightSmallIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12px"
      height="12px"
      viewBox="0 0 12 12"
      className={className}
      aria-hidden
    >
      <polyline
        points="4.25 10.25 8.5 6 4.25 1.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export interface FeaturedCarouselControlsProps {
  events: Event[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

function wrapIndex(index: number, count: number): number {
  return ((index % count) + count) % count;
}

/**
 * Bottom carousel controls — pagination dots (left) and prev/next pills (right).
 */
export function FeaturedCarouselControls({
  events,
  activeIndex,
  onSelect,
  onPrevious,
  onNext,
  className,
}: FeaturedCarouselControlsProps) {
  const slideCount = events.length;
  const previousEvent = events[wrapIndex(activeIndex - 1, slideCount)];
  const nextEvent = events[wrapIndex(activeIndex + 1, slideCount)];

  return (
    <div
      className={cn(
        'mt-3 flex items-center justify-between pl-5 pr-0 md:h-10',
        className,
      )}
    >
      <div className="-mx-1.5 flex items-center">
        {events.map((event, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={event.id}
              type="button"
              aria-label={`Show featured market ${index + 1}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => {
                onSelect(index);
              }}
              className="flex cursor-pointer items-center justify-center px-[3px] py-3"
            >
              <div
                className={cn(
                  'relative overflow-hidden rounded-full bg-neutral-200 transition-all duration-300',
                  'hover:bg-neutral-300',
                  isActive ? 'h-1.5 w-8 bg-neutral-300' : 'size-1.5',
                )}
              >
                {isActive ? (
                  <div className="absolute top-0 left-0 h-full w-full origin-left rounded-full bg-text" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          aria-label={`Previous featured market: ${previousEvent.title}`}
          onClick={onPrevious}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-full',
            'bg-surface-2 text-text-secondary hover:bg-surface-2/80',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          )}
        >
          <ChevronLeftSmallIcon className="text-text-secondary" />
        </button>
        <button
          type="button"
          aria-label={`Next featured market: ${nextEvent.title}`}
          onClick={onNext}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-full',
            'bg-surface-2 text-text-secondary hover:bg-surface-2/80',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          )}
        >
          <ChevronRightSmallIcon className="text-text-secondary" />
        </button>
      </div>

      <div className="hidden items-center lg:flex">
        <button
          type="button"
          aria-label={`Previous featured market: ${previousEvent.title}`}
          onClick={onPrevious}
          className="group flex cursor-pointer items-center py-2 pr-1.5 pl-2 outline-none"
        >
          <div
            className={cn(
              'relative flex h-10 items-center justify-center overflow-hidden rounded-full',
              'border border-border bg-surface-2',
              'transition-transform group-active:scale-[0.98]',
              'group-hover:bg-surface-2/80',
              'group-focus-visible:outline',
              'group-focus-visible:outline-offset-2 group-focus-visible:outline-text',
            )}
          >
            <div className="absolute top-1/2 left-[15px] size-3 -translate-y-1/2">
              <ChevronLeftSmallIcon className="shrink-0 text-text-secondary" />
            </div>
            <span className="flex items-center gap-2 py-2 pr-4 pl-8 text-sm font-medium whitespace-nowrap text-text-secondary">
              {previousEvent.title}
            </span>
          </div>
        </button>

        <button
          type="button"
          aria-label={`Next featured market: ${nextEvent.title}`}
          onClick={onNext}
          className="group flex cursor-pointer items-center py-2 pr-2 pl-1.5 outline-none"
        >
          <div
            className={cn(
              'relative flex h-10 items-center justify-center overflow-hidden rounded-full',
              'border border-border bg-surface-2',
              'transition-transform group-active:scale-[0.98]',
              'group-hover:bg-surface-2/80',
              'group-focus-visible:outline',
              'group-focus-visible:outline-offset-2 group-focus-visible:outline-text',
            )}
          >
            <div className="absolute top-1/2 right-[15px] size-3 -translate-y-1/2">
              <ChevronRightSmallIcon className="shrink-0 text-text-secondary" />
            </div>
            <span className="flex items-center gap-2 py-2 pr-8 pl-4 text-sm font-medium whitespace-nowrap text-text-secondary">
              {nextEvent.title}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
