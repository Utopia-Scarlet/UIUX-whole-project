import React, { useCallback, useEffect, useRef, useState } from 'react'

export type LoveStoryIntroPhase =
  | 'entering'
  | 'curving'
  | 'writing'
  | 'curving-out'
  | 'extending-right'
  | 'awaiting-gesture'

interface LoveStoryLineIntroProps {
  /** True when the handwriting animation should play from 0 -> 3.35s */
  playHandwriting: boolean
  prefersReducedMotion: boolean
  onPhaseChange?: (phase: LoveStoryIntroPhase, progress: number) => void
  onHandwritingComplete?: () => void
}

declare global {
  interface Window {
    __setLoveStoryIntroTimeMs?: (ms: number) => void
    __setLoveStoryShimmerProgress?: (p: number | null) => void
    __getLoveStoryIntroState?: () => {
      elapsedMs: number
      phase: LoveStoryIntroPhase
      progress: number
      drawnLength: number
      totalLength: number
      penTip: { x: number; y: number }
      shimmerProgress: number
      shimmerPoint: { x: number; y: number }
    }
  }
}

/**
 * 100% Connected Single-Stroke Calligraphic SVG Path for "LoveStory"
 * with Organic Rightward Extension from the Lowercase "y" to the Right Viewport Edge.
 *
 * ViewBox: 0 0 1440 360
 *
 * Measured Cumulative Path Lengths (Total = 3413px):
 * - [0.00s – 0.60s] Left Entry (0px -> 246px, ratio 0.0000 -> 0.0721):
 *   Enters from far left edge (0, 226) -> (245, 218)
 * - [0.60s – 1.00s] Gentle Curve (246px -> 420px, ratio 0.0721 -> 0.1231):
 *   Bends gracefully upward toward the central wordmark area (245, 218) -> (392, 130)
 * - [1.00s – 2.55s] Handwritten "LoveStory" Tracing (420px -> 2909px, ratio 0.1231 -> 0.8523):
 *   Physically traces every connected glyph stroke: L -> o -> v -> e -> S -> t (with crossbar) -> o -> r -> y
 *   completing the ascending left side of y's descender loop at (964, 298).
 * - [2.55s – 2.85s] Outward Curve from "y" (2909px -> 3027px, ratio 0.8523 -> 0.8869):
 *   Emerges organically from y's lower loop (964, 298) -> (1054, 234).
 * - [2.85s – 3.35s] Rightward Horizontal Extension (3027px -> 3413px, ratio 0.8869 -> 1.0000):
 *   Extends smoothly toward the right edge of the viewport (1054, 234) -> (1440, 226).
 */
export const LOVESTORY_CONTINUOUS_PATH_D = [
  // 1. Entry from far left (0..245) & gentle curve to L (245..392)
  'M 0 226',
  'C 95 226, 170 232, 245 218',
  'C 308 206, 354 172, 392 130',

  // 2. Capital "L" — tall upper loop (392,130 -> 436,92 -> 388,228), heel loop, baseline wave to "o"
  'C 412 104, 434 90, 436 112',
  'C 438 136, 404 184, 388 228',
  'C 380 246, 368 246, 372 232',
  'C 376 218, 394 220, 414 234',
  'C 432 246, 452 242, 470 214',

  // 3. Lowercase "o" — full oval + top cursive bridge to "v"
  'C 476 190, 490 176, 504 178',
  'C 520 180, 524 206, 514 226',
  'C 504 242, 480 242, 474 222',
  'C 468 202, 480 178, 500 178',
  'C 514 178, 524 190, 538 184',

  // 4. Lowercase "v" — rounded entry shoulder, crisp bottom vertex (558,238), upper eyelet to "e"
  'C 544 182, 548 198, 554 224',
  'C 557 238, 561 238, 566 224',
  'C 572 206, 578 186, 584 180',
  'C 590 175, 596 190, 608 204',

  // 5. Lowercase "e" — inner crossbar, upper bowl, rounded baseline exit
  'C 622 206, 642 196, 638 182',
  'C 634 168, 612 174, 608 198',
  'C 604 222, 618 242, 644 236',

  // 6. Capital "S" — connects from "e" up to the top crest of S, traces the S spine & lower bowl
  'C 668 230, 688 192, 706 146',
  'C 718 116, 740 102, 748 116',
  'C 754 126, 740 140, 720 134',
  'C 702 128, 698 146, 716 168',
  'C 734 190, 752 206, 746 228',
  'C 740 246, 708 248, 698 234',
  'C 690 222, 706 216, 728 228',
  'C 748 238, 766 226, 778 192',

  // 7. Lowercase "t" — ascender stem up to (794, 112), retraces down to crossbar height (789, 154),
  //    draws crisp horizontal crossbar (768,156 -> 814,151 -> 789,154), then continues down stem to "o"
  'C 786 164, 792 130, 794 112',
  'L 789 154',
  'L 768 156',
  'L 814 151',
  'L 789 154',
  'C 787 180, 786 204, 786 220',
  'C 786 236, 798 242, 814 228',
  'C 822 220, 828 206, 834 196',

  // 8. Lowercase "o" — second oval + smooth dip before "r"
  'C 840 182, 854 176, 868 178',
  'C 884 180, 888 206, 878 226',
  'C 868 242, 844 242, 838 222',
  'C 832 202, 844 178, 864 178',
  'C 876 178, 884 190, 896 190',

  // 9. Lowercase "r" — smooth rise to top-left shoulder (908,174), flat cursive roof (928,182),
  //    downward right stem to baseline valley (938,232)
  'C 902 190, 904 176, 908 174',
  'C 914 172, 924 174, 928 182',
  'C 934 192, 932 218, 938 232',
  'C 943 242, 956 236, 964 212',

  // 10. Lowercase "y" — u-bowl (970,178 -> 984,236 -> 1008,178) & descender loop to (964,298)
  'C 966 198, 968 182, 970 178',
  'C 970 204, 972 236, 984 236',
  'C 996 236, 1004 204, 1008 178',
  'C 1006 214, 1000 270, 992 300',
  'C 984 324, 962 322, 964 298',

  // 11. Organic outward curve from "y" & horizontal extension to the RIGHT edge (1440, 226)
  'C 966 272, 996 246, 1054 234',
  'C 1130 218, 1260 226, 1440 226',
].join(' ')

/**
 * Exact subpath for the rightward extension emerging from the final "y" stroke
 * Used for the subtle repeating gold-light shimmer once handwriting completes.
 */
export const LOVESTORY_RIGHT_EXTENSION_PATH_D = [
  'M 964 298',
  'C 966 272, 996 246, 1054 234',
  'C 1130 218, 1260 226, 1440 226',
].join(' ')

export const TOTAL_HANDWRITING_DURATION_MS = 3350
const DEFAULT_TOTAL_PATH_LENGTH = 3413
const DEFAULT_EXTENSION_LENGTH = 504
const SHIMMER_CYCLE_MS = 2750
const SHIMMER_ACTIVE_TRAVEL_MS = 1950

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * Math.max(0, Math.min(1, t))) - 1) / 2
}

function easeOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t))
  return 1 - Math.pow(1 - clamped, 3)
}

/**
 * Maps elapsed milliseconds (0..3350ms) deterministically to:
 * - phase ('entering' | 'curving' | 'writing' | 'curving-out' | 'extending-right' | 'awaiting-gesture')
 * - pathProgress (0..1 fraction of total SVG path length)
 */
export function evaluateLoveStoryTimeline(elapsedMs: number): {
  phase: LoveStoryIntroPhase
  pathProgress: number
} {
  if (elapsedMs <= 0) {
    return { phase: 'entering', pathProgress: 0 }
  }
  if (elapsedMs < 600) {
    // 0.00 - 0.60s: Fine gold line enters from far left (ratio 0 -> 0.0721)
    const local = easeOutCubic(elapsedMs / 600)
    return {
      phase: 'entering',
      pathProgress: local * 0.0721,
    }
  }
  if (elapsedMs < 1000) {
    // 0.60 - 1.00s: Gently bends toward the central wordmark area (ratio 0.0721 -> 0.1231)
    const local = easeInOutSine((elapsedMs - 600) / 400)
    return {
      phase: 'curving',
      pathProgress: 0.0721 + local * (0.1231 - 0.0721),
    }
  }
  if (elapsedMs < 2550) {
    // 1.00 - 2.55s: Physically traces the handwritten strokes spelling LoveStory (ratio 0.1231 -> 0.8523)
    const local = easeInOutSine((elapsedMs - 1000) / 1550)
    return {
      phase: 'writing',
      pathProgress: 0.1231 + local * (0.8523 - 0.1231),
    }
  }
  if (elapsedMs < 2850) {
    // 2.55 - 2.85s: Final stroke of y curves naturally outward (ratio 0.8523 -> 0.8869)
    const local = easeInOutSine((elapsedMs - 2550) / 300)
    return {
      phase: 'curving-out',
      pathProgress: 0.8523 + local * (0.8869 - 0.8523),
    }
  }
  if (elapsedMs < TOTAL_HANDWRITING_DURATION_MS) {
    // 2.85 - 3.35s: Line extends horizontally to the RIGHT edge of the viewport (ratio 0.8869 -> 1.0)
    const local = easeOutCubic((elapsedMs - 2850) / 500)
    return {
      phase: 'extending-right',
      pathProgress: 0.8869 + local * (1 - 0.8869),
    }
  }
  return { phase: 'awaiting-gesture', pathProgress: 1 }
}

export const LoveStoryLineIntro: React.FC<LoveStoryLineIntroProps> = ({
  playHandwriting,
  prefersReducedMotion,
  onPhaseChange,
  onHandwritingComplete,
}) => {
  const pathRef = useRef<SVGPathElement | null>(null)
  const extensionPathRef = useRef<SVGPathElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const shimmerRafRef = useRef<number | null>(null)
  const manualOverrideRef = useRef<boolean>(false)
  const manualShimmerOverrideRef = useRef<number | null>(null)

  const shouldAnimateInitially = playHandwriting && !prefersReducedMotion

  const [totalLength, setTotalLength] = useState<number>(
    DEFAULT_TOTAL_PATH_LENGTH
  )
  const [extensionLength, setExtensionLength] = useState<number>(
    DEFAULT_EXTENSION_LENGTH
  )
  const [elapsedMs, setElapsedMs] = useState<number>(
    shouldAnimateInitially ? 0 : TOTAL_HANDWRITING_DURATION_MS
  )
  const [penTip, setPenTip] = useState<{ x: number; y: number }>({
    x: shouldAnimateInitially ? 0 : 1440,
    y: 226,
  })

  // Subtle repeating gold-light shimmer state along the rightward extension (0..1)
  const [shimmerProgress, setShimmerProgress] = useState<number>(0.38)
  const [shimmerPoint, setShimmerPoint] = useState<{ x: number; y: number }>({
    x: 1140,
    y: 225,
  })

  const { phase, pathProgress } = evaluateLoveStoryTimeline(elapsedMs)
  const drawnLength = totalLength * pathProgress
  const dashOffset = Math.max(0, totalLength - drawnLength)

  const updatePenTipFromProgress = useCallback(
    (progressVal: number, pathLen: number) => {
      const el = pathRef.current
      if (!el) return
      try {
        const pt = el.getPointAtLength(
          Math.max(0, Math.min(pathLen, progressVal * pathLen))
        )
        setPenTip({
          x: Math.round(pt.x * 10) / 10,
          y: Math.round(pt.y * 10) / 10,
        })
      } catch {
        // Ignore if SVG not yet layout-ready
      }
    },
    []
  )

  const updateShimmerFromProgress = useCallback(
    (sProg: number, extLen: number) => {
      const extEl = extensionPathRef.current
      if (!extEl) return
      try {
        const clamped = Math.max(0, Math.min(1, sProg))
        const pt = extEl.getPointAtLength(clamped * extLen)
        setShimmerPoint({
          x: Math.round(pt.x * 10) / 10,
          y: Math.round(pt.y * 10) / 10,
        })
      } catch {
        // Ignore if SVG not yet layout-ready
      }
    },
    []
  )

  // Measure actual SVG path lengths on mount
  useEffect(() => {
    if (pathRef.current) {
      try {
        const measured = pathRef.current.getTotalLength()
        if (measured > 0) setTotalLength(measured)
      } catch {
        // Fallback
      }
    }
    if (extensionPathRef.current) {
      try {
        const extMeasured = extensionPathRef.current.getTotalLength()
        if (extMeasured > 0) {
          setExtensionLength(extMeasured)
          updateShimmerFromProgress(0.38, extMeasured)
        }
      } catch {
        // Fallback
      }
    }
  }, [updateShimmerFromProgress])

  // Primary Handwriting Animation Controller (0.00s -> 3.35s)
  useEffect(() => {
    if (!playHandwriting || prefersReducedMotion) {
      setElapsedMs(TOTAL_HANDWRITING_DURATION_MS)
      onPhaseChange?.('awaiting-gesture', 1)
      onHandwritingComplete?.()
      return
    }

    manualOverrideRef.current = false
    setElapsedMs(0)
    onPhaseChange?.('entering', 0)

    const startTime = performance.now()

    const tick = (now: number) => {
      if (manualOverrideRef.current) return
      const nextElapsed = Math.min(
        TOTAL_HANDWRITING_DURATION_MS,
        now - startTime
      )
      const evaluated = evaluateLoveStoryTimeline(nextElapsed)
      setElapsedMs(nextElapsed)
      onPhaseChange?.(evaluated.phase, evaluated.pathProgress)

      if (pathRef.current) {
        const len =
          pathRef.current.getTotalLength() || DEFAULT_TOTAL_PATH_LENGTH
        updatePenTipFromProgress(evaluated.pathProgress, len)
      }

      if (nextElapsed < TOTAL_HANDWRITING_DURATION_MS) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
        onHandwritingComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [
    onHandwritingComplete,
    onPhaseChange,
    playHandwriting,
    prefersReducedMotion,
    updatePenTipFromProgress,
  ])

  // Subtle Repeating Gold-Light Motion along the Rightward Extension
  // Runs only after handwriting completes ('awaiting-gesture') and when !prefersReducedMotion
  useEffect(() => {
    if (phase !== 'awaiting-gesture' || prefersReducedMotion) {
      if (shimmerRafRef.current !== null) {
        cancelAnimationFrame(shimmerRafRef.current)
        shimmerRafRef.current = null
      }
      return
    }

    const startLoop = performance.now()

    const tickShimmer = (now: number) => {
      if (manualShimmerOverrideRef.current !== null) return
      const cycleElapsed = (now - startLoop) % SHIMMER_CYCLE_MS
      if (cycleElapsed <= SHIMMER_ACTIVE_TRAVEL_MS) {
        const raw = cycleElapsed / SHIMMER_ACTIVE_TRAVEL_MS
        const eased = easeInOutSine(raw)
        setShimmerProgress(eased)
        const extLen =
          extensionPathRef.current?.getTotalLength() || extensionLength
        updateShimmerFromProgress(eased, extLen)
      } else {
        setShimmerProgress(1)
      }
      shimmerRafRef.current = requestAnimationFrame(tickShimmer)
    }

    shimmerRafRef.current = requestAnimationFrame(tickShimmer)

    return () => {
      if (shimmerRafRef.current !== null) {
        cancelAnimationFrame(shimmerRafRef.current)
        shimmerRafRef.current = null
      }
    }
  }, [
    extensionLength,
    phase,
    prefersReducedMotion,
    updateShimmerFromProgress,
  ])

  // Deterministic QA & inspection hooks on window
  useEffect(() => {
    window.__setLoveStoryIntroTimeMs = (ms: number) => {
      manualOverrideRef.current = true
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      const clamped = Math.max(0, Math.min(TOTAL_HANDWRITING_DURATION_MS, ms))
      const evaluated = evaluateLoveStoryTimeline(clamped)
      setElapsedMs(clamped)
      onPhaseChange?.(evaluated.phase, evaluated.pathProgress)
      if (pathRef.current) {
        const len =
          pathRef.current.getTotalLength() || DEFAULT_TOTAL_PATH_LENGTH
        setTotalLength(len)
        updatePenTipFromProgress(evaluated.pathProgress, len)
      }
      if (clamped >= TOTAL_HANDWRITING_DURATION_MS) {
        onHandwritingComplete?.()
      }
    }

    window.__setLoveStoryShimmerProgress = (p: number | null) => {
      manualShimmerOverrideRef.current = p
      if (p !== null) {
        const clamped = Math.max(0, Math.min(1, p))
        setShimmerProgress(clamped)
        const extLen =
          extensionPathRef.current?.getTotalLength() || extensionLength
        updateShimmerFromProgress(clamped, extLen)
      }
    }

    window.__getLoveStoryIntroState = () => ({
      elapsedMs,
      phase,
      progress: pathProgress,
      drawnLength,
      totalLength,
      penTip,
      shimmerProgress,
      shimmerPoint,
    })

    return () => {
      delete window.__setLoveStoryIntroTimeMs
      delete window.__setLoveStoryShimmerProgress
      delete window.__getLoveStoryIntroState
    }
  }, [
    drawnLength,
    elapsedMs,
    extensionLength,
    onHandwritingComplete,
    onPhaseChange,
    pathProgress,
    penTip,
    phase,
    shimmerPoint,
    shimmerProgress,
    totalLength,
    updatePenTipFromProgress,
    updateShimmerFromProgress,
  ])

  const isDrawing = phase !== 'awaiting-gesture'
  const showShimmer =
    phase === 'awaiting-gesture' &&
    !prefersReducedMotion &&
    shimmerProgress > 0.01 &&
    shimmerProgress < 0.99

  // Natural bell-curve opacity envelope so the travelling shimmer fades in after 'y' and fades out before the right edge
  const shimmerOpacity = showShimmer
    ? Math.sin(Math.PI * Math.max(0, Math.min(1, shimmerProgress))) * 0.92
    : 0
  const shimmerSegmentLength = 96
  const shimmerCenterDist = shimmerProgress * extensionLength
  const shimmerDashOffset = shimmerSegmentLength / 2 - shimmerCenterDist

  return (
    <div
      className={`ls-handwritten-stage-wrap is-phase-${phase}`}
      data-intro-phase={phase}
      data-intro-progress={pathProgress.toFixed(3)}
    >
      {/* Accessible Heading + Continuous Single-Stroke Handwritten SVG Wordmark */}
      <h1 id="lovestory-hero-title" className="ls-handwritten-hero-heading">
        <span className="sr-only">LoveStory</span>
        <svg
          className="ls-handwritten-wordmark-svg"
          viewBox="0 0 1440 360"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="LoveStory handwritten continuous gold line wordmark extending to the right"
        >
          <defs>
            <linearGradient
              id="ls-continuous-gold-stroke"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#806C49" />
              <stop offset="22%" stopColor="#B79A62" />
              <stop offset="52%" stopColor="#C8AD75" />
              <stop offset="78%" stopColor="#B79A62" />
              <stop offset="100%" stopColor="#806C49" />
            </linearGradient>

            <linearGradient
              id="ls-right-shimmer-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#B79A62" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#C8AD75" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#E8E3D8" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* The Single Continuous Gold Line that enters from left, writes LoveStory, and extends to the right edge */}
          <path
            ref={pathRef}
            className="ls-continuous-wordmark-path"
            d={LOVESTORY_CONTINUOUS_PATH_D}
            fill="none"
            stroke="url(#ls-continuous-gold-stroke)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: `${totalLength}px`,
              strokeDashoffset: `${dashOffset}px`,
            }}
          />

          {/* Subtle Repeating Gold-Light Shimmer along the Rightward Extension ONLY */}
          <path
            ref={extensionPathRef}
            className="ls-right-extension-shimmer-path"
            d={LOVESTORY_RIGHT_EXTENSION_PATH_D}
            fill="none"
            stroke="url(#ls-right-shimmer-gradient)"
            strokeWidth="3.6"
            strokeLinecap="round"
            style={{
              opacity: shimmerOpacity,
              strokeDasharray: `${shimmerSegmentLength}px ${
                extensionLength * 2.5
              }px`,
              strokeDashoffset: `${shimmerDashOffset}px`,
            }}
          />

          {/* Travelling Luminous Gold Highlight along the Rightward Extension */}
          {showShimmer ? (
            <g
              className="ls-shimmer-highlight-node"
              transform={`translate(${shimmerPoint.x}, ${shimmerPoint.y})`}
              style={{ opacity: shimmerOpacity }}
            >
              <circle r="6.5" fill="rgba(200, 173, 117, 0.22)" />
              <circle r="2.6" fill="#E8E3D8" />
            </g>
          ) : null}

          {/* Active Drawing Nib / Line Head Indicator (visible while handwriting is drawing) */}
          {isDrawing && elapsedMs > 16 ? (
            <g
              className="ls-drawing-nib-group"
              transform={`translate(${penTip.x}, ${penTip.y})`}
            >
              <circle
                className="ls-drawing-nib-halo"
                r="7"
                fill="rgba(200, 173, 117, 0.24)"
              />
              <circle
                className="ls-drawing-nib-core"
                r="3.2"
                fill="#E8E3D8"
              />
            </g>
          ) : null}
        </svg>
      </h1>
    </div>
  )
}
