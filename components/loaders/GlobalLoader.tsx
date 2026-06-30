'use client';

import { useEffect, useState } from 'react';
import { useLoadingStore } from '@/store/useLoadingStore';
import { Crown } from 'lucide-react';

export default function GlobalLoader() {
  const { isLoading, loadingText } = useLoadingStore();
  const [visible, setVisible] = useState(false);
  const [minDelayPassed, setMinDelayPassed] = useState(false);

  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (isLoading) {
      // Minimum 300ms delay to avoid flashing
      showTimer = setTimeout(() => {
        setVisible(true);
        setMinDelayPassed(true);
      }, 300);
    } else {
      if (minDelayPassed) {
        // Keep visible for at least 500ms for smooth exit
        hideTimer = setTimeout(() => {
          setVisible(false);
          setMinDelayPassed(false);
        }, 200);
      } else {
        setVisible(false);
      }
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isLoading, minDelayPassed]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300">
      {/* Semi-transparent white background */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />

      {/* Loader content */}
      <div className="relative flex flex-col items-center z-10">
        {/* Animated Logo */}
        <div className="empire-loader">
          <div className="loader-ring">
            <div className="loader-ring-inner">
              <div className="loader-icon">
                <Crown className="w-10 h-10 text-pink-400" />
              </div>
            </div>
          </div>
          <div className="loader-dots">
            <span className="dot dot-1" />
            <span className="dot dot-2" />
            <span className="dot dot-3" />
          </div>
        </div>

        {/* Brand Text */}
        <div className="mt-8 text-center">
          <div className="flex items-center gap-2 justify-center">
            <span className="font-playfair text-2xl font-bold text-navy-800">EMPIRE</span>
          </div>
          <p className="font-poppins text-sm text-gray-500 tracking-widest uppercase mt-1">
            Lifestyle
          </p>
        </div>

        {/* Loading Text */}
        <p className="mt-6 font-poppins text-gray-600 text-sm animate-pulse">
          {loadingText}
        </p>
      </div>
    </div>
  );
}
