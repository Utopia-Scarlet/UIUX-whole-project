import React, { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { WorkspaceDestination } from '../../data/portfolioData'

interface TopNavProps {
  onNavigateToWorkspace: (destination: WorkspaceDestination) => void
  isTransitioning: boolean
}

export const TopNav: React.FC<TopNavProps> = ({
  onNavigateToWorkspace,
  isTransitioning,
}) => {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const handleMobileNavSelect = (destination: WorkspaceDestination) => {
    setIsMobileMenuOpen(false)
    onNavigateToWorkspace(destination)
  }

  return (
    <header className="top-nav" role="banner">
      <div className="top-nav-bar">
        <div className="nav-brand">
          <span className="nav-brand-mark" aria-hidden="true" />
          <span className="nav-brand-name">{t.identity.nameEn}</span>
          {t.identity.supportingNameZh ? (
            <span className="nav-brand-zh" lang="zh-CN">
              {t.identity.supportingNameZh}
            </span>
          ) : null}
          <span className="nav-brand-role">{t.identity.role}</span>
        </div>

        <nav className="nav-actions" aria-label={t.nav.primaryAria}>
          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li>
              <button
                type="button"
                className="nav-link-btn"
                disabled={isTransitioning}
                onClick={() => onNavigateToWorkspace('zero-line')}
              >
                {t.nav.work}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-link-btn"
                disabled={isTransitioning}
                onClick={() => onNavigateToWorkspace('overview')}
              >
                {t.nav.about}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-link-btn"
                disabled={isTransitioning}
                onClick={() => onNavigateToWorkspace('contact')}
              >
                {t.nav.contact}
              </button>
            </li>
          </ul>

          <div className="nav-utility-controls">
            <LanguageSwitcher />

            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === 'light'
                  ? t.nav.switchToDarkAria
                  : t.nav.switchToLightAria
              }
              aria-pressed={theme === 'dark'}
            >
              <span className="theme-toggle-dot" aria-hidden="true" />
              <span className="theme-label-full">
                {theme === 'light'
                  ? t.nav.themeLightLabel
                  : t.nav.themeDarkLabel}
              </span>
              <span className="theme-label-compact">
                {theme === 'light'
                  ? t.nav.themeLightShort
                  : t.nav.themeDarkShort}
              </span>
            </button>

            {/* Mobile Menu Button (visible <= 768px) */}
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={
                isMobileMenuOpen ? t.nav.menuCloseAria : t.nav.menuOpenAria
              }
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className="mobile-menu-icon" aria-hidden="true">
                <span
                  className={`menu-bar ${isMobileMenuOpen ? 'is-open-1' : ''}`}
                />
                <span
                  className={`menu-bar ${isMobileMenuOpen ? 'is-open-2' : ''}`}
                />
              </span>
              <span className="mobile-menu-text">
                {isMobileMenuOpen
                  ? t.nav.menuCloseLabel
                  : t.nav.menuToggleLabel}
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Accessible Collapsible Mobile Navigation Menu */}
      {isMobileMenuOpen ? (
        <nav
          id="mobile-nav-drawer"
          className="mobile-nav-drawer"
          aria-label={t.nav.mobileDrawerAria}
        >
          <ul className="mobile-nav-list">
            <li>
              <button
                type="button"
                className="mobile-nav-item"
                disabled={isTransitioning}
                onClick={() => handleMobileNavSelect('zero-line')}
              >
                <span>{t.nav.work}</span>
                <span className="mobile-nav-meta">ZERO//LINE · LoveStory</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="mobile-nav-item"
                disabled={isTransitioning}
                onClick={() => handleMobileNavSelect('overview')}
              >
                <span>{t.nav.about}</span>
                <span className="mobile-nav-meta">{t.identity.role}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="mobile-nav-item"
                disabled={isTransitioning}
                onClick={() => handleMobileNavSelect('contact')}
              >
                <span>{t.nav.contact}</span>
                <span className="mobile-nav-meta">{t.identity.nameEn}</span>
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
