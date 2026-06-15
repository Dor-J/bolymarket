"use client";

import { Info, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";

/**
 * Sticky top navigation bar — logo, search, auth actions.
 */
export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-[1350px] items-center gap-3 px-6">
        <Logo className="shrink-0" />

        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            readOnly
            aria-label="Search polymarkets"
            placeholder="Search polymarkets…"
            className={cn(
              "h-10 w-full rounded-md bg-surface-2 pr-10 pl-11",
              "text-sm leading-5 text-text placeholder:text-muted",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            )}
          />
          <kbd
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-muted sm:inline"
          >
            /
          </kbd>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            variant="ghost-brand"
            className="hidden px-3 md:inline-flex"
            aria-label="How it works"
          >
            <Info className="mr-1.5 h-4 w-4" aria-hidden />
            How it works
          </Button>

          <Button variant="ghost-brand" className="hidden sm:inline-flex">
            Log In
          </Button>
          <Button variant="brand">Sign Up</Button>

          <IconButton label="Open menu" className="lg:hidden">
            <Menu className="h-5 w-5" aria-hidden />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
