'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartItem, Product, Variant } from '@/lib/types';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variant: Variant, quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id:string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_STATE'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
}>({
  state: { items: [] },
  dispatch: () => null,
  totalItems: 0,
  totalPrice: 0,
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === variant.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === variant.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      const newItem: CartItem = {
        id: variant.id,
        productId: product.id,
        name: product.name,
        size: variant.size,
        price: variant.price,
        quantity: quantity,
      };
      return {
        ...state,
        items: [...state.items, newItem],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id)
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('aquaorder_cart');
      if (storedCart) {
        dispatch({ type: 'SET_STATE', payload: JSON.parse(storedCart) });
      }
    } catch (error) {
      console.error("Could not load cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('aquaorder_cart', JSON.stringify(state));
    } catch (error) {
      console.error("Could not save cart to localStorage", error);
    }
  }, [state]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ state, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};