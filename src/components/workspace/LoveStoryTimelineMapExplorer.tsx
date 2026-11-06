import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from '../icons/WorkspaceIcons'
import { LOVE_STORY_WORLD_COUNTRIES } from '../../data/loveStoryWorldRings'
import {
  LOVE_STORY_CHRONOLOGICAL_MEMORIES,
  LOVE_STORY_DEMO_MEMORIES,
  type LoveStoryDemoMemoryItem,
} from './LoveStoryMemoryGallery'

const DEG = Math.PI / 180
const GLOBE_CX = 260
const GLOBE_CY = 260
const GLOBE_RADIUS = 214

interface ProjectedPoint {
  x: number
  y: number
  visible: boolean
  cos: number
}

/**
 * Authentic orthographic projection and horizon clipping adapted directly from
 * LoveStory's `hub/geo.js` (`window.LoveStoryGeo`).
 */
function createOrthographicProjector(
  centerLon: number,
  centerLat: number,
  scale: number,
  cx: number,
  cy: number
): (lon: number, lat: number) => ProjectedPoint {
  const sinLat = Math.sin(centerLat * DEG)
  const cosLat = Math.cos(centerLat * DEG)

  return (lon: number, lat: number): ProjectedPoint => {
    const l = (lon - centerLon) * DEG
    const p = lat * DEG

    const cosP = Math.cos(p)
    const sinP = Math.sin(p)
    const cosC = sinLat * sinP + cosLat * cosP * Math.cos(l)

    const x = cosP * Math.sin(l)
    const y = cosLat * sinP - sinLat * cosP * Math.cos(l)

    return {
      x: cx + scale * x,
      y: cy - scale * y,
      visible: cosC >= 0,
      cos: cosC,
    }
  }
}

function horizonPoint(
  a: ProjectedPoint,
  b: ProjectedPoint,
  scale: number,
  cx: number,
  cy: number
): { x: number; y: number } {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const A = dx * dx + dy * dy
  if (A === 0) return { x: a.x, y: a.y }

  const fx = a.x - cx
  const fy = a.y - cy
  const B = 2 * (fx * dx + fy * dy)
  const C = fx * fx + fy * fy - scale * scale
  const disc = B * B - 4 * A * C
  if (disc < 0) return { x: a.x, y: a.y }

  let t = (-B + Math.sqrt(disc)) / (2 * A)
  if (t < 0) t = 0
  if (t > 1) t = 1

  return { x: a.x + t * dx, y: a.y + t * dy }
}

function ringToPath(
  ring: ReadonlyArray<readonly [number, number]>,
  project: (lon: number, lat: number) => ProjectedPoint,
  scale: number,
  cx: number,
  cy: number
): string {
  let d = ''
  let previous: ProjectedPoint | null = null

  for (let i = 0; i < ring.length; i++) {
    const point = project(ring[i][0], ring[i][1])

    if (!previous) {
      if (point.visible) {
        d += `M${point.x.toFixed(1)} ${point.y.toFixed(1)}`
      }
    } else if (previous.visible && point.visible) {
      d += `L${point.x.toFixed(1)} ${point.y.toFixed(1)}`
    } else if (previous.visible && !point.visible) {
      const exit = horizonPoint(previous, point, scale, cx, cy)
      d += `L${exit.x.toFixed(1)} ${exit.y.toFixed(1)}`
    } else if (!previous.visible && point.visible) {
      const entry = horizonPoint(point, previous, scale, cx, cy)
      d += `M${entry.x.toFixed(1)} ${entry.y.toFixed(1)}L${point.x.toFixed(1)} ${point.y.toFixed(1)}`
    }

    previous = point
  }

  return d
}

function isRingVisible(
  ring: ReadonlyArray<readonly [number, number]>,
  project: (lon: number, lat: number) => ProjectedPoint
): boolean {
  for (let i = 0; i < ring.length; i += 3) {
    if (project(ring[i][0], ring[i][1]).visible) return true
  }
  return false
}

function buildGraticuleLines(step = 30): ReadonlyArray<ReadonlyArray<readonly [number, number]>> {
  const lines: Array<Array<readonly [number, number]>> = []
  for (let lon = -180; lon < 180; lon += step) {
    const line: Array<readonly [number, number]> = []
    for (let lat = -75; lat <= 75; lat += 5) line.push([lon, lat])
    lines.push(line)
  }
  for (let lat = -60; lat <= 60; lat += step) {
    const line: Array<readonly [number, number]> = []
    for (let lon = -180; lon <= 180; lon += 5) line.push([lon, lat])
    lines.push(line)
  }
  return lines
}

const GRATICULE_LINES = buildGraticuleLines(30)

function lineToPath(
  points: ReadonlyArray<readonly [number, number]>,
  project: (lon: number, lat: number) => ProjectedPoint
): string {
  let d = ''
  let drawing = false
  for (let i = 0; i < points.length; i++) {
    const p = project(points[i][0], points[i][1])
    if (p.visible) {
      d += `${drawing ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
      drawing = true
    } else {
      drawing = false
    }
  }
  return d
}

interface LoveStoryTimelineMapExplorerProps {
  isZh: boolean
  selectedMemoryId: string
  onSelectMemory: (memoryId: string) => void
  onOpenInGallery?: (memoryId: string) => void
}

export const LoveStoryTimelineMapExplorer: React.FC<
  LoveStoryTimelineMapExplorerProps
> = ({ isZh, selectedMemoryId, onSelectMemory, onOpenInGallery }) => {
  const prefersReducedMotion = Boolean(useReducedMotion())
  const [isUxInsightOpen, setIsUxInsightOpen] = useState<boolean>(false)
  const [lastInteractionSource, setLastInteractionSource] = useState<
    'timeline' | 'map' | 'gallery'
  >('timeline')

  const timelineNodeRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const activeMemory: LoveStoryDemoMemoryItem = useMemo(() => {
    return (
      LOVE_STORY_DEMO_MEMORIES.find((m) => m.id === selectedMemoryId) ??
      LOVE_STORY_DEMO_MEMORIES[0]
    )
  }, [selectedMemoryId])

  const activeChronologicalIdx = useMemo(() => {
    const idx = LOVE_STORY_CHRONOLOGICAL_MEMORIES.findIndex(
      (m) => m.id === activeMemory.id
    )
    return idx >= 0 ? idx : 0
  }, [activeMemory.id])

  // Gently tilt the orthographic projection toward the selected memory's coordinates
  // while keeping all 6 Asia-Pacific / Oceania locations on the visible hemisphere.
  const targetCenter = useMemo(() => {
    const baseLon = 128
    const baseLat = 6
    const lon = baseLon + (activeMemory.longitude - baseLon) * 0.22
    const lat = baseLat + (activeMemory.latitude - baseLat) * 0.2
    return { lon, lat }
  }, [activeMemory.longitude, activeMemory.latitude])

  const [globeCenter, setGlobeCenter] = useState<{ lon: number; lat: number }>(
    targetCenter
  )

  useEffect(() => {
    if (prefersReducedMotion) {
      setGlobeCenter(targetCenter)
      return
    }

    let rafId: number | null = null
    const startLon = globeCenter.lon
    const startLat = globeCenter.lat
    const dLon = targetCenter.lon - startLon
    const dLat = targetCenter.lat - startLat

    if (Math.abs(dLon) < 0.05 && Math.abs(dLat) < 0.05) {
      setGlobeCenter(targetCenter)
      return
    }

    const startTime = performance.now()
    const duration = 420

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setGlobeCenter({
        lon: startLon + dLon * eased,
        lat: startLat + dLat * eased,
      })
      if (t < 1) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetCenter.lon, targetCenter.lat, prefersReducedMotion])

  const handleSelectFromTimeline = useCallback(
    (memoryId: string) => {
      setLastInteractionSource('timeline')
      onSelectMemory(memoryId)
    },
    [onSelectMemory]
  )

  const handleSelectFromMap = useCallback(
    (memoryId: string) => {
      setLastInteractionSource('map')
      onSelectMemory(memoryId)
      const nodeEl = timelineNodeRefs.current[memoryId]
      if (nodeEl && typeof nodeEl.scrollIntoView === 'function') {
        nodeEl.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    },
    [onSelectMemory, prefersReducedMotion]
  )

  const handleStepChronological = useCallback(
    (delta: -1 | 1) => {
      const nextIdx =
        (activeChronologicalIdx +
          delta +
          LOVE_STORY_CHRONOLOGICAL_MEMORIES.length) %
        LOVE_STORY_CHRONOLOGICAL_MEMORIES.length
      const nextItem = LOVE_STORY_CHRONOLOGICAL_MEMORIES[nextIdx]
      setLastInteractionSource('timeline')
      onSelectMemory(nextItem.id)
    },
    [activeChronologicalIdx, onSelectMemory]
  )

  // Compute SVG paths for countries, graticule, and the 6 memory markers
  const projectedGlobe = useMemo(() => {
    const project = createOrthographicProjector(
      globeCenter.lon,
      globeCenter.lat,
      GLOBE_RADIUS,
      GLOBE_CX,
      GLOBE_CY
    )

    const countryPaths = LOVE_STORY_WORLD_COUNTRIES.map((country) => {
      let d = ''
      for (let i = 0; i < country.rings.length; i++) {
        const ring = country.rings[i]
        if (!isRingVisible(ring, project)) continue
        d += ringToPath(ring, project, GLOBE_RADIUS, GLOBE_CX, GLOBE_CY)
      }
      return {
        id: country.id,
        name: country.name,
        hasMemories: country.hasMemories,
        d,
      }
    }).filter((c) => c.d.length > 0)

    const graticulePaths = GRATICULE_LINES.map((line, idx) => ({
      id: `grat-${idx}`,
      d: lineToPath(line, project),
    })).filter((g) => g.d.length > 0)

    // Project all 6 demonstration memories onto the hemisphere.
    // For Brisbane's two memories (mem-101 Riverwalk & mem-102 Botanic Gardens),
    // compute the true Brisbane anchor and give each memory a distinct, readable
    // marker offset around the Brisbane river bend so both pins are individually
    // clickable without overlapping.
    const markers = LOVE_STORY_CHRONOLOGICAL_MEMORIES.map((memory) => {
      const anchorPt = project(memory.longitude, memory.latitude)
      let markerX = anchorPt.x
      let markerY = anchorPt.y
      let labelSide: 'right' | 'left' | 'top' | 'bottom' = 'right'

      if (memory.id === 'mem-101') {
        // Brisbane — New Farm Riverwalk (Northeast river bend pin)
        markerX = anchorPt.x + 14
        markerY = anchorPt.y - 11
        labelSide = 'right'
      } else if (memory.id === 'mem-102') {
        // Brisbane — City Botanic Gardens (Southwest conservatory pin)
        markerX = anchorPt.x - 16
        markerY = anchorPt.y + 10
        labelSide = 'left'
      } else if (memory.id === 'mem-104') {
        // Melbourne
        labelSide = 'left'
      } else if (memory.id === 'mem-105') {
        // Chengdu
        labelSide = 'left'
      } else if (memory.id === 'mem-106') {
        // Hulunbeier
        labelSide = 'right'
      } else {
        // Kyoto
        labelSide = 'right'
      }

      return {
        memory,
        anchorX: anchorPt.x,
        anchorY: anchorPt.y,
        x: markerX,
        y: markerY,
        visible: anchorPt.visible,
        labelSide,
      }
    })

    // Chronological route path connecting the 6 memories across the globe
    let routePath = ''
    markers.forEach((m, idx) => {
      routePath += `${idx === 0 ? 'M' : 'L'}${m.x.toFixed(1)} ${m.y.toFixed(1)}`
    })

    return {
      countryPaths,
      graticulePaths,
      markers,
      routePath,
    }
  }, [globeCenter.lon, globeCenter.lat])

  const motionTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }

  const activePhoto = activeMemory.photos[0]

  return (
    <section
      className="ls-timeline-map-explorer"
      aria-labelledby="ls-tm-explorer-heading"
      data-selected-memory={activeMemory.id}
      data-last-source={lastInteractionSource}
    >
      {/* Top Header Bar: Title & Discreet UX Design Insight Toggle */}
      <header className="ls-tm-header">
        <div className="ls-tm-title-cluster">
          <div className="ls-tm-eyebrow-row">
            <span className="ls-tm-demo-badge">
              {isZh
                ? '交互式作品集原型 · 时间轴 × 记忆地图双向同步'
                : 'INTERACTIVE PORTFOLIO PROTOTYPE · TIMELINE × MEMORY MAP'}
            </span>
            <span className="ls-tm-sync-meta">
              {isZh
                ? '2025 — 2026 · 6 则真实坐标记忆共享同一选中状态'
                : '2025 — 2026 · 6 VERIFIED COORDINATE MEMORIES · SHARED STATE'}
            </span>
          </div>
          <h4 id="ls-tm-explorer-heading" className="ls-tm-heading">
            {isZh
              ? '在时间与空间之间重温记忆：点选时间轴节点或地球仪坐标，实时联动记忆预览'
              : 'Rediscover Across Time and Place: Select any timeline node or map marker to synchronise'}
          </h4>
        </div>

        <button
          type="button"
          className={`ls-tm-ux-insight-toggle ${
            isUxInsightOpen ? 'is-open' : ''
          }`}
          data-ux-insight-toggle="timeline-map"
          aria-expanded={isUxInsightOpen}
          aria-controls="ls-tm-ux-insight-panel"
          onClick={() => setIsUxInsightOpen((prev) => !prev)}
        >
          <span className="ls-tm-ux-dot" aria-hidden="true" />
          <span>
            {isZh ? '为什么要连接时间与空间？' : 'Why connect time and place?'}
          </span>
          <span className="ls-tm-ux-chevron" aria-hidden="true">
            {isUxInsightOpen ? '−' : '+'}
          </span>
        </button>
      </header>

      {/* Collapsible UX Design Insight ("Why connect time and place?") */}
      <AnimatePresence initial={false}>
        {isUxInsightOpen ? (
          <motion.div
            id="ls-tm-ux-insight-panel"
            className="ls-tm-ux-insight-drawer"
            role="region"
            aria-label={
              isZh
                ? '时间与空间双向联动的设计原理解析'
                : 'Timeline and Memory Map UX design rationale'
            }
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={motionTransition}
          >
            <div className="ls-tm-ux-insight-grid">
              <div className="ls-tm-ux-cell">
                <span className="ls-tm-ux-kicker">
                  {isZh ? '01 · 用户需求 (USER NEED)' : '01 · USER NEED'}
                </span>
                <p className="ls-tm-ux-text">
                  {isZh
                    ? '伴侣有时按“哪一年哪一月”寻找纪念时刻，有时则按“去过哪座城市”重温共同旅途——需要通过不同上下文自然唤起同一段记忆。'
                    : 'Rediscover shared memories through different contexts — whether recalling when a chapter happened or where you travelled together.'}
                </p>
              </div>
              <div className="ls-tm-ux-cell">
                <span className="ls-tm-ux-kicker">
                  {isZh ? '02 · 设计决策 (DESIGN DECISION)' : '02 · DESIGN DECISION'}
                </span>
                <p className="ls-tm-ux-text">
                  {isZh
                    ? '提供互补的真实发生日期时间轴（YYYY-MM-DD）与正射投影记忆地图，底层共享同一记忆数据结构与唯一选中状态。'
                    : 'Provide complementary chronological and geographic browsing backed by one shared memory record and verified coordinates.'}
                </p>
              </div>
              <div className="ls-tm-ux-cell">
                <span className="ls-tm-ux-kicker">
                  {isZh ? '03 · 交互方式 (INTERACTION)' : '03 · INTERACTION'}
                </span>
                <p className="ls-tm-ux-text">
                  {isZh
                    ? '无论点选时间轴事件、地图坐标锚点，或从记忆画廊点击“在记忆地图中查看”，时间轴、地球仪与右侧记忆预览均即时同步。'
                    : 'Selecting either a Timeline event, a Map marker, or "Locate on Memory Map" keeps both representations and the preview synchronised.'}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ====================================================================
          PART 1 — CHRONOLOGICAL TIMELINE (2025 → 2026)
          Proportional Date Axis + 6 Selectable Chronological Nodes
          ==================================================================== */}
      <div
        className="ls-tm-timeline-band"
        role="region"
        aria-label={
          isZh ? '编年时间轴 (2025 至 2026)' : 'Chronological Timeline (2025 to 2026)'
        }
      >
        {/* Proportional Chronological Axis Bar */}
        <div className="ls-tm-chrono-axis-header">
          <div className="ls-tm-year-marker is-2025">
            <span className="ls-tm-year-num">2025</span>
            <span className="ls-tm-year-sub">
              {isZh ? '呼伦贝尔 · 成都' : 'Hulunbeier · Chengdu'}
            </span>
          </div>

          <div className="ls-tm-proportional-track" aria-hidden="true">
            <div className="ls-tm-track-base-line" />
            <div
              className="ls-tm-track-active-fill"
              style={{ width: `${activeMemory.timelineProgressPct}%` }}
            />
            {/* 2025 / 2026 Year Boundary Divider */}
            <div
              className="ls-tm-track-year-divider"
              style={{ left: '35%' }}
              title="2025 → 2026"
            >
              <span>2026</span>
            </div>
            {/* Proportional Date Ticks along the 13-month span */}
            {LOVE_STORY_CHRONOLOGICAL_MEMORIES.map((mem) => {
              const isTickActive = mem.id === activeMemory.id
              return (
                <div
                  key={`tick-${mem.id}`}
                  className={`ls-tm-track-tick ${
                    isTickActive ? 'is-active' : ''
                  }`}
                  style={{ left: `${mem.timelineProgressPct}%` }}
                >
                  <span className="ls-tm-tick-dot" />
                </div>
              )
            })}
          </div>

          <div className="ls-tm-year-marker is-2026">
            <span className="ls-tm-year-num">2026</span>
            <span className="ls-tm-year-sub">
              {isZh ? '墨尔本 · 京都 · 布里斯班' : 'Melbourne · Kyoto · Brisbane'}
            </span>
          </div>
        </div>

        {/* 6 Selectable Chronological Memory Nodes */}
        <div
          className="ls-tm-nodes-rail"
          role="group"
          aria-label={
            isZh ? '按时间顺序选择记忆节点' : 'Select memory along chronological timeline'
          }
        >
          {LOVE_STORY_CHRONOLOGICAL_MEMORIES.map((memory) => {
            const isSelected = memory.id === activeMemory.id
            const title = isZh ? memory.titleZh : memory.titleEn
            const city = isZh ? memory.cityZh : memory.cityEn
            const shortDate = isZh ? memory.shortDateZh : memory.shortDateEn
            const thumb = memory.photos[0]

            return (
              <button
                key={memory.id}
                ref={(el) => {
                  timelineNodeRefs.current[memory.id] = el
                }}
                type="button"
                data-timeline-node={memory.id}
                aria-pressed={isSelected}
                aria-label={
                  isZh
                    ? `时间轴节点 ${memory.year} ${shortDate}：${title}（${city}）`
                    : `Timeline node ${shortDate}, ${memory.year}: ${title} (${city})`
                }
                className={`ls-tm-node-btn ${isSelected ? 'is-active' : ''}`}
                onClick={() => handleSelectFromTimeline(memory.id)}
              >
                <div className="ls-tm-node-top-row">
                  <span className="ls-tm-node-ring" aria-hidden="true">
                    <span className="ls-tm-node-core" />
                  </span>
                  <span className="ls-tm-node-year">{memory.year}</span>
                  <span className="ls-tm-node-date">{shortDate}</span>
                </div>

                <div className="ls-tm-node-body">
                  <div className="ls-tm-node-thumb-frame">
                    <img
                      src={thumb.webp}
                      alt=""
                      className="ls-tm-node-thumb-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="ls-tm-node-copy">
                    <span className="ls-tm-node-city">{city}</span>
                    <span className="ls-tm-node-title">{title}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ====================================================================
          PART 2 — ORTHOGRAPHIC MEMORY MAP (LEFT) × SHARED PREVIEW (RIGHT)
          ==================================================================== */}
      <div className="ls-tm-workspace-split">
        {/* Left Column: Authentic Orthographic Globe & Selectable Markers */}
        <div
          className="ls-tm-map-stage"
          role="region"
          aria-label={
            isZh
              ? '正射投影交互式记忆地图'
              : 'Orthographic Interactive Memory Map'
          }
        >
          <div className="ls-tm-map-stage-topbar">
            <div className="ls-tm-map-title-group">
              <span className="ls-tm-map-kicker">
                {isZh ? 'OUR WORLD · 正射投影地球仪' : 'OUR WORLD · ORTHOGRAPHIC PROJECTION'}
              </span>
              <span className="ls-tm-map-active-place">
                {isZh
                  ? `当前高亮坐标：${activeMemory.cityZh} (${activeMemory.coordinatesLabel})`
                  : `Active Coordinate: ${activeMemory.cityEn} (${activeMemory.coordinatesLabel})`}
              </span>
            </div>
            <span className="ls-tm-map-hint">
              {isZh ? '点选任意城市锚点切换' : 'Click any marker to select'}
            </span>
          </div>

          {/* SVG Orthographic Globe with Natural Earth 110m Coastlines */}
          <div className="ls-tm-globe-canvas-wrap">
            <svg
              viewBox="0 0 520 520"
              className="ls-tm-globe-svg"
              role="group"
              aria-label={
                isZh
                  ? '包含六个共同记忆地点的正射投影地图'
                  : 'Orthographic map displaying six shared memory locations'
              }
            >
              <defs>
                <radialGradient id="lsGlobeSurface" cx="46%" cy="42%" r="56%">
                  <stop offset="0%" stopColor="#22231F" />
                  <stop offset="68%" stopColor="#161714" />
                  <stop offset="100%" stopColor="#10110F" />
                </radialGradient>
                <radialGradient id="lsMarkerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#C8AD75" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#C8AD75" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Outer Subtle Orbital Ring (from Our World Hub aesthetic) */}
              <ellipse
                cx={GLOBE_CX}
                cy={GLOBE_CY}
                rx={246}
                ry={96}
                transform={`rotate(-16 ${GLOBE_CX} ${GLOBE_CY})`}
                className="ls-tm-globe-orbit"
              />

              {/* Sphere Disc */}
              <circle
                cx={GLOBE_CX}
                cy={GLOBE_CY}
                r={GLOBE_RADIUS}
                fill="url(#lsGlobeSurface)"
                className="ls-tm-globe-disc"
              />

              {/* Graticule Meridians & Parallels */}
              <g className="ls-tm-globe-graticule" aria-hidden="true">
                {projectedGlobe.graticulePaths.map((grat) => (
                  <path
                    key={grat.id}
                    d={grat.d}
                    className="ls-tm-graticule-line"
                  />
                ))}
              </g>

              {/* Natural Earth 110m Country Coastlines */}
              <g className="ls-tm-globe-countries" aria-hidden="true">
                {projectedGlobe.countryPaths.map((country) => (
                  <path
                    key={country.id}
                    d={country.d}
                    className={`ls-tm-country-path ${
                      country.hasMemories ? 'has-memories' : ''
                    } ${
                      country.name === activeMemory.countryEn
                        ? 'is-active-country'
                        : ''
                    }`}
                  />
                ))}
              </g>

              {/* Subtle Gold Journey Thread Connecting Chronological Places */}
              {projectedGlobe.routePath ? (
                <path
                  d={projectedGlobe.routePath}
                  className="ls-tm-globe-journey-arc"
                  aria-hidden="true"
                />
              ) : null}

              {/* Selectable Geographic Markers for All 6 Memories */}
              <g className="ls-tm-globe-markers">
                {projectedGlobe.markers.map((marker) => {
                  const { memory, x, y, anchorX, anchorY, labelSide } = marker
                  const isSelected = memory.id === activeMemory.id
                  const cityLabel = isZh ? memory.cityZh : memory.cityEn
                  const shortTitle =
                    memory.id === 'mem-101'
                      ? isZh
                        ? '布里斯班 · 河畔'
                        : 'Brisbane · Riverwalk'
                      : memory.id === 'mem-102'
                        ? isZh
                          ? '布里斯班 · 植物园'
                          : 'Brisbane · Botanic'
                        : cityLabel

                  const labelDx = labelSide === 'left' ? -14 : 14
                  const textAnchor = labelSide === 'left' ? 'end' : 'start'

                  return (
                    <g
                      key={memory.id}
                      className={`ls-tm-marker-group ${
                        isSelected ? 'is-selected' : ''
                      }`}
                    >
                      {/* Fine leader line connecting Brisbane's 2 pins to the exact Brisbane coast coordinate */}
                      {Math.hypot(x - anchorX, y - anchorY) > 2 ? (
                        <line
                          x1={anchorX}
                          y1={anchorY}
                          x2={x}
                          y2={y}
                          className="ls-tm-marker-leader"
                          aria-hidden="true"
                        />
                      ) : null}

                      <g
                        transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)})`}
                        role="button"
                        tabIndex={0}
                        data-map-marker={memory.id}
                        aria-pressed={isSelected}
                        aria-label={
                          isZh
                            ? `地图坐标：${memory.placeDetailZh} — ${memory.titleZh}（${memory.dateDisplayZh}）`
                            : `Map marker: ${memory.placeDetailEn} — ${memory.titleEn} (${memory.dateDisplayEn})`
                        }
                        onClick={() => handleSelectFromMap(memory.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectFromMap(memory.id)
                          }
                        }}
                        className="ls-tm-marker-interactive"
                      >
                        {/* 36×36px accessible touch/click hit target covering pin & label */}
                        <rect
                          x={labelSide === 'left' ? -110 : -20}
                          y={-18}
                          width={130}
                          height={36}
                          rx={18}
                          fill="rgba(0, 0, 0, 0.001)"
                          className="ls-tm-marker-hit"
                        />

                        {/* Active radial glow & outer pulse ring */}
                        {isSelected ? (
                          <>
                            <circle
                              r={24}
                              fill="url(#lsMarkerGlow)"
                              aria-hidden="true"
                            />
                            <circle
                              r={13}
                              className="ls-tm-marker-outer-ring"
                              aria-hidden="true"
                            />
                          </>
                        ) : null}

                        {/* Standard marker ring & core dot */}
                        <circle
                          r={isSelected ? 8.5 : 6.5}
                          className="ls-tm-marker-ring"
                        />
                        <circle
                          r={isSelected ? 4.2 : 2.8}
                          className="ls-tm-marker-dot"
                        />

                        {/* Readable geographic label */}
                        <text
                          x={labelDx}
                          y={4}
                          textAnchor={textAnchor}
                          className="ls-tm-marker-label"
                        >
                          {shortTitle}
                        </text>
                      </g>
                    </g>
                  )
                })}
              </g>

              {/* Outer Rim Border */}
              <circle
                cx={GLOBE_CX}
                cy={GLOBE_CY}
                r={GLOBE_RADIUS}
                fill="none"
                className="ls-tm-globe-rim"
                aria-hidden="true"
              />
            </svg>
          </div>

          {/* Bottom Place Quick-Select Index Bar (mirrors LoveStory's bottom place bar) */}
          <div
            className="ls-tm-place-index-bar"
            role="group"
            aria-label={
              isZh ? '按地点快速选择地图锚点' : 'Select location from place index'
            }
          >
            {LOVE_STORY_CHRONOLOGICAL_MEMORIES.map((mem) => {
              const isSelected = mem.id === activeMemory.id
              const pillLabel =
                mem.id === 'mem-101'
                  ? isZh
                    ? '布里斯班 · 河畔 (09/18)'
                    : 'Brisbane · Riverwalk'
                  : mem.id === 'mem-102'
                    ? isZh
                      ? '布里斯班 · 植物园 (08/24)'
                      : 'Brisbane · Botanic'
                    : isZh
                      ? mem.cityZh
                      : mem.cityEn

              return (
                <button
                  key={`place-pill-${mem.id}`}
                  type="button"
                  data-map-place-pill={mem.id}
                  aria-pressed={isSelected}
                  className={`ls-tm-place-pill ${
                    isSelected ? 'is-active' : ''
                  }`}
                  onClick={() => handleSelectFromMap(mem.id)}
                >
                  <span className="ls-tm-place-pill-dot" aria-hidden="true" />
                  <span>{pillLabel}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Shared Memory Preview (#20211E Archival Mount) */}
        <motion.div
          key={`ls-tm-preview-${activeMemory.id}`}
          className="ls-tm-shared-preview"
          role="region"
          aria-labelledby="ls-tm-preview-title"
          data-shared-preview-id={activeMemory.id}
          initial={{ opacity: 0.78, y: prefersReducedMotion ? 0 : 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionTransition}
        >
          <div className="ls-tm-preview-topbar">
            <span className="ls-tm-preview-sync-badge">
              {isZh
                ? `已同步预览 · 记忆 ${activeMemory.indexLabel} / 06`
                : `SYNCHRONISED PREVIEW · MEMORY ${activeMemory.indexLabel} OF 06`}
            </span>
            <span className="ls-tm-preview-coords">
              {activeMemory.coordinatesLabel}
            </span>
          </div>

          {/* Prominent Photograph inside #20211E Frame */}
          <figure className="ls-tm-preview-figure">
            <div
              className="ls-tm-preview-photo-frame"
              style={{ aspectRatio: activePhoto.aspectRatio }}
            >
              <picture className="ls-tm-preview-picture">
                <source srcSet={activePhoto.webp} type="image/webp" />
                <img
                  src={activePhoto.png}
                  alt={`${
                    isZh ? activeMemory.titleZh : activeMemory.titleEn
                  } — ${
                    isZh ? activePhoto.captionZh : activePhoto.captionEn
                  }`}
                  className="ls-tm-preview-img"
                />
              </picture>
              <span className="ls-tm-preview-tag-pill">
                {isZh
                  ? activeMemory.collectionTagZh
                  : activeMemory.collectionTagEn}
              </span>
            </div>
          </figure>

          {/* Memory Metadata & Concise Story */}
          <div className="ls-tm-preview-meta-block">
            <div className="ls-tm-preview-date-place">
              <span className="ls-tm-preview-date">
                {isZh
                  ? `${activeMemory.dateDisplayZh} · ${activeMemory.timeDisplay}`
                  : `${activeMemory.dateDisplayEn.toUpperCase()} · ${activeMemory.timeDisplay}`}
              </span>
              <span className="ls-tm-preview-sep" aria-hidden="true">
                ·
              </span>
              <span className="ls-tm-preview-place">
                {isZh
                  ? activeMemory.placeDetailZh
                  : activeMemory.placeDetailEn}
              </span>
            </div>

            <h4 id="ls-tm-preview-title" className="ls-tm-preview-title">
              {isZh ? activeMemory.titleZh : activeMemory.titleEn}
            </h4>

            <p className="ls-tm-preview-description">
              {isZh ? activeMemory.storyZh : activeMemory.storyEn}
            </p>
          </div>

          {/* Preview Footer: Step Controls & Link Back to Memory Gallery */}
          <div className="ls-tm-preview-actions">
            <div
              className="ls-tm-preview-step-group"
              role="group"
              aria-label={
                isZh ? '按时间顺序切换记忆' : 'Step chronologically through memories'
              }
            >
              <button
                type="button"
                className="ls-tm-step-btn"
                data-tm-action="prev-chrono"
                onClick={() => handleStepChronological(-1)}
              >
                <ArrowLeftIcon size={13} />
                <span>{isZh ? '上一则' : 'Earlier'}</span>
              </button>
              <button
                type="button"
                className="ls-tm-step-btn"
                data-tm-action="next-chrono"
                onClick={() => handleStepChronological(1)}
              >
                <span>{isZh ? '下一则' : 'Later'}</span>
                <ArrowRightIcon size={13} />
              </button>
            </div>

            {onOpenInGallery ? (
              <button
                type="button"
                className="ls-tm-open-gallery-btn"
                data-tm-action="open-in-gallery"
                onClick={() => onOpenInGallery(activeMemory.id)}
              >
                <span>
                  {isZh
                    ? '在记忆画廊中打开详情'
                    : 'Open in Memory Gallery'}
                </span>
                <ArrowUpRightIcon size={14} />
              </button>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
