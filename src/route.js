// index.js ou App.js principal
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';  // votre composant de connexion
import HomePage from './acceuil';  // la nouvelle page d'accueil
import { getAuth } from "firebase/auth";
import vendeur from './Vendeur';
// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;


    <Navigate to="/HomePage" />;


  return children;
};

const RouterSetup = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route 
          path="/HomePage" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterSetup;