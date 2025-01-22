import React from 'react';
import { useNavigate } from 'react-router-dom'; // Pour la navigation

function ClientPage() {
  const navigate = useNavigate(); // Hook de navigation

  // Liste de produits pour afficher dans la page
  const products = [
    { id: 1, name: 'Produit 1', price: 20 },
    { id: 2, name: 'Produit 2', price: 30 },
    { id: 3, name: 'Produit 3', price: 50 },
  ];

  // Fonction pour gérer le clic sur le bouton de profil
  const handleProfileClick = () => {
    // Logique à ajouter pour la navigation vers la page du profil
    navigate('/profile'); // Exemple de redirection vers une page de profil
  };

  return (
    <div>
      {/* Barre de navigation avec bouton de profil */}
      <header style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Nos Produits</h1>

        {/* Bouton de profil */}
        <button onClick={handleProfileClick} style={profileButtonStyle}>
          <span style={{ fontSize: '22px' }}>👤</span> Profil
        </button>
      </header>

      {/* Affichage des produits */}
      <div>
        {products.map((product) => (
          <div key={product.id} style={productCardStyle}>
            <h3>{product.name}</h3>
            <p>€{product.price}</p>
            <button>Ajouter au panier</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles pour l'en-tête et le bouton de profil
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#24292f',
  padding: '15px 25px',
  color: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const profileButtonStyle = {
  backgroundColor: '#28a745',
  color: '#ffffff',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'background-color 0.3s ease',
};

const productCardStyle = {
  marginBottom: '20px',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

export default ClientPage;
