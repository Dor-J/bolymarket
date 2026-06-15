'use client';

import { Heart } from 'lucide-react';
import { useAtom, useAtomValue } from 'jotai';
import {
  bookmarksAtom,
  isBookmarked,
  toggleBookmarkAtom,
} from '@/lib/atoms/bookmarks';
import { cn } from '@/lib/cn';

export interface BookmarkButtonProps {
  slug?: string;
  className?: string;
}

/**
 * Toggles bookmark state for an event slug (persisted to localStorage).
 */
export function BookmarkButton({ slug, className }: BookmarkButtonProps) {
  const bookmarks = useAtomValue(bookmarksAtom);
  const [, toggleBookmark] = useAtom(toggleBookmarkAtom);
  const active = slug ? isBookmarked(bookmarks, slug) : false;

  return (
    <button
      type="button"
      aria-label={active ? 'Remove bookmark' : 'Bookmark market'}
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-sm transition-colors',
        'hover:bg-black/5 hover:text-text dark:hover:bg-white/10',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        active ? 'text-brand' : 'text-[#aeb4bc]',
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (slug) {
          toggleBookmark(slug);
        }
      }}
    >
      <Heart
        className="h-4 w-4"
        strokeWidth={1.75}
        fill={active ? 'currentColor' : 'none'}
        aria-hidden
      />
    </button>
  );
}
