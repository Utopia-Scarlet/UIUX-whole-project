import type { Transition } from 'motion/react'

/**
 * Shared-element spatial transition (Interaction D — Enter Portfolio)
 * Tuned to ~980ms per the 900–1200ms specification with an architectural cubic-bezier curve.
 */
export const SHARED_LAYOUT_TRANSITION: Transition = {
  duration: 0.98,
  ease: [0.22, 1, 0.36, 1],
}

export const REDUCED_MOTION_TRANSITION: Transition = {
  duration: 0.12,
  ease: 'linear',
}

/**
 * Interaction A — Coordinated Initial Entrance Sequence
 * One cohesive entrance across the name reveal, portrait silhouette reveal, and editorial frame.
 */
export const HERO_ENTRANCE_TIMING = {
  nameBack: {
    duration: 0.88,
    delay: 0.06,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
  portrait: {
    duration: 0.96,
    delay: 0.16,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
  nameFront: {
    duration: 0.88,
    delay: 0.22,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
  supporting: {
    duration: 0.72,
    delay: 0.32,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
}

/**
 * Interaction B — Restrained Cursor Parallax multipliers (in px)
 */
export const PARALLAX_OFFSET = {
  backTypographyX: -12,
  backTypographyY: -7,
  portraitX: 8,
  portraitY: 5,
  frontTypographyX: 15,
  frontTypographyY: 9,
}
