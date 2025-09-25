import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ValidationSchemas } from '../../utils/validation';
import ErrorMessage, { FieldError } from '../common/ErrorMessage';

const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

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
      login: '',
      password: ''
    },
    ValidationSchemas.login,
    {
      validateOnChange: true,
      validateOnBlur: true,
      validateOnSubmit: true
    }
  );

  const onSubmit = async (formData) => {
    try {
      await login(formData);
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
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Connexion
          </h2>
          <p className="text-gray-600">
            Connectez-vous à votre compte Yallah Bakhna
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <ErrorMessage
                message={error}
                type="error"
                className="slide-up"
              />
            )}

            <div className="space-y-5">
              <div className="input-group">
                <label className="form-label">Adresse email</label>
                <div className="relative">
                  <input
                    type="email"
                    {...getFieldProps('login')}
                    className={`form-input pl-12 ${hasFieldError('login') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="votre@email.com"
                    required
                  />
                  <div className="input-icon">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <FieldError error={getFieldErrorMessage('login')} />
                </div>
              </div>

              <div className="input-group">
                <label className="form-label">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...getFieldProps('password')}
                    className={`form-input pr-12 ${hasFieldError('password') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <div className="input-icon">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <FieldError error={getFieldErrorMessage('password')} />
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
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  <span>Se connecter</span>
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-secondary-200">
              <a
                href="/register"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 inline-flex items-center gap-2"
              >
                <span>Pas de compte ?</span>
                <span className="font-semibold">S'inscrire</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-secondary-500 text-sm">
          <p>© 2024 Yallah Bakhna. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;