import type { SportsLeagueSummary } from '@/types/polymarket';

export type SidebarIconKey =
  | 'live'
  | 'futures'
  | 'world-cup'
  | 'mlb'
  | 'nhl'
  | 'ufc'
  | 'football'
  | 'soccer'
  | 'tennis'
  | 'cricket'
  | 'basketball'
  | 'baseball'
  | 'hockey'
  | 'rugby'
  | 'table-tennis'
  | 'golf'
  | 'f1'
  | 'boxing'
  | 'pickleball'
  | 'lacrosse'
  | 'esports';

export interface SidebarNavLink {
  type: 'link';
  id: string;
  label: string;
  filterId: string;
  icon: SidebarIconKey;
}

export interface SidebarNavGroup {
  type: 'group';
  id: string;
  label: string;
  icon: SidebarIconKey;
  children: SidebarNavLink[];
}

export type SidebarNavItem = SidebarNavLink | SidebarNavGroup;

/** Top-level leagues shown before expandable groups (Polymarket order). */
export const SIDEBAR_TOP_LEAGUES: SidebarNavLink[] = [
  {
    type: 'link',
    id: 'world-cup',
    label: 'World Cup',
    filterId: 'world-cup',
    icon: 'world-cup',
  },
  {
    type: 'link',
    id: 'mlb',
    label: 'MLB',
    filterId: 'mlb',
    icon: 'mlb',
  },
  {
    type: 'link',
    id: 'nhl',
    label: 'NHL',
    filterId: 'nhl',
    icon: 'nhl',
  },
];

/** Expandable sport category groups (Polymarket order). */
export const SIDEBAR_NAV_GROUPS: SidebarNavGroup[] = [
  {
    type: 'group',
    id: 'ufc',
    label: 'UFC',
    icon: 'ufc',
    children: [
      { type: 'link', id: 'ufc-all', label: 'All', filterId: 'ufc', icon: 'ufc' },
      { type: 'link', id: 'ufc-main', label: 'UFC', filterId: 'ufc', icon: 'ufc' },
    ],
  },
  {
    type: 'group',
    id: 'football',
    label: 'Football',
    icon: 'football',
    children: [
      { type: 'link', id: 'nfl-all', label: 'All', filterId: 'nfl', icon: 'football' },
      { type: 'link', id: 'nfl', label: 'NFL', filterId: 'nfl', icon: 'football' },
    ],
  },
  {
    type: 'group',
    id: 'soccer',
    label: 'Soccer',
    icon: 'soccer',
    children: [
      {
        type: 'link',
        id: 'soccer-all',
        label: 'All',
        filterId: 'soccer',
        icon: 'soccer',
      },
      {
        type: 'link',
        id: 'soccer-wc',
        label: 'World Cup',
        filterId: 'world-cup',
        icon: 'world-cup',
      },
      {
        type: 'link',
        id: 'soccer-main',
        label: 'Soccer',
        filterId: 'soccer',
        icon: 'soccer',
      },
    ],
  },
  {
    type: 'group',
    id: 'tennis',
    label: 'Tennis',
    icon: 'tennis',
    children: [
      { type: 'link', id: 'tennis-all', label: 'All', filterId: 'atp', icon: 'tennis' },
      { type: 'link', id: 'atp', label: 'ATP', filterId: 'atp', icon: 'tennis' },
      { type: 'link', id: 'wta', label: 'WTA', filterId: 'wta', icon: 'tennis' },
    ],
  },
  {
    type: 'group',
    id: 'basketball',
    label: 'Basketball',
    icon: 'basketball',
    children: [
      {
        type: 'link',
        id: 'basketball-all',
        label: 'All',
        filterId: 'nba',
        icon: 'basketball',
      },
      { type: 'link', id: 'nba', label: 'NBA', filterId: 'nba', icon: 'basketball' },
    ],
  },
  {
    type: 'group',
    id: 'baseball',
    label: 'Baseball',
    icon: 'baseball',
    children: [
      {
        type: 'link',
        id: 'baseball-all',
        label: 'All',
        filterId: 'mlb',
        icon: 'baseball',
      },
      { type: 'link', id: 'mlb-group', label: 'MLB', filterId: 'mlb', icon: 'baseball' },
    ],
  },
  {
    type: 'group',
    id: 'hockey',
    label: 'Hockey',
    icon: 'hockey',
    children: [
      {
        type: 'link',
        id: 'hockey-all',
        label: 'All',
        filterId: 'nhl',
        icon: 'hockey',
      },
      { type: 'link', id: 'nhl-group', label: 'NHL', filterId: 'nhl', icon: 'hockey' },
    ],
  },
];

/** Flat nav links after groups (Polymarket order). */
export const SIDEBAR_FLAT_LINKS: SidebarNavLink[] = [
  { type: 'link', id: 'golf', label: 'Golf', filterId: 'other', icon: 'golf' },
  { type: 'link', id: 'f1', label: 'Formula 1', filterId: 'other', icon: 'f1' },
  { type: 'link', id: 'boxing', label: 'Boxing', filterId: 'other', icon: 'boxing' },
  {
    type: 'link',
    id: 'pickleball',
    label: 'Pickleball',
    filterId: 'other',
    icon: 'pickleball',
  },
];

export const SIDEBAR_LACROSSE_GROUP: SidebarNavGroup = {
  type: 'group',
  id: 'lacrosse',
  label: 'Lacrosse',
  icon: 'lacrosse',
  children: [
    {
      type: 'link',
      id: 'lacrosse-all',
      label: 'All',
      filterId: 'other',
      icon: 'lacrosse',
    },
  ],
};

export const SIDEBAR_ESPORTS_LINK: SidebarNavLink = {
  type: 'link',
  id: 'esports',
  label: 'Esports',
  filterId: 'other',
  icon: 'esports',
};

/**
 * Resolves display count for a sidebar filter id from API league summaries.
 */
export function getSidebarCount(
  filterId: string,
  leagueMap: Map<string, SportsLeagueSummary>,
): number {
  const entry = leagueMap.get(filterId);
  return entry?.count ?? 0;
}

/**
 * Returns true when a nav link should be shown (has games or is a known league).
 */
export function shouldShowNavLink(
  link: SidebarNavLink,
  leagueMap: Map<string, SportsLeagueSummary>,
): boolean {
  if (link.filterId === 'other') {
    return (leagueMap.get('other')?.count ?? 0) > 0;
  }

  const count = getSidebarCount(link.filterId, leagueMap);
  if (count > 0) {
    return true;
  }

  return ['world-cup', 'mlb', 'nhl', 'nba', 'nfl', 'atp', 'wta', 'soccer'].includes(
    link.filterId,
  );
}
