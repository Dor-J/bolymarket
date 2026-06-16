'use client';

import { memo } from 'react';
import { CATEGORY_NAV_ITEMS } from '@/lib/constants/categories';
import { CategoryNavLink } from './CategoryNavLink';
import { CategoryNavMore } from './CategoryNavMore';

/**
 * Sticky category navigation — pixel-aligned with polymarket.com.
 */
export const CategoryNav = memo(function CategoryNav() {
  return (
    <nav
      aria-label="Categories"
      className="sticky top-[var(--header-height)] z-40 overflow-visible border-b border-border bg-surface"
    >
      <div className="mx-auto max-w-[1350px] px-4 md:px-6">
        <div className="flex h-12 items-center">
          <div className="scrollbar-hide flex min-w-0 flex-1 items-center overflow-x-auto">
            {CATEGORY_NAV_ITEMS.map((item) => (
              <div key={item.key} className="flex shrink-0 items-center">
                <CategoryNavLink item={item} />

                {item.showDividerAfter ? (
                  <>
                    <span
                      aria-hidden
                      className="mx-1 text-sm text-[#77808d] select-none lg:hidden"
                    >
                      |
                    </span>
                    <span
                      aria-hidden
                      className="mx-2 hidden h-3.5 w-0.5 shrink-0 rounded-full bg-[#e6e8ea] lg:block"
                    />
                  </>
                ) : null}
              </div>
            ))}
          </div>

          <CategoryNavMore />
        </div>
      </div>
    </nav>
  );
});
