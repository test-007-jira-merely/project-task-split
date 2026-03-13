import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { MealCard } from '../../components/meal/MealCard'
import { MealDetailsModal } from '../../components/meal/MealDetailsModal'
import { EmptyState } from '../../components/ui/EmptyState'
import { MealCardSkeleton } from '../../components/ui/Skeleton'
import { useMeals } from '../../hooks/useMeals'
import { useAppStore } from '../../stores/useAppStore'
import type { Meal } from '../../types/meal'
import { supabase } from '../../services/supabase'

export const HomePage = () => {
  const { data: meals, isLoading } = useMeals()
  const {
    currentMeal,
    setCurrentMeal,
    lastGeneratedMealId,
    setLastGeneratedMealId,
    user,
    addToHistory,
  } = useAppStore()
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRandomMeal = async () => {
    if (!meals || meals.length === 0) return

    setIsGenerating(true)

    let availableMeals = meals
    if (lastGeneratedMealId && meals.length > 1) {
      availableMeals = meals.filter((m) => m.id !== lastGeneratedMealId)
    }

    const randomMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)]

    setTimeout(async () => {
      setCurrentMeal(randomMeal)
      setLastGeneratedMealId(randomMeal.id)
      setIsGenerating(false)

      if (user) {
        try {
          await supabase.from('user_history').insert({
            user_id: user.id,
            meal_id: randomMeal.id,
          } as any)
          addToHistory(randomMeal.id)
        } catch (error) {
          console.error('Error saving to history:', error)
        }
      }
    }, 800)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
          Discover Your Next
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-500">
            Delicious Meal
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Let AI-powered meal discovery inspire your culinary journey. Generate random meals or find
          recipes based on your ingredients.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <Button
          size="lg"
          onClick={generateRandomMeal}
          disabled={isGenerating || isLoading || !meals?.length}
          className="shadow-2xl"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Meal'}
        </Button>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {isLoading && <MealCardSkeleton />}

        {!isLoading && !currentMeal && meals && meals.length === 0 && (
          <EmptyState
            icon={<Sparkles className="w-16 h-16" />}
            title="No meals available"
            description="Please contact an administrator to add meals to the database."
          />
        )}

        {!isLoading && currentMeal && (
          <motion.div
            key={currentMeal.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MealCard meal={currentMeal} onClick={() => setSelectedMeal(currentMeal)} />
          </motion.div>
        )}
      </div>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  )
}
