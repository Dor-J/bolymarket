"use client";

import { memo } from "react";
import { useAtom } from "jotai";
import { CATEGORY_NAV_ITEMS } from "@/lib/constants/categories";
import { selectedCategoryAtom } from "@/lib/atoms/category";
import { cn } from "@/lib/cn";
import type { CategoryFilter } from "@/types/polymarket";

/**
 * Sticky category navigation — client-side filter via Jotai.
 */
export const CategoryNav = memo(function CategoryNav() {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);

  return (
    <nav
      aria-label="Categories"
      className="sticky top-16 z-40 border-b border-border bg-surface"
    >
      <div className="mx-auto max-w-[1350px] px-6">
        <div className="scrollbar-hide flex h-12 items-center gap-1 overflow-x-auto">
          {CATEGORY_NAV_ITEMS.map((item) => {
            const isActive = selectedCategory === item.key;

            return (
              <div key={item.key} className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory(item.key as CategoryFilter)
                  }
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center gap-1 rounded-md px-2.5",
                    "text-sm leading-5 font-semibold transition-colors",
                    "hover:bg-black/5 dark:hover:bg-white/10",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    isActive ? "text-text" : "text-[#77808d]",
                  )}
                >
                  {item.icon ? (
                    <span aria-hidden className="text-xs">
                      {item.icon}
                    </span>
                  ) : null}
                  {item.label}
                </button>

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
