import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VendeurPage = () => {
  const [userData, setUserData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  if (!userData) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Chargement des données utilisateur...</div>;
  }

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  const handleDisconnectClick = () => {
    localStorage.removeItem('userData'); // Supprime les données utilisateur du stockage local
    navigate('/App');
  };

  return (
    <div
      style={{
        fontFamily: `'Roboto', sans-serif`,
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#343a40',
          color: '#ffffff',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>eCommerce</h1>
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="Profil"
          onClick={handleProfileClick}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            border: '2px solid #ffffff',
          }}
        />
      </header>

      {/* Profile Section */}
      {showProfile && userData && (
        <div
          style={{
            maxWidth: '1000px',
            margin: '20px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', color: '#343a40' }}>Informations du Profil</h2>
          <p><strong>Nom:</strong> {userData.nom}</p>
          <p><strong>Prénom:</strong> {userData.prenom}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Téléphone:</strong> {userData.tel}</p>
          <p><strong>Adresse:</strong> {userData.adresse}</p>
          <button
            onClick={handleDisconnectClick}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: '#ffffff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            Déconnexion
          </button>
        </div>
      )}

      {/* Main Section */}
      {!showProfile && (
        <main
          style={{
            maxWidth: '800px',
            margin: '40px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', color: '#343a40' }}>
            Bienvenue, {userData.nom} {userData.prenom}
          </h2>
          <p style={{ color: '#6c757d' }}>Voici vos Produits :</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/ajouter-produit')}
              style={{
                padding: '15px 25px',
                backgroundColor: '#28a745',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              Ajouter un produit
            </button>
            <button
              onClick={() => navigate('/gerer-ventes')}
              style={{
                padding: '15px 25px',
                backgroundColor: '#ffc107',
                color: '#343a40',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              Gérer les ventes
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default VendeurPage;
