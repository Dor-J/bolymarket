'use client';

import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORY_NAV_ITEMS } from '@/lib/constants/categories';
import { cn } from '@/lib/cn';

/**
 * Sticky category navigation with route-based active state.
 */
export const CategoryNav = memo(function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Categories"
      className="sticky top-16 z-40 border-b border-border bg-surface"
    >
      <div className="mx-auto max-w-[1350px] px-6">
        <div className="scrollbar-hide flex h-12 items-center gap-1 overflow-x-auto">
          {CATEGORY_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <div key={item.key} className="flex shrink-0 items-center gap-1">
                <Link
                  href={item.href}
                  className={cn(
                    'relative inline-flex h-8 shrink-0 items-center gap-1 rounded-md px-2.5',
                    'text-sm leading-5 font-semibold transition-colors',
                    'hover:bg-black/5 dark:hover:bg-white/10',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    isActive ? 'text-text' : 'text-[#77808d]',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon ? (
                    <span aria-hidden className="text-xs">
                      {item.icon}
                    </span>
                  ) : null}
                  {item.label}
                  {isActive ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-1 -bottom-[13px] h-0.5 rounded-full bg-brand"
                    />
                  ) : null}
                </Link>

                {item.showDividerAfter ? (
                  <span
                    aria-hidden
                    className="mx-1 text-sm text-[#77808d] select-none"
                  >
                    |
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
});
