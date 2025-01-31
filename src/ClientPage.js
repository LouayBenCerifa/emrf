import React, { useState, useEffect } from 'react';
import { User, Menu, ShoppingCart, Search, LogOut, Bell, X } from 'lucide-react';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './ClientPage.css';

const ClientPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { addToCart, getItemCount } = useCart();
  const navigate = useNavigate();

  // Fetch user data and initial setup
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      fetchNotifications(parsedUserData.uid);
    }
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => doc.data().nom);
        setCategories(categoriesList);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de récupération des catégories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products by category
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;

      try {
        setLoading(true);
        const productsCollection = collection(db, 'produits');
        const q = query(productsCollection, where('categorie', '==', selectedCategory));
        const productsSnapshot = await getDocs(q);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Erreur de récupération des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Fetch notifications
  const fetchNotifications = async (uid) => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(notificationsRef, where('idClient', '==', uid));
      const querySnapshot = await getDocs(q);
      const fetchedNotifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })).sort((a, b) => b.timestamp - a.timestamp);
      
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  // Add to cart handler
  const handleAddToCart = (product) => {
    if (product && product.id) {
      addToCart({
        id: product.id,
        nom: product.nomProduit || '',
        prix: product.prix || 0,
        idVendeur: product.vendeur || '',
        image: product.image || '',
        description: product.description || ''
      });
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('PauserData');
    navigate('/');
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Clear a specific notification
  const clearNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const productName = (product.nomProduit || '').toLowerCase();
    const productDescription = (product.description || '').toLowerCase();
    
    return productName.includes(searchLower) || 
           productDescription.includes(searchLower);
  });

  // Render notifications dropdown
  const renderNotificationsDropdown = () => (
    <div className="notifications-dropdown">
      <div className="notifications-header">
        <h3>Notifications</h3>
        <button 
          className="close-notifications"
          onClick={toggleNotifications}
        >
          <X />
        </button>
      </div>
      {notifications.length === 0 ? (
        <p className="no-notifications">Pas de notifications</p>
      ) : (
        notifications.map(notification => (
          <div key={notification.id} className="notification-item">
            <div className="notification-content">
              <p>{notification.message}</p>
              <small>
                {notification.timestamp.toLocaleString()}
              </small>
            </div>
            <button 
              className="clear-notification"
              onClick={() => clearNotification(notification.id)}
            >
              <X />
            </button>
          </div>
        ))
      )}
    </div>
  );

  // Render loading state
  if (loading && !selectedCategory) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des catégories...</p>
      </div>
    );
  }

  return (
    <div className="ecommerce-container">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="main-content">
        <header className="top-navbar">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="nav-actions">
            <div className="notifications-container">
              <button 
                className="notification-icon" 
                onClick={toggleNotifications}
              >
                <Bell />
                {notifications.length > 0 && (
                  <span className="notification-badge">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && renderNotificationsDropdown()}
            </div>

            <button
              className="profile-button"
              onClick={() => navigate('/profile')}
            >
              <User className="icon" />
            </button>
            <button
              className="cart-button"
              onClick={() => navigate('/CartPage')}
            >
              <ShoppingCart className="icon" />
              {getItemCount() > 0 && (
                <span className="cart-count">{getItemCount()}</span>
              )}
            </button>
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              <LogOut className="icon" />
            </button>
          </div>
        </header>

        <div className="product-section">
          <h1 className="category-title">
            {selectedCategory || 'Sélectionnez une catégorie'}
          </h1>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des produits...</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img 
                      src={product.image || '/placeholder-image.jpg'} 
                      alt={product.nomProduit || 'Produit'}
                      className="product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{product.nomProduit || 'Sans nom'}</h3>
                    <p className="product-description">
                      {product.description || 'Aucune description disponible'}
                    </p>
                    <div className="product-footer">
                      <p className="product-price">{product.prix || 0} €</p>
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredProducts.length === 0 && !loading && (
            <div className="no-products">
              <p>Aucun produit trouvé{searchTerm ? ' pour votre recherche' : ' dans cette catégorie'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPage;