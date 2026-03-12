import { motion } from 'framer-motion';

interface MatchScoreBarProps {
  score: number;
  label?: string;
}

export function MatchScoreBar({ score, label = 'Match Score' }: MatchScoreBarProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold">{Math.round(score)}%</span>
      </div>
      <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor(score)} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
