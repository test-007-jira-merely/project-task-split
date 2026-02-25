import { motion } from 'framer-motion';
import { Dish } from '@meal-platform/shared';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FavoriteButton } from './FavoriteButton';
import { formatTime, getDifficultyStars } from '@/lib/utils';
import { FiClock, FiTrendingUp } from 'react-icons/fi';
import { useDishStore } from '@/stores/dish-store';

interface DishCardProps {
  dish: Dish;
  onFavoriteToggle?: (dishId: string) => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  animated?: boolean;
}

export function DishCard({
  dish,
  onFavoriteToggle,
  isFavorite,
  variant: _variant = 'default',
  animated = true
}: DishCardProps) {
  const { toggleFavorite, isFavorite: checkFavorite } = useDishStore();
  const favorite = isFavorite ?? checkFavorite(dish.id);

  const handleFavoriteToggle = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(dish.id);
    } else {
      toggleFavorite(dish.id);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 }
    }
  };

  const totalTime = dish.prepTime + dish.cookTime;

  return (
    <motion.div
      variants={animated ? cardVariants : undefined}
      initial={animated ? 'hidden' : undefined}
      animate={animated ? 'visible' : undefined}
      whileHover={animated ? 'hover' : undefined}
      className="relative group"
    >
      <Card variant="elevated" className="overflow-hidden h-full">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 right-3">
            <FavoriteButton
              isFavorite={favorite}
              onToggle={handleFavoriteToggle}
              animated={animated}
            />
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="primary">{dish.category}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground line-clamp-1">
              {dish.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {dish.description}
            </p>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <FiClock className="w-4 h-4" />
                <span>{formatTime(totalTime)}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <FiTrendingUp className="w-4 h-4" />
                <span title={`Difficulty: ${dish.difficulty}/5`}>
                  {getDifficultyStars(dish.difficulty)}
                </span>
              </div>
            </div>
          </div>

          {/* Nutrition */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
            <span>{dish.nutrition.calories} cal</span>
            <span>•</span>
            <span>{dish.nutrition.protein}g protein</span>
            <span>•</span>
            <span>{dish.nutrition.carbs}g carbs</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
