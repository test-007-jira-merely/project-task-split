import { motion } from 'framer-motion';

interface MatchIndicatorProps {
  percentage: number;
}

export function MatchIndicator({ percentage }: MatchIndicatorProps) {
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${getColor()}`}
        />
      </div>
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 min-w-[3rem] text-right">
        {percentage}%
      </span>
    </div>
  );
}
