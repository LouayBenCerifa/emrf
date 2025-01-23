import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User, Users, Box, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { db } from './firebase';

function AdminPage() {
  const [showUsers, setShowUsers] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'produits');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error fetching categories:", error );
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const productsQuery = query(
        collection(db, 'produits'), 
        where('categorie', '==', newCategory.trim())
      );
      const productsSnapshot = await getDocs(productsQuery);
      const productCount = productsSnapshot.size;

      const categoryData = {
        'nom': newCategory.trim(),
        'nbre-produits': productCount
      };

      try {
        const categoriesCollection = collection(db, 'categories');
        await addDoc(categoriesCollection, categoryData);
        await fetchCategories();
        setNewCategory('');
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleEditCategory = async (category) => {
    setEditingCategory(category);
    setNewCategory(category['nom']);
  };

  const handleUpdateCategory = async () => {
    if (editingCategory && newCategory.trim()) {
      try {
        const categoryDoc = doc(db, 'categories', editingCategory.id);
        await updateDoc(categoryDoc, {
          'nom': newCategory.trim()
        });
        await fetchCategories();
        setEditingCategory(null);
        setNewCategory('');
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const categoryDoc = doc(db, 'categories', categoryId);
      await deleteDoc(categoryDoc);
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleBanUser  = async (userId) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, { banned: true });
      await fetchUsers();
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const handleDeleteUser  = async (userId) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await deleteDoc(userDoc);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    if (showUsers) {
      fetchUsers();
    }
    if (showProducts) {
      fetchProducts();
    }
    if (showCategories) {
      fetchCategories();
    }
  }, [showUsers, showProducts, showCategories]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center mb-8">
        <div className="mr-4">
          <User  className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Bienvenue sur votre espace Admin</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Gérer les Utilisateurs</h2>
          <button 
            onClick={() => setShowUsers(!showUsers)}
            className="flex items-center bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition mb-4"
          >
            <Users className="mr-2" /> 
            {showUsers ? 'Masquer Utilisateurs' : 'Afficher Utilisateurs'}
          </button>
          {showUsers && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Liste des Utilisateurs</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border p-3">Nom</th>
                    <th className="border p-3">Prénom</th>
                    <th className="border p-3">Rôle</th>
                    <th className="border p-3">Adresse</th>
                    <th className="border p-3">Téléphone</th>
                    <th className="border p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-200">
                      <td className="border p-3">{user.nom || 'N/A'}</td>
                      <td className="border p-3">{user.prenom || 'N/A'}</td>
                      <td className="border p-3">{user.role || 'N /A'}</td>
                      <td className="border p-3">{user.adresse || 'N/A'}</td>
                      <td className="border p-3">{user.tel || 'N/A'}</td>
                      <td className="border p-3 flex space-x-2">
                        <button 
                          onClick={() => handleBanUser (user.id)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          Bannir
                        </button>
                        <button 
                          onClick={() => handleDeleteUser (user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Gérer les Produits</h2>
          <button 
            onClick={() => setShowProducts(!showProducts)}
            className="flex items-center bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition mb-4"
          >
            <Box className="mr-2" />
            {showProducts ? 'Masquer Produits' : 'Afficher Produits'}
          </button>
          {showProducts && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Liste des Produits</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border p-3">Nom</th>
                    <th className="border p-3">Prix</th>
                    <th className="border p-3">Catégorie</th>
                    <th className="border p-3">Stock</th>
                    <th className="border p-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-200">
                      <td className="border p-3">{product.nom || 'N/A'}</td>
                      <td className="border p-3">{product.prix ? `${product.prix} €` : 'N/A'}</td>
                      <td className="border p-3">{product.categorie || 'N/A'}</td>
                      <td className="border p-3">{product.stock || 'N/A'}</td>
                      <td className="border p-3">{product.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Gérer les Catégories</h2>
          <button 
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition mb-4"
          >
            <PlusCircle className="mr-2" />
            {showCategories ? 'Masquer Catégories' : 'Afficher Catégories'}
          </button>
          <div className="mb-4">
            <input 
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nom de la catégorie"
              className="flex-grow border rounded px-4 py-2 mb-2"
            />
            {editingCategory ? (
              <button 
                onClick={handleUpdateCategory}
                className="flex items-center bg-yellow-600 text-white px-5 py-3 rounded-lg hover:bg-yellow-700 transition"
              >
                Mettre à jour
              </button>
            ) : (
              <button 
                onClick={handleAddCategory}
                className="flex items-center bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                <PlusCircle className="mr-2" /> Ajouter Catégorie
              </button>
            )}
          </div>
          {showCategories && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Liste des Catégories</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="border p-3">Nom</th>
                    <th className="border p-3">Nombre de Produits</th>
                    < th className="border p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-200">
                      <td className="border p-3">{category['nom']}</td>
                      <td className="border p-3">{category['nbre-produits']}</td>
                      <td className="border p-3 flex space-x-2">
                        <button 
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>
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