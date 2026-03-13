import { Link, useLocation } from 'react-router-dom'
import { Home, Salad, Heart, History } from 'lucide-react'
import { motion } from 'framer-motion'

export const MobileNav = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ingredients', label: 'Ingredients', icon: Salad },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/history', label: 'History', icon: History },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navLinks.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="flex-1"
          >
            <motion.div
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors
                ${
                  isActive(path)
                    ? 'text-primary-500'
                    : 'text-gray-500 dark:text-gray-400'
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </nav>
  )
}
