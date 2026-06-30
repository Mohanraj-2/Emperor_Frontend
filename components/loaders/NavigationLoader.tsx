'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoadingStore } from '@/store/useLoadingStore';

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams, setLoading]);

  return null;
}
