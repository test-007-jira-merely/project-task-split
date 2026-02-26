import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface MatchIndicatorProps {
  matchScore: number;
  coverage: number;
}

export function MatchIndicator({ matchScore, coverage }: MatchIndicatorProps) {
  const getMatchLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent Match', color: 'text-green-500', icon: CheckCircle2 };
    if (score >= 60) return { label: 'Good Match', color: 'text-blue-500', icon: CheckCircle2 };
    if (score >= 40) return { label: 'Fair Match', color: 'text-yellow-500', icon: AlertCircle };
    return { label: 'Partial Match', color: 'text-orange-500', icon: AlertCircle };
  };

  const match = getMatchLevel(matchScore);
  const Icon = match.icon;

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Icon className={`w-5 h-5 ${match.color}`} />
      <div>
        <p className={`text-sm font-semibold ${match.color}`}>{match.label}</p>
        <p className="text-xs text-muted">{coverage}% ingredients covered</p>
      </div>
    </motion.div>
  );
}
