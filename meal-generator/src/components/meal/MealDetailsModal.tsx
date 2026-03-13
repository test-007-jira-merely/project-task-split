import { Modal } from '../ui/Modal'
import type { Meal } from '../../types/meal'
import { Clock, ChefHat, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface MealDetailsModalProps {
  meal: Meal | null
  isOpen: boolean
  onClose: () => void
}

export const MealDetailsModal = ({ meal, isOpen, onClose }: MealDetailsModalProps) => {
  if (!meal) return null

  const difficultyColors = {
    easy: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    hard: 'text-red-600 dark:text-red-400',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-80 object-cover rounded-2xl mb-6"
        />

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {meal.name}
        </h2>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl font-medium">
            <ChefHat className="w-5 h-5" />
            {meal.category}
          </span>
          {meal.preparationTime && (
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium">
              <Clock className="w-5 h-5" />
              {meal.preparationTime} minutes
            </span>
          )}
          {meal.difficulty && (
            <span className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium ${difficultyColors[meal.difficulty]}`}>
              <TrendingUp className="w-5 h-5" />
              {meal.difficulty}
            </span>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {meal.description}
        </p>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Ingredients
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {meal.ingredients.map((ingredient, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl"
              >
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Instructions
          </h3>
          <ol className="space-y-3">
            {meal.instructions.map((instruction, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4"
              >
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-500 text-white rounded-full font-bold">
                  {index + 1}
                </span>
                <p className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                  {instruction}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </motion.div>
    </Modal>
  )
}
