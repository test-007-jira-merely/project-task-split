import { motion } from 'framer-motion';
import { MatchScore } from '@meal-platform/shared';
import { cn } from '@/lib/utils';

interface MatchIndicatorProps {
  matchScore: MatchScore;
  variant?: 'compact' | 'detailed';
}

export function MatchIndicator({ matchScore, variant = 'compact' }: MatchIndicatorProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${matchScore.score}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full', getScoreBarColor(matchScore.score))}
          />
        </div>
        <span className={cn('text-sm font-semibold', getScoreColor(matchScore.score))}>
          {Math.round(matchScore.score)}%
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Score Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${matchScore.score}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full', getScoreBarColor(matchScore.score))}
          />
        </div>
        <span className={cn('text-lg font-bold min-w-[4rem] text-right', getScoreColor(matchScore.score))}>
          {Math.round(matchScore.score)}%
        </span>
      </div>

      {/* Match Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground mb-1">Matched Ingredients</p>
          <p className="font-medium text-green-600 dark:text-green-400">
            {matchScore.matchedIngredients.length} ingredients
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Missing Ingredients</p>
          <p className="font-medium text-red-600 dark:text-red-400">
            {matchScore.missingIngredients.length} ingredients
          </p>
        </div>
      </div>

      {/* Substitutions */}
      {matchScore.substitutionMatches.length > 0 && (
        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Substitutions</p>
          <div className="space-y-1">
            {matchScore.substitutionMatches.slice(0, 3).map((sub: any, index: number) => (
              <p key={index} className="text-xs text-yellow-600 dark:text-yellow-400">
                {sub.requested} → {sub.matched} ({Math.round(sub.confidence * 100)}% match)
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
