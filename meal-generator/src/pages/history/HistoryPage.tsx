import { useState } from 'react'
import { motion } from 'framer-motion'
import { History as HistoryIcon } from 'lucide-react'
import { MealCard } from '../../components/meal/MealCard'
import { MealDetailsModal } from '../../components/meal/MealDetailsModal'
import { EmptyState } from '../../components/ui/EmptyState'
import { MealCardSkeleton } from '../../components/ui/Skeleton'
import { useMeals } from '../../hooks/useMeals'
import { useHistory } from '../../hooks/useHistory'
import { useAppStore } from '../../stores/useAppStore'
import type { Meal } from '../../types/meal'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export const HistoryPage = () => {
  const { user, historyMealIds } = useAppStore()
  const { data: meals, isLoading: mealsLoading } = useMeals()
  const { isLoading: historyLoading } = useHistory()
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const navigate = useNavigate()

  const isLoading = mealsLoading || historyLoading

  const historyMeals = historyMealIds
    .map((id) => meals?.find((meal) => meal.id === id))
    .filter((meal): meal is Meal => meal !== undefined)

  if (!user) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          History
        </h1>
        <EmptyState
          icon={<HistoryIcon className="w-16 h-16" />}
          title="Login to view history"
          description="Create an account or login to track your meal generation history."
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
          Your History
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Recently generated meals
        </p>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MealCardSkeleton />
          <MealCardSkeleton />
          <MealCardSkeleton />
        </div>
      )}

      {!isLoading && historyMeals.length === 0 && (
        <EmptyState
          icon={<HistoryIcon className="w-16 h-16" />}
          title="No history yet"
          description="Start generating meals to see your history here."
          action={
            <Button onClick={() => navigate('/')}>Generate Meals</Button>
          }
        />
      )}

      {!isLoading && historyMeals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyMeals.map((meal, index) => (
            <motion.div
              key={`${meal.id}-${index}`}
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
