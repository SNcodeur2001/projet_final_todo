// Validation utilities with explicit error messages

export const ValidationRules = {
  // Email validation
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Veuillez saisir une adresse email valide (ex: nom@domaine.com)'
  },

  // Password validation
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)'
  },

  // Name validation
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    message: 'Le nom doit contenir entre 2 et 50 caractères et ne peut contenir que des lettres, espaces, apostrophes et tirets'
  },

  // Username validation
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères et ne peut contenir que des lettres, chiffres, tirets et underscores'
  },

  // Task title validation
  taskTitle: {
    minLength: 3,
    maxLength: 100,
    message: 'Le titre de la tâche doit contenir entre 3 et 100 caractères'
  },

  // Task description validation
  taskDescription: {
    maxLength: 1000,
    message: 'La description ne peut pas dépasser 1000 caractères'
  },

  // File validation
  file: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    messages: {
      size: 'Le fichier ne peut pas dépasser 5MB',
      type: 'Seuls les fichiers image sont autorisés (JPEG, PNG, GIF, WebP)'
    }
  }
};

export class ValidationError extends Error {
  constructor(field, message, value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

export const validateField = (field, value, rules) => {
  const errors = [];

  // Required field validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push(new ValidationError(field, `Le champ ${field} est obligatoire`, value));
    return errors; // Return early if required field is empty
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return errors;
  }

  // Length validations
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(new ValidationError(
      field, 
      `Le champ ${field} doit contenir au moins ${rules.minLength} caractères`, 
      value
    ));
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(new ValidationError(
      field, 
      `Le champ ${field} ne peut pas dépasser ${rules.maxLength} caractères`, 
      value
    ));
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(new ValidationError(field, rules.message || `Le format du champ ${field} est invalide`, value));
  }

  return errors;
};

export const validateEmail = (email) => {
  return validateField('email', email, {
    required: true,
    pattern: ValidationRules.email.pattern,
    message: ValidationRules.email.message
  });
};

export const validatePassword = (password) => {
  return validateField('mot de passe', password, {
    required: true,
    minLength: ValidationRules.password.minLength,
    pattern: ValidationRules.password.pattern,
    message: ValidationRules.password.message
  });
};

export const validatePasswordConfirmation = (password, confirmPassword) => {
  const errors = [];
  
  if (!confirmPassword || confirmPassword.trim() === '') {
    errors.push(new ValidationError('confirmPassword', 'La confirmation du mot de passe est obligatoire'));
    return errors;
  }

  if (password !== confirmPassword) {
    errors.push(new ValidationError('confirmPassword', 'Les mots de passe ne correspondent pas'));
  }

  return errors;
};

export const validateName = (name, fieldName = 'nom') => {
  return validateField(fieldName, name, {
    required: true,
    minLength: ValidationRules.name.minLength,
    maxLength: ValidationRules.name.maxLength,
    pattern: ValidationRules.name.pattern,
    message: ValidationRules.name.message
  });
};

export const validateUsername = (username) => {
  return validateField('nom d\'utilisateur', username, {
    required: true,
    minLength: ValidationRules.username.minLength,
    maxLength: ValidationRules.username.maxLength,
    pattern: ValidationRules.username.pattern,
    message: ValidationRules.username.message
  });
};

export const validateTaskTitle = (title) => {
  return validateField('titre', title, {
    required: true,
    minLength: ValidationRules.taskTitle.minLength,
    maxLength: ValidationRules.taskTitle.maxLength,
    message: ValidationRules.taskTitle.message
  });
};

export const validateTaskDescription = (description) => {
  return validateField('description', description, {
    required: false,
    maxLength: ValidationRules.taskDescription.maxLength,
    message: ValidationRules.taskDescription.message
  });
};

export const validateFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push(new ValidationError('file', 'Aucun fichier sélectionné'));
    return errors;
  }

  // Size validation
  if (file.size > ValidationRules.file.maxSize) {
    errors.push(new ValidationError('file', ValidationRules.file.messages.size, file));
  }

  // Type validation
  if (!ValidationRules.file.allowedTypes.includes(file.type)) {
    errors.push(new ValidationError('file', ValidationRules.file.messages.type, file));
  }

  return errors;
};

// Permission validation
export const validatePermissionName = (name) => {
  return validateField('nom de permission', name, {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[A-Z_]+$/,
    message: 'Le nom de permission doit contenir entre 3 et 50 caractères et ne peut contenir que des lettres majuscules et des underscores'
  });
};

export const validatePermissionDescription = (description) => {
  return validateField('description', description, {
    required: false,
    maxLength: 200,
    message: 'La description ne peut pas dépasser 200 caractères'
  });
};

// Comment validation
export const validateComment = (comment) => {
  return validateField('commentaire', comment, {
    required: true,
    minLength: 1,
    maxLength: 500,
    message: 'Le commentaire doit contenir entre 1 et 500 caractères'
  });
};

// URL validation
export const validateUrl = (url) => {
  return validateField('URL', url, {
    required: false,
    pattern: /^https?:\/\/.+/,
    message: 'L\'URL doit commencer par http:// ou https://'
  });
};

// Phone validation
export const validatePhone = (phone) => {
  return validateField('téléphone', phone, {
    required: false,
    pattern: /^(\+33|0)[1-9](\d{8})$/,
    message: 'Le numéro de téléphone doit être au format français valide'
  });
};

// Date validation
export const validateDate = (date, fieldName = 'date') => {
  const errors = [];
  
  if (!date) {
    errors.push(new ValidationError(fieldName, `Le champ ${fieldName} est obligatoire`));
    return errors;
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    errors.push(new ValidationError(fieldName, `Le format de ${fieldName} est invalide`));
  }

  return errors;
};

// Future date validation
export const validateFutureDate = (date, fieldName = 'date') => {
  const errors = validateDate(date, fieldName);
  if (errors.length > 0) return errors;

  const dateObj = new Date(date);
  const now = new Date();
  
  if (dateObj <= now) {
    errors.push(new ValidationError(fieldName, `La ${fieldName} doit être dans le futur`));
  }

  return errors;
};

// Form validation helper
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  let hasErrors = false;

  Object.keys(validationSchema).forEach(field => {
    const fieldErrors = validationSchema[field](formData[field], formData);
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      hasErrors = true;
    }
  });

  return { errors, hasErrors };
};

// Validation schemas for different forms
export const ValidationSchemas = {
  login: {
    login: (value) => validateEmail(value),
    password: (value) => validateField('mot de passe', value, { required: true })
  },

  register: {
    prenom: (value) => validateName(value, 'prénom'),
    nom: (value) => validateName(value, 'nom'),
    email: (value) => validateEmail(value),
    login: (value) => validateUsername(value),
    password: (value) => validatePassword(value),
    confirmPassword: (value, formData) => validatePasswordConfirmation(formData.password, value)
  },

  task: {
    libelle: (value) => validateField('libelle', value, {
      required: true,
      minLength: 3,
      maxLength: 100,
      message: "Le titre doit contenir entre 3 et 100 caractères"
    }),
    description: (value) => validateField('description', value, {
      required: false,
      maxLength: 500,
      message: "La description ne doit pas dépasser 500 caractères"
    }),
    status: (value) => validateField('status', value, {
      required: true,
      pattern: /^(EN_ATTENTE|EN_COURS|TERMINE)$/,
      message: "Statut invalide"
    }),
    dateDebut: (value) => {
      const errors = [];
      if (!value) return errors;
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push(new ValidationError('dateDebut', "Date de début invalide"));
      }
      return errors;
    },
    dateFin: (value, formData) => {
      const errors = [];
      if (!value) return errors;
      const fin = new Date(value);
      if (isNaN(fin.getTime())) {
        errors.push(new ValidationError('dateFin', "Date de fin invalide"));
        return errors;
      }
      if (formData.dateDebut) {
        const debut = new Date(formData.dateDebut);
        if (fin < debut) {
          errors.push(new ValidationError('dateFin', "La date de fin doit être postérieure à la date de début"));
        }
      }
      return errors;
    }
  },

  permission: {
    nom: (value) => validatePermissionName(value),
    description: (value) => validatePermissionDescription(value)
  },

  profile: {
    prenom: (value) => validateName(value, 'prénom'),
    nom: (value) => validateName(value, 'nom'),
    email: (value) => validateEmail(value),
    phone: (value) => validatePhone(value),
    bio: (value) => validateField('biographie', value, {
      required: false,
      maxLength: 500,
      message: 'La biographie ne peut pas dépasser 500 caractères'
    })
  },

  changePassword: {
    currentPassword: (value) => validateField('mot de passe actuel', value, { required: true }),
    newPassword: (value) => validatePassword(value),
    confirmPassword: (value, formData) => validatePasswordConfirmation(formData.newPassword, value)
  },

  comment: {
    content: (value) => validateComment(value)
  },

  contact: {
    name: (value) => validateName(value, 'nom'),
    email: (value) => validateEmail(value),
    subject: (value) => validateField('sujet', value, {
      required: true,
      minLength: 5,
      maxLength: 100,
      message: 'Le sujet doit contenir entre 5 et 100 caractères'
    }),
    message: (value) => validateField('message', value, {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: 'Le message doit contenir entre 10 et 1000 caractères'
    })
  },

  attachment: {
    file: (value) => validateFile(value)
  },

  profile: {
    prenom: (value) => validateName(value, 'prénom'),
    nom: (value) => validateName(value, 'nom'),
    email: (value) => validateEmail(value),
    phone: (value) => validatePhone(value),
    bio: (value) => validateField('biographie', value, {
      required: false,
      maxLength: 500,
      message: 'La biographie ne peut pas dépasser 500 caractères'
    })
  }
};

// Helper to get first error message for a field
export const getFieldError = (fieldErrors) => {
  if (!fieldErrors || fieldErrors.length === 0) return null;
  return fieldErrors[0].message;
};

// Helper to check if form has any errors
export const hasFormErrors = (errors) => {
  return Object.keys(errors).some(field => errors[field] && errors[field].length > 0);
};


