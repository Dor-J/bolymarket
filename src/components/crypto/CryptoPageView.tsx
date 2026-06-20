"use client";

import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { bookmarksAtom } from "@/lib/atoms/bookmarks";
import { bookmarksOnlyAtom } from "@/lib/atoms/marketPage";
import { searchQueryAtom } from "@/lib/atoms/search";
import {
  CRYPTO_ASSET_NAV_ITEMS,
  CRYPTO_TIME_NAV_ITEMS,
  type CryptoNavItem,
} from "@/lib/crypto/cryptoNav";
import {
  CRYPTO_MARKET_TYPE_TABS,
  CRYPTO_TOPIC_CHIPS,
} from "@/lib/markets/constants";
import {
  countTopicMatches,
  filterByBookmarks,
  filterByMarketType,
  filterByStatus,
  filterByTopic,
  sortEvents,
} from "@/lib/markets/filterEvents";
import type { MarketSort, MarketStatus } from "@/lib/markets/types";
import { getVisibleOutcomeSeedsFromEvents } from "@/lib/prices/visibleOutcomeKeys";
import { EventCard } from "@/components/cards/EventCard";
import { EventListEmpty } from "@/components/home/EventListEmpty";
import { EventsGridError } from "@/components/home/EventsGridError";
import { EventsGridSkeleton } from "@/components/home/EventsGridSkeleton";
import { ShowMoreMarketsButton } from "@/components/markets/ShowMoreMarketsButton";
import { AuthModal } from "@/components/ui/Modal";
import { CryptoSidebarIcon } from "./CryptoSidebarIcons";
import { useCategoryEvents } from "@/hooks/useCategoryEvents";
import { useLivePrices } from "@/hooks/useLivePrices";
import { useShowMoreMarkets } from "@/hooks/useShowMoreMarkets";
import { cn } from "@/lib/cn";

const CRYPTO_GRID_CLASSES =
  "grid h-auto grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";

const CRYPTO_PERIOD_FILTER_ITEMS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "all", label: "All" },
] as const;

const CRYPTO_SORT_FILTER_ITEMS = [
  { id: "volume-24h", label: "24hr Volume", icon: "trending" },
  { id: "volume-total", label: "Total Volume", icon: "flame" },
  { id: "liquidity", label: "Liquidity", icon: "drop" },
  { id: "newest", label: "Newest", icon: "sparkles" },
  { id: "ending-soon", label: "Ending Soon", icon: "clock" },
  { id: "competitive", label: "Competitive", icon: "trophy" },
  { id: "earn", label: "Earn 3.25%", icon: "earn" },
] as const;

type CryptoSortFilterId = (typeof CRYPTO_SORT_FILTER_ITEMS)[number]["id"];

function mapCryptoSortToMarketSort(sortId: CryptoSortFilterId): MarketSort {
  return sortId === "newest" ? "newest" : "volume";
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="m15.75 15.75-4.11-4.11M7.75 13.25a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M13.25 5.25h3M1.75 5.25h7M4.75 12.75h-3M16.25 12.75h-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="11"
        cy="5.25"
        r="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="7"
        cy="12.75"
        r="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TrendingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="m1.75 12.25 3.65-3.65a.5.5 0 0 1 .7 0l3.3 3.3a.5.5 0 0 0 .7 0l6.15-6.15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M11.25 5.75h5v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M6.96 16.25c-.28-2.75 1.8-2.1 1.88-4.5 1.58.85 2.24 2.99 2.2 4.46"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M11.04 16.21c3.9-1.52 4.72-5.83 1.96-9.85"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M10.53 7.37s.7-3.77-2.04-5.62c-.36 4.38-5.11 4.53-5.11 9.24 0 2.12 1.1 4.4 3.58 5.26"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M9 16.25c3.04 0 5.5-2.47 5.5-5.52 0-4.19-3.08-5.98-5.5-8.98-2.42 3-5.5 4.79-5.5 8.98 0 3.05 2.46 5.52 5.5 5.52Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M9 13.25c-1.38 0-2.5-1.13-2.5-2.52"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="m3.54 3.61-1.75 4.58c-.15.4.19.82.61.75l4.88-.8c.43-.07.62-.58.34-.91L4.5 3.45c-.27-.33-.8-.24-.96.16Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle
        cx="13.5"
        cy="4.5"
        r="2.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M14.25 12.52c-1.27.92-2.21 2.23-2.68 3.73-.92-1.27-2.23-2.21-3.73-2.68 1.27-.92 2.21-2.23 2.68-3.73.92 1.27 2.23 2.21 3.73 2.68Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function EndingSoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M9 4.75V9l3.25 2.25M9 1.75A7.25 7.25 0 0 1 9 16.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="3.87" cy="14.13" r=".75" fill="currentColor" />
      <circle cx="1.75" cy="9" r=".75" fill="currentColor" />
      <circle cx="3.87" cy="3.87" r=".75" fill="currentColor" />
      <circle cx="6.23" cy="15.7" r=".75" fill="currentColor" />
      <circle cx="2.3" cy="11.77" r=".75" fill="currentColor" />
      <circle cx="2.3" cy="6.23" r=".75" fill="currentColor" />
      <circle cx="6.23" cy="2.3" r=".75" fill="currentColor" />
    </svg>
  );
}

function CompetitiveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M13.25 13.25v2a1 1 0 0 1-1 1h-5.5a1 1 0 0 1-1-1v-2M12.25 5.75c0 1.1-.9 2-2 2H7.58"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M4.02 6.75a2 2 0 0 1-.27-1v-.5a3 3 0 0 1 3-3h5.5a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3v-1.5a2 2 0 0 1 2-2H6a1.75 1.75 0 1 1 0 3.5h-.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function EarnIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden className={className}>
      <path
        d="M3.9 10.92A6 6 0 1 1 14.96 8.5M2 16.25l2.59-2.59a1 1 0 0 1 .97-.26l6.13 1.69a1 1 0 0 0 .97-.25l3.59-3.59"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M16.25 14.75v-3.5h-3.5M10.82 5.25H8.2a1.25 1.25 0 0 0 0 2.5h1.6a1.25 1.25 0 0 1 0 2.5H7.18M9 4v1M9 11.5v-1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CryptoSortIcon({
  icon,
  className,
}: {
  icon: (typeof CRYPTO_SORT_FILTER_ITEMS)[number]["icon"];
  className?: string;
}) {
  switch (icon) {
    case "flame":
      return <FlameIcon className={className} />;
    case "drop":
      return <DropletIcon className={className} />;
    case "sparkles":
      return <SparklesIcon className={className} />;
    case "clock":
      return <EndingSoonIcon className={className} />;
    case "trophy":
      return <CompetitiveIcon className={className} />;
    case "earn":
      return <EarnIcon className={className} />;
    case "trending":
    default:
      return <TrendingIcon className={className} />;
  }
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={className}>
      <path
        d="M1.75 4.25 6 8.5l4.25-4.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function formatCount(value: number | undefined): string {
  return String(value ?? 0);
}

function CryptoSidebarItem({
  item,
  count,
  active,
  onSelect,
}: {
  item: CryptoNavItem;
  count?: number;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "group flex w-full cursor-pointer flex-row items-center justify-between rounded-md",
        "px-3 py-2.5 text-left transition-colors",
        active ? "bg-surface-2" : "bg-transparent hover:bg-surface-2",
      )}
      onClick={() => onSelect(item.id)}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-row items-center gap-x-2.5 transition-opacity",
          "duration-150 group-hover:opacity-100",
          active ? "opacity-100" : "opacity-80",
        )}
      >
        <div className="shrink-0">
          {item.token ? (
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                item.token.className,
              )}
              aria-hidden
            >
              {item.token.symbol}
            </span>
          ) : item.icon ? (
            <CryptoSidebarIcon icon={item.icon} className="size-5" />
          ) : null}
        </div>
        <p className="truncate text-body-base font-semibold">{item.label}</p>
      </div>
      <div className="ml-2 shrink-0 text-[11px] font-bold text-text-tertiary">
        {formatCount(count)}
      </div>
    </button>
  );
}

function CryptoSidebar({
  selectedId,
  topicCounts,
  onSelect,
}: {
  selectedId: string;
  topicCounts: Record<string, number>;
  onSelect: (id: string) => void;
}) {
  return (
    <aside
      className={cn(
        "scrollbar-hide sticky hidden w-[190px] shrink-0 flex-col overflow-y-auto py-5",
        "lg:flex",
      )}
      style={{ top: 128, height: "calc(100vh - 9rem)" }}
      aria-label="Crypto filters"
    >
      <div className="flex flex-col gap-0.5">
        {CRYPTO_TIME_NAV_ITEMS.map((item) => (
          <CryptoSidebarItem
            key={item.id}
            item={item}
            count={topicCounts[item.id]}
            active={selectedId === item.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="mb-2 w-full border-b border-border pb-2" />

      <div className="flex flex-col gap-0.5">
        {CRYPTO_ASSET_NAV_ITEMS.map((item) => (
          <CryptoSidebarItem
            key={item.id}
            item={item}
            count={topicCounts[item.id]}
            active={selectedId === item.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </aside>
  );
}

function CryptoMobileTimeRail({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const visibleItems = CRYPTO_TIME_NAV_ITEMS.slice(0, 4);
  const moreItems = CRYPTO_TIME_NAV_ITEMS.slice(4);
  const moreActive = moreItems.some((item) => item.id === selectedId);

  return (
    <div className="pt-2 pb-2 lg:hidden">
      <div className="scrollbar-hide -mx-1 flex gap-1 overflow-x-auto px-1">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "h-8 shrink-0 rounded-md px-2.5 text-sm font-medium whitespace-nowrap",
              selectedId === item.id
                ? "bg-brand-subtle text-brand"
                : "text-neutral-500 hover:bg-surface-2 hover:text-text",
            )}
          >
            {item.label}
          </button>
        ))}

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMoreOpen((open) => !open)}
            className={cn(
              "h-8 rounded-md px-2.5 text-sm font-medium whitespace-nowrap",
              moreActive
                ? "bg-brand-subtle text-brand"
                : "text-neutral-500 hover:bg-surface-2 hover:text-text",
            )}
          >
            More
          </button>

          {moreOpen ? (
            <div className="absolute top-full left-0 z-40 mt-1 w-40 rounded-lg border border-border bg-background p-1.5 shadow-lg">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.id);
                    setMoreOpen(false);
                  }}
                  className={cn(
                    "block w-full rounded-sm px-2.5 py-2 text-left text-sm font-medium",
                    selectedId === item.id
                      ? "bg-brand-subtle text-brand"
                      : "hover:bg-surface-2",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CryptoHeader({
  selectedTypeId,
  selectedTopicId,
  selectedSortId,
  searchQuery,
  onTypeSelect,
  onTopicSelect,
  onSortSelect,
  onSearchChange,
}: {
  selectedTypeId: string;
  selectedTopicId: string;
  selectedSortId: CryptoSortFilterId;
  searchQuery: string;
  onTypeSelect: (id: string) => void;
  onTopicSelect: (id: string) => void;
  onSortSelect: (id: CryptoSortFilterId) => void;
  onSearchChange: (value: string) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const periodMenuRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0 });
  const selectedSort =
    CRYPTO_SORT_FILTER_ITEMS.find((item) => item.id === selectedSortId) ??
    CRYPTO_SORT_FILTER_ITEMS[0];
  const selectedPeriod =
    CRYPTO_PERIOD_FILTER_ITEMS.find((item) => item.id === selectedTopicId) ??
    CRYPTO_PERIOD_FILTER_ITEMS[3];

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const activeTab = tabRefs.current[selectedTypeId];
    const tabList = tabListRef.current;

    if (!activeTab || !tabList) {
      return;
    }

    const activeRect = activeTab.getBoundingClientRect();
    const tabListRect = tabList.getBoundingClientRect();

    setActiveIndicator({
      left: activeRect.left - tabListRect.left + tabList.scrollLeft,
      width: activeRect.width,
    });
  }, [selectedTypeId]);

  useEffect(() => {
    if (!sortMenuOpen && !periodMenuOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (!sortMenuRef.current?.contains(target)) {
        setSortMenuOpen(false);
      }

      if (!periodMenuRef.current?.contains(target)) {
        setPeriodMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSortMenuOpen(false);
        setPeriodMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sortMenuOpen, periodMenuOpen]);

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2 lg:flex-nowrap">
        <h1 className="order-1 shrink-0 text-heading-xl font-semibold lg:order-0">
          Crypto
        </h1>

        <div className="no-scrollbar order-3 w-full min-w-0 flex-none overflow-x-auto lg:order-0 lg:flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-2 w-8 bg-linear-to-r from-background via-background to-transparent opacity-0 transition-opacity duration-200 md:w-16" />
            <div
              ref={tabListRef}
              className="no-scrollbar flex snap-x snap-mandatory scroll-px-3 overflow-x-auto px-3.5 lg:px-0"
            >
              <div dir="ltr" data-orientation="horizontal" aria-label="Crypto tags">
                <div className="relative">
                  <div
                    role="tablist"
                    aria-orientation="horizontal"
                    className={cn(
                      "relative inline-flex h-9 items-center justify-center gap-x-1 rounded-lg",
                      "bg-transparent px-0 py-1 text-body-base font-medium text-text-secondary",
                    )}
                    tabIndex={0}
                    data-orientation="horizontal"
                  >
                    {CRYPTO_MARKET_TYPE_TABS.map((tab) => {
                      const active = selectedTypeId === tab.id;

                      return (
                        <button
                          key={tab.id}
                          ref={(node) => {
                            tabRefs.current[tab.id] = node;
                          }}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          data-state={active ? "active" : "inactive"}
                          data-orientation="horizontal"
                          onClick={() => onTypeSelect(tab.id)}
                          className={cn(
                            "relative z-1 inline-flex h-full cursor-pointer items-center justify-center",
                            "rounded-md px-3 py-1 text-body-base font-medium whitespace-nowrap",
                            "ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
                            "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                            active
                              ? "text-text-brand"
                              : "text-tabs-text hover:text-tabs-text-hover",
                          )}
                        >
                          <span className="text-body-base font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div
                    className={cn(
                      "pointer-events-none absolute top-1/2 z-0 h-8 -translate-y-1/2 rounded-[6px]",
                      "bg-bg-brand/10 text-brand opacity-100 dark:bg-bg-brand/20",
                    )}
                    style={{
                      transform: `translateX(${activeIndicator.left}px) translateY(-50%)`,
                      width: activeIndicator.width,
                      transformOrigin: "center center",
                    }}
                  />
                </div>
                {CRYPTO_MARKET_TYPE_TABS.map((tab) => (
                  <div
                    key={tab.id}
                    data-state={selectedTypeId === tab.id ? "active" : "inactive"}
                    data-orientation="horizontal"
                    role="tabpanel"
                    className="mt-2 hidden ring-offset-background transition focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-0 focus-visible:outline-none data-[state=inactive]:hidden"
                  />
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-2 w-8 bg-linear-to-l from-background via-background to-transparent opacity-0 transition-opacity duration-200 md:w-16" />
          </div>
        </div>

        <div className="order-2 ml-auto flex shrink-0 items-center gap-0.5 lg:order-0">
          <div className="relative flex items-center">
            <div
              className={cn(
                "shrink-0 overflow-hidden transition-all duration-200",
                searchOpen ? "w-0 opacity-0" : "w-10 opacity-100",
              )}
            >
              <button
                type="button"
                aria-label="Open search"
                aria-controls="crypto-search-input"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "inline-flex size-10 cursor-pointer items-center justify-center rounded-sm",
                  "bg-button-ghost-bg text-button-ghost-text hover:bg-button-ghost-bg-hover",
                  "transition-none active:scale-[97%]",
                )}
              >
                <SearchIcon className="size-[18px]" />
              </button>
            </div>
            <div
              className={cn(
                "relative overflow-hidden transition-all duration-300 ease-out",
                searchOpen ? "w-52 opacity-100" : "w-0 opacity-0",
              )}
            >
              <input
                ref={inputRef}
                id="crypto-search-input"
                type="search"
                aria-label="Search crypto markets"
                value={searchQuery}
                placeholder="Search"
                autoComplete="off"
                onChange={(event) => onSearchChange(event.target.value)}
                onBlur={() => {
                  if (!searchQuery.trim()) {
                    setSearchOpen(false);
                  }
                }}
                className={cn(
                  "peer h-10 w-full rounded-md bg-input-filled-bg px-3 py-1 pl-9",
                  "text-sm text-text placeholder:text-text-secondary",
                  "transition-shadow duration-200 outline-none ring-0",
                  "hover:bg-input-filled-bg-hover focus-visible:bg-input-bg-surface-active",
                  "focus-visible:ring-0 max-lg:text-[16px]!",
                )}
              />
              <div className="pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center pl-3 text-text-secondary">
                <SearchIcon className="size-[18px]" />
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Toggle filters"
            aria-pressed={filtersOpen}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-surface"
            onClick={() => {
              if (filtersOpen) {
                setSortMenuOpen(false);
                setPeriodMenuOpen(false);
              }
              setFiltersOpen(!filtersOpen);
            }}
          >
            <div className="flex select-none items-center justify-center rounded-md p-2">
              <SlidersIcon className="size-[18px]" />
            </div>
          </button>
        </div>
      </div>

      {filtersOpen ? (
        <div className="mb-4 flex w-full items-center justify-start gap-x-2">
          <div ref={sortMenuRef} className="relative">
            <button
              className={cn(
                "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full",
                "border border-button-outline-border px-3 text-body-sm font-semibold whitespace-nowrap",
                "text-button-outline-text transition duration-150 active:scale-[97%] hover:bg-surface-2",
                "focus-visible:ring-0 focus-visible:outline-none",
              )}
              type="button"
              aria-haspopup="menu"
              aria-expanded={sortMenuOpen}
              onClick={() => setSortMenuOpen((isOpen) => !isOpen)}
            >
              <CryptoSortIcon icon={selectedSort.icon} className="size-[18px]" />
              <span>{selectedSort.label}</span>
              <ChevronDownIcon className="size-2.5" />
            </button>

            {sortMenuOpen ? (
              <div
                role="menu"
                aria-orientation="vertical"
                className={cn(
                  "absolute top-[calc(100%+6px)] left-0 z-50 flex w-44 min-w-32 flex-col",
                  "overflow-y-auto rounded-lg border border-border bg-background p-1.5",
                  "text-sm font-medium text-text shadow-lg",
                )}
              >
                {CRYPTO_SORT_FILTER_ITEMS.map((item) => {
                  const active = selectedSort.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      className={cn(
                        "relative flex cursor-pointer items-center gap-2 rounded-sm",
                        "px-2.5 py-2 pr-8 text-left text-body-base outline-none select-none",
                        "hover:bg-surface-2 focus:bg-surface-2",
                      )}
                      onClick={() => {
                        onSortSelect(item.id);
                        setSortMenuOpen(false);
                      }}
                    >
                      <span className="flex items-center gap-x-2">
                        <CryptoSortIcon icon={item.icon} className="size-[18px]" />
                        {item.label}
                      </span>
                      {active ? (
                        <span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center">
                          <span className="size-1.5 rounded-full bg-text-brand" />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div ref={periodMenuRef} className="relative">
            <button
              className={cn(
                "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full",
                "border border-button-outline-border px-3 text-body-sm font-semibold whitespace-nowrap",
                "text-button-outline-text transition duration-150 active:scale-[97%] hover:bg-surface-2",
                "focus-visible:ring-0 focus-visible:outline-none",
              )}
              type="button"
              aria-haspopup="menu"
              aria-expanded={periodMenuOpen}
              onClick={() => setPeriodMenuOpen((isOpen) => !isOpen)}
            >
              <span>{selectedPeriod.label}</span>
              <ChevronDownIcon className="size-2.5" />
            </button>

            {periodMenuOpen ? (
              <div
                role="menu"
                aria-orientation="vertical"
                className={cn(
                  "absolute top-[calc(100%+6px)] left-0 z-50 flex w-36 min-w-32 flex-col",
                  "overflow-y-auto rounded-lg border border-border bg-background p-1.5",
                  "text-sm font-medium text-text shadow-lg",
                )}
              >
                {CRYPTO_PERIOD_FILTER_ITEMS.map((item) => {
                  const active = selectedPeriod.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      className={cn(
                        "relative flex cursor-pointer items-center gap-2 rounded-sm",
                        "px-2.5 py-2 pr-8 text-left text-body-base outline-none select-none",
                        "hover:bg-surface-2 focus:bg-surface-2",
                      )}
                      onClick={() => {
                        onTopicSelect(item.id);
                        setPeriodMenuOpen(false);
                      }}
                    >
                      {item.label}
                      {active ? (
                        <span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center">
                          <span className="size-1.5 rounded-full bg-text-brand" />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

/**
 * Crypto category page with time/asset chips and market-type tabs.
 */
export function CryptoPageView() {
  const {
    events: rawEvents,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCategoryEvents("crypto");
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const bookmarks = useAtomValue(bookmarksAtom);
  const bookmarksOnly = useAtomValue(bookmarksOnlyAtom);
  const [topicId, setTopicId] = useState("all");
  const [typeId, setTypeId] = useState("all");
  const [sortId, setSortId] = useState<CryptoSortFilterId>("volume-24h");
  const [authOpen, setAuthOpen] = useState(false);
  const sort = mapCryptoSortToMarketSort(sortId);
  const status: MarketStatus = "all";

  const topicCounts = useMemo(
    () => countTopicMatches(rawEvents, CRYPTO_TOPIC_CHIPS),
    [rawEvents],
  );

  const events = useMemo(() => {
    let result = filterByTopic(rawEvents, topicId, CRYPTO_TOPIC_CHIPS);
    result = filterByMarketType(result, typeId, CRYPTO_MARKET_TYPE_TABS);
    result = filterByStatus(result, status);

    if (bookmarksOnly) {
      result = filterByBookmarks(result, bookmarks);
    }

    return sortEvents(result, sort);
  }, [rawEvents, topicId, typeId, status, bookmarksOnly, bookmarks, sort]);

  const { visibleCount, hasMore } = useShowMoreMarkets(events.length);
  const visibleEvents = useMemo(
    () => events.slice(0, visibleCount),
    [events, visibleCount],
  );

  const priceSeeds = useMemo(
    () => getVisibleOutcomeSeedsFromEvents(visibleEvents),
    [visibleEvents],
  );

  useLivePrices(priceSeeds);

  function renderBody() {
    if (isLoading) {
      return (
        <EventsGridSkeleton
          hideHeading
          gridClassName={CRYPTO_GRID_CLASSES}
          gridWrapperClassName="lg:px-0"
        />
      );
    }

    if (isError) {
      return (
        <EventsGridError
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => {
            void refetch();
          }}
        />
      );
    }

    if (events.length === 0) {
      return (
        <EventListEmpty
          message={
            searchQuery.trim()
              ? `No crypto markets found for "${searchQuery.trim()}"`
              : undefined
          }
        />
      );
    }

    return (
      <>
        {isFetching ? (
          <p className="sr-only" aria-live="polite">
            Refreshing markets
          </p>
        ) : null}

        <div className="relative flex h-auto w-full shrink-0 flex-col gap-3 pt-px pb-10 lg:px-0">
          <div className={CRYPTO_GRID_CLASSES}>
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {hasMore ? (
          <ShowMoreMarketsButton onClick={() => setAuthOpen(true)} />
        ) : null}
      </>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-[1320px] flex-col px-3 lg:flex-row lg:gap-8">
        <CryptoMobileTimeRail selectedId={topicId} onSelect={setTopicId} />

        <CryptoSidebar
          selectedId={topicId}
          topicCounts={topicCounts}
          onSelect={setTopicId}
        />

        <section className="min-h-[calc(100vh-8rem)] min-w-0 flex-1 pt-3 lg:pt-7.5">
          <CryptoHeader
            selectedTypeId={typeId}
            selectedTopicId={topicId}
            selectedSortId={sortId}
            searchQuery={searchQuery}
            onTypeSelect={setTypeId}
            onTopicSelect={setTopicId}
            onSortSelect={setSortId}
            onSearchChange={setSearchQuery}
          />
          {renderBody()}
        </section>
      </div>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode="signup"
      />
    </div>
  );
}
