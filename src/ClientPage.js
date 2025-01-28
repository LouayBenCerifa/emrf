import React, { useState, useEffect } from 'react';
import { User, Menu, ShoppingCart } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { Link } from 'react-router-dom'; // Importation de Link pour la navigation
import './ClientPage.css';
import AjouterProduit from './ajouter-produit';

const ClientPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => doc.data().nom);
        setCategories(categoriesList);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de récupération des catégories :", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;

      try {
        const productsCollection = collection(db, 'produits');
        const q = query(productsCollection, where('categorie', '==', selectedCategory));
        const productsSnapshot = await getDocs(q);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Erreur de récupération des produits :", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (loading) {
    return <div>Chargement des catégories...</div>;
  }

  return (
    <div className="ecommerce-container">
      <div className={`sidebar ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="menu-icon" />
          </button>
        </div>

        <nav className="category-nav">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      <div className="main-content">
        <header className="top-navbar">
          <div className="nav-actions">
            <button
              className="profile-button"
              onClick={() => alert('Connexion')}
            >
              <User className="icon" />
            </button>
            {/* Lien vers la page du panier */}
            <Link to="/CartPage">
              <button className="cart-button">
                <ShoppingCart className="icon" />
              </button>
            </Link>
          </div>
        </header>

        <div className="product-section">
          <h1 className="category-title">
            {selectedCategory || 'Sélectionnez une catégorie'}
          </h1>
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img 
                  src={product.image} 
                  alt={product.nom} 
                  className="product-image" 
                />
                <h3 className="product-name">{product.nom}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.prix} €</p>
                <button className="add-to-cart-btn" onClick={() => AjouterProduit(product)}>
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
