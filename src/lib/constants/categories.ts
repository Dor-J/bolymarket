import type { CategoryFilter } from "@/types/polymarket";

export interface CategoryNavItem {
  key: CategoryFilter;
  label: string;
  href: string;
  icon?: string;
  showDividerAfter?: boolean;
}

/** Category navigation links — assignment minimum + Polymarket-style divider. */
export const CATEGORY_NAV_ITEMS: CategoryNavItem[] = [
  {
    key: 'trending',
    label: 'Trending',
    href: '/',
    icon: '📈',
    showDividerAfter: true,
  },
  { key: 'politics', label: 'Politics', href: '/politics' },
  { key: 'sports', label: 'Sports', href: '/sports' },
  { key: 'crypto', label: 'Crypto', href: '/crypto' },
];
