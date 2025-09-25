import { useState, useCallback, useEffect } from 'react';
import { validateForm, getFieldError, hasFormErrors } from '../utils/validation';

export const useFormValidation = (initialValues, validationSchema, options = {}) => {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    validateOnSubmit = true,
    resetOnSubmit = false
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // Validate form and update validity state
  const validateFormData = useCallback((formData = values) => {
    if (!validationSchema) return { errors: {}, hasErrors: false };
    
    const validation = validateForm(formData, validationSchema);
    setIsValid(!validation.hasErrors);
    return validation;
  }, [values, validationSchema]);

  // Validate a single field
  const validateField = useCallback((fieldName, value = values[fieldName]) => {
    if (!validationSchema || !validationSchema[fieldName]) return [];
    
    return validationSchema[fieldName](value, values);
  }, [values, validationSchema]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Validate on change if enabled
    if (validateOnChange && touched[name]) {
      const fieldErrors = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors
      }));
    }
  }, [validateOnChange, touched, validateField]);

  // Handle input blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur if enabled
    if (validateOnBlur) {
      const fieldErrors = validateField(name);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors
      }));
    }
  }, [validateOnBlur, validateField]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allTouched);

        // Validate form if enabled
        if (validateOnSubmit) {
          const validation = validateFormData();
          setErrors(validation.errors);

          if (validation.hasErrors) {
            setIsSubmitting(false);
            return;
          }
        }

        // Call the submit handler
        await onSubmit(values);

        // Reset form if enabled
        if (resetOnSubmit) {
          setValues(initialValues);
          setErrors({});
          setTouched({});
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateOnSubmit, validateFormData, resetOnSubmit, initialValues]);

  // Get field props for easy integration
  const getFieldProps = useCallback((fieldName) => ({
    name: fieldName,
    value: values[fieldName] || '',
    onChange: handleChange,
    onBlur: handleBlur
  }), [values, handleChange, handleBlur]);

  // Get field error message
  const getFieldErrorMessage = useCallback((fieldName) => {
    if (!touched[fieldName] || !errors[fieldName]) return null;
    return getFieldError(errors[fieldName]);
  }, [touched, errors]);

  // Check if field has error
  const hasFieldError = useCallback((fieldName) => {
    return touched[fieldName] && errors[fieldName] && errors[fieldName].length > 0;
  }, [touched, errors]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValid(true);
  }, [initialValues]);

  // Set field value programmatically
  const setFieldValue = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Validate if field is touched and validation on change is enabled
    if (validateOnChange && touched[fieldName]) {
      const fieldErrors = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldErrors
      }));
    }
  }, [validateOnChange, touched, validateField]);

  // Set field error programmatically
  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: Array.isArray(error) ? error : [{ message: error }]
    }));
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);

  // Update validity when errors change
  useEffect(() => {
    setIsValid(!hasFormErrors(errors));
  }, [errors]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
    getFieldErrorMessage,
    hasFieldError,
    resetForm,
    setFieldValue,
    setFieldError,
    validateField,
    validateForm: validateFormData
  };
};

// Hook for simple field validation
export const useFieldValidation = (initialValue, validator) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const validate = useCallback((val = value) => {
    if (!validator) return null;
    
    const errors = validator(val);
    const errorMessage = getFieldError(errors);
    setError(errorMessage);
    return errorMessage;
  }, [value, validator]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (touched) {
      validate(newValue);
    }
  }, [touched, validate]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    validate();
  }, [validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValue,
    hasError: touched && !!error
  };
};