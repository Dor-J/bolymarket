import type { CategoryFilter } from '@/types/polymarket';

export type CategoryIcon = 'trending' | 'world-cup';

/** Category slugs with dedicated functional routes. */
export const FUNCTIONAL_CATEGORY_KEYS = [
  'trending',
  'politics',
  'sports',
  'crypto',
] as const;

export type FunctionalCategoryKey = (typeof FUNCTIONAL_CATEGORY_KEYS)[number];

export interface CategoryNavItem {
  key: CategoryFilter | string;
  label: string;
  href: string;
  /** When true, navigates to a real route; otherwise placeholder `#`. */
  functional: boolean;
  icon?: CategoryIcon;
  /** Optional accent class (e.g. World Cup gold). */
  accentClass?: string;
  showDividerAfter?: boolean;
}

/** Primary horizontal market navigation — mirrors polymarket.com order. */
export const CATEGORY_NAV_ITEMS: CategoryNavItem[] = [
  {
    key: 'trending',
    label: 'Trending',
    href: '/',
    functional: true,
    icon: 'trending',
  },
  {
    key: 'world-cup',
    label: 'World Cup',
    href: '#',
    functional: false,
    icon: 'world-cup',
    accentClass: 'text-[#9a6b2f]',
  },
  {
    key: 'breaking',
    label: 'Breaking',
    href: '#',
    functional: false,
    showDividerAfter: true,
  },
  { key: 'politics', label: 'Politics', href: '/politics', functional: true },
  { key: 'sports', label: 'Sports', href: '/sports', functional: true },
  { key: 'crypto', label: 'Crypto', href: '/crypto', functional: true },
  { key: 'esports', label: 'Esports', href: '#', functional: false },
  { key: 'iran', label: 'Iran', href: '#', functional: false },
  { key: 'finance', label: 'Finance', href: '#', functional: false },
  { key: 'geopolitics', label: 'Geopolitics', href: '#', functional: false },
  { key: 'tech', label: 'Tech', href: '#', functional: false },
  { key: 'culture', label: 'Culture', href: '#', functional: false },
  { key: 'economy', label: 'Economy', href: '#', functional: false },
  { key: 'weather', label: 'Weather', href: '#', functional: false },
  { key: 'mentions', label: 'Mentions', href: '#', functional: false },
  { key: 'elections', label: 'Elections', href: '#', functional: false },
];

export type CategoryMoreIconKey =
  | 'new'
  | 'activity'
  | 'leaderboard'
  | 'dashboards'
  | 'rewards';

export interface CategoryMoreItem {
  label: string;
  href: string;
  icon: CategoryMoreIconKey;
}

/** Items shown in the category "More" hover dropdown. */
export const CATEGORY_MORE_ITEMS: CategoryMoreItem[] = [
  { label: 'New', href: '#', icon: 'new' },
  { label: 'Activity', href: '#', icon: 'activity' },
  { label: 'Leaderboard', href: '#', icon: 'leaderboard' },
  { label: 'Dashboards', href: '#', icon: 'dashboards' },
  { label: 'Rewards', href: '#', icon: 'rewards' },
];

export type UserMenuIconKey =
  | 'leaderboard'
  | 'rewards'
  | 'apis'
  | 'dark-mode'
  | 'language';

export interface UserMenuItem {
  key: string;
  label: string;
  href?: string;
  type: 'link' | 'theme-toggle' | 'language';
  icon?: UserMenuIconKey;
  /** Draw a divider after this item (Polymarket groups icon rows vs text rows). */
  showDividerAfter?: boolean;
}

/** Desktop hamburger menu items — mirrors polymarket.com user menu. */
export const USER_MENU_ITEMS: UserMenuItem[] = [
  {
    key: 'leaderboard',
    label: 'Leaderboard',
    href: '#',
    type: 'link',
    icon: 'leaderboard',
  },
  {
    key: 'rewards',
    label: 'Rewards',
    href: '#',
    type: 'link',
    icon: 'rewards',
  },
  {
    key: 'apis',
    label: 'APIs',
    href: '/api-docs',
    type: 'link',
    icon: 'apis',
  },
  {
    key: 'theme',
    label: 'Dark mode',
    type: 'theme-toggle',
    icon: 'dark-mode',
    showDividerAfter: true,
  },
  { key: 'accuracy', label: 'Accuracy', href: '#', type: 'link' },
  { key: 'status', label: 'Status', href: '#', type: 'link' },
  { key: 'documentation', label: 'Documentation', href: '/api-docs', type: 'link' },
  { key: 'help', label: 'Help Center', href: '#', type: 'link' },
  { key: 'terms', label: 'Terms of Use', href: '#', type: 'link' },
  {
    key: 'language',
    label: 'Language',
    type: 'language',
    icon: 'language',
  },
];

export const USER_MENU_LANGUAGES = ['English', 'Español', '中文', 'Bahasa'];
