import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import './VendeurPage.css'; 

const VendeurPage = () => {
  const [userData, setUserData] = useState(null);
  const [produits, setProduits] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      fetchProduits(parsedUserData.uid);
    } else {
      navigate('/login');
    }
  }, [navigate]);
  const fetchCommande = async (uid) => {
    try {
      const produitsRef = collection(db, 'commandes');
      const q = query(produitsRef, where('idVendeur', '==', uid));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      const fetchedCommande = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProduits(fetchedCommande);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  };
  const fetchProduits = async (uid) => {
    try {
      const produitsRef = collection(db, 'produits');
      const q = query(produitsRef, where('vendeur', '==', uid));
      const querySnapshot = await getDocs(q);
      const fetchedProduits = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProduits(fetchedProduits);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('userData');
    navigate('/App');
  };

  const deleteProduit = async (id) => {
    try {
      await deleteDoc(doc(db, 'produits', id));
      setProduits(produits.filter(produit => produit.id !== id));
      setShowConfirmDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

  const renderDashboard = () => {
    if (!userData) return null;

    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h3>Statistiques Produits</h3>
          <div className="dashboard-stats">
            <p>Total Produits: {produits.length}</p>
            
          </div>
        </div>
        <div className="dashboard-card">
          <h3>Profil Vendeur</h3>
          <div className="dashboard-profile">
            <p>{userData?.nom || 'Nom non disponible'}</p>
            <p>{userData?.email || 'Email non disponible'}</p>
            <p>{userData?.tel || 'Téléphone non renseigné'}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <h3>Actions Rapides</h3>
          <div className="dashboard-actions">
            <button onClick={() => navigate('/ajouter-produit')}>
              Ajouter Produit
            </button>
            <button onClick={() => setActiveSection('produits')}>
              Gérer Produits
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProduits = () => (
    <div className="produits-grid">
      {produits.map(produit => (
        <div key={produit.id} className="produit-card">
          <img 
            src={produit.image} 
            alt={produit.nom} 
            className="produit-image"
          />
          <div className="produit-details">
            
            <p>description: {produit.description}</p>
            <p>Prix: {produit.prix} </p>
            <div className="produit-footer">
              
              <div className="produit-actions">
                <button 
                  className="btn-edit"
                  onClick={() => navigate(`/modifier-produit/${produit.id}`)}
                >
                  Modifier
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => setShowConfirmDelete(produit.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  const renderCommande = () => (
    <div className="produits-grid">
      {produits.map(produit => (
        <div key={produit.id} className="produit-card">
          <img 
            src={produit.image} 
            alt={produit.nom} 
            className="produit-image"
          />
          <div className="produit-details">
            
            <p>description: {produit.description}</p>
            <p>Prix: {produit.prix} </p>
            <div className="produit-footer">
              
              <div className="produit-actions">
                <button 
                  className="btn-edit"
                  onClick={() => navigate(`/modifier-produit/${produit.id}`)}
                >
                  Modifier
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => setShowConfirmDelete(produit.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProfil = () => {
    if (!userData) return null;

    return (
      <div className="profile-container">
        <h2>Mon Profil</h2>
        <div className="profile-grid">
          <div className="profile-field">
            <label>Nom Complet</label>
            <input 
              type="text" 
              value={userData.nom || ''} 
              readOnly 
            />
          </div>
          <div className="profile-field">
            <label>Email</label>
            <input 
              type="email" 
              value={userData.email || ''} 
              readOnly 
            />
          </div>
          <div className="profile-field">
            <label>Téléphone</label>
            <input 
              type="tel" 
              value={userData.tel || 'Non renseigné'} 
              readOnly 
            />
          </div>
          <div className="profile-field">
            <label>Adresse</label>
            <input 
              type="text" 
              value={userData.adresse || 'Non renseigné'} 
              readOnly 
            />
          </div>
        </div>
      </div>
    );
  };

  const sidebarItems = [
    { label: 'Tableau de Bord', section: 'dashboard' },
    { label: 'Mes Produits', section: 'produits' },
    {label: 'Mes Commandes', section: 'commandes'},
    { label: 'Mon Profil', section: 'profil' },
    { label: 'Ajouter Produit', action: () => navigate('/ajouter-produit') },
    { label: 'Déconnexion', action: handleDisconnect }
  ];

  if (!userData) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="vendor-page">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Vendeur</h2>
        </div>
        <nav className="sidebar-nav">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action || (() => setActiveSection(item.section))}
              className={activeSection === item.section ? 'active' : ''}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      
      <main className="main-content">
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'produits' && renderProduits()}
        {activeSection === 'profil' && renderProfil()}
        {activeSection === 'commandes' && renderCommande()}
      </main>

      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmation</h3>
            <p>Voulez-vous vraiment supprimer ce produit ?</p>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowConfirmDelete(null)}
              >
                Annuler
              </button>
              <button 
                className="btn-confirm"
                onClick={() => deleteProduit(showConfirmDelete)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendeurPage;