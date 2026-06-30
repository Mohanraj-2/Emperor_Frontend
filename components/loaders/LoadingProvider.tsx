'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoadingStore } from '@/store/useLoadingStore';
import GlobalLoader from './GlobalLoader';

interface LoadingProviderProps {
  children: React.ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setLoading } = useLoadingStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setIsInitialLoad(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation changes
  useEffect(() => {
    if (!isInitialLoad) {
      setLoading(false);
    }
  }, [pathname, searchParams, setLoading, isInitialLoad]);

  // Show loader on link click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor) {
        const href = anchor.getAttribute('href');
        const isExternal = anchor.target === '_blank' || href?.startsWith('http');
        const isSamePage = href === pathname || href?.startsWith('#');
        const isAdminLink = href?.startsWith('/admin');

        if (href && !isExternal && !isSamePage && !isAdminLink) {
          // Check if it's a local navigation
          if (href.startsWith('/') || href.startsWith('?')) {
            setLoading(true, 'Preparing Your Store...');

            // Safety timeout to hide loader if navigation takes too long
            setTimeout(() => setLoading(false), 5000);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname, setLoading]);

  return (
    <>
      <GlobalLoader />
      {children}
    </>
  );
}
