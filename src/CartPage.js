import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import './CartPage.css';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice,
    clearCart 
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Votre panier est vide</h2>
        <button 
          className="continue-shopping-btn"
          onClick={() => navigate('/client')}
        >
          Continuer vos achats
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button 
          className="back-button"
          onClick={() => navigate('/client')}
        >
          <ArrowLeft className="icon" />
          Retour aux achats
        </button>
        <h2>Votre Panier</h2>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.nom} />
            </div>
            <div className="cart-item-info">
              <h3>{item.nom}</h3>
              <p className="item-price">{item.prix} €</p>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <button 
              className="remove-item"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Total:</span>
          <span className="total-price">{getTotalPrice().toFixed(2)} €</span>
        </div>
        <button className="checkout-button">
          Procéder au paiement
        </button>
        <button 
          className="continue-shopping"
          onClick={() => navigate('/client')}
        >
          Continuer vos achats
        </button>
      </div>
    </div>
  );
};

export default CartPage;
