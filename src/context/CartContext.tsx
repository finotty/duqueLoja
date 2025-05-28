"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartProduct {
  image: string;
  name: string;
  price: string;
  quantity: number;
}

interface CartContextType {
  cart: CartProduct[];
  addToCart: (product: CartProduct) => void;
  handleQty: (idx: number, delta: number) => void;
  removeFromCart: (idx: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) setCart(JSON.parse(cartData));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartProduct) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.name === product.name);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleQty = (idx: number, delta: number) => {
    setCart(prev => {
      const updated = prev.map((item, i) => {
        if (i === idx) {
          return {
            ...item,
            quantity: Math.max(1, item.quantity + delta)
          };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, handleQty, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}; 