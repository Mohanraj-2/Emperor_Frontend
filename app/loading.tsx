import EmpireSpinner from '@/components/loaders/EmpireSpinner';

export default function Loading() {
  return (
    <div className="empire-loader-overlay" aria-live="polite" role="status">
      <div className="flex flex-col items-center gap-6">
        <EmpireSpinner size={120} />
        <p className="font-poppins text-sm text-navy-800 font-medium tracking-wide">
          Preparing your experience...
        </p>
      </div>
    </div>
  );
}
