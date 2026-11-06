import React, { useEffect, useState } from 'react'
import {
  ZERO_LINE_ASSET_SPEC,
  type NovaIntroFrameSpec,
  type NovaIntroPoseId,
} from '../../data/portfolioData'

export interface ResolvedPoseFrame {
  spec: NovaIntroFrameSpec
  resolvedSrc: string
  loaded: boolean
}

interface NovaIntroSequenceProps {
  activePoseId: NovaIntroPoseId
  isPoseSwitching: boolean
  isStrikeImpact: boolean
  framesMap: Record<NovaIntroPoseId, ResolvedPoseFrame>
  onFrameError: (poseId: NovaIntroPoseId) => void
}

// Eagerly warm the browser image cache for all 4 transparent NOVA pose cutouts
if (typeof window !== 'undefined') {
  for (const spec of ZERO_LINE_ASSET_SPEC.introFrames) {
    const preloadImg = new Image()
    preloadImg.decoding = 'async'
    preloadImg.src = spec.webp
  }
}

/**
 * Isolated Transparent 4-Keyframe NOVA Character Stage (STEP 4B.5):
 * - No rectangular portrait background panel, border, or clip-path box.
 * - Four genuinely transparent RGBA character cutouts (`nova-01-ready-alpha` .. `nova-04-strike-alpha`)
 *   composited directly onto the full-screen cinematic stage with consistent anatomical torso
 *   scale and shared ground-plane alignment (`transform-origin: 50% 90%`).
 */
export const NovaIntroSequence: React.FC<NovaIntroSequenceProps> = ({
  activePoseId,
  isPoseSwitching,
  isStrikeImpact,
  framesMap,
  onFrameError,
}) => {
  const activeFrame = framesMap[activePoseId]
  const loadedCount = Object.values(framesMap).filter((f) => f.loaded).length

  return (
    <div
      className={`zl-nova-intro-frame is-pose-${activePoseId} ${
        isPoseSwitching ? 'is-pose-cut-pulse' : ''
      } ${isStrikeImpact ? 'is-strike-impact' : ''}`}
      data-active-pose={activePoseId}
      data-active-frame={activeFrame.spec.frameNumber}
      data-active-src={activeFrame.resolvedSrc}
      data-loaded-poses={loadedCount}
      data-transition-type={activeFrame.spec.transitionType}
    >
      {/* Subtle Ground-Plane Contact Shadow (No Rectangular Backdrop Panel) */}
      <div className="zl-nova-ground-shadow" aria-hidden="true" />

      {/* ====================================================================
          ISOLATED TRANSPARENT NOVA CHARACTER POSES (FRAMES 01–04)
          Normalized to shared anatomical torso scale & ground plane (50% 90%)
          ==================================================================== */}
      <div className="zl-nova-layer-b-character" aria-hidden="true">
        {ZERO_LINE_ASSET_SPEC.introFrames.map((frameSpec) => {
          const entry = framesMap[frameSpec.id]
          const isCurrent = frameSpec.id === activePoseId

          return (
            <img
              key={frameSpec.id}
              src={entry.resolvedSrc}
              alt=""
              width={1024}
              height={1536}
              loading="eager"
              decoding="sync"
              onError={() => onFrameError(frameSpec.id)}
              className={`zl-nova-pose-layer zl-nova-pose-layer--${frameSpec.id} ${
                isCurrent ? 'is-pose-active' : 'is-pose-inactive'
              }`}
              data-pose-scale={frameSpec.scale}
              data-pose-x={frameSpec.x}
              data-pose-y={frameSpec.y}
              data-pose-rot={frameSpec.rotation}
              style={{
                opacity: isCurrent ? 1 : 0,
                visibility: isCurrent ? 'visible' : 'hidden',
                zIndex: isCurrent ? 2 : 0,
                transform: `translate3d(${frameSpec.x}, ${frameSpec.y}, 0) scale(${frameSpec.scale}) rotate(${frameSpec.rotation})`,
              }}
            />
          )
        })}
      </div>

      {/* ====================================================================
          SYNCHRONIZED WEAPON ENERGY ACCENTS (No Rectangular Bitmap Overlays)
          - Ready (01): Vertical planted greatsword pulse
          - Draw  (02): Subtle diagonal blade glint
          - Windup(03): Overhead crimson crossguard charge
          ==================================================================== */}
      <div className="zl-nova-layer-c-fx" aria-hidden="true">
        <div className="zl-break-character-sword-axis" />
        <div className="zl-nova-draw-glint" />
        <div className="zl-nova-windup-charge" />
      </div>
    </div>
  )
}

/**
 * Hook managing the 4 transparent NOVA intro keyframes (.webp -> .png -> raw fallback).
 */
export function usePreloadNovaIntroFrames(): {
  framesMap: Record<NovaIntroPoseId, ResolvedPoseFrame>
  handleFrameError: (poseId: NovaIntroPoseId) => void
} {
  const [framesMap, setFramesMap] = useState<
    Record<NovaIntroPoseId, ResolvedPoseFrame>
  >(() => {
    const initial = {} as Record<NovaIntroPoseId, ResolvedPoseFrame>
    for (const spec of ZERO_LINE_ASSET_SPEC.introFrames) {
      initial[spec.id] = {
        spec,
        resolvedSrc: spec.webp,
        loaded: true,
      }
    }
    return initial
  })

  useEffect(() => {
    for (const spec of ZERO_LINE_ASSET_SPEC.introFrames) {
      const img = new Image()
      img.decoding = 'async'
      img.src = spec.webp
    }
  }, [])

  const handleFrameError = (poseId: NovaIntroPoseId) => {
    setFramesMap((prev) => {
      const current = prev[poseId]
      const { spec } = current
      if (current.resolvedSrc === spec.webp) {
        return {
          ...prev,
          [poseId]: { spec, resolvedSrc: spec.png, loaded: true },
        }
      }
      if (current.resolvedSrc === spec.png) {
        return {
          ...prev,
          [poseId]: { spec, resolvedSrc: spec.jpg, loaded: true },
        }
      }
      return {
        ...prev,
        [poseId]: { ...current, loaded: false },
      }
    })
  }

  return { framesMap, handleFrameError }
}
