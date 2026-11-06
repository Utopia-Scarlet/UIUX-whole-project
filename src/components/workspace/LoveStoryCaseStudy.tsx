import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from '../icons/WorkspaceIcons'
import {
  LOVE_STORY_ASSET_SPEC,
  PROJECT_IDS,
  type LoveStoryExperienceData,
  type LoveStoryVisualAssetSlot,
  type ProjectId,
  type ProjectShellData,
} from '../../data/portfolioData'
import {
  LoveStoryEvidencePicture,
  LoveStoryLightboxModal,
  type EnlargedMediaItem,
} from './LoveStoryArchiveMedia'
import {
  LoveStoryUxDiscoveryCanvas,
  type DesignOutcomeDeepLink,
} from './LoveStoryUxDiscoveryCanvas'
import { LoveStoryMemoryGallery } from './LoveStoryMemoryGallery'
import { LoveStoryTimelineMapExplorer } from './LoveStoryTimelineMapExplorer'
import { LoveStoryPrivateArchiveDemo } from './LoveStoryPrivateArchiveDemo'
import { LoveStoryDesignSystemShowcase } from './LoveStoryDesignSystemShowcase'

export type LoveStoryArchiveId =
  | 'archive-01'
  | 'archive-02'
  | 'archive-03'
  | 'archive-04'
  | 'archive-05'

const ARCHIVE_ORDER: ReadonlyArray<LoveStoryArchiveId> = [
  'archive-01',
  'archive-02',
  'archive-03',
  'archive-04',
  'archive-05',
]

interface LoveStoryCaseStudyProps {
  project: ProjectShellData
  allProjects: Record<ProjectId, ProjectShellData>
  loveStoryData: LoveStoryExperienceData
  backToPortfolioLabel: string
  nextProjectLabel: string
  onBackToPortfolio: () => void
  onSelectProject: (projectId: ProjectId) => void
}

interface ArchiveEntryMeta {
  id: LoveStoryArchiveId
  number: string
  codeTitle: string
  title: string
  topic: string
  designQuestion: string
  surfaceTone: 'dark-featured' | 'paper' | 'paper-exhibition' | 'paper-deep'
  explorePrompt: string
  previewSlot: LoveStoryVisualAssetSlot
  previewCaption: string
}

interface ExperienceExhibitionArea {
  id: 'moments' | 'timeline' | 'map' | 'private-mobile'
  code: string
  tabLabel: string
  title: string
  subtitle: string
  statusBadge: string
  uxSummary: string
  uxInsights: string[]
  primaryMedia: {
    slot: LoveStoryVisualAssetSlot
    title: string
    caption: string
    badge: string
  }
  supportingMedia: {
    slot: LoveStoryVisualAssetSlot
    title: string
    caption: string
    badge: string
  }[]
}

export const LoveStoryCaseStudy: React.FC<LoveStoryCaseStudyProps> = ({
  project,
  allProjects,
  loveStoryData,
  backToPortfolioLabel,
  nextProjectLabel,
  onBackToPortfolio,
  onSelectProject,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion())
  const isZh = loveStoryData.scenes[0]?.title !== 'The Story'

  // Single source of truth for Archive selection (null = STATE A Archive Index)
  const [selectedArchiveId, setSelectedArchiveId] =
    useState<LoveStoryArchiveId | null>(null)

  // Focused stage interactive sub-states (preserved across EN / 中文 switches)
  const [activeNeedIndex, setActiveNeedIndex] = useState<number>(0)
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0) // -1 = Central Hub
  const [activeExhibitionAreaIdx, setActiveExhibitionAreaIdx] =
    useState<number>(0)
  const [activeSupportingMediaIdx, setActiveSupportingMediaIdx] =
    useState<number>(0)
  // Single shared memory selection state across Archive 03 Gallery, Timeline, and Memory Map
  const [selectedDemoMemoryId, setSelectedDemoMemoryId] =
    useState<string>('mem-101')
  const [pendingGalleryDetailId, setPendingGalleryDetailId] = useState<
    string | null
  >(null)
  const [activeDsSurfaceTheme, setActiveDsSurfaceTheme] = useState<
    'dark' | 'light' | 'split'
  >('split')
  const [activeDsScreenKey, setActiveDsScreenKey] = useState<
    'hub' | 'timeline' | 'unlock'
  >('hub')
  const [activeIterationIndex, setActiveIterationIndex] = useState<number>(0)
  const [showMoreDetail, setShowMoreDetail] = useState<boolean>(false)
  const [enlargedMedia, setEnlargedMedia] = useState<EnlargedMediaItem | null>(
    null
  )

  // Focus & scroll restoration refs between Index and Focused Archive
  const indexEntryRefs = useRef<
    Record<LoveStoryArchiveId, HTMLButtonElement | null>
  >({
    'archive-01': null,
    'archive-02': null,
    'archive-03': null,
    'archive-04': null,
    'archive-05': null,
  })
  const lastOpenedArchiveRef = useRef<LoveStoryArchiveId | null>(null)
  const savedIndexScrollYRef = useRef<number>(0)
  const focusedHeadingRef = useRef<HTMLHeadingElement | null>(null)
  const shouldRestoreIndexFocusRef = useRef<boolean>(false)

  const currentIdx = PROJECT_IDS.indexOf(project.id)
  const nextProjectId = PROJECT_IDS[(currentIdx + 1) % PROJECT_IDS.length]
  const nextProject = allProjects[nextProjectId]

  const enlargeLabel = isZh ? '点击放大检视' : 'Click to Enlarge'
  const closeModalLabel = isZh ? '关闭大图' : 'Close Preview'

  const archives: ReadonlyArray<ArchiveEntryMeta> = isZh
    ? [
        {
          id: 'archive-01',
          number: '01',
          codeTitle: 'ARCHIVE 01 — WHY WE BUILT IT',
          title: '为什么构建它：真实需求与界面实证',
          topic: '用户需求与设计要求',
          designQuestion:
            '两个人如何在时间与空间维度珍藏共同记忆，而不让珍贵瞬间淹没在日常聊天流中？',
          surfaceTone: 'dark-featured',
          explorePrompt: '查看需求与实证界面',
          previewSlot: LOVE_STORY_ASSET_SPEC.indexPreviews['archive-01'],
          previewCaption: '共享空间状态抽屉与双人加入指引实机截图',
        },
        {
          id: 'archive-02',
          number: '02',
          codeTitle: 'ARCHIVE 02 — CONNECTING MEMORIES',
          title: '连接记忆脉络：信息架构与模块流转',
          topic: '信息架构与核心用户流',
          designQuestion:
            '如何将照片、时间轴、地理坐标、未来计划与私密空间围绕同一核心有机相连？',
          surfaceTone: 'paper',
          explorePrompt: '探索架构星群与界面',
          previewSlot: LOVE_STORY_ASSET_SPEC.indexPreviews['archive-02'],
          previewCaption: 'Our Space 核心空间全景实机截图',
        },
        {
          id: 'archive-03',
          number: '03',
          codeTitle: 'ARCHIVE 03 — EXPERIENCE THE MEMORIES',
          title: '沉浸式记忆体验：核心界面与交互展陈',
          topic: '核心 UI 与交互体验',
          designQuestion:
            '在 Dark Archive 深色画框中，界面如何退后一步，让照片与记忆故事成为视觉中心？',
          surfaceTone: 'paper-exhibition',
          explorePrompt: '进入界面视觉展厅',
          previewSlot: LOVE_STORY_ASSET_SPEC.indexPreviews['archive-03'],
          previewCaption: 'Moments 记忆详情画框 (#20211E) 实机截图',
        },
        {
          id: 'archive-04',
          number: '04',
          codeTitle: 'ARCHIVE 04 — MADE WITH INTENTION',
          title: '双境视觉与秩序：设计系统与组件样本',
          topic: '视觉与交互设计系统',
          designQuestion:
            'Dark Archive (#10110F) 与 Paper & Ink (#F3EFE7) 双境主题如何在真实界面中协同？',
          surfaceTone: 'paper',
          explorePrompt: '对比双境主题与组件',
          previewSlot: LOVE_STORY_ASSET_SPEC.indexPreviews['archive-04'],
          previewCaption: 'Paper & Ink 浅色纸本主题实机截图',
        },
        {
          id: 'archive-05',
          number: '05',
          codeTitle: 'ARCHIVE 05 — BUILT & BEYOND',
          title: '工程实现与演进：真实迭代与视觉结果',
          topic: '工程落地、真实迭代与反思',
          designQuestion:
            '真实双人使用反馈如何推动共享空间同步、时间轴时序与移动端全屏编辑器重构？',
          surfaceTone: 'paper-deep',
          explorePrompt: '检视三轮迭代视觉结果',
          previewSlot: LOVE_STORY_ASSET_SPEC.indexPreviews['archive-05'],
          previewCaption: 'Chronological Timeline 严格时序界面实机截图',
        },
      ]
    : [
        {
          id: 'archive-01',
          number: '01',
          codeTitle: 'ARCHIVE 01 — WHY WE BUILT IT',
          title: 'Why We Built It',
          topic: 'User Needs & Design Requirements',
          designQuestion:
            'How can two people preserve shared moments across time and place without losing them inside noisy everyday chat feeds?',
          surfaceTone: 'dark-featured',
          explorePrompt: 'Inspect Needs & UI Evidence',
          previewSlot: LOVE_STORY_ASSET_SPEC.indexPreviews['archive-01'],
          previewCaption: 'Live Shared Space & Profile Drawer UI',
        },
        {
          id: 'archive-02',
          number: '02',
          codeTitle: 'ARCHIVE 02 — CONNECTING MEMORIES',
          title: 'Connecting Memories',
          topic: 'Information Architecture & User Flows',
          designQuestion:
            'How do Moments, Timeline, Memory Map, Future Plans, Countdown, and Private Archive connect around one shared core?',
          surfaceTone: 'paper',
          explorePrompt: 'Explore IA Nodes & Screens',
          previewSlot: LOVE_STORY_ASSET_SPEC.indexPreviews['archive-02'],
          previewCaption: 'Live Our Space Spatial Hub UI',
        },
        {
          id: 'archive-03',
          number: '03',
          codeTitle: 'ARCHIVE 03 — EXPERIENCE THE MEMORIES',
          title: 'Experience the Memories',
          topic: 'Core UI & Interaction Experiences',
          designQuestion:
            'How does Dark Archive framing recede into warm shadow so photographs and personal stories hold the viewer’s full attention?',
          surfaceTone: 'paper-exhibition',
          explorePrompt: 'Enter Visual UI Exhibition',
          previewSlot: LOVE_STORY_ASSET_SPEC.indexPreviews['archive-03'],
          previewCaption: 'Live Moments Detail Frame (#20211E)',
        },
        {
          id: 'archive-04',
          number: '04',
          codeTitle: 'ARCHIVE 04 — MADE WITH INTENTION',
          title: 'Made With Intention',
          topic: 'Visual & Interaction Design System',
          designQuestion:
            'How do Dark Archive (#10110F) and Paper & Ink (#F3EFE7) balance immersive memory viewing with structured editing?',
          surfaceTone: 'paper',
          explorePrompt: 'Compare Themes & Specimens',
          previewSlot: LOVE_STORY_ASSET_SPEC.indexPreviews['archive-04'],
          previewCaption: 'Live Paper & Ink Theme Surface',
        },
        {
          id: 'archive-05',
          number: '05',
          codeTitle: 'ARCHIVE 05 — BUILT & BEYOND',
          title: 'Built & Beyond',
          topic: 'Implementation, Iterations & Reflection',
          designQuestion:
            'How did real two-person usage on a FastAPI / SQLite backend reshape shared visibility, timeline order, and mobile forms?',
          surfaceTone: 'paper-deep',
          explorePrompt: 'View Iteration Visual Results',
          previewSlot: LOVE_STORY_ASSET_SPEC.indexPreviews['archive-05'],
          previewCaption: 'Live Chronological Timeline UI',
        },
      ]

  // Four immersive exhibition areas for ARCHIVE 03
  const exhibitionAreas: ReadonlyArray<ExperienceExhibitionArea> = isZh
    ? [
        {
          id: 'moments',
          code: 'AREA A · MEMORY GALLERY',
          tabLabel: 'A · 记忆画廊 (Moments)',
          title: 'Moments 记忆画廊与原色画框详情',
          subtitle: '按月份归档的网格与 #20211E 沉浸式照片详情',
          statusBadge: '已实装核心体验',
          uxSummary:
            '左侧提供年份、地点与收藏筛选栏，主视图按月份呈现记忆封面；点击任意记忆卡片即可进入 #20211E 中性暗色画框阅读完整故事。',
          uxInsights: [
            '坚持“一则记忆一张封面”原则，多图在悬停时如实体相纸般向右轻柔展开。',
            '详情页将照片与时间、地点、天气、心境整合在同一克制的画框对象内，并支持一键跳转至记忆地图对应城市。',
          ],
          primaryMedia: {
            slot: LOVE_STORY_ASSET_SPEC.experience.momentsGallery,
            title: 'Moments 记忆画廊主界面 (1440×900)',
            caption:
              '左侧分类导航（年份 / 主题集 / 城市坐标）与右侧按月归档的记忆封面网格。',
            badge: '实机截图 · Moments 画廊',
          },
          supportingMedia: [
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.memoryDetail,
              title: 'Moments 记忆详情画框 (#20211E)',
              caption:
                '打开单条记忆后的沉浸式画框：完整保留照片原始色彩，下方呈现时间、地点跳转按钮与故事正文。',
              badge: '实机截图 · 记忆详情模态框',
            },
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.entranceGate,
              title: '公开入口双胶片流与解锁门廊 (Entrance)',
              caption:
                '进入私密空间前的胶片展廊与解锁门廊，采用展示用建筑与风景图像保护真实隐私。',
              badge: '实机截图 · 入口胶片画廊',
            },
          ],
        },
        {
          id: 'timeline',
          code: 'AREA B · CHRONOLOGICAL TIMELINE',
          tabLabel: 'B · 编年时间轴 (Timeline)',
          title: '严格按真实发生日期排序的编年时间轴',
          subtitle: '里程碑记忆与纪念日合流视图',
          statusBadge: '已实装核心体验',
          uxSummary:
            '时间轴不设独立冗余表，而是将勾选“加入时间轴”的里程碑记忆与专属纪念日按真实事件日期（YYYY-MM-DD）严格升序或降序汇聚。',
          uxInsights: [
            '补录过往旅行记忆时，自动回归真实发生年份与月份位置，不受上传时间干扰。',
            '在 Our Space 主页悬停时间轴节点时，金色丝线会直接连接至地球仪上的对应城市坐标。',
          ],
          primaryMedia: {
            slot: LOVE_STORY_ASSET_SPEC.experience.timelineStream,
            title: 'Timeline 编年时间轴完整视图 (1440×900)',
            caption:
              '以日期为骨架的单列编年视图，清晰呈现每一段共同经历的时间、城市与封面影像。',
            badge: '实机截图 · Timeline 页面',
          },
          supportingMedia: [
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.hubTimelineLink,
              title: 'Our Space 时间轴曲线与地理坐标联动',
              caption:
                '在空间主页选中时间轴节点时，浮现记忆预览卡并与下方地球仪城市锚点建立视觉关联。',
              badge: '实机截图 · 时间与空间联动',
            },
          ],
        },
        {
          id: 'map',
          code: 'AREA C · MEMORY MAP & FUTURE',
          tabLabel: 'C · 记忆地图与心愿 (Map & Plans)',
          title: '可旋转正射投影地球仪与未来同行计划',
          subtitle: 'Natural Earth 110m 海岸线投影 + 城市记忆抽屉',
          statusBadge: '已实装交互体验',
          uxSummary:
            '基于真实经纬度坐标将记忆锚定在正射投影地球仪上；点击底部城市索引或地球表面锚点，右侧即刻展开该城市的记忆卡片流。',
          uxInsights: [
            '未填写经纬度的记忆依然保存在画廊与时间轴中，绝不伪造地图坐标。',
            'Plan the Future 模块以起止日期自动计算行程天数与倒计时，按 Day 1..N 组织每日共同计划。',
          ],
          primaryMedia: {
            slot: LOVE_STORY_ASSET_SPEC.experience.memoryMapGlobe,
            title: 'Memory Map 交互式记忆地图与城市抽屉 (1440×900)',
            caption:
              '聚焦布里斯班 (Brisbane) 坐标点，右侧同步展开该城市的记忆轮播与详情入口。',
            badge: '实机截图 · Memory Map',
          },
          supportingMedia: [
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.futureItinerary,
              title: 'Plan the Future 未来计划详情与分日行程',
              caption:
                '展示出行日期区间、交通住宿备忘与按日自动推算的行程清单。',
              badge: '实机截图 · Future Plan 详情',
            },
          ],
        },
        {
          id: 'private-mobile',
          code: 'AREA D · PRIVATE ARCHIVE & MOBILE',
          tabLabel: 'D · 私密归档与移动端 (Private & Mobile)',
          title: '二级密码私密归档门禁与移动端全屏编辑器',
          subtitle: '1440×900 桌面门禁 + 390×844 竖屏原生比例展示',
          statusBadge: '已实装双端适配',
          uxSummary:
            '私密归档（Private Archive）在未解锁时不暴露任何数量或标题信息；移动端则将桌面端长抽屉重构为六步可折叠全屏编辑器与曲线故事流。',
          uxInsights: [
            '私密归档具备独立会话锁与 10 分钟自动超时清理机制，且提供顶部一键 Lock 按钮。',
            '移动端竖屏截图保持 9:19.5 真实比例展示，底部固定取消与保存主操作栏。',
          ],
          primaryMedia: {
            slot: LOVE_STORY_ASSET_SPEC.experience.privateLock,
            title: 'Private Archive 二级隐私密码门禁界面 (1440×900)',
            caption:
              '独立于普通相册的第二重密码锁界面——未解锁前不泄露任何私密记录数量或封面（严格保护隐私）。',
            badge: '实机截图 · 二级隐私锁',
          },
          supportingMedia: [
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.mobileComposer,
              title: '移动端六步全屏记忆编辑器 (390×844 竖屏)',
              caption:
                '针对小屏手指交互重构的 Photos / Story / Details / Note / Timeline / Privacy 分组全屏表单。',
              badge: '实机截图 · 移动端编辑器 (390×844)',
            },
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.mobileStory,
              title: '移动端 Our Space 纵向曲线故事流 (390×844 竖屏)',
              caption:
                '移动端主页并非桌面布局的简单缩放，而是以一条贯穿页面的金色曲线串联记忆卡片与底部五栏导航。',
              badge: '实机截图 · 移动端主页 (390×844)',
            },
          ],
        },
      ]
    : [
        {
          id: 'moments',
          code: 'AREA A · MEMORY GALLERY',
          tabLabel: 'A · Memory Gallery (Moments)',
          title: 'Moments Gallery & Photo-True Detail Frame',
          subtitle: 'Month-Grouped Library Sidebar + #20211E Exhibition Mount',
          statusBadge: 'Implemented Core Workflow',
          uxSummary:
            'A structured left sidebar filters memories by Year, Collection, and Place while the main stage groups covers chronologically by month. Opening any memory reveals a restrained #20211E dark mount that preserves original photo colour.',
          uxInsights: [
            'One cover tile represents each memory; multi-photo records fan out gently on hover like physical prints.',
            'The opened memory frame unifies photograph, date, place deep-link (jumping straight to Memory Map), weather/mood context, and narrative story.',
          ],
          primaryMedia: {
            slot: LOVE_STORY_ASSET_SPEC.experience.momentsGallery,
            title: 'Moments Photo Library & IA Sidebar (1440×900)',
            caption:
              'Authentic desktop capture showing Library filters (All Memories, Years, Collections, Places) and month-grouped memory covers.',
            badge: 'Authentic UI · Moments Library',
          },
          supportingMedia: [
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.memoryDetail,
              title: 'Opened Memory Archive Frame (#20211E Mount)',
              caption:
                'Photo-true #20211E exhibition frame with multi-photo navigation, interactive Brisbane map link, and story typography.',
              badge: 'Authentic UI · Detail Modal',
            },
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.entranceGate,
              title: 'Public Entrance Dual-Film Strip & Unlock Gate',
              caption:
                'Publicly accessible entrance room featuring dual moving film strips and the central Our Story title reveal.',
              badge: 'Authentic UI · Public Entrance',
            },
          ],
        },
        {
          id: 'timeline',
          code: 'AREA B · CHRONOLOGICAL TIMELINE',
          tabLabel: 'B · Chronological Timeline',
          title: 'Event-Date Chronological Timeline & Hub Link',
          subtitle: 'Unified Milestone Memories & Recurring Anniversaries',
          statusBadge: 'Implemented Core Workflow',
          uxSummary:
            'Rather than sorting by upload timestamp, the Timeline computes a single chronological stream from landmark memories and recurring anniversaries ordered strictly by historical event date (YYYY-MM-DD).',
          uxInsights: [
            'Backfilled travel memories automatically settle into their true historical date position.',
            'On the Our Space Hub, focusing or hovering a timeline node draws a live gold curve to its matching city pin on the globe.',
          ],
          primaryMedia: {
            slot: LOVE_STORY_ASSET_SPEC.experience.timelineStream,
            title: 'Full Chronological Timeline View (1440×900)',
            caption:
              'Date-first editorial layout pairing each milestone date gutter with its place label, serif title, and cover frame.',
            badge: 'Authentic UI · Timeline Page',
          },
          supportingMedia: [
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.hubTimelineLink,
              title: 'Our Space Hub Timeline Preview Card & Globe Link',
              caption:
                'Interactive timeline arc on the Hub showing an active event preview card while linking to its geographic coordinate.',
              badge: 'Authentic UI · Hub Timeline Arc',
            },
          ],
        },
        {
          id: 'map',
          code: 'AREA C · MEMORY MAP & FUTURE',
          tabLabel: 'C · Memory Map & Plans',
          title: 'Interactive Orthographic Memory Map & Future Plans',
          subtitle: 'Natural Earth 110m SVG Globe + Place Memory Drawer',
          statusBadge: 'Implemented Interactive View',
          uxSummary:
            'Projects shared memories onto a rotatable orthographic globe using real city coordinates. Selecting a city marker or index button opens the right-hand place panel with all memories recorded at that location.',
          uxInsights: [
            'Memories without coordinates remain in Moments and Timeline without fabricating map pins.',
            'Plan the Future separates forward-looking itineraries (date ranges, derived durations, and Day 1..N activities) from past memories.',
          ],
          primaryMedia: {
            slot: LOVE_STORY_ASSET_SPEC.experience.memoryMapGlobe,
            title: 'Interactive Memory Map with Brisbane Place Panel (1440×900)',
            caption:
              'Orthographic globe focused on Brisbane, Australia with the right-hand city memory carousel open.',
            badge: 'Authentic UI · Memory Map',
          },
          supportingMedia: [
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.futureItinerary,
              title: 'Plan the Future — Opened Itinerary Detail',
              caption:
                'Structured trip plan view showing date range, auto-computed countdown, transport/accommodation notes, and daily itinerary.',
              badge: 'Authentic UI · Future Plan Detail',
            },
          ],
        },
        {
          id: 'private-mobile',
          code: 'AREA D · PRIVATE ARCHIVE & MOBILE',
          tabLabel: 'D · Private Lock & Mobile UI',
          title: 'Private Archive Second-Lock & Mobile Fullscreen Adaptation',
          subtitle: 'Desktop Privacy Gate (16:10) + Mobile Portrait Captures (9:19.5)',
          statusBadge: 'Implemented Cross-Device UI',
          uxSummary:
            'Protects sensitive records behind a dedicated secondary password gate that reveals zero metadata when locked, while adapting desktop drawers into a 6-section fullscreen mobile memory composer.',
          uxInsights: [
            'The locked Private Archive screen intentionally hides record counts, titles, and covers until unlocked (auto-locking after 10 minutes).',
            'Portrait mobile captures (390×844) are presented in their natural aspect ratio alongside desktop views.',
          ],
          primaryMedia: {
            slot: LOVE_STORY_ASSET_SPEC.experience.privateLock,
            title: 'Private Archive Secondary Password Gate (1440×900)',
            caption:
              'Non-sensitive capture of the dedicated second-lock gate ("Protected memories require your privacy password").',
            badge: 'Authentic UI · Privacy Gate',
          },
          supportingMedia: [
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.mobileComposer,
              title: 'Mobile Fullscreen 6-Step Memory Composer (390×844 Portrait)',
              caption:
                'Adapts the desktop side sheet into collapsible mobile sections (Photos, Story, Details, Note, Timeline, Privacy) with a sticky bottom Save bar.',
              badge: 'Authentic Mobile UI · 390×844',
            },
            {
              slot: LOVE_STORY_ASSET_SPEC.experience.mobileStory,
              title: 'Mobile Curved Story Thread Home (390×844 Portrait)',
              caption:
                'Dedicated mobile reading of Our Space featuring a continuous curved story line and 5-tab bottom navigation.',
              badge: 'Authentic Mobile UI · 390×844',
            },
          ],
        },
      ]

  const handleOpenArchive = useCallback((archiveId: LoveStoryArchiveId) => {
    if (typeof window !== 'undefined') {
      savedIndexScrollYRef.current = window.scrollY
    }
    lastOpenedArchiveRef.current = archiveId
    setShowMoreDetail(false)
    setActiveSupportingMediaIdx(0)
    setSelectedArchiveId(archiveId)
  }, [])

  const handleReturnToIndex = useCallback(() => {
    shouldRestoreIndexFocusRef.current = true
    setShowMoreDetail(false)
    setSelectedArchiveId(null)
  }, [])

  const handleSwitchArchiveInDetail = useCallback(
    (archiveId: LoveStoryArchiveId) => {
      lastOpenedArchiveRef.current = archiveId
      setShowMoreDetail(false)
      setActiveSupportingMediaIdx(0)
      setSelectedArchiveId(archiveId)
    },
    []
  )

  const handleNavigateToDesignOutcome = useCallback(
    (target: DesignOutcomeDeepLink) => {
      if (typeof window !== "undefined") {
        savedIndexScrollYRef.current = window.scrollY
      }
      lastOpenedArchiveRef.current = target.archiveId
      if (target.moduleIndex !== undefined) {
        setActiveModuleIndex(target.moduleIndex)
      }
      if (target.exhibitionAreaIdx !== undefined) {
        setActiveExhibitionAreaIdx(target.exhibitionAreaIdx)
        setActiveSupportingMediaIdx(0)
      }
      if (target.iterationIdx !== undefined) {
        setActiveIterationIndex(target.iterationIdx)
      }
      setShowMoreDetail(false)
      setSelectedArchiveId(target.archiveId)
    },
    []
  )

  useEffect(() => {
    if (selectedArchiveId !== null) {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
      const timer = window.setTimeout(() => {
        focusedHeadingRef.current?.focus({ preventScroll: true })
      }, 60)
      return () => window.clearTimeout(timer)
    } else if (shouldRestoreIndexFocusRef.current) {
      shouldRestoreIndexFocusRef.current = false
      const targetScroll = savedIndexScrollYRef.current
      const lastId = lastOpenedArchiveRef.current
      requestAnimationFrame(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: targetScroll, behavior: 'auto' })
        }
        if (lastId && indexEntryRefs.current[lastId]) {
          indexEntryRefs.current[lastId]?.focus({ preventScroll: true })
        }
      })
    }
  }, [selectedArchiveId])

  const selectedArchiveMeta = selectedArchiveId
    ? archives.find((a) => a.id === selectedArchiveId) ?? archives[0]
    : null
  const selectedArchiveOrderIdx = selectedArchiveId
    ? ARCHIVE_ORDER.indexOf(selectedArchiveId)
    : -1
  const nextArchiveId =
    selectedArchiveOrderIdx >= 0 &&
    selectedArchiveOrderIdx < ARCHIVE_ORDER.length - 1
      ? ARCHIVE_ORDER[selectedArchiveOrderIdx + 1]
      : null
  const nextArchiveMeta = nextArchiveId
    ? archives.find((a) => a.id === nextArchiveId) ?? null
    : null

  // Underlying preserved data bindings
  const activeNeed =
    loveStoryData.scene02Needs.items[activeNeedIndex] ??
    loveStoryData.scene02Needs.items[0]
  const activeNeedSlot =
    LOVE_STORY_ASSET_SPEC.requirements[
      activeNeed.id as keyof typeof LOVE_STORY_ASSET_SPEC.requirements
    ] ?? LOVE_STORY_ASSET_SPEC.requirements['need-01']

  const isHubSelectedInArch02 = activeModuleIndex === -1
  const activeModule =
    activeModuleIndex >= 0
      ? loveStoryData.scene03Connections.modules[activeModuleIndex] ??
        loveStoryData.scene03Connections.modules[0]
      : null
  const activeArchSlot = isHubSelectedInArch02
    ? LOVE_STORY_ASSET_SPEC.architecture.hub
    : LOVE_STORY_ASSET_SPEC.architecture[
        (activeModule?.id ??
          'mod-moments') as keyof typeof LOVE_STORY_ASSET_SPEC.architecture
      ] ?? LOVE_STORY_ASSET_SPEC.architecture['mod-moments']

  const activeExhibitionArea =
    exhibitionAreas[activeExhibitionAreaIdx] ?? exhibitionAreas[0]

  const activeIteration =
    loveStoryData.scene06Built.iterations[activeIterationIndex] ??
    loveStoryData.scene06Built.iterations[0]

  const motionTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const }

  // Design System Screen Pair Lookup for Archive 04
  const dsScreenPairs = {
    hub: {
      dark: LOVE_STORY_ASSET_SPEC.designSystem.darkHub,
      light: LOVE_STORY_ASSET_SPEC.designSystem.lightHub,
      labelEn: 'Our Space — Spatial Hub',
      labelZh: 'Our Space — 空间主页',
      captionDarkEn:
        'Dark Archive (#10110F / #171815): Recedes into warm shadow so memory covers and gold timeline arcs lead.',
      captionLightEn:
        'Paper & Ink (#F5F3EE / #EFECE4): Warm editorial paper surface with high-contrast #1D1C19 ink and #92713C gold.',
      captionDarkZh:
        'Dark Archive 深色馆藏 (#10110F)：背景退入温润暗影，突出记忆照片与金色时间轨迹。',
      captionLightZh:
        'Paper & Ink 浅色纸本 (#F5F3EE)：温暖纸张底色搭配深墨衬线标题与古铜金强调色。',
    },
    timeline: {
      dark: LOVE_STORY_ASSET_SPEC.designSystem.darkTimeline,
      light: LOVE_STORY_ASSET_SPEC.designSystem.lightTimeline,
      labelEn: 'Timeline — Editorial Chronology',
      labelZh: 'Timeline — 编年时间轴',
      captionDarkEn:
        'Dark Archive Timeline: Quiet hairline dividers and warm ivory typography for evening reading.',
      captionLightEn:
        'Paper & Ink Timeline: Reads like a printed archival journal while keeping photographs untinted.',
      captionDarkZh:
        '深色模式时间轴：柔和细线与暖象牙白字体，适合夜间沉浸式回顾。',
      captionLightZh:
        '浅色纸本时间轴：呈现纸质纪念册般的阅读质感，同时保持照片原始色彩不偏色。',
    },
    unlock: {
      dark: LOVE_STORY_ASSET_SPEC.designSystem.darkUnlock,
      light: LOVE_STORY_ASSET_SPEC.designSystem.lightUnlock,
      labelEn: 'Unlock Gate — Appearance & Locale Controls',
      labelZh: 'Unlock 门廊 — 主题与多语言切换控件',
      captionDarkEn:
        'Dark Archive Gate: Offers immediate Dark/Light and Language preferences before sign-in.',
      captionLightEn:
        'Paper & Ink Gate: Switching to Light updates semantic CSS tokens globally without page reload.',
      captionDarkZh:
        '深色解锁门廊：在登录前即可自由切换 Dark / Light 外观与界面语言。',
      captionLightZh:
        '浅色解锁门廊：通过语义化 CSS 变量即时切换全站主题，无需刷新页面。',
    },
  } as const

  const currentDsPair = dsScreenPairs[activeDsScreenKey]

  return (
    <div
      className="ls-archive-world"
      data-archive-view={selectedArchiveId ?? 'index'}
    >
      <AnimatePresence mode="wait">
        {selectedArchiveId === null ? (
          /* ================================================================
             STATE A — ARCHIVE INDEX (Visual-First Asymmetric Editorial Index)
             ================================================================ */
          <motion.section
            key="ls-archive-index"
            id="ls-archive-index-view"
            className="ls-archive-index-section"
            aria-labelledby="ls-archive-index-heading"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            transition={motionTransition}
            ref={(sectionEl) => {
              if (sectionEl && lastOpenedArchiveRef.current) {
                const targetScroll = savedIndexScrollYRef.current
                const lastId = lastOpenedArchiveRef.current
                requestAnimationFrame(() => {
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: targetScroll, behavior: 'auto' })
                  }
                  indexEntryRefs.current[lastId]?.focus({ preventScroll: true })
                })
              }
            }}
          >
            <div className="ls-archive-index-container">
              {/* Concise Editorial Masthead */}
              <header className="ls-archive-index-header">
                <div className="ls-archive-index-title-group">
                  <span className="ls-archive-identifier">
                    LOVESTORY / THE DESIGN ARCHIVE
                  </span>
                  <h2
                    id="ls-archive-index-heading"
                    className="ls-archive-main-heading"
                  >
                    {isZh
                      ? '每一处设计，皆有来处。'
                      : 'Every design has a story.'}
                  </h2>
                  <p className="ls-archive-supporting-sentence">
                    {isZh
                      ? '专为两个人构建的交互式数字记忆档案馆——从下方五卷实机视觉档案中选择任意一卷，或按序探索完整设计脉络。'
                      : 'A personal, two-person digital memory archive — inspect authentic product visuals across the five curated records below or explore in sequence.'}
                  </p>
                </div>

                <div className="ls-archive-guided-actions">
                  <button
                    type="button"
                    className="ls-explore-in-order-btn"
                    onClick={() => handleOpenArchive('archive-02')}
                  >
                    <span className="ls-order-dot" aria-hidden="true" />
                    <span>
                      {isZh
                        ? '按序浏览设计成果 (02 → 05)'
                        : 'Explore Design Outcomes (02 → 05)'}
                    </span>
                    <ArrowRightIcon size={15} />
                  </button>
                </div>
              </header>

              {/* ============================================================
                  UPPER SECTION: UX DISCOVERY / RESEARCH & PROBLEM DEFINITION
                  5 Interconnected Exploratory Nodes with Spatial FLIP Expansion
                  ============================================================ */}
              <LoveStoryUxDiscoveryCanvas
                isZh={isZh}
                loveStoryData={loveStoryData}
                enlargeLabel={enlargeLabel}
                onEnlargeMedia={setEnlargedMedia}
                onNavigateToDesignOutcome={handleNavigateToDesignOutcome}
              />

              {/* ============================================================
                  LOWER SECTION: DESIGN OUTCOMES / FROM INSIGHT TO INTERFACE
                  Preserves Archives 02–05 (Connecting Memories, Experience,
                  Made With Intention, Built & Beyond) below UX Discovery
                  ============================================================ */}
              <div
                className="ls-design-outcomes-section"
                data-design-outcomes="true"
              >
                <div className="ls-design-outcomes-header">
                  <div className="ls-design-outcomes-title-block">
                    <span className="ls-ux-section-kicker">
                      {isZh
                        ? 'DESIGN OUTCOMES / 从研究洞察到界面实现'
                        : 'DESIGN OUTCOMES / FROM INSIGHT TO INTERFACE'}
                    </span>
                    <h3 className="ls-ux-section-heading">
                      {isZh
                        ? '将研究推演转化为可交互的双人数字产品'
                        : 'How Research Insights Became the Working Product'}
                    </h3>
                    <p className="ls-ux-section-sub">
                      {isZh
                        ? '上方研究节点阐述了“为什么这样设计”，下方四卷实机视觉档案则完整展示信息架构、核心界面、双境设计系统与真实工程迭代。'
                        : 'Where UX Discovery explains why each decision was made, the four visual archives below demonstrate how the information architecture, UI exhibition, design system, and real iterations work in production.'}
                    </p>
                  </div>
                </div>

                <div className="ls-archive-asymmetric-stage ls-archive-asymmetric-stage--outcomes">
                  <svg
                    className="ls-archive-index-threads-svg"
                    viewBox="0 0 1120 460"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 520 115 C 560 115, 575 115, 610 115"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M 280 210 C 280 250, 280 275, 280 310"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M 830 210 C 830 250, 830 275, 830 310"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>

                {/* ==========================================================
                    ARCHIVE 02 — CONNECTING MEMORIES (Node Diagram + Hub Preview)
                    ========================================================== */}
                <button
                  ref={(el) => {
                    indexEntryRefs.current['archive-02'] = el
                  }}
                  type="button"
                  data-archive-entry="archive-02"
                  className="ls-archive-entry ls-archive-entry--02-constellation"
                  onClick={() => handleOpenArchive('archive-02')}
                >
                  <div className="ls-entry-top-meta">
                    <span className="ls-entry-num">02</span>
                    <span className="ls-entry-topic-tag">
                      {archives[1].topic}
                    </span>
                  </div>

                  <div className="ls-entry-split-row">
                    <div className="ls-entry-title-block">
                      <span className="ls-entry-code">
                        {archives[1].codeTitle}
                      </span>
                      <h3 className="ls-entry-heading">{archives[1].title}</h3>
                      <p className="ls-entry-question--compact">
                        {archives[1].designQuestion}
                      </p>
                    </div>

                    <div className="ls-entry-photo-aperture-preview">
                      <picture>
                        <source
                          srcSet={archives[1].previewSlot.webp}
                          type="image/webp"
                        />
                        <img
                          src={archives[1].previewSlot.png}
                          alt={archives[1].previewCaption}
                          className="ls-entry-preview-img"
                          loading="eager"
                          decoding="async"
                        />
                      </picture>
                      <span className="ls-aperture-stamp">
                        {isZh ? 'OUR SPACE · 6 大模块节点' : 'OUR SPACE · 6 IA NODES'}
                      </span>
                    </div>
                  </div>

                  <div className="ls-entry-footer">
                    <span className="ls-entry-cta">
                      {archives[1].explorePrompt}
                    </span>
                    <span className="ls-entry-arrow" aria-hidden="true">
                      <ArrowRightIcon size={15} />
                    </span>
                  </div>
                </button>

                {/* ==========================================================
                    ARCHIVE 03 — EXPERIENCE THE MEMORIES (Authentic Gallery Frame)
                    ========================================================== */}
                <button
                  ref={(el) => {
                    indexEntryRefs.current['archive-03'] = el
                  }}
                  type="button"
                  data-archive-entry="archive-03"
                  className="ls-archive-entry ls-archive-entry--03-experience"
                  onClick={() => handleOpenArchive('archive-03')}
                >
                  <div className="ls-entry-top-meta">
                    <span className="ls-entry-num">03</span>
                    <span className="ls-entry-topic-tag">
                      {archives[2].topic}
                    </span>
                  </div>

                  <div className="ls-entry-split-row">
                    <div className="ls-entry-title-block">
                      <span className="ls-entry-code">
                        {archives[2].codeTitle}
                      </span>
                      <h3 className="ls-entry-heading">{archives[2].title}</h3>
                      <p className="ls-entry-question--compact">
                        {archives[2].designQuestion}
                      </p>
                    </div>

                    <div className="ls-entry-photo-aperture-preview">
                      <picture>
                        <source
                          srcSet={archives[2].previewSlot.webp}
                          type="image/webp"
                        />
                        <img
                          src={archives[2].previewSlot.png}
                          alt={archives[2].previewCaption}
                          className="ls-entry-preview-img"
                          loading="eager"
                          decoding="async"
                        />
                      </picture>
                      <span className="ls-aperture-stamp">#20211E · 4 UI VIEWS</span>
                    </div>
                  </div>

                  <div className="ls-entry-footer">
                    <span className="ls-entry-cta">
                      {archives[2].explorePrompt}
                    </span>
                    <span className="ls-entry-arrow" aria-hidden="true">
                      <ArrowRightIcon size={15} />
                    </span>
                  </div>
                </button>

                {/* ==========================================================
                    ARCHIVE 04 — MADE WITH INTENTION (Dark Archive vs Paper & Ink)
                    ========================================================== */}
                <button
                  ref={(el) => {
                    indexEntryRefs.current['archive-04'] = el
                  }}
                  type="button"
                  data-archive-entry="archive-04"
                  className="ls-archive-entry ls-archive-entry--04-system"
                  onClick={() => handleOpenArchive('archive-04')}
                >
                  <div className="ls-entry-top-meta">
                    <span className="ls-entry-num">04</span>
                    <span className="ls-entry-topic-tag">
                      {archives[3].topic}
                    </span>
                  </div>

                  <div className="ls-entry-split-row">
                    <div className="ls-entry-title-block">
                      <span className="ls-entry-code">
                        {archives[3].codeTitle}
                      </span>
                      <h3 className="ls-entry-heading">{archives[3].title}</h3>
                      <p className="ls-entry-question--compact">
                        {archives[3].designQuestion}
                      </p>
                    </div>

                    <div className="ls-entry-theme-split-preview">
                      <div className="ls-theme-slice ls-theme-slice--dark">
                        <img
                          src={LOVE_STORY_ASSET_SPEC.designSystem.darkHub.webp}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                        />
                        <span>#10110F</span>
                      </div>
                      <div className="ls-theme-slice ls-theme-slice--light">
                        <img
                          src={LOVE_STORY_ASSET_SPEC.designSystem.lightHub.webp}
                          alt={archives[3].previewCaption}
                          loading="lazy"
                        />
                        <span>#F3EFE7</span>
                      </div>
                    </div>
                  </div>

                  <div className="ls-entry-footer">
                    <span className="ls-entry-cta">
                      {archives[3].explorePrompt}
                    </span>
                    <span className="ls-entry-arrow" aria-hidden="true">
                      <ArrowRightIcon size={15} />
                    </span>
                  </div>
                </button>

                {/* ==========================================================
                    ARCHIVE 05 — BUILT & BEYOND (Iteration Sequence + UI Proof)
                    ========================================================== */}
                <button
                  ref={(el) => {
                    indexEntryRefs.current['archive-05'] = el
                  }}
                  type="button"
                  data-archive-entry="archive-05"
                  className="ls-archive-entry ls-archive-entry--05-built"
                  onClick={() => handleOpenArchive('archive-05')}
                >
                  <div className="ls-entry-top-meta">
                    <span className="ls-entry-num">05</span>
                    <span className="ls-entry-topic-tag">
                      {archives[4].topic}
                    </span>
                  </div>

                  <div className="ls-entry-split-row">
                    <div className="ls-entry-title-block">
                      <span className="ls-entry-code">
                        {archives[4].codeTitle}
                      </span>
                      <h3 className="ls-entry-heading">{archives[4].title}</h3>
                      <p className="ls-entry-question--compact">
                        {archives[4].designQuestion}
                      </p>
                    </div>

                    <div className="ls-entry-mini-thumb ls-entry-mini-thumb--wide">
                      <picture>
                        <source
                          srcSet={archives[4].previewSlot.webp}
                          type="image/webp"
                        />
                        <img
                          src={archives[4].previewSlot.png}
                          alt={archives[4].previewCaption}
                          className="ls-entry-preview-img"
                          loading="eager"
                          decoding="async"
                        />
                      </picture>
                    </div>
                  </div>

                  <div
                    className="ls-entry-motif ls-entry-motif--timeline"
                    aria-hidden="true"
                  >
                    <div className="ls-motif-sequence-track">
                      <span className="ls-seq-step">
                        <i>01</i>
                        <small>{isZh ? '共享空间同步' : 'Shared Sync'}</small>
                      </span>
                      <span className="ls-seq-line" />
                      <span className="ls-seq-step">
                        <i>02</i>
                        <small>{isZh ? '严格事件时序' : 'Chronology'}</small>
                      </span>
                      <span className="ls-seq-line" />
                      <span className="ls-seq-step is-gold">
                        <i>03</i>
                        <small>{isZh ? '移动端全屏表单' : 'Mobile Composer'}</small>
                      </span>
                    </div>
                  </div>

                  <div className="ls-entry-footer">
                    <span className="ls-entry-cta">
                      {archives[4].explorePrompt}
                    </span>
                    <span className="ls-entry-arrow" aria-hidden="true">
                      <ArrowRightIcon size={15} />
                    </span>
                  </div>
                </button>
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          /* ================================================================
             STATE B — FOCUSED ARCHIVE VIEW (Visual Evidence First)
             ================================================================ */
          <motion.section
            key={`ls-focused-${selectedArchiveId}`}
            id={`ls-focused-${selectedArchiveId}`}
            data-focused-archive={selectedArchiveId}
            className={`ls-focused-archive-section ${
              selectedArchiveId === 'archive-03'
                ? 'is-dark-archive-stage'
                : 'is-paper-ink-stage'
            }`}
            aria-labelledby="ls-focused-archive-heading"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            transition={motionTransition}
          >
            <div className="ls-focused-archive-container">
              {/* Top Orientation & Navigation Bar */}
              <nav
                className="ls-focused-orientation-bar"
                aria-label={isZh ? '档案室导航' : 'Archive navigation'}
              >
                <button
                  type="button"
                  className="ls-return-index-btn"
                  onClick={handleReturnToIndex}
                >
                  <ArrowLeftIcon size={15} />
                  <span>
                    {isZh ? '返回档案目录' : 'Return to Archive Index'}
                  </span>
                </button>

                <div
                  className="ls-archive-thread-pills"
                  role="tablist"
                  aria-label={isZh ? '切换档案卷宗' : 'Switch archive record'}
                >
                  {archives.map((arch) => {
                    const isCurrent = arch.id === selectedArchiveId
                    return (
                      <button
                        key={arch.id}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        aria-label={`${arch.number} · ${arch.title}`}
                        className={`ls-thread-node-btn ${
                          isCurrent ? 'is-current' : ''
                        }`}
                        onClick={() => handleSwitchArchiveInDetail(arch.id)}
                      >
                        <span>{arch.number}</span>
                      </button>
                    )
                  })}
                </div>

                {nextArchiveMeta ? (
                  <button
                    type="button"
                    className="ls-next-archive-btn"
                    onClick={() =>
                      handleSwitchArchiveInDetail(nextArchiveMeta.id)
                    }
                  >
                    <span>
                      {isZh ? '下一卷' : 'Next Archive'}:{' '}
                      {nextArchiveMeta.number} · {nextArchiveMeta.title}
                    </span>
                    <ArrowRightIcon size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ls-next-archive-btn"
                    onClick={handleReturnToIndex}
                  >
                    <span>
                      {isZh
                        ? '完成导览 · 返回目录'
                        : 'Complete Tour · Archive Index'}
                    </span>
                    <ArrowRightIcon size={15} />
                  </button>
                )}
              </nav>

              {/* Focused Archive Header */}
              {selectedArchiveMeta ? (
                <header className="ls-focused-header">
                  <div className="ls-focused-kicker-row">
                    <span className="ls-focused-num">
                      {selectedArchiveMeta.number} / 05
                    </span>
                    <span className="ls-focused-sep" aria-hidden="true" />
                    <span className="ls-focused-code">
                      {selectedArchiveMeta.codeTitle}
                    </span>
                  </div>

                  <h2
                    ref={(el) => {
                      focusedHeadingRef.current = el
                      if (el) {
                        requestAnimationFrame(() => {
                          el.focus({ preventScroll: true })
                        })
                      }
                    }}
                    id="ls-focused-archive-heading"
                    tabIndex={-1}
                    className="ls-focused-title"
                  >
                    {selectedArchiveMeta.title}
                  </h2>

                  <p className="ls-focused-question">
                    {selectedArchiveMeta.designQuestion}
                  </p>
                </header>
              ) : null}

              {/* ============================================================
                  ARCHIVE 01 STAGE — WHY WE BUILT IT (Visual Evidence First)
                  ============================================================ */}
              {selectedArchiveId === 'archive-01' ? (
                <div
                  className="ls-stage-01-reasoning"
                  data-active-need={activeNeed.id}
                >
                  {/* 4-Need Interactive Selector */}
                  <div
                    className="ls-need-selector-strip"
                    role="tablist"
                    aria-label={
                      isZh
                        ? '选择核心用户需求'
                        : 'Select user need to inspect visual evidence'
                    }
                  >
                    {loveStoryData.scene02Needs.items.map((item, idx) => {
                      const isSelected = idx === activeNeedIndex
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          data-need-tab={item.id}
                          className={`ls-need-pill-btn ${
                            isSelected ? 'is-active' : ''
                          }`}
                          onClick={() => setActiveNeedIndex(idx)}
                        >
                          <span className="ls-need-pill-num">
                            {item.number}
                          </span>
                          <span className="ls-need-pill-title">
                            {item.needTitle}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Visual-First Split Stage: Large Authentic Screenshot Left (62%) + Reasoning Trace Right (38%) */}
                  <div
                    className="ls-need-visual-evidence-grid"
                    role="tabpanel"
                  >
                    <div className="ls-need-primary-media-col">
                      <LoveStoryEvidencePicture
                        slot={activeNeedSlot}
                        alt={`${activeNeed.needTitle} — ${activeNeed.evidenceSlotLabel}`}
                        badge={`${activeNeed.number} · ${activeNeed.evidenceSlotLabel}`}
                        caption={
                          isZh
                            ? `实机界面实证：${activeNeed.evidenceSlotLabel}（点击图像可放大检视细节）`
                            : `Authentic Product UI: ${activeNeed.evidenceSlotLabel} (click screenshot to inspect full resolution)`
                        }
                        enlargeLabel={enlargeLabel}
                        priority
                        onEnlarge={() =>
                          setEnlargedMedia({
                            slot: activeNeedSlot,
                            title: `${activeNeed.number} · ${activeNeed.needTitle}`,
                            caption: `${activeNeed.designDecision} (${activeNeed.evidenceSlotLabel})`,
                            badge: activeNeed.evidenceSlotLabel,
                          })
                        }
                      />
                    </div>

                    <div className="ls-need-reasoning-col">
                      <article className="ls-chain-card ls-chain-card--need">
                        <span className="ls-chain-step-label">
                          01 · {loveStoryData.scene02Needs.columnLabels.userNeed}
                        </span>
                        <h3 className="ls-chain-card-title">
                          {activeNeed.needTitle}
                        </h3>
                        <p className="ls-chain-card-body">
                          {activeNeed.userContext}
                        </p>
                      </article>

                      <article className="ls-chain-card ls-chain-card--req">
                        <span className="ls-chain-step-label">
                          02 ·{' '}
                          {loveStoryData.scene02Needs.columnLabels.requirement}
                        </span>
                        <p className="ls-chain-card-body">
                          {activeNeed.designRequirement}
                        </p>
                      </article>

                      <article className="ls-chain-card ls-chain-card--decision">
                        <span className="ls-chain-step-label">
                          03 · {loveStoryData.scene02Needs.columnLabels.decision}
                        </span>
                        <p className="ls-chain-card-body">
                          {activeNeed.designDecision}
                        </p>
                      </article>
                    </div>
                  </div>

                  {/* Progressive Disclosure for Full 4-Need Matrix */}
                  <div className="ls-evidence-foundation-bar">
                    <div className="ls-evidence-badge-group">
                      <span className="ls-evidence-dot" aria-hidden="true" />
                      <span className="ls-evidence-slot-label">
                        {isZh
                          ? '当前展示实证：'
                          : 'Active Visual Evidence: '}
                        <strong>{activeNeed.evidenceSlotLabel}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="ls-explore-more-toggle"
                      aria-expanded={showMoreDetail}
                      onClick={() => setShowMoreDetail((prev) => !prev)}
                    >
                      <span>
                        {showMoreDetail
                          ? isZh
                            ? '收起全部需求对照 −'
                            : 'Hide All 4 Needs Overview −'
                          : isZh
                          ? '展开全部 4 项需求对照 +'
                          : 'Compare All 4 Needs +'}
                      </span>
                    </button>
                  </div>

                  {showMoreDetail ? (
                    <div className="ls-expanded-supporting-grid">
                      {loveStoryData.scene02Needs.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`ls-supporting-mini-card ${
                            idx === activeNeedIndex ? 'is-highlighted' : ''
                          }`}
                        >
                          <span>
                            {item.number} · {item.needTitle}
                          </span>
                          <p>{item.designDecision}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* ============================================================
                  ARCHIVE 02 STAGE — CONNECTING MEMORIES (Constellation + Real UI)
                  ============================================================ */}
              {selectedArchiveId === 'archive-02' ? (
                <div
                  className="ls-stage-02-constellation"
                  data-active-ia-node={
                    isHubSelectedInArch02 ? 'our-world-hub' : activeModule?.id
                  }
                >
                  <div className="ls-constellation-visual-split">
                    {/* Left Column: Interactive SVG Constellation + Compact Node Selector */}
                    <div className="ls-constellation-map-panel">
                      <div className="ls-constellation-legend">
                        <span className="ls-legend-chip is-implemented">
                          <i />
                          {
                            loveStoryData.scene03Connections.statusLegend
                              .implemented
                          }
                        </span>
                        <span className="ls-legend-chip is-prototype">
                          <i />
                          {
                            loveStoryData.scene03Connections.statusLegend
                              .prototype
                          }
                        </span>
                      </div>

                      <svg
                        viewBox="0 0 560 360"
                        className="ls-constellation-interactive-svg"
                        role="img"
                        aria-label={
                          loveStoryData.scene03Connections.constellationTitle
                        }
                      >
                        {loveStoryData.scene03Connections.modules.map(
                          (mod, idx) => {
                            const coords = [
                              { x: 112, y: 76 },
                              { x: 448, y: 76 },
                              { x: 476, y: 186 },
                              { x: 422, y: 298 },
                              { x: 280, y: 314 },
                              { x: 138, y: 298 },
                              { x: 84, y: 186 },
                            ][idx] ?? { x: 280, y: 180 }
                            const isSelected = idx === activeModuleIndex
                            return (
                              <g key={mod.id}>
                                <line
                                  x1={280}
                                  y1={180}
                                  x2={coords.x}
                                  y2={coords.y}
                                  stroke={
                                    isSelected || isHubSelectedInArch02
                                      ? '#B79A62'
                                      : 'rgba(128, 108, 73, 0.28)'
                                  }
                                  strokeWidth={
                                    isSelected || isHubSelectedInArch02
                                      ? '2.2'
                                      : '1.2'
                                  }
                                  strokeDasharray={
                                    isSelected ? 'none' : '4 4'
                                  }
                                />
                                <g
                                  className={`ls-svg-node-group ${
                                    isSelected ? 'is-selected' : ''
                                  }`}
                                  onClick={() => setActiveModuleIndex(idx)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <circle
                                    cx={coords.x}
                                    cy={coords.y}
                                    r={isSelected ? 22 : 17}
                                    fill={isSelected ? '#171815' : '#F5F1EB'}
                                    stroke={
                                      isSelected ? '#C8AD75' : '#806C49'
                                    }
                                    strokeWidth={isSelected ? '2.4' : '1.4'}
                                  />
                                  <text
                                    x={coords.x}
                                    y={coords.y + 4}
                                    textAnchor="middle"
                                    className="ls-svg-node-num"
                                    fill={isSelected ? '#E8E3D8' : '#111111'}
                                  >
                                    0{idx + 1}
                                  </text>
                                  <text
                                    x={coords.x}
                                    y={
                                      coords.y + (coords.y < 180 ? -28 : 34)
                                    }
                                    textAnchor="middle"
                                    className="ls-svg-node-caption"
                                  >
                                    {mod.name.split('/')[0].trim()}
                                  </text>
                                </g>
                              </g>
                            )
                          }
                        )}

                        {/* Central Clickable Hub: Our World */}
                        <g
                          onClick={() => setActiveModuleIndex(-1)}
                          style={{ cursor: 'pointer' }}
                        >
                          <circle
                            cx={280}
                            cy={180}
                            r={44}
                            fill={
                              isHubSelectedInArch02 ? '#171815' : '#10110F'
                            }
                            stroke={
                              isHubSelectedInArch02 ? '#C8AD75' : '#B79A62'
                            }
                            strokeWidth={isHubSelectedInArch02 ? '3' : '2'}
                          />
                          <text
                            x={280}
                            y={176}
                            textAnchor="middle"
                            fill="#E8E3D8"
                            className="ls-svg-hub-title"
                          >
                            {loveStoryData.scene03Connections.hubLabel}
                          </text>
                          <text
                            x={280}
                            y={194}
                            textAnchor="middle"
                            fill="#C8AD75"
                            className="ls-svg-hub-sub"
                          >
                            {isZh ? '核心空间枢纽' : 'Shared Core Hub'}
                          </text>
                        </g>
                      </svg>

                      {/* Accessible Node Buttons (Hub + 6 Modules) */}
                      <div
                        className="ls-constellation-node-buttons"
                        role="tablist"
                        aria-label={
                          isZh
                            ? '信息架构模块节点'
                            : 'Information architecture module nodes'
                        }
                      >
                        <button
                          type="button"
                          role="tab"
                          data-ia-node-btn="our-world-hub"
                          aria-selected={isHubSelectedInArch02}
                          className={`ls-module-node-btn ${
                            isHubSelectedInArch02 ? 'is-active' : ''
                          }`}
                          onClick={() => setActiveModuleIndex(-1)}
                        >
                          <div className="ls-module-node-top">
                            <span className="ls-node-dot is-implemented" />
                            <span className="ls-node-status-text">
                              {isZh ? '核心空间枢纽' : 'Central Hub'}
                            </span>
                          </div>
                          <strong className="ls-module-node-name">
                            {loveStoryData.scene03Connections.hubLabel} (Our
                            Space)
                          </strong>
                        </button>

                        {loveStoryData.scene03Connections.modules.map(
                          (mod, idx) => {
                            const isSelected = idx === activeModuleIndex
                            return (
                              <button
                                key={mod.id}
                                type="button"
                                role="tab"
                                data-ia-node-btn={mod.id}
                                aria-selected={isSelected}
                                className={`ls-module-node-btn ${
                                  isSelected ? 'is-active' : ''
                                }`}
                                onClick={() => setActiveModuleIndex(idx)}
                              >
                                <div className="ls-module-node-top">
                                  <span
                                    className={`ls-node-dot is-${mod.statusTone}`}
                                  />
                                  <span className="ls-node-status-text">
                                    {mod.statusBadge}
                                  </span>
                                </div>
                                <strong className="ls-module-node-name">
                                  {mod.name}
                                </strong>
                              </button>
                            )
                          }
                        )}
                      </div>
                    </div>

                    {/* Right Column: Prominent Real Interface Screenshot + 1 Concise Role Sentence */}
                    <article
                      className="ls-module-detail-spotlight"
                      role="tabpanel"
                    >
                      <div className="ls-spotlight-header-compact">
                        <div className="ls-spotlight-kicker-row">
                          <span className="ls-spotlight-kicker">
                            {isHubSelectedInArch02
                              ? isZh
                                ? '中心枢纽 · OUR SPACE'
                                : 'CENTRAL HUB · OUR SPACE'
                              : activeModule?.nameSub}
                          </span>
                          <span
                            className={`ls-status-pill is-${
                              isHubSelectedInArch02
                                ? 'implemented'
                                : activeModule?.statusTone ?? 'implemented'
                            }`}
                          >
                            {isHubSelectedInArch02
                              ? loveStoryData.scene03Connections.statusLegend
                                  .implemented
                              : activeModule?.statusBadge}
                          </span>
                        </div>

                        <h3 className="ls-spotlight-title">
                          {isHubSelectedInArch02
                            ? `${loveStoryData.scene03Connections.hubLabel} — ${loveStoryData.scene03Connections.hubSublabel}`
                            : activeModule?.name}
                        </h3>

                        <p className="ls-spotlight-body-concise">
                          {isHubSelectedInArch02
                            ? isZh
                              ? '作为整个双人档案馆的中心房间，将 Moments 封面叠卡、Timeline 弧线、Our World 正射地球仪、未来计划与下一个纪念日汇聚在同一屏视野内。'
                              : 'Acts as the spatial room at the centre of the archive, connecting the Moments stack, Timeline arc, Our World orthographic globe, Future Plans, and Next Anniversary in one view.'
                            : activeModule?.roleDescription}
                        </p>
                      </div>

                      <LoveStoryEvidencePicture
                        slot={activeArchSlot}
                        alt={
                          isHubSelectedInArch02
                            ? 'Our World Spatial Hub Interface'
                            : `${activeModule?.name} Interface`
                        }
                        badge={
                          isHubSelectedInArch02
                            ? 'HUB · OUR SPACE'
                            : activeModule?.name
                        }
                        caption={
                          isZh
                            ? '点击任意架构节点即可切换对应模块的实机界面截图（支持点击放大）'
                            : 'Click any constellation node to inspect its corresponding live product screen (click image to enlarge).'
                        }
                        enlargeLabel={enlargeLabel}
                        priority
                        onEnlarge={() =>
                          setEnlargedMedia({
                            slot: activeArchSlot,
                            title: isHubSelectedInArch02
                              ? `${loveStoryData.scene03Connections.hubLabel} (Our Space Hub)`
                              : activeModule?.name ?? '',
                            caption: isHubSelectedInArch02
                              ? loveStoryData.scene03Connections.lead
                              : activeModule?.roleDescription ?? '',
                            badge: isHubSelectedInArch02
                              ? 'Central Hub'
                              : activeModule?.statusBadge,
                          })
                        }
                      />

                      {!isHubSelectedInArch02 && activeModule ? (
                        <div className="ls-spotlight-connections">
                          <span className="ls-connections-label">
                            {isZh ? '关联流转路径：' : 'Connected Pathways:'}
                          </span>
                          <div className="ls-connections-tags">
                            {activeModule.connectedTo.map((conn) => (
                              <span key={conn} className="ls-conn-tag">
                                {conn}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </article>
                  </div>

                  {/* Progressive Disclosure: Core User Pathways */}
                  <div className="ls-evidence-foundation-bar">
                    <span className="ls-evidence-slot-label">
                      {loveStoryData.scene03Connections.pathwaysHeading}
                    </span>
                    <button
                      type="button"
                      className="ls-explore-more-toggle"
                      aria-expanded={showMoreDetail}
                      onClick={() => setShowMoreDetail((prev) => !prev)}
                    >
                      <span>
                        {showMoreDetail
                          ? isZh
                            ? '收起核心用户流路径 −'
                            : 'Hide Core User Journeys −'
                          : isZh
                          ? '查看 4 条核心用户流路径 +'
                          : 'View 4 Core User Journeys +'}
                      </span>
                    </button>
                  </div>

                  {showMoreDetail ? (
                    <div className="ls-expanded-supporting-grid">
                      {loveStoryData.scene03Connections.pathways.map((pw) => (
                        <div key={pw.id} className="ls-supporting-mini-card">
                          <span>
                            {pw.code} · {pw.title}
                          </span>
                          <p>{pw.stepsSummary}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* ============================================================
                  ARCHIVE 03 STAGE — EXPERIENCE THE MEMORIES (Visual Exhibition)
                  ============================================================ */}
              {selectedArchiveId === 'archive-03' ? (
                <div
                  className="ls-stage-03-exhibition"
                  data-active-exhibition={activeExhibitionArea.id}
                >
                  {/* 4-Area Exhibition Switcher */}
                  <div
                    className="ls-exhibition-stage-tabs"
                    role="tablist"
                    aria-label={
                      isZh
                        ? '切换核心记忆体验展区'
                        : 'Select memory experience exhibition area'
                    }
                  >
                    {exhibitionAreas.map((area, idx) => {
                      const isSelected = idx === activeExhibitionAreaIdx
                      return (
                        <button
                          key={area.id}
                          type="button"
                          role="tab"
                          data-exhibition-tab={area.id}
                          aria-selected={isSelected}
                          className={`ls-exhibition-tab-btn ${
                            isSelected ? 'is-active' : ''
                          }`}
                          onClick={() => {
                            setActiveExhibitionAreaIdx(idx)
                            setActiveSupportingMediaIdx(0)
                          }}
                        >
                          <span className="ls-exh-code">{area.code}</span>
                          <span className="ls-exh-title">{area.tabLabel}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Dark Archive Exhibition Frame (#171815 / #20211E) */}
                  <div className="ls-dark-exhibition-frame" role="tabpanel">
                    <div className="ls-exhibition-top-bar">
                      <div>
                        <span className="ls-exhibition-kicker">
                          {activeExhibitionArea.code}
                        </span>
                        <h3 className="ls-exhibition-main-title">
                          {activeExhibitionArea.title}
                        </h3>
                        <p className="ls-exhibition-sub">
                          {activeExhibitionArea.subtitle}
                        </p>
                      </div>
                      <span className="ls-exhibition-status-badge">
                        {activeExhibitionArea.statusBadge}
                      </span>
                    </div>

                    {/* Interactive Memory Gallery (Area A — Memory Gallery) */}
                    {activeExhibitionArea.id === 'moments' ? (
                      <LoveStoryMemoryGallery
                        isZh={isZh}
                        selectedSharedMemoryId={selectedDemoMemoryId}
                        onSelectSharedMemory={setSelectedDemoMemoryId}
                        initialOpenDetailMemoryId={pendingGalleryDetailId}
                        onClearInitialOpenDetail={() =>
                          setPendingGalleryDetailId(null)
                        }
                        isExternalModalOpen={enlargedMedia !== null}
                        onJumpToMemoryMap={(memoryId) => {
                          setSelectedDemoMemoryId(memoryId)
                          setActiveExhibitionAreaIdx(2)
                          setActiveSupportingMediaIdx(0)
                        }}
                      />
                    ) : null}

                    {/* Interactive Timeline × Memory Map (Area B & Area C) */}
                    {activeExhibitionArea.id === 'timeline' ||
                    activeExhibitionArea.id === 'map' ? (
                      <LoveStoryTimelineMapExplorer
                        isZh={isZh}
                        selectedMemoryId={selectedDemoMemoryId}
                        onSelectMemory={setSelectedDemoMemoryId}
                        onOpenInGallery={(memoryId) => {
                          setSelectedDemoMemoryId(memoryId)
                          setPendingGalleryDetailId(memoryId)
                          setActiveExhibitionAreaIdx(0)
                          setActiveSupportingMediaIdx(0)
                        }}
                      />
                    ) : null}

                    {/* Interactive Private Archive (Area D — Private Lock & Mobile UI) */}
                    {activeExhibitionArea.id === 'private-mobile' ? (
                      <LoveStoryPrivateArchiveDemo isZh={isZh} />
                    ) : null}

                    <div className="ls-exhibition-evidence-divider">
                      <span className="ls-exhibition-evidence-kicker">
                        {isZh
                          ? '实机产品界面截图 · 点击任意画面放大检视'
                          : 'AUTHENTIC CAPTURED PRODUCT INTERFACES · CLICK ANY SCREEN TO ENLARGE'}
                      </span>
                    </div>

                    {/* Primary Large Screenshot Showcase */}
                    <div className="ls-exhibition-primary-showcase">
                      <LoveStoryEvidencePicture
                        slot={activeExhibitionArea.primaryMedia.slot}
                        alt={activeExhibitionArea.primaryMedia.title}
                        badge={activeExhibitionArea.primaryMedia.badge}
                        caption={activeExhibitionArea.primaryMedia.caption}
                        enlargeLabel={enlargeLabel}
                        priority
                        onEnlarge={() =>
                          setEnlargedMedia({
                            slot: activeExhibitionArea.primaryMedia.slot,
                            title: activeExhibitionArea.primaryMedia.title,
                            caption: activeExhibitionArea.primaryMedia.caption,
                            badge: activeExhibitionArea.primaryMedia.badge,
                          })
                        }
                      />
                    </div>

                    {/* Supporting Screenshots Row (Natural Landscape 16:10 or Portrait 9:19.5 Proportions) */}
                    <div className="ls-exhibition-supporting-row">
                      <div className="ls-exhibition-supporting-media-grid">
                        {activeExhibitionArea.supportingMedia.map(
                          (media, sIdx) => (
                            <div
                              key={media.title}
                              className={`ls-supporting-media-card ${
                                media.slot.orientation === 'portrait'
                                  ? 'is-portrait-card'
                                  : 'is-landscape-card'
                              } ${
                                sIdx === activeSupportingMediaIdx
                                  ? 'is-selected'
                                  : ''
                              }`}
                            >
                              <LoveStoryEvidencePicture
                                slot={media.slot}
                                alt={media.title}
                                badge={media.badge}
                                caption={media.caption}
                                enlargeLabel={enlargeLabel}
                                onEnlarge={() =>
                                  setEnlargedMedia({
                                    slot: media.slot,
                                    title: media.title,
                                    caption: media.caption,
                                    badge: media.badge,
                                  })
                                }
                              />
                            </div>
                          )
                        )}
                      </div>

                      {/* Concise UX Insights & Live Link */}
                      <aside className="ls-exhibition-ux-notes">
                        <span className="ls-ux-notes-kicker">
                          {isZh ? '核心设计决策' : 'KEY UX DECISIONS'}
                        </span>
                        <p className="ls-exhibition-description">
                          {activeExhibitionArea.uxSummary}
                        </p>
                        <ul className="ls-ux-insights-list">
                          {activeExhibitionArea.uxInsights.map((pt) => (
                            <li key={pt}>{pt}</li>
                          ))}
                        </ul>

                        {project.externalUrl ? (
                          <a
                            href={project.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ls-exhibition-live-btn"
                          >
                            <span>
                              {loveStoryData.scene01Story.liveCtaLabel}
                            </span>
                            <ArrowUpRightIcon size={15} />
                          </a>
                        ) : null}
                      </aside>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* ============================================================
                  ARCHIVE 04 STAGE — MADE WITH INTENTION (Design System & Themes)
                  ============================================================ */}
              {selectedArchiveId === 'archive-04' ? (
                <div className="ls-stage-04-specimen">
                  {/* LS-04D — Interactive Design System Specimen (Dual Theme & 4-State UI) */}
                  <LoveStoryDesignSystemShowcase isZh={isZh} />

                  {/* Interactive Dual-Theme & Screen Comparison Toolbar */}
                  <div className="ls-ds-comparison-toolbar">
                    <div
                      className="ls-ds-control-group"
                      role="group"
                      aria-label={
                        isZh ? '选择对比界面' : 'Select product screen'
                      }
                    >
                      <span className="ls-ds-control-label">
                        {isZh ? '实机界面样本：' : 'Interface Screen:'}
                      </span>
                      {(['hub', 'timeline', 'unlock'] as const).map((scr) => (
                        <button
                          key={scr}
                          type="button"
                          data-ds-screen={scr}
                          aria-pressed={activeDsScreenKey === scr}
                          className={`ls-ds-pill-btn ${
                            activeDsScreenKey === scr ? 'is-active' : ''
                          }`}
                          onClick={() => setActiveDsScreenKey(scr)}
                        >
                          {isZh
                            ? dsScreenPairs[scr].labelZh
                            : dsScreenPairs[scr].labelEn}
                        </button>
                      ))}
                    </div>

                    <div
                      className="ls-ds-control-group"
                      role="group"
                      aria-label={
                        isZh ? '切换双境主题视图' : 'Select surface theme mode'
                      }
                    >
                      <span className="ls-ds-control-label">
                        {isZh ? '主题模式：' : 'Theme View:'}
                      </span>
                      <button
                        type="button"
                        data-ds-theme="split"
                        aria-pressed={activeDsSurfaceTheme === 'split'}
                        className={`ls-ds-pill-btn ${
                          activeDsSurfaceTheme === 'split' ? 'is-active' : ''
                        }`}
                        onClick={() => setActiveDsSurfaceTheme('split')}
                      >
                        {isZh ? '双境同屏对比' : 'Side-by-Side Compare'}
                      </button>
                      <button
                        type="button"
                        data-ds-theme="dark"
                        aria-pressed={activeDsSurfaceTheme === 'dark'}
                        className={`ls-ds-pill-btn ${
                          activeDsSurfaceTheme === 'dark' ? 'is-active' : ''
                        }`}
                        onClick={() => setActiveDsSurfaceTheme('dark')}
                      >
                        Dark Archive (#10110F)
                      </button>
                      <button
                        type="button"
                        data-ds-theme="light"
                        aria-pressed={activeDsSurfaceTheme === 'light'}
                        className={`ls-ds-pill-btn ${
                          activeDsSurfaceTheme === 'light' ? 'is-active' : ''
                        }`}
                        onClick={() => setActiveDsSurfaceTheme('light')}
                      >
                        Paper &amp; Ink (#F3EFE7)
                      </button>
                    </div>
                  </div>

                  {/* Authentic Dual-Theme Visual Comparison Stage */}
                  <div
                    className={`ls-ds-visual-comparison-grid is-mode-${activeDsSurfaceTheme}`}
                  >
                    {activeDsSurfaceTheme === 'split' ||
                    activeDsSurfaceTheme === 'dark' ? (
                      <div className="ls-ds-theme-showcase-card is-dark">
                        <div className="ls-ds-theme-card-head">
                          <span className="ls-surface-badge">
                            {loveStoryData.scene05System.darkArchiveCard.badge}
                          </span>
                          <span className="ls-ds-hex-pill">
                            --color-bg: #10110F · --color-photo-frame: #20211E
                          </span>
                        </div>
                        <LoveStoryEvidencePicture
                          slot={currentDsPair.dark}
                          alt={`Dark Archive — ${currentDsPair.labelEn}`}
                          badge="Dark Archive (#10110F)"
                          caption={
                            isZh
                              ? currentDsPair.captionDarkZh
                              : currentDsPair.captionDarkEn
                          }
                          enlargeLabel={enlargeLabel}
                          priority
                          onEnlarge={() =>
                            setEnlargedMedia({
                              slot: currentDsPair.dark,
                              title: `Dark Archive — ${
                                isZh
                                  ? currentDsPair.labelZh
                                  : currentDsPair.labelEn
                              }`,
                              caption: isZh
                                ? currentDsPair.captionDarkZh
                                : currentDsPair.captionDarkEn,
                              badge: 'Dark Archive Theme',
                            })
                          }
                        />
                      </div>
                    ) : null}

                    {activeDsSurfaceTheme === 'split' ||
                    activeDsSurfaceTheme === 'light' ? (
                      <div className="ls-ds-theme-showcase-card is-light">
                        <div className="ls-ds-theme-card-head">
                          <span className="ls-surface-badge is-paper-badge">
                            {loveStoryData.scene05System.paperInkCard.badge}
                          </span>
                          <span className="ls-ds-hex-pill">
                            --color-bg: #F5F3EE · --color-accent: #92713C
                          </span>
                        </div>
                        <LoveStoryEvidencePicture
                          slot={currentDsPair.light}
                          alt={`Paper & Ink — ${currentDsPair.labelEn}`}
                          badge="Paper & Ink (#F3EFE7)"
                          caption={
                            isZh
                              ? currentDsPair.captionLightZh
                              : currentDsPair.captionLightEn
                          }
                          enlargeLabel={enlargeLabel}
                          priority
                          onEnlarge={() =>
                            setEnlargedMedia({
                              slot: currentDsPair.light,
                              title: `Paper & Ink — ${
                                isZh
                                  ? currentDsPair.labelZh
                                  : currentDsPair.labelEn
                              }`,
                              caption: isZh
                                ? currentDsPair.captionLightZh
                                : currentDsPair.captionLightEn,
                              badge: 'Paper & Ink Theme',
                            })
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* ============================================================
                  ARCHIVE 05 STAGE — BUILT & BEYOND (Issue -> Change -> Visual Result)
                  ============================================================ */}
              {selectedArchiveId === 'archive-05' ? (
                <div
                  className="ls-stage-05-built"
                  data-active-iteration={activeIteration.code}
                >
                  <div className="ls-built-arch-banner">
                    <span className="ls-built-kicker">
                      {loveStoryData.scene06Built.architectureHeading}
                    </span>
                    <p className="ls-built-summary">
                      {loveStoryData.scene06Built.architectureSummary}
                    </p>
                  </div>

                  {/* Interactive 3-Node Iteration Selector */}
                  <div className="ls-iteration-timeline-stage">
                    <div
                      className="ls-iteration-nodes-row"
                      role="tablist"
                      aria-label={
                        isZh ? '真实使用迭代节点' : 'Verified iteration records'
                      }
                    >
                      {loveStoryData.scene06Built.iterations.map(
                        (iter, idx) => {
                          const isSelected = idx === activeIterationIndex
                          return (
                            <button
                              key={iter.code}
                              type="button"
                              role="tab"
                              data-iteration-tab={iter.code}
                              aria-selected={isSelected}
                              className={`ls-iteration-node-btn ${
                                isSelected ? 'is-active' : ''
                              }`}
                              onClick={() => setActiveIterationIndex(idx)}
                            >
                              <span className="ls-iter-code">{iter.code}</span>
                              <strong className="ls-iter-heading">
                                {iter.title}
                              </strong>
                            </button>
                          )
                        }
                      )}
                    </div>

                    {/* Issue -> Design Change -> Authentic Visual Result */}
                    <article
                      className="ls-iteration-visual-card"
                      role="tabpanel"
                    >
                      <div className="ls-iteration-text-columns">
                        <div className="ls-iter-col">
                          <span className="ls-col-kicker">
                            01 ·{' '}
                            {isZh
                              ? '真实使用问题 (Issue)'
                              : 'Documented Issue & Trigger'}
                          </span>
                          <p>{activeIteration.feedbackTrigger}</p>
                        </div>
                        <div className="ls-iter-col ls-iter-col--response">
                          <span className="ls-col-kicker">
                            02 ·{' '}
                            {isZh
                              ? '架构与界面重构 (Design Change)'
                              : 'Interface & Architecture Change'}
                          </span>
                          <p>{activeIteration.designResponse}</p>
                        </div>
                      </div>

                      {/* Authentic Visual Result Showcase */}
                      <div className="ls-iteration-visual-result-box">
                        <div className="ls-iter-visual-head">
                          <span className="ls-col-kicker">
                            03 ·{' '}
                            {isZh
                              ? '实机落地视觉结果 (Actual Visual Result)'
                              : 'Actual Visual Result (Verified Product UI)'}
                          </span>
                          <span className="ls-iter-honest-note">
                            {activeIterationIndex === 2
                              ? isZh
                                ? '对比展示：桌面端右侧抽屉表单 (1440×900) → 移动端六步全屏编辑器 (390×844)'
                                : 'Cross-Device Result: Desktop Side Sheet (1440×900) → Mobile 6-Step Fullscreen Composer (390×844)'
                              : isZh
                              ? '注：早期迭代前的历史旧界面未保留截图，此处展示重构后实装的最终真实界面。'
                              : 'Note: Pre-iteration legacy states were not archived; shown below is the verified implemented interface.'}
                          </span>
                        </div>

                        {activeIterationIndex === 0 ? (
                          <LoveStoryEvidencePicture
                            slot={
                              LOVE_STORY_ASSET_SPEC.iterations.sharedSpaceSync
                            }
                            alt="Iteration 01 Result — Shared Space & Profile Drawer"
                            badge="ITERATION 01 RESULT · SHARED SPACE DRAWER"
                            caption={
                              isZh
                                ? '在 Profile 抽屉中明确展示当前所在共享空间（Our Story · Shared Space · 2 Members）与空间切换/邀请入口。'
                                : 'Explicit Current Space indicator ("Our Story · Shared Space · 2 Members") and space switcher inside the Profile drawer.'
                            }
                            enlargeLabel={enlargeLabel}
                            onEnlarge={() =>
                              setEnlargedMedia({
                                slot: LOVE_STORY_ASSET_SPEC.iterations
                                  .sharedSpaceSync,
                                title: activeIteration.title,
                                caption: activeIteration.designResponse,
                                badge: activeIteration.code,
                              })
                            }
                          />
                        ) : null}

                        {activeIterationIndex === 1 ? (
                          <LoveStoryEvidencePicture
                            slot={
                              LOVE_STORY_ASSET_SPEC.iterations
                                .chronologicalOrder
                            }
                            alt="Iteration 02 Result — Event-Date Chronological Timeline"
                            badge="ITERATION 02 RESULT · EVENT-DATE TIMELINE"
                            caption={
                              isZh
                                ? 'Timeline 严格按事件发生日期（YYYY-MM-DD）排序，并将纪念日独立存储，避免补录记忆打乱时间脉络。'
                                : 'Timeline ordered strictly by historical event date (YYYY-MM-DD) with recurring anniversaries separated into their own store.'
                            }
                            enlargeLabel={enlargeLabel}
                            onEnlarge={() =>
                              setEnlargedMedia({
                                slot: LOVE_STORY_ASSET_SPEC.iterations
                                  .chronologicalOrder,
                                title: activeIteration.title,
                                caption: activeIteration.designResponse,
                                badge: activeIteration.code,
                              })
                            }
                          />
                        ) : null}

                        {activeIterationIndex === 2 ? (
                          <div className="ls-iter-03-comparison-grid">
                            <div className="ls-iter-03-desktop-col">
                              <LoveStoryEvidencePicture
                                slot={
                                  LOVE_STORY_ASSET_SPEC.iterations
                                    .desktopMemorySheet
                                }
                                alt="Desktop Add Memory Side Sheet (1440×900)"
                                badge="DESKTOP · SIDE SHEET FORM (1440×900)"
                                caption={
                                  isZh
                                    ? '桌面端采用右侧抽屉面板，保持背景相册上下文可见。'
                                    : 'Desktop uses a right-hand side sheet so the album remains visible in context.'
                                }
                                enlargeLabel={enlargeLabel}
                                onEnlarge={() =>
                                  setEnlargedMedia({
                                    slot: LOVE_STORY_ASSET_SPEC.iterations
                                      .desktopMemorySheet,
                                    title:
                                      'Desktop Add Memory Side Sheet (1440×900)',
                                    caption: activeIteration.designResponse,
                                    badge: 'Desktop Form',
                                  })
                                }
                              />
                            </div>
                            <div className="ls-iter-03-mobile-col">
                              <LoveStoryEvidencePicture
                                slot={
                                  LOVE_STORY_ASSET_SPEC.iterations
                                    .mobileComposer
                                }
                                alt="Mobile 6-Step Fullscreen Memory Composer (390×844)"
                                badge="MOBILE · 6-STEP COMPOSER (390×844)"
                                caption={
                                  isZh
                                    ? '移动端重构为六步折叠全屏表单与底部固定保存栏。'
                                    : 'Mobile adapts the form into a 6-section fullscreen composer with sticky bottom Save action.'
                                }
                                enlargeLabel={enlargeLabel}
                                onEnlarge={() =>
                                  setEnlargedMedia({
                                    slot: LOVE_STORY_ASSET_SPEC.iterations
                                      .mobileComposer,
                                    title:
                                      'Mobile Fullscreen Memory Composer (390×844)',
                                    caption: activeIteration.designResponse,
                                    badge: 'Mobile Form (390×844)',
                                  })
                                }
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </div>

                  {/* Honest Scope Toggle */}
                  <div className="ls-evidence-foundation-bar">
                    <span className="ls-scope-caption">
                      {loveStoryData.scene06Built.boundariesHeading}
                    </span>
                    <button
                      type="button"
                      className="ls-explore-more-toggle"
                      aria-expanded={showMoreDetail}
                      onClick={() => setShowMoreDetail((prev) => !prev)}
                    >
                      <span>
                        {showMoreDetail
                          ? isZh
                            ? '收起实现边界清单 −'
                            : 'Hide Scope Boundaries −'
                          : isZh
                          ? '查看已实装 vs. 原型边界 +'
                          : 'View Implemented vs. Prototype Scope +'}
                      </span>
                    </button>
                  </div>

                  {showMoreDetail ? (
                    <div className="ls-expanded-supporting-grid ls-expanded-supporting-grid--2col">
                      <div className="ls-supporting-mini-card">
                        <span>
                          {loveStoryData.scene06Built.implementedListTitle}
                        </span>
                        <ul className="ls-scope-mini-list">
                          {loveStoryData.scene06Built.implementedItems.map(
                            (it) => (
                              <li key={it}>{it}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="ls-supporting-mini-card">
                        <span>
                          {loveStoryData.scene06Built.plannedListTitle}
                        </span>
                        <ul className="ls-scope-mini-list">
                          {loveStoryData.scene06Built.plannedItems.map((it) => (
                            <li key={it}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}

                  <blockquote className="ls-closing-reflection-quote">
                    {loveStoryData.scene06Built.closingReflection}
                  </blockquote>
                </div>
              ) : null}

              {/* Bottom Focused Archive Navigation Bar */}
              <footer className="ls-focused-bottom-nav">
                <button
                  type="button"
                  className="ls-return-index-btn"
                  onClick={handleReturnToIndex}
                >
                  <ArrowLeftIcon size={15} />
                  <span>
                    {isZh ? '返回档案目录' : 'Return to Archive Index'}
                  </span>
                </button>

                {nextArchiveMeta ? (
                  <button
                    type="button"
                    className="ls-next-archive-btn is-primary"
                    onClick={() =>
                      handleSwitchArchiveInDetail(nextArchiveMeta.id)
                    }
                  >
                    <span>
                      {isZh ? '继续探索下一卷' : 'Continue to'}{' '}
                      {nextArchiveMeta.number} · {nextArchiveMeta.title}
                    </span>
                    <ArrowRightIcon size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ls-next-archive-btn is-primary"
                    onClick={handleReturnToIndex}
                  >
                    <span>
                      {isZh
                        ? '完成全部五卷探索 · 返回目录'
                        : 'All 5 Archives Explored · Return to Index'}
                    </span>
                    <ArrowRightIcon size={15} />
                  </button>
                )}
              </footer>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Accessible Click-to-Enlarge Lightbox Modal */}
      <LoveStoryLightboxModal
        item={enlargedMedia}
        closeLabel={closeModalLabel}
        onClose={() => setEnlargedMedia(null)}
      />

      {/* Standalone Footer */}
      <footer className="ls-standalone-footer">
        <div className="ls-standalone-footer-inner">
          <button
            type="button"
            className="ls-footer-back-btn"
            onClick={onBackToPortfolio}
          >
            <ArrowLeftIcon size={16} />
            <span>{backToPortfolioLabel}</span>
          </button>

          <button
            type="button"
            className="ls-footer-next-btn"
            onClick={() => onSelectProject(nextProject.id)}
          >
            <span>
              {nextProjectLabel}: {nextProject.title}
            </span>
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </footer>
    </div>
  )
}
