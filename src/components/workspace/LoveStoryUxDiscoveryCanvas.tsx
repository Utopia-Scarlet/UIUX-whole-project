import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
} from '../icons/WorkspaceIcons'
import {
  LOVE_STORY_ASSET_SPEC,
  type LoveStoryExperienceData,
  type LoveStoryVisualAssetSlot,
} from '../../data/portfolioData'
import {
  LoveStoryEvidencePicture,
  type EnlargedMediaItem,
} from './LoveStoryArchiveMedia'
import type { LoveStoryArchiveId } from './LoveStoryCaseStudy'

export type UxDiscoveryNodeId =
  | 'ux-node-01'
  | 'ux-node-02'
  | 'ux-node-03'
  | 'ux-node-04'
  | 'ux-node-05'

const UX_NODE_ORDER: ReadonlyArray<UxDiscoveryNodeId> = [
  'ux-node-01',
  'ux-node-02',
  'ux-node-03',
  'ux-node-04',
  'ux-node-05',
]

export interface DesignOutcomeDeepLink {
  archiveId: LoveStoryArchiveId
  moduleIndex?: number
  exhibitionAreaIdx?: number
  iterationIdx?: number
}

interface LoveStoryUxDiscoveryCanvasProps {
  isZh: boolean
  loveStoryData: LoveStoryExperienceData
  enlargeLabel: string
  onEnlargeMedia: (item: EnlargedMediaItem) => void
  onNavigateToDesignOutcome: (target: DesignOutcomeDeepLink) => void
}

interface UxDiscoveryNodeMeta {
  id: UxDiscoveryNodeId
  number: '01' | '02' | '03' | '04' | '05'
  shortTitle: string
  headline: string
  roleTag: string
  compactQuestion: string
  staggerClass: string
}

interface TargetUserScenarioItem {
  id: string
  code: string
  tabTitle: string
  scenarioTitle: string
  evidenceBadge: string
  userGoal: string
  mainTask: string
  contextDetail: string
  relevantModules: string[]
  slot: LoveStoryVisualAssetSlot
  mediaTitle: string
  mediaCaption: string
  mediaBadge: string
  outcomeLink: DesignOutcomeDeepLink
  outcomeCta: string
}

interface SecondaryResearchInsightItem {
  id: string
  code: string
  tabTitle: string
  prominentInsight: string
  briefExplanation: string
  designResponseSummary: string
  sourceName: string
  sourceUrl: string
  sourceDate: string
  evidenceOriginLabel: string
  releaseCrossCheckNote: string
  flowSteps: {
    publicFeedback: string
    uxInsight: string
    designOpportunity: string
    loveStoryResponse: string
  }
  slot: LoveStoryVisualAssetSlot
  mediaTitle: string
  mediaCaption: string
  mediaBadge: string
  outcomeLink: DesignOutcomeDeepLink
  outcomeCta: string
}

interface CompetitiveReferenceItem {
  id: 'apple-shared-albums' | 'apple-journal' | 'welove'
  code: string
  name: string
  categoryBadge: string
  officialUrl: string
  sourceNote: string
  coreTakeaway: string
  verifiedStrength: string
  keyGapVsLoveStory: string
  loveStoryDecision: string
  slot: LoveStoryVisualAssetSlot
  mediaTitle: string
  mediaCaption: string
  dimensions: {
    dimension: string
    supportState: string
    observation: string
  }[]
  outcomeLink: DesignOutcomeDeepLink
  outcomeCta: string
}

interface RequirementSynthesisItem {
  id: string
  number: string
  tabTitle: string
  headline: string
  coreSummary: string
  designResponseSummary: string
  evidenceOriginBadge: string
  implementationBadge: string
  chainSteps: {
    userNeed: string
    requirement: string
    designDecision: string
    actualInterface: string
  }
  detailedSpecs: {
    functional: string
    usability: string
    privacy: string
  }
  slot: LoveStoryVisualAssetSlot
  mediaTitle: string
  mediaCaption: string
  mediaBadge: string
  outcomeLink: DesignOutcomeDeepLink
  outcomeCta: string
}

export const LoveStoryUxDiscoveryCanvas: React.FC<
  LoveStoryUxDiscoveryCanvasProps
> = ({
  isZh,
  loveStoryData,
  enlargeLabel,
  onEnlargeMedia,
  onNavigateToDesignOutcome,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion())

  // Expanded node state (null = compact 5-node network; preserved across EN / 中文)
  const [expandedNodeId, setExpandedNodeId] =
    useState<UxDiscoveryNodeId | null>(null)

  // Interactive sub-states inside each UX node (preserved across EN / 中文)
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0)
  const [activeResearchIdx, setActiveResearchIdx] = useState<number>(0)
  const [activeCompetitorIdx, setActiveCompetitorIdx] = useState<number>(0)
  const [activeReqIdx, setActiveReqIdx] = useState<number>(0)

  // Progressive disclosure toggle for extended methodology/dimension/spec notes
  const [showNodeDetails, setShowNodeDetails] = useState<boolean>(false)

  // Refs for focus management & dynamic SVG gold path geometry calculation
  const networkStageRef = useRef<HTMLDivElement | null>(null)
  const nodeTriggerRefs = useRef<
    Record<UxDiscoveryNodeId, HTMLButtonElement | null>
  >({
    'ux-node-01': null,
    'ux-node-02': null,
    'ux-node-03': null,
    'ux-node-04': null,
    'ux-node-05': null,
  })
  const nodeAnchorRefs = useRef<
    Record<UxDiscoveryNodeId, HTMLSpanElement | null>
  >({
    'ux-node-01': null,
    'ux-node-02': null,
    'ux-node-03': null,
    'ux-node-04': null,
    'ux-node-05': null,
  })
  const expandedPanelHeadingRef = useRef<HTMLHeadingElement | null>(null)

  const [connectorGeometry, setConnectorGeometry] = useState<{
    width: number
    height: number
    primaryPath: string
    branchPaths: string[]
    points: { id: UxDiscoveryNodeId; x: number; y: number; isActive: boolean }[]
  }>({
    width: 1120,
    height: 180,
    primaryPath: '',
    branchPaths: [],
    points: [],
  })

  // Measure real node anchor coordinates so the continuous organic gold line
  // follows the actual layout in both compact and expanded states.
  const recalculateConnectorGeometry = useCallback(() => {
    const stageEl = networkStageRef.current
    if (!stageEl) return
    const stageRect = stageEl.getBoundingClientRect()
    if (stageRect.width <= 0 || stageRect.height <= 0) return

    const pts: {
      id: UxDiscoveryNodeId
      x: number
      y: number
      isActive: boolean
    }[] = []

    for (const id of UX_NODE_ORDER) {
      const anchorEl = nodeAnchorRefs.current[id]
      if (!anchorEl) continue
      const r = anchorEl.getBoundingClientRect()
      pts.push({
        id,
        x: Math.round((r.left + r.width / 2 - stageRect.left) * 10) / 10,
        y: Math.round((r.top + r.height / 2 - stageRect.top) * 10) / 10,
        isActive: id === expandedNodeId,
      })
    }

    if (pts.length < 2) return

    let primaryPath = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i]
      const next = pts[i + 1]
      const dx = next.x - curr.x
      const dy = next.y - curr.y
      const c1x = Math.round((curr.x + dx * 0.46) * 10) / 10
      const c1y = Math.round((curr.y + dy * 0.12) * 10) / 10
      const c2x = Math.round((curr.x + dx * 0.54) * 10) / 10
      const c2y = Math.round((next.y - dy * 0.12) * 10) / 10
      primaryPath += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${next.x} ${next.y}`
    }

    const branchPaths: string[] = []
    if (expandedNodeId) {
      const activePt = pts.find((p) => p.id === expandedNodeId)
      if (activePt) {
        for (const pt of pts) {
          if (pt.id === expandedNodeId) continue
          const dx = pt.x - activePt.x
          const dy = pt.y - activePt.y
          const c1x = Math.round((activePt.x + dx * 0.42) * 10) / 10
          const c1y = Math.round((activePt.y + dy * 0.18) * 10) / 10
          const c2x = Math.round((activePt.x + dx * 0.68) * 10) / 10
          const c2y = Math.round((pt.y - dy * 0.14) * 10) / 10
          branchPaths.push(
            `M ${activePt.x} ${activePt.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${pt.x} ${pt.y}`
          )
        }
      }
    }

    setConnectorGeometry({
      width: Math.round(stageRect.width),
      height: Math.round(stageRect.height),
      primaryPath,
      branchPaths,
      points: pts,
    })
  }, [expandedNodeId])

  useEffect(() => {
    recalculateConnectorGeometry()
    let rafId = 0
    const start = performance.now()
    const duration = prefersReducedMotion ? 40 : 420

    const tick = (now: number) => {
      recalculateConnectorGeometry()
      if (now - start < duration) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)

    const stageEl = networkStageRef.current
    if (!stageEl || typeof ResizeObserver === 'undefined') {
      return () => cancelAnimationFrame(rafId)
    }
    const ro = new ResizeObserver(() => {
      recalculateConnectorGeometry()
    })
    ro.observe(stageEl)
    window.addEventListener('resize', recalculateConnectorGeometry, {
      passive: true,
    })

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('resize', recalculateConnectorGeometry)
    }
  }, [
    expandedNodeId,
    activeScenarioIdx,
    activeResearchIdx,
    activeCompetitorIdx,
    activeReqIdx,
    showNodeDetails,
    isZh,
    prefersReducedMotion,
    recalculateConnectorGeometry,
  ])

  // Focus expanded node heading when a node expands
  useEffect(() => {
    if (!expandedNodeId) return
    const timer = window.setTimeout(() => {
      expandedPanelHeadingRef.current?.focus({ preventScroll: true })
    }, 50)
    return () => window.clearTimeout(timer)
  }, [expandedNodeId])

  // Escape key collapses the expanded UX node when no lightbox dialog is open
  useEffect(() => {
    if (!expandedNodeId) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.querySelector('.ls-lightbox-backdrop')) return
        e.preventDefault()
        const toFocus = expandedNodeId
        setExpandedNodeId(null)
        setShowNodeDetails(false)
        requestAnimationFrame(() => {
          nodeTriggerRefs.current[toFocus]?.focus({ preventScroll: true })
        })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expandedNodeId])

  const handleSelectNode = useCallback((nodeId: UxDiscoveryNodeId) => {
    setShowNodeDetails(false)
    setExpandedNodeId((prev) => {
      if (prev === nodeId) {
        requestAnimationFrame(() => {
          nodeTriggerRefs.current[nodeId]?.focus({ preventScroll: true })
        })
        return null
      }
      return nodeId
    })
  }, [])

  const handleCollapseNetwork = useCallback(() => {
    const prev = expandedNodeId
    setExpandedNodeId(null)
    setShowNodeDetails(false)
    if (prev) {
      requestAnimationFrame(() => {
        nodeTriggerRefs.current[prev]?.focus({ preventScroll: true })
      })
    }
  }, [expandedNodeId])

  // =========================================================================
  // FIVE CONCISE UX DISCOVERY NODES
  // =========================================================================
  const uxNodes: ReadonlyArray<UxDiscoveryNodeMeta> = isZh
    ? [
        {
          id: 'ux-node-01',
          number: '01',
          shortTitle: '项目初衷',
          headline: '项目初衷：让共同记忆不再淹没于日常聊天流',
          roleTag: '问题起源与定位',
          compactQuestion: '为什么日常聊天与通用相册无法承载两个人的共同记忆？',
          staggerClass: 'is-stagger-01',
        },
        {
          id: 'ux-node-02',
          number: '02',
          shortTitle: '目标用户',
          headline: '目标用户：四类真实双人使用情境 (JTBD)',
          roleTag: '4 类核心任务场景',
          compactQuestion: '伴侣在记录、回顾与规划时分别需要完成什么任务？',
          staggerClass: 'is-stagger-02',
        },
        {
          id: 'ux-node-03',
          number: '03',
          shortTitle: '用户研究',
          headline: '用户研究：公开评论挖掘与真实痛点合成',
          roleTag: '二手研究与评论挖掘',
          compactQuestion: '公开用户在相册、手记与情侣应用中常遇到哪些阻力？',
          staggerClass: 'is-stagger-03',
        },
        {
          id: 'ux-node-04',
          number: '04',
          shortTitle: '竞品与参考分析',
          headline: '竞品与参考分析：三款代表性产品交互对照',
          roleTag: '共享相簿 · 手记 · 微爱',
          compactQuestion: '现有照片共享、个人手记与情侣软件各自有哪些优劣？',
          staggerClass: 'is-stagger-04',
        },
        {
          id: 'ux-node-05',
          number: '05',
          shortTitle: '需求与问题定义',
          headline: '需求与问题定义：从核心需求到真实界面的决策链',
          roleTag: '需求 → 决策 → 实机界面',
          compactQuestion: '研究洞察如何转化为功能与隐私要求并落地为界面？',
          staggerClass: 'is-stagger-05',
        },
      ]
    : [
        {
          id: 'ux-node-01',
          number: '01',
          shortTitle: 'Project Purpose',
          headline: 'Project Purpose: Rescuing Shared Memories from Chat Feeds',
          roleTag: 'Origin & Product Goal',
          compactQuestion:
            'Why do everyday chat feeds and generic photo folders fail shared memories?',
          staggerClass: 'is-stagger-01',
        },
        {
          id: 'ux-node-02',
          number: '02',
          shortTitle: 'Target Users',
          headline: 'Target Users: Four Scenario-Based Jobs To Be Done',
          roleTag: '4 Usage Scenarios',
          compactQuestion:
            'What are two partners trying to accomplish when recording, rediscovering, and planning?',
          staggerClass: 'is-stagger-02',
        },
        {
          id: 'ux-node-03',
          number: '03',
          shortTitle: 'User Research',
          headline: 'User Research: Public Review Mining & Usage Insights',
          roleTag: 'Public Review Synthesis',
          compactQuestion:
            'What recurring friction do users report across shared albums, journals, and couple apps?',
          staggerClass: 'is-stagger-03',
        },
        {
          id: 'ux-node-04',
          number: '04',
          shortTitle: 'Competitive Analysis',
          headline: 'Competitive Analysis: Three Reference Product Exhibits',
          roleTag: 'Shared Albums · Journal · WeLove',
          compactQuestion:
            'What did we learn from Apple Shared Albums, Apple Journal, and WeLove?',
          staggerClass: 'is-stagger-04',
        },
        {
          id: 'ux-node-05',
          number: '05',
          shortTitle: 'Requirements & Problem Definition',
          headline: 'Requirements & Problem Definition: Need → Decision → UI',
          roleTag: 'Need → Decision → UI',
          compactQuestion:
            'How do core needs translate into requirements and actual product interfaces?',
          staggerClass: 'is-stagger-05',
        },
      ]

  // =========================================================================
  // NODE 02 DATA: TARGET USERS (Balanced Two-Column + Full-Width Module Bar)
  // =========================================================================
  const targetScenarios: ReadonlyArray<TargetUserScenarioItem> = isZh
    ? [
        {
          id: 'sc-01',
          code: '01 · 共同记录',
          tabTitle: '共同记录日常与旅行',
          scenarioTitle: '散步或旅行归来，两人用 1–2 分钟共同封存当晚记忆',
          evidenceBadge: '场景任务假设 (JTBD) · 双端已实装',
          userGoal:
            '将多张照片、真实发生日期、城市坐标与心情故事保存在同一个两人都可见的记忆单元内。',
          mainTask:
            '在手机或桌面上传封面与组图、选定事件日期并一键发布至 Our Story 共享空间。',
          contextDetail:
            '常见于周末散步或旅途中，通过桌面侧边表单或移动端六步全屏编辑器零阻力完成录入。',
          relevantModules: ['Moments 画廊', '移动端六步全屏编辑器', '共享空间同步'],
          slot: LOVE_STORY_ASSET_SPEC.iterations.desktopMemorySheet,
          mediaTitle: '记忆编辑器与 Moments 实时归档界面 (1440×900)',
          mediaCaption: '支持多图封面、真实发生日期、城市经纬度与故事同框录入。',
          mediaBadge: '实机界面 · 共同记录场景',
          outcomeLink: { archiveId: 'archive-05', iterationIdx: 2 },
          outcomeCta: '查看设计成果：双端记忆编辑器 →',
        },
        {
          id: 'sc-02',
          code: '02 · 时空重温',
          tabTitle: '跨时间与地理重温',
          scenarioTitle: '按“去年秋天”或“我们在布里斯班走过的河岸”检索回忆',
          evidenceBadge: '场景任务假设 (JTBD) · 核心视图已实装',
          userGoal:
            '既能按真实发生年份/日期顺畅回溯，也能在地球仪上按共同去过的城市聚合所有回忆。',
          mainTask:
            '在 Timeline 按真实事件日期浏览，或旋转 Memory Map 地球仪点击城市锚点打开记忆抽屉。',
          contextDetail:
            '城市级地球仪与时间轴联动已实装；更细粒度的街道级路线聚合处于原型阶段。',
          relevantModules: ['Timeline 编年时间轴', 'Memory Map 记忆地球仪'],
          slot: LOVE_STORY_ASSET_SPEC.experience.memoryMapGlobe,
          mediaTitle: 'Memory Map 正射投影地球仪与布里斯班抽屉',
          mediaCaption: '聚焦布里斯班坐标时，右侧即刻展开该城市关联的全部记忆卡片。',
          mediaBadge: '实机界面 · 空间重温场景',
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 2 },
          outcomeCta: '查看设计成果：记忆地图与时间轴展厅 →',
        },
        {
          id: 'sc-03',
          code: '03 · 隐私边界',
          tabTitle: '区分共享与二级私密记录',
          scenarioTitle: '日常浏览旅行相册时，保护高敏感纪念信件不被意外滑出',
          evidenceBadge: '场景任务假设 (JTBD) · 二级门禁已实装',
          userGoal:
            '明确区分“日常共享空间”与需要独立密码解锁的“二级私密归档（Private Archive）”。',
          mainTask:
            '通过账户抽屉确认当前共享空间状态；进入 Private Archive 时输入独立二级密码（10分钟自动重锁）。',
          contextDetail:
            '未解锁状态下不暴露任何私密记录数量、封面或标题，提供清晰的心理安全边界。',
          relevantModules: ['Private Archive 二级密码锁', 'Profile 空间切换抽屉'],
          slot: LOVE_STORY_ASSET_SPEC.experience.privateLock,
          mediaTitle: 'Private Archive 二级隐私密码门禁 (1440×900)',
          mediaCaption: '未解锁前零元数据泄露，保护伴侣间最私密的信件与记录。',
          mediaBadge: '实机界面 · 隐私门禁场景',
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 3 },
          outcomeCta: '查看设计成果：二级隐私锁与安全边界 →',
        },
        {
          id: 'sc-04',
          code: '04 · 未来规划',
          tabTitle: '共同规划未来行程与纪念日',
          scenarioTitle: '将过往回忆自然延伸至下一次同行计划与重要纪念日倒数',
          evidenceBadge: '场景任务假设 (JTBD) · 行程与倒数已实装',
          userGoal:
            '在同一个安静空间里筹备下一次旅行（起止日期、交通住宿、分日清单）并追踪纪念日。',
          mainTask:
            '在 Plan the Future 中建立多日行程卡片（Day 1..N），并在 Anniversary Countdown 查看天数。',
          contextDetail:
            '让档案馆不仅朝向过去，也承载两个人对未来的共同期盼。',
          relevantModules: ['Plan the Future 未来计划', 'Anniversary 纪念日倒数'],
          slot: LOVE_STORY_ASSET_SPEC.experience.futureItinerary,
          mediaTitle: 'Plan the Future 分日行程与倒计时详情',
          mediaCaption: '展示新西兰南岛秋日自驾计划的日期区间、交通备忘与每日安排。',
          mediaBadge: '实机界面 · 未来规划场景',
          outcomeLink: { archiveId: 'archive-02', moduleIndex: 4 },
          outcomeCta: '查看设计成果：未来计划信息架构 →',
        },
      ]
    : [
        {
          id: 'sc-01',
          code: '01 · JOINT CAPTURE',
          tabTitle: 'Jointly Recording Moments',
          scenarioTitle:
            'Two partners logging a shared walk or trip in under two minutes',
          evidenceBadge: 'Scenario Assumption (JTBD) · Live on Desktop & Mobile',
          userGoal:
            'Preserve multiple photos, true historical date, city coordinate, and story inside one shared record visible to both partners.',
          mainTask:
            'Upload cover and supporting photos, set the event date, and save directly into Our Story · Shared Space.',
          contextDetail:
            'Happens right after an evening walk or during travel—supported by a desktop side sheet and a 6-step fullscreen mobile composer.',
          relevantModules: [
            'Moments Library',
            'Mobile 6-Step Composer',
            'Shared Space Sync',
          ],
          slot: LOVE_STORY_ASSET_SPEC.iterations.desktopMemorySheet,
          mediaTitle: 'Memory Composer & Live Moments Library (1440×900)',
          mediaCaption:
            'Captures cover photos, historical event date, city coordinates, and story prose in one unified object.',
          mediaBadge: 'Authentic UI · Joint Capture',
          outcomeLink: { archiveId: 'archive-05', iterationIdx: 2 },
          outcomeCta: 'See the design response: Cross-Device Composer →',
        },
        {
          id: 'sc-02',
          code: '02 · REDISCOVERY',
          tabTitle: 'Rediscovering Across Time & Place',
          scenarioTitle:
            'Recalling shared history by season ("last autumn") or city ("Brisbane")',
          evidenceBadge: 'Scenario Assumption (JTBD) · Core Views Implemented',
          userGoal:
            'Move effortlessly between chronological milestone browsing and geographic city exploration.',
          mainTask:
            'Scan the event-date Timeline or rotate the orthographic Memory Map globe to open a city’s memory drawer.',
          contextDetail:
            'City-level globe pins and event-date Timeline linking are live; street-level route clustering remains a prototype direction.',
          relevantModules: ['Chronological Timeline', 'Orthographic Memory Map'],
          slot: LOVE_STORY_ASSET_SPEC.experience.memoryMapGlobe,
          mediaTitle: 'Interactive Memory Map Globe Focused on Brisbane',
          mediaCaption:
            'Selecting Brisbane on the globe opens all shared memories recorded in that city.',
          mediaBadge: 'Authentic UI · Spatial Rediscovery',
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 2 },
          outcomeCta: 'See the design response: Memory Map & Timeline →',
        },
        {
          id: 'sc-03',
          code: '03 · PRIVACY',
          tabTitle: 'Managing Shared & Private Boundaries',
          scenarioTitle:
            'Keeping sensitive letters behind a secondary lock while browsing albums',
          evidenceBadge: 'Scenario Assumption (JTBD) · Secondary Gate Implemented',
          userGoal:
            'Maintain a clear boundary between everyday shared albums and password-protected private keepsakes.',
          mainTask:
            'Confirm active space membership in the Profile drawer and unlock Private Archive via its secondary password gate.',
          contextDetail:
            'When locked, Private Archive exposes zero record counts, titles, or thumbnails and auto-locks after 10 minutes.',
          relevantModules: ['Private Archive Gate', 'Profile & Spaces Drawer'],
          slot: LOVE_STORY_ASSET_SPEC.experience.privateLock,
          mediaTitle: 'Private Archive Secondary Password Gate (1440×900)',
          mediaCaption:
            'Conceals all protected record counts and titles until unlocked with the privacy password.',
          mediaBadge: 'Authentic UI · Privacy Boundary',
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 3 },
          outcomeCta: 'See the design response: Private Archive Gate →',
        },
        {
          id: 'sc-04',
          code: '04 · FUTURE PLANS',
          tabTitle: 'Planning Future Trips & Rituals',
          scenarioTitle:
            'Extending the archive forward into upcoming journeys and anniversaries',
          evidenceBadge: 'Scenario Assumption (JTBD) · Itinerary & Countdown Live',
          userGoal:
            'Organize upcoming trips and recurring relationship milestones alongside past memories.',
          mainTask:
            'Create a multi-day itinerary (start/end dates, transport/stay notes, Day 1..N schedule) in Plan the Future.',
          contextDetail:
            'Connects past memories with future anticipation inside the same calm archival environment.',
          relevantModules: ['Plan the Future', 'Anniversary Countdown'],
          slot: LOVE_STORY_ASSET_SPEC.experience.futureItinerary,
          mediaTitle: 'Plan the Future — Multi-Day Itinerary View',
          mediaCaption:
            'Displays trip date range, derived countdown, logistics notes, and Day 1..N activities.',
          mediaBadge: 'Authentic UI · Future Planning',
          outcomeLink: { archiveId: 'archive-02', moduleIndex: 4 },
          outcomeCta: 'See the design response: Future Plans Architecture →',
        },
      ]

  // =========================================================================
  // NODE 03 DATA: USER RESEARCH
  // Balanced 3-Tier Editorial Structure:
  //   TOP: 4 compact selectable topics
  //   MIDDLE (2-Col): Screenshot Left | 1 Prominent Insight + Brief Explanation + Design Response Right
  //   BOTTOM (Full-Width): 4-Step Horizontal Flow (Public Feedback → UX Insight → Opportunity → Response)
  // =========================================================================
  const researchInsights: ReadonlyArray<SecondaryResearchInsightItem> = isZh
    ? [
        {
          id: 'res-01',
          code: '01 · 历史时序',
          tabTitle: '相簿补录乱序与故事缺失',
          prominentInsight:
            '伴侣记忆的基本单位是“一次完整经历”，而非按上传时间堆叠的照片文件。',
          briefExplanation:
            'Apple 社区用户反映向共享相簿补传旧旅行照片时，默认按“添加日期”排列常打乱时间线，且单图评论无法承载整段故事背景。',
          designResponseSummary:
            '构建以故事为单位的 Moments 画廊，并在 Timeline 中严格按真实发生日期（YYYY-MM-DD）排序，补录旧照自动归位。',
          sourceName: 'Apple Support Community #255929749 & Support 108314',
          sourceUrl: 'https://discussions.apple.com/thread/255929749',
          sourceDate: '2025.01 – 2026.10',
          evidenceOriginLabel: '次级评论挖掘 · 已核对 iOS 27',
          releaseCrossCheckNote:
            '2026 版本核验：iOS 27 (2026年10月文档) 已为共享相簿新增全分辨率与筛选排序，但底层仍为媒体文件流，不含多图故事单元或未来计划。',
          flowSteps: {
            publicFeedback: '补传旧照默认按“添加时间”排列易乱序，仅支持单图短评。',
            uxInsight: '伴侣按“一次旅行/约会事件”记忆往事，而非按文件名检索。',
            designOpportunity: '以“封面+组图+真实事件日+地点+正文”封装单条记忆。',
            loveStoryResponse: 'Timeline 严格按 `memory.date` 升序/降序合流呈现。',
          },
          slot: LOVE_STORY_ASSET_SPEC.iterations.chronologicalOrder,
          mediaTitle: '严格按真实事件日期 (YYYY-MM-DD) 排序的 Timeline',
          mediaCaption: '补录过往旅行记忆时自动归位至真实历史日期。',
          mediaBadge: '实机响应 · 严格事件时序',
          outcomeLink: { archiveId: 'archive-05', iterationIdx: 1 },
          outcomeCta: '查看设计成果：时间轴时序迭代 →',
        },
        {
          id: 'res-02',
          code: '02 · 双人共创',
          tabTitle: '个人手记缺乏原生双人空间',
          prominentInsight:
            '双人档案馆需要同时具备“个人手记的安静阅读感”与“原生双账号共同书写”。',
          briefExplanation:
            'Apple 社区与 Reddit 用户普遍赞赏 Apple Journal 的纯净多模态排版，但因缺乏“共享手记本”模式，伴侣只能退回共用备忘录（Notes）。',
          designResponseSummary:
            '设计 Our Story 双账号配对空间与 #20211E 原色记忆画框，让两位伴侣共同书写并沉浸阅读同一本记忆册。',
          sourceName: 'Apple Community #255384972 & Reddit r/digitaljournaling',
          sourceUrl: 'https://discussions.apple.com/thread/255384972',
          sourceDate: '2024.12 – 2025.01',
          evidenceOriginLabel: '次级社区挖掘 · 已核对 iOS 18–27',
          releaseCrossCheckNote:
            '2026 版本核验：截至 iOS 27 官方指南，Apple Journal 支持多手记本、Places 地图与打印导出，但仍绑定单一 Apple Account。',
          flowSteps: {
            publicFeedback: '喜爱 Apple Journal 质感，但呼吁增加类似共享相簿的双人模式。',
            uxInsight: '单人日记架构阻断了伴侣间的共同在场感与双向补充。',
            designOpportunity: '在 Web 端结合暗房展览画框（#20211E）与双人配对空间。',
            loveStoryResponse: '支持邀请码绑定双人空间，点击记忆即展开 #20211E 详情画框。',
          },
          slot: LOVE_STORY_ASSET_SPEC.experience.memoryDetail,
          mediaTitle: '双人共享的 #20211E 记忆详情画框',
          mediaCaption: '保留纸本手记般的安静排版，同时支持双账号配对共创。',
          mediaBadge: '实机响应 · 双人沉浸手记',
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 0 },
          outcomeCta: '查看设计成果：Moments 详情画框 →',
        },
        {
          id: 'res-03',
          code: '03 · 纯粹仪式',
          tabTitle: '情侣应用的仪式感与游戏化噪音',
          prominentInsight:
            '真正留存数年的情感资产是“共同记忆、纪念日与未来心愿”，而非打卡游戏与内购。',
          briefExplanation:
            '微爱（WeLove）长期评论印证了时光相册、纪念日与愿望清单的陪伴价值，但大量用户抱怨多图卡顿、补签卡充值与抽奖广告喧宾夺主。',
          designResponseSummary:
            '采用 Dark Archive (#10110F) 与 Paper & Ink (#F3EFE7) 双境美术系统，以零广告、零打卡惩罚的纯粹展廊呈现核心仪式。',
          sourceName: 'App Store 公开评论 — 微爱 WeLove (id544599560, v6.5.9)',
          sourceUrl:
            'https://apps.apple.com/cn/app/%E5%BE%AE%E7%88%B1-%E6%83%85%E4%BE%A3%E6%81%8B%E7%88%B1%E8%AE%B0%E5%BD%95-%E6%81%A9%E7%88%B1%E5%BF%83%E5%8A%A8%E6%97%A5%E5%B8%B8/id544599560',
          sourceDate: '2018.05 – 2026.10',
          evidenceOriginLabel: 'App Store 评论挖掘 · v6.5.9',
          releaseCrossCheckNote:
            '2026 版本核验：微爱持续更新至 v6.5.9 (2026年10月)，商店隐私与内购声明仍包含第三方广告追踪、抽奖箱及补签卡内购。',
          flowSteps: {
            publicFeedback: '肯定纪念日与相册的十年陪伴，但抱怨卡顿、补签卡充值与广告。',
            uxInsight: '游戏化每日打卡压力与商业弹窗会侵蚀回顾记忆时的宁静感。',
            designOpportunity: '提炼相册、纪念日倒数与未来计划三大仪式，剔除养成游戏。',
            loveStoryResponse: '在 Our Space 主页中整合记忆、时间轴、地球仪、纪念日与未来计划。',
          },
          slot: LOVE_STORY_ASSET_SPEC.architecture.hub,
          mediaTitle: 'Our Space 空间主页：零商业噪音的记忆与星群',
          mediaCaption: '只保留记忆画廊、编年时间轴、地球仪、未来计划与纪念日倒数。',
          mediaBadge: '实机响应 · 纯粹双境馆藏',
          outcomeLink: { archiveId: 'archive-04' },
          outcomeCta: '查看设计成果：双境视觉设计系统 →',
        },
        {
          id: 'res-04',
          code: '04 · 空间与双端',
          tabTitle: '空间可见性混淆与移动端录入阻力',
          prominentInsight:
            '双人工具的信任感建立在“明确的空间可见性反馈”与“顺手的手机录入表单”之上。',
          briefExplanation:
            '在开发期的真实双人自用中，我们发现“误在个人空间发记忆导致伴侣看不见”以及“手机端侧边抽屉过长遮挡保存按钮”两项实际痛点。',
          designResponseSummary:
            '实装 Profile 共享空间状态抽屉（明确标识 2 Members · CURRENT）与带底部固定保存栏的移动端六步全屏编辑器。',
          sourceName: 'LoveStory 真实双人使用与迭代日志 (FastAPI + SQLite)',
          sourceUrl: 'https://love-story-archive-production.up.railway.app',
          sourceDate: '2026.08 – 2026.11',
          evidenceOriginLabel: '一手开发自用观察 · 已实装修复',
          releaseCrossCheckNote:
            '方法论区分：本条直接源自项目开发期的双人真实使用日志（一手工程与可用性观察），前三条则为外部公开评论次级研究。',
          flowSteps: {
            publicFeedback: '双人实测中曾因空间状态不明导致新记忆对伴侣“不可见”。',
            uxInsight: '多空间架构必须提供持久可见的当前空间指示与移动端友好表单。',
            designOpportunity: '显式展示激活空间成员状态，并将移动端录入改为全屏分步折叠。',
            loveStoryResponse: '上线 CURRENT 空间状态抽屉与 390×844 移动端六步全屏编辑器。',
          },
          slot: LOVE_STORY_ASSET_SPEC.requirements['need-01'],
          mediaTitle: 'Our Story 共享空间状态抽屉与成员可见性确认',
          mediaCaption: '持久显示当前空间类型、成员人数与切换开关。',
          mediaBadge: '实机响应 · 空间同步与双端适配',
          outcomeLink: { archiveId: 'archive-05', iterationIdx: 0 },
          outcomeCta: '查看设计成果：三轮真实使用迭代 →',
        },
      ]
    : [
        {
          id: 'res-01',
          code: '01 · CHRONOLOGY',
          tabTitle: 'Shared Album Sorting & Story Gap',
          prominentInsight:
            'Partners remember shared history as unified story events, not isolated media filenames.',
          briefExplanation:
            'In Apple Support Communities, users backfilling older trip photos into Shared Albums report that default "Date Added" sorting scrambles chronology while comments attach only to single files.',
          designResponseSummary:
            'Built Moments around multi-photo story records and engineered Timeline to merge milestones and anniversaries strictly by historical event date (`YYYY-MM-DD`).',
          sourceName: 'Apple Support Community #255929749 & Support 108314',
          sourceUrl: 'https://discussions.apple.com/thread/255929749',
          sourceDate: 'Jan 2025 – Oct 2026',
          evidenceOriginLabel: 'Secondary Review Mining · Checked vs. iOS 27',
          releaseCrossCheckNote:
            '2026 Release Check: iOS 27 (Apple Support 108314, Oct 6, 2026) added full-resolution sharing and sorting filters to Shared Albums, but remains file-centric without unified multi-photo stories or future trip plans.',
          flowSteps: {
            publicFeedback:
              'Backfilled album photos default to "Date Added" order and only support per-file comments.',
            uxInsight:
              'Couples recall cohesive events (photos + date + place + prose), not raw image streams.',
            designOpportunity:
              'Anchor each record as a unified Memory object sorted by true event date (`YYYY-MM-DD`).',
            loveStoryResponse:
              'Moments groups photo sets under one story cover; Timeline sorts strictly by `memory.date`.',
          },
          slot: LOVE_STORY_ASSET_SPEC.iterations.chronologicalOrder,
          mediaTitle: 'LoveStory Event-Date Chronological Timeline (1440×900)',
          mediaCaption:
            'Backfilled travel memories settle into their true historical date (YYYY-MM-DD) automatically.',
          mediaBadge: 'Implemented UI · Event Chronology',
          outcomeLink: { archiveId: 'archive-05', iterationIdx: 1 },
          outcomeCta: 'See the design response: Timeline Chronology Iteration →',
        },
        {
          id: 'res-02',
          code: '02 · CO-AUTHORING',
          tabTitle: 'Single-User Journals Lack Couple Spaces',
          prominentInsight:
            'A relationship archive needs both the calm focus of a personal journal and native two-partner co-authoring.',
          briefExplanation:
            'Across Apple Community and Reddit threads, couples admire Apple Journal’s clean multimedia entries and prompts, but highlight the lack of a shared couple journal—falling back to shared Apple Notes.',
          designResponseSummary:
            'Paired a quiet #20211E photo-true detail mount with native two-account space linking (`Our Story · Shared Space`) on the web.',
          sourceName: 'Apple Community #255384972 & Reddit r/digitaljournaling',
          sourceUrl: 'https://discussions.apple.com/thread/255384972',
          sourceDate: 'Dec 2024 – Jan 2025',
          evidenceOriginLabel: 'Secondary Forum Mining · Checked vs. iOS 27',
          releaseCrossCheckNote:
            '2026 Release Check: Apple Journal (iPhone User Guide, Oct 2026) supports multiple journals, Places map view, and PDF export, but entries remain tied to a single Apple Account.',
          flowSteps: {
            publicFeedback:
              'Couples want Apple Journal’s calm multi-modal layout with Shared Album-style collaboration.',
            uxInsight:
              'Single-account diaries isolate memories that were experienced by two people together.',
            designOpportunity:
              'Combine book-like editorial framing with native two-account invitation pairing.',
            loveStoryResponse:
              'Engineered `Our Story · Shared Space` co-authoring inside a #20211E exhibition frame.',
          },
          slot: LOVE_STORY_ASSET_SPEC.experience.memoryDetail,
          mediaTitle: 'Opened Memory Archive Frame (#20211E Mount)',
          mediaCaption:
            'Combines a quiet, book-like reading mount with two-partner shared space authorship.',
          mediaBadge: 'Implemented UI · Shared Editorial Frame',
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 0 },
          outcomeCta: 'See the design response: Moments Detail Frame →',
        },
        {
          id: 'res-03',
          code: '03 · CALM RITUALS',
          tabTitle: 'Couple Rituals vs. Gamified Clutter',
          prominentInsight:
            'Couples stay for years for shared albums, anniversaries, and wishlists—not virtual-pet streaks or ads.',
          briefExplanation:
            'Long-term WeLove (微爱) reviews validate strong attachment to Time Album, Anniversaries, and Couple Wishes, while criticizing photo lag, paid streak-recovery cards (补签卡), and ad clutter.',
          designResponseSummary:
            'Preserved the core ritual triad (Memories, Anniversaries, Future Plans) inside an ad-free Dark Archive (#10110F) and Paper & Ink (#F3EFE7) gallery.',
          sourceName: 'App Store Reviews — 微爱 WeLove (id544599560, v6.5.9)',
          sourceUrl:
            'https://apps.apple.com/cn/app/%E5%BE%AE%E7%88%B1-%E6%83%85%E4%BE%A3%E6%81%8B%E7%88%B1%E8%AE%B0%E5%BD%95-%E6%81%A9%E7%88%B1%E5%BF%83%E5%8A%A8%E6%97%A5%E5%B8%B8/id544599560',
          sourceDate: 'May 2018 – Oct 2026',
          evidenceOriginLabel: 'Public App Store Mining · Checked v6.5.9',
          releaseCrossCheckNote:
            '2026 Release Check: WeLove v6.5.9 (Oct 18, 2026) remains actively maintained, with App Store disclosures continuing to list third-party ad tracking, loot boxes, and streak top-ups.',
          flowSteps: {
            publicFeedback:
              '1,000+ day users love milestone albums & wishes, but dislike photo lag and paid streak cards.',
            uxInsight:
              'Gamified check-in pressure and commercial overlays erode the calm trust of a memory archive.',
            designOpportunity:
              'Keep the three enduring couple rituals while stripping away mini-games and ad noise.',
            loveStoryResponse:
              'Built an ad-free spatial hub uniting Moments, Timeline, Globe, Countdowns, and Future Plans.',
          },
          slot: LOVE_STORY_ASSET_SPEC.architecture.hub,
          mediaTitle: 'LoveStory Our Space Hub — Rituals Without Clutter',
          mediaCaption:
            'Focuses exclusively on shared memories, timeline arcs, city coordinates, future plans, and countdowns.',
          mediaBadge: 'Implemented UI · Distraction-Free Hub',
          outcomeLink: { archiveId: 'archive-04' },
          outcomeCta: 'See the design response: Dual-Surface Design System →',
        },
        {
          id: 'res-04',
          code: '04 · VISIBILITY & MOBILE',
          tabTitle: 'Space Visibility & Mobile Form Ergonomics',
          prominentInsight:
            'Emotional trust in a shared archive requires explicit space-visibility cues and thumb-friendly mobile capture.',
          briefExplanation:
            'During our firsthand two-person usage, entries saved inside a personal space by mistake appeared "missing" to the partner, and desktop-style sidebars cramped mobile editing.',
          designResponseSummary:
            'Added persistent `Our Story · Shared Space (2 MEMBERS · CURRENT)` status cues in the Profile drawer and refactored mobile capture into a 6-step fullscreen composer.',
          sourceName: 'LoveStory Firsthand Two-Person Usage & Iteration Logs',
          sourceUrl: 'https://love-story-archive-production.up.railway.app',
          sourceDate: 'Aug – Nov 2026',
          evidenceOriginLabel: 'Firsthand Dogfooding Log · Implemented Fix',
          releaseCrossCheckNote:
            'Provenance Distinction: This insight comes directly from our firsthand two-person dogfooding logs during development, whereas Insights 01–03 synthesize external secondary review research.',
          flowSteps: {
            publicFeedback:
              'Real usage revealed "missing" partner memories when accidentally posted in Personal Space.',
            uxInsight:
              'Multi-space apps need unmistakable active-space indicators and mobile-native form ergonomics.',
            designOpportunity:
              'Surface active space membership and replace cramped mobile sidebars with a fullscreen form.',
            loveStoryResponse:
              'Shipped the Shared Space status drawer and 6-section fullscreen mobile composer (`390×844`).',
          },
          slot: LOVE_STORY_ASSET_SPEC.requirements['need-01'],
          mediaTitle: 'Shared Space Membership & Visibility Drawer (1440×900)',
          mediaCaption:
            'Explicitly confirms "Our Story · Shared Space (2 MEMBERS · CURRENT)" and instant space switching.',
          mediaBadge: 'Implemented UI · Space Visibility Fix',
          outcomeLink: { archiveId: 'archive-05', iterationIdx: 0 },
          outcomeCta: 'See the design response: Built & Beyond Iterations →',
        },
      ]

  // =========================================================================
  // NODE 04 DATA: COMPETITIVE ANALYSIS
  // =========================================================================
  const competitiveRefs: ReadonlyArray<CompetitiveReferenceItem> = isZh
    ? [
        {
          id: 'apple-shared-albums',
          code: '01 · APPLE 共享相簿',
          name: 'Apple Photos — 共享相簿',
          categoryBadge: '系统级媒体共享参考',
          officialUrl: 'https://support.apple.com/en-us/108314',
          sourceNote:
            '来源：Apple Support 108314（2026年10月6日更新 · iOS 27 新增全分辨率共享与筛选排序；历史乱序反馈见 #255929749）',
          coreTakeaway:
            '借鉴其低门槛多人同步机制，但将核心单元从“孤立照片文件”升维为“带真实发生日期、城市坐标与正文的双人记忆故事”。',
          verifiedStrength:
            '系统级 iCloud 共享，支持多人上传、单图评论与表情回应，iOS 27 起支持原图分辨率与链接邀请。',
          keyGapVsLoveStory:
            '以单张媒体文件为中心，缺乏多图合并叙事、双人纪念日倒数、未来旅行计划及二级独立隐私密码库。',
          loveStoryDecision:
            'LoveStory 设计响应：以“封面+组图+YYYY-MM-DD+城市坐标+正文”封装单条记忆，并与编年时间轴和地球仪双向联动。',
          slot: LOVE_STORY_ASSET_SPEC.discovery.appleSharedAlbums,
          mediaTitle: '视觉对照 01：Apple 共享相簿 vs. LoveStory Moments 画廊',
          mediaCaption:
            '左侧为 Apple 共享相簿文件流结构（含 iOS 27 更新说明），右侧为 LoveStory Moments 画廊实机界面。',
          dimensions: [
            {
              dimension: '记忆采集',
              supportState: '支持 (文件级)',
              observation: '批量上传照片/视频，iOS 27 支持全分辨率，无心情/天气元数据。',
            },
            {
              dimension: '双人协作',
              supportState: '支持 (多人上传)',
              observation: '受邀成员均可上传媒体与发表单图评论。',
            },
            {
              dimension: '叙事结构',
              supportState: '受限 (单图评论)',
              observation: '无长文标题、故事正文与多图事件封装。',
            },
            {
              dimension: '时空重温',
              supportState: '部分支持 (iOS 27)',
              observation: 'iOS 27 改进排序，但无双人地球仪与专属编年时间轴。',
            },
            {
              dimension: '隐私边界',
              supportState: '支持 (邀请制)',
              observation: '所有者可控权限，但相簿内无二级密码保险库。',
            },
            {
              dimension: '伴侣仪式',
              supportState: '通用工具',
              observation: '面向家庭与朋友群组，无双人专属语境。',
            },
            {
              dimension: '未来规划',
              supportState: '不支持',
              observation: '仅存储过往照片，不含未来行程单或纪念日倒数。',
            },
          ],
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 0 },
          outcomeCta: '查看设计成果：Moments 记忆画廊 →',
        },
        {
          id: 'apple-journal',
          code: '02 · APPLE 手记',
          name: 'Apple Journal (手记)',
          categoryBadge: '个人反思手记参考',
          officialUrl:
            'https://support.apple.com/en-ca/guide/iphone/iph0e5ca7dd3/ios',
          sourceNote:
            '来源：Apple Support iPhone User Guide (iOS 17–27 官方指南 · 支持 Places 地图与 Face ID 锁；共享诉求见 #255384972)',
          coreTakeaway:
            '吸收其“照片+地点+心境+正文”同框的克制书写体验与二级锁理念，同时突破其“单人 Apple 账号”限制。',
          verifiedStrength:
            '设备端智能写作引导，支持照片、地点、音频与心理状态（State of Mind）混排，配备 Places 地图与 Face ID 锁定。',
          keyGapVsLoveStory:
            '严格绑定个人单一 iCloud 账号，不支持两位伴侣实时共享同一手记本或共同规划未来旅行。',
          loveStoryDecision:
            'LoveStory 设计响应：沿用安静的衬线体故事排版与二级隐私门禁（Private Archive），并在底层支持双账号实时配对同步。',
          slot: LOVE_STORY_ASSET_SPEC.discovery.appleJournal,
          mediaTitle: '视觉对照 02：Apple Journal vs. LoveStory #20211E 详情画框',
          mediaCaption:
            '左侧为 Apple Journal 单人多模态条目，右侧为 LoveStory 支持双人共创的 #20211E 详情画框。',
          dimensions: [
            {
              dimension: '记忆采集',
              supportState: '强支持 (多模态)',
              observation: '图文、录音、地点与心理状态同框录入。',
            },
            {
              dimension: '双人协作',
              supportState: '不支持 (单账号)',
              observation: '仅限个人 iCloud 账号使用，无原生双人共享空间。',
            },
            {
              dimension: '叙事结构',
              supportState: '强支持 (日记卡)',
              observation: '排版安静克制，支持多手记本与 PDF 导出。',
            },
            {
              dimension: '时空重温',
              supportState: '支持 (日历+地图)',
              observation: '支持按日历日期与 Places 地图检索个人条目。',
            },
            {
              dimension: '隐私边界',
              supportState: '强支持 (Face ID)',
              observation: '内置生物识别与密码锁定保护。',
            },
            {
              dimension: '伴侣仪式',
              supportState: '个人正念',
              observation: '定位于个人心理健康与日常自我反思。',
            },
            {
              dimension: '未来规划',
              supportState: '不支持',
              observation: '专注过往与当下反思，无未来行程或双人纪念日。',
            },
          ],
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 3 },
          outcomeCta: '查看设计成果：二级隐私锁与移动端编辑器 →',
        },
        {
          id: 'welove',
          code: '03 · 微爱 WELOVE',
          name: '微爱 (WeLove)',
          categoryBadge: '专用情侣应用参考',
          officialUrl:
            'https://apps.apple.com/cn/app/%E5%BE%AE%E7%88%B1-%E6%83%85%E4%BE%A3%E6%81%8B%E7%88%B1%E8%AE%B0%E5%BD%95-%E6%81%A9%E7%88%B1%E5%BF%83%E5%8A%A8%E6%97%A5%E5%B8%B8/id544599560',
          sourceNote:
            '来源：App Store 微爱官方页面（id544599560 · 当前版本 v6.5.9，2026年10月18日更新；评论涵盖 2018–2026 年长期反馈）',
          coreTakeaway:
            '验证了“双人绑定、纪念日倒数、共同愿望清单”的长周期情感价值，但 LoveStory 彻底剔除了养成游戏、补签卡内购与广告噪音。',
          verifiedStrength:
            '1v1 伴侣绑定，内置【时光相册】、【纪念日】、【情侣愿望】与【未来情书】，陪伴大量伴侣超 1000 天。',
          keyGapVsLoveStory:
            '叠加爱情树、农场、家园装扮、补签卡/钻石内购与第三方广告追踪，界面较喧哗且无全球交互记忆地图。',
          loveStoryDecision:
            'LoveStory 设计响应：保留时光记忆、纪念日倒数与未来计划三大情感支柱，置于零广告的 Dark Archive / Paper & Ink 展馆中。',
          slot: LOVE_STORY_ASSET_SPEC.discovery.weLove,
          mediaTitle: '视觉对照 03：微爱 WeLove vs. LoveStory 纪念日与未来计划',
          mediaCaption:
            '左侧剖析微爱“核心仪式 + 游戏化内购层”结构，右侧为 LoveStory 纯粹克制的纪念日与未来计划界面。',
          dimensions: [
            {
              dimension: '记忆采集',
              supportState: '支持 (时光相册)',
              observation: '支持照片与日常动态记录，历史评论反映多图易卡顿。',
            },
            {
              dimension: '双人协作',
              supportState: '强支持 (1v1)',
              observation: '专为两位伴侣设计的双向互动空间。',
            },
            {
              dimension: '叙事结构',
              supportState: '部分支持 (动态流)',
              observation: '偏向短动态与打卡，缺乏展览级长文画框。',
            },
            {
              dimension: '时空重温',
              supportState: '部分支持 (时间点)',
              observation: '按时间点划分相册，无正射投影全球记忆地球仪。',
            },
            {
              dimension: '隐私边界',
              supportState: '含广告追踪声明',
              observation: '1v1 私密空间，但商店隐私标签声明收集数据用于第三方广告。',
            },
            {
              dimension: '伴侣仪式',
              supportState: '强支持 (游戏化)',
              observation: '纪念日与愿望清单仪式感强，但与补签卡充值和农场混杂。',
            },
            {
              dimension: '未来规划',
              supportState: '支持 (情侣愿望)',
              observation: '直接启发了 LoveStory 的 Future Plans 与 Countdown 模块。',
            },
          ],
          outcomeLink: { archiveId: 'archive-02', moduleIndex: 5 },
          outcomeCta: '查看设计成果：纪念日与未来计划架构 →',
        },
      ]
    : [
        {
          id: 'apple-shared-albums',
          code: '01 · SHARED ALBUMS',
          name: 'Apple Photos — Shared Albums',
          categoryBadge: 'System Shared Media Reference',
          officialUrl: 'https://support.apple.com/en-us/108314',
          sourceNote:
            'Source: Apple Support 108314 (Updated Oct 6, 2026 for iOS 27 full-res & sorting; historical sorting feedback in Thread #255929749)',
          coreTakeaway:
            'Learned from Apple’s effortless multi-contributor pooling, while elevating the core unit from isolated image files into unified multi-photo story entries.',
          verifiedStrength:
            'Frictionless iCloud photo/video pooling with participant invites, per-item comments, and iOS 27 full-resolution sharing and filters.',
          keyGapVsLoveStory:
            'File-centric rather than story-centric: comments attach to single files, with no multi-photo story prose, future trip itineraries, or secondary privacy vault.',
          loveStoryDecision:
            'LoveStory Takeaway: Group photos, historical event date (YYYY-MM-DD), city coordinates, and story prose into one Memory object linked to Timeline and Memory Map.',
          slot: LOVE_STORY_ASSET_SPEC.discovery.appleSharedAlbums,
          mediaTitle:
            'Comparative Exhibit 01: Apple Shared Albums vs. LoveStory Moments',
          mediaCaption:
            'Contrasts Apple Shared Albums’ media-file stream (left, noting iOS 27 updates) with LoveStory’s story-centric Moments Library (right).',
          dimensions: [
            {
              dimension: 'Capturing Memories',
              supportState: 'Supported (File Level)',
              observation: 'Batch photo/video uploads; iOS 27 adds full-res sharing.',
            },
            {
              dimension: 'Shared Collaboration',
              supportState: 'Supported (Multi-User)',
              observation: 'Participants add media, per-photo comments, and emoji reactions.',
            },
            {
              dimension: 'Narrative Structure',
              supportState: 'Limited (Per-File Comment)',
              observation: 'No unified multi-photo story card or long-form prose.',
            },
            {
              dimension: 'Time & Place Rediscovery',
              supportState: 'Partial (iOS 27 Filters)',
              observation: 'iOS 27 improves sorting but lacks a dedicated couple timeline or globe.',
            },
            {
              dimension: 'Privacy Boundaries',
              supportState: 'Supported (Invite List)',
              observation: 'Participant access controls, but no secondary in-album password lock.',
            },
            {
              dimension: 'Relationship Rituals',
              supportState: 'General Utility',
              observation: 'Built for general family/group sharing rather than couples.',
            },
            {
              dimension: 'Future Planning',
              supportState: 'Not Supported',
              observation: 'Stores past media only; no trip itineraries or countdowns.',
            },
          ],
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 0 },
          outcomeCta: 'See the design response: Moments Library & Detail →',
        },
        {
          id: 'apple-journal',
          code: '02 · APPLE JOURNAL',
          name: 'Apple Journal (iPhone / iOS)',
          categoryBadge: 'Personal Reflective Journal Reference',
          officialUrl:
            'https://support.apple.com/en-ca/guide/iphone/iph0e5ca7dd3/ios',
          sourceNote:
            'Source: Apple Support iPhone User Guide (iOS 17–27 · Current features include Places map & Face ID lock; shared journal requests in Thread #255384972)',
          coreTakeaway:
            'Adopted Apple Journal’s calm multi-modal entry structure and biometric lock concept while transforming the architecture from single-user to a paired two-partner space.',
          verifiedStrength:
            'Calm writing canvas combining photos, locations, audio, and State of Mind with Calendar/Places browsing and Face ID protection.',
          keyGapVsLoveStory:
            'Strictly personal to one Apple Account—no native two-partner shared journal space, collaborative editing, or shared future plans.',
          loveStoryDecision:
            'LoveStory Takeaway: Preserve the quiet #20211E exhibition reading frame and secondary privacy lock while enabling two linked accounts to co-author `Our Story`.',
          slot: LOVE_STORY_ASSET_SPEC.discovery.appleJournal,
          mediaTitle:
            'Comparative Exhibit 02: Apple Journal vs. LoveStory Detail Frame',
          mediaCaption:
            'Contrasts Apple Journal’s single-user reflective entry (left) with LoveStory’s shared #20211E Memory Detail frame (right).',
          dimensions: [
            {
              dimension: 'Capturing Memories',
              supportState: 'Strong (Multi-Modal)',
              observation: 'Photos, audio, places, State of Mind, and smart prompts.',
            },
            {
              dimension: 'Shared Collaboration',
              supportState: 'Not Supported (Single User)',
              observation: 'Tied to one personal Apple Account; no shared couple space.',
            },
            {
              dimension: 'Narrative Structure',
              supportState: 'Strong (Editorial Cards)',
              observation: 'Clean date-stamped entries with multiple journals and PDF export.',
            },
            {
              dimension: 'Time & Place Rediscovery',
              supportState: 'Supported (Calendar + Places)',
              observation: 'Browses personal entries by Calendar date or Places map.',
            },
            {
              dimension: 'Privacy Boundaries',
              supportState: 'Strong (Face ID / Passcode)',
              observation: 'Device-level biometric and passcode lock.',
            },
            {
              dimension: 'Relationship Rituals',
              supportState: 'Individual Wellbeing',
              observation: 'Focused on personal reflection rather than couple rituals.',
            },
            {
              dimension: 'Future Planning',
              supportState: 'Not Supported',
              observation: 'Logs past/present reflections; no shared future itineraries.',
            },
          ],
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 3 },
          outcomeCta: 'See the design response: Private Lock & Mobile Composer →',
        },
        {
          id: 'welove',
          code: '03 · 微爱 WELOVE',
          name: '微爱 (WeLove)',
          categoryBadge: 'Dedicated Couple App Reference',
          officialUrl:
            'https://apps.apple.com/cn/app/%E5%BE%AE%E7%88%B1-%E6%83%85%E4%BE%A3%E6%81%8B%E7%88%B1%E8%AE%B0%E5%BD%95-%E6%81%A9%E7%88%B1%E5%BF%83%E5%8A%A8%E6%97%A5%E5%B8%B8/id544599560',
          sourceNote:
            'Source: Apple App Store Listing (id544599560 · Current v6.5.9 updated Oct 18, 2026; public reviews span 2018–2026 long-term couple usage)',
          coreTakeaway:
            'Confirmed the lasting emotional value of 1-on-1 partner binding, anniversary countdowns, and shared wishlists—while stripping away virtual-pet games, streak paywalls, and ad clutter.',
          verifiedStrength:
            '1-on-1 partner binding with Time Album (时光相册), Anniversaries (纪念日), and Couple Wishes (情侣愿望) that retain couples for 1,000+ days.',
          keyGapVsLoveStory:
            'Surrounds memories with virtual pet/house/farm mini-games, paid streak-recovery cards (补签卡), loot-box ads, and third-party ad tracking.',
          loveStoryDecision:
            'LoveStory Takeaway: Distill the core ritual triad (Memories, Anniversaries, Future Plans) into an ad-free, gallery-grade Dark Archive & Paper & Ink experience.',
          slot: LOVE_STORY_ASSET_SPEC.discovery.weLove,
          mediaTitle:
            'Comparative Exhibit 03: 微爱 (WeLove) vs. LoveStory Ritual Modules',
          mediaCaption:
            'Contrasts WeLove’s gamified commercial surface (left) with LoveStory’s calm Anniversary & Future Plans view (right).',
          dimensions: [
            {
              dimension: 'Capturing Memories',
              supportState: 'Supported (Time Album)',
              observation: 'Couple photo uploads and check-ins; reviews note lag on large sets.',
            },
            {
              dimension: 'Shared Collaboration',
              supportState: 'Strong (1-on-1 Pairing)',
              observation: 'Purpose-built for two linked partners.',
            },
            {
              dimension: 'Narrative Structure',
              supportState: 'Partial (Social Feed Style)',
              observation: 'Short check-ins rather than long-form exhibition frames.',
            },
            {
              dimension: 'Time & Place Rediscovery',
              supportState: 'Partial (Time Milestones)',
              observation: 'Time-grouped album, but lacks an interactive global Memory Map.',
            },
            {
              dimension: 'Privacy Boundaries',
              supportState: 'Partial (Ad Tracking Disclosed)',
              observation: '1v1 space, but App Store privacy label discloses third-party ad data.',
            },
            {
              dimension: 'Relationship Rituals',
              supportState: 'Strong (Heavily Gamified)',
              observation: 'Anniversaries mixed with virtual pets, farm games, and paid streak cards.',
            },
            {
              dimension: 'Future Planning',
              supportState: 'Supported (100 Wishes)',
              observation: 'Anniversaries and Couple Wishes directly inspired LoveStory’s modules.',
            },
          ],
          outcomeLink: { archiveId: 'archive-02', moduleIndex: 5 },
          outcomeCta: 'See the design response: Countdown & Future Plans IA →',
        },
      ]

  // =========================================================================
  // NODE 05 DATA: REQUIREMENTS & PROBLEM DEFINITION
  // Balanced 3-Tier Structure:
  //   TOP: 4 selectable requirements
  //   MIDDLE (2-Col): Screenshot Left | Headline + Core Problem + Design Response Right
  //   BOTTOM (Full-Width): 4-Column Horizontal Chain (User Need → Requirement → Decision → Actual UI)
  // =========================================================================
  const requirementSyntheses: ReadonlyArray<RequirementSynthesisItem> = isZh
    ? [
        {
          id: 'req-syn-01',
          number: '01',
          tabTitle: '01 · 共享空间与可见性',
          headline: '双人配对与当前空间状态的显式确认',
          coreSummary:
            '在多空间架构下，两位伴侣绑定账号后必须一眼确认当前所处的是“双人共享空间”还是“个人空间”，防止新记录误入个人空间。',
          designResponseSummary:
            '实装 Profile & Spaces 状态抽屉，持久显示 `Our Story · Shared Space (2 MEMBERS · CURRENT)` 激活徽章与零刷新空间切换。',
          evidenceOriginBadge: '一手使用日志修复',
          implementationBadge: '已实装 (FastAPI + SQLite)',
          chainSteps: {
            userNeed: '绑定账号后立即确认当前处于哪个空间、哪些记录对伴侣可见。',
            requirement: '提供配对码机制、持久可见的空间成员状态与一键空间切换。',
            designDecision: '在账户抽屉顶部高亮显示 CURRENT 共享空间卡片与成员数。',
            actualInterface: 'Profile 抽屉：展示 Our Story (2 Members) 与切换按钮。',
          },
          detailedSpecs: {
            functional: '支持账号注册登录、配对码生成/接受、多空间切换与共享记忆实时同步。',
            usability: '在账户抽屉顶部高亮显示 CURRENT 激活徽章与成员数量（2 MEMBERS）。',
            privacy: '个人空间（My Space）与共享空间（Our Story）在后端查询层严格隔离。',
          },
          slot: LOVE_STORY_ASSET_SPEC.requirements['need-01'],
          mediaTitle: '实机界面 01：共享空间状态与成员配对抽屉',
          mediaCaption:
            '清晰显示 Our Story · Shared Space (2 MEMBERS · CURRENT) 与空间切换控件。',
          mediaBadge: '实机界面 · 需求 01',
          outcomeLink: { archiveId: 'archive-05', iterationIdx: 0 },
          outcomeCta: '查看设计成果：共享空间同步迭代 →',
        },
        {
          id: 'req-syn-02',
          number: '02',
          tabTitle: '02 · 时间与地理双维检索',
          headline: '同一记忆在画廊、编年时间轴与地球仪间的互通',
          coreSummary:
            '伴侣既按时间（“去年秋天”）也按地点（“布里斯班河岸”）检索回忆，单一平铺网格无法同时满足这两种心理模型。',
          designResponseSummary:
            '以单一记忆数据源驱动按月画廊、按真实事件日期（YYYY-MM-DD）排序的 Timeline 与正射投影地球仪，坐标选填不造假。',
          evidenceOriginBadge: '次级研究 + IA 合成',
          implementationBadge: '核心视图已实装',
          chainSteps: {
            userNeed: '按真实发生日期与旅行城市两个维度自然重温共同经历。',
            requirement: '打通画廊、事件日期时间轴（YYYY-MM-DD）与正射地球仪坐标。',
            designDecision: '允许坐标选填（绝不伪造图钉），详情页地点标签直达地球仪。',
            actualInterface: 'Our Space 主页：金色时间轴弧线与地球仪城市锚点实时联动。',
          },
          detailedSpecs: {
            functional: 'Moments、Timeline 与 Memory Map 共享统一的日期、城市经纬度与故事元数据。',
            usability: '悬停或点击时间轴节点即浮现预览卡并连接至地球仪城市坐标。',
            privacy: '仅存储城市/地标级坐标，零第三方广告位置追踪。',
          },
          slot: LOVE_STORY_ASSET_SPEC.requirements['need-02'],
          mediaTitle: '实机界面 02：时间轴曲线与正射投影地球仪联动',
          mediaCaption: '选中时间轴节点时浮现记忆预览卡并与下方地球仪城市坐标相连。',
          mediaBadge: '实机界面 · 需求 02',
          outcomeLink: { archiveId: 'archive-02', moduleIndex: 2 },
          outcomeCta: '查看设计成果：连接记忆脉络 (IA) →',
        },
        {
          id: 'req-syn-03',
          number: '03',
          tabTitle: '03 · 二级隐私密码门禁',
          headline: '零元数据泄露的二级私密归档保护',
          coreSummary:
            '日常分享旅行相册时，需要将高度私密的信件与心事隔离在第二重密码门禁之后，避免日常浏览误触曝光。',
          designResponseSummary:
            '设立独立的 Private Archive 模块，未解锁页面隐藏所有条目数量与标题，并支持 10 分钟无操作自动超时重锁。',
          evidenceOriginBadge: '隐私边界设计假设',
          implementationBadge: '门禁已实装 · 权限迭代中',
          chainSteps: {
            userNeed: '将日常共享相册与高敏感私密信件明确隔离。',
            requirement: '独立二级密码验证、10分钟超时自动重锁与未解锁零数据外泄。',
            designDecision: '未解锁门廊隐藏一切条目计数与缩略图，顶部设一键 Lock 按钮。',
            actualInterface: 'Private Archive 门禁：安静克制的暗色密码门廊视图。',
          },
          detailedSpecs: {
            functional: '独立于登录态的二级密码验证接口、10 分钟自动超时清理与手动锁定。',
            usability: '解锁状态在顶部导航显示明确标识，随时可一键恢复锁定。',
            privacy: '未解锁状态下前端与接口均不暴露 `privacyMode = private` 的条目计数。',
          },
          slot: LOVE_STORY_ASSET_SPEC.requirements['need-03'],
          mediaTitle: '实机界面 03：Private Archive 二级隐私密码门禁',
          mediaCaption: '未解锁前不展示任何私密记录数量或封面缩略图。',
          mediaBadge: '实机界面 · 需求 03',
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 3 },
          outcomeCta: '查看设计成果：私密归档门禁展厅 →',
        },
        {
          id: 'req-syn-04',
          number: '04',
          tabTitle: '04 · 未来计划与移动端录入',
          headline: '分日同行计划与六步全屏移动端记忆编辑器',
          coreSummary:
            '伴侣出门在外随时用手机记录当下，同时也希望在同一个空间里共同筹备下一次旅行与重要纪念日。',
          designResponseSummary:
            '构建支持起止日期与 Day 1..N 清单的 Plan the Future 模块，并将移动端录入重构为带底部固定保存栏的六步折叠全屏表单。',
          evidenceOriginBadge: '仪式参考 + 移动端重构',
          implementationBadge: '移动端与行程视图已实装',
          chainSteps: {
            userNeed: '随时在手机上零阻力记录当下，并共同规划未来旅行行程。',
            requirement: '提供多日行程规划，并消除手机端长侧边栏表单的滚动迷失。',
            designDecision: '移动端拆分为六步可折叠全屏表单（固定底部保存栏）。',
            actualInterface: 'Plan the Future 分日行程详情 + 390×844 移动端全屏编辑器。',
          },
          detailedSpecs: {
            functional: '自动计算行程天数与倒计时；移动端与桌面端共享完整记忆字段。',
            usability: '移动端固定底部 Cancel / Save Memory 主操作栏，消除滚动迷失。',
            privacy: '保存前显式确认是否加入 Timeline 及 Privacy 级别（Standard / Private）。',
          },
          slot: LOVE_STORY_ASSET_SPEC.requirements['need-04'],
          mediaTitle: '实机界面 04：Plan the Future 分日行程与未来规划',
          mediaCaption: '呈现旅行起止日期、自动倒计时、交通住宿备忘与每日行程清单。',
          mediaBadge: '实机界面 · 需求 04',
          outcomeLink: { archiveId: 'archive-05', iterationIdx: 2 },
          outcomeCta: '查看设计成果：桌面与移动端表单对照 →',
        },
      ]
    : [
        {
          id: 'req-syn-01',
          number: '01',
          tabTitle: '01 · Shared Space Visibility',
          headline: 'Unambiguous Partner Pairing & Active Space Confirmation',
          coreSummary:
            'In a multi-space model (Personal vs. Shared Space), partners need immediate visual confirmation of which space is active so new memories never appear missing.',
          designResponseSummary:
            'Built the Profile & Spaces status drawer highlighting `Our Story · Shared Space (2 MEMBERS · CURRENT)` with instant space switching.',
          evidenceOriginBadge: 'Firsthand Usage Log Fix',
          implementationBadge: 'Implemented (FastAPI + SQLite)',
          chainSteps: {
            userNeed: 'Confirm active space membership and shared visibility immediately.',
            requirement: 'Provide invite pairing, persistent member status, and instant space switching.',
            designDecision: 'Highlight `CURRENT` shared space card and member count in the account drawer.',
            actualInterface: 'Profile & Spaces Drawer showing `Our Story (2 MEMBERS · CURRENT)`.',
          },
          detailedSpecs: {
            functional:
              'Account auth, invitation code pairing, multi-space switching, and real-time shared memory visibility.',
            usability:
              'Highlights `CURRENT` badge and member count (`2 MEMBERS`) inside the account drawer.',
            privacy:
              'Strictly isolates personal-space records from shared-space queries at the API layer.',
          },
          slot: LOVE_STORY_ASSET_SPEC.requirements['need-01'],
          mediaTitle: 'Actual Interface 01: Shared Space Status Drawer',
          mediaCaption:
            'Confirms active membership in "Our Story · Shared Space (2 MEMBERS · CURRENT)".',
          mediaBadge: 'Actual Interface · REQ 01',
          outcomeLink: { archiveId: 'archive-05', iterationIdx: 0 },
          outcomeCta: 'See the design response: Shared Space Sync Iteration →',
        },
        {
          id: 'req-syn-02',
          number: '02',
          tabTitle: '02 · Time & Place Linking',
          headline: 'Unified Memory Object Across Gallery, Timeline & Globe',
          coreSummary:
            'Partners recall moments both chronologically ("last autumn") and spatially ("by the river in Brisbane"), requiring linked views rather than a flat photo grid.',
          designResponseSummary:
            'Powered Moments, event-date Timeline (`YYYY-MM-DD`), and the orthographic Memory Map globe from one shared schema with optional coordinates.',
          evidenceOriginBadge: 'Secondary Research + IA',
          implementationBadge: 'Implemented Core Views',
          chainSteps: {
            userNeed: 'Browse shared memories seamlessly across both dates and cities.',
            requirement: 'Link album covers, historical event dates (`YYYY-MM-DD`), and globe pins.',
            designDecision: 'Keep coordinates optional (no fake pins) and deep-link detail places to the globe.',
            actualInterface: 'Our Space Hub linking the timeline arc directly to city pins on the globe.',
          },
          detailedSpecs: {
            functional:
              'Moments, Timeline, and Memory Map share unified date, coordinate, weather/mood, and story fields.',
            usability:
              'Focusing a timeline milestone previews the memory and draws a gold curve to its city coordinate.',
            privacy:
              'Stores city/place coordinates inside the private archive with zero third-party location tracking.',
          },
          slot: LOVE_STORY_ASSET_SPEC.requirements['need-02'],
          mediaTitle: 'Actual Interface 02: Linked Timeline Arc & Memory Globe',
          mediaCaption:
            'Focusing a timeline node reveals its preview card and links to its city coordinate.',
          mediaBadge: 'Actual Interface · REQ 02',
          outcomeLink: { archiveId: 'archive-02', moduleIndex: 2 },
          outcomeCta: 'See the design response: Connecting Memories IA →',
        },
        {
          id: 'req-syn-03',
          number: '03',
          tabTitle: '03 · Secondary Privacy Lock',
          headline: 'Zero-Leakage Secondary Password Gate for Sensitive Keepsakes',
          coreSummary:
            'Even in a two-person space, sensitive letters and private notes need protection behind a second lock during casual screen sharing.',
          designResponseSummary:
            'Separated Private Archive behind a secondary password gate that conceals all record counts and titles when locked and auto-locks after 10 minutes.',
          evidenceOriginBadge: 'Privacy Boundary Requirement',
          implementationBadge: 'Implemented Gate',
          chainSteps: {
            userNeed: 'Separate everyday shared albums from sensitive private keepsakes.',
            requirement: 'Enforce a secondary password with 10-min auto-lock and zero metadata leakage.',
            designDecision: 'Hide all record counts and thumbnails when locked; add a manual Lock trigger.',
            actualInterface: 'Private Archive Secondary Password Gate (`1440×900`) in Dark Archive framing.',
          },
          detailedSpecs: {
            functional:
              'Secondary password verification endpoint, 10-minute session timeout, and manual Lock button.',
            usability:
              'Clear locked/unlocked state indicator without cluttering everyday album browsing.',
            privacy:
              'Backend withholds all `privacyMode = private` payloads until the secondary session token is verified.',
          },
          slot: LOVE_STORY_ASSET_SPEC.requirements['need-03'],
          mediaTitle: 'Actual Interface 03: Secondary Privacy Password Gate',
          mediaCaption:
            'Exposes zero protected record counts or titles until unlocked.',
          mediaBadge: 'Actual Interface · REQ 03',
          outcomeLink: { archiveId: 'archive-03', exhibitionAreaIdx: 3 },
          outcomeCta: 'See the design response: Private Archive Exhibition →',
        },
        {
          id: 'req-syn-04',
          number: '04',
          tabTitle: '04 · Future Plans & Mobile UI',
          headline: 'Multi-Day Future Itineraries & 6-Step Mobile Composer',
          coreSummary:
            'Partners capture moments on phones while out together and also plan upcoming journeys and anniversaries in the same space.',
          designResponseSummary:
            'Built Day 1..N trip planning in Plan the Future and refactored mobile memory creation from a cramped sidebar into a 6-step fullscreen composer.',
          evidenceOriginBadge: 'Ritual Ref + Mobile Refactor',
          implementationBadge: 'Implemented Mobile & Plans UI',
          chainSteps: {
            userNeed: 'Record moments effortlessly on mobile and plan upcoming trips together.',
            requirement: 'Provide multi-day trip itineraries and eliminate cramped mobile sidebar scrolling.',
            designDecision: 'Refactor mobile capture into 6 collapsible sections with a sticky Save bar.',
            actualInterface: 'Plan the Future itinerary detail + `390×844` fullscreen mobile composer.',
          },
          detailedSpecs: {
            functional:
              'Auto-computes trip duration and countdowns; full feature parity between desktop sheet and mobile composer.',
            usability:
              'Sticky bottom Cancel / Save Memory bar prevents scroll fatigue on 390px viewports.',
            privacy:
              'Explicit Timeline and Privacy Mode toggles before saving.',
          },
          slot: LOVE_STORY_ASSET_SPEC.requirements['need-04'],
          mediaTitle: 'Actual Interface 04: Plan the Future Multi-Day Itinerary',
          mediaCaption:
            'Organizes upcoming trip dates, countdowns, logistics notes, and Day 1..N schedules.',
          mediaBadge: 'Actual Interface · REQ 04',
          outcomeLink: { archiveId: 'archive-05', iterationIdx: 2 },
          outcomeCta: 'See the design response: Desktop vs. Mobile Composer →',
        },
      ]

  const currentScenario =
    targetScenarios[activeScenarioIdx] ?? targetScenarios[0]
  const currentResearch =
    researchInsights[activeResearchIdx] ?? researchInsights[0]
  const currentCompetitor =
    competitiveRefs[activeCompetitorIdx] ?? competitiveRefs[0]
  const currentReq =
    requirementSyntheses[activeReqIdx] ?? requirementSyntheses[0]

  const motionTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const }

  // =========================================================================
  // RENDER BALANCED, VISUAL-FIRST EXPANDED NODE BODY (LS-03E)
  // Middle Two-Column (Screenshot Left ≈ Primary Insight Right)
  // Bottom Full-Width (Horizontal Reasoning Strip / Scope Bar)
  // =========================================================================
  const renderExpandedNodeBody = (node: UxDiscoveryNodeMeta) => {
    // -----------------------------------------------------------------------
    // NODE 01 — PROJECT PURPOSE
    // -----------------------------------------------------------------------
    if (node.id === 'ux-node-01') {
      return (
        <div className="ls-ux-dossier-body" data-ux-dossier="ux-node-01">
          {/* MIDDLE — Balanced Two Columns */}
          <div className="ls-ux-balanced-middle-split">
            <div className="ls-ux-media-column">
              <LoveStoryEvidencePicture
                slot={LOVE_STORY_ASSET_SPEC.architecture.hub}
                alt={
                  isZh
                    ? 'LoveStory Our Space 共享记忆空间主页'
                    : 'LoveStory Our Space Shared Memory Hub'
                }
                badge={
                  isZh
                    ? '实机界面 · Our Space 双人共享核心'
                    : 'Authentic UI · Our Space Two-Person Hub'
                }
                caption={
                  isZh
                    ? '将共同照片、时间节点、城市坐标与未来计划汇聚于同一间安静的暗房展馆。'
                    : 'Unites shared photographs, timeline milestones, city coordinates, and future plans in one quiet room.'
                }
                enlargeLabel={enlargeLabel}
                priority
                onEnlarge={() =>
                  onEnlargeMedia({
                    slot: LOVE_STORY_ASSET_SPEC.architecture.hub,
                    title: isZh
                      ? 'Our Space 双人数字记忆档案馆主页 (1440×900)'
                      : 'Our Space — Two-Person Digital Memory Archive Hub (1440×900)',
                    caption: loveStoryData.scene01Story.narrativeBody,
                    badge: '01 · PROJECT PURPOSE',
                  })
                }
              />
            </div>

            <div className="ls-ux-primary-insight-column">
              <span className="ls-ux-eyebrow-tag">
                {isZh ? '核心定位与产品初衷' : 'CENTRAL PROBLEM & PRODUCT PURPOSE'}
              </span>

              <h4 className="ls-ux-prominent-insight-heading">
                {isZh
                  ? '日常聊天与云盘按文件堆叠信息，而伴侣需要一间按“故事、时间、坐标与心愿”连接的双人数字记忆馆。'
                  : 'Messaging feeds and cloud folders bury moments as raw files; LoveStory connects shared stories, dates, places, and future plans in one two-person archive.'}
              </h4>

              <p className="ls-ux-brief-explanation">
                {isZh
                  ? '专为两个人构建的跨平台 Web 记忆空间——让每一次散步、旅行与纪念日都围绕 Our Space 核心有机相连，并在 Dark Archive (#10110F) 与 Paper & Ink (#F3EFE7) 双境中安静呈现。'
                  : 'Designed as an intimate, distraction-free web space for two partners where Moments, Timeline, Memory Map, Future Plans, and Private Archive stay connected along one continuous thread.'}
              </p>

              <div className="ls-ux-response-Inline-callout">
                <span className="ls-ux-point-kicker">
                  {isZh ? '当前上线范围 (Honest Scope)' : 'Implemented vs. Iterating Scope'}
                </span>
                <p>
                  {isZh
                    ? '双人配对、记忆增删改查、编年时间轴、二级隐私锁与移动端全屏编辑器已上线；地球仪深度联动持续迭代中。'
                    : 'Partner pairing, memory CRUD, event-date timeline, secondary privacy lock, and mobile fullscreen editing are live; map correlation continues iterating.'}
                </p>
              </div>

            </div>
          </div>

          {/* BOTTOM — Full-Width Horizontal Project Foundation Strip */}
          <div className="ls-ux-fullwidth-flow-strip">
            {loveStoryData.scene01Story.metadata.map((m, i) => (
              <div key={m.label} className="ls-ux-flow-strip-cell">
                <span className="ls-ux-flow-step-num">
                  0{i + 1} · {m.label}
                </span>
                <p>{m.value}</p>
              </div>
            ))}
          </div>

          <div className="ls-ux-outcome-bridge-bar">
            <button
              type="button"
              className="ls-ux-bridge-btn"
              onClick={() =>
                onNavigateToDesignOutcome({
                  archiveId: 'archive-02',
                  moduleIndex: -1,
                })
              }
            >
              <span>
                {isZh
                  ? '查看设计成果：连接记忆脉络 (IA) →'
                  : 'See the design response: Connecting Memories →'}
              </span>
            </button>
            <button
              type="button"
              className="ls-ux-bridge-btn is-secondary"
              onClick={() => handleSelectNode('ux-node-05')}
            >
              <span>
                {isZh ? '05 · 需求定义' : '05 · Requirements'}
              </span>
              <ArrowRightIcon size={13} />
            </button>
          </div>
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // NODE 02 — TARGET USERS
    // -----------------------------------------------------------------------
    if (node.id === 'ux-node-02') {
      return (
        <div
          className="ls-ux-dossier-body"
          data-ux-dossier="ux-node-02"
          data-active-scenario={currentScenario.id}
        >
          {/* TOP — 4 Selectable Scenario Tabs */}
          <div
            className="ls-ux-subtab-strip"
            role="tablist"
            aria-label={
              isZh ? '选择目标用户使用情境' : 'Select target user scenario'
            }
          >
            {targetScenarios.map((sc, idx) => {
              const isSelected = idx === activeScenarioIdx
              return (
                <button
                  key={sc.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  data-scenario-tab={sc.id}
                  className={`ls-ux-subtab-btn ${isSelected ? 'is-active' : ''}`}
                  onClick={() => setActiveScenarioIdx(idx)}
                >
                  <span className="ls-ux-subtab-code">{sc.code}</span>
                  <span className="ls-ux-subtab-title">{sc.tabTitle}</span>
                </button>
              )
            })}
          </div>

          {/* MIDDLE — Balanced Two Columns */}
          <div className="ls-ux-balanced-middle-split" role="tabpanel">
            <div className="ls-ux-media-column">
              <LoveStoryEvidencePicture
                slot={currentScenario.slot}
                alt={currentScenario.mediaTitle}
                badge={currentScenario.mediaBadge}
                caption={currentScenario.mediaCaption}
                enlargeLabel={enlargeLabel}
                priority
                onEnlarge={() =>
                  onEnlargeMedia({
                    slot: currentScenario.slot,
                    title: currentScenario.mediaTitle,
                    caption: currentScenario.mediaCaption,
                    badge: currentScenario.mediaBadge,
                  })
                }
              />
            </div>

            <div className="ls-ux-primary-insight-column">
              <span className="ls-ux-eyebrow-tag">
                {currentScenario.evidenceBadge}
              </span>

              <h4 className="ls-ux-prominent-insight-heading">
                {currentScenario.scenarioTitle}
              </h4>

              <p className="ls-ux-brief-explanation">
                {currentScenario.userGoal}
              </p>

              <div className="ls-ux-response-Inline-callout">
                <span className="ls-ux-point-kicker">
                  {isZh ? '核心操作任务 (Main Task)' : 'Main User Task & Flow'}
                </span>
                <p>{currentScenario.mainTask}</p>
              </div>

            </div>
          </div>

          {/* BOTTOM — Full-Width Scenario Context & Modules Bar */}
          <div className="ls-ux-fullwidth-flow-strip ls-ux-fullwidth-flow-strip--3col">
            <div className="ls-ux-flow-strip-cell">
              <span className="ls-ux-flow-step-num">
                {isZh ? '01 · 触发情境' : '01 · Usage Context'}
              </span>
              <p>{currentScenario.contextDetail}</p>
            </div>
            <div className="ls-ux-flow-strip-cell">
              <span className="ls-ux-flow-step-num">
                {isZh ? '02 · 对应产品模块' : '02 · Relevant LoveStory Modules'}
              </span>
              <div className="ls-ux-module-tags-row">
                {currentScenario.relevantModules.map((mod) => (
                  <span key={mod} className="ls-ux-module-pill">
                    {mod}
                  </span>
                ))}
              </div>
            </div>
            <div className="ls-ux-flow-strip-cell">
              <span className="ls-ux-flow-step-num">
                {isZh ? '03 · 建模方法说明' : '03 · Persona Framing'}
              </span>
              <p>
                {isZh
                  ? '基于真实双人关系任务（JTBD）建模，不虚构人口统计百分比或受访者画像。'
                  : 'Framed around concrete relationship Jobs To Be Done (JTBD) rather than invented demographic stats.'}
              </p>
            </div>
          </div>

          <div className="ls-ux-outcome-bridge-bar">
            <button
              type="button"
              className="ls-ux-bridge-btn"
              onClick={() =>
                onNavigateToDesignOutcome(currentScenario.outcomeLink)
              }
            >
              <span>{currentScenario.outcomeCta}</span>
            </button>
          </div>
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // NODE 03 — USER RESEARCH (Redesigned Balanced Layout per LS-03E Section 2)
    //   TOP: 4 selectable research topics
    //   MIDDLE (2-Col): Left = Authentic screenshot + short caption
    //                   Right = 1 prominent UX insight + 1 brief explanation + design response
    //   BOTTOM (Full-Width): 4-Step Horizontal Flow
    //                   Public Feedback → UX Insight → Design Opportunity → LoveStory Response
    // -----------------------------------------------------------------------
    if (node.id === 'ux-node-03') {
      return (
        <div
          className="ls-ux-dossier-body"
          data-ux-dossier="ux-node-03"
          data-active-research={currentResearch.id}
        >
          {/* TOP — Four Small Selectable Research Topics */}
          <div
            className="ls-ux-subtab-strip"
            role="tablist"
            aria-label={
              isZh ? '选择用户研究主题' : 'Select user research topic'
            }
          >
            {researchInsights.map((item, idx) => {
              const isSelected = idx === activeResearchIdx
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  data-research-tab={item.id}
                  className={`ls-ux-subtab-btn ${isSelected ? 'is-active' : ''}`}
                  onClick={() => setActiveResearchIdx(idx)}
                >
                  <span className="ls-ux-subtab-code">{item.code}</span>
                  <span className="ls-ux-subtab-title">{item.tabTitle}</span>
                </button>
              )
            })}
          </div>

          {/* MIDDLE — Balanced Two Columns: Screenshot Left | Prominent Insight Right */}
          <div className="ls-ux-balanced-middle-split" role="tabpanel">
            <div className="ls-ux-media-column">
              <LoveStoryEvidencePicture
                slot={currentResearch.slot}
                alt={currentResearch.mediaTitle}
                badge={currentResearch.mediaBadge}
                caption={currentResearch.mediaCaption}
                enlargeLabel={enlargeLabel}
                priority
                onEnlarge={() =>
                  onEnlargeMedia({
                    slot: currentResearch.slot,
                    title: currentResearch.mediaTitle,
                    caption: currentResearch.mediaCaption,
                    badge: currentResearch.mediaBadge,
                  })
                }
              />
            </div>

            <div className="ls-ux-primary-insight-column">
              <div className="ls-ux-source-bar">
                <span className="ls-ux-eyebrow-tag">
                  {currentResearch.evidenceOriginLabel}
                </span>
                <a
                  href={currentResearch.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ls-ux-source-link"
                >
                  <span>
                    {currentResearch.sourceName} ({currentResearch.sourceDate})
                  </span>
                  <ArrowUpRightIcon size={13} />
                </a>
              </div>

              <h4 className="ls-ux-prominent-insight-heading">
                {currentResearch.prominentInsight}
              </h4>

              <p className="ls-ux-brief-explanation">
                {currentResearch.briefExplanation}
              </p>

              <div className="ls-ux-response-Inline-callout is-dark-callout">
                <span className="ls-ux-point-kicker">
                  {isZh ? 'LoveStory 设计响应' : 'LoveStory Design Response'}
                </span>
                <p>{currentResearch.designResponseSummary}</p>
              </div>

            </div>
          </div>

          {/* BOTTOM — Full-Width 4-Step Horizontal Research Reasoning Flow */}
          <div
            className="ls-ux-fullwidth-flow-strip"
            aria-label={
              isZh
                ? '研究推演全宽链条：公开反馈 → UX 洞察 → 设计机会 → LoveStory 响应'
                : 'Full-width research reasoning flow: Public Feedback → UX Insight → Design Opportunity → LoveStory Response'
            }
          >
            <div className="ls-ux-flow-strip-cell">
              <span className="ls-ux-flow-step-num">
                {isZh ? '01 · 公开反馈 (Public Feedback)' : '01 · Public Feedback'}
              </span>
              <p>{currentResearch.flowSteps.publicFeedback}</p>
            </div>

            <div className="ls-ux-flow-strip-cell">
              <span className="ls-ux-flow-step-num">
                {isZh ? '02 · UX 洞察 (UX Insight)' : '02 · UX Insight'}
              </span>
              <p>{currentResearch.flowSteps.uxInsight}</p>
            </div>

            <div className="ls-ux-flow-strip-cell">
              <span className="ls-ux-flow-step-num">
                {isZh
                  ? '03 · 设计机会 (Design Opportunity)'
                  : '03 · Design Opportunity'}
              </span>
              <p>{currentResearch.flowSteps.designOpportunity}</p>
            </div>

            <div className="ls-ux-flow-strip-cell is-dark-cell">
              <span className="ls-ux-flow-step-num">
                {isZh
                  ? '04 · LoveStory 响应 (Response)'
                  : '04 · LoveStory Response'}
              </span>
              <p>{currentResearch.flowSteps.loveStoryResponse}</p>
            </div>
          </div>

          <div className="ls-ux-outcome-bridge-bar">
            <button
              type="button"
              className="ls-ux-bridge-btn"
              onClick={() =>
                onNavigateToDesignOutcome(currentResearch.outcomeLink)
              }
            >
              <span>{currentResearch.outcomeCta}</span>
            </button>

            <button
              type="button"
              className="ls-ux-progressive-toggle"
              aria-expanded={showNodeDetails}
              onClick={() => setShowNodeDetails((v) => !v)}
            >
              <span>
                {showNodeDetails
                  ? isZh
                    ? '收起方法论与版本核验 −'
                    : 'Hide Method & 2026 Check −'
                  : isZh
                    ? '方法论与 2026 版本核验 +'
                    : 'Method & 2026 Release Check +'}
              </span>
            </button>
          </div>

          {showNodeDetails ? (
            <p className="ls-ux-honest-note">
              {currentResearch.releaseCrossCheckNote}{' '}
              {isZh
                ? '（注：未开展正式用户访谈；公开评论挖掘用于横向印证设计方向，并与开发期双人实测日志严格区分。）'
                : '(Note: No formal interviews were conducted; secondary public review synthesis is kept distinct from firsthand development usage logs.)'}
            </p>
          ) : null}
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // NODE 04 — COMPETITIVE ANALYSIS
    // -----------------------------------------------------------------------
    if (node.id === 'ux-node-04') {
      return (
        <div
          className="ls-ux-dossier-body"
          data-ux-dossier="ux-node-04"
          data-active-competitor={currentCompetitor.id}
        >
          {/* TOP — 3 Selectable Reference Products */}
          <div
            className="ls-ux-subtab-strip ls-ux-subtab-strip--3col"
            role="tablist"
            aria-label={
              isZh ? '选择对比参考产品' : 'Select comparative reference product'
            }
          >
            {competitiveRefs.map((comp, idx) => {
              const isSelected = idx === activeCompetitorIdx
              return (
                <button
                  key={comp.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  data-competitor-tab={comp.id}
                  className={`ls-ux-subtab-btn ${isSelected ? 'is-active' : ''}`}
                  onClick={() => setActiveCompetitorIdx(idx)}
                >
                  <span className="ls-ux-subtab-code">{comp.code}</span>
                  <span className="ls-ux-subtab-title">{comp.name}</span>
                </button>
              )
            })}
          </div>

          {/* MIDDLE — Balanced Two Columns */}
          <div className="ls-ux-balanced-middle-split" role="tabpanel">
            <div className="ls-ux-media-column">
              <LoveStoryEvidencePicture
                slot={currentCompetitor.slot}
                alt={currentCompetitor.mediaTitle}
                badge={currentCompetitor.categoryBadge}
                caption={currentCompetitor.mediaCaption}
                enlargeLabel={enlargeLabel}
                priority
                onEnlarge={() =>
                  onEnlargeMedia({
                    slot: currentCompetitor.slot,
                    title: currentCompetitor.mediaTitle,
                    caption: currentCompetitor.mediaCaption,
                    badge: currentCompetitor.code,
                  })
                }
              />
            </div>

            <div className="ls-ux-primary-insight-column">
              <div className="ls-ux-source-bar">
                <span className="ls-ux-eyebrow-tag">
                  {currentCompetitor.categoryBadge}
                </span>
                <a
                  href={currentCompetitor.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ls-ux-source-link"
                >
                  <span>
                    {isZh ? '官方文档 / 商店来源' : 'Official Documentation / Source'}
                  </span>
                  <ArrowUpRightIcon size={13} />
                </a>
              </div>

              <h4 className="ls-ux-prominent-insight-heading">
                {currentCompetitor.coreTakeaway}
              </h4>

              <div className="ls-ux-editorial-points">
                <div className="ls-ux-point-row">
                  <span className="ls-ux-point-kicker">
                    {isZh ? '已验证的核心优势' : 'Verified Strength'}
                  </span>
                  <p>{currentCompetitor.verifiedStrength}</p>
                </div>

                <div className="ls-ux-point-row">
                  <span className="ls-ux-point-kicker">
                    {isZh ? '与 LoveStory 的关键差异' : 'Key Difference vs. LoveStory'}
                  </span>
                  <p>{currentCompetitor.keyGapVsLoveStory}</p>
                </div>
              </div>

            </div>
          </div>

          {/* BOTTOM — Full-Width Takeaway & Source Provenance Bar */}
          <div className="ls-ux-fullwidth-flow-strip ls-ux-fullwidth-flow-strip--2col">
            <div className="ls-ux-flow-strip-cell is-dark-cell">
              <span className="ls-ux-flow-step-num">
                {isZh ? 'LOVESTORY 设计吸纳' : 'LOVESTORY DESIGN TAKEAWAY'}
              </span>
              <p>{currentCompetitor.loveStoryDecision}</p>
            </div>
            <div className="ls-ux-flow-strip-cell">
              <span className="ls-ux-flow-step-num">
                {isZh ? '官方文档与历史反馈区分' : 'CURRENT FEATURES VS. HISTORICAL FEEDBACK'}
              </span>
              <p>{currentCompetitor.sourceNote}</p>
            </div>
          </div>

          <div className="ls-ux-outcome-bridge-bar">
            <button
              type="button"
              className="ls-ux-bridge-btn"
              onClick={() =>
                onNavigateToDesignOutcome(currentCompetitor.outcomeLink)
              }
            >
              <span>{currentCompetitor.outcomeCta}</span>
            </button>

            <button
              type="button"
              className="ls-ux-progressive-toggle"
              aria-expanded={showNodeDetails}
              onClick={() => setShowNodeDetails((v) => !v)}
            >
              <span>
                {showNodeDetails
                  ? isZh
                    ? '收起 7 项 UX 维度 −'
                    : 'Hide 7 UX Dimensions −'
                  : isZh
                    ? '展开 7 项 UX 维度明细 +'
                    : 'Inspect 7 UX Dimensions +'}
              </span>
            </button>
          </div>

          {showNodeDetails ? (
            <div className="ls-ux-dimensions-box">
              <div className="ls-ux-dimensions-grid">
                {currentCompetitor.dimensions.map((d) => (
                  <div key={d.dimension} className="ls-ux-dim-cell">
                    <div className="ls-ux-dim-top">
                      <strong>{d.dimension}</strong>
                      <span className="ls-ux-dim-state">{d.supportState}</span>
                    </div>
                    <p>{d.observation}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // NODE 05 — REQUIREMENTS & PROBLEM DEFINITION
    // -----------------------------------------------------------------------
    return (
      <div
        className="ls-ux-dossier-body"
        data-ux-dossier="ux-node-05"
        data-active-req={currentReq.id}
      >
        {/* TOP — 4 Selectable Requirements */}
        <div
          className="ls-ux-subtab-strip"
          role="tablist"
          aria-label={
            isZh ? '选择核心需求链' : 'Select requirement chain'
          }
        >
          {requirementSyntheses.map((req, idx) => {
            const isSelected = idx === activeReqIdx
            return (
              <button
                key={req.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                data-req-tab={req.id}
                className={`ls-ux-subtab-btn ${isSelected ? 'is-active' : ''}`}
                onClick={() => setActiveReqIdx(idx)}
              >
                <span className="ls-ux-subtab-code">REQ {req.number}</span>
                <span className="ls-ux-subtab-title">{req.tabTitle}</span>
              </button>
            )
          })}
        </div>

        {/* MIDDLE — Balanced Two Columns */}
        <div className="ls-ux-balanced-middle-split" role="tabpanel">
          <div className="ls-ux-media-column">
            <LoveStoryEvidencePicture
              slot={currentReq.slot}
              alt={currentReq.mediaTitle}
              badge={currentReq.mediaBadge}
              caption={currentReq.mediaCaption}
              enlargeLabel={enlargeLabel}
              priority
              onEnlarge={() =>
                onEnlargeMedia({
                  slot: currentReq.slot,
                  title: currentReq.mediaTitle,
                  caption: currentReq.mediaCaption,
                  badge: currentReq.mediaBadge,
                })
              }
            />
          </div>

          <div className="ls-ux-primary-insight-column">
            <div className="ls-ux-req-badges-row">
              <span className="ls-ux-eyebrow-tag">
                {currentReq.evidenceOriginBadge}
              </span>
              <span className="ls-ux-impl-badge">
                {currentReq.implementationBadge}
              </span>
            </div>

            <h4 className="ls-ux-prominent-insight-heading">
              {currentReq.headline}
            </h4>

            <p className="ls-ux-brief-explanation">{currentReq.coreSummary}</p>

            <div className="ls-ux-response-Inline-callout is-dark-callout">
              <span className="ls-ux-point-kicker">
                {isZh ? '实装设计决策' : 'Implemented Interface Decision'}
              </span>
              <p>{currentReq.designResponseSummary}</p>
            </div>

          </div>
        </div>

        {/* BOTTOM — Full-Width 4-Step Traceability Chain */}
        <div
          className="ls-ux-fullwidth-flow-strip"
          aria-label={
            isZh
              ? '需求追踪全宽链条：用户需求 → 设计要求 → 设计决策 → 实装界面'
              : 'Full-width requirement traceability flow: User Need → Requirement → Design Decision → Actual Interface'
          }
        >
          <div className="ls-ux-flow-strip-cell">
            <span className="ls-ux-flow-step-num">
              {isZh ? '01 · 用户需求 (User Need)' : '01 · User Need'}
            </span>
            <p>{currentReq.chainSteps.userNeed}</p>
          </div>

          <div className="ls-ux-flow-strip-cell">
            <span className="ls-ux-flow-step-num">
              {isZh ? '02 · 设计要求 (Requirement)' : '02 · Requirement'}
            </span>
            <p>{currentReq.chainSteps.requirement}</p>
          </div>

          <div className="ls-ux-flow-strip-cell">
            <span className="ls-ux-flow-step-num">
              {isZh ? '03 · 设计决策 (Decision)' : '03 · Design Decision'}
            </span>
            <p>{currentReq.chainSteps.designDecision}</p>
          </div>

          <div className="ls-ux-flow-strip-cell is-dark-cell">
            <span className="ls-ux-flow-step-num">
              {isZh ? '04 · 实装界面 (Actual UI)' : '04 · Actual Interface'}
            </span>
            <p>{currentReq.chainSteps.actualInterface}</p>
          </div>
        </div>

        <div className="ls-ux-outcome-bridge-bar">
          <button
            type="button"
            className="ls-ux-bridge-btn"
            onClick={() =>
              onNavigateToDesignOutcome(currentReq.outcomeLink)
            }
          >
            <span>{currentReq.outcomeCta}</span>
          </button>

          <button
            type="button"
            className="ls-ux-progressive-toggle"
            aria-expanded={showNodeDetails}
            onClick={() => setShowNodeDetails((v) => !v)}
          >
            <span>
              {showNodeDetails
                ? isZh
                  ? '收起细分规格 −'
                  : 'Hide Detailed Specs −'
                : isZh
                  ? '功能与隐私规格 +'
                  : 'Functional & Privacy Specs +'}
            </span>
          </button>
        </div>

        {showNodeDetails ? (
          <ul className="ls-ux-req-spec-list">
            <li>
              <strong>{isZh ? '功能：' : 'Functional:'}</strong>{' '}
              {currentReq.detailedSpecs.functional}
            </li>
            <li>
              <strong>{isZh ? '可用性：' : 'Usability:'}</strong>{' '}
              {currentReq.detailedSpecs.usability}
            </li>
            <li>
              <strong>{isZh ? '隐私边界：' : 'Privacy:'}</strong>{' '}
              {currentReq.detailedSpecs.privacy}
            </li>
          </ul>
        ) : null}
      </div>
    )
  }

  return (
    <section
      className={`ls-ux-discovery-section ${
        expandedNodeId ? 'is-node-expanded' : 'is-compact-network'
      }`}
      aria-labelledby="ls-ux-discovery-heading"
      data-ux-discovery-state={expandedNodeId ?? 'compact'}
    >
      {/* Section Header */}
      <div className="ls-ux-discovery-header">
        <div className="ls-ux-discovery-title-block">
          <span className="ls-ux-section-kicker">
            {isZh
              ? 'UX DISCOVERY / 用户研究与问题定义'
              : 'UX DISCOVERY / RESEARCH & PROBLEM DEFINITION'}
          </span>
          <h3 id="ls-ux-discovery-heading" className="ls-ux-section-heading">
            {isZh
              ? '为什么这样设计：从用户情境到界面决策的研究脉络'
              : 'Why We Designed It This Way: An Interactive Research Trail'}
          </h3>
          <p className="ls-ux-section-sub">
            {isZh
              ? '点击任一节点原位展开视觉实证卷宗，其余节点沿金色丝线自然环绕排列。'
              : 'Select any node along the gold thread to inspect its visual evidence and design reasoning in place.'}
          </p>
        </div>

        <div className="ls-ux-discovery-controls">
          {expandedNodeId ? (
            <button
              type="button"
              className="ls-ux-collapse-network-btn"
              onClick={handleCollapseNetwork}
            >
              <span>
                {isZh ? '收起研究卷宗 (Esc)' : 'Collapse to Compact Network (Esc)'}
              </span>
            </button>
          ) : (
            <span className="ls-ux-compact-hint">
              {isZh
                ? '5 个互通研究节点 · 点击展开'
                : '5 Interconnected Nodes · Click to Expand'}
            </span>
          )}
        </div>
      </div>

      {/* Spatially Rearranging 5-Node Network Stage */}
      <div
        ref={networkStageRef}
        className={`ls-ux-discovery-network-grid ${
          expandedNodeId ? 'is-expanded-layout' : 'is-compact-layout'
        }`}
        data-expanded-node={expandedNodeId ?? 'none'}
      >
        {/* Dynamic Continuous Organic Gold Connector SVG Overlay */}
        <svg
          className="ls-ux-discovery-connector-svg"
          viewBox={`0 0 ${connectorGeometry.width} ${connectorGeometry.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {connectorGeometry.branchPaths.map((d, idx) => (
            <path
              key={`branch-${idx}`}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.05"
              strokeDasharray="4 4"
              opacity="0.46"
            />
          ))}
          {connectorGeometry.primaryPath ? (
            <path
              d={connectorGeometry.primaryPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          ) : null}
          {connectorGeometry.points.map((pt) => (
            <g key={pt.id}>
              {pt.isActive ? (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  opacity="0.55"
                />
              ) : null}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={pt.isActive ? '4.2' : '3.2'}
                fill="currentColor"
              />
            </g>
          ))}
        </svg>

        {/* Five Stable-Identity Research Nodes (Same DOM Node Expands in Place) */}
        {uxNodes.map((node, idx) => {
          const isExpanded = expandedNodeId === node.id
          const isSatellite = expandedNodeId !== null && !isExpanded
          const satelliteOrder =
            expandedNodeId !== null && !isExpanded
              ? UX_NODE_ORDER.filter((id) => id !== expandedNodeId).indexOf(
                  node.id
                )
              : idx

          return (
            <motion.article
              layout
              transition={motionTransition}
              key={node.id}
              data-ux-node={node.id}
              data-ux-node-expanded={isExpanded ? 'true' : 'false'}
              className={`ls-ux-node-item ${node.staggerClass} ${
                isExpanded
                  ? 'is-expanded-node'
                  : isSatellite
                    ? `is-satellite-node is-sat-pos-${satelliteOrder}`
                    : 'is-compact-node'
              }`}
            >
              {/* Node Header / Trigger Bar */}
              <div className="ls-ux-node-header-bar">
                <button
                  ref={(el) => {
                    nodeTriggerRefs.current[node.id] = el
                  }}
                  type="button"
                  aria-expanded={isExpanded}
                  data-ux-node-trigger={node.id}
                  className="ls-ux-node-trigger-btn"
                  onClick={() => handleSelectNode(node.id)}
                >
                  <span className="ls-ux-node-top-row">
                    <span
                      ref={(el) => {
                        nodeAnchorRefs.current[node.id] = el
                      }}
                      className="ls-ux-node-anchor-dot"
                      aria-hidden="true"
                    />
                    <span className="ls-ux-node-num">{node.number}</span>
                    <span className="ls-ux-node-role-tag">{node.roleTag}</span>
                  </span>

                  <span className="ls-ux-node-title-text">
                    {isExpanded ? node.headline : node.shortTitle}
                  </span>

                  {!isExpanded ? (
                    <span className="ls-ux-node-compact-question">
                      {node.compactQuestion}
                    </span>
                  ) : null}

                  {!isExpanded ? (
                    <span className="ls-ux-node-open-cue">
                      <span>{isZh ? '展开' : 'Inspect'}</span>
                      <ArrowRightIcon size={12} />
                    </span>
                  ) : null}
                </button>

                {isExpanded ? (
                  <div className="ls-ux-expanded-header-actions">
                    <h4
                      ref={expandedPanelHeadingRef}
                      tabIndex={-1}
                      className="sr-only"
                    >
                      {node.headline}
                    </h4>
                    <button
                      type="button"
                      data-ux-collapse-btn={node.id}
                      className="ls-ux-inline-collapse-btn"
                      onClick={handleCollapseNetwork}
                    >
                      <span>{isZh ? '收起 ×' : 'Collapse ×'}</span>
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Expanded Research Panel Content (Rendered Inside the Same Node) */}
              {isExpanded ? renderExpandedNodeBody(node) : null}
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
