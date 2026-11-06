import React from 'react'
import { motion, type MotionValue } from 'motion/react'
import { useLanguage } from '../../context/LanguageContext'
import {
  HERO_ENTRANCE_TIMING,
  REDUCED_MOTION_TRANSITION,
  SHARED_LAYOUT_TRANSITION,
} from '../../config/motionConfig'

interface HeroTypographyBackProps {
  parallaxX: MotionValue<number>
  parallaxY: MotionValue<number>
  prefersReducedMotion: boolean
  hasPlayedIntro: boolean
}

/**
 * Layer A — Background Typography (z-index: 10):
 * Houses the single accessible semantic <h1> ("Jianshuo Liu — UI/UX & Interaction Designer")
 * and visually renders giant "JIANSHUO" spanning across the upper Hero canvas.
 */
export const HeroTypographyBack: React.FC<HeroTypographyBackProps> = ({
  parallaxX,
  parallaxY,
  prefersReducedMotion,
  hasPlayedIntro,
}) => {
  const { t } = useLanguage()
  const layoutTransition = prefersReducedMotion
    ? REDUCED_MOTION_TRANSITION
    : SHARED_LAYOUT_TRANSITION

  return (
    <motion.div
      className="hero-type-back-layer"
      style={
        prefersReducedMotion
          ? undefined
          : {
              x: parallaxX,
              y: parallaxY,
            }
      }
    >
      <motion.h1
        layout="position"
        layoutId="jianshuo-name-shared"
        transition={layoutTransition}
        className="hero-semantic-heading"
        aria-label={t.identity.heroHeadingAria}
      >
        <span className="sr-only">{t.identity.heroHeadingAria}</span>
        <motion.span
          aria-hidden="true"
          className="oversized-name-row oversized-name-first"
          initial={
            hasPlayedIntro || prefersReducedMotion
              ? false
              : { opacity: 0, y: 26, clipPath: 'inset(0 0 100% 0)' }
          }
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          transition={HERO_ENTRANCE_TIMING.nameBack}
        >
          {t.identity.firstNameUpper}
        </motion.span>
      </motion.h1>
    </motion.div>
  )
}

interface HeroTypographyFrontProps {
  parallaxX: MotionValue<number>
  parallaxY: MotionValue<number>
  prefersReducedMotion: boolean
  hasPlayedIntro: boolean
}

/**
 * Layer C — Foreground Typography (z-index: 30):
 * Renders giant "LIU" positioned toward the lower-right of the Hero canvas,
 * balancing the left-positioned portrait across the unified editorial stage.
 */
export const HeroTypographyFront: React.FC<HeroTypographyFrontProps> = ({
  parallaxX,
  parallaxY,
  prefersReducedMotion,
  hasPlayedIntro,
}) => {
  const { t } = useLanguage()

  return (
    <motion.div
      className="hero-type-front-layer"
      aria-hidden="true"
      style={
        prefersReducedMotion
          ? undefined
          : {
              x: parallaxX,
              y: parallaxY,
            }
      }
    >
      <div className="hero-front-heading-wrap">
        <motion.span
          className="oversized-name-row oversized-name-last"
          initial={
            hasPlayedIntro || prefersReducedMotion
              ? false
              : { opacity: 0, y: 30, clipPath: 'inset(0 0 100% 0)' }
          }
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          transition={HERO_ENTRANCE_TIMING.nameFront}
        >
          {t.identity.lastNameUpper}
        </motion.span>
      </div>
    </motion.div>
  )
}
