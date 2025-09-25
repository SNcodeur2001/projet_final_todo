import React from 'react';
import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const ErrorMessage = ({
  message,
  type = 'error',
  errors = null,
  className = '',
  showIcon = true,
  dismissible = false,
  onDismiss = null
}) => {
  if (!message && (!errors || errors.length === 0)) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-400',
          IconComponent: XCircle
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-400',
          IconComponent: AlertTriangle
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-400',
          IconComponent: Info
        };
      case 'validation':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-400',
          IconComponent: AlertCircle
        };
      default:
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-400',
          IconComponent: XCircle
        };
    }
  };

  const { container, icon, IconComponent } = getTypeStyles();

  const renderContent = () => {
    if (errors && errors.length > 0) {
      return (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm font-medium">
              {error.message || error}
            </p>
          ))}
        </div>
      );
    }

    return <p className="text-sm font-medium">{message}</p>;
  };

  return (
    <div className={`rounded-lg border p-4 mb-4 ${container} ${className}`}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <IconComponent className={`h-5 w-5 ${icon}`} />
          </div>
        )}
        <div className={showIcon ? 'ml-3' : ''}>
          {renderContent()}
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${icon}`}
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Field-level error component
export const FieldError = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <p className={`mt-1 text-sm text-red-600 ${className}`}>
      {error}
    </p>
  );
};

// Success message component
export const SuccessMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`rounded-lg bg-green-50 border border-green-200 p-4 mb-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
