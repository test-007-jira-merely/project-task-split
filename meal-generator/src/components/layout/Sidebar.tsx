import { Link, useLocation } from 'react-router-dom'
import { Home, Salad, Heart, History, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../stores/useAppStore'
import { isAdmin } from '../../services/supabase'

export const Sidebar = () => {
  const location = useLocation()
  const { user } = useAppStore()

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ingredients', label: 'Ingredients', icon: Salad },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/history', label: 'History', icon: History },
  ]

  if (user && isAdmin(user.email)) {
    navLinks.push({ path: '/admin', label: 'Admin', icon: Shield })
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="relative block"
          >
            <motion.div
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
                ${
                  isActive(path)
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
              whileHover={{ x: 4 }}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </motion.div>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
