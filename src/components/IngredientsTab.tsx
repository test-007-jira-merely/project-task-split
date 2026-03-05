import { motion, AnimatePresence } from 'framer-motion';
import { useMealStore } from '../store/useMealStore';
import IngredientInput from './IngredientInput';
import DishCard from './DishCard';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

export default function IngredientsTab() {
  const { ingredients, generateMealFromIngredients, currentDish, filteredMeals, loading } = useMealStore();

  const matchPercentage = filteredMeals.find(m => m.id === currentDish?.id)?.matchPercentage;

  return (
    <div className="space-y-8">
      {/* Ingredient Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          What ingredients do you have?
        </h2>
        <IngredientInput />

        {ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <motion.button
              onClick={generateMealFromIngredients}
              className="btn-primary w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔍 Find Meals with These Ingredients
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingState key="loading" />
        ) : currentDish ? (
          <DishCard key={currentDish.id} meal={currentDish} matchPercentage={matchPercentage} />
        ) : ingredients.length > 0 && filteredMeals.length === 0 ? (
          <EmptyState
            key="no-results"
            message="No meals found with these ingredients. Try adding more ingredients!"
            icon="😕"
          />
        ) : (
          <EmptyState
            key="empty"
            message="Add ingredients above to discover delicious meals!"
            icon="🥘"
          />
        )}
      </AnimatePresence>

      {/* Available Matches */}
      {filteredMeals.length > 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Available Meals ({filteredMeals.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredMeals.map((meal) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => {
                  useMealStore.setState({ currentDish: meal });
                }}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{meal.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{meal.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    meal.matchPercentage === 100 ? 'text-green-600' :
                    meal.matchPercentage >= 70 ? 'text-yellow-600' :
                    'text-orange-600'
                  }`}>
                    {meal.matchPercentage}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
