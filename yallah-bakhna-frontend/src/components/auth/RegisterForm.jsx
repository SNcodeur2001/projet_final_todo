import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ValidationSchemas } from '../../utils/validation';
import ErrorMessage, { FieldError, SuccessMessage } from '../common/ErrorMessage';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
    getFieldErrorMessage,
    hasFieldError,
    setFieldError
  } = useFormValidation(
    {
      prenom: '',
      nom: '',
      email: '',
      login: '',
      password: '',
      confirmPassword: ''
    },
    ValidationSchemas.register,
    {
      validateOnChange: true,
      validateOnBlur: true,
      validateOnSubmit: true
    }
  );

  const onSubmit = async (formData) => {
    try {
      await register(formData);
      setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Handle specific validation errors from server
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(error => {
          if (error.field) {
            setFieldError(error.field, error.message);
          }
        });
      }
      throw err; // Re-throw to let useAuth handle it
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Inscription
          </h2>
          <p className="text-gray-600">
            Créez votre compte Yallah Bakhna
          </p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {successMessage && (
              <SuccessMessage message={successMessage} className="slide-up" />
            )}
            
            {error && (
              <ErrorMessage
                message={error}
                type="error"
                className="slide-up"
              />
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="form-label">Prénom</label>
                  <div className="relative">
                    <input
                      name="prenom"
                      type="text"
                      required
                      {...getFieldProps('prenom')}
                      className={`form-input pl-12 ${hasFieldError('prenom') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Votre prénom"
                    />
                    <div className="input-icon">
                      <User className="w-5 h-5" />
                    </div>
                    <FieldError error={getFieldErrorMessage('prenom')} />
                  </div>
                </div>

                <div className="input-group">
                  <label className="form-label">Nom</label>
                  <div className="relative">
                    <input
                      name="nom"
                      type="text"
                      required
                      {...getFieldProps('nom')}
                      className={`form-input pl-12 ${hasFieldError('nom') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Votre nom"
                    />
                    <div className="input-icon">
                      <User className="w-5 h-5" />
                    </div>
                    <FieldError error={getFieldErrorMessage('nom')} />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label className="form-label">Email</label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    required
                    {...getFieldProps('email')}
                    className={`form-input pl-12 ${hasFieldError('email') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="votre@email.com"
                  />
                  <div className="input-icon">
                    <Mail className="w-5 h-5" />
                  </div>
                  <FieldError error={getFieldErrorMessage('email')} />
                </div>
              </div>

              <div className="input-group">
                <label className="form-label">Nom d'utilisateur</label>
                <div className="relative">
                  <input
                    name="login"
                    type="text"
                    required
                    {...getFieldProps('login')}
                    className={`form-input pl-12 ${hasFieldError('login') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="votre_login"
                  />
                  <div className="input-icon">
                    <User className="w-5 h-5" />
                  </div>
                  <FieldError error={getFieldErrorMessage('login')} />
                </div>
              </div>

              <div className="input-group">
                <label className="form-label">Mot de passe</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    {...getFieldProps('password')}
                    className={`form-input pr-12 ${hasFieldError('password') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <div className="input-icon">
                    <Lock className="w-5 h-5" />
                  </div>
                  <FieldError error={getFieldErrorMessage('password')} />
                </div>
              </div>

              <div className="input-group">
                <label className="form-label">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    {...getFieldProps('confirmPassword')}
                    className={`form-input pl-12 ${hasFieldError('confirmPassword') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <div className="input-icon">
                    <Lock className="w-5 h-5" />
                  </div>
                  <FieldError error={getFieldErrorMessage('confirmPassword')} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isValid}
              onClick={handleSubmit(onSubmit)}
              className="w-full btn btn-primary text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5 mr-2"></div>
                  <span>Inscription en cours...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  <span>S'inscrire</span>
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 inline-flex items-center gap-2"
              >
                <span>Déjà un compte ?</span>
                <span className="font-semibold">Se connecter</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 Yallah Bakhna. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
