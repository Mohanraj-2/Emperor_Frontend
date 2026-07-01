'use client';
import EmpireSpinner from './EmpireSpinner';

interface Props {
  message?: string;
  fullHeight?: boolean;
}

export default function PageLoader({
  message = 'Preparing your experience...',
  fullHeight = true,
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 w-full ${
        fullHeight ? 'min-h-[60vh]' : 'py-20'
      }`}
    >
      <EmpireSpinner size={100} showDots={false} />
      <p className="font-poppins text-sm text-navy-800 font-medium tracking-wide">
        {message}
      </p>
    </div>
  );
}
