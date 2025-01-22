import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Composant pour les statistiques
const StatCard = ({ title, value }) => (
  <div
    style={{
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      transition: 'transform 0.3s ease',
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
    onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
  >
    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#24292e' }}>{title}</h3>
    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0', color: '#007bff' }}>{value}</p>
  </div>
);

const ActionButton = ({ label, onClick, color }) => (
  <button
    onClick={onClick}
    style={{
      padding: '12px 20px',
      backgroundColor: color,
      color: '#ffffff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s ease',
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
    onMouseOut={(e) => (e.target.style.backgroundColor = color)}
  >
    {label}
  </button>
);

function VendeurPage() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleProfileClick = () => {
    setShowMenu((prev) => !prev);
  };

  const handleDisconnectClick = () => {
    console.log('Déconnexion !');
    navigate('/App');
  };

  const stats = [
    { title: 'Produits', value: 25 },
    { title: 'Commandes', value: 120 },
    { title: 'Revenus', value: '1200 €' },
  ];

  const actions = [
    { label: 'Gérer les Produits', onClick: () => console.log('Gestion des produits !'), color: '#007bff' },
    { label: 'Consulter les Commandes', onClick: () => console.log('Consultation des commandes !'), color: '#28a745' },
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f5f7', minHeight: '100vh' }}>
      {/* Barre de navigation */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#24292e',
          color: '#ffffff',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Espace Vendeur</h2>
        <div style={{ position: 'relative' }}>
          {/* Bouton profil */}
          <div
            onClick={handleProfileClick}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,rgb(248, 150, 37), #6610f2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            }}
          >
            <span style={{ fontSize: '20px', color: '#ffffff', fontWeight: 'bold' }}>👤</span>
          </div>

          {/* Menu déroulant */}
          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '60px',
                right: 0,
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                borderRadius: '5px',
                overflow: 'hidden',
                zIndex: 1000,
              }}
            >
              <button
                onClick={handleDisconnectClick}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderBottom: '1px solid #eaeaea',
                  color: '#24292e',
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#f4f4f4')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#ffffff')}
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main style={{ marginTop: '80px', padding: '20px', maxWidth: '1200px', margin: '80px auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
          Bienvenue sur votre espace Vendeur
        </h1>
        <p style={{ fontSize: '16px', color: '#555' }}>
          Gérez vos produits, suivez vos ventes et développez votre activité en ligne.
        </p>

        {/* Statistiques */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '30px',
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
            gap: '20px',
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
