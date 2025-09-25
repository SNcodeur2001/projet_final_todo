import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();

  // Rediriger vers le dashboard si déjà connecté
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
