'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoaderStore } from '@/store/useLoaderStore';

// Triggers the global loader on client-side route changes only.
// The initial mount is intentionally ignored so the first page (e.g. Home)
// renders immediately without a blocking overlay.
export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const start = useLoaderStore((s) => s.start);
  const stop = useLoaderStore((s) => s.stop);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    start();
    // Hide as soon as the new route's render commits. The store's own
    // 300ms debounce means this never paints for fast navigations.
    const t = setTimeout(() => stop(), 0);
    return () => clearTimeout(t);
  }, [pathname, searchParams, start, stop]);

  return null;
}
