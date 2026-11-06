import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import type { Locale } from '../../i18n/translations'

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, toggleLocale, t } = useLanguage()

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      toggleLocale()
    }
  }

  const selectLanguage = (target: Locale) => {
    if (target !== locale) {
      setLocale(target)
    }
  }

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label={t.nav.langSwitcherAria}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        lang="en"
        className={`lang-option-btn ${locale === 'en' ? 'is-active' : ''}`}
        aria-pressed={locale === 'en'}
        aria-label={t.nav.switchToEnAria}
        onClick={() => selectLanguage('en')}
      >
        {t.nav.langEnLabel}
      </button>
      <span className="lang-divider" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        lang="zh-CN"
        className={`lang-option-btn ${locale === 'zh-CN' ? 'is-active' : ''}`}
        aria-pressed={locale === 'zh-CN'}
        aria-label={t.nav.switchToZhAria}
        onClick={() => selectLanguage('zh-CN')}
      >
        {t.nav.langZhLabel}
      </button>
    </div>
  )
}
