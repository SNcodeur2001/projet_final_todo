import api from './api';

import { formatError } from '../utils/errorHandler';

export const attachmentService = {
  getAttachments: (taskId) => api.get(`/taches/${taskId}/attachments`),
  upload: async (taskId, formData) => {
    try {
      const response = await api.post(`/taches/${taskId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      const formattedError = formatError(error);
      throw formattedError;
    }
  },
  delete: (attachmentId) => api.delete(`/taches/attachments/${attachmentId}`)
};