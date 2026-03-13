import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { IngredientInput } from '../../components/ingredients/IngredientInput'
import { MealCard } from '../../components/meal/MealCard'
import { MealDetailsModal } from '../../components/meal/MealDetailsModal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { useMeals } from '../../hooks/useMeals'
import { useAppStore } from '../../stores/useAppStore'
import { calculateMatchPercentage } from '../../utils/matching'
import type { Meal, MealWithMatch, MealCategory } from '../../types/meal'

export const IngredientsPage = () => {
  const { data: meals, isLoading } = useMeals()
  const { ingredients, addIngredient, removeIngredient, clearIngredients } = useAppStore()
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [filteredMeals, setFilteredMeals] = useState<MealWithMatch[]>([])
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'match' | 'random'>('match')
  const [showFilters, setShowFilters] = useState(false)

  const allIngredients = meals
    ? Array.from(new Set(meals.flatMap((meal) => meal.ingredients)))
    : []

  useEffect(() => {
    if (!meals) return

    if (ingredients.length === 0) {
      setFilteredMeals([])
      return
    }

    let filtered: MealWithMatch[] = meals.map((meal) => ({
      ...meal,
      matchPercentage: calculateMatchPercentage(meal.ingredients, ingredients),
    }))

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((meal) => meal.category === selectedCategory)
    }

    filtered = filtered.filter((meal) => (meal.matchPercentage || 0) > 0)

    if (sortBy === 'match') {
      filtered.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    } else {
      filtered.sort(() => Math.random() - 0.5)
    }

    setFilteredMeals(filtered)
  }, [meals, ingredients, selectedCategory, sortBy])

  const categories: Array<{ value: MealCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          Find Meals by Ingredients
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Enter the ingredients you have, and we'll show you what you can cook!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <IngredientInput
          ingredients={ingredients}
          onAdd={addIngredient}
          onRemove={removeIngredient}
          suggestions={allIngredients}
        />
      </motion.div>

      {ingredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {filteredMeals.length} Meal{filteredMeals.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="ghost" size="sm" onClick={clearIngredients}>
                Clear All
              </Button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                        selectedCategory === cat.value
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('match')}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      sortBy === 'match'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Best Match
                  </button>
                  <button
                    onClick={() => setSortBy('random')}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      sortBy === 'random'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Random
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {filteredMeals.length === 0 ? (
            <EmptyState
              icon={<Search className="w-16 h-16" />}
              title="No matching meals found"
              description="Try adding different ingredients or removing some filters."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MealCard meal={meal} onClick={() => setSelectedMeal(meal)} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {ingredients.length === 0 && (
        <EmptyState
          icon={<Search className="w-16 h-16" />}
          title="Start adding ingredients"
          description="Add the ingredients you have available to find matching meals."
        />
      )}

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  )
}
