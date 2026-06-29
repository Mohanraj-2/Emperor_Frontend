'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LocalCartItem, Product } from '@/lib/types';

interface CartState {
  items: LocalCartItem[];
  addItem: (product: Product, quantity: number, size: string | null, color: string | null) => void;
  removeItem: (productId: string, size: string | null, color: string | null) => void;
  updateQuantity: (productId: string, size: string | null, color: string | null, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, size, color) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.product.id === product.id && i.size === size && i.color === color
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity, size, color }] });
        }
      },
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.product.id === productId && i.size === size && i.color === color)
          ),
        });
      },
      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'empire-cart',
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
    }
  )
);
