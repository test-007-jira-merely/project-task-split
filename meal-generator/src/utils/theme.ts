export type Theme = 'light' | 'dark'

const THEME_KEY = 'meal-gen-theme'

export const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export const getSavedTheme = (): Theme | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  }
  return null
}

export const saveTheme = (theme: Theme): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, theme)
  }
}

export const applyTheme = (theme: Theme): void => {
  if (typeof window !== 'undefined') {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

export const getInitialTheme = (): Theme => {
  return getSavedTheme() || getSystemTheme()
}
