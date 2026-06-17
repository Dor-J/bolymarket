'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true after the component has mounted on the client.
 * Use to defer client-only UI and avoid SSR hydration mismatches.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
