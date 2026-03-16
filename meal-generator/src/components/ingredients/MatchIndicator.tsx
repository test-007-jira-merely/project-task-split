import { motion } from 'framer-motion';

interface MatchIndicatorProps {
  percentage: number;
}

export const MatchIndicator = ({ percentage }: MatchIndicatorProps) => {
  const getColor = () => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-lime-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Ingredient Match
        </span>
        <span className="text-sm font-bold">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${getColor()}`}
        />
      </div>
    </div>
  );
};
