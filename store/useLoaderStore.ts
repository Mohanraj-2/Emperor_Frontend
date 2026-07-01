'use client';
import { create } from 'zustand';

interface LoaderState {
  isLoading: boolean;
  start: (minMs?: number) => void;
  stop: () => void;
  reset: () => void;
}

let activeCount = 0;
let minUntil = 0;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function clearHideTimer() {
  if (hideTimer !== null) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

export const useLoaderStore = create<LoaderState>((set) => ({
  isLoading: false,
  start: (minMs = 500) => {
    activeCount += 1;
    minUntil = Math.max(minUntil, Date.now() + minMs);
    clearHideTimer();
    set({ isLoading: true });
  },
  stop: () => {
    activeCount = Math.max(0, activeCount - 1);
    if (activeCount > 0) return;
    const remaining = minUntil - Date.now();
    if (remaining > 0) {
      clearHideTimer();
      hideTimer = setTimeout(() => {
        hideTimer = null;
        activeCount = 0;
        minUntil = 0;
        set({ isLoading: false });
      }, remaining);
    } else {
      clearHideTimer();
      activeCount = 0;
      minUntil = 0;
      set({ isLoading: false });
    }
  },
  reset: () => {
    clearHideTimer();
    activeCount = 0;
    minUntil = 0;
    set({ isLoading: false });
  },
}));

// Promise interceptor — wraps any promise (Supabase query, fetch, etc.) with the global loader.
export function withLoader<T>(promise: Promise<T>, minMs = 500): Promise<T> {
  const { start, stop } = useLoaderStore.getState();
  start(minMs);
  return promise.finally(() => stop());
}
