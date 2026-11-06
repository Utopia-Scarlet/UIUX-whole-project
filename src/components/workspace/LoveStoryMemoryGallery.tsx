import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from '../icons/WorkspaceIcons'
import { LOVE_STORY_ASSET_SPEC } from '../../data/portfolioData'

export interface LoveStoryMemoryPhotoAsset {
  webp: string
  png: string
  aspectRatio: string
  captionEn: string
  captionZh: string
}

export interface LoveStoryDemoMemoryItem {
  id: string
  indexLabel: string
  titleEn: string
  titleZh: string
  dateDisplayEn: string
  dateDisplayZh: string
  shortDateEn: string
  shortDateZh: string
  isoDate: string
  timeDisplay: string
  year: '2026' | '2025'
  timelineOrder: number
  timelineProgressPct: number
  cityEn: string
  cityZh: string
  countryEn: string
  countryZh: string
  placeDetailEn: string
  placeDetailZh: string
  latitude: number
  longitude: number
  coordinatesLabel: string
  weatherMoodEn: string
  weatherMoodZh: string
  collectionTagEn: string
  collectionTagZh: string
  storyEn: string
  storyZh: string
  uxDesignNoteEn: string
  uxDesignNoteZh: string
  layoutRole: 'feature-lead' | 'upper-pair-a' | 'upper-pair-b' | 'lower-trio'
  photos: ReadonlyArray<LoveStoryMemoryPhotoAsset>
}

export const LOVE_STORY_DEMO_MEMORIES: ReadonlyArray<LoveStoryDemoMemoryItem> = [
  {
    id: 'mem-101',
    indexLabel: '01',
    titleEn: 'Riverwalk Evening Walk',
    titleZh: '布里斯班河畔暮色漫步',
    dateDisplayEn: 'Sep 18, 2026',
    dateDisplayZh: '2026年9月18日',
    shortDateEn: 'SEP 18',
    shortDateZh: '09月18日',
    isoDate: '2026-09-18',
    timeDisplay: '18:20',
    year: '2026',
    timelineOrder: 6,
    timelineProgressPct: 94,
    cityEn: 'Brisbane',
    cityZh: '布里斯班',
    countryEn: 'Australia',
    countryZh: '澳大利亚',
    placeDetailEn: 'New Farm Riverwalk, Brisbane',
    placeDetailZh: '布里斯班 New Farm 河畔步道',
    latitude: -27.4698,
    longitude: 153.0251,
    coordinatesLabel: '27.4698° S, 153.0251° E',
    weatherMoodEn: 'Clear · 22°C · Peaceful',
    weatherMoodZh: '晴朗 · 22°C · 平静温润',
    collectionTagEn: 'Milestone · 2 Photos',
    collectionTagZh: '重要里程碑 · 2 张照片',
    storyEn:
      'Walked along the Brisbane River boardwalk as the bridge lights reflected across the evening water. Saved as a two-photo milestone in Our Story with direct links to both the chronological Timeline and the Brisbane Memory Map pin.',
    storyZh:
      '沿着布里斯班河木栈道缓步前行，暮色中的桥拱与暖金色灯光倒映在水面。作为双图里程碑归档于 Our Story，同时自动关联至编年时间轴与布里斯班记忆地图坐标点。',
    uxDesignNoteEn:
      'One cover print represents multi-photo memories in the gallery; opening the #20211E mount reveals the secondary photograph without cluttering the main grid.',
    uxDesignNoteZh:
      '画廊遵循“一则记忆一张封面”原则；进入 #20211E 详情画框后即可切换浏览同组第二张照片，避免主网格被重复连拍淹没。',
    layoutRole: 'feature-lead',
    photos: [
      {
        webp: LOVE_STORY_ASSET_SPEC.memories.brisbaneRiverwalk.webp,
        png: LOVE_STORY_ASSET_SPEC.memories.brisbaneRiverwalk.png,
        aspectRatio: '3 / 2',
        captionEn: 'Print 01 / 02 — Story Bridge & New Farm Riverwalk at dusk',
        captionZh: '画幅 01 / 02 — 暮色中的故事桥与河畔栈道光影',
      },
      {
        webp: LOVE_STORY_ASSET_SPEC.memories.brisbaneBotanic.webp,
        png: LOVE_STORY_ASSET_SPEC.memories.brisbaneBotanic.png,
        aspectRatio: '4 / 3',
        captionEn: 'Print 02 / 02 — Riverbend canopy walk toward the gardens',
        captionZh: '画幅 02 / 02 — 沿河湾步道行至植物园玻璃温室',
      },
    ],
  },
  {
    id: 'mem-102',
    indexLabel: '02',
    titleEn: 'Botanic Glasshouse Conservatory',
    titleZh: '植物园玻璃温室的午后光影',
    dateDisplayEn: 'Aug 24, 2026',
    dateDisplayZh: '2026年8月24日',
    shortDateEn: 'AUG 24',
    shortDateZh: '08月24日',
    isoDate: '2026-08-24',
    timeDisplay: '15:10',
    year: '2026',
    timelineOrder: 5,
    timelineProgressPct: 84,
    cityEn: 'Brisbane',
    cityZh: '布里斯班',
    countryEn: 'Australia',
    countryZh: '澳大利亚',
    placeDetailEn: 'City Botanic Gardens, Brisbane',
    placeDetailZh: '布里斯班城市植物园温室',
    latitude: -27.4756,
    longitude: 153.0301,
    coordinatesLabel: '27.4756° S, 153.0301° E',
    weatherMoodEn: 'Sunny · 24°C · Happy',
    weatherMoodZh: '晴日 · 24°C · 明朗欢愉',
    collectionTagEn: 'Everyday · Favorite',
    collectionTagZh: '日常点滴 · 精选收藏',
    storyEn:
      'Afternoon light filtering through the curved conservatory glass and stone pathways after a brief warm rain. Grouped alongside Riverwalk Evening Walk under the Brisbane place drawer.',
    storyZh:
      '阵雨初歇后的午后阳光穿透弧形玻璃穹顶，落在湿润的石径与蕨类叶片上。在记忆地图中与河畔漫步共同汇聚于布里斯班城市抽屉下。',
    uxDesignNoteEn:
      'Shares the Brisbane city coordinate so selecting Brisbane on the Memory Map surfaces both August and September memories together.',
    uxDesignNoteZh:
      '与上一则记忆共享布里斯班城市坐标，在记忆地图点击该城市即可同时调阅八月与九月的全部共同记忆。',
    layoutRole: 'upper-pair-a',
    photos: [
      {
        webp: LOVE_STORY_ASSET_SPEC.memories.brisbaneBotanic.webp,
        png: LOVE_STORY_ASSET_SPEC.memories.brisbaneBotanic.png,
        aspectRatio: '4 / 3',
        captionEn: 'Print 01 / 01 — Curved glass conservatory dome in afternoon sun',
        captionZh: '画幅 01 / 01 — 午后暖阳下的植物园弧形玻璃穹顶',
      },
    ],
  },
  {
    id: 'mem-103',
    indexLabel: '03',
    titleEn: 'Higashiyama Lantern Steps',
    titleZh: '京都东山石阶与暮色提灯',
    dateDisplayEn: 'May 12, 2026',
    dateDisplayZh: '2026年5月12日',
    shortDateEn: 'MAY 12',
    shortDateZh: '05月12日',
    isoDate: '2026-05-12',
    timeDisplay: '19:05',
    year: '2026',
    timelineOrder: 4,
    timelineProgressPct: 66,
    cityEn: 'Kyoto',
    cityZh: '京都',
    countryEn: 'Japan',
    countryZh: '日本',
    placeDetailEn: 'Higashiyama Ward, Kyoto',
    placeDetailZh: '日本京都东山石坂小路',
    latitude: 34.9977,
    longitude: 135.7812,
    coordinatesLabel: '34.9977° N, 135.7812° E',
    weatherMoodEn: 'Cloudy · 18°C · Grateful',
    weatherMoodZh: '微云 · 18°C · 心怀感念',
    collectionTagEn: 'Trips · Timeline Milestone',
    collectionTagZh: '同行旅途 · 时间轴里程碑',
    storyEn:
      'Quiet stone alleys lit by warm paper lanterns at twilight. Even when uploaded days after returning home, LoveStory anchors the memory to its true May 12 event date rather than upload timestamp.',
    storyZh:
      '薄暮时分被暖色纸提灯照亮的京都石阶小巷。即使在旅途归来数日后补录上传，系统依然严格按 5 月 12 日真实发生日期归档，而非按上传时间乱序排列。',
    uxDesignNoteEn:
      'Demonstrates chronological integrity: backfilled travel photos settle into May 2026 automatically instead of appearing as newly uploaded items.',
    uxDesignNoteZh:
      '体现真实事件日期排序逻辑：补录的旅行记忆会自动回归 2026 年 5 月位置，不会因稍晚上传而打乱叙事时序。',
    layoutRole: 'upper-pair-b',
    photos: [
      {
        webp: LOVE_STORY_ASSET_SPEC.memories.kyotoLanterns.webp,
        png: LOVE_STORY_ASSET_SPEC.memories.kyotoLanterns.png,
        aspectRatio: '4 / 3',
        captionEn: 'Print 01 / 01 — Evening lanterns along the Higashiyama stone path',
        captionZh: '画幅 01 / 01 — 东山石阶步道两侧渐次亮起的暮色提灯',
      },
    ],
  },
  {
    id: 'mem-104',
    indexLabel: '04',
    titleEn: 'Royal Arcade Espresso Pause',
    titleZh: '墨尔本皇家拱廊的避雨咖啡',
    dateDisplayEn: 'Feb 09, 2026',
    dateDisplayZh: '2026年2月9日',
    shortDateEn: 'FEB 09',
    shortDateZh: '02月09日',
    isoDate: '2026-02-09',
    timeDisplay: '14:40',
    year: '2026',
    timelineOrder: 3,
    timelineProgressPct: 46,
    cityEn: 'Melbourne',
    cityZh: '墨尔本',
    countryEn: 'Australia',
    countryZh: '澳大利亚',
    placeDetailEn: 'Royal Arcade, Melbourne',
    placeDetailZh: '墨尔本 Royal Arcade 历史玻璃拱廊',
    latitude: -37.8146,
    longitude: 144.9642,
    coordinatesLabel: '37.8146° S, 144.9642° E',
    weatherMoodEn: 'Rainy · 17°C · Warm',
    weatherMoodZh: '微雨 · 17°C · 温暖惬意',
    collectionTagEn: 'Everyday · Quiet Moment',
    collectionTagZh: '日常片段 · 静谧时刻',
    storyEn:
      'Sheltering from a sudden Melbourne shower beneath the heritage glass vault over two flat whites. Kept in the Moments gallery without cluttering the major milestone Timeline.',
    storyZh:
      '在墨尔本突如其来的阵雨中躲进十九世纪玻璃拱廊，伴着两杯热咖啡听雨声回荡。保留在 Moments 记忆画廊中，而未勾选加入主时间轴，让大小记忆各得其所。',
    uxDesignNoteEn:
      'Shows selective curation: everyday moments live richly in the photo gallery while keeping the main Timeline focused on key milestones.',
    uxDesignNoteZh:
      '展示分级策展机制：日常小确幸完整保存在记忆画廊中，同时保持主时间轴只聚焦于关键里程碑。',
    layoutRole: 'lower-trio',
    photos: [
      {
        webp: LOVE_STORY_ASSET_SPEC.memories.melbourneArcade.webp,
        png: LOVE_STORY_ASSET_SPEC.memories.melbourneArcade.png,
        aspectRatio: '3 / 2',
        captionEn: 'Print 01 / 01 — Heritage iron-and-glass vault during an afternoon shower',
        captionZh: '画幅 01 / 01 — 午后阵雨中的古典铸铁玻璃拱顶光影',
      },
    ],
  },
  {
    id: 'mem-105',
    indexLabel: '05',
    titleEn: 'Bamboo Courtyard Tea House',
    titleZh: '成都竹院茶舍的听雨午后',
    dateDisplayEn: 'Nov 03, 2025',
    dateDisplayZh: '2025年11月3日',
    shortDateEn: 'NOV 03',
    shortDateZh: '11月03日',
    isoDate: '2025-11-03',
    timeDisplay: '16:30',
    year: '2025',
    timelineOrder: 2,
    timelineProgressPct: 24,
    cityEn: 'Chengdu',
    cityZh: '成都',
    countryEn: 'China',
    countryZh: '中国',
    placeDetailEn: 'Kuanzhai Alley Courtyard, Chengdu',
    placeDetailZh: '成都宽窄巷子竹影庭院茶舍',
    latitude: 30.6698,
    longitude: 104.0531,
    coordinatesLabel: '30.6698° N, 104.0531° E',
    weatherMoodEn: 'Breezy · 16°C · Peaceful',
    weatherMoodZh: '微风细雨 · 16°C · 安宁闲适',
    collectionTagEn: 'Our Firsts · 2025 Archive',
    collectionTagZh: '第一次纪念 · 2025 馆藏',
    storyEn:
      'Listening to autumn rain on clay roof tiles over jasmine tea in Chengdu — one of the earliest shared entries recorded when we began building the archive in late 2025.',
    storyZh:
      '捧一杯茉莉盖碗茶，听秋雨滴落青瓦与竹叶——这是 2025 年底我们开始共同搭建这座数字记忆馆时最早收录的篇章之一。',
    uxDesignNoteEn:
      'Neutral #20211E framing preserves subtle low-saturation courtyard tones without casting artificial UI tint over the photograph.',
    uxDesignNoteZh:
      '#20211E 中性暗色画框忠实还原低饱和度的竹院雨雾色调，不让任何高饱和 UI 边框干扰照片原色。',
    layoutRole: 'lower-trio',
    photos: [
      {
        webp: LOVE_STORY_ASSET_SPEC.memories.chengduTeahouse.webp,
        png: LOVE_STORY_ASSET_SPEC.memories.chengduTeahouse.png,
        aspectRatio: '3 / 2',
        captionEn: 'Print 01 / 01 — Rain ripples and timber pavilion eaves in Chengdu',
        captionZh: '画幅 01 / 01 — 竹院飞檐与雨滴落入水面的同心波纹',
      },
    ],
  },
  {
    id: 'mem-106',
    indexLabel: '06',
    titleEn: 'Hulunbeier Highland Horizon',
    titleZh: '呼伦贝尔高原的金色地平线',
    dateDisplayEn: 'Aug 19, 2025',
    dateDisplayZh: '2025年8月19日',
    shortDateEn: 'AUG 19',
    shortDateZh: '08月19日',
    isoDate: '2025-08-19',
    timeDisplay: '17:45',
    year: '2025',
    timelineOrder: 1,
    timelineProgressPct: 7,
    cityEn: 'Hulunbeier',
    cityZh: '呼伦贝尔',
    countryEn: 'China',
    countryZh: '中国',
    placeDetailEn: 'Morigele River Valley, Hulunbeier',
    placeDetailZh: '呼伦贝尔莫日格勒河谷高地',
    latitude: 49.2153,
    longitude: 119.7581,
    coordinatesLabel: '49.2153° N, 119.7581° E',
    weatherMoodEn: 'Sunny · 21°C · Excited',
    weatherMoodZh: '晴空 · 21°C · 辽阔振奋',
    collectionTagEn: 'Trips · First Journey',
    collectionTagZh: '同行旅途 · 首次远行',
    storyEn:
      'Endless golden grassland meeting the late-summer sky across the northern plateau — our first long journey together and the earliest pin on the orthographic Memory Map.',
    storyZh:
      '无垠的金色草原与夏末高原的深邃天际相连——这是我们共同踏上的第一段远途，也是正射投影记忆地图上最早点亮的北方坐标。',
    uxDesignNoteEn:
      'Wide 16:10 horizon framing adapts naturally inside the detail mount without forced square cropping.',
    uxDesignNoteZh:
      '16:10 宽幅地平线构图在详情画框中保持原生比例展示，绝不强制裁切为千篇一律的正方形缩略图。',
    layoutRole: 'lower-trio',
    photos: [
      {
        webp: LOVE_STORY_ASSET_SPEC.memories.hulunbeierSteppe.webp,
        png: LOVE_STORY_ASSET_SPEC.memories.hulunbeierSteppe.png,
        aspectRatio: '16 / 10',
        captionEn: 'Print 01 / 01 — Winding river valley across the golden highland steppe',
        captionZh: '画幅 01 / 01 — 蜿蜒穿过金色草原高地的莫日格勒河谷',
      },
    ],
  },
]

export const LOVE_STORY_CHRONOLOGICAL_MEMORIES: ReadonlyArray<LoveStoryDemoMemoryItem> =
  [...LOVE_STORY_DEMO_MEMORIES].sort(
    (a, b) => a.timelineOrder - b.timelineOrder
  )

interface LoveStoryMemoryGalleryProps {
  isZh: boolean
  selectedSharedMemoryId?: string
  onSelectSharedMemory?: (memoryId: string) => void
  initialOpenDetailMemoryId?: string | null
  onClearInitialOpenDetail?: () => void
  onJumpToMemoryMap?: (memoryId: string) => void
  isExternalModalOpen?: boolean
}

type GalleryFilterKey = 'all' | '2026' | '2025' | 'brisbane'

export const LoveStoryMemoryGallery: React.FC<LoveStoryMemoryGalleryProps> = ({
  isZh,
  selectedSharedMemoryId,
  onSelectSharedMemory,
  initialOpenDetailMemoryId = null,
  onClearInitialOpenDetail,
  onJumpToMemoryMap,
  isExternalModalOpen = false,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion())

  const [activeFilter, setActiveFilter] = useState<GalleryFilterKey>('all')
  const [hoveredMemoryId, setHoveredMemoryId] = useState<string | null>(null)
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(
    initialOpenDetailMemoryId
  )
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0)
  const [isUxInsightOpen, setIsUxInsightOpen] = useState<boolean>(false)

  const cardButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const detailCloseBtnRef = useRef<HTMLButtonElement | null>(null)
  const lastSelectedIdRef = useRef<string | null>(
    selectedSharedMemoryId ?? null
  )
  const shouldRestoreCardFocusRef = useRef<boolean>(false)

  // Synchronise when jumping back from Timeline × Memory Map ("Open in Memory Gallery")
  useEffect(() => {
    if (initialOpenDetailMemoryId) {
      setActiveFilter('all')
      setActivePhotoIdx(0)
      setSelectedMemoryId(initialOpenDetailMemoryId)
      lastSelectedIdRef.current = initialOpenDetailMemoryId
      onClearInitialOpenDetail?.()
    }
  }, [initialOpenDetailMemoryId, onClearInitialOpenDetail])

  const filteredMemories = LOVE_STORY_DEMO_MEMORIES.filter((item) => {
    if (activeFilter === '2026') return item.year === '2026'
    if (activeFilter === '2025') return item.year === '2025'
    if (activeFilter === 'brisbane') return item.cityEn === 'Brisbane'
    return true
  })

  const activeMemoryIndex = selectedMemoryId
    ? LOVE_STORY_DEMO_MEMORIES.findIndex((m) => m.id === selectedMemoryId)
    : -1
  const activeMemory =
    activeMemoryIndex >= 0
      ? LOVE_STORY_DEMO_MEMORIES[activeMemoryIndex]
      : null

  const currentPhoto =
    activeMemory?.photos[activePhotoIdx] ?? activeMemory?.photos[0] ?? null

  const handleSelectMemory = useCallback(
    (memoryId: string) => {
      lastSelectedIdRef.current = memoryId
      setActivePhotoIdx(0)
      setSelectedMemoryId(memoryId)
      onSelectSharedMemory?.(memoryId)
    },
    [onSelectSharedMemory]
  )

  const handleCloseDetail = useCallback(() => {
    shouldRestoreCardFocusRef.current = true
    setActivePhotoIdx(0)
    setSelectedMemoryId(null)
  }, [])

  const handlePrevMemory = useCallback(() => {
    if (activeMemoryIndex < 0) return
    const prevIdx =
      (activeMemoryIndex - 1 + LOVE_STORY_DEMO_MEMORIES.length) %
      LOVE_STORY_DEMO_MEMORIES.length
    const prevItem = LOVE_STORY_DEMO_MEMORIES[prevIdx]
    lastSelectedIdRef.current = prevItem.id
    setActivePhotoIdx(0)
    setSelectedMemoryId(prevItem.id)
    onSelectSharedMemory?.(prevItem.id)
  }, [activeMemoryIndex, onSelectSharedMemory])

  const handleNextMemory = useCallback(() => {
    if (activeMemoryIndex < 0) return
    const nextIdx = (activeMemoryIndex + 1) % LOVE_STORY_DEMO_MEMORIES.length
    const nextItem = LOVE_STORY_DEMO_MEMORIES[nextIdx]
    lastSelectedIdRef.current = nextItem.id
    setActivePhotoIdx(0)
    setSelectedMemoryId(nextItem.id)
    onSelectSharedMemory?.(nextItem.id)
  }, [activeMemoryIndex, onSelectSharedMemory])

  // Manage focus when opening/closing the detail view
  useEffect(() => {
    if (selectedMemoryId !== null) {
      const timer = window.setTimeout(() => {
        detailCloseBtnRef.current?.focus({ preventScroll: true })
      }, 60)
      return () => window.clearTimeout(timer)
    } else if (shouldRestoreCardFocusRef.current) {
      shouldRestoreCardFocusRef.current = false
      const targetId = lastSelectedIdRef.current
      const timer = window.setTimeout(() => {
        if (targetId && cardButtonRefs.current[targetId]) {
          cardButtonRefs.current[targetId]?.focus({ preventScroll: true })
        }
      }, 60)
      return () => window.clearTimeout(timer)
    }
  }, [selectedMemoryId])

  // Keyboard navigation inside detail view (ArrowLeft / ArrowRight / Escape)
  useEffect(() => {
    if (!selectedMemoryId || isExternalModalOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        handleCloseDetail()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevMemory()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNextMemory()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    selectedMemoryId,
    isExternalModalOpen,
    handleCloseDetail,
    handlePrevMemory,
    handleNextMemory,
  ])

  const motionTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const }

  const filterOptions: ReadonlyArray<{
    key: GalleryFilterKey
    labelEn: string
    labelZh: string
    count: number
  }> = [
    {
      key: 'all',
      labelEn: 'All Memories',
      labelZh: '全部记忆',
      count: LOVE_STORY_DEMO_MEMORIES.length,
    },
    {
      key: '2026',
      labelEn: '2026',
      labelZh: '2026 年',
      count: LOVE_STORY_DEMO_MEMORIES.filter((m) => m.year === '2026').length,
    },
    {
      key: '2025',
      labelEn: '2025',
      labelZh: '2025 年',
      count: LOVE_STORY_DEMO_MEMORIES.filter((m) => m.year === '2025').length,
    },
    {
      key: 'brisbane',
      labelEn: 'Brisbane',
      labelZh: '布里斯班',
      count: LOVE_STORY_DEMO_MEMORIES.filter((m) => m.cityEn === 'Brisbane')
        .length,
    },
  ]

  return (
    <section
      className="ls-interactive-memory-gallery"
      aria-labelledby="ls-memory-gallery-heading"
      data-gallery-state={selectedMemoryId ? 'detail' : 'grid'}
    >
      {/* Top Editorial Bar: Title, Filter Pills, and Discreet UX Design Insight Toggle */}
      <header className="ls-mg-header">
        <div className="ls-mg-title-cluster">
          <div className="ls-mg-eyebrow-row">
            <span className="ls-mg-demo-badge">
              {isZh
                ? '交互式作品集演示 · 隐私安全展示样本'
                : 'INTERACTIVE PORTFOLIO DEMO · PRIVACY-SAFE ARCHIVE FIXTURES'}
            </span>
            <span className="ls-mg-count-meta">
              {isZh
                ? '6 则记忆 · 7 张画幅 · 5 座城市'
                : '6 MEMORIES · 7 PRINTS · 5 PLACES'}
            </span>
          </div>
          <h4 id="ls-memory-gallery-heading" className="ls-mg-heading">
            {isZh
              ? '亲自探索记忆画廊：悬停或点选任意相纸画框，步入 #20211E 原色故事内页'
              : 'Explore the Memory Archive: Select any photograph to open its #20211E story frame'}
          </h4>
        </div>

        <div className="ls-mg-controls-row">
          {/* Curated Filter Pills */}
          <div
            className="ls-mg-filter-bar"
            role="group"
            aria-label={
              isZh ? '按年份或城市筛选记忆' : 'Filter memories by year or city'
            }
          >
            {filterOptions.map((opt) => {
              const isSelected = activeFilter === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  data-mg-filter={opt.key}
                  aria-pressed={isSelected}
                  className={`ls-mg-filter-pill ${isSelected ? 'is-active' : ''}`}
                  onClick={() => {
                    setActiveFilter(opt.key)
                    if (selectedMemoryId) {
                      setSelectedMemoryId(null)
                    }
                  }}
                >
                  <span>{isZh ? opt.labelZh : opt.labelEn}</span>
                  <span className="ls-mg-filter-count">{opt.count}</span>
                </button>
              )
            })}
          </div>

          {/* Discreet UX Design Insight Toggle ("Why this interaction?" / "为什么这样设计？") */}
          <button
            type="button"
            className={`ls-mg-ux-insight-toggle ${
              isUxInsightOpen ? 'is-open' : ''
            }`}
            data-ux-insight-toggle="memory-gallery"
            aria-expanded={isUxInsightOpen}
            aria-controls="ls-mg-ux-insight-panel"
            onClick={() => setIsUxInsightOpen((prev) => !prev)}
          >
            <span className="ls-mg-ux-dot" aria-hidden="true" />
            <span>
              {isZh ? '为什么这样设计？' : 'Why this interaction?'}
            </span>
            <span className="ls-mg-ux-chevron" aria-hidden="true">
              {isUxInsightOpen ? '−' : '+'}
            </span>
          </button>
        </div>
      </header>

      {/* Collapsible UX Design Insight Drawer (Collapsed by default) */}
      <AnimatePresence initial={false}>
        {isUxInsightOpen ? (
          <motion.div
            id="ls-mg-ux-insight-panel"
            className="ls-mg-ux-insight-drawer"
            role="region"
            aria-label={
              isZh
                ? '记忆画廊交互设计原理解析'
                : 'Memory Gallery UX design rationale'
            }
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={motionTransition}
          >
            <div className="ls-mg-ux-insight-grid">
              <div className="ls-mg-ux-insight-cell">
                <span className="ls-mg-ux-cell-kicker">
                  {isZh ? '01 · 用户痛点与需求 (USER NEED)' : '01 · USER NEED'}
                </span>
                <p className="ls-mg-ux-cell-text">
                  {isZh
                    ? '伴侣希望直观地重温共同记忆，而无需在冗长嘈杂的聊天记录或按上传时间混乱排列的相册流中费力翻找。'
                    : 'Rediscover shared memories visually across time and place without scrolling through lengthy chronological lists or chat feeds.'}
                </p>
              </div>
              <div className="ls-mg-ux-insight-cell">
                <span className="ls-mg-ux-cell-kicker">
                  {isZh
                    ? '02 · 核心设计决策 (DESIGN DECISION)'
                    : '02 · DESIGN DECISION'}
                </span>
                <p className="ls-mg-ux-cell-text">
                  {isZh
                    ? '采用非对称相纸画框构图（#20211E），每则记忆仅以一张封面代表，默认收敛次要元数据，让视线首先停留在影像本身。'
                    : 'Use asymmetric visual gallery browsing on neutral #20211E photo mounts with one cover print per memory and direct access to contextual details.'}
                </p>
              </div>
              <div className="ls-mg-ux-insight-cell">
                <span className="ls-mg-ux-cell-kicker">
                  {isZh
                    ? '03 · 交互体验反馈 (INTERACTION)'
                    : '03 · INTERACTION'}
                </span>
                <p className="ls-mg-ux-cell-text">
                  {isZh
                    ? '点选任意照片即可原位展开其故事画框，完整保留画廊上下文，并支持键盘方向键切换记忆或一键跳转至记忆地图。'
                    : 'Select any photograph to reveal its story inside an archival mount while preserving surrounding gallery context and keyboard navigation.'}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Main Interactive Stage: Either Asymmetric Curated Mosaic OR Expanded Archival Detail Frame */}
      <AnimatePresence mode="sync">
        {activeMemory === null ? (
          /* ================================================================
             INITIAL STATE — ASYMMETRIC CURATED PHOTOGRAPHIC GALLERY MOSAIC
             ================================================================ */
          <motion.div
            key={`ls-mg-mosaic-${activeFilter}`}
            className={`ls-mg-asymmetric-mosaic ${
              hoveredMemoryId !== null ? 'has-hovered-memory' : ''
            } ${
              activeFilter !== 'all' ? 'is-filtered-subset' : ''
            }`}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
            transition={motionTransition}
          >
            {filteredMemories.map((memory) => {
              const coverPhoto = memory.photos[0]
              const isHovered = hoveredMemoryId === memory.id
              const isSharedSelected = selectedSharedMemoryId === memory.id
              const title = isZh ? memory.titleZh : memory.titleEn
              const dateText = isZh ? memory.dateDisplayZh : memory.dateDisplayEn
              const cityText = isZh ? memory.cityZh : memory.cityEn
              const weatherText = isZh
                ? memory.weatherMoodZh
                : memory.weatherMoodEn
              const tagText = isZh
                ? memory.collectionTagZh
                : memory.collectionTagEn

              return (
                <motion.article
                  key={memory.id}
                  layoutId={
                    prefersReducedMotion
                      ? undefined
                      : `ls-memory-frame-${memory.id}`
                  }
                  className={`ls-mg-print-card role-${memory.layoutRole} ${
                    isHovered ? 'is-hovered' : ''
                  } ${
                    isSharedSelected ? 'is-shared-selected' : ''
                  } ${memory.photos.length > 1 ? 'has-multi-prints' : ''}`}
                  data-memory-id={memory.id}
                >
                  <button
                    ref={(el) => {
                      cardButtonRefs.current[memory.id] = el
                    }}
                    type="button"
                    className="ls-mg-print-trigger"
                    data-memory-trigger={memory.id}
                    aria-label={
                      isZh
                        ? `打开记忆详情：${title}（${dateText} · ${cityText}）`
                        : `Open memory detail: ${title} (${dateText} · ${cityText})`
                    }
                    onMouseEnter={() => setHoveredMemoryId(memory.id)}
                    onMouseLeave={() =>
                      setHoveredMemoryId((prev) =>
                        prev === memory.id ? null : prev
                      )
                    }
                    onFocus={() => setHoveredMemoryId(memory.id)}
                    onBlur={() =>
                      setHoveredMemoryId((prev) =>
                        prev === memory.id ? null : prev
                      )
                    }
                    onClick={() => handleSelectMemory(memory.id)}
                  >
                    {/* #20211E Archival Photo Mount */}
                    <div
                      className="ls-mg-photo-mount"
                      style={{ aspectRatio: coverPhoto.aspectRatio }}
                    >
                      {memory.photos.length > 1 ? (
                        <span
                          className="ls-mg-multi-stack-sheet"
                          aria-hidden="true"
                        />
                      ) : null}

                      <picture className="ls-mg-picture">
                        <source srcSet={coverPhoto.webp} type="image/webp" />
                        <img
                          src={coverPhoto.png}
                          alt={`${title} — ${
                            isZh ? coverPhoto.captionZh : coverPhoto.captionEn
                          }`}
                          className="ls-mg-img"
                          loading="eager"
                          decoding="async"
                        />
                      </picture>

                      {/* Top-right subtle archival index / collection badge */}
                      <span className="ls-mg-mount-badge">{tagText}</span>

                      {/* Subtle Hover/Focus Whisper Overlay */}
                      <div className="ls-mg-hover-whisper" aria-hidden="true">
                        <span className="ls-mg-whisper-weather">
                          {weatherText}
                        </span>
                        <span className="ls-mg-whisper-cta">
                          {isZh ? '翻阅记忆 →' : 'Open memory →'}
                        </span>
                      </div>
                    </div>

                    {/* Discreet Editorial Caption Footnote */}
                    <div className="ls-mg-print-caption-bar">
                      <div className="ls-mg-print-meta-line">
                        <span className="ls-mg-print-index">
                          {memory.indexLabel}
                        </span>
                        <span className="ls-mg-print-date">{dateText}</span>
                        <span className="ls-mg-print-dot" aria-hidden="true">
                          ·
                        </span>
                        <span className="ls-mg-print-place">{cityText}</span>
                      </div>
                      <h5 className="ls-mg-print-title">{title}</h5>
                    </div>
                  </button>
                </motion.article>
              )
            })}
          </motion.div>
        ) : (
          /* ================================================================
             EXPANDED MEMORY DETAIL VIEW (#20211E ARCHIVAL MOUNT)
             ================================================================ */
          <motion.div
            key="ls-mg-detail-stage"
            layoutId={
              prefersReducedMotion
                ? undefined
                : `ls-memory-frame-${activeMemory.id}`
            }
            className="ls-mg-detail-stage"
            role="region"
            aria-labelledby="ls-mg-detail-title"
            data-memory-detail-id={activeMemory.id}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
            transition={motionTransition}
          >
            {/* Detail Top Navigation Bar */}
            <div className="ls-mg-detail-topbar">
              <button
                ref={detailCloseBtnRef}
                type="button"
                className="ls-mg-return-btn"
                data-mg-action="close-detail"
                onClick={handleCloseDetail}
              >
                <ArrowLeftIcon size={15} />
                <span>
                  {isZh
                    ? '返回记忆画廊 (Esc)'
                    : 'Return to Gallery (Esc)'}
                </span>
              </button>

              <div className="ls-mg-detail-position">
                <span>
                  {isZh
                    ? `记忆档案 ${activeMemory.indexLabel} / 06`
                    : `MEMORY ${activeMemory.indexLabel} OF 06`}
                </span>
                <span className="ls-mg-detail-sep" aria-hidden="true">
                  ·
                </span>
                <span>
                  {isZh ? activeMemory.cityZh : activeMemory.cityEn}
                </span>
              </div>

              <div
                className="ls-mg-detail-nav-group"
                role="group"
                aria-label={
                  isZh ? '切换上一则或下一则记忆' : 'Navigate between memories'
                }
              >
                <button
                  type="button"
                  className="ls-mg-step-btn"
                  data-mg-action="prev-memory"
                  onClick={handlePrevMemory}
                  aria-label={
                    isZh ? '上一则记忆 (←)' : 'Previous memory (ArrowLeft)'
                  }
                >
                  <ArrowLeftIcon size={14} />
                  <span>{isZh ? '上一则' : 'Previous'}</span>
                </button>
                <button
                  type="button"
                  className="ls-mg-step-btn"
                  data-mg-action="next-memory"
                  onClick={handleNextMemory}
                  aria-label={
                    isZh ? '下一则记忆 (→)' : 'Next memory (ArrowRight)'
                  }
                >
                  <span>{isZh ? '下一则' : 'Next'}</span>
                  <ArrowRightIcon size={14} />
                </button>
              </div>
            </div>

            {/* Main #20211E Photographic Detail Frame + Story Column */}
            <div className="ls-mg-detail-body-grid">
              {/* Left / Primary Column: Large Photograph in #20211E Archival Mount */}
              <div className="ls-mg-detail-photo-column">
                {currentPhoto ? (
                  <figure className="ls-mg-detail-figure">
                    <div
                      className="ls-mg-detail-photo-frame"
                      style={{ aspectRatio: currentPhoto.aspectRatio }}
                    >
                      <picture className="ls-mg-detail-picture">
                        <source
                          srcSet={currentPhoto.webp}
                          type="image/webp"
                        />
                        <img
                          src={currentPhoto.png}
                          alt={`${
                            isZh ? activeMemory.titleZh : activeMemory.titleEn
                          } — ${
                            isZh
                              ? currentPhoto.captionZh
                              : currentPhoto.captionEn
                          }`}
                          className="ls-mg-detail-img"
                        />
                      </picture>

                      {/* Multi-print switcher inside the mount when memory has >1 photo */}
                      {activeMemory.photos.length > 1 ? (
                        <div
                          className="ls-mg-multi-photo-bar"
                          role="group"
                          aria-label={
                            isZh
                              ? '切换同组记忆画幅'
                              : 'Switch photographs in this memory'
                          }
                        >
                          {activeMemory.photos.map((ph, pIdx) => (
                            <button
                              key={ph.png}
                              type="button"
                              data-mg-photo-idx={pIdx}
                              aria-pressed={activePhotoIdx === pIdx}
                              className={`ls-mg-photo-Idx-pill ${
                                activePhotoIdx === pIdx ? 'is-active' : ''
                              }`}
                              onClick={() => setActivePhotoIdx(pIdx)}
                            >
                              {isZh
                                ? `画幅 0${pIdx + 1} / 0${activeMemory.photos.length}`
                                : `Print 0${pIdx + 1} / 0${activeMemory.photos.length}`}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <figcaption className="ls-mg-detail-figcaption">
                      <span>
                        {isZh
                          ? currentPhoto.captionZh
                          : currentPhoto.captionEn}
                      </span>
                      <span className="ls-mg-detail-coords">
                        {activeMemory.coordinatesLabel}
                      </span>
                    </figcaption>
                  </figure>
                ) : null}
              </div>

              {/* Right Column: Archival Metadata, Story Narrative & UX Connection */}
              <div className="ls-mg-detail-story-column">
                <div className="ls-mg-detail-meta-header">
                  <span className="ls-mg-detail-date-time">
                    {isZh
                      ? `${activeMemory.dateDisplayZh} · ${activeMemory.timeDisplay}`
                      : `${activeMemory.dateDisplayEn.toUpperCase()} · ${activeMemory.timeDisplay}`}
                  </span>

                  <h3 id="ls-mg-detail-title" className="ls-mg-detail-title">
                    {isZh ? activeMemory.titleZh : activeMemory.titleEn}
                  </h3>

                  <div className="ls-mg-detail-place-row">
                    <span className="ls-mg-detail-place-name">
                      {isZh
                        ? activeMemory.placeDetailZh
                        : activeMemory.placeDetailEn}
                    </span>
                    {onJumpToMemoryMap ? (
                      <button
                        type="button"
                        className="ls-mg-map-jump-btn"
                        data-mg-action="locate-on-map"
                        onClick={() => onJumpToMemoryMap(activeMemory.id)}
                      >
                        <span>
                          {isZh
                            ? '在记忆地图中查看坐标'
                            : 'Locate on Memory Map'}
                        </span>
                        <ArrowUpRightIcon size={13} />
                      </button>
                    ) : null}
                  </div>

                  <div className="ls-mg-detail-Context-chips">
                    <span className="ls-mg-context-chip">
                      {isZh
                        ? activeMemory.weatherMoodZh
                        : activeMemory.weatherMoodEn}
                    </span>
                    <span className="ls-mg-context-chip is-gold">
                      {isZh
                        ? activeMemory.collectionTagZh
                        : activeMemory.collectionTagEn}
                    </span>
                  </div>
                </div>

                <div className="ls-mg-detail-story-block">
                  <p className="ls-mg-detail-story-copy">
                    {isZh ? activeMemory.storyZh : activeMemory.storyEn}
                  </p>
                </div>

                {/* Contextual UX Design Note for this Memory */}
                <aside className="ls-mg-detail-ux-callout">
                  <span className="ls-mg-detail-ux-kicker">
                    {isZh
                      ? '此记忆体现的 UX 设计细节'
                      : 'UX DESIGN DECISION IN THIS MEMORY'}
                  </span>
                  <p className="ls-mg-detail-ux-copy">
                    {isZh
                      ? activeMemory.uxDesignNoteZh
                      : activeMemory.uxDesignNoteEn}
                  </p>
                </aside>
              </div>
            </div>

            {/* Bottom Filmstrip Strip for Direct Memory Switching */}
            <div
              className="ls-mg-detail-filmstrip"
              role="group"
              aria-label={isZh ? '快速切换馆藏记忆' : 'Quickly switch memories'}
            >
              {LOVE_STORY_DEMO_MEMORIES.map((item) => {
                const isCurrent = item.id === activeMemory.id
                const itemTitle = isZh ? item.titleZh : item.titleEn
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-mg-strip-item={item.id}
                    aria-current={isCurrent ? 'true' : undefined}
                    className={`ls-mg-strip-thumb ${
                      isCurrent ? 'is-current' : ''
                    }`}
                    onClick={() => handleSelectMemory(item.id)}
                  >
                    <div className="ls-mg-strip-img-wrap">
                      <img
                        src={item.photos[0].webp}
                        alt={itemTitle}
                        className="ls-mg-strip-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="ls-mg-strip-meta">
                      <span className="ls-mg-strip-idx">{item.indexLabel}</span>
                      <span className="ls-mg-strip-name">{itemTitle}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
