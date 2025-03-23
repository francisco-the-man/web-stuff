import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
      <div className="animate-spin text-4xl mb-4">⟳</div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingIndicator; 