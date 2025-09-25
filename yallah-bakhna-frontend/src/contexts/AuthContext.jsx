/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';
import { formatError, getErrorMessage } from '../utils/errorHandler';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      // Vérification de la réponse du backend
      if (response.data && response.data.token) {
        const { token, user } = response.data;
        
        // Stockage du token avec Bearer
        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        localStorage.setItem('token', bearerToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Configuration du header Axios
        api.defaults.headers.common['Authorization'] = bearerToken;
        
        setUser(user);
        return response.data;
      } else {
        throw new Error('Token non reçu du serveur');
      }
    } catch (err) {
      const formattedError = formatError(err);
      setError(formattedError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);

      if (response.status === 'success') {
        // Registration successful, user can now login
        return response;
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      const formattedError = formatError(err);
      setError(formattedError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Supprimer le token et l'utilisateur du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Supprimer le header d'autorisation
    delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  useEffect(() => {
    // Vérifier le token au chargement
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        // Configurer le header par défaut
        api.defaults.headers.common['Authorization'] = token;
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // En cas d'erreur, nettoyer le storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
  }, []); // Exécuter une seule fois au montage

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};