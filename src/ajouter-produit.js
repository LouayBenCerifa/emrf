import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, addDoc, collection, getDocs, query } from './firebase';

const AjouterProduit = () => {
  const [userData, setUserData] = useState(null);
  const [nomProduit, setNomProduit] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [quantite, setQuantite] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    const getCategories = async () => {
      const q = query(collection(db, 'categories'));
      const querySnapshot = await getDocs(q);
      const categoriesData = [];
      querySnapshot.forEach((doc) => {
        const nomCategorie = doc.id;
        categoriesData.push({ nom: nomCategorie, ...doc.data() });
      });
      setCategories(categoriesData);
    };
    getCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nouveauProduit = {
        vendeur: userData.uid,
        nomProduit,
        description,
        prix,
        quantite,
        image: imageUrl,
        categorie: selectedCategory,
      };

      const docRef = await addDoc(collection(db, 'produits'), nouveauProduit);
      console.log('Produit ajouté avec ID:', docRef.id);
      alert('Produit ajouté avec succès !');
      navigate('/vendeur');
    } catch (e) {
      console.error('Erreur lors de l\'ajout du produit:', e);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (!userData) {
    return <div className="loading">Chargement des données utilisateur...</div>;
  }

  return (
    <div className="product-form-container">
      <div className="product-form-wrapper">
        <h1 className="form-title">Ajouter un Produit</h1>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Nom du produit</label>
            <input
              type="text"
              value={nomProduit}
              onChange={(e) => setNomProduit(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Prix</label>
              <input
                type="number"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group half">
              <label>Quantité</label>
              <input
                type="number"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category.uid} value={category.uid}>
                  {category.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Image du produit</label>
            <div className="file-upload">
              <input
                type="file"
                onChange={handleImageChange}
                className="file-input"
                accept="image/*"
              />
              <span className="file-placeholder">Choisir un fichier</span>
            </div>
            
            {imageUrl && (
              <div className="image-preview">
                <img src={imageUrl} alt="Aperçu du produit" />
              </div>
            )}
          </div>

          <button type="submit" className="submit-button">
            Ajouter le produit
          </button>
        </form>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .product-form-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f4f4f4;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .product-form-wrapper {
          width: 100%;
          max-width: 500px;
          background-color: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .form-title {
          text-align: center;
          color: #333;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-group.half {
          flex: 1;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #555;
          font-weight: 500;
        }

        .form-input, 
        .form-textarea, 
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          transition: border-color 0.3s ease;
        }

        .form-input:focus, 
        .form-textarea:focus, 
        .form-select:focus {
          outline: none;
          border-color: #4A90E2;
        }

        .file-upload {
          position: relative;
          overflow: hidden;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .file-placeholder {
          display: block;
          padding: 0.75rem;
          background-color: #f9f9f9;
        }

        .image-preview {
          margin-top: 1rem;
          text-align: center;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          object-fit: cover;
        }

        .submit-button {
          width: 100%;
          padding: 0.875rem;
          background-color: #4A90E2;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover {
          background-color: #3A7BD5;
        }
      `}</style>
    </div>
  );
};

export default AjouterProduit;