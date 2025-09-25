import React, { useState, useEffect, useCallback } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { attachmentService } from '../../services/attachmentService';

const AttachmentList = ({ taskId }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchAttachments = useCallback(async () => {
    if (!taskId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await attachmentService.getAttachments(taskId);
      // Handle different response structures
      const attachmentsData = response.data?.data || response.data || [];
      setAttachments(Array.isArray(attachmentsData) ? attachmentsData : []);
    } catch (error) {
      setError(error.message);
      setAttachments([]); // Ensure attachments is always an array
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation de la taille et du type
    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 5 Mo');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non supporté. Utilisez JPG, PNG ou PDF');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await attachmentService.upload(taskId, formData);
      // Handle different response structures
      const newAttachment = response.data?.data || response.data;
      if (newAttachment) {
        setAttachments([...attachments, newAttachment]);
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de l\'upload du fichier');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const handleRemoveAttachment = async (attachmentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette pièce jointe ?')) {
      try {
        await attachmentService.delete(attachmentId);
        setAttachments(attachments.filter(a => a.id !== attachmentId));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Rendu de l'erreur avec un style adapté au type
  const renderError = () => {
    if (!error) return null;

    const errorStyles = {
      validation: 'bg-orange-50 border-orange-200 text-orange-700',
      auth: 'bg-red-50 border-red-200 text-red-700',
      permission: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      api: 'bg-red-50 border-red-200 text-red-700',
      unknown: 'bg-gray-50 border-gray-200 text-gray-700'
    };

    return (
      <div className={`border rounded-lg p-4 mb-4 ${errorStyles[error.type] || errorStyles.unknown}`}>
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">{error}</p>
            {error.errors && (
              <ul className="mt-2 text-sm list-disc list-inside">
                {error.errors.map((err, index) => (
                  <li key={index}>{err.message}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => setError(null)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  if (!taskId) {
    return (
      <div className="text-center py-12">
        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des pièces jointes</h3>
        <p className="text-gray-600">
          Sélectionnez une tâche dans l'onglet "Tâches" pour gérer ses pièces jointes.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="attachment-upload-loading">
        <div className="attachment-list-loading"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderError()}

      <div className="flex justify-between items-center">
        <h3 className="attachment-list-header">Pièces jointes</h3>
        <label className="attachment-upload-button">
          <Upload className="w-4 h-4 mr-2" />
          <span>Ajouter un fichier</span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {attachments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Aucune pièce jointe</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="attachment-upload-item"
            >
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium truncate">{attachment.filename}</p>
                  <p className="text-sm text-gray-500">
                    {Math.round(attachment.size / 1024)} Ko
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveAttachment(attachment.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Supprimer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="attachment-upload-loading">
          <div className="attachment-upload-spinner"></div>
          <span className="attachment-upload-text">Envoi en cours...</span>
        </div>
      )}
    </div>
  );
};

export default AttachmentList;