"use client";

import { Bookmark, Search } from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import {
  bookmarksOnlyAtom,
  marketFiltersVisibleAtom,
} from "@/lib/atoms/marketPage";
import { searchQueryAtom } from "@/lib/atoms/search";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";
import { toggleAriaPressed } from "@/lib/a11y/toggleAriaPressed";
import { cn } from "@/lib/cn";

/**
 * Compact content-level search toolbar shown when the header search is hidden.
 * Mirrors Polymarket's search/filter/bookmark row under the category nav.
 */
export function MarketSearchToolbar() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const setBookmarksOnly = useSetAtom(bookmarksOnlyAtom);
  const [filtersVisible, setFiltersVisible] = useAtom(marketFiltersVisibleAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDesktopToolbarHidden, setIsDesktopToolbarHidden] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    function handleChange() {
      setIsDesktopToolbarHidden(mq.matches);
    }

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // Only enable '/' shortcut when this toolbar is visible.
  useSearchShortcut(inputRef, !isDesktopToolbarHidden);

  return (
    <div className="border-b border-border bg-surface lg:hidden">
      <div className="mx-auto flex max-w-[1350px] items-center gap-2 px-4 py-2 md:px-4">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500"
          />
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            aria-label="Search polymarkets"
            placeholder="Search polymarkets..."
            className={cn(
              "h-9 w-full rounded-[9px] bg-surface-2 pr-10 pl-10",
              "text-sm leading-5 text-text placeholder:text-neutral-500",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            label="Toggle filters"
            aria-pressed={toggleAriaPressed(filtersVisible)}
            className={cn(
              "size-10 rounded-md",
              filtersVisible && "border border-text bg-surface",
            )}
            onClick={() => {
              setFiltersVisible((current) => {
                const next = !current;
                if (next) {
                  document.getElementById("market-filters")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
                return next;
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <title>sliders</title>
              <g fill="currentColor">
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  x1="13.25"
                  y1="5.25"
                  y2="5.25"
                  x2="16.25"
                />
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  x1="1.75"
                  y1="5.25"
                  y2="5.25"
                  x2="8.75"
                />
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  x1="4.75"
                  x2="1.75"
                  y1="12.75"
                  y2="12.75"
                />
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  x1="16.25"
                  y1="12.75"
                  y2="12.75"
                  x2="9.25"
                />
                <circle
                  cy="5.25"
                  fill="none"
                  r="2.25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  cx="11"
                />
                <circle
                  cy="12.75"
                  fill="none"
                  r="2.25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  cx="7"
                />
              </g>
            </svg>
          </IconButton>
          <IconButton
            label="Bookmark markets"
            className="size-10 rounded-md"
            onClick={() => {
              setBookmarksOnly((current) => !current);
            }}
          >
            <Bookmark className="h-4 w-4 text-neutral-500" aria-hidden />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
