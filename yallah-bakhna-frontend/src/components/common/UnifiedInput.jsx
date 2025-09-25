import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Upload, Image, AlertCircle, Check } from 'lucide-react';
import { validateFile } from '../../utils/validation';
import ErrorMessage, { FieldError, SuccessMessage } from './ErrorMessage';

const UnifiedInput = ({
  // Common props
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',

  // Form validation props
  fieldProps,
  fieldError,

  // Search props
  searchValue,
  onSearchChange,
  onClearSearch,
  showClearButton = false,

  // File upload props
  accept,
  onFileUpload,
  taskId,
  uploadService,
  maxSize = 5 * 1024 * 1024, // 5MB
  supportedFormats = ['PNG', 'JPG', 'GIF', 'WebP'],

  // Select props
  options = [],

  // Textarea props
  rows = 4,

  // Drag and drop props
  onDrop,
  dragActive = false,

  // Loading state
  loading = false,
  loadingText = 'Chargement...',

  // Success state
  successMessage,

  // Icon props
  leftIcon,
  rightIcon,

  // Size variants
  size = 'md', // sm, md, lg

  // Style variants
  variant = 'default', // default, outline, ghost
}) => {
  const [internalError, setInternalError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // Variant classes
  const variantClasses = {
    default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    outline: 'border-2 border-gray-300 focus:border-primary-500',
    ghost: 'border-transparent focus:border-gray-300'
  };

  // Base input classes
  const baseClasses = `
    block w-full rounded-lg border transition-colors
    bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${error || fieldError || internalError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
    ${className}
  `;

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;

    setInternalError(null);

    // Validate file
    const validationErrors = validateFile(file);
    if (validationErrors.length > 0) {
      setInternalError(validationErrors[0].message);
      return;
    }

    setUploading(true);
    try {
      if (uploadService && taskId) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await uploadService.upload(taskId, formData);
        setSuccess(`Fichier "${file.name}" uploadé avec succès !`);
        onFileUpload?.(response.data.data);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (uploadError) {
      let errorMessage = 'Erreur lors de l\'upload du fichier';

      if (uploadError.response?.data?.message) {
        errorMessage = uploadError.response.data.message;
      } else if (uploadError.response?.status === 413) {
        errorMessage = 'Le fichier est trop volumineux pour être uploadé';
      } else if (uploadError.response?.status === 415) {
        errorMessage = 'Type de fichier non supporté';
      } else if (uploadError.message) {
        errorMessage = uploadError.message;
      }

      setInternalError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  // Handle drag and drop
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Handle click to open file dialog
  const handleClick = () => {
    if (!uploading && !disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clear messages
  const clearMessages = () => {
    setInternalError(null);
    setSuccess(null);
  };

  // Render different input types
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...(fieldProps || {})}
            placeholder={placeholder}
            required={required}
            disabled={disabled || uploading}
            rows={rows}
            className={baseClasses}
          />
        );

      case 'select':
        return (
          <select
            {...(fieldProps || {})}
            required={required}
            disabled={disabled}
            className={baseClasses}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <>
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                ${dragOver || dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : internalError
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${uploading || disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading || disabled}
              />

              <div className="space-y-2">
                {internalError ? (
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                )}
                <p className="text-sm text-gray-600">
                  {uploading ? (
                    'Upload en cours...'
                  ) : (
                    <>
                      Glissez un fichier ici ou{' '}
                      <span className="attachment-upload-dropzone">
                        cliquez pour parcourir
                      </span>
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  Formats supportés: {supportedFormats.join(', ')} (max {Math.round(maxSize / 1024 / 1024)}MB)
                </p>
              </div>
            </div>

            {uploading && (
              <div className="attachment-upload-status">
                <div className="attachment-upload-spinner-small"></div>
                <span className="attachment-upload-status-text">
                  Upload en cours, veuillez patienter...
                </span>
              </div>
            )}
          </>
        );

      case 'search':
        return (
          <div className="relative">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {leftIcon}
              </div>
            )}
            <input
              type="text"
              {...(fieldProps || {})}
              placeholder={placeholder}
              disabled={disabled}
              className={`${baseClasses} ${leftIcon ? 'pl-10' : ''} ${showClearButton ? 'pr-10' : ''}`}
            />
            {showClearButton && (searchValue || (fieldProps?.value) || value) && (
              <button
                onClick={() => {
                  if (onClearSearch) onClearSearch();
                  if (fieldProps?.onChange) fieldProps.onChange({ target: { value: '' } });
                  if (onChange) onChange({ target: { value: '' } });
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        );

      default:
        return (
          <div className="relative">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {leftIcon}
              </div>
            )}
            <input
              type={type}
              {...(fieldProps || {})}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={`${baseClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            />
            {rightIcon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {rightIcon}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {/* Error Messages */}
      {(error || fieldError || internalError) && (
        <ErrorMessage
          message={error || fieldError || internalError}
          type="error"
          dismissible
          onDismiss={() => {
            setInternalError(null);
            if (fieldProps?.onErrorDismiss) fieldProps.onErrorDismiss();
          }}
        />
      )}

      {/* Success Messages */}
      {(successMessage || success) && (
        <SuccessMessage message={successMessage || success} />
      )}

      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      {renderInput()}

      {/* Field Error */}
      {fieldError && <FieldError error={fieldError} />}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-sm font-medium text-blue-700">
            {loadingText}
          </span>
        </div>
      )}
    </div>
  );
};

export default UnifiedInput;
