'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoaderStore } from '@/store/useLoaderStore';

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const start = useLoaderStore((s) => s.start);
  const stop = useLoaderStore((s) => s.stop);

  useEffect(() => {
    start(500);
    const t = setTimeout(() => stop(), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
