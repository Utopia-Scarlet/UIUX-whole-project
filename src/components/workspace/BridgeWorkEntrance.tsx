import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '../../context/LanguageContext'
import { ArrowRightIcon } from '../icons/WorkspaceIcons'
import type {
  BridgeWorkEntranceCardSpec,
  BridgeWorkLocaleData,
} from '../../data/bridgeworkData'

export type BridgeWorkEntrancePhase = 'scattering' | 'settled' | 'departing'
export type BridgeWorkAutoplayBeat =
  | 'beat-01-cursor-appear'
  | 'beat-02-search-filter'
  | 'beat-03-save-roles'
  | 'beat-04-compare-roles'
  | 'beat-05-select-explore'
  | 'beat-06-transition-hero'

export type BridgeWorkCriterionKey =
  | 'PAY'
  | 'LOCATION'
  | 'REQUIREMENTS'
  | 'FLEXIBILITY'

type CursorTargetKey =
  | 'spawn'
  | 'searchInput'
  | 'locationBrisbane'
  | 'saveCard01'
  | 'saveCard04'
  | 'compareBtn'
  | 'diffCellCard01'
  | 'selectCard01'
  | 'exploreBtnCard01'

interface Point2D {
  x: number
  y: number
}

interface BridgeWorkEntranceProps {
  data: BridgeWorkLocaleData['entrance']
  initialSelectedCardId: string
  activeCriterion: BridgeWorkCriterionKey
  onCriterionChange: (criterion: BridgeWorkCriterionKey) => void
  prefersReducedMotion: boolean
  onSelectCard: (cardId: string) => void
  onSkipIntro: () => void
}

export interface BridgeWorkAutoplaySnapshot {
  phase: BridgeWorkEntrancePhase
  beat: BridgeWorkAutoplayBeat
  elapsedMs: number
  progressRatio: number
  searchQuery: string
  locationFilter: 'ALL' | 'BRISBANE'
  savedCardIds: string[]
  isCompareMode: boolean
  comparedDiffHovered: boolean
  selectedCardId: string | null
  departingCardId: string | null
  activeCriterion: BridgeWorkCriterionKey
  cursorX: number
  cursorY: number
  cursorTarget: CursorTargetKey
  isCursorClicking: boolean
  isTouchPointerMode: boolean
}

declare global {
  interface Window {
    __getBridgeWorkEntrancePhase?: () => {
      phase: BridgeWorkEntrancePhase
      hoveredCardId: string | null
      departingCardId: string | null
      activeCriterion: BridgeWorkCriterionKey
    }
    __getBridgeWorkAutoplayState?: () => BridgeWorkAutoplaySnapshot
    __triggerBridgeWorkCardSelect?: (cardId: string) => void
  }
}

const TARGET_SEARCH_TEXT = 'UX Designer'
const PRIMARY_ROLE_ID = 'bw-card-01'
const SECONDARY_ROLE_ID = 'bw-card-04'
const TOTAL_DEMO_DURATION_MS = 7400

const DISCOVERY_SPRING = {
  type: 'spring' as const,
  stiffness: 96,
  damping: 20,
  mass: 0.92,
}

const DEPARTURE_SPRING = {
  type: 'spring' as const,
  stiffness: 118,
  damping: 22,
  mass: 0.88,
}

export const SHARED_CARD_HERO_SPRING = {
  type: 'spring' as const,
  stiffness: 102,
  damping: 21,
  mass: 0.92,
}

function easeInOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t))
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2
}

/**
 * Evaluates a quadratic Bézier curve between `from` and `to` with a subtle
 * perpendicular arc offset so the virtual cursor travels along a human-like
 * curved path rather than rigid straight lines.
 */
function interpolateCurvedPath(
  from: Point2D,
  to: Point2D,
  rawProgress: number,
  arcOffsetPx = -26
): Point2D {
  const t = easeInOutCubic(rawProgress)
  const midX = (from.x + to.x) * 0.5
  const midY = (from.y + to.y) * 0.5 + arcOffsetPx
  const inv = 1 - t
  return {
    x: inv * inv * from.x + 2 * inv * t * midX + t * t * to.x,
    y: inv * inv * from.y + 2 * inv * t * midY + t * t * to.y,
  }
}

interface CursorSegment {
  startMs: number
  endMs: number
  fromKey: CursorTargetKey
  toKey: CursorTargetKey
  arcOffset: number
}

const CURSOR_SEGMENTS: ReadonlyArray<CursorSegment> = [
  // Beat 01: Spawn -> Search Input
  {
    startMs: 180,
    endMs: 1040,
    fromKey: 'spawn',
    toKey: 'searchInput',
    arcOffset: -30,
  },
  // Beat 02: Hold on Search Input while clicking & typing "UX Designer"
  {
    startMs: 1040,
    endMs: 2080,
    fromKey: 'searchInput',
    toKey: 'searchInput',
    arcOffset: 0,
  },
  // Beat 02: Search Input -> "Brisbane" Location Filter Pill
  {
    startMs: 2080,
    endMs: 2560,
    fromKey: 'searchInput',
    toKey: 'locationBrisbane',
    arcOffset: -20,
  },
  // Beat 02: Hold on "Brisbane" Location Filter Pill
  {
    startMs: 2560,
    endMs: 2880,
    fromKey: 'locationBrisbane',
    toKey: 'locationBrisbane',
    arcOffset: 0,
  },
  // Beat 03: "Brisbane" Filter -> Save button on Opportunity 01 (bw-card-01)
  {
    startMs: 2880,
    endMs: 3380,
    fromKey: 'locationBrisbane',
    toKey: 'saveCard01',
    arcOffset: -24,
  },
  // Beat 03: Hold on Save Opportunity 01
  {
    startMs: 3380,
    endMs: 3680,
    fromKey: 'saveCard01',
    toKey: 'saveCard01',
    arcOffset: 0,
  },
  // Beat 03: Save Opportunity 01 -> Save Opportunity 02 (bw-card-04)
  {
    startMs: 3680,
    endMs: 4180,
    fromKey: 'saveCard01',
    toKey: 'saveCard04',
    arcOffset: -28,
  },
  // Beat 03: Hold on Save Opportunity 02
  {
    startMs: 4180,
    endMs: 4540,
    fromKey: 'saveCard04',
    toKey: 'saveCard04',
    arcOffset: 0,
  },
  // Beat 04: Save Opportunity 02 -> Compare (2) Toolbar Action
  {
    startMs: 4540,
    endMs: 4980,
    fromKey: 'saveCard04',
    toKey: 'compareBtn',
    arcOffset: -32,
  },
  // Beat 04: Hold on Compare (2) Toolbar Action
  {
    startMs: 4980,
    endMs: 5260,
    fromKey: 'compareBtn',
    toKey: 'compareBtn',
    arcOffset: 0,
  },
  // Beat 04: Compare (2) -> Hover key difference (FLEXIBILITY cell on Opportunity 01)
  {
    startMs: 5260,
    endMs: 5640,
    fromKey: 'compareBtn',
    toKey: 'diffCellCard01',
    arcOffset: 22,
  },
  // Beat 04: Hold on key difference cell
  {
    startMs: 5640,
    endMs: 6080,
    fromKey: 'diffCellCard01',
    toKey: 'diffCellCard01',
    arcOffset: 0,
  },
  // Beat 05: Difference cell -> Select Role 01 button
  {
    startMs: 6080,
    endMs: 6400,
    fromKey: 'diffCellCard01',
    toKey: 'selectCard01',
    arcOffset: 16,
  },
  // Beat 05: Hold on Select Role 01
  {
    startMs: 6400,
    endMs: 6680,
    fromKey: 'selectCard01',
    toKey: 'selectCard01',
    arcOffset: 0,
  },
  // Beat 05: Select Role 01 -> "Explore BridgeWork AU" button
  {
    startMs: 6680,
    endMs: 7040,
    fromKey: 'selectCard01',
    toKey: 'exploreBtnCard01',
    arcOffset: 14,
  },
  // Beat 05 & 06: Hold on "Explore BridgeWork AU" click & shared-element expansion
  {
    startMs: 7040,
    endMs: 8000,
    fromKey: 'exploreBtnCard01',
    toKey: 'exploreBtnCard01',
    arcOffset: 0,
  },
]

const CLICK_WINDOWS_MS: ReadonlyArray<[number, number]> = [
  [1100, 1250], // Click search input
  [2580, 2740], // Click "Brisbane" filter
  [3400, 3570], // Click Save Opportunity 01
  [4200, 4370], // Click Save Opportunity 02
  [5000, 5170], // Click Compare (2)
  [6420, 6590], // Click Select Opportunity 01
  [7060, 7250], // Click "Explore BridgeWork AU"
]

/**
 * BW-02B / BW-02C / BW-02D — BridgeWork AU Autonomous Cursor-Driven Demo Stage
 *
 * - Plays automatically on a `#202522` dark presentation stage with a restrained
 *   `AUTO DEMO` status bar and progress indicator.
 * - Demonstrates `Discover → Save → Compare → Select → Explore`.
 * - In Beat 06 (`~7.1s – 7.5s`), the white product showcase frame
 *   (`layoutId="bw-product-showcase-frame"`) and the two side-by-side compared
 *   opportunity cards (`layoutId="bw-card-surface-bw-card-01"` and
 *   `layoutId="bw-card-surface-bw-card-04"`) smoothly expand into the wide
 *   Lower-Level Product Showcase of the redesigned Case Study Hero.
 */
export const BridgeWorkEntrance: React.FC<BridgeWorkEntranceProps> = ({
  data,
  activeCriterion,
  onCriterionChange,
  prefersReducedMotion,
  onSelectCard,
  onSkipIntro,
}) => {
  const { locale } = useLanguage()
  const isZh = locale === 'zh-CN'

  const [phase, setPhase] = useState<BridgeWorkEntrancePhase>(() =>
    prefersReducedMotion ? 'settled' : 'scattering'
  )
  const [beat, setBeat] = useState<BridgeWorkAutoplayBeat>(
    'beat-01-cursor-appear'
  )
  const [elapsedMs, setElapsedMs] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'BRISBANE'>(
    'ALL'
  )
  const [savedCardIds, setSavedCardIds] = useState<string[]>([])
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false)
  const [comparedDiffHovered, setComparedDiffHovered] = useState<boolean>(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [departingCardId, setDepartingCardId] = useState<string | null>(null)
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState<Point2D>({ x: 520, y: 240 })
  const [cursorTarget, setCursorTarget] = useState<CursorTargetKey>('spawn')
  const [isCursorClicking, setIsCursorClicking] = useState<boolean>(false)
  const [isTouchPointerMode, setIsTouchPointerMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return (
      window.innerWidth <= 760 ||
      window.matchMedia?.('(pointer: coarse)').matches === true
    )
  })

  // Live DOM refs for dynamic target coordinate measurement relative to stageRef
  const stageRef = useRef<HTMLElement | null>(null)
  const searchInputRef = useRef<HTMLDivElement | null>(null)
  const locationBrisbaneRef = useRef<HTMLButtonElement | null>(null)
  const saveCard01Ref = useRef<HTMLButtonElement | null>(null)
  const saveCard04Ref = useRef<HTMLButtonElement | null>(null)
  const compareBtnRef = useRef<HTMLButtonElement | null>(null)
  const diffCellCard01Ref = useRef<HTMLDivElement | null>(null)
  const selectCard01Ref = useRef<HTMLButtonElement | null>(null)
  const exploreBtnCard01Ref = useRef<HTMLButtonElement | null>(null)

  const rafIdRef = useRef<number | null>(null)
  const commitTimerRef = useRef<number | null>(null)
  const userInterruptedRef = useRef<boolean>(false)
  const lastScrolledTargetRef = useRef<CursorTargetKey | null>(null)

  // Detect touch/mobile viewport changes
  useEffect(() => {
    const updatePointerMode = () => {
      setIsTouchPointerMode(
        window.innerWidth <= 760 ||
          window.matchMedia?.('(pointer: coarse)').matches === true
      )
    }
    updatePointerMode()
    window.addEventListener('resize', updatePointerMode)
    return () => window.removeEventListener('resize', updatePointerMode)
  }, [])

  // Measure target center relative to stageRef
  const getTargetCenter = useCallback((key: CursorTargetKey): Point2D => {
    const stageEl = stageRef.current
    if (!stageEl) return { x: 480, y: 240 }
    const stageRect = stageEl.getBoundingClientRect()

    if (key === 'spawn') {
      return {
        x: Math.min(Math.max(stageRect.width * 0.56, 180), stageRect.width - 70),
        y: Math.min(Math.max(stageRect.height * 0.34, 150), 270),
      }
    }

    const map: Record<Exclude<CursorTargetKey, 'spawn'>, HTMLElement | null> = {
      searchInput: searchInputRef.current,
      locationBrisbane: locationBrisbaneRef.current,
      saveCard01: saveCard01Ref.current,
      saveCard04: saveCard04Ref.current,
      compareBtn: compareBtnRef.current,
      diffCellCard01: diffCellCard01Ref.current,
      selectCard01: selectCard01Ref.current,
      exploreBtnCard01: exploreBtnCard01Ref.current,
    }

    const targetEl = map[key]
    if (!targetEl) {
      return {
        x: stageRect.width * 0.45,
        y: stageRect.height * 0.42,
      }
    }

    const rect = targetEl.getBoundingClientRect()
    return {
      x: rect.left - stageRect.left + rect.width * 0.5,
      y: rect.top - stageRect.top + rect.height * 0.52,
    }
  }, [])

  // Trigger continuous Beat 06 expansion into Case Study Hero
  const handleActivateCard = useCallback(
    (cardId: string, isManualUserAction = true) => {
      if (isManualUserAction) {
        userInterruptedRef.current = true
        if (rafIdRef.current !== null) {
          window.cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }
      }

      if (prefersReducedMotion) {
        onSelectCard(cardId)
        return
      }

      setSelectedCardId(cardId)
      setDepartingCardId(cardId)
      setPhase('departing')
      setBeat('beat-06-transition-hero')

      if (commitTimerRef.current !== null) {
        window.clearTimeout(commitTimerRef.current)
      }

      commitTimerRef.current = window.setTimeout(() => {
        onSelectCard(cardId)
      }, 360)
    },
    [onSelectCard, prefersReducedMotion]
  )

  // Autonomous 6-Beat Virtual Cursor Choreography Loop
  useEffect(() => {
    if (prefersReducedMotion) {
      onSelectCard(PRIMARY_ROLE_ID)
      return
    }

    let startTimestamp: number | null = null
    let transitionTriggered = false

    const step = (now: number) => {
      if (userInterruptedRef.current) return
      if (startTimestamp === null) {
        startTimestamp = now
      }
      const elapsed = now - startTimestamp
      setElapsedMs(Math.round(elapsed))

      // Phase A -> Settled workspace after initial organic entry (~220ms)
      if (elapsed >= 220 && !transitionTriggered) {
        setPhase((prev) => (prev === 'scattering' ? 'settled' : prev))
      }

      // Beat progression
      let nextBeat: BridgeWorkAutoplayBeat = 'beat-01-cursor-appear'
      if (elapsed >= 7100) {
        nextBeat = 'beat-06-transition-hero'
      } else if (elapsed >= 6100) {
        nextBeat = 'beat-05-select-explore'
      } else if (elapsed >= 4600) {
        nextBeat = 'beat-04-compare-roles'
      } else if (elapsed >= 2900) {
        nextBeat = 'beat-03-save-roles'
      } else if (elapsed >= 1100) {
        nextBeat = 'beat-02-search-filter'
      }
      setBeat(nextBeat)

      // Beat 02: Search input focus & character-by-character typing "UX Designer"
      const searchActive = elapsed >= 1120 && elapsed < 2560
      setIsSearchFocused(searchActive)

      if (elapsed < 1220) {
        setSearchQuery('')
      } else if (elapsed < 2040) {
        const typeProgress = (elapsed - 1220) / (2040 - 1220)
        const charCount = Math.max(
          1,
          Math.min(
            TARGET_SEARCH_TEXT.length,
            Math.floor(typeProgress * TARGET_SEARCH_TEXT.length)
          )
        )
        setSearchQuery(TARGET_SEARCH_TEXT.slice(0, charCount))
      } else {
        setSearchQuery(TARGET_SEARCH_TEXT)
      }

      // Beat 02 -> Location filter click ("Brisbane")
      if (elapsed >= 2620) {
        setLocationFilter('BRISBANE')
        onCriterionChange('LOCATION')
      } else {
        setLocationFilter('ALL')
      }

      // Beat 03 -> Save Opportunity 01 (3440ms) and Opportunity 02 (4240ms)
      if (elapsed >= 4240) {
        setSavedCardIds([PRIMARY_ROLE_ID, SECONDARY_ROLE_ID])
      } else if (elapsed >= 3440) {
        setSavedCardIds([PRIMARY_ROLE_ID])
      } else {
        setSavedCardIds([])
      }

      // Beat 04 -> Compare Shortlist (2) click (5040ms) & hover Flexibility difference (5520ms)
      const compareActive = elapsed >= 5040
      setIsCompareMode(compareActive)

      const diffHover = elapsed >= 5520 && elapsed < 6380
      setComparedDiffHovered(diffHover)
      if (elapsed >= 5520) {
        onCriterionChange('FLEXIBILITY')
      }

      // Beat 05 -> Select Opportunity 01 (6450ms)
      if (elapsed >= 6450) {
        setSelectedCardId(PRIMARY_ROLE_ID)
        setHoveredCardId(PRIMARY_ROLE_ID)
      } else if (elapsed >= 3250 && elapsed < 3700) {
        setHoveredCardId(PRIMARY_ROLE_ID)
      } else if (elapsed >= 4050 && elapsed < 4550) {
        setHoveredCardId(SECONDARY_ROLE_ID)
      } else {
        setHoveredCardId(null)
      }

      // Active click state check
      const clickingNow = CLICK_WINDOWS_MS.some(
        ([start, end]) => elapsed >= start && elapsed <= end
      )
      setIsCursorClicking(clickingNow)

      // Determine current cursor segment & interpolate along curved Bézier path
      const activeSeg =
        CURSOR_SEGMENTS.find(
          (seg) => elapsed >= seg.startMs && elapsed <= seg.endMs
        ) ??
        (elapsed < CURSOR_SEGMENTS[0].startMs
          ? CURSOR_SEGMENTS[0]
          : CURSOR_SEGMENTS[CURSOR_SEGMENTS.length - 1])

      setCursorTarget(activeSeg.toKey)

      // On compact mobile viewports (<=760px), gently scroll target into view if needed
      if (
        window.innerWidth <= 760 &&
        activeSeg.toKey !== 'spawn' &&
        lastScrolledTargetRef.current !== activeSeg.toKey
      ) {
        lastScrolledTargetRef.current = activeSeg.toKey
        const targetMap: Record<
          Exclude<CursorTargetKey, 'spawn'>,
          HTMLElement | null
        > = {
          searchInput: searchInputRef.current,
          locationBrisbane: locationBrisbaneRef.current,
          saveCard01: saveCard01Ref.current,
          saveCard04: saveCard04Ref.current,
          compareBtn: compareBtnRef.current,
          diffCellCard01: diffCellCard01Ref.current,
          selectCard01: selectCard01Ref.current,
          exploreBtnCard01: exploreBtnCard01Ref.current,
        }
        const el = targetMap[activeSeg.toKey]
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.bottom > window.innerHeight - 28 || rect.top < 64) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }

      const segDuration = Math.max(1, activeSeg.endMs - activeSeg.startMs)
      const segProgress = Math.max(
        0,
        Math.min(1, (elapsed - activeSeg.startMs) / segDuration)
      )
      const fromPt = getTargetCenter(activeSeg.fromKey)
      const toPt = getTargetCenter(activeSeg.toKey)
      const nextPt =
        activeSeg.fromKey === activeSeg.toKey
          ? toPt
          : interpolateCurvedPath(fromPt, toPt, segProgress, activeSeg.arcOffset)

      setCursorPos(nextPt)

      // Beat 06 -> Automatic click on "Explore BridgeWork AU" (7120ms) triggers seamless expansion
      if (elapsed >= 7120 && !transitionTriggered) {
        transitionTriggered = true
        handleActivateCard(PRIMARY_ROLE_ID, false)
        return
      }

      rafIdRef.current = window.requestAnimationFrame(step)
    }

    rafIdRef.current = window.requestAnimationFrame(step)

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [
    getTargetCenter,
    handleActivateCard,
    onCriterionChange,
    onSelectCard,
    prefersReducedMotion,
  ])

  useEffect(() => {
    return () => {
      if (commitTimerRef.current !== null) {
        window.clearTimeout(commitTimerRef.current)
      }
    }
  }, [])

  const progressRatio = Math.max(
    0,
    Math.min(1, elapsedMs / TOTAL_DEMO_DURATION_MS)
  )

  // Expose QA state hooks for Playwright continuous frame verification
  useEffect(() => {
    window.__getBridgeWorkEntrancePhase = () => ({
      phase,
      hoveredCardId,
      departingCardId,
      activeCriterion,
    })
    window.__getBridgeWorkAutoplayState = () => ({
      phase,
      beat,
      elapsedMs,
      progressRatio: Number(progressRatio.toFixed(3)),
      searchQuery,
      locationFilter,
      savedCardIds,
      isCompareMode,
      comparedDiffHovered,
      selectedCardId,
      departingCardId,
      activeCriterion,
      cursorX: Math.round(cursorPos.x),
      cursorY: Math.round(cursorPos.y),
      cursorTarget,
      isCursorClicking,
      isTouchPointerMode,
    })
    window.__triggerBridgeWorkCardSelect = (cardId: string) => {
      handleActivateCard(cardId, true)
    }
    return () => {
      delete window.__getBridgeWorkEntrancePhase
      delete window.__getBridgeWorkAutoplayState
      delete window.__triggerBridgeWorkCardSelect
    }
  }, [
    activeCriterion,
    beat,
    comparedDiffHovered,
    cursorPos.x,
    cursorPos.y,
    cursorTarget,
    departingCardId,
    elapsedMs,
    handleActivateCard,
    hoveredCardId,
    isCompareMode,
    isCursorClicking,
    isTouchPointerMode,
    locationFilter,
    phase,
    progressRatio,
    savedCardIds,
    searchQuery,
    selectedCardId,
  ])

  // Determine which cards are active in the primary workspace vs peripheral shelf
  const isBrisbaneFiltered = locationFilter === 'BRISBANE' || isCompareMode

  const activeStageCards = useMemo(() => {
    const primaryIds = isBrisbaneFiltered
      ? [PRIMARY_ROLE_ID, SECONDARY_ROLE_ID]
      : [PRIMARY_ROLE_ID, 'bw-card-02', SECONDARY_ROLE_ID]
    return primaryIds
      .map((id) => data.cards.find((c) => c.id === id))
      .filter((c): c is BridgeWorkEntranceCardSpec => Boolean(c))
  }, [data.cards, isBrisbaneFiltered])

  const shelfCards = useMemo(() => {
    const activeIds = new Set(activeStageCards.map((c) => c.id))
    return data.cards.filter((c) => !activeIds.has(c.id))
  }, [activeStageCards, data.cards])

  const workspaceKicker = isZh
    ? 'BRIDGEWORK AU · 产品工作流预览'
    : 'BRIDGEWORK AU · WORKFLOW PREVIEW'

  const workspaceTitle = isZh
    ? '从散乱职位到清晰选择：搜索 → 筛选 → 收藏 → 同屏对比 → 进入案例'
    : 'From Noise to Clarity: Search → Filter → Save → Compare → Enter Case Study'

  const beatStatusLabel = useMemo(() => {
    switch (beat) {
      case 'beat-01-cursor-appear':
        return isZh ? '01 / 聚焦检索框' : '01 / Focusing Search'
      case 'beat-02-search-filter':
        return isZh
          ? '02 / 检索 "UX Designer" · 筛选 Brisbane'
          : '02 / Filtering "UX Designer" · Brisbane'
      case 'beat-03-save-roles':
        return isZh
          ? '03 / 收藏 2 个契合岗位 (Saved ✓)'
          : '03 / Saving 2 Brisbane UX Roles'
      case 'beat-04-compare-roles':
        return isZh
          ? '04 / 并排对比核心条件差异'
          : '04 / Comparing Conditions Side-by-Side'
      case 'beat-05-select-explore':
        return isZh
          ? '05 / 锁定优先岗位 · 打开案例研究'
          : '05 / Selecting Primary Role · Opening Case Study'
      case 'beat-06-transition-hero':
        return isZh ? '06 / 正在展开案例研究…' : '06 / Expanding into Case Study…'
    }
  }, [beat, isZh])

  const elapsedSecondsText = `${(Math.min(elapsedMs, TOTAL_DEMO_DURATION_MS) / 1000).toFixed(1)}s / ${(TOTAL_DEMO_DURATION_MS / 1000).toFixed(1)}s`

  const renderStageCard = (card: BridgeWorkEntranceCardSpec, idx: number) => {
    const isPrimaryCard = card.id === PRIMARY_ROLE_ID
    const isSecondaryCard = card.id === SECONDARY_ROLE_ID
    const isSaved = savedCardIds.includes(card.id)
    const isSelectedRole = selectedCardId === card.id
    const isRetreatedRole =
      selectedCardId !== null && selectedCardId !== card.id
    const isThisCardDepartingWinner =
      phase === 'departing' && departingCardId === card.id
    const isHovered = hoveredCardId === card.id

    const initialMotion = prefersReducedMotion
      ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
      : {
          opacity: 0,
          x: card.noiseOffset.x,
          y: card.noiseOffset.y,
          rotate: card.noiseOffset.rotate,
          scale: 0.91,
        }

    // In Beat 06 (departing), both compared Brisbane cards remain visible so they
    // smoothly morph via shared layoutId into the two side-by-side cards of the new Hero showcase!
    const animateMotion =
      phase === 'scattering'
        ? {
            opacity: 1,
            x: card.noiseOffset.x * 0.42,
            y: card.noiseOffset.y * 0.42,
            rotate: card.noiseOffset.rotate * 0.44,
            scale: 0.96,
          }
        : phase === 'departing'
          ? {
              opacity: isThisCardDepartingWinner ? 1 : 0.92,
              x: 0,
              y: isThisCardDepartingWinner ? -2 : 0,
              rotate: 0,
              scale: isThisCardDepartingWinner ? 1.01 : 0.99,
            }
          : isRetreatedRole
            ? {
                opacity: 0.56,
                x: 6,
                y: 4,
                rotate: 0,
                scale: 0.975,
              }
            : {
                opacity: 1,
                x: 0,
                y: isSelectedRole || isHovered ? -4 : 0,
                rotate: 0,
                scale: isSelectedRole ? 1.012 : isHovered ? 1.005 : 1,
              }

    return (
      <motion.article
        key={card.id}
        layout
        layoutId={`bw-card-surface-${card.id}`}
        data-card-id={card.id}
        data-card-prominent="true"
        data-card-saved={isSaved ? 'true' : 'false'}
        data-card-selected={isSelectedRole ? 'true' : 'false'}
        className={`bw-job-card bw-job-card--demo-item ${
          isSaved ? 'is-saved-card' : ''
        } ${isSelectedRole ? 'is-selected-winner' : ''} ${
          isRetreatedRole ? 'is-retreated-card' : ''
        } ${isHovered ? 'is-hovered' : ''}`}
        initial={initialMotion}
        animate={animateMotion}
        transition={
          phase === 'departing'
            ? SHARED_CARD_HERO_SPRING
            : {
                ...DISCOVERY_SPRING,
                delay: phase === 'scattering' ? idx * 0.035 : 0,
              }
        }
      >
        <div className="bw-job-card-inner-specimen">
          {/* Persistent Card Header -> Morphs into Hero Showcase Card Header */}
          <motion.div
            layoutId={`bw-card-header-${card.id}`}
            className="bw-job-card-header-block"
            transition={SHARED_CARD_HERO_SPRING}
          >
            <div className="bw-job-card-top">
              <div className="bw-job-card-top-meta">
                <span className="bw-job-card-code">{card.code}</span>
                {isCompareMode ? (
                  <span className="bw-job-compare-tag">
                    {isPrimaryCard
                      ? isZh
                        ? '4/4 项契合 · 最佳混合路线'
                        : '4/4 FIT · HYBRID PATH'
                      : isZh
                        ? '校内兼职 · 每周 12 小时上限'
                        : 'CASUAL · 12 HRS/WK CAP'}
                  </span>
                ) : null}
              </div>

              {/* Authentic Save Button targeted by Beat 03 */}
              <button
                ref={
                  isPrimaryCard
                    ? saveCard01Ref
                    : isSecondaryCard
                      ? saveCard04Ref
                      : undefined
                }
                type="button"
                tabIndex={-1}
                data-demo-target={
                  isPrimaryCard
                    ? 'save-card-01'
                    : isSecondaryCard
                      ? 'save-card-04'
                      : undefined
                }
                aria-pressed={isSaved}
                className={`bw-card-save-btn ${isSaved ? 'is-saved' : ''}`}
              >
                {isSaved
                  ? isZh
                    ? '已收藏 ✓'
                    : 'Saved ✓'
                  : isZh
                    ? '+ 收藏'
                    : '+ Save'}
              </button>
            </div>

            <h2 className="bw-job-role-title">{card.role}</h2>
            <p className="bw-job-company-sub">{card.companyContext}</p>
          </motion.div>

          {/* Persistent 4-Attribute Comparison Grid -> Morphs into Hero Showcase Criteria Grid */}
          <motion.div
            layoutId={`bw-card-attrs-${card.id}`}
            className="bw-job-attrs-grid"
            transition={SHARED_CARD_HERO_SPRING}
          >
            <div
              className={`bw-job-attr-cell ${
                activeCriterion === 'PAY' ||
                (isCompareMode && comparedDiffHovered && isPrimaryCard)
                  ? 'is-priority-hit'
                  : ''
              }`}
            >
              <span className="bw-job-attr-label">PAY</span>
              <span className="bw-job-attr-val">{card.pay}</span>
            </div>
            <div
              className={`bw-job-attr-cell ${
                activeCriterion === 'LOCATION' || locationFilter === 'BRISBANE'
                  ? 'is-priority-hit'
                  : ''
              }`}
            >
              <span className="bw-job-attr-label">LOCATION</span>
              <span className="bw-job-attr-val">{card.location}</span>
            </div>
            <div
              className={`bw-job-attr-cell ${
                activeCriterion === 'REQUIREMENTS' ? 'is-priority-hit' : ''
              }`}
            >
              <span className="bw-job-attr-label">REQUIREMENTS</span>
              <span className="bw-job-attr-val">{card.requirements}</span>
            </div>
            <div
              ref={isPrimaryCard ? diffCellCard01Ref : undefined}
              data-demo-target={isPrimaryCard ? 'diff-cell-01' : undefined}
              className={`bw-job-attr-cell ${
                activeCriterion === 'FLEXIBILITY' ||
                (comparedDiffHovered && isPrimaryCard)
                  ? 'is-priority-hit'
                  : ''
              } ${
                comparedDiffHovered && isPrimaryCard ? 'is-diff-hovered' : ''
              }`}
            >
              <span className="bw-job-attr-label">
                FLEXIBILITY
                {isCompareMode && isPrimaryCard ? (
                  <span className="bw-diff-inline-tag">
                    {isZh ? ' ★ 关键优势' : ' ★ KEY ADVANTAGE'}
                  </span>
                ) : null}
              </span>
              <span className="bw-job-attr-val">{card.flexibility}</span>
            </div>
          </motion.div>

          {card.privateNotePreview ? (
            <div className="bw-job-note-strip">{card.privateNotePreview}</div>
          ) : null}
        </div>

        {/* Card Action Footer: Select Role + Explore BridgeWork AU */}
        <div className="bw-job-card-actions-footer">
          <button
            ref={isPrimaryCard ? selectCard01Ref : undefined}
            type="button"
            tabIndex={-1}
            data-demo-target={isPrimaryCard ? 'select-card-01' : undefined}
            className={`bw-card-select-btn ${
              isSelectedRole ? 'is-selected' : ''
            }`}
          >
            {isSelectedRole
              ? isZh
                ? '已选定优先申请 ✓'
                : 'Selected Role ✓'
              : isZh
                ? '选为优先岗位'
                : 'Select Role'}
          </button>

          <button
            ref={isPrimaryCard ? exploreBtnCard01Ref : undefined}
            type="button"
            tabIndex={-1}
            data-demo-target={isPrimaryCard ? 'explore-btn-01' : undefined}
            className={`bw-card-explore-btn ${
              isSelectedRole || isThisCardDepartingWinner ? 'is-ready' : ''
            }`}
          >
            <span>Explore BridgeWork AU</span>
            <ArrowRightIcon size={13} />
          </button>
        </div>
      </motion.article>
    )
  }

  return (
    <section
      ref={stageRef}
      className={`bw-entrance-stage ${
        phase === 'departing' ? 'is-expanding-to-page' : ''
      }`}
      data-entrance-phase={phase}
      data-autoplay-beat={beat}
      aria-label="BridgeWork AU autonomous product workflow demonstration"
    >
      <div className="bw-entrance-inner">
        {/* RESTRAINED DARK-STAGE AUTO-DEMO STATUS BAR */}
        <motion.div
          className="bw-autodemo-stage-banner"
          data-testid="bw-autodemo-banner"
          initial={
            prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }
          }
          animate={
            phase === 'departing'
              ? { opacity: 0, y: -14, scale: 0.98 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bw-autodemo-banner-left">
            <span className="bw-autodemo-pill">
              <span className="bw-autodemo-pulse-dot" aria-hidden="true" />
              <span>AUTO DEMO</span>
            </span>
            <span className="bw-autodemo-support-text">
              {isZh
                ? '正在自动演示 · 无需操作'
                : 'Automatic walkthrough · No interaction needed'}
            </span>
          </div>

          <div className="bw-autodemo-banner-center">
            <span className="bw-autodemo-beat-label">{beatStatusLabel}</span>
            <div
              className="bw-autodemo-progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressRatio * 100)}
              aria-label="Auto demo playback progress"
            >
              <div
                className="bw-autodemo-progress-fill"
                style={{ width: `${Math.round(progressRatio * 100)}%` }}
              />
            </div>
            <span className="bw-autodemo-elapsed">{elapsedSecondsText}</span>
          </div>

          <div className="bw-autodemo-banner-right">
            <button
              type="button"
              className="bw-autodemo-skip-btn"
              onClick={onSkipIntro}
            >
              <span>{isZh ? '跳过演示' : 'Skip Intro'}</span>
              <kbd className="bw-autodemo-kbd">ESC</kbd>
            </button>
          </div>
        </motion.div>

        {/* WHITE BRIDGEWORK PRODUCT SPECIMEN FRAME -> MORPHS INTO HERO SHOWCASE */}
        <motion.div
          layout
          layoutId="bw-product-showcase-frame"
          transition={SHARED_CARD_HERO_SPRING}
          className={`bw-demo-product-frame ${
            phase === 'departing' ? 'is-expanding-frame' : ''
          }`}
          aria-hidden="true"
        >
          {/* Top Workspace Header & Search / Filter / Compare Toolbar */}
          <motion.div
            className="bw-entrance-workspace-bar"
            animate={
              phase === 'departing'
                ? { opacity: 0.35, y: -6, scale: 0.99 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={DEPARTURE_SPRING}
          >
            <div className="bw-entrance-workspace-top-row">
              <div className="bw-entrance-workspace-titles">
                <div className="bw-entrance-kicker-row">
                  <span className="bw-scene-badge">{workspaceKicker}</span>
                </div>
                <h1 className="bw-entrance-main-prompt">{workspaceTitle}</h1>
              </div>

              <div className="bw-demo-shortlist-summary">
                <span className="bw-shortlist-count-badge">
                  {savedCardIds.length === 0
                    ? isZh
                      ? '候选池: 0 已收藏'
                      : 'Shortlist: 0 Saved'
                    : isZh
                      ? `候选池: ${savedCardIds.length} 已收藏 ✓`
                      : `Shortlist: ${savedCardIds.length} Saved ✓`}
                </span>
              </div>
            </div>

            {/* Interactive Search, Location Filter & Compare Controls driven by Virtual Cursor */}
            <div className="bw-demo-toolbar">
              {/* Search Field (Beat 02 Target) */}
              <div
                ref={searchInputRef}
                data-demo-target="search-input"
                className={`bw-demo-search-box ${
                  isSearchFocused ? 'is-focused' : ''
                } ${searchQuery.length > 0 ? 'has-value' : ''}`}
              >
                <span className="bw-demo-search-label">
                  {isZh ? '关键词' : 'SEARCH'}
                </span>
                <span className="bw-demo-search-value">
                  {searchQuery.length > 0 ? (
                    <>
                      <strong>{searchQuery}</strong>
                      {isSearchFocused ? (
                        <span className="bw-typing-caret" aria-hidden="true" />
                      ) : null}
                    </>
                  ) : (
                    <span className="bw-demo-search-placeholder">
                      {isZh
                        ? '输入岗位，如 UX Designer…'
                        : 'Filter roles (e.g. UX Designer)…'}
                    </span>
                  )}
                </span>
              </div>

              {/* Location Filters (Beat 02 Target: Brisbane) */}
              <div className="bw-demo-filter-group">
                <span className="bw-demo-filter-label">
                  {isZh ? '城市' : 'LOCATION'}
                </span>
                <button
                  type="button"
                  tabIndex={-1}
                  className={`bw-demo-filter-pill ${
                    locationFilter === 'ALL' ? 'is-active' : ''
                  }`}
                >
                  {isZh ? '全澳 (6)' : 'All AU (6)'}
                </button>
                <button
                  ref={locationBrisbaneRef}
                  type="button"
                  tabIndex={-1}
                  data-demo-target="location-brisbane"
                  className={`bw-demo-filter-pill ${
                    locationFilter === 'BRISBANE' ? 'is-active' : ''
                  }`}
                >
                  {isZh ? 'Brisbane (2 契合)' : 'Brisbane (2 Fit)'}
                </button>
              </div>

              {/* Compare Shortlist Button (Beat 04 Target) */}
              <div className="bw-demo-compare-group">
                <button
                  ref={compareBtnRef}
                  type="button"
                  tabIndex={-1}
                  data-demo-target="compare-btn"
                  className={`bw-demo-compare-btn ${
                    savedCardIds.length >= 2 ? 'is-ready' : ''
                  } ${isCompareMode ? 'is-active' : ''}`}
                >
                  <span>
                    {isCompareMode
                      ? isZh
                        ? '✓ 并排对比视图 (2)'
                        : '✓ Comparing Shortlist (2)'
                      : `Compare (${savedCardIds.length || 2})`}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Primary Continuous Cards Stage (3 Columns initially -> 2 Columns in Brisbane Filter / Compare Mode) */}
          <motion.div
            layout
            className={`bw-entrance-prominent-grid ${
              isBrisbaneFiltered ? 'is-two-col-compare' : ''
            }`}
          >
            {activeStageCards.map((card, idx) => renderStageCard(card, idx))}
          </motion.div>

          {/* Persistent Peripheral Shelf: Non-matching listings remain in place */}
          <motion.div
            layout
            className="bw-entrance-peripheral-shelf"
            animate={
              phase === 'departing'
                ? { opacity: 0, y: 16, scale: 0.97 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={DEPARTURE_SPRING}
          >
            <div className="bw-peripheral-shelf-header">
              <span className="bw-peripheral-shelf-label">
                {isBrisbaneFiltered
                  ? isZh
                    ? '已过滤至下方的其余岗位（非 Brisbane 地区、薪资未公开或需 PR 全职）：'
                    : 'Filtered Out of Brisbane UX Shortlist (In-place shelf — non-Brisbane, unpaid, or PR-only):'
                  : isZh
                    ? '其余已发现但暂未纳入优先候选池的岗位：'
                    : 'Additional Discovered Listings in Workspace:'}
              </span>
            </div>

            <div className="bw-peripheral-cards-row is-four-cols">
              {shelfCards.map((card) => (
                <div
                  key={card.id}
                  data-card-id={card.id}
                  data-card-prominent="false"
                  className="bw-peripheral-card"
                >
                  <div className="bw-peripheral-card-top">
                    <span className="bw-job-card-code">{card.code}</span>
                    <span className="bw-peripheral-pay">{card.pay}</span>
                  </div>
                  <strong className="bw-peripheral-role">{card.role}</strong>
                  <span className="bw-peripheral-meta">
                    {card.location} · {card.requirements}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Dark-Stage Disclaimer */}
        <motion.div
          className="bw-entrance-footer-bar"
          animate={
            phase === 'departing' ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }
          }
          transition={{ duration: 0.18 }}
        >
          <span>{data.demoDataDisclaimer}</span>
        </motion.div>
      </div>

      {/* Autonomous Virtual Cursor Overlay (aria-hidden="true", pointer-events: none) */}
      {!prefersReducedMotion ? (
        <motion.div
          aria-hidden="true"
          data-testid="bw-virtual-cursor"
          data-cursor-target={cursorTarget}
          data-cursor-clicking={isCursorClicking ? 'true' : 'false'}
          data-cursor-mode={isTouchPointerMode ? 'touch' : 'mouse'}
          className={`bw-virtual-cursor-layer ${
            isCursorClicking ? 'is-clicking' : ''
          } ${phase === 'departing' ? 'is-fading-out' : ''}`}
          style={{
            transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
          }}
        >
          {/* Attention & Click Ripple Ring */}
          <span
            className={`bw-virtual-cursor-ripple ${
              isCursorClicking || beat === 'beat-01-cursor-appear'
                ? 'is-pulsing'
                : ''
            }`}
          />

          {isTouchPointerMode ? (
            /* Mobile / Coarse Pointer Touch-Tap Indicator */
            <div className="bw-virtual-cursor-touch-dot">
              <span className="bw-virtual-cursor-touch-core" />
            </div>
          ) : (
            /* Desktop / Tablet Recognizable Mouse Pointer + Subtle Status Pill */
            <div className="bw-virtual-cursor-pointer-wrap">
              <svg
                className="bw-virtual-cursor-svg"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.2 2.6L21.4 10.7C22.3 11.1 22.2 12.4 21.3 12.7L13.8 15.1L10.7 22.3C10.3 23.2 9.0 23.1 8.7 22.2L3.0 3.9C2.7 3.0 3.4 2.2 4.2 2.6Z"
                  fill="#080808"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="bw-virtual-cursor-pill">
                {beat === 'beat-02-search-filter' && isSearchFocused
                  ? 'UX Designer'
                  : beat === 'beat-03-save-roles'
                    ? 'Save ✓'
                    : beat === 'beat-04-compare-roles'
                      ? 'Compare (2)'
                      : beat === 'beat-05-select-explore'
                        ? 'Explore →'
                        : 'AUTO DEMO'}
              </span>
            </div>
          )}
        </motion.div>
      ) : null}
    </section>
  )
}
