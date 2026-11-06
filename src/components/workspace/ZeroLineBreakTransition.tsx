import React, { useEffect, useRef, useState } from 'react'
import { type NovaIntroPoseId } from '../../data/portfolioData'
import {
  NovaIntroSequence,
  usePreloadNovaIntroFrames,
} from './NovaIntroSequence'

export type BreakStage =
  | 'idle'
  | 'stage-a-ready'
  | 'stage-b-draw'
  | 'stage-c-windup'
  | 'stage-d-strike'
  | 'stage-e-cut'
  | 'stage-f-reveal'

interface ZeroLineBreakTransitionProps {
  active: boolean
  prefersReducedMotion: boolean
  characterSlotLabel: string
  characterSlotSubnote: string
  tagline: string
  onComplete: () => void
}

/**
 * Deterministic 6-Stage / 4-Keyframe Timeline (~2.60s total)
 * Driven by a centralized high-resolution timer (16ms interval + exact stage boundary
 * timeouts so playback is 100% deterministic even when CVDisplayLink/rAF is throttled):
 *
 * - STAGE A — READY             (0.00s – 0.35s): FRAME 01 (`nova-01-ready.webp`)
 * - STAGE B — DRAW              (0.35s – 0.85s): FRAME 02 (`nova-02-draw.webp`)
 * - STAGE C — WIND-UP           (0.85s – 1.35s): FRAME 03 (`nova-03-windup.webp`)
 * - STAGE D — STRIKE            (1.35s – 1.70s): FRAME 04 (`nova-04-strike.webp`) + Crimson Arc
 * - STAGE E — CUT THE INTERFACE (1.70s – 2.20s): Crimson -> Warm-Gold Seam Splits Screen
 * - STAGE F — WORLD REVEAL      (2.20s – 2.60s): Old interface clears, ZERO//LINE Hero settles
 */
const TIMELINE_TOTAL_MS = 2600

function computeTimelineState(elapsedMs: number): {
  stage: BreakStage
  poseId: NovaIntroPoseId
  isPoseSwitching: boolean
  isStrikeImpact: boolean
} {
  if (elapsedMs < 350) {
    return {
      stage: 'stage-a-ready',
      poseId: 'ready',
      isPoseSwitching: false,
      isStrikeImpact: false,
    }
  }
  if (elapsedMs < 850) {
    return {
      stage: 'stage-b-draw',
      poseId: 'draw',
      isPoseSwitching: elapsedMs < 405,
      isStrikeImpact: false,
    }
  }
  if (elapsedMs < 1350) {
    return {
      stage: 'stage-c-windup',
      poseId: 'windup',
      isPoseSwitching: elapsedMs < 905,
      isStrikeImpact: false,
    }
  }
  if (elapsedMs < 1700) {
    return {
      stage: 'stage-d-strike',
      poseId: 'strike',
      isPoseSwitching: elapsedMs < 1400,
      isStrikeImpact: elapsedMs < 1470,
    }
  }
  if (elapsedMs < 2200) {
    return {
      stage: 'stage-e-cut',
      poseId: 'strike',
      isPoseSwitching: false,
      isStrikeImpact: false,
    }
  }
  return {
    stage: 'stage-f-reveal',
    poseId: 'strike',
    isPoseSwitching: false,
    isStrikeImpact: false,
  }
}

export const ZeroLineBreakTransition: React.FC<
  ZeroLineBreakTransitionProps
> = ({ active, prefersReducedMotion, tagline, onComplete }) => {
  const { framesMap, handleFrameError } = usePreloadNovaIntroFrames()
  const [stage, setStage] = useState<BreakStage>('idle')
  const [activePoseId, setActivePoseId] = useState<NovaIntroPoseId>('ready')
  const [isPoseSwitching, setIsPoseSwitching] = useState<boolean>(false)
  const [isStrikeImpact, setIsStrikeImpact] = useState<boolean>(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!active) {
      setStage('idle')
      setActivePoseId('ready')
      setIsPoseSwitching(false)
      setIsStrikeImpact(false)
      return
    }

    // Reduced motion: brief, accessible 320ms tactical fade instead of full action sequence
    if (prefersReducedMotion) {
      setStage('stage-f-reveal')
      const reducedTimer = window.setTimeout(() => {
        onCompleteRef.current()
      }, 320)
      return () => window.clearTimeout(reducedTimer)
    }

    const startTime = performance.now()

    const applyElapsed = () => {
      const frozenMs = (
        window as unknown as { __ZL_FREEZE_AT_MS?: number | null }
      ).__ZL_FREEZE_AT_MS
      const elapsed =
        typeof frozenMs === 'number' ? frozenMs : performance.now() - startTime
      if (typeof frozenMs !== 'number' && elapsed >= TIMELINE_TOTAL_MS) {
        onCompleteRef.current()
        return
      }
      const next = computeTimelineState(elapsed)
      setStage((prev) => (prev === next.stage ? prev : next.stage))
      setActivePoseId((prev) => (prev === next.poseId ? prev : next.poseId))
      setIsPoseSwitching((prev) =>
        prev === next.isPoseSwitching ? prev : next.isPoseSwitching
      )
      setIsStrikeImpact((prev) =>
        prev === next.isStrikeImpact ? prev : next.isStrikeImpact
      )
    }

    // Initialize at 0ms immediately
    applyElapsed()

    // High-frequency polling timer (works reliably even when headless CVDisplayLink is absent)
    const intervalId = window.setInterval(applyElapsed, 16)
    const doneTimerId = window.setTimeout(() => {
      const frozenMs = (
        window as unknown as { __ZL_FREEZE_AT_MS?: number | null }
      ).__ZL_FREEZE_AT_MS
      if (typeof frozenMs !== 'number') {
        onCompleteRef.current()
      }
    }, TIMELINE_TOTAL_MS)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(doneTimerId)
    }
  }, [active, prefersReducedMotion])

  // Allow keyboard Escape to skip transition immediately for accessibility
  useEffect(() => {
    if (!active) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCompleteRef.current()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active])

  if (!active || stage === 'idle') {
    return null
  }

  if (prefersReducedMotion) {
    return (
      <div
        className="zl-break-overlay zl-break-overlay--reduced"
        role="status"
        aria-live="polite"
        aria-label="Entering ZERO//LINE project world"
      >
        <div className="zl-break-reduced-badge">
          <span className="zl-break-reduced-code">02 // ZERO//LINE</span>
          <span className="zl-break-reduced-sub">{tagline}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`zl-break-overlay is-${stage} is-pose-${activePoseId}`}
      data-stage={stage}
      data-pose={activePoseId}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="ZERO//LINE Break The Line transition"
    >
      {/* Skippable Action Control (Pointer + Keyboard Accessible) */}
      <button
        type="button"
        className="zl-break-skip-btn"
        onClick={onComplete}
        aria-label="Skip transition animation"
      >
        <span>SKIP</span>
        <kbd>ESC</kbd>
      </button>

      {/* ====================================================================
          DIAGONAL SHUTTER HALVES (0% 78% -> 100% 22%, matching Frame 04 Slash)
          Remain locked during READY (0.00–0.35s), DRAW (0.35–0.85s),
          WIND-UP (0.85–1.35s), and STRIKE (1.35–1.70s).
          At 1.70s (STAGE E — CUT THE INTERFACE), the crimson sword energy
          ignites the warm-gold seam and physically splits the two halves apart,
          revealing the live ZERO//LINE Case Study Hero underneath.
          ==================================================================== */}
      <div className="zl-split-half zl-split-half--upper" aria-hidden="true">
        <div className="zl-split-surface-echo">
          <div className="zl-split-echo-sidebar" />
          <div className="zl-split-echo-main">
            <div className="zl-split-echo-topbar" />
            <div className="zl-split-echo-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
        <div className="zl-split-telemetry zl-split-telemetry--top">
          <span>SYS.PORTFOLIO // SECTOR 02</span>
          <span>VECTOR // 22.0° — 78.0°</span>
        </div>
        <svg
          className="zl-split-seam-svg"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="702"
            x2="1600"
            y2="198"
            stroke="#C6AD7D"
            strokeWidth="4.5"
          />
          <line
            x1="0"
            y1="698"
            x2="1600"
            y2="194"
            stroke="#FF3B30"
            strokeWidth="2.2"
            strokeOpacity="0.9"
          />
        </svg>
      </div>

      <div className="zl-split-half zl-split-half--lower" aria-hidden="true">
        <div className="zl-split-surface-echo">
          <div className="zl-split-echo-sidebar" />
          <div className="zl-split-echo-main">
            <div className="zl-split-echo-lines zl-split-echo-lines--lower">
              <span />
              <span />
            </div>
          </div>
        </div>
        <div className="zl-split-telemetry zl-split-telemetry--bottom">
          <span>PROTOCOL // BREAK THE LINE</span>
          <span>CALLSIGN // NOVA · VANGUARD 01</span>
        </div>
        <svg
          className="zl-split-seam-svg"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="702"
            x2="1600"
            y2="198"
            stroke="#DDCDA8"
            strokeWidth="4.5"
          />
          <line
            x1="0"
            y1="706"
            x2="1600"
            y2="202"
            stroke="#557E69"
            strokeWidth="2.2"
            strokeOpacity="0.88"
          />
        </svg>
      </div>

      {/* ====================================================================
          STAGES A–D (+ STAGE E FOLLOW-THROUGH):
          4-KEYFRAME NOVA SWORD ATTACK SEQUENCE (0.00s – 2.00s)
          1. READY   (0.00–0.35s)
          2. DRAW    (0.35–0.85s)
          3. WIND-UP (0.85–1.35s)
          4. STRIKE  (1.35–1.70s) -> Ignites Stage E Cut (1.70–2.20s)
          ==================================================================== */}
      <div className="zl-break-character-stage" aria-hidden="true">
        <div className="zl-break-character-aura" />

        <div className="zl-break-title-callout">
          <span className="zl-break-callout-kicker">
            SEASON 01 · THE FIRST LINE
          </span>
          <div className="zl-break-callout-wordmark">
            ZERO<span>//</span>LINE
          </div>
          <div className="zl-break-callout-subline">
            <span className="zl-break-callout-tag">BREAK // THE LINE</span>
            <span className="zl-break-callout-sep">·</span>
            <span className="zl-break-callout-role">
              {activePoseId.toUpperCase()}
            </span>
          </div>
        </div>

        <NovaIntroSequence
          activePoseId={activePoseId}
          isPoseSwitching={isPoseSwitching}
          isStrikeImpact={isStrikeImpact}
          framesMap={framesMap}
          onFrameError={handleFrameError}
        />
      </div>

      {/* ====================================================================
          STAGES D & E: CRIMSON SWORD ENERGY -> WARM-GOLD INTERFACE SLASH
          Triggered ONLY at 1.35s (STAGE D — STRIKE) along the exact diagonal
          slash trajectory of FRAME 04 (0% 78% -> 100% 22%), cutting open the
          interface at 1.70s (STAGE E — CUT THE INTERFACE).
          ==================================================================== */}
      <svg
        className="zl-break-slash-svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="zlSlashCrimsonToGold"
            x1="0%"
            y1="78%"
            x2="100%"
            y2="22%"
          >
            <stop offset="0%" stopColor="#8E1B20" stopOpacity="0" />
            <stop offset="14%" stopColor="#D9383A" stopOpacity="0.96" />
            <stop offset="48%" stopColor="#FF3B30" stopOpacity="1" />
            <stop offset="76%" stopColor="#C6AD7D" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#DDCDA8" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="zlSlashTrailWake"
            x1="0%"
            y1="78%"
            x2="100%"
            y2="22%"
          >
            <stop offset="0%" stopColor="#557E69" stopOpacity="0" />
            <stop offset="22%" stopColor="#D9383A" stopOpacity="0.68" />
            <stop offset="58%" stopColor="#FF7A45" stopOpacity="0.82" />
            <stop offset="82%" stopColor="#C6AD7D" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#557E69" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="zlSlashImpactBurst" cx="58%" cy="46%" r="38%">
            <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.58" />
            <stop offset="42%" stopColor="#C6AD7D" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#557E69" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Crimson-to-Warm-Gold Impact Burst at NOVA's Strike Focal Point */}
        <ellipse
          className="zl-slash-impact-glow"
          cx="930"
          cy="418"
          rx="460"
          ry="110"
          transform="rotate(-19.5 930 418)"
          fill="url(#zlSlashImpactBurst)"
        />

        {/* Secondary Crimson & Warm-Gold Tactical Wake */}
        <line
          className="zl-slash-line zl-slash-line--wake"
          x1="-80"
          y1="727"
          x2="1680"
          y2="173"
          stroke="url(#zlSlashTrailWake)"
          strokeWidth="32"
          strokeLinecap="round"
        />

        {/* Offset Parallel Tactical Hairline */}
        <line
          className="zl-slash-line zl-slash-line--parallel"
          x1="-80"
          y1="745"
          x2="1680"
          y2="191"
          stroke="#C6AD7D"
          strokeWidth="1.75"
          strokeDasharray="20 14"
        />

        {/* Primary Crimson-to-Gold Energy Slash Blade */}
        <line
          className="zl-slash-line zl-slash-line--core"
          x1="-80"
          y1="727"
          x2="1680"
          y2="173"
          stroke="url(#zlSlashCrimsonToGold)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Razor-Sharp White-Hot Leading Core */}
        <line
          className="zl-slash-line zl-slash-line--razor"
          x1="-80"
          y1="727"
          x2="1680"
          y2="173"
          stroke="#FFF5EE"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
