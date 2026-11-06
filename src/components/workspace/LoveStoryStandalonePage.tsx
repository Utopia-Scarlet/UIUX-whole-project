import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from '../icons/WorkspaceIcons'
import {
  LoveStoryLineIntro,
  TOTAL_HANDWRITING_DURATION_MS,
  type LoveStoryIntroPhase,
} from './LoveStoryLineIntro'
import { LoveStoryCaseStudy } from './LoveStoryCaseStudy'
import '../../styles/lovestory-standalone.css'
import type {
  LoveStoryExperienceData,
  ProjectId,
  ProjectShellData,
} from '../../data/portfolioData'

export type LoveStoryEntranceState =
  | 'writing'
  | 'awaiting-gesture'
  | 'dragging'
  | 'settling-back'
  | 'revealing'
  | 'entered'

interface LoveStoryStandalonePageProps {
  project: ProjectShellData
  allProjects: Record<ProjectId, ProjectShellData>
  loveStoryData: LoveStoryExperienceData
  /** True only when user intentionally entered LoveStory from Portfolio/Resume */
  playIntroOnMount: boolean
  prefersReducedMotion: boolean
  onIntroFinished: () => void
  onBackToPortfolio: () => void
  onSelectProject: (projectId: ProjectId) => void
}

declare global {
  interface Window {
    __getLoveStoryEntranceState?: () => {
      entranceState: LoveStoryEntranceState
      handwritingPhase: LoveStoryIntroPhase
      revealProgress: number
      isOverlayMounted: boolean
    }
  }
}

function easeOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t))
  return 1 - Math.pow(1 - clamped, 3)
}

/**
 * LS-02.1 — LoveStory Interactive Entrance & Standalone Fullscreen Experience
 *
 * Implements a tactile two-state horizontal reveal architecture:
 * - STATE A (Entrance Overlay): Fullscreen Dark Archive (#10110F) scene where a single
 *   gold line enters from the left, writes "LoveStory", and extends horizontally from
 *   the final "y" to the right edge with a subtle repeating gold-light shimmer.
 *   The user presses & drags LEFT (or swipes LEFT on touch) to physically pull State A
 *   leftward and progressively reveal State B from the right.
 * - STATE B (Main Case Study): Paper & Ink (#F3EFE7) surface starting with
 *   "Requirements & Design Decisions", unlocked for natural vertical scrolling once entered.
 */
export const LoveStoryStandalonePage: React.FC<
  LoveStoryStandalonePageProps
> = ({
  project,
  allProjects,
  loveStoryData,
  playIntroOnMount,
  prefersReducedMotion,
  onIntroFinished,
  onBackToPortfolio,
  onSelectProject,
}) => {
  const { locale, setLocale } = useLanguage()
  const isZh = locale === 'zh-CN'

  // Determine initial entrance state:
  // - Intentional entry from Portfolio/Resume: start in 'writing' (or 'awaiting-gesture' if reduced motion)
  // - Direct URL visit / refresh / Back-Forward: start in 'entered' (completed main page)
  const [entranceState, setEntranceState] = useState<LoveStoryEntranceState>(
    () => {
      if (!playIntroOnMount) return 'entered'
      return prefersReducedMotion ? 'awaiting-gesture' : 'writing'
    }
  )

  const [handwritingPhase, setHandwritingPhase] =
    useState<LoveStoryIntroPhase>(() =>
      playIntroOnMount && !prefersReducedMotion
        ? 'entering'
        : 'awaiting-gesture'
    )

  // Continuous horizontal reveal progress (0 = full entrance visible, 1 = main page fully revealed)
  // Updated directly on DOM refs during pointermove to avoid per-frame React re-renders.
  const revealProgressRef = useRef<number>(playIntroOnMount ? 0 : 1)
  const entranceOverlayRef = useRef<HTMLElement | null>(null)
  const stateBContainerRef = useRef<HTMLDivElement | null>(null)
  const settleRafRef = useRef<number | null>(null)

  const dragStateRef = useRef<{
    active: boolean
    pointerId: number | null
    startX: number
    startY: number
    lastX: number
    lastTime: number
    velocityX: number
    lockedHorizontal: boolean
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    velocityX: 0,
    lockedHorizontal: false,
  })

  // Apply reveal progress (0..1) directly to DOM layers for 60fps tactile drag tracking
  const applyRevealTransforms = useCallback(
    (progress: number) => {
      const clamped = Math.max(0, Math.min(1, progress))
      revealProgressRef.current = clamped

      if (entranceOverlayRef.current) {
        if (prefersReducedMotion) {
          entranceOverlayRef.current.style.opacity = `${1 - clamped}`
          entranceOverlayRef.current.style.transform = 'none'
        } else {
          const translateLeftPct = -(clamped * 100)
          entranceOverlayRef.current.style.transform = `translate3d(${translateLeftPct.toFixed(
            3
          )}%, 0, 0)`
        }
        entranceOverlayRef.current.setAttribute(
          'data-reveal-progress',
          clamped.toFixed(3)
        )
      }

      if (stateBContainerRef.current) {
        if (prefersReducedMotion || clamped >= 1) {
          stateBContainerRef.current.style.transform = 'none'
        } else {
          // Subtle incoming parallax from the right as the entrance curtain is pulled left
          const incomingRightPct = (1 - clamped) * 14
          stateBContainerRef.current.style.transform = `translate3d(${incomingRightPct.toFixed(
            3
          )}%, 0, 0)`
        }
      }
    },
    [prefersReducedMotion]
  )

  // Animate revealProgress smoothly to a target (0 for snap-back, 1 for full reveal)
  const animateRevealTo = useCallback(
    (target: 0 | 1, durationMs: number) => {
      if (settleRafRef.current !== null) {
        cancelAnimationFrame(settleRafRef.current)
        settleRafRef.current = null
      }

      if (prefersReducedMotion) {
        applyRevealTransforms(target)
        if (target === 1) {
          setEntranceState('entered')
          onIntroFinished()
        } else {
          setEntranceState('awaiting-gesture')
        }
        return
      }

      const startProgress = revealProgressRef.current
      const delta = target - startProgress
      if (Math.abs(delta) < 0.002) {
        applyRevealTransforms(target)
        if (target === 1) {
          setEntranceState('entered')
          onIntroFinished()
        } else {
          setEntranceState('awaiting-gesture')
        }
        return
      }

      setEntranceState(target === 1 ? 'revealing' : 'settling-back')
      const startTime = performance.now()

      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / durationMs)
        const nextProgress = startProgress + delta * easeOutCubic(t)
        applyRevealTransforms(nextProgress)

        if (t < 1) {
          settleRafRef.current = requestAnimationFrame(step)
        } else {
          settleRafRef.current = null
          applyRevealTransforms(target)
          if (target === 1) {
            setEntranceState('entered')
            onIntroFinished()
            window.scrollTo({ top: 0, behavior: 'auto' })
          } else {
            setEntranceState('awaiting-gesture')
          }
        }
      }

      settleRafRef.current = requestAnimationFrame(step)
    },
    [applyRevealTransforms, onIntroFinished, prefersReducedMotion]
  )

  useEffect(() => {
    return () => {
      if (settleRafRef.current !== null) {
        cancelAnimationFrame(settleRafRef.current)
      }
    }
  }, [])

  const handleHandwritingPhaseChange = useCallback(
    (phase: LoveStoryIntroPhase) => {
      setHandwritingPhase(phase)
    },
    []
  )

  const handleHandwritingComplete = useCallback(() => {
    setHandwritingPhase('awaiting-gesture')
    setEntranceState((prev) => (prev === 'writing' ? 'awaiting-gesture' : prev))
  }, [])

  // Complete handwriting & reveal the main page (used by Skip Intro, Escape, ArrowLeft, or Accessible Enter button)
  const triggerAccessibleEnter = useCallback(() => {
    window.__setLoveStoryIntroTimeMs?.(TOTAL_HANDWRITING_DURATION_MS)
    setHandwritingPhase('awaiting-gesture')
    animateRevealTo(1, prefersReducedMotion ? 10 : 420)
  }, [animateRevealTo, prefersReducedMotion])

  // Keyboard support while entrance is active:
  // - Escape or ArrowLeft advances / reveals the main page
  useEffect(() => {
    if (entranceState === 'entered') return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'ArrowLeft') {
        e.preventDefault()
        triggerAccessibleEnter()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [entranceState, triggerAccessibleEnter])

  // Pointer Down on Entrance Overlay (Desktop Mouse Hold & Drag Left / Mobile Touch Swipe Left)
  const handleEntrancePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (entranceState === 'entered' || entranceState === 'revealing') return
      if (e.button !== 0 && e.pointerType === 'mouse') return

      // Do not intercept clicks on interactive buttons or links
      const targetEl = e.target as HTMLElement | null
      if (
        targetEl?.closest(
          'button, a, select, input, [data-no-drag="true"], .ls-standalone-topbar'
        )
      ) {
        return
      }

      if (settleRafRef.current !== null) {
        cancelAnimationFrame(settleRafRef.current)
        settleRafRef.current = null
      }

      // If user starts dragging while handwriting is still finishing, complete the stroke so they aren't blocked
      if (entranceState === 'writing') {
        window.__setLoveStoryIntroTimeMs?.(TOTAL_HANDWRITING_DURATION_MS)
        setHandwritingPhase('awaiting-gesture')
      }

      dragStateRef.current = {
        active: true,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastTime: performance.now(),
        velocityX: 0,
        lockedHorizontal: false,
      }

      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // Ignore in synthetic events without pointer capture support
      }
    },
    [entranceState]
  )

  const handleEntrancePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const st = dragStateRef.current
      if (!st.active) return

      const dx = e.clientX - st.startX
      const dy = e.clientY - st.startY

      if (!st.lockedHorizontal) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return
        st.lockedHorizontal = true
        setEntranceState('dragging')
      }

      const now = performance.now()
      const dt = Math.max(1, now - st.lastTime)
      st.velocityX = (e.clientX - st.lastX) / dt
      st.lastX = e.clientX
      st.lastTime = now

      // Map leftward drag distance (-dx > 0) to revealProgress (0..1)
      const viewportWidth = Math.max(320, window.innerWidth || 1440)
      // Use a comfortable effective drag span (72% of viewport width reaches 100% reveal)
      const effectiveSpan = viewportWidth * 0.72
      const rawProgress = Math.max(0, -dx) / effectiveSpan
      applyRevealTransforms(Math.min(1, rawProgress))
    },
    [applyRevealTransforms]
  )

  const finishPointerDrag = useCallback(
    (e: React.PointerEvent<HTMLElement>, cancelled = false) => {
      const st = dragStateRef.current
      if (!st.active) return
      st.active = false

      try {
        if (
          st.pointerId !== null &&
          e.currentTarget.hasPointerCapture(st.pointerId)
        ) {
          e.currentTarget.releasePointerCapture(st.pointerId)
        }
      } catch {
        // Ignore
      }

      if (cancelled || !st.lockedHorizontal) {
        if (revealProgressRef.current > 0) {
          animateRevealTo(0, 260)
        } else {
          setEntranceState('awaiting-gesture')
        }
        return
      }

      const totalLeftDragPx = Math.max(0, -(e.clientX - st.startX))
      const viewportWidth = Math.max(320, window.innerWidth || 1440)
      const timeSinceLastMove = performance.now() - st.lastTime
      const releaseVelocityX = timeSinceLastMove > 45 ? 0 : st.velocityX
      // Adaptive completion threshold:
      // - Desktop (1440px): ~200px leftward drag
      // - Mobile (390px): ~78px leftward swipe
      // - Or a deliberate leftward fling at release (releaseVelocityX < -0.55 px/ms with >= 115px drag)
      const distanceThresholdPx = Math.min(200, viewportWidth * 0.2)
      const flingMinDistancePx = Math.min(115, viewportWidth * 0.14)
      const isFlingLeft =
        releaseVelocityX < -0.55 && totalLeftDragPx >= flingMinDistancePx

      if (totalLeftDragPx >= distanceThresholdPx || isFlingLeft) {
        animateRevealTo(1, 360)
      } else {
        animateRevealTo(0, 280)
      }
    },
    [animateRevealTo]
  )

  // Expose QA inspection state on window
  useEffect(() => {
    window.__getLoveStoryEntranceState = () => ({
      entranceState,
      handwritingPhase,
      revealProgress: revealProgressRef.current,
      isOverlayMounted: entranceState !== 'entered',
    })
    return () => {
      delete window.__getLoveStoryEntranceState
    }
  }, [entranceState, handwritingPhase])

  const isOverlayMounted = entranceState !== 'entered'
  const isGesturePromptVisible =
    handwritingPhase === 'awaiting-gesture' ||
    entranceState === 'awaiting-gesture' ||
    entranceState === 'dragging' ||
    entranceState === 'settling-back'

  const backToPortfolioLabel = isZh ? '返回作品集' : 'Back to Portfolio'
  const skipIntroLabel = isZh ? '跳过开场' : 'Skip Intro'
  const nextProjectLabel = isZh ? '下一个项目' : 'Next Case Study'

  // Required directional instruction copy (Section 6)
  const desktopDragInstruction = isZh
    ? '按住向左拖动，进入故事'
    : 'Hold & drag left to explore'
  const mobileSwipeInstruction = isZh
    ? '向左滑动，进入故事'
    : 'Swipe left to explore'
  const accessibleEnterLabel = isZh ? '或按 ← / 点击直接进入' : 'or press ← / click to enter'

  return (
    <main
      id="main-content"
      className={`lovestory-standalone-world lovestory-case-study is-entrance-${entranceState}`}
      data-project-theme="lovestory"
      data-standalone-world="lovestory"
      data-entrance-state={entranceState}
    >
      {/* ====================================================================
          MINIMAL STANDALONE NAVIGATION BAR
          Single discreet "← Back to Portfolio" + Compact LoveStory EN / 中文
          ==================================================================== */}
      <header
        className={`ls-standalone-topbar ${
          entranceState === 'entered' ? 'is-on-paper' : 'is-on-archive'
        }`}
        data-no-drag="true"
      >
        <button
          type="button"
          className="ls-back-portfolio-btn"
          onClick={onBackToPortfolio}
        >
          <ArrowLeftIcon size={15} />
          <span>{backToPortfolioLabel}</span>
        </button>

        <div className="ls-standalone-topbar-right">
          {/* While entrance is active, show discreet Skip Intro button */}
          {isOverlayMounted ? (
            <button
              type="button"
              className="ls-intro-skip-btn"
              onClick={triggerAccessibleEnter}
              aria-label={skipIntroLabel}
            >
              <span>{skipIntroLabel}</span>
              <kbd className="ls-intro-skip-kbd">ESC</kbd>
            </button>
          ) : project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ls-standalone-live-link"
            >
              <span>{loveStoryData.scene01Story.liveCtaLabel}</span>
              <ArrowUpRightIcon size={14} />
            </a>
          ) : null}

          <div
            className="ls-standalone-lang-switch"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              className={`ls-lang-btn ${locale === 'en' ? 'is-active' : ''}`}
              aria-pressed={locale === 'en'}
              onClick={() => setLocale('en')}
            >
              EN
            </button>
            <span className="ls-lang-sep" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              className={`ls-lang-btn ${
                locale === 'zh-CN' ? 'is-active' : ''
              }`}
              aria-pressed={locale === 'zh-CN'}
              onClick={() => setLocale('zh-CN')}
            >
              中文
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          STATE A — FULLSCREEN DARK ARCHIVE ENTRANCE CURTAIN
          Translates leftward as the user holds and drags left (or swipes left),
          progressively uncovering the Paper & Ink Case Study from the right.
          Completely removed from the DOM once entranceState === 'entered'.
          ==================================================================== */}
      {isOverlayMounted ? (
        <section
          ref={entranceOverlayRef}
          id="cs-chapter-ls-scene-01"
          data-scene-id="ls-scene-01"
          data-reveal-progress="0.000"
          className={`ls-entrance-curtain is-state-${entranceState}`}
          aria-labelledby="lovestory-hero-title"
          onPointerDown={handleEntrancePointerDown}
          onPointerMove={handleEntrancePointerMove}
          onPointerUp={(e) => finishPointerDrag(e, false)}
          onPointerCancel={(e) => finishPointerDrag(e, true)}
        >
          <div className="ls-entrance-stage-inner">
            {/* Continuous Handwritten Gold Line + Rightward Y Extension + Shimmer */}
            <LoveStoryLineIntro
              playHandwriting={playIntroOnMount && !prefersReducedMotion}
              prefersReducedMotion={prefersReducedMotion}
              onPhaseChange={handleHandwritingPhaseChange}
              onHandwritingComplete={handleHandwritingComplete}
            />

            {/* Restrained Subtitle beneath the Handwritten Wordmark */}
            <div
              className={`ls-entrance-caption-block ${
                isGesturePromptVisible ? 'is-visible' : 'is-waiting'
              }`}
            >
              <p className="ls-hero-subtitle-concise">
                {loveStoryData.scene01Story.positioningLead}
              </p>
            </div>
          </div>

          {/* Bottom Tactile Horizontal Drag-Left Prompt + Accessible Entry Control */}
          <div
            className={`ls-entrance-gesture-bar ${
              isGesturePromptVisible ? 'is-visible' : 'is-waiting'
            }`}
          >
            <div className="ls-gesture-indicator-pill" aria-hidden="true">
              <span className="ls-gesture-track">
                <span className="ls-gesture-sliding-dot" />
              </span>
              <ArrowLeftIcon size={14} />
              <span className="ls-gesture-text ls-gesture-text--desktop">
                {desktopDragInstruction}
              </span>
              <span className="ls-gesture-text ls-gesture-text--touch">
                {mobileSwipeInstruction}
              </span>
            </div>

            <button
              type="button"
              className="ls-accessible-enter-link"
              data-no-drag="true"
              onClick={triggerAccessibleEnter}
            >
              <span>{accessibleEnterLabel}</span>
              <ArrowRightIcon size={13} />
            </button>
          </div>
        </section>
      ) : null}

      {/* ====================================================================
          STATE B — MAIN PAPER & INK CASE STUDY (Concealed behind State A until
          dragged left; starts directly with Requirements & Design Decisions)
          ==================================================================== */}
      <div
        ref={stateBContainerRef}
        className={`ls-state-b-viewport ${
          isOverlayMounted ? 'is-behind-curtain' : 'is-active-main'
        }`}
      >
        <LoveStoryCaseStudy
          project={project}
          allProjects={allProjects}
          loveStoryData={loveStoryData}
          backToPortfolioLabel={backToPortfolioLabel}
          nextProjectLabel={nextProjectLabel}
          onBackToPortfolio={onBackToPortfolio}
          onSelectProject={onSelectProject}
        />
      </div>
    </main>
  )
}
