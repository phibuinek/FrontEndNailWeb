'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState(null);

  // Helper to get the storage key based on current user
  const getCartKey = (user) => `nail_cart_${user || 'guest'}`;

  // 1. Handle Auth Changes & Initial Load
  useEffect(() => {
    const updateAuth = () => {
        const user = localStorage.getItem('username');
        setUsername(user);
    };
    
    // Initial check
    updateAuth();
    setMounted(true);

    // Listen for login/logout
    window.addEventListener('auth-change', updateAuth);
    return () => window.removeEventListener('auth-change', updateAuth);
  }, []);

  // 2. Load Cart when Username Changes (or on Mount)
  useEffect(() => {
    if (!mounted) return;

    const key = getCartKey(username);
    const savedCart = localStorage.getItem(key);
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
        setCart([]);
      }
    } else {
      setCart([]); // Reset if no cart exists for this user
    }
  }, [username, mounted]);

  // 3. Save Cart when Cart Changes
  useEffect(() => {
    if (!mounted) return;
    
    const key = getCartKey(username);
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, username, mounted]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
