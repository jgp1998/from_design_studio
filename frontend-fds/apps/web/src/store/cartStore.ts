import { create } from 'zustand';
import type { CartItem } from '../types';

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  addToCart: (item) => set((state) => ({ cartItems: [...state.cartItems, item] })),
  removeFromCart: (itemId) => set((state) => ({ 
    cartItems: state.cartItems.filter(item => item.id !== itemId) 
  })),
  clearCart: () => set({ cartItems: [] }),
}));
