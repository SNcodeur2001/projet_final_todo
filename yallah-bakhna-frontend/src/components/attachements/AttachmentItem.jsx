import React from 'react';
import { Trash2, Download, FileText } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';

const AttachmentItem = ({ attachment, onDelete }) => {
  const handleDownload = () => {
    window.open(attachment.url, '_blank');
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette pièce jointe ?')) {
      onDelete(attachment.id);
    }
  };

  // Fonction pour déterminer l'icône en fonction du type de fichier
  const getFileIcon = (fileType) => {
    // Vous pouvez ajouter plus de types de fichiers selon vos besoins
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType.startsWith('application/pdf')) {
      return '📄';
    } else if (fileType.startsWith('text/')) {
      return '📝';
    }
    return '📎';
  };

  return (
    <div className="attachment-item">
      <div className="attachment-actions">
        <div className="text-2xl">
          {getFileIcon(attachment.type)}
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">
            {attachment.name}
          </h4>
          <p className="text-xs text-gray-500">
            {formatFileSize(attachment.size)}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleDownload}
          className="attachment-button"
          title="Télécharger"
        >
          <Download size={18} />
        </button>

        <button
          onClick={handleDelete}
          className="attachment-delete-button"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default AttachmentItem;
