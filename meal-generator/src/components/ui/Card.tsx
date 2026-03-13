import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glass?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = false, glass = false, className = '', ...props }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-300'

    const glassClasses = glass
      ? 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50'
      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'

    const hoverClasses = hover ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : ''

    const shadowClasses = 'shadow-lg'

    const classes = `${baseClasses} ${glassClasses} ${shadowClasses} ${hoverClasses} ${className}`

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
