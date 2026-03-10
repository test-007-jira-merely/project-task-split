import React from 'react';

interface MatchIndicatorProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

const MatchIndicator: React.FC<MatchIndicatorProps> = ({ percentage, size = 'md' }) => {
  const getColorClass = () => {
    if (percentage === 100) return 'bg-green-500 text-white';
    if (percentage >= 75) return 'bg-blue-500 text-white';
    if (percentage >= 50) return 'bg-yellow-500 text-gray-900';
    return 'bg-orange-500 text-white';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'md':
        return 'w-12 h-12 text-sm';
      case 'lg':
        return 'w-16 h-16 text-base';
      default:
        return 'w-12 h-12 text-sm';
    }
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold ${getSizeClass()} ${getColorClass()}`}
    >
      {percentage}%
    </div>
  );
};

export default MatchIndicator;
