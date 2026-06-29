'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/lib/types';

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  count: () => number;
}

const safeStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(name);
  },
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some((i) => i.id === product.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== product.id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },
      isWishlisted: (productId) => get().items.some((i) => i.id === productId),
      count: () => get().items.length,
    }),
    {
      name: 'empire-wishlist',
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
    }
  )
);
