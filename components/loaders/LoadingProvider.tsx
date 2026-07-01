'use client';
import { Suspense } from 'react';
import GlobalLoader from './GlobalLoader';
import NavigationEvents from './NavigationEvents';

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>
      <GlobalLoader />
      {children}
    </>
  );
}
