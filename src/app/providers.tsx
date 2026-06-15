"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { useState, type ReactNode } from "react";
import { ThemeSync } from "@/components/theme/ThemeSync";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root client providers for React Query and Jotai.
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            retry: 2,
          },
        },
      }),
  );

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeSync />
        {children}
      </QueryClientProvider>
    </JotaiProvider>
  );
}
