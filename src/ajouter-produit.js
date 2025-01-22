import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AjouterProduit = () => {
  const [nomProduit, setNomProduit] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [quantite, setQuantite] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const nouveauProduit = {
      nomProduit,
      description,
      prix,
      quantite,
      image,
    };

    console.log('Produit ajouté :', nouveauProduit);
    alert('Produit ajouté avec succès !');
    navigate('/vendeur');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Ajouter un Produit</h1>
      <form 
        onSubmit={handleSubmit} 
        style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)' }}
      >
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nom du produit :</label>
          <input 
            type="text" 
            value={nomProduit} 
            onChange={(e) => setNomProduit(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} 
            required 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description :</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'none' }} 
            rows="4"
            required 
          ></textarea>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Prix :</label>
          <input 
            type="number" 
            value={prix} 
            onChange={(e) => setPrix(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} 
            required 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Quantité :</label>
          <input 
            type="number" 
            value={quantite} 
            onChange={(e) => setQuantite(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} 
            required 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Image du produit :</label>
          <input 
            type="file" 
            onChange={(e) => setImage(e.target.files[0])} 
            style={{ width: '100%' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px 0', backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          Ajouter le produit
        </button>
      </form>
    </div>
  );
};

export default AjouterProduit;
