'use client';

import { useState } from 'react';
import { formatMarketCount } from '@/lib/format/marketCount';
import {
  getSidebarCount,
  SIDEBAR_ESPORTS_LINK,
  SIDEBAR_FLAT_LINKS,
  SIDEBAR_LACROSSE_GROUP,
  SIDEBAR_NAV_GROUPS,
  SIDEBAR_TOP_LEAGUES,
  shouldShowNavLink,
  type SidebarNavGroup,
  type SidebarNavLink,
} from '@/lib/sports/sidebarNav';
import type { SportsLeagueSummary } from '@/types/polymarket';
import { cn } from '@/lib/cn';
import {
  ChevronDownSmall,
  FuturesNavIcon,
  LiveNavIcon,
  SidebarSportIcon,
} from './SportsSidebarIcons';

export interface SportsSidebarProps {
  viewTab: 'live' | 'futures';
  onViewTabChange: (tab: 'live' | 'futures') => void;
  leagues: SportsLeagueSummary[];
  selectedFilterId?: string;
  onFilterSelect: (id: string) => void;
  className?: string;
}

const VIEW_TABS = [
  { id: 'live' as const, label: 'Live' },
  { id: 'futures' as const, label: 'Futures' },
];

/**
 * Sports left nav matching Polymarket: Live/Futures tabs, flat top leagues,
 * expandable sport groups, and flat specialty links.
 */
export function SportsSidebar({
  viewTab,
  onViewTabChange,
  leagues,
  selectedFilterId,
  onFilterSelect,
  className,
}: SportsSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const leagueMap = new Map(leagues.map((league) => [league.id, league]));

  function toggleGroup(groupId: string): void {
    setExpandedGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  }

  const visibleTopLeagues = SIDEBAR_TOP_LEAGUES.filter((link) =>
    shouldShowNavLink(link, leagueMap),
  );

  const visibleGroups = SIDEBAR_NAV_GROUPS.map((group) => ({
    ...group,
    children: group.children.filter((child) => shouldShowNavLink(child, leagueMap)),
  })).filter((group) => group.children.length > 0);

  const visibleFlatLinks = SIDEBAR_FLAT_LINKS.filter((link) =>
    shouldShowNavLink(link, leagueMap),
  );

  const lacrosseChildren = SIDEBAR_LACROSSE_GROUP.children.filter((child) =>
    shouldShowNavLink(child, leagueMap),
  );

  const showEsports = shouldShowNavLink(SIDEBAR_ESPORTS_LINK, leagueMap);

  return (
    <div className={cn('hidden shrink-0 lg:block', className)}>
      <nav
        aria-label="Sports navigation"
        className="scrollbar-hide sticky flex w-[190px] shrink-0 flex-col overflow-y-auto py-8"
        style={{
          top: 'var(--navbar-height)',
          height: 'calc(100vh - var(--navbar-height))',
        }}
      >
        <div className="flex flex-col gap-0.5">
          {VIEW_TABS.map((tab) => {
            const active = tab.id === viewTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onViewTabChange(tab.id)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'group flex w-full cursor-pointer flex-row items-center justify-between',
                  'rounded-md px-3 py-2.5',
                  active ? 'bg-neutral-100' : 'bg-transparent hover:bg-neutral-50',
                )}
              >
                <div
                  className={cn(
                    'flex min-w-0 flex-1 flex-row items-center gap-x-2.5',
                    'transition-opacity duration-150 group-hover:opacity-100',
                    !active && 'opacity-80',
                  )}
                >
                  <div className="shrink-0 [&_svg]:size-5">
                    {tab.id === 'live' ? <LiveNavIcon /> : <FuturesNavIcon />}
                  </div>
                  <p className="truncate text-[15px] font-semibold text-text">
                    {tab.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mb-2 w-full border-b border-neutral-100 pb-2" />

        <div className="mt-4 mb-3 flex items-center px-3">
          <p className="text-[11px] font-medium tracking-wider whitespace-nowrap text-text-secondary uppercase">
            All Sports
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          {visibleTopLeagues.map((link) => (
            <SidebarLinkRow
              key={link.id}
              link={link}
              active={link.filterId === selectedFilterId}
              count={getSidebarCount(link.filterId, leagueMap)}
              onSelect={onFilterSelect}
            />
          ))}

          {visibleGroups.map((group) => (
            <SidebarGroupRow
              key={group.id}
              group={group}
              expanded={expandedGroups[group.id] ?? false}
              selectedFilterId={selectedFilterId}
              leagueMap={leagueMap}
              onToggle={() => toggleGroup(group.id)}
              onSelect={onFilterSelect}
            />
          ))}

          {visibleFlatLinks.map((link) => (
            <SidebarLinkRow
              key={link.id}
              link={link}
              active={link.filterId === selectedFilterId}
              count={getSidebarCount(link.filterId, leagueMap)}
              onSelect={onFilterSelect}
            />
          ))}

          {lacrosseChildren.length > 0 ? (
            <SidebarGroupRow
              group={{ ...SIDEBAR_LACROSSE_GROUP, children: lacrosseChildren }}
              expanded={expandedGroups.lacrosse ?? false}
              selectedFilterId={selectedFilterId}
              leagueMap={leagueMap}
              onToggle={() => toggleGroup('lacrosse')}
              onSelect={onFilterSelect}
            />
          ) : null}

          {showEsports ? (
            <SidebarLinkRow
              link={SIDEBAR_ESPORTS_LINK}
              active={SIDEBAR_ESPORTS_LINK.filterId === selectedFilterId}
              count={getSidebarCount(SIDEBAR_ESPORTS_LINK.filterId, leagueMap)}
              onSelect={onFilterSelect}
              hideCount
            />
          ) : null}
        </div>
      </nav>
    </div>
  );
}

function SidebarLinkRow({
  link,
  active,
  count,
  onSelect,
  nested = false,
  hideCount = false,
}: {
  link: SidebarNavLink;
  active: boolean;
  count: number;
  onSelect: (id: string) => void;
  nested?: boolean;
  hideCount?: boolean;
}) {
  if (nested) {
    return (
      <button
        type="button"
        onClick={() => onSelect(link.filterId)}
        aria-current={active ? 'true' : undefined}
        className="group block w-full cursor-pointer"
      >
        <div
          className={cn(
            'relative rounded-md px-3 py-2.5 hover:bg-neutral-50',
            active && 'bg-neutral-100',
          )}
        >
          <div
            className={cn(
              'flex min-w-0 items-center gap-x-2.5 transition-opacity duration-150',
              'group-hover:opacity-100',
              !active && 'opacity-80',
            )}
          >
            <div className="shrink-0 [&_svg]:size-4">
              <SidebarSportIcon icon={link.icon} muted={!active} />
            </div>
            <p className="truncate pr-4 text-[15px] font-medium whitespace-nowrap text-text">
              {link.label}
            </p>
          </div>
          {!hideCount && count > 0 ? (
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-bold text-text-secondary">
              {formatMarketCount(count)}
            </span>
          ) : null}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(link.filterId)}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'group flex w-full cursor-pointer flex-row items-center justify-between',
        'rounded-md px-3 py-2.5',
        active ? 'bg-neutral-100' : 'bg-transparent hover:bg-neutral-50',
      )}
    >
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-row items-center gap-x-2.5',
          'transition-opacity duration-150 group-hover:opacity-100',
          !active && 'opacity-80',
        )}
      >
        <div className="shrink-0 [&_svg]:size-5">
          <SidebarSportIcon icon={link.icon} />
        </div>
        <p className="truncate text-[15px] font-semibold text-text">{link.label}</p>
      </div>
      {!hideCount && count > 0 ? (
        <div className="ml-2 shrink-0 text-[11px] font-bold text-text-secondary">
          {formatMarketCount(count)}
        </div>
      ) : null}
    </button>
  );
}

function SidebarGroupRow({
  group,
  expanded,
  selectedFilterId,
  leagueMap,
  onToggle,
  onSelect,
}: {
  group: SidebarNavGroup;
  expanded: boolean;
  selectedFilterId?: string;
  leagueMap: Map<string, SportsLeagueSummary>;
  onToggle: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full cursor-pointer flex-row items-center justify-between rounded-md bg-transparent px-3 py-2.5 hover:bg-neutral-50"
      >
        <div
          className={cn(
            'flex min-w-0 items-center gap-x-2.5 transition-opacity duration-150',
            'group-hover:opacity-100 opacity-80',
          )}
        >
          <div className="shrink-0 [&_svg]:size-5">
            <div className="flex size-5 items-center justify-center">
              <SidebarSportIcon icon={group.icon} />
            </div>
          </div>
          <p className="truncate text-[15px] font-semibold text-text">{group.label}</p>
        </div>
        <ChevronDownSmall className={cn(expanded && 'rotate-180')} />
      </button>

      {expanded ? (
        <div className="flex flex-col gap-0.5 pt-0.5 pl-5">
          {group.children.map((child) => (
            <SidebarLinkRow
              key={child.id}
              link={child}
              active={child.filterId === selectedFilterId}
              count={getSidebarCount(child.filterId, leagueMap)}
              onSelect={onSelect}
              nested
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
