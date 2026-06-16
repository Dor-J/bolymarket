'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOBILE_BOTTOM_NAV_HEIGHT_PX } from '@/lib/constants/footer';
import {
  MobileNavBreakingIcon,
  MobileNavHomeIcon,
  MobileNavMoreIcon,
  MobileNavSearchIcon,
} from '@/components/icons/FooterIcons';
import { cn } from '@/lib/cn';

interface MobileBottomNavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: (pathname: string) => boolean;
}

const MOBILE_BOTTOM_NAV_ITEMS: MobileBottomNavItem[] = [
  {
    key: 'home',
    label: 'Home',
    href: '/',
    icon: <MobileNavHomeIcon />,
    isActive: (pathname) => pathname === '/',
  },
  {
    key: 'search',
    label: 'Search',
    href: '#search',
    icon: <MobileNavSearchIcon />,
  },
  {
    key: 'breaking',
    label: 'Breaking',
    href: '#',
    icon: <MobileNavBreakingIcon />,
  },
  {
    key: 'more',
    label: 'More',
    href: '#',
    icon: <MobileNavMoreIcon />,
  },
];

/**
 * Fixed mobile bottom navigation — mirrors polymarket.com footer chrome.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface md:hidden"
      style={{ height: MOBILE_BOTTOM_NAV_HEIGHT_PX }}
    >
      <div className="mx-auto flex h-full max-w-[1350px] items-stretch px-2">
        {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
          const active = item.isActive?.(pathname) ?? false;

          const className = cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5',
            'text-[10px] leading-3 font-medium',
            active ? 'text-text' : 'text-[#77808d]',
          );

          if (item.href.startsWith('/')) {
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
              onClick={(event) => {
                if (item.key === 'search') {
                  event.preventDefault();
                  const input = document.querySelector<HTMLInputElement>(
                    'input[placeholder="Search"], input[placeholder="Search polymarkets..."]',
                  );
                  input?.focus();
                  input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  );
}
