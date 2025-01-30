import React from 'react';
import { useCart } from './CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
        <Link to="/AdminPage" className="text-blue-600 hover:text-blue-800">
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Votre Panier</h1>
      
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center border p-4 rounded-lg shadow">
            <img 
              src={item.image} 
              alt={item.nom} 
              className="w-24 h-24 object-cover rounded"
            />
            
            <div className="flex-grow ml-4">
              <h3 className="font-semibold">{item.nom}</h3>
              <p className="text-gray-600">{item.prix} € par unité</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <Minus size={20} />
              </button>
              
              <span className="mx-2">{item.quantity}</span>
              
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="ml-4">
              <p className="font-semibold">{(item.prix * item.quantity).toFixed(2)} €</p>
            </div>
            
            <button
              onClick={() => removeFromCart(item.id)}
              className="ml-4 p-2 text-red-600 hover:text-red-800"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-right">
        <div className="text-xl font-bold">
          Total: {getTotalPrice().toFixed(2)} €
        </div>
        <button 
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => alert('Passer à la commande')}
        >
          Passer la commande
        </button>
      </div>
    </div>
  );
};

export default CartPage;