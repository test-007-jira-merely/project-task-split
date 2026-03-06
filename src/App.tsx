import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMealStore } from './store/useMealStore';
import { Navbar } from './components/Navbar';
import { AppLayout } from './components/AppLayout';
import { DishCard } from './components/DishCard';
import { IngredientInput } from './components/IngredientInput';
import { EmptyState } from './components/EmptyState';
import { LoadingState } from './components/LoadingState';
import mealsData from './data/meals.json';
import { Meal } from './types/meal';

type Tab = 'home' | 'ingredients' | 'favorites';

const meals = mealsData as Meal[];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const {
    currentDish,
    loading,
    generateRandomMeal,
    ingredients,
    filteredMeals,
    generateMealFromIngredients,
    favorites,
  } = useMealStore();

  const favoriteMeals = meals.filter(meal => favorites.includes(meal.id));

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <AppLayout>
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Discover Your Next
                <br />
                <span className="bg-gradient-to-r from-primary-light to-purple-600 bg-clip-text text-transparent">
                  Delicious Meal
                </span>
              </h1>
              <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
                Get inspired with random meal ideas or find recipes based on ingredients you already have
              </p>

              {/* Generate Button */}
              <motion.button
                onClick={generateRandomMeal}
                disabled={loading}
                className="px-8 py-4 bg-primary-light dark:bg-primary-dark text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Generating...' : '✨ Generate Random Meal'}
              </motion.button>
            </motion.div>

            {/* Dish Display */}
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                {loading ? (
                  <LoadingState key="loading" />
                ) : currentDish ? (
                  <DishCard key={currentDish.id} meal={currentDish} />
                ) : (
                  <EmptyState
                    key="empty"
                    title="No Meal Selected"
                    description="Click the button above to generate a random meal idea!"
                    icon="🍽️"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Ingredients Tab */}
        {activeTab === 'ingredients' && (
          <div className="space-y-8">
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Find Meals by
                <br />
                <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                  Your Ingredients
                </span>
              </h1>
              <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
                Enter the ingredients you have, and we'll find the perfect recipes for you
              </p>
            </motion.div>

            {/* Ingredient Input Panel */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-card-light dark:bg-card-dark rounded-3xl shadow-lg p-6 space-y-6">
                <IngredientInput />

                {ingredients.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                        Available Meals ({filteredMeals.length})
                      </h3>
                      <motion.button
                        onClick={generateMealFromIngredients}
                        disabled={loading || filteredMeals.length === 0}
                        className="px-6 py-2.5 bg-primary-light dark:bg-primary-dark text-white rounded-2xl font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {loading ? 'Generating...' : '🎲 Generate from Ingredients'}
                      </motion.button>
                    </div>

                    {filteredMeals.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-text-secondary-light dark:text-text-secondary-dark">
                          No meals match your ingredients. Try adding more!
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                        {filteredMeals.slice(0, 10).map((meal) => (
                          <motion.div
                            key={meal.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-3 bg-surface-light dark:bg-surface-dark rounded-xl hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-colors cursor-pointer"
                            onClick={() => {
                              useMealStore.getState().setCurrentDish(meal);
                              setActiveTab('home');
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <img
                                  src={meal.imageUrl}
                                  alt={meal.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                  {meal.name}
                                </h4>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark capitalize">
                                  {meal.category}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-sm font-bold ${
                                  meal.matchPercentage === 100
                                    ? 'text-green-500'
                                    : meal.matchPercentage >= 75
                                    ? 'text-blue-500'
                                    : meal.matchPercentage >= 50
                                    ? 'text-yellow-500'
                                    : 'text-orange-500'
                                }`}
                              >
                                {meal.matchPercentage}%
                              </span>
                              <svg
                                className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Dish from Ingredients */}
              {currentDish && ingredients.length > 0 && (
                <div className="mt-8">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <LoadingState key="loading" />
                    ) : (
                      <DishCard
                        key={currentDish.id}
                        meal={currentDish}
                        matchPercentage={
                          filteredMeals.find(m => m.id === currentDish.id)?.matchPercentage
                        }
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-8">
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Your Favorite
                <br />
                <span className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                  Meals
                </span>
              </h1>
              <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
                Keep track of your favorite recipes for quick access
              </p>
            </motion.div>

            {favoriteMeals.length === 0 ? (
              <EmptyState
                title="No Favorites Yet"
                description="Start adding meals to your favorites by clicking the heart icon on any meal card!"
                icon="❤️"
                action={{
                  label: 'Discover Meals',
                  onClick: () => setActiveTab('home'),
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteMeals.map((meal) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="cursor-pointer"
                    onClick={() => {
                      useMealStore.getState().setCurrentDish(meal);
                      setActiveTab('home');
                    }}
                  >
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={meal.imageUrl}
                          alt={meal.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-lg font-bold text-white drop-shadow-lg">
                            {meal.name}
                          </h3>
                          <p className="text-sm text-white/90 capitalize">
                            {meal.category}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">
                          {meal.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </AppLayout>
    </div>
  );
}

export default App;
