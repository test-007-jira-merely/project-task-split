import { CheckCircle2, Circle } from 'lucide-react'
import { motion } from 'framer-motion'

interface MatchIndicatorProps {
  percentage: number
  size?: 'sm' | 'md' | 'lg'
}

export const MatchIndicator = ({ percentage, size = 'md' }: MatchIndicatorProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const getColor = () => {
    if (percentage === 100) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    if (percentage >= 70) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    if (percentage >= 40) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${getColor()} ${sizeClasses[size]}`}
    >
      {percentage === 100 ? (
        <CheckCircle2 className={iconSizes[size]} />
      ) : (
        <Circle className={iconSizes[size]} />
      )}
      <span>{percentage}% Match</span>
    </motion.div>
  )
}
