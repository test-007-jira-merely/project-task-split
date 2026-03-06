import { motion } from 'framer-motion';
import type { MatchIndicatorProps } from '@/types/components';

export function MatchIndicator({ percentage, size = 'md' }: MatchIndicatorProps) {
  const sizes = {
    sm: { dimension: 60, stroke: 4, text: 'text-sm' },
    md: { dimension: 80, stroke: 6, text: 'text-base' },
    lg: { dimension: 120, stroke: 8, text: 'text-2xl' },
  };

  const config = sizes[size];
  const radius = (config.dimension - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (percent: number) => {
    if (percent >= 80) return '#10b981'; // green-500
    if (percent >= 50) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={config.dimension}
        height={config.dimension}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={config.stroke}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />

        {/* Progress Circle */}
        <motion.circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={config.stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </svg>

      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-bold ${config.text}`}
          style={{ color: getColor(percentage) }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}
