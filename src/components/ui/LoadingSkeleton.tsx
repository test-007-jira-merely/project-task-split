// Placeholder LoadingSkeleton component - will be implemented in Subtask 1
import React from 'react';

interface LoadingSkeletonProps {
  variant?: string;
  height?: string;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ height = '100px', className = '' }) => {
  return <div style={{ height }} className={`bg-gray-200 animate-pulse ${className}`} />;
};

export default LoadingSkeleton;
