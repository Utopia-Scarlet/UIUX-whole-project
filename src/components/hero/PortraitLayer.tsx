import React, { useState } from 'react'
import { motion, type MotionValue } from 'motion/react'
import { DESIGNER_IDENTITY } from '../../data/portfolioData'
import { useLanguage } from '../../context/LanguageContext'
import {
  HERO_ENTRANCE_TIMING,
  REDUCED_MOTION_TRANSITION,
  SHARED_LAYOUT_TRANSITION,
} from '../../config/motionConfig'

interface PortraitGraphicProps {
  compact?: boolean
}

/**
 * Layer B — Personal Portrait Subject.
 * Loads the transparent-background cutout (`/portrait/jianshuo-portrait.png` or `.webp`).
 * All development badges, rectangular frames, and HUD crosshairs are removed when the portrait loads.
 * A clean minimal fallback silhouette is rendered only if all image candidates fail to load.
 */
export const PortraitSubjectGraphic: React.FC<PortraitGraphicProps> = ({
  compact = false,
}) => {
  const { t } = useLanguage()
  const [candidateIndex, setCandidateIndex] = useState<number>(0)
  const candidates = [
    DESIGNER_IDENTITY.portraitAssetSpec.fallbackPath, // '/portrait/jianshuo-portrait.png' (true RGBA cutout)
    DESIGNER_IDENTITY.portraitAssetSpec.primaryPath,  // '/portrait/jianshuo-portrait.webp'
  ]

  const hasExhaustedCandidates = candidateIndex >= candidates.length

  if (!hasExhaustedCandidates) {
    return (
      <img
        src={candidates[candidateIndex]}
        alt={
          compact
            ? t.identity.portraitCompactAriaLabel
            : t.identity.portraitAriaLabel
        }
        className={
          compact
            ? 'portrait-real-img portrait-real-img--compact'
            : 'portrait-real-img'
        }
        draggable={false}
        onError={() => setCandidateIndex((prev) => prev + 1)}
      />
    )
  }

  return (
    <svg
      viewBox="0 0 440 550"
      className="portrait-silhouette-svg"
      role="img"
      aria-label={
        compact
          ? t.identity.portraitCompactAriaLabel
          : t.identity.portraitAriaLabel
      }
    >
      <defs>
        <linearGradient id="studio-torso-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--portrait-silhouette-mid)" />
          <stop offset="65%" stopColor="var(--portrait-silhouette-base)" />
          <stop offset="100%" stopColor="#090B10" />
        </linearGradient>
        <linearGradient id="studio-head-grad" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="var(--portrait-silhouette-mid)" />
          <stop offset="100%" stopColor="var(--portrait-silhouette-base)" />
        </linearGradient>
      </defs>

      <path
        d="M46 550 C52 432, 92 362, 158 340 L186 328 L254 328 L282 340 C348 362, 388 432, 394 550 Z"
        fill="url(#studio-torso-grad)"
      />
      <path
        d="M188 265 L252 265 L258 336 L220 356 L182 336 Z"
        fill="var(--portrait-silhouette-base)"
      />
      <path
        d="M152 162 C150 102, 182 68, 224 68 C268 68, 294 102, 290 162 C296 174, 294 198, 284 206 C276 248, 250 282, 220 282 C190 282, 164 248, 156 206 C146 198, 146 174, 152 162 Z"
        fill="url(#studio-head-grad)"
      />
    </svg>
  )
}

interface PortraitLayerProps {
  parallaxX: MotionValue<number>
  parallaxY: MotionValue<number>
  prefersReducedMotion: boolean
  hasPlayedIntro: boolean
}

export const PortraitLayer: React.FC<PortraitLayerProps> = ({
  parallaxX,
  parallaxY,
  prefersReducedMotion,
  hasPlayedIntro,
}) => {
  const layoutTransition = prefersReducedMotion
    ? REDUCED_MOTION_TRANSITION
    : SHARED_LAYOUT_TRANSITION

  return (
    <motion.div
      className="hero-portrait-layer"
      style={
        prefersReducedMotion
          ? undefined
          : {
              x: parallaxX,
              y: parallaxY,
            }
      }
    >
      <motion.div
        layoutId="jianshuo-portrait-shared"
        transition={layoutTransition}
        className="portrait-stage-box"
      >
        <motion.div
          className="portrait-figure-wrap"
          initial={
            hasPlayedIntro || prefersReducedMotion
              ? false
              : { opacity: 0, y: 20, scale: 0.97 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={HERO_ENTRANCE_TIMING.portrait}
        >
          <PortraitSubjectGraphic />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
