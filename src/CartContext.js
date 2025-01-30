import React, { createContext, useContext, useState, useEffect } from 'react';

// Créer le contexte
const CartContext = createContext();

// Hook personnalisé pour utiliser le panier
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
};

// Provider Component
export const CartProvider = ({ children }) => {
  // Initialiser l'état du panier depuis le localStorage s'il existe
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      return [];
    }
  });

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      console.log(cartItems);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    }
  }, [cartItems]);

  // Ajouter un produit au panier
  const addToCart = (product) => {
    if (!product) return;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si le produit existe déjà, augmenter la quantité
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Si le produit n'existe pas, l'ajouter avec quantité 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Retirer un produit du panier
  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Calculer le total du panier
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.prix * item.quantity);
    }, 0);
  };

  // Vider le panier
  const clearCart = () => {
    setCartItems([]);
  };

  // Obtenir le nombre total d'articles dans le panier
  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Valeurs exposées par le contexte
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;