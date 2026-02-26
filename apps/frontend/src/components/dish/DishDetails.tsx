import { motion } from 'framer-motion';
import { Clock, ChefHat, Flame, X } from 'lucide-react';
import type { Dish } from '@meal-platform/shared';
import { FavoriteButton } from '../favorites/FavoriteButton';

interface DishDetailsProps {
  dish: Dish;
  onClose: () => void;
}

export function DishDetails({ dish, onClose }: DishDetailsProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-96">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Favorite button */}
          <div className="absolute top-4 left-4">
            <FavoriteButton dishId={dish.id} />
          </div>

          {/* Title and category */}
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-white text-sm font-medium capitalize mb-3">
              {dish.category}
            </span>
            <h2 className="text-4xl font-bold text-white">{dish.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Description */}
          <p className="text-lg text-muted">{dish.description}</p>

          {/* Meta info */}
          <div className="flex items-center gap-8 py-6 border-y border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted">Total Time</p>
                <p className="font-semibold">{dish.prepTime + dish.cookTime} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted">Difficulty</p>
                <p className="font-semibold">Level {dish.difficulty}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted">Calories</p>
                <p className="font-semibold">{dish.nutrition.calories} cal</p>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Ingredients</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dish.ingredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex items-center gap-2 p-3 bg-card-bg rounded-lg border border-border"
                >
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span className="font-medium">{ingredient.name}</span>
                  <span className="text-muted text-sm">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Instructions</h3>
            <ol className="space-y-4">
              {dish.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full font-semibold text-sm">
                    {index + 1}
                  </span>
                  <p className="flex-1 pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Nutrition */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Nutrition Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-card-bg rounded-lg border border-border text-center">
                <p className="text-2xl font-bold text-primary">{dish.nutrition.calories}</p>
                <p className="text-sm text-muted">Calories</p>
              </div>
              <div className="p-4 bg-card-bg rounded-lg border border-border text-center">
                <p className="text-2xl font-bold text-primary">{dish.nutrition.protein}g</p>
                <p className="text-sm text-muted">Protein</p>
              </div>
              <div className="p-4 bg-card-bg rounded-lg border border-border text-center">
                <p className="text-2xl font-bold text-primary">{dish.nutrition.carbs}g</p>
                <p className="text-sm text-muted">Carbs</p>
              </div>
              <div className="p-4 bg-card-bg rounded-lg border border-border text-center">
                <p className="text-2xl font-bold text-primary">{dish.nutrition.fat}g</p>
                <p className="text-sm text-muted">Fat</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
