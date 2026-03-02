import { motion } from 'framer-motion';

interface MatchIndicatorProps {
  percentage: number;
}

export const MatchIndicator = ({ percentage }: MatchIndicatorProps) => {
  const getColor = (pct: number) => {
    if (pct === 100) return 'bg-green-500';
    if (pct >= 75) return 'bg-blue-500';
    if (pct >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getTextColor = (pct: number) => {
    if (pct === 100) return 'text-green-500';
    if (pct >= 75) return 'text-blue-500';
    if (pct >= 50) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getLabel = (pct: number) => {
    if (pct === 100) return 'Perfect Match!';
    if (pct >= 75) return 'Great Match';
    if (pct >= 50) return 'Good Match';
    return 'Partial Match';
  };

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${getColor(percentage)}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Label */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${getTextColor(percentage)}`}>
          {getLabel(percentage)}
        </span>
        <span className={`text-sm font-bold ${getTextColor(percentage)}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};
