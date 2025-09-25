export const formatError = (error) => {
  // Erreurs de réseau
  if (!error.response) {
    if (error.code === 'NETWORK_ERROR') {
      return {
        type: 'network',
        message: 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.'
      };
    }
    if (error.code === 'ECONNABORTED') {
      return {
        type: 'timeout',
        message: 'La requête a expiré. Veuillez réessayer.'
      };
    }
    return {
      type: 'network',
      message: 'Impossible de contacter le serveur. Vérifiez votre connexion.'
    };
  }

  const status = error.response.status;
  const data = error.response.data;

  // Erreurs de validation (400)
  if (status === 400) {
    if (data?.errors && Array.isArray(data.errors)) {
      return {
        type: 'validation',
        message: data.errors.map(err => err.message || err).join('\n'),
        errors: data.errors,
        fields: data.errors.reduce((acc, err) => {
          if (err.field) {
            acc[err.field] = err.message;
          }
          return acc;
        }, {})
      };
    }
    
    if (data?.message) {
      return {
        type: 'validation',
        message: data.message
      };
    }

    return {
      type: 'validation',
      message: 'Les données fournies sont invalides.'
    };
  }

  // Erreur d'authentification (401)
  if (status === 401) {
    const messages = {
      'INVALID_CREDENTIALS': 'Email ou mot de passe incorrect.',
      'TOKEN_EXPIRED': 'Votre session a expiré. Veuillez vous reconnecter.',
      'TOKEN_INVALID': 'Session invalide. Veuillez vous reconnecter.',
      'ACCOUNT_LOCKED': 'Votre compte a été temporairement verrouillé.',
      'ACCOUNT_DISABLED': 'Votre compte a été désactivé. Contactez l\'administrateur.'
    };

    return {
      type: 'auth',
      message: messages[data?.code] || data?.message || 'Authentification requise. Veuillez vous connecter.'
    };
  }

  // Erreur d'autorisation (403)
  if (status === 403) {
    const messages = {
      'INSUFFICIENT_PERMISSIONS': 'Vous n\'avez pas les permissions nécessaires pour cette action.',
      'RESOURCE_FORBIDDEN': 'Accès refusé à cette ressource.',
      'ACTION_FORBIDDEN': 'Cette action n\'est pas autorisée.'
    };

    return {
      type: 'permission',
      message: messages[data?.code] || data?.message || 'Vous n\'avez pas les permissions nécessaires.'
    };
  }

  // Erreur de ressource non trouvée (404)
  if (status === 404) {
    return {
      type: 'notFound',
      message: data?.message || 'La ressource demandée n\'a pas été trouvée.'
    };
  }

  // Erreur de conflit (409)
  if (status === 409) {
    const messages = {
      'EMAIL_ALREADY_EXISTS': 'Cette adresse email est déjà utilisée.',
      'USERNAME_ALREADY_EXISTS': 'Ce nom d\'utilisateur est déjà pris.',
      'RESOURCE_CONFLICT': 'Un conflit a été détecté avec les données existantes.'
    };

    return {
      type: 'conflict',
      message: messages[data?.code] || data?.message || 'Un conflit a été détecté.'
    };
  }

  // Erreur de fichier trop volumineux (413)
  if (status === 413) {
    return {
      type: 'fileSize',
      message: 'Le fichier est trop volumineux. Taille maximale autorisée: 5MB.'
    };
  }

  // Erreur de type de fichier non supporté (415)
  if (status === 415) {
    return {
      type: 'fileType',
      message: 'Type de fichier non supporté. Seules les images sont autorisées.'
    };
  }

  // Erreur de limite de taux (429)
  if (status === 429) {
    return {
      type: 'rateLimit',
      message: 'Trop de tentatives. Veuillez patienter avant de réessayer.'
    };
  }

  // Erreurs serveur (5xx)
  if (status >= 500) {
    const messages = {
      500: 'Erreur interne du serveur. Veuillez réessayer plus tard.',
      502: 'Service temporairement indisponible. Veuillez réessayer.',
      503: 'Service en maintenance. Veuillez réessayer plus tard.',
      504: 'Le serveur met trop de temps à répondre. Veuillez réessayer.'
    };

    return {
      type: 'server',
      message: messages[status] || 'Erreur du serveur. Veuillez réessayer plus tard.'
    };
  }

  // Erreurs génériques du backend
  if (data?.message) {
    return {
      type: 'api',
      message: data.message
    };
  }

  // Erreur par défaut
  return {
    type: 'unknown',
    message: 'Une erreur inattendue est survenue. Veuillez réessayer.'
  };
};

// Helper pour extraire les erreurs de champs spécifiques
export const getFieldErrors = (error) => {
  const formatted = formatError(error);
  return formatted.fields || {};
};

// Helper pour vérifier si une erreur est de type validation
export const isValidationError = (error) => {
  const formatted = formatError(error);
  return formatted.type === 'validation';
};

// Helper pour vérifier si une erreur nécessite une reconnexion
export const requiresReauth = (error) => {
  const formatted = formatError(error);
  return formatted.type === 'auth';
};

// Helper pour obtenir un message d'erreur court
export const getErrorMessage = (error) => {
  const formatted = formatError(error);
  return formatted.message;
};