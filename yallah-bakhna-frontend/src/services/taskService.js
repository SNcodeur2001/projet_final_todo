import api from "./api";
import { formatError } from "../utils/errorHandler";

export const taskService = {
  // Get all tasks
  getTasks: async () => {
    try {
      const response = await api.get("/taches");
      return response.data;
    } catch (error) {
      console.error("Erreur getTasks:", error.response?.data);
      throw error;
    }
  },

  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/taches/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la récupération de la tâche"
      );
    }
  },

  // Create task
  createTask: async (taskData) => {
    try {
      let data;
      
      // Si les données contiennent un fichier, utilisez FormData
      if (taskData instanceof FormData) {
        data = taskData;
      } else {
        // Sinon, créez un nouveau FormData
        const formData = new FormData();
        
        // Ajout des champs texte
        if (taskData.libelle) formData.append("libelle", taskData.libelle);
        if (taskData.description) formData.append("description", taskData.description);
        if (taskData.status) formData.append("status", taskData.status);
        
        // Ajout du fichier audio si présent
        if (taskData.audioFile) {
          formData.append("audio", taskData.audioFile);
        }
        
        data = formData;
      }

      const response = await api.post("/taches", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data) {
        throw new Error("Aucune donnée reçue du serveur");
      }

      return response.data;
    } catch (error) {
      console.error("Erreur createTask:", error.response?.data);
      throw new Error(
        error.response?.data?.message || 
        "Erreur lors de la création de la tâche"
      );
    }
  },

  // Update task
  updateTask: async (id, data) => {
    try {
      const response = await api.put(`/taches/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur updateTask:", error.response?.data);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/taches/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur deleteTask:", error.response?.data);
      throw error;
    }
  },

  // Mark task as complete
  markAsComplete: async (id) => {
    try {
      const response = await api.patch(`/taches/${id}/termine`);
      return response.data;
    } catch (error) {
      console.error("Erreur markAsComplete:", error.response?.data);
      throw error;
    }
  },

  // Permissions
  getTaskPermissions: async (taskId) => {
    try {
      const response = await api.get(`/taches/${taskId}/permissions`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la récupération des permissions"
      );
    }
  },

  addPermission: async (taskId, data) => {
    try {
      const response = await api.post(`/taches/${taskId}/permissions`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de l'ajout de la permission"
      );
    }
  },

  removePermission: async (taskId, userId) => {
    try {
      const response = await api.delete(
        `/taches/${taskId}/permissions/${userId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la suppression de la permission"
      );
    }
  },

  // Attachments
  getAttachments: async (taskId) => {
    try {
      const response = await api.get(`/taches/${taskId}/attachments`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la récupération des pièces jointes"
      );
    }
  },

  addAttachment: async (taskId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        `/taches/${taskId}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      const formattedError = formatError(error);
      throw formattedError;
    }
  },

  removeAttachment: async (attachmentId) => {
    try {
      const response = await api.delete(`/taches/attachments/${attachmentId}`);
      return response.data;
    } catch (error) {
      const formattedError = formatError(error);
      throw formattedError;
    }
  },

  // Get all users (for permissions dropdown)
  getUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la récupération des utilisateurs"
      );
    }
  },

  // Get all completed tasks
  getCompletedTasks: async () => {
    try {
      const response = await api.get('/taches/terminees');
      return response.data;
    } catch (error) {
      console.error('Erreur getCompletedTasks:', error.response?.data);
      throw error;
    }
  },
};
