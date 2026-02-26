import { motion } from 'framer-motion';
import { Clock, ChefHat, Flame } from 'lucide-react';
import type { Dish } from '@meal-platform/shared';
import { FavoriteButton } from '../favorites/FavoriteButton';

interface DishCardProps {
  dish: Dish;
  onViewDetails?: () => void;
}

export function DishCard({ dish, onViewDetails }: DishCardProps) {
  return (
    <motion.div
      className="card group cursor-pointer relative overflow-hidden"
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onViewDetails}
    >
      {/* Image with parallax effect */}
      <motion.div
        className="relative w-full h-64 overflow-hidden rounded-lg mb-4"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Favorite button overlay */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton dishId={dish.id} />
        </div>

        {/* Category badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-full bg-primary text-white text-sm font-medium capitalize">
            {dish.category}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold line-clamp-1">{dish.name}</h3>
        <p className="text-muted text-sm line-clamp-2">{dish.description}</p>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-muted">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{dish.prepTime + dish.cookTime}min</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>Level {dish.difficulty}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4" />
            <span>{dish.nutrition.calories} cal</span>
          </div>
        </div>

        {/* Ingredients preview */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted line-clamp-1">
            {dish.ingredients.map(i => i.name).join(', ')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
