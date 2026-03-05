import { motion } from 'framer-motion';

interface MatchIndicatorProps {
  percentage: number;
  matchedCount?: number;
  totalCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function MatchIndicator({
  percentage,
  matchedCount,
  totalCount,
  size = 'md'
}: MatchIndicatorProps) {
  const getColor = () => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-500';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-red-600 dark:text-red-500';
  };

  const getBgColor = () => {
    if (percentage >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (percentage >= 50) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center space-x-2 rounded-full font-semibold ${getBgColor()} ${getColor()} ${sizeStyles[size]}`}
      title={matchedCount && totalCount ? `${matchedCount} of ${totalCount} ingredients matched` : undefined}
    >
      <span>{percentage}%</span>
      {matchedCount !== undefined && totalCount !== undefined && (
        <span className="text-xs opacity-75">
          ({matchedCount}/{totalCount})
        </span>
      )}
    </motion.div>
  );
}
