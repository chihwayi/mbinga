"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant, getVariantPrice } from "@/types";
import type { Currency } from "@/context/CurrencyContext";

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  isCartLoaded: boolean;
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getCartTotal: (currency: Currency) => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("mbinga-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Carts saved before variants existed won't have item.variant — drop
        // those rather than letting a stale shape crash the UI.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(Array.isArray(parsed) ? parsed.filter((i) => i?.variant?.id) : []);
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("mbinga-cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    if (quantity > variant.stock) {
      alert(`Sorry, only ${variant.stock} items left in stock.`);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.variant.id === variant.id);

      if (existingItem) {
        if (existingItem.quantity + quantity > variant.stock) {
          alert(`Sorry, you can't add more. Max stock reached.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, variant, quantity }];
      }
    });

    // Automatically open cart when adding an item
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.variant.id === variantId);
      if (!item) return prevCart;

      if (quantity <= 0) {
        return prevCart.filter((i) => i.variant.id !== variantId);
      }

      if (quantity > item.variant.stock) {
        alert(`Sorry, only ${item.variant.stock} items left in stock.`);
        return prevCart;
      }

      return prevCart.map((item) =>
        item.variant.id === variantId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = (currency: Currency) => {
    return cart.reduce((total, item) => total + getVariantPrice(item.variant, currency) * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        isCartLoaded: isInitialized,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
