import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // Ne déconnectez que pour les erreurs d'authentification expirée
    if (status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Pour les erreurs 403, retournez simplement l'erreur
    if (status === 403) {
      return Promise.reject({
        ...error,
        message: error.response?.data?.message || 'Vous n\'avez pas les permissions nécessaires'
      });
    }

    return Promise.reject(error);
  }
);

export default api;