import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Divider } from '@mui/material';
import { Trash2 } from 'lucide-react';
import './CartPage.css';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Simule la récupération des articles dans le panier (ici, ils sont stockés dans localStorage)
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
    calculateTotal(storedCart);
  }, []);

  // Calcule le total du panier
  const calculateTotal = (items) => {
    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);
  };

  // Supprimer un article du panier
  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  // Mettre à jour la quantité d'un article dans le panier
  const handleUpdateQuantity = (id, quantity) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  // Simuler le processus de paiement
  const handleCheckout = () => {
    alert('Checkout process simulated. Your total is: $' + total);
    // Implémentez ici la logique de paiement (Stripe, PayPal, etc.)
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            Your cart is empty.
          </Typography>
        ) : (
          cartItems.map(item => (
            <Card key={item.id} className="cart-item">
              <CardContent>
                <div className="cart-item-info">
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">Price: ${item.price}</Typography>
                  <div className="cart-item-actions">
                    <Button
                      variant="outlined"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <Typography>{item.quantity}</Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button onClick={() => handleRemoveItem(item.id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <Divider />
                <div className="cart-item-total">
                  <Typography variant="body2">Subtotal: ${item.price * item.quantity}</Typography>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <Card className="cart-summary-card">
            <CardContent>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h5">${total}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                className="checkout-button"
              >
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default CartPage;
