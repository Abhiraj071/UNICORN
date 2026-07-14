import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [animateCart, setAnimateCart] = useState(false);

  // Sync and load cart when auth state changes
  useEffect(() => {
    const guestKey = 'unicorn_cart';

    if (authLoading) return;

    if (user) {
      // User logged in: Load user cart and merge guest cart if it exists
      const userKey = `unicorn_cart_${user._id}`;
      const storedUserCart = localStorage.getItem(userKey);
      let userCart = storedUserCart ? JSON.parse(storedUserCart) : [];

      const storedGuestCart = localStorage.getItem(guestKey);
      const guestCart = storedGuestCart ? JSON.parse(storedGuestCart) : [];

      if (guestCart.length > 0) {
        // Merge guest cart items into user cart
        const mergedCart = [...userCart];
        guestCart.forEach((guestItem) => {
          const existingIndex = mergedCart.findIndex(
            (item) => item.cartItemId === guestItem.cartItemId
          );
          if (existingIndex > -1) {
            mergedCart[existingIndex].qty += guestItem.qty;
          } else {
            mergedCart.push(guestItem);
          }
        });
        userCart = mergedCart;

        // Clear guest cart
        localStorage.removeItem(guestKey);
      }

      localStorage.setItem(userKey, JSON.stringify(userCart));
      setCartItems(userCart);
    } else {
      // Guest: Load guest cart
      const storedGuestCart = localStorage.getItem(guestKey);
      const guestCart = storedGuestCart ? JSON.parse(storedGuestCart) : [];
      setCartItems(guestCart);
    }
  }, [user, authLoading]);

  // Save cart changes to localStorage (only after authentication has loaded)
  useEffect(() => {
    if (authLoading) return;

    const key = user ? `unicorn_cart_${user._id}` : 'unicorn_cart';
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user, authLoading]);

  useEffect(() => {
    if (animateCart) {
      const timer = setTimeout(() => setAnimateCart(false), 600);
      return () => clearTimeout(timer);
    }
  }, [animateCart]);

  const addToCart = (product, size, qty) => {
    setAnimateCart(true);
    setCartItems((prevItems) => {
      const items = Array.isArray(prevItems) ? prevItems : [];
      const cartItemId = `${product._id}-${size}`;
      const existingItemIndex = items.findIndex(item => item.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        // Item with same product & size exists, update its quantity safely
        const newItems = [...items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          qty: newItems[existingItemIndex].qty + qty
        };
        return newItems;
      } else {
        // Add as a new item
        return [
          ...items,
          {
            cartItemId,
            _id: product._id,
            name: product.name,
            price: product.price,
            comparePrice: product.comparePrice,
            image: product.image,
            size: size || 'One Size',
            qty,
            color: product.color || 'Black',
            fit: product.fit || 'Oversized Fit'
          }
        ];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQty = (cartItemId, newQty) => {
    if (newQty < 1) return;
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, qty: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartSubtotal,
      animateCart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
