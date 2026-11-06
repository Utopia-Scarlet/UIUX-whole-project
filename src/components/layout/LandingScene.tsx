import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { TopNav } from '../navigation/TopNav'
import { HeroTypographyBack, HeroTypographyFront } from '../hero/HeroTypography'
import { PortraitLayer } from '../hero/PortraitLayer'
import { useLanguage } from '../../context/LanguageContext'
import type { WorkspaceDestination } from '../../data/portfolioData'
import { HERO_ENTRANCE_TIMING, PARALLAX_OFFSET } from '../../config/motionConfig'

interface LandingSceneProps {
  onEnterWorkspace: (destination: WorkspaceDestination) => void
  isTransitioning: boolean
  prefersReducedMotion: boolean
  hasPlayedIntro: boolean
}

export const LandingScene: React.FC<LandingSceneProps> = ({
  onEnterWorkspace,
  isTransitioning,
  prefersReducedMotion,
  hasPlayedIntro,
}) => {
  const { t } = useLanguage()
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false)
  const rafRef = useRef<number | null>(null)

  // Normalized cursor coordinates (-0.5 to 0.5) stored in MotionValues to avoid React re-renders
  const backXRaw = useMotionValue(0)
  const backYRaw = useMotionValue(0)
  const portraitXRaw = useMotionValue(0)
  const portraitYRaw = useMotionValue(0)
  const frontXRaw = useMotionValue(0)
  const frontYRaw = useMotionValue(0)

  const springConfig = { stiffness: 110, damping: 24, mass: 0.6 }
  const backX = useSpring(backXRaw, springConfig)
  const backY = useSpring(backYRaw, springConfig)
  const portraitX = useSpring(portraitXRaw, springConfig)
  const portraitY = useSpring(portraitYRaw, springConfig)
  const frontX = useSpring(frontXRaw, springConfig)
  const frontY = useSpring(frontYRaw, springConfig)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
    setIsTouchDevice(coarsePointer)
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || isTouchDevice || isTransitioning) return
    const { clientX, clientY, currentTarget } = event
    const rect = currentTarget.getBoundingClientRect()

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const normX = (clientX - rect.left) / rect.width - 0.5
      const normY = (clientY - rect.top) / rect.height - 0.5

      backXRaw.set(normX * PARALLAX_OFFSET.backTypographyX)
      backYRaw.set(normY * PARALLAX_OFFSET.backTypographyY)
      portraitXRaw.set(normX * PARALLAX_OFFSET.portraitX)
      portraitYRaw.set(normY * PARALLAX_OFFSET.portraitY)
      frontXRaw.set(normX * PARALLAX_OFFSET.frontTypographyX)
      frontYRaw.set(normY * PARALLAX_OFFSET.frontTypographyY)
    })
  }

  const handlePointerLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }
    backXRaw.set(0)
    backYRaw.set(0)
    portraitXRaw.set(0)
    portraitYRaw.set(0)
    frontXRaw.set(0)
    frontYRaw.set(0)
  }

  const disableParallax = prefersReducedMotion || isTouchDevice

  return (
    <div
      className="editorial-canvas"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <TopNav
        onNavigateToWorkspace={onEnterWorkspace}
        isTransitioning={isTransitioning}
      />

      <main id="main-content" className="hero-stage">
        {/* Mobile Identity Eyebrow (visible on mobile <= 768px) */}
        <div className="mobile-identity-header">
          <div className="mobile-identity-row">
            <span className="mobile-role-pill">{t.identity.role}</span>
            {t.identity.supportingNameZh ? (
              <span className="mobile-zh-pill" lang="zh-CN">
                {t.identity.supportingNameZh}
              </span>
            ) : null}
          </div>
        </div>

        <div className="hero-composition">
          {/* LEFT ZONE (~44% on desktop): Vertically centred [Portrait] + [Focus Disciplines & Personal Introduction] */}
          <div className="hero-left-zone">
            <PortraitLayer
              parallaxX={portraitX}
              parallaxY={portraitY}
              prefersReducedMotion={disableParallax}
              hasPlayedIntro={hasPlayedIntro}
            />

            <motion.div
              className="hero-editorial-left"
              initial={
                hasPlayedIntro || prefersReducedMotion
                  ? false
                  : { opacity: 0, y: 14 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={HERO_ENTRANCE_TIMING.supporting}
            >
              <div
                className="hero-focus-inline-block"
                aria-label={t.identity.focusHeading}
              >
                <p className="hero-focus-heading">{t.identity.focusHeading}</p>
                <ul className="hero-focus-list">
                  {t.identity.interests.map((interest) => (
                    <li key={interest}>{interest}</li>
                  ))}
                </ul>
              </div>

              <div className="hero-intro-block">
                {t.identity.supportingNameZh ? (
                  <p className="hero-identity-zh-label" lang="zh-CN">
                    {t.identity.supportingNameZh} · {t.identity.nameEn}
                  </p>
                ) : null}
                <p className="hero-role-title">{t.identity.role}</p>
                <p className="hero-intro-copy">{t.identity.supportingCopy}</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT ZONE (~56% on desktop): Coherent typographic composition with JIANSHUO (upper) and LIU (lower) */}
          <div className="hero-right-zone">
            <HeroTypographyBack
              parallaxX={backX}
              parallaxY={backY}
              prefersReducedMotion={disableParallax}
              hasPlayedIntro={hasPlayedIntro}
            />

            <HeroTypographyFront
              parallaxX={frontX}
              parallaxY={frontY}
              prefersReducedMotion={disableParallax}
              hasPlayedIntro={hasPlayedIntro}
            />
          </div>

          {/* Mobile Primary CTAs directly reachable below Intro Copy on Mobile */}
          <div className="mobile-cta-group">
            <button
              type="button"
              className="btn-primary-enter"
              disabled={isTransitioning}
              onClick={() => onEnterWorkspace('overview')}
            >
              <span>{t.landingBottom.enterPortfolioCta}</span>
            </button>
            <button
              type="button"
              className="btn-secondary-work"
              disabled={isTransitioning}
              onClick={() => onEnterWorkspace('zero-line')}
            >
              {t.landingBottom.viewWorkCta}
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Action & Selected Projects Bar */}
      <footer className="hero-bottom-bar">
        <div className="hero-meta-cluster">
          <span className="hero-meta-item">
            <strong>{t.landingBottom.selectedProjectsLabel}</strong>{' '}
            {t.landingBottom.selectedProjectsValue}
          </span>
        </div>

        <div className="hero-cta-cluster">
          <button
            type="button"
            className="btn-secondary-work"
            disabled={isTransitioning}
            onClick={() => onEnterWorkspace('zero-line')}
          >
            {t.landingBottom.viewWorkCta}
          </button>
          <button
            type="button"
            className="btn-primary-enter"
            disabled={isTransitioning}
            onClick={() => onEnterWorkspace('overview')}
          >
            <span>{t.landingBottom.enterPortfolioCta}</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
