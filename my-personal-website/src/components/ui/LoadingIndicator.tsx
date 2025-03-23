import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Loading content...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-4 relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 font-ibm-plex-mono">{message}</p>
    </div>
  );
};

export default LoadingIndicator; 