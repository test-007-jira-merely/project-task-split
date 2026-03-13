import { motion } from 'framer-motion';

interface MatchIndicatorProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MatchIndicator({ percentage, size = 'md' }: MatchIndicatorProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-24 h-24 text-base',
  };

  const getColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="45%"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 45}`}
          className={getColor()}
          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - percentage / 100) }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold ${getColor()}`}>{percentage}%</span>
      </div>
    </div>
  );
}
