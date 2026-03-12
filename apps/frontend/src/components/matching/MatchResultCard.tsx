import { motion } from 'framer-motion';
import type { Dish } from '@meal-platform/shared';
import { DishCard } from '../dish/DishCard';
import { MatchScoreBar } from './MatchScoreBar';
import { MatchIndicator } from './MatchIndicator';

interface MatchResultCardProps {
  dish: Dish;
  matchScore: number;
  coverage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  onViewDetails?: () => void;
}

export function MatchResultCard({
  dish,
  matchScore,
  coverage,
  matchedIngredients,
  missingIngredients,
  onViewDetails,
}: MatchResultCardProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Match indicators */}
      <div className="flex items-center justify-between">
        <MatchIndicator matchScore={matchScore} coverage={coverage} />
      </div>

      {/* Dish card */}
      <DishCard dish={dish} onViewDetails={onViewDetails} />

      {/* Match details */}
      <div className="card space-y-4">
        <MatchScoreBar score={matchScore} />

        {/* Matched ingredients */}
        {matchedIngredients.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-green-500 mb-2">
              ✓ You have ({matchedIngredients.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {matchedIngredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 capitalize"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing ingredients */}
        {missingIngredients.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-orange-500 mb-2">
              ✗ You need ({missingIngredients.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {missingIngredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-500 capitalize"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
