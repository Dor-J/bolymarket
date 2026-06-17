import { describe, expect, it } from 'vitest';
import {
  getSidebarCount,
  shouldShowNavLink,
  SIDEBAR_TOP_LEAGUES,
} from '@/lib/sports/sidebarNav';
import type { SportsLeagueSummary } from '@/types/polymarket';

function leagueMap(entries: SportsLeagueSummary[]): Map<string, SportsLeagueSummary> {
  return new Map(entries.map((entry) => [entry.id, entry]));
}

describe('getSidebarCount', () => {
  it('returns league count when present', () => {
    const map = leagueMap([{ id: 'mlb', label: 'MLB', count: 16, icon: '' }]);
    expect(getSidebarCount('mlb', map)).toBe(16);
  });

  it('returns zero when league is missing', () => {
    expect(getSidebarCount('mlb', new Map())).toBe(0);
  });
});

describe('shouldShowNavLink', () => {
  it('shows top leagues even with zero count', () => {
    const link = SIDEBAR_TOP_LEAGUES[0];
    expect(shouldShowNavLink(link, new Map())).toBe(true);
  });

  it('hides other-category links without games', () => {
    const map = leagueMap([]);
    expect(
      shouldShowNavLink(
        { type: 'link', id: 'golf', label: 'Golf', filterId: 'other', icon: 'golf' },
        map,
      ),
    ).toBe(false);
  });

  it('shows other-category links when other has games', () => {
    const map = leagueMap([{ id: 'other', label: 'OTHER', count: 3, icon: '' }]);
    expect(
      shouldShowNavLink(
        { type: 'link', id: 'golf', label: 'Golf', filterId: 'other', icon: 'golf' },
        map,
      ),
    ).toBe(true);
  });
});
