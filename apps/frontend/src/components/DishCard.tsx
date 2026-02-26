import { motion } from 'framer-motion';
import { Heart, Clock, ChefHat, Utensils } from 'lucide-react';
import type { Dish } from '@meal-platform/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useAddFavorite, useRemoveFavorite } from '@/hooks/useFavorites';
import { useAppStore } from '@/stores/useAppStore';
import { cn, formatTime, getDifficultyLabel, getDifficultyColor, getCategoryColor } from '@/lib/utils';
import { useState } from 'react';

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const isFavorite = favoriteIds.includes(dish.id);

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite.mutate({ dishId: dish.id });
    } else {
      addFavorite.mutate({ dishId: dish.id });
    }
  };

  const totalTime = dish.prepTime + dish.cookTime;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card className="overflow-hidden card-hover">
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-muted">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <motion.img
            src={dish.imageUrl}
            alt={dish.name}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-500',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-2 rounded-full glass"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
              )}
            />
          </motion.button>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={getCategoryColor(dish.category)}>
              {dish.category}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="line-clamp-2">{dish.name}</CardTitle>
              <CardDescription className="mt-2 line-clamp-2">
                {dish.description}
              </CardDescription>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(totalTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              <span className={getDifficultyColor(dish.difficulty)}>
                {getDifficultyLabel(dish.difficulty)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Utensils className="h-4 w-4" />
              <span>{dish.nutrition.calories} cal</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Ingredients Preview */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Ingredients ({dish.ingredients.length})</h4>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.slice(0, 3).map((ing) => (
                <Badge key={ing.id} variant="secondary">
                  {ing.name}
                </Badge>
              ))}
              {dish.ingredients.length > 3 && (
                <Badge variant="outline">+{dish.ingredients.length - 3} more</Badge>
              )}
            </div>
          </div>

          {/* Expandable Instructions */}
          <motion.div
            initial={false}
            animate={{ height: expanded ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h4 className="text-sm font-semibold mb-2">All Ingredients</h4>
                <ul className="space-y-1 text-sm">
                  {dish.ingredients.map((ing) => (
                    <li key={ing.id} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        {ing.amount && ing.unit ? `${ing.amount} ${ing.unit} ` : ''}
                        {ing.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Instructions</h4>
                <ol className="space-y-2 text-sm">
                  {dish.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-semibold text-primary">{idx + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Nutrition</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Calories: {dish.nutrition.calories}</div>
                  <div>Protein: {dish.nutrition.protein}g</div>
                  <div>Fat: {dish.nutrition.fat}g</div>
                  <div>Carbs: {dish.nutrition.carbs}g</div>
                </div>
              </div>
            </div>
          </motion.div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-4"
          >
            {expanded ? 'Show Less' : 'Show Full Recipe'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
