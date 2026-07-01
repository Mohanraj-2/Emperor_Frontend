'use client';
import { create } from 'zustand';

// Loader only appears if a request takes longer than SHOW_DELAY ms.
// This prevents flicker on fast loads and avoids blocking the UI on quick ones.
const SHOW_DELAY = 300;

interface LoaderState {
  // Whether the branded overlay is currently painted on screen.
  isVisible: boolean;
  // Whether at least one request is currently in-flight (raw, pre-debounce).
  isPending: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

let activeCount = 0;
let showTimer: ReturnType<typeof setTimeout> | null = null;

function clearShowTimer() {
  if (showTimer !== null) {
    clearTimeout(showTimer);
    showTimer = null;
  }
}

export const useLoaderStore = create<LoaderState>((set, get) => ({
  isVisible: false,
  isPending: false,

  start: () => {
    activeCount += 1;
    // Mark pending immediately so callers know work is happening,
    // but do NOT paint the overlay yet — wait for the debounce window.
    set({ isPending: true });
    if (showTimer === null) {
      showTimer = setTimeout(() => {
        showTimer = null;
        // Only paint if there is still pending work when the timer fires.
        if (activeCount > 0) {
          set({ isVisible: true });
        }
      }, SHOW_DELAY);
    }
  },

  stop: () => {
    activeCount = Math.max(0, activeCount - 1);
    if (activeCount > 0) return;
    // All requests finished — cancel any pending show timer and hide immediately.
    clearShowTimer();
    activeCount = 0;
    set({ isVisible: false, isPending: false });
  },

  reset: () => {
    clearShowTimer();
    activeCount = 0;
    set({ isVisible: false, isPending: false });
  },
}));

// Promise interceptor — wraps any promise (Supabase query, fetch, etc.) with the global loader.
// The 300ms debounce is handled inside start()/stop(), so fast requests never paint the overlay.
export function withLoader<T>(promise: Promise<T>): Promise<T> {
  const { start, stop } = useLoaderStore.getState();
  start();
  return promise.finally(() => stop());
}
