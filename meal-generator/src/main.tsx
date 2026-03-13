import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './app/router'
import { useAppStore } from './stores/useAppStore'
import { getInitialTheme, applyTheme } from './utils/theme'
import { useAuth } from './hooks/useAuth'
import { useFavorites } from './hooks/useFavorites'
import { useHistory } from './hooks/useHistory'
import { useMeals } from './hooks/useMeals'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppInitializer() {
  const { setTheme, setMeals } = useAppStore()
  const { data: meals } = useMeals()

  useAuth()
  useFavorites()
  useHistory()

  useEffect(() => {
    const theme = getInitialTheme()
    setTheme(theme)
    applyTheme(theme)
  }, [setTheme])

  useEffect(() => {
    if (meals) {
      setMeals(meals)
    }
  }, [meals, setMeals])

  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInitializer />
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
