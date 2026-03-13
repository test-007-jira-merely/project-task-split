import { CheckCircle, AlertCircle } from 'lucide-react';

interface MatchIndicatorProps {
  percentage: number;
}

export const MatchIndicator = ({ percentage }: MatchIndicatorProps) => {
  const getColor = () => {
    if (percentage === 100) return 'text-green-600 dark:text-green-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getIcon = () => {
    if (percentage === 100) return CheckCircle;
    return AlertCircle;
  };

  const Icon = getIcon();

  return (
    <div className={`flex items-center gap-2 ${getColor()}`}>
      <Icon className="w-5 h-5" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Ingredient Match</span>
          <span className="text-sm font-bold">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              percentage === 100
                ? 'bg-green-600 dark:bg-green-400'
                : percentage >= 70
                ? 'bg-yellow-600 dark:bg-yellow-400'
                : 'bg-orange-600 dark:bg-orange-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
