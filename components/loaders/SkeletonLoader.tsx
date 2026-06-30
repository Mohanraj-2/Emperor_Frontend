'use client';

import { cn } from '@/lib/utils';

type SkeletonVariant = 'text' | 'card' | 'circle' | 'rect' | 'product';
type LoaderVariant = SkeletonVariant | 'kpi';

interface SkeletonLoaderProps {
  className?: string;
  variant?: LoaderVariant;
  count?: number;
}

interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variants: Record<SkeletonVariant, string> = {
    text: 'h-4 w-full rounded',
    card: 'h-48 w-full rounded-2xl',
    circle: 'h-12 w-12 rounded-full',
    rect: 'h-24 w-full rounded-xl',
    product: 'aspect-[3/4] w-full rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
        variants[variant],
        className
      )}
    />
  );
}

export default function SkeletonLoader({ variant = 'text', count = 1, className }: SkeletonLoaderProps) {
  if (variant === 'product') {
    return (
      <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton variant="product" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow-md">
            <Skeleton variant="rect" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'kpi') {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton variant="circle" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="text" />
      ))}
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return <SkeletonLoader variant="product" count={count} />;
}

export function KPISkeletonGrid({ count = 5 }: { count?: number }) {
  return <SkeletonLoader variant="kpi" count={count} />;
}
