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
    return <div>Chargement des données utilisateur...</div>;
  }

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  const handleDisconnectClick = () => {
    localStorage.removeItem('userData'); // Supprime les données utilisateur du stockage local
    navigate('/App');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh', position: 'relative' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#007bff', color: '#ffffff' }}>
        <h1 style={{ margin: 0, marginLeft:'40%' }}>eCommerce</h1>
      </header>

      <img 
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" 
        alt="Profil" 
        onClick={handleProfileClick}
        style={{ 
          position: 'absolute', 
          top: '1.5%', 
          right: '20px',  
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          cursor: 'pointer' 
        }}
      />

      {showProfile && userData && (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginTop: 0 }}>Informations du Profil</h2>
          <p><strong>Nom:</strong> {userData.nom}</p>
          <p><strong>Prénom:</strong> {userData.prenom}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Téléphone:</strong> {userData.tel}</p>
          <p><strong>Adresse:</strong> {userData.adresse}</p>
          <button 
            onClick={handleDisconnectClick} 
            style={{ marginTop: '10px', padding: '10px 15px', backgroundColor: '#dc3545', color: '#ffffff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Déconnexion
          </button>
        </div>
      )}
      {!showProfile  && (<main style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)' }}>
        <h2>Bienvenue, {userData.nom} {userData.prenom}</h2>
        <p>Voici vos statistiques de vente :</p>
        {/* Ajoutez ici les composants ou les informations de statistiques */}
      </main>)}
    </div>
  );
};

export default VendeurPage;
