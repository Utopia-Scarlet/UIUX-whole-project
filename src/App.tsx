import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutGroup, useReducedMotion } from 'motion/react'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { LandingScene } from './components/layout/LandingScene'
import { PortfolioWorkspace } from './components/workspace/PortfolioWorkspace'
import {
  isProjectDestination,
  type ResumeSectionId,
  type WorkspaceDestination,
} from './data/portfolioData'

type ActiveScene = 'landing' | 'workspace'

const VALID_RESUME_SECTIONS: ReadonlySet<ResumeSectionId> = new Set([
  'overview',
  'education',
  'experience',
  'skills',
  'additional-projects',
  'honours',
  'contact',
])

function parseLocationRoute(): {
  scene: ActiveScene
  destination: WorkspaceDestination
} {
  if (typeof window === 'undefined') {
    return { scene: 'landing', destination: 'overview' }
  }

  const rawHash = window.location.hash.replace(/^#\/?/, '').trim()
  if (!rawHash) {
    return { scene: 'landing', destination: 'overview' }
  }

  // Match #projects/<id> or #case-study/<id> or #<projectId>
  if (rawHash.startsWith('projects/') || rawHash.startsWith('case-study/')) {
    const slug = rawHash.split('/')[1] ?? ''
    if (isProjectDestination(slug)) {
      return { scene: 'workspace', destination: slug }
    }
  }

  if (isProjectDestination(rawHash)) {
    return { scene: 'workspace', destination: rawHash }
  }

  // Match #resume or #resume/<sectionId>
  if (rawHash === 'resume') {
    return { scene: 'workspace', destination: 'overview' }
  }

  if (rawHash.startsWith('resume/')) {
    const sec = rawHash.split('/')[1] as ResumeSectionId
    if (VALID_RESUME_SECTIONS.has(sec)) {
      return { scene: 'workspace', destination: sec }
    }
    return { scene: 'workspace', destination: 'overview' }
  }

  if (VALID_RESUME_SECTIONS.has(rawHash as ResumeSectionId)) {
    return { scene: 'workspace', destination: rawHash as ResumeSectionId }
  }

  return { scene: 'landing', destination: 'overview' }
}

export function buildDestinationHash(destination: WorkspaceDestination): string {
  if (isProjectDestination(destination)) {
    return `#projects/${destination}`
  }
  return destination === 'overview' ? '#resume' : `#resume/${destination}`
}

const PortfolioExperience: React.FC = () => {
  const { t } = useLanguage()
  const prefersReducedMotion = Boolean(useReducedMotion())
  const initialRoute = parseLocationRoute()

  const [scene, setScene] = useState<ActiveScene>(initialRoute.scene)
  const [workspaceDestination, setWorkspaceDestination] =
    useState<WorkspaceDestination>(initialRoute.destination)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [hasPlayedIntro, setHasPlayedIntro] = useState<boolean>(
    initialRoute.scene === 'workspace'
  )
  const transitionLockTimer = useRef<number | null>(null)

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setHasPlayedIntro(true)
    }, 1100)
    return () => window.clearTimeout(introTimer)
  }, [])

  useEffect(() => {
    return () => {
      if (transitionLockTimer.current !== null) {
        window.clearTimeout(transitionLockTimer.current)
      }
    }
  }, [])

  // Synchronize with browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = parseLocationRoute()
      setScene(route.scene)
      setWorkspaceDestination(route.destination)
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handlePopState)
    }
  }, [])

  // Keep document.title synchronized with active scene, destination, and selected language
  useEffect(() => {
    if (scene === 'landing') {
      document.title = t.meta.landingTitle
    } else if (isProjectDestination(workspaceDestination)) {
      const proj = t.projects[workspaceDestination]
      document.title = `${proj.title} — ${t.meta.workspaceTitle}`
    } else {
      document.title = t.meta.workspaceTitle
    }
  }, [scene, workspaceDestination, t])

  const lockTransitionBriefly = useCallback(() => {
    setIsTransitioning(true)
    if (transitionLockTimer.current !== null) {
      window.clearTimeout(transitionLockTimer.current)
    }
    const lockMs = prefersReducedMotion ? 150 : 980
    transitionLockTimer.current = window.setTimeout(() => {
      setIsTransitioning(false)
    }, lockMs)
  }, [prefersReducedMotion])

  const handleEnterWorkspace = useCallback(
    (destination: WorkspaceDestination) => {
      if (isTransitioning) return
      lockTransitionBriefly()
      setWorkspaceDestination(destination)
      setScene('workspace')
      const targetHash = buildDestinationHash(destination)
      if (window.location.hash !== targetHash) {
        window.history.pushState({ scene: 'workspace', destination }, '', targetHash)
      }
    },
    [isTransitioning, lockTransitionBriefly]
  )

  const handleWorkspaceDestinationChange = useCallback(
    (destination: WorkspaceDestination, replaceHistory = false) => {
      setWorkspaceDestination(destination)
      const targetHash = buildDestinationHash(destination)
      if (window.location.hash !== targetHash) {
        if (replaceHistory) {
          window.history.replaceState(
            { scene: 'workspace', destination },
            '',
            targetHash
          )
        } else {
          window.history.pushState(
            { scene: 'workspace', destination },
            '',
            targetHash
          )
        }
      }
    },
    []
  )

  const handleReturnToLanding = useCallback(() => {
    if (isTransitioning) return
    lockTransitionBriefly()
    setScene('landing')
    if (window.location.hash) {
      window.history.pushState(
        { scene: 'landing' },
        '',
        window.location.pathname + window.location.search
      )
    }
  }, [isTransitioning, lockTransitionBriefly])

  return (
    <div className="portfolio-shell">
      <a href="#main-content" className="skip-link">
        {t.meta.skipToMain}
      </a>

      <LayoutGroup>
        {scene === 'landing' ? (
          <LandingScene
            key="scene-landing"
            onEnterWorkspace={handleEnterWorkspace}
            isTransitioning={isTransitioning}
            prefersReducedMotion={prefersReducedMotion}
            hasPlayedIntro={hasPlayedIntro}
          />
        ) : (
          <PortfolioWorkspace
            key="scene-workspace"
            initialDestination={workspaceDestination}
            onDestinationChange={handleWorkspaceDestinationChange}
            onReturnToLanding={handleReturnToLanding}
            isTransitioning={isTransitioning}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </LayoutGroup>
    </div>
  )
}

export function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <PortfolioExperience />
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
