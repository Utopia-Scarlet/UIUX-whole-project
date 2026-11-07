import React, { useLayoutEffect, useRef } from 'react'
import { motion, type MotionValue } from 'motion/react'
import { useLanguage } from '../../context/LanguageContext'
import {
  HERO_ENTRANCE_TIMING,
  REDUCED_MOTION_TRANSITION,
  SHARED_LAYOUT_TRANSITION,
} from '../../config/motionConfig'

/**
 * Dynamically fits a single-line display word on mobile viewports (<= 768px)
 * so its visible glyph bounds occupy `targetWidthRatio` (e.g. 97.2%) of its region's width
 * AND `targetHeightRatio` of its region's width.
 *
 * CRITICAL ARCHITECTURE NOTE:
 * `textRef` is attached to a dedicated inner `<span className="oversized-name-glyphs">`
 * inside `<motion.span>`, NOT on `<motion.span>` itself. This prevents Framer Motion's
 * entrance animation (`animate={{ opacity: 1, y: 0 }}`) from overwriting `style.transform`
 * back to `transform: none` during or after the initial entrance animation.
 * Furthermore, `offsetWidth` and `offsetHeight` are used for layout measurement so
 * parent entrance transforms never skew the measured glyph dimensions.
 */
function useMobileRegionFill(
  containerRef: React.RefObject<HTMLElement | null>,
  textRef: React.RefObject<HTMLElement | null>,
  targetWidthRatio: number,
  targetHeightRatio: number,
  depKey: string
) {
  useLayoutEffect(() => {
    const containerEl = containerRef.current
    const textEl = textRef.current
    if (!containerEl || !textEl || typeof window === 'undefined') return

    const mql = window.matchMedia('(max-width: 768px)')

    const fitText = () => {
      if (!mql.matches) {
        textEl.style.fontSize = ''
        textEl.style.transform = ''
        textEl.style.transformOrigin = ''
        containerEl.style.height = ''
        return
      }

      const containerWidth = containerEl.clientWidth
      if (containerWidth <= 0) return

      const desiredWidth = containerWidth * targetWidthRatio
      const desiredHeight = containerWidth * targetHeightRatio

      // Measure untransformed layout dimensions at a 100px reference font size
      const refSize = 100
      textEl.style.transform = 'none'
      textEl.style.fontSize = `${refSize}px`

      const rawW = textEl.offsetWidth
      const rawH = textEl.offsetHeight
      if (rawW <= 0 || rawH <= 0) return

      // Choose geometric-mean base font-size between width-fit and height-fit
      const fontSizeForWidth = (refSize * desiredWidth) / rawW
      const fontSizeForHeight = (refSize * desiredHeight) / rawH
      const baseFontSize = Math.sqrt(fontSizeForWidth * fontSizeForHeight)

      textEl.style.fontSize = `${baseFontSize.toFixed(2)}px`

      const unscaledW = textEl.offsetWidth
      const unscaledH = textEl.offsetHeight
      if (unscaledW <= 0 || unscaledH <= 0) return

      const scaleX = desiredWidth / unscaledW
      const scaleY = desiredHeight / unscaledH
      const finalHeight = Math.round(desiredHeight)

      containerEl.style.height = `${finalHeight}px`
      textEl.style.transformOrigin = 'center center'
      textEl.style.transform = `translate(-50%, -50%) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`
    }

    fitText()

    const ro = new ResizeObserver(() => {
      fitText()
    })
    ro.observe(containerEl)

    const handleMqlChange = () => fitText()
    mql.addEventListener?.('change', handleMqlChange)
    window.addEventListener('resize', fitText)

    let isCancelled = false
    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (!isCancelled) fitText()
      })
      document.fonts.addEventListener?.('loadingdone', fitText)
    }

    return () => {
      isCancelled = true
      ro.disconnect()
      mql.removeEventListener?.('change', handleMqlChange)
      window.removeEventListener('resize', fitText)
      document.fonts?.removeEventListener?.('loadingdone', fitText)
    }
  }, [containerRef, textRef, targetWidthRatio, targetHeightRatio, depKey])
}

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
  const containerRef = useRef<HTMLHeadingElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)

  useMobileRegionFill(
    containerRef,
    textRef,
    0.972,
    0.268,
    t.identity.firstNameUpper
  )

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
        ref={containerRef}
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
          <span ref={textRef} className="oversized-name-glyphs">
            {t.identity.firstNameUpper}
          </span>
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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)

  useMobileRegionFill(
    containerRef,
    textRef,
    0.968,
    0.88,
    t.identity.lastNameUpper
  )

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
      <div ref={containerRef} className="hero-front-heading-wrap">
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
          <span ref={textRef} className="oversized-name-glyphs">
            {t.identity.lastNameUpper}
          </span>
        </motion.span>
      </div>
    </motion.div>
  )
}
