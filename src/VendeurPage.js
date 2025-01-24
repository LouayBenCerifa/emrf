import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faUser, faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const VendeurPage = () => {
  const [userData, setUserData] = useState(null);
  const [produits, setProduits] = useState([]);
  const [activeSection, setActiveSection] = useState('produits');
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);

      // Fetch products as soon as userData is available
      if (parsedUserData.uid) {
        fetchProduits(parsedUserData.uid);
      }
    }
  }, []);

  const fetchProduits = async (uid) => {
    try {
      const produitsRef = collection(db, 'produits'); // Collection Firestore
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
    navigate('/login');
  };

  const confirmDelete = (id) => {
    setShowConfirmDelete(id);
  };

  const deleteProduit = async (id) => {
    try {
      // Code pour supprimer le produit de la base de données
      setProduits(produits.filter(produit => produit.id !== id));
      setShowConfirmDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px',
    },
    sidebarMenu: {
      listStyle: 'none',
      padding: 0,
    },
    sidebarItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      cursor: 'pointer',
      borderRadius: '5px',
      margin: '10px 0',
      backgroundColor: '#34495e',
    },
    activeSidebarItem: {
      backgroundColor: '#1abc9c',
    },
    icon: {
      marginRight: '10px',
    },
    mainContent: {
      flex: 1,
      padding: '20px',
      backgroundColor: '#ecf0f1',
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
    },
    productCard: {
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      textAlign: 'center',
    },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '8px',
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
    },
    button: {
      padding: '8px 15px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    editButton: {
      backgroundColor: '#3498db',
      color: 'white',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
    },
    confirmDeleteOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    confirmDeleteBox: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2>Menu Vendeur</h2>
        <ul style={styles.sidebarMenu}>
          <li 
            style={{ 
              ...styles.sidebarItem, 
              ...(activeSection === 'produits' ? styles.activeSidebarItem : {})
            }}
            onClick={() => {
              setActiveSection('produits');
              fetchProduits(userData.uid);
            }}
          >
            <FontAwesomeIcon icon={faBox} style={styles.icon} /> Mes Produits
          </li>
          <li 
            style={{ 
              ...styles.sidebarItem, 
              ...(activeSection === 'profil' ? styles.activeSidebarItem : {})
            }}
            onClick={() => setActiveSection('profil')}
          >
            <FontAwesomeIcon icon={faUser} style={styles.icon} /> Mon Profil
          </li>
          <li 
            style={styles.sidebarItem}
            onClick={() => navigate('/ajouter-produit')}
          >
            <FontAwesomeIcon icon={faPlus} style={styles.icon} /> Ajouter Produit
          </li>
          <li 
            style={styles.sidebarItem}
            onClick={handleDisconnect}
          >
            <FontAwesomeIcon icon={faSignOutAlt} style={styles.icon} /> Déconnexion
          </li>
        </ul>
      </div>

      <div style={styles.mainContent}>
        {activeSection === 'produits' && (
          <div style={styles.productGrid}>
            {produits.map(produit => (
              <div key={produit.id} style={styles.productCard}>
                <img 
                  src={produit.image} 
                  alt={produit.nom} 
                  style={styles.productImage} 
                />
                <h3>{produit.nom}</h3>
                <p>{produit.description}</p>
                <div style={styles.actionButtons}>
                  <span>{produit.prix} €</span>
                  <div>
                    <button 
                      style={{...styles.button, ...styles.editButton}}
                    >
                      Modifier
                    </button>
                    <button 
                      style={{...styles.button, ...styles.deleteButton, marginLeft: '10px'}}
                      onClick={() => confirmDelete(produit.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

                {showConfirmDelete && (
                  <div style={styles.confirmDeleteOverlay}>
                    <div style={styles.confirmDeleteBox}>
                      <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
                      <button 
                        style={{...styles.button, ...styles.deleteButton, marginRight: '10px'}}
                        onClick={() => deleteProduit(showConfirmDelete)}
                      >
                        Oui, supprimer
                      </button>
                      <button 
                        style={{...styles.button, backgroundColor: '#bdc3c7'}}
                        onClick={() => setShowConfirmDelete(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        };
        
        export default VendeurPage;
        