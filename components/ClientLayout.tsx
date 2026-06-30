'use client';

import { LoadingProvider } from '@/components/loaders';
import StoreHydration from '@/components/StoreHydration';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <StoreHydration />
      {children}
    </LoadingProvider>
  );
}
