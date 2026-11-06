import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const STORAGE_KEY = 'jianshuo_theme_v1'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') {
    return attr
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
  } catch {
    // Ignore storage read restrictions
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy state initialization per vercel-react-best-practices (rerender-lazy-state-init)
  const [theme, setThemeState] = useState<ThemeMode>(readInitialTheme)
  const [hasManualOverride, setHasManualOverride] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      return stored === 'light' || stored === 'dark'
    } catch {
      return false
    }
  })

  const applyThemeToDOM = useCallback((nextTheme: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', nextTheme)
    document.documentElement.style.colorScheme = nextTheme
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', nextTheme === 'light' ? '#1556D5' : '#0C0D10')
    }
  }, [])

  useEffect(() => {
    applyThemeToDOM(theme)
  }, [theme, applyThemeToDOM])

  // Listen to system theme changes only when no manual preference has been stored
  useEffect(() => {
    if (hasManualOverride || typeof window === 'undefined' || !window.matchMedia) return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setThemeState(event.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [hasManualOverride])

  const setTheme = useCallback((mode: ThemeMode) => {
    setHasManualOverride(true)
    setThemeState(mode)
    try {
      window.localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // Ignore storage write errors
    }
  }, [])

  // Functional setState per vercel-react-best-practices (rerender-functional-setstate)
  const toggleTheme = useCallback(() => {
    setHasManualOverride(true)
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Ignore storage write errors
      }
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
