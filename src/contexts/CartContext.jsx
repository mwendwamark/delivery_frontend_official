// src/contexts/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from sessionStorage on initial render
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variant) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(
        item => item.productId === product.id && item.variantId === variant.id
      );

      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(item =>
          item.productId === product.id && item.variantId === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Add new item to cart
      return [
        ...prevItems,
        {
          productId: product.id,
          productName: product.name,
          variantId: variant.id,
          size: variant.size,
          price: variant.price,
          image: product.image_url, // Ensure product.image_url is correctly passed
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId, variantId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.productId === productId && item.variantId === variantId)
      )
    );
  };

  const updateQuantity = (productId, variantId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, variantId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
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
