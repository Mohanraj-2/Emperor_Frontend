'use client';
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from './types';

interface WishlistState {
  items: Product[];
}

type Action =
  | { type: 'TOGGLE'; product: Product }
  | { type: 'HYDRATE'; items: Product[] };

function reducer(state: WishlistState, action: Action): WishlistState {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.items };
    case 'TOGGLE': {
      const exists = state.items.some((i) => i.id === action.product.id);
      return {
        items: exists
          ? state.items.filter((i) => i.id !== action.product.id)
          : [...state.items, action.product],
      };
    }
    default:
      return state;
  }
}

interface WishlistContextValue {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('empire-wishlist');
      if (stored) dispatch({ type: 'HYDRATE', items: JSON.parse(stored) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('empire-wishlist', JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const value: WishlistContextValue = {
    items: state.items,
    toggle: (product) => dispatch({ type: 'TOGGLE', product }),
    isWishlisted: (productId) => state.items.some((i) => i.id === productId),
    count: state.items.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
