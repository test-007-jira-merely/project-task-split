import { motion } from 'framer-motion';
import { IngredientMatch } from '@meal-platform/shared';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface MatchIndicatorProps {
  match: IngredientMatch;
}

export function MatchIndicator({ match }: MatchIndicatorProps) {
  return (
    <div className="card space-y-3">
      {/* Match Score */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Match Score</span>
        <span className="text-lg font-bold text-primary">{match.matchScore.toFixed(0)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${match.matchScore}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Coverage */}
      <div className="text-sm text-muted">
        {match.coveragePercentage.toFixed(0)}% ingredient coverage
      </div>

      {/* Matched/Missing */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-start gap-1">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">Matched ({match.matchedIngredients.length})</div>
            <div className="text-muted">{match.matchedIngredients.slice(0, 3).join(', ')}</div>
          </div>
        </div>
        <div className="flex items-start gap-1">
          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">Missing ({match.missingIngredients.length})</div>
            <div className="text-muted">{match.missingIngredients.slice(0, 3).join(', ')}</div>
          </div>
        </div>
      </div>

      {/* Substitutions */}
      {match.substitutedIngredients.length > 0 && (
        <div className="flex items-start gap-1 text-xs">
          <RefreshCw className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">Substitutions ({match.substitutedIngredients.length})</div>
            <div className="text-muted">
              {match.substitutedIngredients.map(s => `${s.original}→${s.substitute}`).join(', ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
