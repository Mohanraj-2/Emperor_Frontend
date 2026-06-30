'use client';

import { Crown } from 'lucide-react';

interface PageLoaderProps {
  text?: string;
  fullScreen?: boolean;
}

export default function PageLoader({ text, fullScreen = false }: PageLoaderProps) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[400px]'}`}>
      <div className="flex flex-col items-center">
        {/* Animated Logo */}
        <div className="page-loader">
          <div className="loader-circle">
            <div className="loader-circle-inner">
              <Crown className="w-6 h-6 text-pink-400" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="mt-4 font-poppins text-gray-500 text-sm">
          {text || 'Loading...'}
        </p>
      </div>
    </div>
  );
}
