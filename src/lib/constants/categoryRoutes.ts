import type { CategoryFilter } from '@/types/polymarket';

/** Category slugs that have dedicated routes. */
export const CATEGORY_ROUTE_SLUGS = ['crypto', 'sports', 'politics'] as const;

export type CategoryRouteSlug = (typeof CATEGORY_ROUTE_SLUGS)[number];

/** Maps route slug to display metadata for category pages. */
export const CATEGORY_PAGE_META: Record<
  CategoryRouteSlug,
  { title: string; description: string; filter: CategoryFilter }
> = {
  crypto: {
    title: 'Crypto',
    description: 'Prediction markets on cryptocurrency and blockchain events.',
    filter: 'crypto',
  },
  sports: {
    title: 'Sports',
    description: 'Prediction markets on sports outcomes and championships.',
    filter: 'sports',
  },
  politics: {
    title: 'Politics',
    description: 'Prediction markets on elections, policy, and geopolitics.',
    filter: 'politics',
  },
};

/**
 * Returns true when a string is a valid dedicated category route slug.
 */
export function isCategoryRouteSlug(value: string): value is CategoryRouteSlug {
  return (CATEGORY_ROUTE_SLUGS as readonly string[]).includes(value);
}
