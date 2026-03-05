import { motion, AnimatePresence } from 'framer-motion';
import { useMealStore } from '../store/useMealStore';
import mealsData from '../data/meals.json';
import type { Meal } from '../types/meal';
import EmptyState from './EmptyState';

export default function FavoritesTab() {
  const { favorites, toggleFavorite } = useMealStore();
  const meals = mealsData as Meal[];
  const favoriteMeals = meals.filter(meal => favorites.includes(meal.id));

  if (favoriteMeals.length === 0) {
    return (
      <EmptyState
        message="No favorite meals yet. Start exploring and save your favorites!"
        icon="⭐"
      />
    );
  }

  return (
    <div className="space-y-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 dark:text-gray-100"
      >
        Your Favorite Meals ({favoriteMeals.length})
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {favoriteMeals.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden group cursor-pointer"
              onClick={() => {
                useMealStore.setState({ currentDish: meal });
              }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(meal.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl">❤️</span>
                </motion.button>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{meal.name}</h3>
                  <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white capitalize">
                    {meal.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {meal.description}
                </p>
                <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-500">
                  <span>{meal.ingredients.length} ingredients</span>
                  <span className="mx-2">•</span>
                  <span>{meal.instructions.length} steps</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
