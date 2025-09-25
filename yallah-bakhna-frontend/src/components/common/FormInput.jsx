import React, { forwardRef } from 'react';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { FieldError } from './ErrorMessage';

const FormInput = forwardRef(({
  label,
  error,
  success,
  required = false,
  type = 'text',
  placeholder,
  icon: Icon,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  className = '',
  inputClassName = '',
  labelClassName = '',
  helpText,
  disabled = false,
  ...props
}, ref) => {
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  const getInputClasses = () => {
    let classes = `form-input block w-full ${inputClassName}`;
    
    if (Icon || showPasswordToggle) {
      classes += Icon ? ' pl-12' : '';
      classes += showPasswordToggle ? ' pr-12' : '';
    }
    
    if (hasError) {
      classes += ' border-red-300 focus:border-red-500 focus:ring-red-500';
    } else if (hasSuccess) {
      classes += ' border-green-300 focus:border-green-500 focus:ring-green-500';
    }
    
    if (disabled) {
      classes += ' bg-gray-50 cursor-not-allowed';
    }
    
    return classes;
  };

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className={`form-label ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClasses()}
          {...props}
        />
        
        {/* Left icon */}
        {Icon && (
          <div className="input-icon">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        {/* Password toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
        
        {/* Status icons */}
        {(hasError || hasSuccess) && !showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {hasError && <AlertCircle className="w-5 h-5 text-red-400" />}
            {hasSuccess && <Check className="w-5 h-5 text-green-400" />}
          </div>
        )}
      </div>
      
      {/* Help text */}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      
      {/* Error message */}
      <FieldError error={error} />
      
      {/* Success message */}
      {success && !error && (
        <p className="mt-1 text-sm text-green-600">{success}</p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;