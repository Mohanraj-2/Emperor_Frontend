import { createClient } from '@supabase/supabase-js';
import { useLoaderStore } from '@/store/useLoaderStore';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Fetch interceptor: wraps every Supabase HTTP request with the global loader.
const loaderFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof window !== 'undefined') {
    const { start, stop } = useLoaderStore.getState();
    start(500);
    return fetch(input as RequestInfo, init).finally(() => stop());
  }
  return fetch(input as RequestInfo, init);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: loaderFetch as typeof fetch },
});
