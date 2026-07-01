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
  const isLoading = useLoaderStore((s) => s.isLoading);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  // Mount guard — only render after hydration to avoid SSR/CSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle fade in / fade out transitions
  useEffect(() => {
    if (isLoading) {
      setFadingOut(false);
      setVisible(true);
    } else if (visible) {
      setFadingOut(true);
      const t = setTimeout(() => {
        setVisible(false);
        setFadingOut(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isLoading, visible]);

  // Rotate messages while loading
  useEffect(() => {
    if (!visible) return;
    setMsgIndex(0);
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [visible]);

  if (!mounted || !visible) return null;

  return (
    <div
      className={`empire-loader-overlay ${
        fadingOut ? 'empire-loader-hidden' : ''
      }`}
      style={{
        animation: fadingOut
          ? 'loader-fade-out 0.3s ease-out forwards'
          : 'loader-fade-in 0.3s ease-out forwards',
      }}
      aria-live="polite"
      role="status"
      aria-busy={isLoading}
    >
      <div className="flex flex-col items-center gap-6">
        <EmpireSpinner size={120} />
        <p
          className="font-poppins text-sm text-navy-800 font-medium tracking-wide transition-opacity duration-300"
          key={msgIndex}
          style={{ animation: 'loader-fade-in 0.4s ease-out' }}
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>
    </div>
  );
}
