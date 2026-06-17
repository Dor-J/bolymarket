'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { RouteProgress } from '@/components/navigation/RouteProgress';
import { BackToTopButton } from './BackToTopButton';
import { Footer } from './Footer';
import { CategoryNav } from './CategoryNav';
import { CategoryPathSync } from './CategoryPathSync';
import { MobileBottomNav } from './MobileBottomNav';
import { TopBar } from './TopBar';
import { MarketSearchToolbar } from './MarketSearchToolbar';

export interface AppShellProps {
  children: ReactNode;
}

const DOCS_PATH_PREFIX = '/api-docs';

/**
 * Frozen application chrome — sticky top bar + category nav.
 * Skips chrome on `/api-docs` for a dedicated Swagger UI experience.
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isApiDocs = pathname.startsWith(DOCS_PATH_PREFIX);

  if (isApiDocs) {
    return <>{children}</>;
  }

  return (
    <>
      <RouteProgress />
      <CategoryPathSync />
      <TopBar />
      <CategoryNav />
      <MarketSearchToolbar />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <BackToTopButton />
      <MobileBottomNav />
    </>
  );
}
