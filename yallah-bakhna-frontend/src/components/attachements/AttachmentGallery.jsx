import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

const AttachmentGallery = ({ attachments = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const imageAttachments = attachments.filter(att => 
    att.mimeType?.startsWith('image/') || att.type?.startsWith('image/')
  );

  if (imageAttachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      {/* Miniatures */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {imageAttachments.map((attachment) => (
          <div
            key={attachment.id}
            className="relative flex-shrink-0 w-16 h-16 group cursor-pointer"
          >
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/images/${attachment.filename}`}
              alt={attachment.originalName}
              className="w-full h-full object-cover rounded-md hover:opacity-75 transition-opacity"
              onClick={() => setSelectedImage(attachment)}
            />
          </div>
        ))}
      </div>

      {/* Modal pour l'aperçu en grand */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/images/${selectedImage.filename}`}
              alt={selectedImage.originalName}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentGallery;