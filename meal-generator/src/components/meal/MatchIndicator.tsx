import { motion } from 'framer-motion';

interface MatchIndicatorProps {
  percentage: number;
}

export function MatchIndicator({ percentage }: MatchIndicatorProps) {
  const getColor = () => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">Ingredient Match</span>
        <span className="font-bold text-gray-900 dark:text-gray-100">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${getColor()}`}
        />
      </div>
    </div>
  );
}
