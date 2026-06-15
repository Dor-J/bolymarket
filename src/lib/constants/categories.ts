import type { CategoryFilter } from "@/types/polymarket";

export interface CategoryNavItem {
  key: CategoryFilter;
  label: string;
  icon?: string;
  showDividerAfter?: boolean;
}

/** Category navigation links — assignment minimum + Polymarket-style divider. */
export const CATEGORY_NAV_ITEMS: CategoryNavItem[] = [
  { key: "trending", label: "Trending", icon: "📈", showDividerAfter: true },
  { key: "politics", label: "Politics" },
  { key: "sports", label: "Sports" },
  { key: "crypto", label: "Crypto" },
];
