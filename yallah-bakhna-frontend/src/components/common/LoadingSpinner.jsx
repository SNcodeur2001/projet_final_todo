import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', text = 'Chargement...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-500 mb-2`} />
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
};

export default LoadingSpinner;