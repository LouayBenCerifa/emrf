import React from 'react';

function ProfilePage() {
  return (
    <div style={profilePageStyle}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Mon Profil</h1>
      <div style={profileCardStyle}>
        <h3 style={{ fontSize: '24px' }}>Nom Utilisateur</h3>
        <p>Email: utilisateur@example.com</p>
        <p>Adresse: 123 Rue Exemple</p>
        <button style={editButtonStyle}>Modifier les informations</button>
      </div>
    </div>
  );
}

const profilePageStyle = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
  backgroundColor: '#f5f7fa',
};

const profileCardStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
};

const editButtonStyle = {
  padding: '12px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default ProfilePage;
