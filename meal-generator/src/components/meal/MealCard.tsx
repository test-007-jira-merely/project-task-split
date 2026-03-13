import { Heart, Clock, ChefHat } from 'lucide-react';
import type { Meal } from '@/types/meal';
import { Card } from '@/components/ui/Card';

interface MealCardProps {
  meal: Meal;
  onView: (meal: Meal) => void;
  onFavorite?: (meal: Meal) => void;
  isFavorite?: boolean;
  matchPercentage?: number;
}

export function MealCard({ meal, onView, onFavorite, isFavorite, matchPercentage }: MealCardProps) {
  return (
    <Card hover onClick={() => onView(meal)} className="overflow-hidden">
      <div className="relative">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-48 object-cover"
        />
        {matchPercentage !== undefined && (
          <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {matchPercentage}% Match
          </div>
        )}
        {onFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(meal);
            }}
            className="absolute top-3 left-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </button>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium capitalize">
            {meal.category}
          </span>
          {meal.difficulty && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium capitalize">
              <ChefHat className="w-3 h-3 inline mr-1" />
              {meal.difficulty}
            </span>
          )}
          {meal.prepTime && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
              <Clock className="w-3 h-3 inline mr-1" />
              {meal.prepTime}m
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {meal.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
          {meal.description}
        </p>
      </div>
    </Card>
  );
}
