import EmpireSpinner from '@/components/loaders/EmpireSpinner';

// Next.js Suspense fallback for lazy-loaded page imports and route transitions.
// Rendered inline (not fixed) so it occupies the page body without blocking
// the rest of the layout, and resolves automatically when the page resolves.
export default function Loading() {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-white"
      aria-live="polite"
      role="status"
    >
      <div className="flex flex-col items-center gap-6">
        <EmpireSpinner size={120} />
        <p className="font-poppins text-sm text-navy-800 font-medium tracking-wide">
          Preparing your experience...
        </p>
      </div>
    </div>
  );
}
