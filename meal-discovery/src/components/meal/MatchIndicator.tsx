import { MatchIndicatorProps } from '@/types/components';

export const MatchIndicator = ({ percentage, size = 'md' }: MatchIndicatorProps) => {
  const sizes = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base',
  };

  const getColor = (pct: number) => {
    if (pct === 100) return 'text-green-600 border-green-600';
    if (pct >= 75) return 'text-blue-600 border-blue-600';
    if (pct >= 50) return 'text-yellow-600 border-yellow-600';
    return 'text-orange-600 border-orange-600';
  };

  return (
    <div className={`${sizes[size]} rounded-full border-4 ${getColor(percentage)} flex items-center justify-center font-bold bg-background`}>
      {percentage}%
    </div>
  );
};
