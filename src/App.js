import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import ClientPage from './ClientPage';
import VendeurPage from './VendeurPage';
import './App.css';
import AdminPage from './AdminPage';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    tel: '',
    adresse: '',
    role: 'Client', // Role par défaut
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name || id]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setMessage({ text: 'Connexion réussie!', type: 'success' });
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.role === 'Client') {
          navigate('/client');
        } else if (userData.role === 'Vendeur') {
          navigate('/vendeur');
          
        }
        else  if (userData.role === 'admin'){
          navigate('/Admin');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setMessage({ text: 'Email ou mot de passe incorrect', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;

      const user = { ...formData };
      delete user.password;
      await setDoc(doc(db, 'users', uid), user);

      setMessage({ text: 'Compte créé avec succès!', type: 'success' });
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        tel: '',
        adresse: '',
        role: 'Client',
      });
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setMessage({ text: "Erreur lors de l'inscription", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="auth-buttons">
        <button className={`toggle-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
          Connexion
        </button>
        <button className={`toggle-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
          Inscription
        </button>
      </div>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
      {loading && <div className="loading">Chargement...</div>}

      <form onSubmit={isLogin ? handleLogin : handleSignup}>
        <fieldset>
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input type="text" id="nom" value={formData.nom} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="prenom">Prénom</label>
                <input type="text" id="prenom" value={formData.prenom} onChange={handleChange} required />
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange} required />
          </div>
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="tel">Téléphone</label>
                <input type="tel" id="tel" value={formData.tel} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="adresse">Adresse</label>
                <textarea id="adresse" value={formData.adresse} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group" id='role'>
                <label>Vous êtes ?</label>
                <div>
                <div className='role'>Client
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="Client"
                      checked={formData.role === 'Client'}
                      onChange={handleChange}
                    />
                    
                  </label >
                  </div>
                  <label>
                  Vendeur
                    <input
                      type="radio"
                      name="role"
                      value="Vendeur"
                      checked={formData.role === 'Vendeur'}
                      onChange={handleChange}
                    />
                    
                  </label>
                </div>
              </div>
            </>
          )}
          <button type="submit" disabled={loading}>
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </fieldset>
      </form>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/vendeur" element={<VendeurPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppWithRouter;