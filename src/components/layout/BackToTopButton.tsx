'use client';

import { MOBILE_BOTTOM_NAV_HEIGHT_PX } from '@/lib/constants/footer';
import { BackToTopArrowIcon } from '@/components/icons/FooterIcons';
import { cn } from '@/lib/cn';

/**
 * Mobile-only floating Back to top pill above the bottom navigation bar.
 */
export function BackToTopButton() {
  function handleClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'fixed right-4 z-50 md:hidden',
        'inline-flex items-center gap-1.5 rounded-full border border-border',
        'bg-surface px-3 py-1.5 text-xs font-medium text-text shadow-sm',
        'transition-colors hover:bg-surface-2',
      )}
      style={{ bottom: MOBILE_BOTTOM_NAV_HEIGHT_PX + 12 }}
      aria-label="Back to top"
    >
      Back to top
      <BackToTopArrowIcon />
    </button>
  );
}
