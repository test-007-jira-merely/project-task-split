import { motion, AnimatePresence } from 'framer-motion';
import { X, ChefHat, Clock, ListChecks } from 'lucide-react';
import type { Meal } from '../../types';

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MealDetailsModal = ({ meal, isOpen, onClose }: MealDetailsModalProps) => {
  if (!meal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(90vh-20rem)]">
                <h2 className="text-4xl font-bold mb-4">{meal.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                  {meal.description}
                </p>

                <div className="flex items-center space-x-6 mb-8 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="w-5 h-5" />
                    <span>{meal.ingredients.length} ingredients</span>
                  </div>
                  {meal.prepTime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>{meal.prepTime} minutes</span>
                    </div>
                  )}
                  {meal.difficulty && (
                    <div className="flex items-center space-x-2">
                      <ListChecks className="w-5 h-5" />
                      <span className="capitalize">{meal.difficulty}</span>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                    <ChefHat className="w-6 h-6" />
                    <span>Ingredients</span>
                  </h3>
                  <ul className="space-y-2">
                    {meal.ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                    <ListChecks className="w-6 h-6" />
                    <span>Instructions</span>
                  </h3>
                  <ol className="space-y-4">
                    {meal.instructions.map((instruction, index) => (
                      <li key={index} className="flex space-x-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <p className="flex-1 pt-1">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
