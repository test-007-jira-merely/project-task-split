import { motion } from 'framer-motion';

interface MatchIndicatorProps {
  percentage: number;
}

export default function MatchIndicator({ percentage }: MatchIndicatorProps) {
  const getColor = () => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getLabel = () => {
    if (percentage === 100) return 'Full Match';
    if (percentage >= 70) return 'Good Match';
    return 'Partial Match';
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${getColor()} text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm`}
    >
      <div className="flex items-center space-x-2">
        <span className="font-bold text-lg">{percentage}%</span>
        <span className="text-sm font-medium">{getLabel()}</span>
      </div>
    </motion.div>
  );
}
