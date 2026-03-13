import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { MealCard } from '../../components/meal/MealCard'
import { MealDetailsModal } from '../../components/meal/MealDetailsModal'
import { EmptyState } from '../../components/ui/EmptyState'
import { MealCardSkeleton } from '../../components/ui/Skeleton'
import { useMeals } from '../../hooks/useMeals'
import { useFavorites } from '../../hooks/useFavorites'
import { useAppStore } from '../../stores/useAppStore'
import type { Meal } from '../../types/meal'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export const FavoritesPage = () => {
  const { user, favoriteIds } = useAppStore()
  const { data: meals, isLoading: mealsLoading } = useMeals()
  const { isLoading: favoritesLoading } = useFavorites()
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const navigate = useNavigate()

  const isLoading = mealsLoading || favoritesLoading

  const favoriteMeals = meals?.filter((meal) => favoriteIds.includes(meal.id)) || []

  if (!user) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          Favorites
        </h1>
        <EmptyState
          icon={<Heart className="w-16 h-16" />}
          title="Login to save favorites"
          description="Create an account or login to save your favorite meals."
          action={
            <Button onClick={() => navigate('/auth/login')}>Login</Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          Your Favorites
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {favoriteMeals.length} saved meal{favoriteMeals.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MealCardSkeleton />
          <MealCardSkeleton />
          <MealCardSkeleton />
        </div>
      )}

      {!isLoading && favoriteMeals.length === 0 && (
        <EmptyState
          icon={<Heart className="w-16 h-16" />}
          title="No favorites yet"
          description="Start exploring meals and save your favorites by clicking the heart icon."
          action={
            <Button onClick={() => navigate('/')}>Discover Meals</Button>
          }
        />
      )}

      {!isLoading && favoriteMeals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteMeals.map((meal, index) => (
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

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  )
}
