import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react';
import type { MatchResult } from '@meal-platform/shared';
import { DishCard } from './DishCard';
import { Badge } from './ui/Badge';
import { cn } from '@/lib/utils';

interface MatchResultCardProps {
  result: MatchResult;
  index: number;
}

export function MatchResultCard({ result, index }: MatchResultCardProps) {
  const matchScoreColor =
    result.matchScore >= 80 ? 'text-green-600 dark:text-green-400' :
    result.matchScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
    'text-orange-600 dark:text-orange-400';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-4"
    >
      {/* Match Score Header */}
      <div className="glass rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h4 className="font-semibold text-lg mb-1">{result.dish.name}</h4>
            <div className="flex items-center gap-4 text-sm">
              <span className={cn('font-bold text-xl', matchScoreColor)}>
                {result.matchScore}% Match
              </span>
              <span className="text-muted-foreground">
                {result.coverage}% coverage
              </span>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            Rank #{index + 1}
          </Badge>
        </div>

        {/* Match Details */}
        <div className="mt-4 space-y-3">
          {/* Matched Ingredients */}
          {result.matchedIngredients.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">
                  Matched ({result.matchedIngredients.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.matchedIngredients.map((ing) => (
                  <Badge key={ing} variant="outline" className="bg-green-500/10 border-green-500/30">
                    {ing}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Substituted Ingredients */}
          {result.substitutedIngredients.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowRightLeft className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">
                  Substitutions ({result.substitutedIngredients.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.substitutedIngredients.map((sub) => (
                  <Badge
                    key={sub.original}
                    variant="outline"
                    className="bg-blue-500/10 border-blue-500/30"
                  >
                    {sub.substitute} → {sub.original} ({Math.round(sub.confidence * 100)}%)
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Missing Ingredients */}
          {result.missingIngredients.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium">
                  Missing ({result.missingIngredients.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingIngredients.map((ing) => (
                  <Badge key={ing} variant="outline" className="bg-orange-500/10 border-orange-500/30">
                    {ing}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dish Card */}
      <DishCard dish={result.dish} />
    </motion.div>
  );
}
