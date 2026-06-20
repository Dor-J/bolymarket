"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  FOOTER_SOCIAL_ICONS,
  MOBILE_BOTTOM_NAV_HEIGHT_PX,
} from "@/lib/constants/footer";
import { breakingFilterAtom } from "@/lib/atoms/marketPage";
import { searchQueryAtom } from "@/lib/atoms/search";
import { themeAtom, toggleThemeAtom } from "@/lib/atoms/theme";
import {
  FooterSocialIconGlyph,
  MobileNavBreakingIcon,
  MobileNavHomeIcon,
  MobileNavMoreIcon,
  MobileNavSearchIcon,
} from "@/components/icons/FooterIcons";
import {
  ApisMenuIcon,
  LanguageMenuIcon,
  LeaderboardMenuIcon,
  RewardsMenuIcon,
} from "@/components/icons/UserMenuIcons";
import { cn } from "@/lib/cn";

const AuthModal = dynamic(
  () => import("@/components/ui/Modal").then((module) => module.AuthModal),
  { ssr: false },
);

interface MobileBottomNavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: (pathname: string) => boolean;
}

const MOBILE_BOTTOM_NAV_ITEMS: MobileBottomNavItem[] = [
  {
    key: "home",
    label: "Home",
    href: "/",
    icon: <MobileNavHomeIcon />,
    isActive: (pathname) => pathname === "/",
  },
  {
    key: "search",
    label: "Search",
    href: "#search",
    icon: <MobileNavSearchIcon />,
  },
  {
    key: "breaking",
    label: "Breaking",
    href: "#",
    icon: <MobileNavBreakingIcon />,
  },
  {
    key: "more",
    label: "More",
    href: "#",
    icon: <MobileNavMoreIcon />,
  },
];

const SEARCH_BROWSE_ITEMS = [
  { label: "New", href: "/?sort=newest", icon: <SearchNewIcon /> },
  { label: "Trending", href: "/", icon: <SearchTrendingIcon /> },
  { label: "Popular", href: "/?sort=volume", icon: <SearchPopularIcon /> },
  { label: "Liquid", href: "/?sort=liquidity", icon: <SearchLiquidIcon /> },
  {
    label: "Ending Soon",
    href: "/?sort=ending-soon",
    icon: <SearchEndingIcon />,
  },
  {
    label: "Competitive",
    href: "/?sort=competitive",
    icon: <SearchCompetitiveIcon />,
  },
] as const;

const SEARCH_TOPIC_ITEMS = [
  {
    label: "Live Crypto",
    href: "/crypto",
    image: "https://polymarket.com/images/nav-live-crypto.png",
  },
  {
    label: "Politics",
    href: "/politics",
    image: "https://polymarket.com/images/nav-markets-politics.png",
  },
  {
    label: "Middle East",
    href: "#",
    image: "https://polymarket.com/images/nav-markets-middle-east.png",
  },
  {
    label: "Crypto",
    href: "/crypto",
    image: "https://polymarket.com/images/nav-markets-crypto.png",
  },
  {
    label: "Sports",
    href: "/sports/live",
    image: "https://polymarket.com/images/sports/nba.png",
  },
  {
    label: "Pop Culture",
    href: "#",
    image: "https://polymarket.com/images/nav-markets-pop-culture.png",
  },
  {
    label: "Tech",
    href: "#",
    image: "https://polymarket.com/images/nav-markets-tech.png",
  },
  {
    label: "AI",
    href: "#",
    image: "https://polymarket.com/images/nav-markets-ai.png",
  },
] as const;

const MORE_PRIMARY_LINKS = [
  {
    label: "Leaderboard",
    href: "#",
    icon: <LeaderboardMenuIcon className="h-5 w-5" />,
  },
  {
    label: "Rewards",
    href: "#",
    icon: <RewardsMenuIcon className="h-5 w-5" />,
  },
  {
    label: "APIs",
    href: "/api-docs",
    icon: <ApisMenuIcon className="h-5 w-5" />,
  },
] as const;

const MORE_SECONDARY_LINKS = [
  { label: "Accuracy", href: "#" },
  { label: "Status", href: "#" },
  { label: "Documentation", href: "/api-docs" },
  { label: "Help Center", href: "#" },
  { label: "Terms of Use", href: "#" },
] as const;

type AuthMode = "login" | "signup";

function useOverlayEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);
}

function MobileSearchDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  useOverlayEscape(open, onClose);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 md:hidden">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-search-title"
        className={cn(
          "absolute inset-x-0 bottom-0 top-3.5 flex flex-col rounded-t-2xl",
          "bg-background pt-5 outline-none",
        )}
      >
        <div
          aria-hidden
          className="absolute top-3 left-1/2 h-[5px] w-[60px] -translate-x-1/2 rounded-full bg-muted"
        />
        <h2 id="mobile-search-title" className="sr-only">
          Search
        </h2>
        <div className="h-full overflow-y-auto px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
          <form
            className="relative"
            onSubmit={(event) => {
              event.preventDefault();
              onClose();
            }}
          >
            <SearchInputIcon />
            <input
              ref={inputRef}
              id="mobile-search-input"
              autoComplete="off"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search polymarkets..."
              className={cn(
                "h-10 w-full rounded-md border border-transparent bg-surface-2",
                "pr-3 pl-11 text-[16px] text-text placeholder:text-text-secondary",
                "focus-visible:ring-0 focus-visible:outline-none",
              )}
            />
          </form>

          <div className="mt-4 flex flex-col gap-4">
            <SearchSectionLabel>Browse</SearchSectionLabel>
            <div className="flex flex-wrap gap-2">
              {SEARCH_BROWSE_ITEMS.map((item) => (
                <SearchChip key={item.label} href={item.href} onClick={onClose}>
                  {item.icon}
                  <span>{item.label}</span>
                </SearchChip>
              ))}
            </div>

            <SearchSectionLabel>Topics</SearchSectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {SEARCH_TOPIC_ITEMS.map((item) => (
                <SearchTopicTile
                  key={item.label}
                  item={item}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MobileMoreDrawer({
  open,
  onClose,
  onAuthOpen,
}: {
  open: boolean;
  onClose: () => void;
  onAuthOpen: (mode: AuthMode) => void;
}) {
  const [theme] = useAtom(themeAtom);
  const [, toggleTheme] = useAtom(toggleThemeAtom);

  useOverlayEscape(open, onClose);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <button
        type="button"
        aria-label="Close more menu"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="More menu"
        className="absolute top-0 bottom-0 left-0 w-[85vw] bg-background"
      >
        <div className="flex h-full flex-col justify-end gap-[10px] p-5 pb-[84px]">
          <div className="flex flex-col gap-2.5">
            {MORE_PRIMARY_LINKS.map((item) => (
              <MoreLink key={item.label} href={item.href} onClick={onClose}>
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </MoreLink>
            ))}
          </div>

          <hr className="my-3 h-px border-0 bg-border" />

          <div className="flex flex-col gap-2 text-text-secondary">
            {MORE_SECONDARY_LINKS.map((item) => (
              <MoreTextLink key={item.label} href={item.href} onClick={onClose}>
                {item.label}
              </MoreTextLink>
            ))}

            <button
              type="button"
              className="flex h-[30px] w-full items-center justify-between text-[20px] font-medium"
            >
              <span className="inline-flex items-center gap-2">
                <LanguageMenuIcon className="h-5 w-5" />
                <span>Idioma</span>
              </span>
              <span className="text-sm text-text-tertiary">English</span>
            </button>
          </div>

          <div className="mt-4 flex w-full gap-2">
            {FOOTER_SOCIAL_ICONS.filter((icon) => icon.key !== "email").map(
              (icon) => (
                <a
                  key={icon.key}
                  href={icon.href}
                  aria-label={icon.label}
                  onClick={(event) => {
                    if (icon.href === "#") {
                      event.preventDefault();
                    }
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-sm text-text"
                >
                  <FooterSocialIconGlyph icon={icon.key} className="h-5 w-5" />
                </a>
              ),
            )}
            <button
              type="button"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="flex h-9 w-9 items-center justify-center rounded-sm text-text"
              onClick={() => toggleTheme()}
            >
              <MoonIcon filled={theme === "dark"} />
            </button>
          </div>

          <div className="mt-4 flex w-full flex-col gap-2">
            <button
              type="button"
              className="h-9 rounded-sm border border-button-outline-border text-base font-semibold text-button-outline-text"
              onClick={() => {
                onClose();
                onAuthOpen("login");
              }}
            >
              Log In
            </button>
            <button
              type="button"
              className="h-9 rounded-sm bg-button-primary-bg text-base font-semibold text-button-primary-text"
              onClick={() => {
                onClose();
                onAuthOpen("signup");
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/**
 * Fixed mobile bottom navigation — mirrors polymarket.com footer chrome.
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const setBreakingFilter = useSetAtom(breakingFilterAtom);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  return (
    <>
      <MobileSearchDrawer
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
      <MobileMoreDrawer
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        onAuthOpen={setAuthMode}
      />
      {authMode ? (
        <AuthModal
          open={authMode !== null}
          onClose={() => setAuthMode(null)}
          mode={authMode}
        />
      ) : null}

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface md:hidden"
        style={{ height: MOBILE_BOTTOM_NAV_HEIGHT_PX }}
      >
        <div className="mx-auto flex h-full max-w-[1350px] items-stretch px-2">
          {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
            const active =
              item.isActive?.(pathname) ??
              (item.key === "search" && searchOpen) ??
              (item.key === "more" && moreOpen);

            const className = cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5",
              "text-[10px] leading-3 font-medium",
              active ? "text-text" : "text-neutral-500",
            );

            if (item.href.startsWith("/")) {
              return (
                <Link key={item.key} href={item.href} className={className}>
                  {item.icon}
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                className={className}
                aria-pressed={active}
                onClick={(event) => {
                  if (item.key === "search") {
                    event.preventDefault();
                    setMoreOpen(false);
                    setSearchOpen(true);
                    return;
                  }

                  if (item.key === "breaking") {
                    event.preventDefault();
                    setSearchOpen(false);
                    setMoreOpen(false);
                    setBreakingFilter(true);
                    if (pathname !== "/") {
                      router.push("/");
                    }
                    return;
                  }

                  if (item.key === "more") {
                    event.preventDefault();
                    setSearchOpen(false);
                    setMoreOpen(true);
                    return;
                  }

                  event.preventDefault();
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function SearchSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-medium tracking-wider text-text-secondary uppercase">
      {children}
    </p>
  );
}

function SearchChip({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-border py-1.5 pr-3 pl-2.5 text-sm font-medium text-text hover:bg-surface"
    >
      {children}
    </Link>
  );
}

function SearchTopicTile({
  item,
  onClick,
}: {
  item: (typeof SEARCH_TOPIC_ITEMS)[number];
  onClick: () => void;
}) {
  const content = (
    <div className="flex min-w-0 items-center gap-x-2 rounded-lg border border-border p-2 hover:bg-surface">
      <div className="size-8 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2">
        <img src={item.image} alt="" className="h-full w-full object-cover" />
      </div>
      <p className="min-w-0 truncate text-sm font-medium text-text">
        {item.label}
      </p>
    </div>
  );

  if (item.href === "#") {
    return (
      <a
        href="#"
        onClick={(event) => {
          event.preventDefault();
          onClick();
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={onClick}>
      {content}
    </Link>
  );
}

function MoreLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: ReactNode;
}) {
  const className =
    "flex h-[30px] items-center text-[20px] font-medium text-text";

  if (href.startsWith("/")) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href="#"
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={className}
    >
      {children}
    </a>
  );
}

function MoreTextLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <MoreLink href={href} onClick={onClick}>
      {children}
    </MoreLink>
  );
}

function SearchInputIcon() {
  return (
    <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
      >
        <path
          d="M15.75 15.75 11.6386 11.6386"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M7.75 13.25C10.7875 13.25 13.25 10.7875 13.25 7.75C13.25 4.7125 10.7875 2.25 7.75 2.25C4.7125 2.25 2.25 4.7125 2.25 7.75C2.25 10.7875 4.7125 13.25 7.75 13.25Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function SearchNewIcon() {
  return (
    <TinyIcon path="m3.5 3.6-1.7 4.6 4.9-.8L3.5 3.6Zm10-1.1a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5Zm.7 10a5.9 5.9 0 0 0-2.7 3.8 5.9 5.9 0 0 0-3.8-2.7 5.9 5.9 0 0 0 2.7-3.8 5.9 5.9 0 0 0 3.8 2.7Z" />
  );
}

function SearchTrendingIcon() {
  return (
    <TinyIcon path="M1.75 12.25 5.4 8.6a.5.5 0 0 1 .7 0l3.3 3.3a.5.5 0 0 0 .7 0l6.15-6.15M11.25 5.75h5v5" />
  );
}

function SearchPopularIcon() {
  return (
    <TinyIcon path="M7 16.25c-.3-2.75 1.8-2.1 1.85-4.5 1.6.85 2.25 3 2.2 4.45M11 16.2c3.9-1.5 4.7-5.8 2-9.85M10.5 7.35S11.2 3.6 8.5 1.75C8.1 6.1 3.4 6.25 3.4 11c0 2.1 1.1 4.4 3.6 5.25" />
  );
}

function SearchLiquidIcon() {
  return (
    <TinyIcon path="M9 16.25c3 0 5.5-2.45 5.5-5.5 0-4.2-3.1-6-5.5-9-2.4 3-5.5 4.8-5.5 9 0 3.05 2.5 5.5 5.5 5.5Zm0-3c-1.4 0-2.5-1.1-2.5-2.5" />
  );
}

function SearchEndingIcon() {
  return (
    <TinyIcon path="M9 4.75V9l3.25 2.25M9 1.75a7.25 7.25 0 1 1-5.1 12.4M1.75 9h.01M3.9 3.9h.01M3.9 14.1h.01" />
  );
}

function SearchCompetitiveIcon() {
  return (
    <TinyIcon path="M13.25 13.25v2a1 1 0 0 1-1 1h-5.5a1 1 0 0 1-1-1v-2M12.25 5.75c0 1.1-.9 2-2 2H7.6M4 6.75A2 2 0 0 1 3.75 5.75v-.5a3 3 0 0 1 3-3h5.5a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3v-1.5a2 2 0 0 1 2-2H6a1.75 1.75 0 0 1 0 3.5h-.75" />
  );
}

function TinyIcon({ path }: { path: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className="h-[18px] w-[18px] shrink-0"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MoonIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden
      className="h-6 w-6"
    >
      <path
        d="M16.7 10.2c-.25-.18-.58-.2-.84-.04-.87.53-1.86.81-2.86.81-3.03 0-5.5-2.47-5.5-5.5 0-1.15.35-2.25 1.02-3.19.18-.25.19-.58.02-.84-.16-.26-.47-.39-.77-.33C4 1.85 1.25 5.15 1.25 9c0 4.41 3.59 8 8 8 3.64 0 6.82-2.46 7.74-5.99.08-.3-.03-.61-.29-.81Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
