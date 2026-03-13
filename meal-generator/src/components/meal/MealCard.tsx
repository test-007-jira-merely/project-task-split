import { motion } from 'framer-motion'
import { Heart, Clock, ChefHat } from 'lucide-react'
import { Card } from '../ui/Card'
import { MatchIndicator } from './MatchIndicator'
import type { MealWithMatch } from '../../types/meal'
import { useAppStore } from '../../stores/useAppStore'
import { supabase } from '../../services/supabase'

interface MealCardProps {
  meal: MealWithMatch
  onClick?: () => void
}

export const MealCard = ({ meal, onClick }: MealCardProps) => {
  const { user, favoriteIds, addFavorite, removeFavorite } = useAppStore()
  const isFavorite = favoriteIds.includes(meal.id)

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) return

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('meal_id', meal.id)
        removeFavorite(meal.id)
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, meal_id: meal.id } as any)
        addFavorite(meal.id)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <Card hover onClick={onClick} className="overflow-hidden cursor-pointer">
      <div className="relative">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {meal.matchPercentage !== undefined && (
          <div className="absolute top-3 left-3">
            <MatchIndicator percentage={meal.matchPercentage} />
          </div>
        )}
        {user && (
          <motion.button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </motion.button>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {meal.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {meal.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full font-medium">
            <ChefHat className="w-4 h-4" />
            {meal.category}
          </span>
          {meal.preparationTime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {meal.preparationTime}m
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
