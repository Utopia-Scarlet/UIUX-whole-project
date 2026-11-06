import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  TRANSLATIONS,
  type Locale,
  type TranslationDictionary,
} from '../i18n/translations'

interface LanguageContextValue {
  locale: Locale
  t: TranslationDictionary
  setLocale: (next: Locale) => void
  toggleLocale: () => void
}

const LANG_STORAGE_KEY = 'jianshuo_lang_v1'

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

/**
 * Requirement 2 & 4:
 * English ('en') MUST be the default language for first-time visitors,
 * regardless of their browser language. Only switch to 'zh-CN' if explicitly
 * persisted in localStorage from a prior manual selection.
 */
function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
    if (stored === 'zh-CN' || stored === 'en') {
      return stored
    }
  } catch {
    // Ignore storage read restrictions
  }
  return 'en'
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      // Ignore storage write errors
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === 'en' ? 'zh-CN' : 'en'
      try {
        window.localStorage.setItem(LANG_STORAGE_KEY, next)
      } catch {
        // Ignore storage write errors
      }
      return next
    })
  }, [])

  const t = TRANSLATIONS[locale]

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
