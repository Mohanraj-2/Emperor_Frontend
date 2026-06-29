'use client';
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { LocalCartItem, Product } from './types';

interface CartState {
  items: LocalCartItem[];
}

type Action =
  | { type: 'ADD'; product: Product; quantity: number; size: string | null; color: string | null }
  | { type: 'REMOVE'; productId: string; size: string | null; color: string | null }
  | { type: 'UPDATE'; productId: string; size: string | null; color: string | null; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: LocalCartItem[] };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.items };
    case 'ADD': {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id && i.size === action.size && i.color === action.color
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id && i.size === action.size && i.color === action.color
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: action.quantity, size: action.size, color: action.color }] };
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => !(i.product.id === action.productId && i.size === action.size && i.color === action.color)) };
    case 'UPDATE': {
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => !(i.product.id === action.productId && i.size === action.size && i.color === action.color)) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId && i.size === action.size && i.color === action.color
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: LocalCartItem[];
  addItem: (product: Product, quantity: number, size: string | null, color: string | null) => void;
  removeItem: (productId: string, size: string | null, color: string | null) => void;
  updateQuantity: (productId: string, size: string | null, color: string | null, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('empire-cart');
      if (stored) dispatch({ type: 'HYDRATE', items: JSON.parse(stored) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('empire-cart', JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const value: CartContextValue = {
    items: state.items,
    addItem: (product, quantity, size, color) => dispatch({ type: 'ADD', product, quantity, size, color }),
    removeItem: (productId, size, color) => dispatch({ type: 'REMOVE', productId, size, color }),
    updateQuantity: (productId, size, color, quantity) => dispatch({ type: 'UPDATE', productId, size, color, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    totalItems: state.items.reduce((s, i) => s + i.quantity, 0),
    subtotal: state.items.reduce((s, i) => s + i.product.price * i.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
