import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, addDoc, collection, getDocs, query, where } from './firebase';

const AjouterProduit = () => {
  // Définir les hooks au début du composant
  const [userData, setUserData] = useState(null);
  const [nomProduit, setNomProduit] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [quantite, setQuantite] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]); // Nouvel état pour les catégories
  const [selectedCategory, setSelectedCategory] = useState(''); // Nouvel état pour la catégorie sélectionnée
  const vendeur = userData ? userData.vendeurid : '';
  const navigate = useNavigate();

  // Utiliser useEffect pour charger les données utilisateur et les catégories
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      console.log('storedUserData:', JSON.parse(storedUserData));
    }

    // Charger les catégories depuis Firestore
    const getCategories = async () => {
      const q = query(collection(db, 'categories'));
      const querySnapshot = await getDocs(q);
      const categoriesData = [];
      querySnapshot.forEach((doc) => {
        // Extraire le nom de la catégorie de l'ID du document
        const nomCategorie = doc.id; // Assurez-vous que l'ID est le nom de la catégorie
        categoriesData.push({ nom: nomCategorie, ...doc.data() });
      });
      setCategories(categoriesData);
    };
    getCategories();
  }, []);

  // Si les données de l'utilisateur ne sont pas encore disponibles, afficher un message de chargement
  if (!userData) {
    return <div>Chargement des données utilisateur...</div>;
  }

  // Fonction pour gérer l'image et obtenir son URL localement
  const handleImageChange = (e) => {
     const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // Fonction pour envoyer les données à Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const nouveauProduit = {
        vendeur: userData.uid,
        nomProduit,
        description,
        prix,
        quantite,
        image: imageUrl,  // Utilise l'URL de l'image
        categorie: selectedCategory,  // Ajoute la catégorie sélectionnée
      };

      // Ajouter le produit à Firestore
      const docRef = await addDoc(collection(db, 'produits'), nouveauProduit);
      console.log('Produit ajouté avec ID:', docRef.id);
      alert('Produit ajouté avec succès !');
      navigate('/vendeur');  // Redirige vers la page du vendeur après l'ajout
    } catch (e) {
      console.error('Erreur lors de l\'ajout du produit:', e);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#FF6F00', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>Ajouter un Produit</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '600px', 
          margin: '0 auto', 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Champ pour le nom du produit */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Nom du produit :</label>
          <input
            type="text"
            value={nomProduit}
            onChange={(e) => setNomProduit(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
            aria-label="Nom du produit"
          />
        </div>

        {/* Champ pour la description */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'none' }}
            rows="4"
            required
            aria-label="Description du produit"
          ></textarea>
        </div>

        {/* Champ pour le prix */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Prix :</label>
          <input
            type="number"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
            aria-label="Prix du produit"
          />
        </div>

        {/* Champ pour la quantité */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Quantité :</label>
          <input
            type="number"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
            aria-label="Quantité du produit"
          />
        </div>

        {/* Champ pour la sélection de la catégorie */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Catégorie :</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
            aria-label="Catégorie du produit"
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category) => (
              <option key={category.uid} value={category.uid}>{category.nom}</option>
            ))}
          </select>
        </div>

        {/* Champ pour l'upload de l'image */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Image du produit :</label>
          <input
            type="file"
            onChange={handleImageChange}
            style={{ width: '100%' }}
            aria-label="Image du produit"
          />
          {/* Affichage de l'aperçu de l'image sélectionnée */}
          {imageUrl && (
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <img src={imageUrl} alt="Aperçu" style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }} />
            </div>
 )}
        </div>

        {/* Bouton d'envoi */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px 0',
            backgroundColor: '#FF6F00',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Ajouter le produit
        </button>
      </form>
    </div>
  );
};

export default AjouterProduit; 