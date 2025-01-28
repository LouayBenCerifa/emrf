import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Users, Box, Layers, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { db } from './firebase';
import { Button, Card, CardContent, Typography } from '@mui/material';
import './AdminPage.css';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({ users: 0, products: 0, categories: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchStats = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const productsCollection = collection(db, 'produits');
      const categoriesCollection = collection(db, 'categories');
      const [usersSnap, productsSnap, categoriesSnap] = await Promise.all([
        getDocs(usersCollection),
        getDocs(productsCollection),
        getDocs(categoriesCollection),
      ]);
      setStats({
        users: usersSnap.size,
        products: productsSnap.size,
        categories: categoriesSnap.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchData = async (type) => {
    try {
      const collectionRef = collection(db, type);
      const snapshot = await getDocs(collectionRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (type === 'users') setUsers(data);
      if (type === 'produits') setProducts(data);
      if (type === 'categories') setCategories(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab === 'users') fetchData('users');
    if (activeTab === 'products') fetchData('produits');
    if (activeTab === 'categories') fetchData('categories');
  }, [activeTab]);

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await addDoc(collection(db, 'categories'), { nom: newCategory.trim() });
        fetchData('categories');
        setNewCategory('');
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleEdit = (item) => {
    console.log('Edit Item', item);
    // Ajoutez ici la logique d'édition si nécessaire
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteDoc(doc(db, type, id));
      fetchData(type); // Rafraîchir les données après suppression
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li>
              <button
                className={`flex items-center ${activeTab === 'users' ? 'bg-blue-600' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Users className="mr-2" /> Users
              </button>
            </li>
            <li>
              <button
                className={`flex items-center ${activeTab === 'products' ? 'bg-blue-600' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <Box className="mr-2" /> Products
              </button>
            </li>
            <li>
              <button
                className={`flex items-center ${activeTab === 'categories' ? 'bg-blue-600' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <Layers className="mr-2" /> Categories
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Stats Section */}
        <div className="stats-cards">
          <Card className="card">
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{stats.users}</Typography>
            </CardContent>
          </Card>
          <Card className="card">
            <CardContent>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4">{stats.products}</Typography>
            </CardContent>
          </Card>
          <Card className="card">
            <CardContent>
              <Typography variant="h6">Total Categories</Typography>
              <Typography variant="h4">{stats.categories}</Typography>
            </CardContent>
          </Card>
        </div>

        {/* Active Tab Content */}
        <div>
          {activeTab === 'users' && (
            <div>
              <h2>User Management</h2>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nom}</td>
                      <td>{user.email}</td>
                      <td>
                        <Button onClick={() => handleEdit(user)}><Edit /></Button>
                        <Button onClick={() => handleDelete(user.id, 'users')}><Trash2 /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2>Product Management</h2>
              <table className="product-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.nom}</td>
                      <td>{product.prix}</td>
                      <td>
                        <Button onClick={() => handleEdit(product)}><Edit /></Button>
                        <Button onClick={() => handleDelete(product.id, 'produits')}><Trash2 /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h2>Category Management</h2>
              <div className="add-category-section">
                <input
                  type="text"
                  placeholder="New Category Name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={handleAddCategory}>
                  <PlusCircle className="mr-2" /> Add Category
                </Button>
              </div>
              <table className="category-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.nom}</td>
                      <td>
                        <Button onClick={() => handleEdit(category)}><Edit /></Button>
                        <Button onClick={() => handleDelete(category.id, 'categories')}><Trash2 /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
