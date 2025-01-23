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
      console.error("Error fetching categories:", error);
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
        'nom-cat': newCategory.trim(),
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
    setNewCategory(category['nom-cat']);
  };

  const handleUpdateCategory = async () => {
    if (editingCategory && newCategory.trim()) {
      try {
        const categoryDoc = doc(db, 'categories', editingCategory.id);
        await updateDoc(categoryDoc, {
          'nom-cat': newCategory.trim()
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center mb-6">
        <div className="mr-4">
          <User className="w-12 h-12 text-gray-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Bienvenue sur votre espace Admin</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="mb-4 text-gray-600">Gérez les utilisateurs, les produits et les commandes.</p>

        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setShowUsers(!showUsers)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            <Users className="mr-2" /> 
            {showUsers ? 'Masquer Utilisateurs' : 'Afficher Utilisateurs'}
          </button>

          <button 
            onClick={() => setShowProducts(!showProducts)}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            <Box className="mr-2" />
            {showProducts ? 'Masquer Produits' : 'Afficher Produits'}
          </button>

          <button 
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            <PlusCircle className="mr-2" />
            {showCategories ? 'Masquer Catégories' : 'Afficher Catégories'}
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Ajouter/Modifier une Catégorie</h2>
          <div className="flex space-x-4">
            <input 
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nom de la catégorie"
              className="flex-grow border rounded px-3 py-2"
            />
            {editingCategory ? (
              <button 
                onClick={handleUpdateCategory}
                className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Mettre à jour
              </button>
            ) : (
              <button 
                onClick={handleAddCategory}
                className="flex items-center bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
              >
                <PlusCircle className="mr-2" /> Ajouter Catégorie
              </button>
            )}
          </div>
        </div>

        {showCategories && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Liste des Catégories</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Nombre de Produits</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-100">
                    <td className="border p-2">{category['nom-cat']}</td>
                    <td className="border p-2">{category['nbre-produits']}</td>
                    <td className="border p-2 flex space-x-2">
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-500 hover:text-red-700"
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

        {showUsers && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Liste des Utilisateurs</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Prénom</th>
                  <th className="border p-2">Rôle</th>
                  <th className="border p-2">Adresse</th>
                  <th className="border p-2">Téléphone</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="border p-2">{user.nom || 'N/A'}</td>
                    <td className="border p-2">{user.prenom || 'N/A'}</td>
                    <td className="border p-2">{user.role || 'N/A'}</td>
                    <td className="border p-2">{user.adresse || 'N/A'}</td>
                    <td className="border p-2">{user.tel || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showProducts && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Liste des Produits</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Prix</th>
                  <th className="border p-2">Catégorie</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="border p-2">{product.nom || 'N/A'}</td>
                    <td className="border p-2">{product.prix ? `${product.prix} €` : 'N/A'}</td>
                    <td className="border p-2">{product.categorie || 'N/A'}</td>
                    <td className="border p-2">{product.stock || 'N/A'}</td>
                    <td className="border p-2">{product.description || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;