import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import type { ThemeMode, UserProfile } from '#contracts/state/app_store'
import useAppStore from '../../stores/useAppStore'
import { supabase } from '../../services/supabaseClient'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

type ThemeContextValue = {
  mode: ThemeMode
  resolvedMode: Exclude<ThemeMode, 'system'>
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const getSystemPreference = (): Exclude<ThemeMode, 'system'> => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyThemeClass = (mode: ThemeMode) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  const resolved = mode === 'system' ? getSystemPreference() : mode
  root.classList.add(resolved)
}

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useAppStore((state) => state.theme)
  const setTheme = useAppStore((state) => state.setTheme)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('theme-mode') as ThemeMode | null
    if (stored && stored !== theme) {
      setTheme(stored)
    }
  }, [setTheme, theme])

  useEffect(() => {
    applyThemeClass(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyThemeClass('system')
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  const setMode = useCallback(
    (mode: ThemeMode) => {
      setTheme(mode)
      if (typeof window === 'undefined') return
      if (mode === 'system') localStorage.removeItem('theme-mode')
      else localStorage.setItem('theme-mode', mode)
    },
    [setTheme],
  )

  const toggleMode = useCallback(() => {
    const current = theme === 'system' ? getSystemPreference() : theme
    const nextMode: ThemeMode = current === 'dark' ? 'light' : 'dark'
    setMode(nextMode)
  }, [theme, setMode])

  const resolvedMode = theme === 'system' ? getSystemPreference() : theme

  const value = useMemo(
    () => ({
      mode: theme,
      resolvedMode,
      setMode,
      toggleMode,
    }),
    [theme, resolvedMode, setMode, toggleMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

type AuthContextValue = {
  supabase: typeof supabase
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const mapUserToProfile = (user: SupabaseUser | null): UserProfile | null => {
  if (!user) return null
  return {
    id: user.id,
    email: user.email ?? '',
    createdAt: user.created_at,
    avatarUrl: user.user_metadata?.avatar_url,
    isAdmin: Boolean(user.user_metadata?.is_admin),
  }
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const setUser = useAppStore((state) => state.setUser)
  const authLoading = useAppStore((state) => state.loading.auth)
  const setLoading = useAppStore((state) => state.setLoading)

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      setLoading('auth', true)
      const { data, error } = await supabase.auth.getSession()
      if (!active) return
      if (error) {
        console.error('Failed to initialize Supabase session', error)
      }
      setSession(data.session ?? null)
      setUser(mapUserToProfile(data.session?.user ?? null))
      setLoading('auth', false)
    }

    bootstrap()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setUser(mapUserToProfile(nextSession?.user ?? null))
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [setLoading, setUser])

  const value = useMemo(
    () => ({
      supabase,
      session,
      loading: authLoading,
      signOut: () => supabase.auth.signOut(),
    }),
    [authLoading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within AppProviders')
  return context
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AppProviders')
  return context
}

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
