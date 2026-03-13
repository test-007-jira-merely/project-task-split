import { Meal, MealWithMatch } from '@/types/models';
import { Card } from '@/components/ui/Card';
import { CategoryBadge } from './CategoryBadge';
import { MatchIndicator } from './MatchIndicator';
import { Heart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface MealCardProps {
  meal: Meal | MealWithMatch;
  onFavorite?: () => void;
  isFavorite?: boolean;
  onClick?: () => void;
  showMatch?: boolean;
}

export function MealCard({ meal, onFavorite, isFavorite, onClick, showMatch }: MealCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const mealWithMatch = meal as MealWithMatch;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full h-48 bg-muted overflow-hidden rounded-xl">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Favorite Button */}
          {onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={20}
                className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}
              />
            </button>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={meal.category} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 space-y-3">
          <h3 className="text-xl font-bold text-foreground line-clamp-1">
            {meal.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {meal.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {meal.preparationTime && (
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{meal.preparationTime} min</span>
              </div>
            )}
            {meal.difficulty && (
              <span className="capitalize px-2 py-1 bg-secondary rounded-lg text-xs">
                {meal.difficulty}
              </span>
            )}
          </div>

          {/* Match Indicator */}
          {showMatch && mealWithMatch.matchPercentage !== undefined && (
            <MatchIndicator percentage={mealWithMatch.matchPercentage} />
          )}
        </div>
      </Card>
    </motion.div>
  );
}
