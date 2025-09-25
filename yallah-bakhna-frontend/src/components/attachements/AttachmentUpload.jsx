import React from 'react';
import { attachmentService } from '../../services/attachmentService';
import UnifiedInput from '../common/UnifiedInput';

const AttachmentUpload = ({ taskId, onUpload }) => {
  return (
    <UnifiedInput
      type="file"
      accept="image/*"
      taskId={taskId}
      onFileUpload={onUpload}
      uploadService={attachmentService}
      maxSize={5 * 1024 * 1024}
      supportedFormats={['PNG', 'JPG', 'GIF', 'WebP']}
    />
  );
};

export default AttachmentUpload;