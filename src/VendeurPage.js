import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';  // Assurez-vous d'importer votre instance Firebase correctement
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';  // Importer les fonctions nécessaires de Firebase
import { FaTrashAlt, FaPen, FaUserCircle } from 'react-icons/fa';  // Icônes de suppression et modification

const VendeurPage = () => {
  const [userData, setUserData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [produits, setProduits] = useState([]); 
  const [updatedUserData, setUpdatedUserData] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false); 
  const [newProductData, setNewProductData] = useState({
    nomProduit: '',
    description: '',
    prix: '',
    image: '',
  });
  const [editProductData, setEditProductData] = useState(null); // État pour gérer le produit à modifier
  const navigate = useNavigate();

  // Charger les données utilisateur à partir du localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Charger les produits du vendeur
  useEffect(() => {
    const fetchProduits = async () => {
      if (userData) {
        const produitsRef = collection(db, 'produits');
        const q = query(produitsRef, where('vendeur', '==', userData.nom));
        const querySnapshot = await getDocs(q);
        const produitsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProduits(produitsList);
      }
    };

    fetchProduits();
  }, [userData]);

  // Fonction pour supprimer un produit
  const handleDeleteProduct = async (productId) => {
    try {
      const produitRef = doc(db, 'produits', productId);
      await deleteDoc(produitRef);
      setProduits(produits.filter(produit => produit.id !== productId));
      alert('Produit supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      alert('Une erreur est survenue lors de la suppression du produit');
    }
  };

  // Fonction pour gérer la modification d'un produit
  const handleEditProduct = (produit) => {
    setEditProductData(produit); // Pré-remplir le formulaire avec les données du produit
  };

  // Fonction pour mettre à jour le produit
  const handleProductUpdate = async (e) => {
    e.preventDefault();
    try {
      const produitRef = doc(db, 'produits', editProductData.id);
      await updateDoc(produitRef, {
        nomProduit: editProductData.nomProduit,
        description: editProductData.description,
        prix: editProductData.prix,
        image: editProductData.image,
      });
      // Mettre à jour la liste des produits localement
      setProduits(produits.map((produit) =>
        produit.id === editProductData.id ? editProductData : produit
      ));
      alert('Produit mis à jour avec succès');
      setEditProductData(null); // Cacher le formulaire après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      alert('Une erreur est survenue lors de la mise à jour du produit');
    }
  };

  // Fonction pour afficher/masquer le formulaire d'ajout de produit
  const handleAddProductClick = () => {
    setShowAddProductForm(true);
  };

  // Fonction pour ajouter un produit
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const produitsRef = collection(db, 'produits');
      await addDoc(produitsRef, {
        ...newProductData,
        vendeur: userData.nom, // Associer le produit au vendeur actuel
      });

      setProduits([...produits, { ...newProductData, id: new Date().getTime().toString() }]);
      alert('Produit ajouté avec succès');
      setShowAddProductForm(false); // Cacher le formulaire après l'ajout
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      alert('Une erreur est survenue lors de l\'ajout du produit');
    }
  };

  // Fonction pour afficher/masquer le profil
  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  // Fonction pour déconnecter l'utilisateur
  const handleDisconnectClick = () => {
    localStorage.removeItem('userData');
    navigate('/App');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#fffbf2', minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#ff6f00', color: '#ffffff' }}>
        <h1 style={{ margin: 0, marginLeft: '40%' }}>eCommerce</h1>
      </header>

      {/* Profil */}
      
      <div
      style={{
        position: 'absolute',
        top: '10%',
        right: '25px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#ff6f00',  // Couleur de fond personnalisée
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <FaUserCircle  onClick={handleProfileClick} style={{ color: 'white', fontSize: '30px' }} />
    </div>

      {/* Formulaire de Profil */}
      {showProfile && userData && (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#ff6f00' }}>Informations du Profil</h2>
          <p><strong>Nom:</strong> {userData.nom}</p>
          <p><strong>Prénom:</strong> {userData.prenom}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Téléphone:</strong> {userData.tel}</p>
          <p><strong>Adresse:</strong> {userData.adresse}</p>
          <button
            onClick={handleDisconnectClick}
            style={{
              marginTop: '10px',
              padding: '10px 15px',
              backgroundColor: '#e65100',
              color: '#ffffff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Déconnexion
          </button>
        </div>
      )}

      {/* Liste des Produits */}
      {!showEditProfile && !showAddProductForm && (
        <main style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#ff6f00' }}>Mes Produits</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {produits.length === 0 ? (
              <p>Aucun produit trouvé.</p>
            ) : (
              produits.map((produit) => (
                <div key={produit.id} style={{ width: 'calc(33.333% - 20px)', backgroundColor: '#f9f9f9', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)' }}>
                  <img
                    src={produit.image || "//via.placeholder.com/150"}
                    alt={produit.nomProduit}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '10px' }}>
                    <h3 style={{ fontSize: '18px', color: '#ff6f00' }}>{produit.nomProduit}</h3>
                    <p>{produit.description}</p>
                    <p><strong>Prix:</strong> {produit.prix} TND</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <FaPen
                        onClick={() => handleEditProduct(produit)}
                        style={{ cursor: 'pointer', color: '#ff6f00' }}
                      />
                      <FaTrashAlt
                        onClick={() => handleDeleteProduct(produit.id)}
                        style={{ cursor: 'pointer', color: '#e65100' }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Formulaire d'ajout de produit */}
          <button
            onClick={handleAddProductClick}
            style={{
              marginTop: '20px',
              padding: '10px 15px',
              backgroundColor: '#ff6f00',
              color: '#ffffff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Ajouter un produit
          </button>
        </main>
      )}

      {/* Formulaire de modification de produit */}
      {editProductData && (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#ff6f00' }}>Modifier le produit</h2>
          <form onSubmit={handleProductUpdate}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px' }}>Nom du produit:</label>
              <input
                type="text"
                value={editProductData.nomProduit}
                onChange={(e) => setEditProductData({ ...editProductData, nomProduit: e.target.value })}
                required
                style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px' }}>Description:</label>
              <textarea
                value={editProductData.description}
                onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                required
                style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px' }}>Prix:</label>
              <input
                type="number"
                value={editProductData.prix}
                onChange={(e) => setEditProductData({ ...editProductData, prix: e.target.value })}
                required
                style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px' }}>Image URL:</label>
              <input
                type="text"
                value={editProductData.image}
                onChange={(e) => setEditProductData({ ...editProductData, image: e.target.value })}
                required
                style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '20px' }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '10px 15px',
                backgroundColor: '#ff6f00',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Mettre à jour le produit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VendeurPage;
