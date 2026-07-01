'use client';
import { useEffect, useState } from 'react';
import { useLoaderStore } from '@/store/useLoaderStore';
import EmpireSpinner from './EmpireSpinner';

const MESSAGES = [
  'Preparing your experience...',
  'Curating luxury for you...',
  'Almost there...',
];

export default function GlobalLoader() {
  // The store handles the 300ms show-debounce; isVisible is only true when
  // a request has been in-flight longer than that threshold.
  const isVisible = useLoaderStore((s) => s.isVisible);
  const [mounted, setMounted] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  // Hydration guard — never render the overlay during SSR to avoid mismatch.
  useEffect(() => setMounted(true), []);

  // Rotate the status message while the overlay is visible.
  useEffect(() => {
    if (!isVisible) return;
    setMsgIndex(0);
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <div
      className="empire-loader-overlay"
      style={{ animation: 'loader-fade-in 0.3s ease-out forwards' }}
      aria-live="polite"
      role="status"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-6">
        <EmpireSpinner size={120} />
        <p
          key={msgIndex}
          className="font-poppins text-sm text-navy-800 font-medium tracking-wide"
          style={{ animation: 'loader-fade-in 0.4s ease-out' }}
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>
    </div>
  );
}
