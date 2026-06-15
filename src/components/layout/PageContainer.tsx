import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Centered page content wrapper — max 1350px, 24px gutters.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1350px] px-6 py-6", className)}>
      {children}
    </div>
  );
}
