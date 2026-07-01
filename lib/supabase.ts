import { createClient } from '@supabase/supabase-js';
import { useLoaderStore } from '@/store/useLoaderStore';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Fetch interceptor: wraps every Supabase HTTP request with the global loader.
// The store applies a 300ms show-debounce, so fast requests (auth session refresh,
// realtime heartbeat, etc.) never paint the overlay.
const loaderFetch: typeof fetch = (input, init) => {
  if (typeof window === 'undefined') {
    return fetch(input as RequestInfo, init);
  }
  const { start, stop } = useLoaderStore.getState();
  start();
  return fetch(input as RequestInfo, init).finally(() => stop());
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: loaderFetch },
});
