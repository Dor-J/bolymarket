import type { ReactNode } from 'react';

export interface ApiDocsLayoutProps {
  children: ReactNode;
}

/**
 * Minimal layout for API docs — no app chrome (nav, footer).
 */
export default function ApiDocsLayout({ children }: ApiDocsLayoutProps) {
  return children;
}
