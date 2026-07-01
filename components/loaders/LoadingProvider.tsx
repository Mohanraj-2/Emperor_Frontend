'use client';
import GlobalLoader from './GlobalLoader';
import NavigationEvents from './NavigationEvents';

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationEvents />
      <GlobalLoader />
      {children}
    </>
  );
}
