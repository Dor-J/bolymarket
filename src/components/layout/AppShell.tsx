import type { ReactNode } from "react";
import { RouteProgress } from "@/components/navigation/RouteProgress";
import { CategoryNav } from "./CategoryNav";
import { TopBar } from "./TopBar";

export interface AppShellProps {
  children: ReactNode;
}

/**
 * Frozen application chrome — sticky top bar + category nav.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <RouteProgress />
      <TopBar />
      <CategoryNav />
      <main className="flex-1">{children}</main>
    </>
  );
}
