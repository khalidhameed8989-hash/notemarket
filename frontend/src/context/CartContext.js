import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: '0.00' });
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await api.get('/cart');
      setCart(res.data);
      setCartCount(res.data.items.length);
    } catch (err) {
      console.error('Failed to fetch cart');
    }
  };

  useEffect(() => {
    if (user) fetchCart();
    else { setCart({ items: [], total: '0.00' }); setCartCount(0); }
  }, [user]);

  const addToCart = async (productId) => {
    await api.post('/cart', { product_id: productId });
    await fetchCart();
  };

  const removeFromCart = async (productId) => {
    await api.delete(`/cart/${productId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart({ items: [], total: '0.00' });
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
