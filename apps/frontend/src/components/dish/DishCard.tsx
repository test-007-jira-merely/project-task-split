import { motion } from 'framer-motion';
import { Clock, ChefHat, Users, Heart } from 'lucide-react';
import { Dish } from '@meal-platform/shared-types';
import { useState } from 'react';

interface DishCardProps {
  dish: Dish;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

export default function DishCard({ dish, onFavorite, isFavorited }: DishCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const totalTime = dish.prepTime + dish.cookTime;
  const difficultyLabels = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card overflow-hidden animate-tilt"
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Favorite Button */}
        {onFavorite && (
          <button
            onClick={onFavorite}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'
              }`}
            />
          </button>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full capitalize">
            {dish.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">{dish.name}</h2>
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">{dish.description}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-text-secondary mb-6">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{difficultyLabels[dish.difficulty - 1]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{dish.servings} servings</span>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Ingredients ({dish.ingredients.length})</h3>
          <div className="flex flex-wrap gap-2">
            {dish.ingredients.slice(0, 6).map((ingredient) => (
              <span
                key={ingredient.id}
                className="inline-flex items-center px-3 py-1 text-xs bg-surface border border-border rounded-lg"
              >
                {ingredient.name}
              </span>
            ))}
            {dish.ingredients.length > 6 && (
              <span className="inline-flex items-center px-3 py-1 text-xs bg-surface border border-border rounded-lg">
                +{dish.ingredients.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* Instructions Preview */}
        <details className="group">
          <summary className="font-semibold cursor-pointer list-none flex items-center justify-between mb-2 hover:text-primary-600 transition-colors">
            <span>Instructions</span>
            <span className="text-text-tertiary group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <ol className="space-y-2 mt-3">
            {dish.instructions.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm text-text-secondary">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-xs font-medium">
                  {index + 1}
                </span>
                <span className="flex-1">{step}</span>
              </li>
            ))}
          </ol>
        </details>

        {/* Nutrition */}
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-semibold mb-3">Nutrition per Serving</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">{dish.nutrition.calories}</div>
              <div className="text-xs text-text-tertiary">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{dish.nutrition.protein}g</div>
              <div className="text-xs text-text-tertiary">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{dish.nutrition.carbs}g</div>
              <div className="text-xs text-text-tertiary">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{dish.nutrition.fat}g</div>
              <div className="text-xs text-text-tertiary">Fat</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
