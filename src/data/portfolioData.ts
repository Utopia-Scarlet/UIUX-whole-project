export {
  TRANSLATIONS,
  type Locale,
  type ResumeSectionId,
  type ProjectId,
  type WorkspaceDestination,
  type ResumeSectionNavMeta,
  type EducationEntry,
  type ProjectExperienceEntry,
  type WorkExperienceEntry,
  type SkillCategoryGroup,
  type AdditionalProjectEntry,
  type ProjectPreviewState,
  type ProjectShellData,
  type CaseStudyChapterTemplate,
  type ZeroLineActMeta,
  type ZeroLineShowcaseTab,
  type ZeroLineShowcaseSectionId,
  type ZeroLineUserSegment,
  type ZeroLineRequirementItem,
  type ZeroLineIterationItem,
  type ZeroLineWebsiteSectionIa,
  type ZeroLineUserFlowItem,
  type ZeroLineGoalItem,
  type ZeroLineChapterDetail,
  type ZeroLineExperienceData,
  type LoveStorySceneId,
  type LoveStorySurfaceTheme,
  type LoveStorySceneMeta,
  type LoveStoryNeedFoundationItem,
  type LoveStoryModuleNode,
  type LoveStoryPathwaySummary,
  type LoveStoryShowcaseStageItem,
  type LoveStoryIterationRecord,
  type LoveStoryExperienceData,
} from '../i18n/translations'

export const PROJECT_IDS = ['bridgework-au', 'zero-line', 'lovestory'] as const

export function isProjectDestination(
  dest: string
): dest is 'bridgework-au' | 'zero-line' | 'lovestory' {
  return (
    dest === 'bridgework-au' || dest === 'zero-line' || dest === 'lovestory'
  )
}

/**
 * Resolves a public asset path so it works in both local Vite development (`BASE_URL = '/'`)
 * and GitHub Pages deployments under a repository subpath (e.g., `BASE_URL = '/repo-name/'`).
 */
export function resolvePublicAssetPath(relativePath: string): string {
  const metaEnv = (
    import.meta as unknown as { env?: { BASE_URL?: string } }
  ).env
  const baseUrl = metaEnv?.BASE_URL || '/'
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const normalizedRel = relativePath.startsWith('/')
    ? relativePath.slice(1)
    : relativePath
  return `${normalizedBase}${normalizedRel}`
}

export const DESIGNER_IDENTITY = {
  name: 'Jianshuo Liu',
  nameZh: '刘建硕',
  firstNameUpper: 'JIANSHUO',
  lastNameUpper: 'LIU',
  portraitAssetSpec: {
    primaryPath: resolvePublicAssetPath('portrait/jianshuo-portrait.webp'),
    fallbackPath: resolvePublicAssetPath('portrait/jianshuo-portrait.png'),
    recommendedDimensions:
      '1200 × 1500 px (4:5 aspect ratio, transparent PNG/WebP cutout)',
  },
} as const

/**
 * Replaceable Character & Authentic Website Showcase Asset Slots for ZERO//LINE
 * All paths use `resolvePublicAssetPath` for local Vite and GitHub Pages subpath compatibility.
 */
export type NovaIntroPoseId = 'ready' | 'draw' | 'windup' | 'strike'

export type NovaPoseTransitionType =
  | 'grounded-hold'
  | 'match-cut-draw'
  | 'match-cut-coil'
  | 'match-cut-strike'

export interface NovaIntroFrameSpec {
  id: NovaIntroPoseId
  frameNumber: '01' | '02' | '03' | '04'
  codeLabel: string
  assetPath: string
  webp: string
  png: string
  jpg: string
  startMs: number
  endMs: number
  scale: number
  x: string
  y: string
  rotation: string
  transitionType: NovaPoseTransitionType
  motionDirection: string
}

export const ZERO_LINE_ASSET_SPEC = {
  slashCharacterWebp: resolvePublicAssetPath(
    'zeroline/zeroline-character-slash.webp'
  ),
  slashCharacterPng: resolvePublicAssetPath(
    'zeroline/zeroline-character-slash.png'
  ),
  heroCharacterOptWebp: resolvePublicAssetPath(
    'zeroline/zeroline-hero-character-opt.webp'
  ),
  heroCharacterWebp: resolvePublicAssetPath(
    'zeroline/zeroline-hero-character.webp'
  ),
  heroCharacterPng: resolvePublicAssetPath(
    'zeroline/zeroline-hero-character.png'
  ),
  introCleanBgWebp: resolvePublicAssetPath(
    'zeroline/intro/processed/nova-bg-clean.webp'
  ),
  introCleanBgPng: resolvePublicAssetPath(
    'zeroline/intro/processed/nova-bg-clean.png'
  ),
  introSlashFxWebp: resolvePublicAssetPath(
    'zeroline/intro/processed/nova-04-slash-fx.webp'
  ),
  introSlashFxPng: resolvePublicAssetPath(
    'zeroline/intro/processed/nova-04-slash-fx.png'
  ),
  recommendedSlashDimensions:
    '1600 × 1800 px (transparent WebP/PNG character cutout with action silhouette)',
  recommendedHeroDimensions:
    '1024 × 1536 px (2:3 vertical key art or 4:5 character portrait)',
  introFrames: [
    {
      id: 'ready',
      frameNumber: '01',
      codeLabel: 'FRAME 01 // READY',
      assetPath: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-01-ready-alpha.webp'
      ),
      webp: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-01-ready-alpha.webp'
      ),
      png: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-01-ready-alpha.png'
      ),
      jpg: resolvePublicAssetPath('zeroline/intro/nova-01-ready.webp'),
      startMs: 0,
      endMs: 350,
      scale: 1.02,
      x: '0%',
      y: '3.0%',
      rotation: '0deg',
      transitionType: 'grounded-hold',
      motionDirection: 'Grounded vertical guard along shared pelvis & boot anchor',
    },
    {
      id: 'draw',
      frameNumber: '02',
      codeLabel: 'FRAME 02 // DRAW',
      assetPath: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-02-draw-alpha.webp'
      ),
      webp: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-02-draw-alpha.webp'
      ),
      png: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-02-draw-alpha.png'
      ),
      jpg: resolvePublicAssetPath('zeroline/intro/nova-02-draw.webp'),
      startMs: 350,
      endMs: 850,
      scale: 0.99,
      x: '-2.0%',
      y: '0.2%',
      rotation: '-0.5deg',
      transitionType: 'match-cut-draw',
      motionDirection: 'Upward-right diagonal sword draw from ground across chest',
    },
    {
      id: 'windup',
      frameNumber: '03',
      codeLabel: 'FRAME 03 // WIND-UP',
      assetPath: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-03-windup-alpha.webp'
      ),
      webp: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-03-windup-alpha.webp'
      ),
      png: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-03-windup-alpha.png'
      ),
      jpg: resolvePublicAssetPath('zeroline/intro/nova-03-windup.webp'),
      startMs: 850,
      endMs: 1350,
      scale: 1.01,
      x: '-3.2%',
      y: '0.4%',
      rotation: '-1.2deg',
      transitionType: 'match-cut-coil',
      motionDirection: 'Overhead two-handed coil with upper-left blade extension',
    },
    {
      id: 'strike',
      frameNumber: '04',
      codeLabel: 'FRAME 04 // STRIKE',
      assetPath: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-04-strike-alpha.webp'
      ),
      webp: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-04-strike-alpha.webp'
      ),
      png: resolvePublicAssetPath(
        'zeroline/intro/processed/nova-04-strike-alpha.png'
      ),
      jpg: resolvePublicAssetPath('zeroline/intro/nova-04-strike.webp'),
      startMs: 1350,
      endMs: 2200,
      scale: 0.9,
      x: '1.6%',
      y: '1.4%',
      rotation: '1.5deg',
      transitionType: 'match-cut-strike',
      motionDirection: 'Explosive forward combat lunge & crimson arc release',
    },
  ] as ReadonlyArray<NovaIntroFrameSpec>,
  showcaseScreenshots: {
    home: {
      webp: resolvePublicAssetPath('zeroline/showcase/zeroline-home.webp'),
      png: resolvePublicAssetPath('zeroline/showcase/zeroline-home.png'),
      expectedFile: 'public/zeroline/showcase/zeroline-home.webp (or .png)',
    },
    news: {
      webp: resolvePublicAssetPath('zeroline/showcase/zeroline-news.webp'),
      png: resolvePublicAssetPath('zeroline/showcase/zeroline-news.png'),
      expectedFile: 'public/zeroline/showcase/zeroline-news.webp (or .png)',
    },
    heroes: {
      webp: resolvePublicAssetPath('zeroline/showcase/zeroline-heroes.webp'),
      png: resolvePublicAssetPath('zeroline/showcase/zeroline-heroes.png'),
      expectedFile: 'public/zeroline/showcase/zeroline-heroes.webp (or .png)',
    },
    store: {
      webp: resolvePublicAssetPath('zeroline/showcase/zeroline-store.webp'),
      png: resolvePublicAssetPath('zeroline/showcase/zeroline-store.png'),
      expectedFile: 'public/zeroline/showcase/zeroline-store.webp (or .png)',
    },
    about: {
      webp: resolvePublicAssetPath('zeroline/showcase/zeroline-about.webp'),
      png: resolvePublicAssetPath('zeroline/showcase/zeroline-about.png'),
      expectedFile: 'public/zeroline/showcase/zeroline-about.webp (or .png)',
    },
  },
} as const

/**
 * Authentic Visual Evidence Asset Slots for LoveStory (LS-03B)
 * All paths use `resolvePublicAssetPath` for local Vite and GitHub Pages subpath compatibility.
 */
export interface LoveStoryVisualAssetSlot {
  webp: string
  png: string
  aspectRatio: '16 / 10' | '9 / 19.5'
  orientation: 'landscape' | 'portrait'
}

function createLoveStoryAssetSlot(
  relativeBase: string,
  orientation: 'landscape' | 'portrait' = 'landscape'
): LoveStoryVisualAssetSlot {
  return {
    webp: resolvePublicAssetPath(`${relativeBase}.webp`),
    png: resolvePublicAssetPath(`${relativeBase}.png`),
    aspectRatio: orientation === 'portrait' ? '9 / 19.5' : '16 / 10',
    orientation,
  }
}

export const LOVE_STORY_ASSET_SPEC = {
  indexPreviews: {
    'archive-01': createLoveStoryAssetSlot(
      'lovestory/case-study/index/ls-index-01-needs'
    ),
    'archive-02': createLoveStoryAssetSlot(
      'lovestory/case-study/index/ls-index-02-architecture'
    ),
    'archive-03': createLoveStoryAssetSlot(
      'lovestory/case-study/index/ls-index-03-experience'
    ),
    'archive-04': createLoveStoryAssetSlot(
      'lovestory/case-study/index/ls-index-04-system'
    ),
    'archive-05': createLoveStoryAssetSlot(
      'lovestory/case-study/index/ls-index-05-iterations'
    ),
  },
  requirements: {
    'need-01': createLoveStoryAssetSlot(
      'lovestory/case-study/requirements/req-01-shared-space'
    ),
    'need-02': createLoveStoryAssetSlot(
      'lovestory/case-study/requirements/req-02-time-place'
    ),
    'need-03': createLoveStoryAssetSlot(
      'lovestory/case-study/requirements/req-03-private-boundary'
    ),
    'need-04': createLoveStoryAssetSlot(
      'lovestory/case-study/requirements/req-04-future-mobile'
    ),
  },
  architecture: {
    hub: createLoveStoryAssetSlot(
      'lovestory/case-study/architecture/arch-hub-our-world'
    ),
    'mod-moments': createLoveStoryAssetSlot(
      'lovestory/case-study/architecture/arch-node-moments'
    ),
    'mod-timeline': createLoveStoryAssetSlot(
      'lovestory/case-study/architecture/arch-node-timeline'
    ),
    'mod-map': createLoveStoryAssetSlot(
      'lovestory/case-study/architecture/arch-node-memory-map'
    ),
    'mod-private': createLoveStoryAssetSlot(
      'lovestory/case-study/architecture/arch-node-private'
    ),
    'mod-plans': createLoveStoryAssetSlot(
      'lovestory/case-study/architecture/arch-node-future-plans'
    ),
    'mod-anniversary': createLoveStoryAssetSlot(
      'lovestory/case-study/architecture/arch-node-countdown'
    ),
    'mod-profile': createLoveStoryAssetSlot(
      'lovestory/case-study/requirements/req-01-shared-space'
    ),
  },
  experience: {
    momentsGallery: createLoveStoryAssetSlot(
      'lovestory/case-study/experience/exp-01-moments-gallery'
    ),
    memoryDetail: createLoveStoryAssetSlot(
      'lovestory/case-study/experience/exp-01b-memory-detail'
    ),
    entranceGate: createLoveStoryAssetSlot(
      'lovestory/case-study/experience/exp-01c-entrance-gate'
    ),
    timelineStream: createLoveStoryAssetSlot(
      'lovestory/case-study/experience/exp-02-timeline-stream'
    ),
    hubTimelineLink: createLoveStoryAssetSlot(
      'lovestory/case-study/experience/exp-02b-hub-timeline-link'
    ),
    memoryMapGlobe: createLoveStoryAssetSlot(
      'lovestory/case-study/experience/exp-03-memory-map-globe'
    ),
    futureItinerary: createLoveStoryAssetSlot(
      'lovestory/case-study/experience/exp-03b-future-itinerary'
    ),
    privateLock: createLoveStoryAssetSlot(
      'lovestory/case-study/experience/exp-04-private-lock'
    ),
    mobileComposer: createLoveStoryAssetSlot(
      'lovestory/case-study/experience/exp-04b-mobile-composer',
      'portrait'
    ),
    mobileStory: createLoveStoryAssetSlot(
      'lovestory/case-study/experience/exp-04c-mobile-story',
      'portrait'
    ),
  },
  designSystem: {
    darkHub: createLoveStoryAssetSlot(
      'lovestory/case-study/design-system/ds-dark-hub'
    ),
    lightHub: createLoveStoryAssetSlot(
      'lovestory/case-study/design-system/ds-light-hub'
    ),
    darkTimeline: createLoveStoryAssetSlot(
      'lovestory/case-study/design-system/ds-dark-timeline'
    ),
    lightTimeline: createLoveStoryAssetSlot(
      'lovestory/case-study/design-system/ds-light-timeline'
    ),
    darkUnlock: createLoveStoryAssetSlot(
      'lovestory/case-study/design-system/ds-dark-unlock'
    ),
    lightUnlock: createLoveStoryAssetSlot(
      'lovestory/case-study/design-system/ds-light-unlock'
    ),
  },
  iterations: {
    sharedSpaceSync: createLoveStoryAssetSlot(
      'lovestory/case-study/iterations/iter-01-shared-space-sync'
    ),
    chronologicalOrder: createLoveStoryAssetSlot(
      'lovestory/case-study/iterations/iter-02-chronological-order'
    ),
    desktopMemorySheet: createLoveStoryAssetSlot(
      'lovestory/case-study/iterations/iter-03-desktop-memory-sheet'
    ),
    mobileComposer: createLoveStoryAssetSlot(
      'lovestory/case-study/iterations/iter-03b-mobile-composer',
      'portrait'
    ),
  },
  discovery: {
    appleSharedAlbums: createLoveStoryAssetSlot(
      'lovestory/case-study/discovery/comp-01-apple-shared-albums'
    ),
    appleJournal: createLoveStoryAssetSlot(
      'lovestory/case-study/discovery/comp-02-apple-journal'
    ),
    weLove: createLoveStoryAssetSlot(
      'lovestory/case-study/discovery/comp-03-welove'
    ),
  },
  memories: {
    brisbaneRiverwalk: {
      webp: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-01-brisbane-riverwalk.webp'
      ),
      png: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-01-brisbane-riverwalk.png'
      ),
      aspectRatio: '3 / 2',
      orientation: 'landscape' as const,
    },
    brisbaneBotanic: {
      webp: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-02-brisbane-botanic.webp'
      ),
      png: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-02-brisbane-botanic.png'
      ),
      aspectRatio: '4 / 3',
      orientation: 'landscape' as const,
    },
    kyotoLanterns: {
      webp: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-03-kyoto-lanterns.webp'
      ),
      png: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-03-kyoto-lanterns.png'
      ),
      aspectRatio: '4 / 3',
      orientation: 'landscape' as const,
    },
    melbourneArcade: {
      webp: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-04-melbourne-arcade.webp'
      ),
      png: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-04-melbourne-arcade.png'
      ),
      aspectRatio: '3 / 2',
      orientation: 'landscape' as const,
    },
    chengduTeahouse: {
      webp: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-05-chengdu-teahouse.webp'
      ),
      png: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-05-chengdu-teahouse.png'
      ),
      aspectRatio: '3 / 2',
      orientation: 'landscape' as const,
    },
    hulunbeierSteppe: {
      webp: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-06-hulunbeier-steppe.webp'
      ),
      png: resolvePublicAssetPath(
        'lovestory/case-study/memories/mem-06-hulunbeier-steppe.png'
      ),
      aspectRatio: '16 / 10',
      orientation: 'landscape' as const,
    },
  },
} as const

/**
 * Centralized Contact & Public Deployment Configuration
 */
export const CONTACT_CONFIG = {
  email: '13604797719@163.com',
  phone: '13604797719',
  showPhonePublicly: true,
  resumePdfPath: null as string | null,
  projectLinks: {
    zeroLine: 'https://utopia-scarlet.github.io/ZERO-LINE/',
    loveStory: 'https://love-story-archive-production.up.railway.app',
  },
} as const
