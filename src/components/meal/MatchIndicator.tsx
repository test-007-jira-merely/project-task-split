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
        <span className="text-muted-foreground">Ingredient Match</span>
        <span className="font-semibold text-foreground">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
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
