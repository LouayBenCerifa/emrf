import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
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
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ nom: '', prenom: '', adresse: '' });

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async () => {
  if (deliveryMethod === 'home' && (!customerInfo.nom || !customerInfo.prenom || !customerInfo.adresse)) {
    alert('Veuillez remplir tous les champs requis');
    return;
  }

  if (!cartItems.length) {
    alert("Votre panier est vide !");
    return;
  }

  console.log("Commande envoyée : ", cartItems); // Debugging

  try {
    console.log("Commande envoyée : ", cartItems); // Debugging
    await addDoc(collection(db, 'commandes'), {
      produits: cartItems.map(item => ({
        id: item.id || 'id-inconnu',
        nom: item.nom || 'nom-inconnu',
        quantite: item.quantity || 1,
        vendeurId: item.idVendeur || 'inconnu',
      })),
      total: getTotalPrice(),
      modeLivraison: deliveryMethod || 'non-spécifié',
      client: {
        nom: customerInfo.nom || 'nom-inconnu',
        prenom: customerInfo.prenom || 'prenom-inconnu',
        adresse: customerInfo.adresse || 'adresse-inconnue',
      },
      dateCommande: new Date().toISOString()
    });

    clearCart();
    alert('Commande passée avec succès !');
    navigate('/client');
  } catch (error) {
    console.error('Erreur lors de la commande :', error);
    alert('Une erreur est survenue lors de la commande.');
  }
};

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
        <button 
          className="checkout-button"
          onClick={() => setShowDeliveryOptions(true)}
        >
          Procéder au paiement
        </button>
        <button 
          className="continue-shopping"
          onClick={() => navigate('/client')}
        >
          Continuer vos achats
        </button>
      </div>

      {showDeliveryOptions && (
        <div className="delivery-options">
          <h3>Choisissez votre mode de livraison :</h3>
          <label>
            <input type="radio" name="delivery" value="home" onChange={(e) => setDeliveryMethod(e.target.value)} />
            Livraison à domicile
          </label>
          <label>
            <input type="radio" name="delivery" value="store" onChange={(e) => setDeliveryMethod(e.target.value)} />
            Retrait en magasin
          </label>

          {deliveryMethod === 'home' && (
            <div className="customer-info-form">
              <input type="text" name="nom" placeholder="Nom" value={customerInfo.nom} onChange={handleInputChange} />
              <input type="text" name="prenom" placeholder="Prénom" value={customerInfo.prenom} onChange={handleInputChange} />
              <input type="text" name="adresse" placeholder="Adresse" value={customerInfo.adresse} onChange={handleInputChange} />
            </div>
          )}
          <button className="confirm-delivery" onClick={handleOrderSubmit}>Confirmer</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;