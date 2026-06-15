import { Heart } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BookmarkButtonProps {
  className?: string;
}

/**
 * Non-functional bookmark affordance for market cards.
 */
export function BookmarkButton({ className }: BookmarkButtonProps) {
  return (
    <button
      type="button"
      aria-label="Bookmark market"
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-sm text-[#aeb4bc]',
        'transition-colors hover:bg-black/5 hover:text-text',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <Heart className="h-4 w-4" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
