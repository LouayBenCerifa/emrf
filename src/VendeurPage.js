import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Composant pour les statistiques
const StatCard = ({ title, value }) => (
  <div
    style={{
      padding: '25px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
    }}
  >
    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{title}</h3>
    <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', color: '#1d68e1' }}>{value}</p>
  </div>
);

const ActionButton = ({ label, onClick, color }) => (
  <button
    onClick={onClick}
    style={{
      padding: '14px 24px',
      backgroundColor: color,
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = '#0056b3';
      e.target.style.transform = 'scale(1.05)';
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = color;
      e.target.style.transform = 'scale(1)';
    }}
  >
    {label}
  </button>
);

function VendeurPage() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileClick = () => {
    setShowMenu((prev) => !prev);
  };

  const handleDisconnectClick = () => {
    console.log('Déconnexion !');
    navigate('/App');
  };

  const handleChangePasswordClick = () => {
    setShowChangePasswordModal(true);
    setShowMenu(false); // Ferme le menu après avoir cliqué
  };

  const handlePasswordSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
    } else {
      // Logique de modification du mot de passe (par exemple appel API)
      console.log('Mot de passe modifié avec succès !');
      setShowChangePasswordModal(false); // Ferme la modale après soumission
    }
  };

  const handleProfilePageClick = () => {
    navigate('/profile'); // Redirige vers la page ProfilePage
    setShowMenu(false); // Ferme le menu après avoir cliqué
  };

  const stats = [
    { title: 'Produits', value: 25 },
    { title: 'Commandes', value: 120 },
    { title: 'Revenus', value: '1200 €' },
  ];

  const actions = [
    { label: 'Gérer les Produits', onClick: () => console.log('Gestion des produits !'), color: '#28a745' },
    { label: 'Consulter les Commandes', onClick: () => console.log('Consultation des commandes !'), color: '#007bff' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f4f7fc', minHeight: '100vh' }}>
      {/* Barre de navigation */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#24292f',
          color: '#ffffff',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Espace Vendeur</h2>
        <div style={{ position: 'relative' }}>
          {/* Bouton profil */}
          <div
            onClick={handleProfileClick}
            style={{
              marginRight: '30px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #fdc830, #f37335)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              marginLeft: '20px', // Ajustement léger à gauche
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 22px rgba(0, 0, 0, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.2)';
            }}
          >
            <span style={{ fontSize: '24px', color: '#ffffff', fontWeight: '600' }}>👤</span>
          </div>

          {/* Menu déroulant */}
          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '65px',
                marginRight: '30px',
                right: 0,
                backgroundColor: '#ffffff',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
                zIndex: 1000,
                width: '160px',
              }}
            >
              <button
                onClick={handleDisconnectClick}
                style={{
                  padding: '12px',
                  backgroundColor: '#fff',
                  border: 'none',
                  borderBottom: '1px solid #eaeaea',
                  color: '#24292e',
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#fff')}
              >
                Se déconnecter
              </button>
              <button
                onClick={handleChangePasswordClick}
                style={{
                  padding: '12px',
                  backgroundColor: '#fff',
                  border: 'none',
                  color: '#24292e',
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#fff')}
              >
                Modifier le mot de passe
              </button>
              <button
                onClick={handleProfilePageClick}
                style={{
                  padding: '12px',
                  backgroundColor: '#fff',
                  border: 'none',
                  color: '#24292e',
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#fff')}
              >
                Voir le Profil
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main style={{ marginTop: '110px', padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#333' }}>Bienvenue sur votre espace Vendeur</h1>
        <p style={{ fontSize: '16px', color: '#555' }}>
          Gérez vos produits, suivez vos ventes et développez votre activité en ligne.
        </p>

        {/* Statistiques */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '30px',
            marginTop: '40px',
          }}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} title={stat.title} value={stat.value} />
          ))}
        </div>

        {/* Actions principales */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '40px',
          }}
        >
          {actions.map((action, index) => (
            <ActionButton key={index} label={action.label} onClick={action.onClick} color={action.color} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default VendeurPage;
