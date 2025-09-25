import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  // Rediriger vers le dashboard si déjà connecté
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoginForm />
    </div>
  );
};

export default LoginPage;