export type Locale = 'en' | 'zh-CN'

export type ResumeSectionId =
  | 'overview'
  | 'education'
  | 'experience'
  | 'skills'
  | 'additional-projects'
  | 'honours'
  | 'contact'

export type ProjectId = 'bridgework-au' | 'zero-line' | 'lovestory'

export type WorkspaceDestination = ResumeSectionId | ProjectId

export interface ResumeSectionNavMeta {
  id: ResumeSectionId
  label: string
  shortLabel?: string
}

export interface EducationEntry {
  id: string
  institution: string
  institutionSecondary?: string
  degree: string
  period: string
  details: string[]
}

export interface ProjectExperienceEntry {
  id: ProjectId
  number: string
  brandName: string
  fullTitle: string
  subtitle: string
  period: string
  projectType: string
  responsibilitiesLabel: string
  responsibilities: string
  contributions: string[]
  externalUrl?: string
  externalLinkLabel?: string
  workspaceDestination: ProjectId
  workspaceCtaLabel: string
}

export interface WorkExperienceEntry {
  id: string
  companyZh: string
  companyEn?: string
  role: string
  period: string
  highlights: string[]
}

export interface SkillCategoryGroup {
  id: 'ui-design' | 'ux-design' | 'design-implementation'
  title: string
  subtitle: string
  skills: string[]
}

export interface AdditionalProjectEntry {
  id: string
  title: string
  period: string
  summary: string
}

export interface ProjectPreviewState {
  id: string
  label: string
  headline: string
  description: string
  focusPoints: string[]
}

export interface CaseStudyChapterTemplate {
  number: string
  id: string
  title: string
  scopeNote: string
  contentPlaceholder: string
  mediaPlaceholderLabel: string
  mediaAspect?: 'wide' | 'split' | 'compact'
}

export interface ProjectShellData {
  id: ProjectId
  number: string
  title: string
  fullTitle: string
  category: string
  period: string
  projectType: string
  statusBadge: string
  summary: string
  responsibilitiesLabel: string
  responsibilities: string
  heroPreviewLabel: string
  heroPreviewSubnote: string
  accentTheme: 'bridgework' | 'zeroline' | 'lovestory'
  externalUrl?: string
  externalLinkLabel?: string
  designFocus: string[]
  verifiedContributions: string[]
  interactiveStates?: ProjectPreviewState[]
}

export interface ZeroLineActMeta {
  actNumber: string
  actCode: string
  actTitle: string
  actSubtitle: string
  layoutVariant:
    | 'world-dossier'
    | 'player-intel'
    | 'strategic-matrix'
    | 'system-blueprint'
    | 'interface-showcase'
    | 'evolution-log'
  chapterIds: string[]
}

export type ZeroLineShowcaseSectionId =
  | 'home'
  | 'news'
  | 'heroes'
  | 'store'
  | 'about'

export interface ZeroLineShowcaseTab {
  id: ZeroLineShowcaseSectionId
  code: string
  sectionName: 'HOME' | 'NEWS' | 'HEROES' | 'STORE' | 'ABOUT'
  label: string
  objective: string
  decisions: string[]
  screenshotAlt: string
  missingScreenshotTitle: string
  missingScreenshotNote: string
}

export interface ZeroLineUserSegment {
  id: string
  code: string
  title: string
  profile: string
  primaryGoalLabel: string
  primaryGoal: string
  typicalTaskLabel: string
  typicalTask: string
  designConsiderationLabel: string
  designConsideration: string
  areasLabel: string
  areas: string[]
}

export interface ZeroLineRequirementItem {
  code: string
  title: string
  reasoning: string
}

export interface ZeroLineIterationItem {
  id: string
  code: string
  title: string
  issue: string
  change: string
  result: string
}

export interface ZeroLineWebsiteSectionIa {
  code: string
  name: string
  role: string
  elements: string[]
  statusNote: string
}

export interface ZeroLineUserFlowItem {
  id: string
  code: string
  title: string
  path: string[]
  implementedStatus: string
  boundaryNote: string
}

export interface ZeroLineGoalItem {
  code: string
  title: string
  description: string
}

export interface ZeroLineChapterDetail {
  chapterId: string
  tacticalTag: string
  evidenceBadge?: string
  evidenceNote?: string
  lead: string
  keyPoints: string[]
  visualSlotTitle: string
  visualSlotSpec: string
  secondarySlotTitle?: string
  secondarySlotSpec?: string
}

export interface ZeroLineExperienceData {
  hero: {
    protocolBadge: string
    genreTag: string
    titlePrefix: string
    titleSuffix: string
    deliverableHeading: string
    subtitle: string
    positioningStatement: string
    exploreActCta: string
    liveSiteCta: string
    characterSlotBadge: string
    characterSlotTitle: string
    characterSlotSpec: string
    transitionCharacterLabel: string
    transitionCharacterSubnote: string
    transitionTagline: string
    telemetry: {
      label: string
      value: string
    }[]
    paletteTokens: {
      name: string
      hex: string
      role: string
    }[]
  }
  sidebar: {
    worldModeBadge: string
    actNavigationLabel: string
    progressLabel: string
  }
  acts: ZeroLineActMeta[]
  overviewPositioningQuote: string
  primaryResponsibilitiesHeading: string
  primaryResponsibilities: string[]
  scopeBoundaryHeading: string
  scopeBoundaryItems: string[]
  userSegmentsNotice: string
  userSegments: ZeroLineUserSegment[]
  requirementsHeading: string
  requirementsItems: ZeroLineRequirementItem[]
  evidenceClassificationHeading: string
  evidenceClassificationItems: {
    category: string
    status: string
    detail: string
  }[]
  futureValidationHeading: string
  futureValidationNote: string
  centralProblemLabel: string
  centralProblemStatement: string
  supportingChallengesLabel: string
  supportingChallenges: string[]
  competitorNotice: string
  competitorCandidates: {
    name: string
    positioning: string
    relevance: string
  }[]
  competitorCriteriaLabel: string
  competitorCriteria: string[]
  designGoals: ZeroLineGoalItem[]
  websiteIaHeading: string
  websiteIaLead: string
  websiteIaSections: ZeroLineWebsiteSectionIa[]
  websiteFlowsHeading: string
  websiteFlowsLead: string
  websiteFlows: ZeroLineUserFlowItem[]
  interfaceShowcase: {
    eyebrow: string
    heading: string
    description: string
    objectiveLabel: string
    decisionsLabel: string
    enlargeLabel: string
    closePreviewLabel: string
    openLiveSectionLabel: string
    tabs: ZeroLineShowcaseTab[]
  }
  relatedClientExploration: {
    badge: string
    title: string
    description: string
    points: string[]
  }
  iterationHeaders: {
    issue: string
    change: string
    result: string
  }
  iterationItems: ZeroLineIterationItem[]
  outcomesComparison: {
    completedHeading: string
    completedItems: string[]
    futureHeading: string
    futureItems: string[]
  }
  chapterDetails: Record<string, ZeroLineChapterDetail>
}

export type LoveStorySceneId =
  | 'ls-scene-01'
  | 'ls-scene-02'
  | 'ls-scene-03'
  | 'ls-scene-04'
  | 'ls-scene-05'
  | 'ls-scene-06'

export type LoveStorySurfaceTheme = 'dark-archive' | 'paper-ink'

export interface LoveStorySceneMeta {
  id: LoveStorySceneId
  number: '01' | '02' | '03' | '04' | '05' | '06'
  shortLabel: string
  title: string
  kicker: string
  surfaceTheme: LoveStorySurfaceTheme
  summary: string
}

export interface LoveStoryNeedFoundationItem {
  id: string
  number: string
  needTitle: string
  userContext: string
  designRequirement: string
  designDecision: string
  evidenceSlotLabel: string
}

export interface LoveStoryModuleNode {
  id: string
  name: string
  nameSub: string
  roleDescription: string
  statusBadge: string
  statusTone: 'implemented' | 'prototype' | 'planned'
  connectedTo: string[]
}

export interface LoveStoryPathwaySummary {
  id: string
  code: string
  title: string
  stepsSummary: string
  scopeNote: string
}

export interface LoveStoryShowcaseStageItem {
  id: string
  code: string
  title: string
  subtitle: string
  statusBadge: string
  description: string
  visualFrameLabel: string
  visualFrameSpec: string
}

export interface LoveStoryIterationRecord {
  code: string
  title: string
  feedbackTrigger: string
  designResponse: string
}

export interface LoveStoryExperienceData {
  navigation: {
    storyThreadAria: string
    progressLabel: string
    mobileSceneSelectLabel: string
    openingBoundaryNote: string
  }
  scenes: LoveStorySceneMeta[]
  scene01Story: {
    eyebrow: string
    title: string
    positioningLead: string
    narrativeBody: string
    liveCtaLabel: string
    metadata: {
      label: string
      value: string
    }[]
    heroStageLabel: string
    heroStageSubnote: string
    scopeTransparencyNote: string
  }
  scene02Needs: {
    lead: string
    explorerSlotBadge: string
    explorerSlotNote: string
    columnLabels: {
      userNeed: string
      requirement: string
      decision: string
      evidence: string
    }
    items: LoveStoryNeedFoundationItem[]
  }
  scene03Connections: {
    lead: string
    constellationTitle: string
    constellationSubnote: string
    hubLabel: string
    hubSublabel: string
    statusLegend: {
      implemented: string
      prototype: string
      planned: string
    }
    modules: LoveStoryModuleNode[]
    pathwaysHeading: string
    pathways: LoveStoryPathwaySummary[]
  }
  scene04Memories: {
    lead: string
    stageBadge: string
    stageSubnote: string
    primaryStage: LoveStoryShowcaseStageItem
    supportingStages: LoveStoryShowcaseStageItem[]
  }
  scene05System: {
    lead: string
    dualSurfaceHeading: string
    dualSurfaceLead: string
    darkArchiveCard: {
      badge: string
      title: string
      description: string
      tokensPreview: { name: string; hex: string; usage: string }[]
    }
    paperInkCard: {
      badge: string
      title: string
      description: string
      tokensPreview: { name: string; hex: string; usage: string }[]
    }
    typographyHeading: string
    typographySerifLabel: string
    typographySerifSample: string
    typographySerifNote: string
    typographySansLabel: string
    typographySansSample: string
    typographySansNote: string
    interactionAdaptationHeading: string
    interactionAdaptationLead: string
    adaptationPoints: {
      title: string
      detail: string
    }[]
    stateSystemHeading: string
    stateItems: {
      stateName: string
      behavior: string
    }[]
  }
  scene06Built: {
    lead: string
    architectureHeading: string
    architectureSummary: string
    iterationsHeading: string
    iterations: LoveStoryIterationRecord[]
    boundariesHeading: string
    implementedListTitle: string
    implementedItems: string[]
    plannedListTitle: string
    plannedItems: string[]
    closingReflection: string
  }
}

export interface TranslationDictionary {
  meta: {
    landingTitle: string
    workspaceTitle: string
    skipToMain: string
  }
  identity: {
    nameEn: 'Jianshuo Liu'
    firstNameUpper: 'JIANSHUO'
    lastNameUpper: 'LIU'
    lastNameDisplay: 'LIU.'
    supportingNameZh: string | null
    role: string
    supportingCopy: string
    disciplineLine: string
    focusHeading: string
    interests: string[]
    portraitBadge: string
    portraitBadgeTooltip: string
    portraitAriaLabel: string
    portraitCompactAriaLabel: string
    heroHeadingAria: string
  }
  nav: {
    primaryAria: string
    work: string
    about: string
    contact: string
    themeLightLabel: string
    themeDarkLabel: string
    switchToLightAria: string
    switchToDarkAria: string
    langSwitcherAria: string
    langEnLabel: string
    langZhLabel: string
    switchToEnAria: string
    switchToZhAria: string
    menuToggleLabel: string
    menuCloseLabel: string
    menuOpenAria: string
    menuCloseAria: string
    mobileDrawerAria: string
    themeLightShort: string
    themeDarkShort: string
  }
  landingBottom: {
    selectedProjectsLabel: string
    selectedProjectsValue: string
    architectureLabel: string
    architectureValue: string
    viewWorkCta: string
    enterPortfolioCta: string
  }
  workspace: {
    sidebarAria: string
    resumeGroupAria: string
    resumeGroupLabel: string
    projectsGroupAria: string
    projectsGroupLabel: string
    caseStudyChaptersAria: string
    caseStudyChaptersLabel: string
    caseStudyProjectSwitcherLabel: string
    mobileChapterSelectLabel: string
    expandSidebar: string
    collapseSidebar: string
    expandSidebarAria: string
    collapseSidebarAria: string
    profileOverviewAria: string
    returnToCover: string
    backToResume: string
    backToResumeShort: string
    breadcrumbRoot: string
    breadcrumbResumePrefix: string
    breadcrumbCaseStudyPrefix: string
    openCaseStudyLabel: string
    openCaseStudyAria: (projectName: string) => string
    interactiveStageTitle: string
    stateTabsAria: string
    designFocusHeading: string
    verifiedContributionsHeading: string
    caseStudyPlaceholderBadge: string
    nextProjectLabel: string
  }
  resume: {
    sectionNav: ResumeSectionNavMeta[]
    overview: {
      sectionTitle: string
      eyebrow: string
      nameDisplay: string
      nameSecondary: string
      positioning: string
      summary: string
      quickJumpLabel: string
      keyExpertiseTitle: string
      keyExpertiseItems: string[]
      educationSnapshotTitle: string
      educationSnapshotItems: {
        institution: string
        program: string
        period: string
      }[]
      experienceSnapshotTitle: string
      experienceSnapshotItems: {
        company: string
        role: string
        period: string
      }[]
      featuredProjectsTitle: string
      featuredProjectsLead: string
      viewInResumeLabel: string
    }
    education: {
      sectionTitle: string
      sectionSubtitle: string
      entries: EducationEntry[]
    }
    experience: {
      sectionTitle: string
      sectionSubtitle: string
      projectsTabLabel: string
      workTabLabel: string
      projectsHeading: string
      projectsLead: string
      projects: ProjectExperienceEntry[]
      workHeading: string
      workLead: string
      workEntries: WorkExperienceEntry[]
    }
    skills: {
      sectionTitle: string
      sectionSubtitle: string
      categories: SkillCategoryGroup[]
    }
    additionalProjects: {
      sectionTitle: string
      sectionSubtitle: string
      entries: AdditionalProjectEntry[]
    }
    honoursAndLanguages: {
      sectionTitle: string
      sectionSubtitle: string
      honoursTitle: string
      honoursList: {
        title: string
        detail: string
      }[]
      languagesTitle: string
      examBadges: string[]
      languageCapabilityNote: string
    }
    contact: {
      sectionTitle: string
      sectionSubtitle: string
      emailLabel: string
      phoneLabel: string
      phoneHiddenNote: string
      locationLabel: string
      locationValue: string
      availabilityLabel: string
      availabilityValue: string
      liveProjectsLabel: string
      emailCtaLabel: string
      pdfDownloadLabel: string
      pdfUnavailableNote: string
    }
  }
  caseStudyChapters: CaseStudyChapterTemplate[]
  projects: Record<ProjectId, ProjectShellData>
  zeroLineExperience: ZeroLineExperienceData
  loveStoryExperience: LoveStoryExperienceData
}

export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
  en: {
    meta: {
      landingTitle: 'Jianshuo Liu — UI/UX & Interaction Designer',
      workspaceTitle: 'Jianshuo Liu — Portfolio Workspace & Resume',
      skipToMain: 'Skip to main content',
    },
    identity: {
      nameEn: 'Jianshuo Liu',
      firstNameUpper: 'JIANSHUO',
      lastNameUpper: 'LIU',
      lastNameDisplay: 'LIU.',
      supportingNameZh: null,
      role: 'UI/UX & Interaction Designer',
      supportingCopy:
        'Designing meaningful interactions across games and digital products.',
      disciplineLine: 'GAME UI/UX · PRODUCT DESIGN · INTERACTION',
      focusHeading: 'Focus Disciplines',
      interests: [
        'Game UI/UX',
        'Digital Product Design',
        'Interactive Web Experiences',
        'User Experience and Interaction Systems',
      ],
      portraitBadge: 'Portrait Slot · Ready for PNG/WebP',
      portraitBadgeTooltip:
        'Drop transparent WebP/PNG into public/portrait/jianshuo-portrait.webp (1200 × 1500 px)',
      portraitAriaLabel:
        'Editorial portrait silhouette placeholder for Jianshuo Liu',
      portraitCompactAriaLabel: 'Jianshuo Liu portrait silhouette',
      heroHeadingAria: 'Jianshuo Liu — UI/UX & Interaction Designer',
    },
    nav: {
      primaryAria: 'Primary navigation',
      work: 'Work',
      about: 'About',
      contact: 'Contact',
      themeLightLabel: 'Light · Editorial',
      themeDarkLabel: 'Dark · Studio',
      switchToLightAria: 'Switch to Light mode (current: Dark)',
      switchToDarkAria: 'Switch to Dark mode (current: Light)',
      langSwitcherAria: 'Language selector',
      langEnLabel: 'EN',
      langZhLabel: '中文',
      switchToEnAria: 'Switch language to English',
      switchToZhAria: '切换到简体中文 (Switch language to Simplified Chinese)',
      menuToggleLabel: 'Menu',
      menuCloseLabel: 'Close',
      menuOpenAria: 'Open navigation menu',
      menuCloseAria: 'Close navigation menu',
      mobileDrawerAria: 'Mobile navigation menu',
      themeLightShort: 'Light',
      themeDarkShort: 'Dark',
    },
    landingBottom: {
      selectedProjectsLabel: 'Selected Projects:',
      selectedProjectsValue: 'BridgeWork AU · ZERO//LINE · LoveStory',
      architectureLabel: 'Architecture:',
      architectureValue: 'Interactive Portfolio & Dossier',
      viewWorkCta: 'View Work',
      enterPortfolioCta: 'Enter Portfolio',
    },
    workspace: {
      sidebarAria: 'Portfolio workspace navigation',
      resumeGroupAria: 'Resume sections',
      resumeGroupLabel: 'Resume Dossier',
      projectsGroupAria: 'Selected work destinations',
      projectsGroupLabel: 'Selected Work',
      caseStudyChaptersAria: 'Case study chapters',
      caseStudyChaptersLabel: 'Case Study Chapters',
      caseStudyProjectSwitcherLabel: 'Switch Project',
      mobileChapterSelectLabel: 'Jump to chapter',
      expandSidebar: 'Expand Sidebar',
      collapseSidebar: 'Collapse Sidebar',
      expandSidebarAria: 'Expand Sidebar',
      collapseSidebarAria: 'Collapse Sidebar',
      profileOverviewAria: 'Go to Overview — Jianshuo Liu',
      returnToCover: 'Return to Cover',
      backToResume: 'Back to Resume',
      backToResumeShort: 'Back to Resume',
      breadcrumbRoot: 'Portfolio Workspace',
      breadcrumbResumePrefix: 'Resume',
      breadcrumbCaseStudyPrefix: 'Case Study',
      openCaseStudyLabel: 'Open Case Study',
      openCaseStudyAria: (projectName: string) =>
        `Open ${projectName} Case Study`,
      interactiveStageTitle: 'Interactive Architecture & State Preview',
      stateTabsAria: 'Project state views',
      designFocusHeading: 'Primary Responsibilities & Scope',
      verifiedContributionsHeading: 'Verified Design Scope Summary',
      caseStudyPlaceholderBadge: 'Content & Visual Slot',
      nextProjectLabel: 'Explore Next Case Study',
    },
    resume: {
      sectionNav: [
        { id: 'overview', label: 'Overview', shortLabel: 'Overview' },
        { id: 'education', label: 'Education', shortLabel: 'Education' },
        { id: 'experience', label: 'Experience', shortLabel: 'Experience' },
        { id: 'skills', label: 'Skills', shortLabel: 'Skills' },
        {
          id: 'additional-projects',
          label: 'Additional Projects',
          shortLabel: 'More Projects',
        },
        {
          id: 'honours',
          label: 'Honours & Languages',
          shortLabel: 'Honours',
        },
        { id: 'contact', label: 'Contact', shortLabel: 'Contact' },
      ],
      overview: {
        sectionTitle: 'Overview',
        eyebrow: 'Interactive Resume & Portfolio Dossier',
        nameDisplay: 'Jianshuo Liu',
        nameSecondary: '刘建硕',
        positioning: 'UI/UX Design Intern | Interaction Design Intern',
        summary:
          "Currently pursuing a master's degree in Interaction Design at the University of Queensland, with an undergraduate background in Software Engineering. Experienced in UI/UX projects involving student employment, games, and personal memory applications. Focused on translating user research into information architecture, visual hierarchy, and interaction solutions, then refining designs through prototype reviews and feedback.",
        quickJumpLabel: 'Jump to section:',
        keyExpertiseTitle: 'Key Expertise',
        keyExpertiseItems: [
          'User interviews, competitor analysis & requirements synthesis',
          'Information architecture, user flows & UI state feedback',
          'High-fidelity Figma interfaces, Components & Variants',
          'Responsive layouts, prototype previews & feedback-driven iteration',
        ],
        educationSnapshotTitle: 'Education Summary',
        educationSnapshotItems: [
          {
            institution: 'University of Queensland',
            program: "Interaction Design · Master's studies",
            period: '2026.07 – Present',
          },
          {
            institution: 'Dalian Minzu University',
            program: "Software Engineering · Bachelor's degree",
            period: '2019.09 – 2023.06',
          },
        ],
        experienceSnapshotTitle: 'Experience Highlights',
        experienceSnapshotItems: [
          {
            company: 'Beijing Taihe Interactive (北京钛核互动)',
            role: 'Game Operations',
            period: '2025.08 – 2025.09',
          },
          {
            company: '北京紫辰乐游 (Beijing Zichen Leyou)',
            role: 'Game Operations',
            period: '2024.12 – 2025.08',
          },
          {
            company: '成都天蝎互娱 (Chengdu Scorpio Interactive)',
            role: 'Game Design / Operations',
            period: '2023.08 – 2024.01',
          },
        ],
        featuredProjectsTitle: 'Selected Case Studies',
        featuredProjectsLead:
          'Select a project to explore its dedicated 11-chapter UI/UX Case Study.',
        viewInResumeLabel: 'Open Case Study →',
      },
      education: {
        sectionTitle: 'Education',
        sectionSubtitle: 'Academic background in Interaction Design and Software Engineering',
        entries: [
          {
            id: 'uq-master',
            institution: 'University of Queensland',
            institutionSecondary: '昆士兰大学',
            degree: "Interaction Design, Master's studies",
            period: '2026.07 – Present',
            details: [
              'Relevant learning: User Research, Interaction Design, Web Interface Design and Prototyping',
            ],
          },
          {
            id: 'dlnu-bachelor',
            institution: 'Dalian Minzu University',
            institutionSecondary: '大连民族大学',
            degree: "Software Engineering, Bachelor's degree",
            period: '2019.09 – 2023.06',
            details: [
              'Ranked 19th in the year group for third-year overall academic results',
              'University-level Three-Good Student recognition',
              'Class monitor',
            ],
          },
        ],
      },
      experience: {
        sectionTitle: 'Experience',
        sectionSubtitle: 'Selected UI/UX design projects and game industry work experience',
        projectsTabLabel: 'A · Project Experience (03)',
        workTabLabel: 'B · Work Experience (03)',
        projectsHeading: 'Project Experience',
        projectsLead:
          'Select a project below to open its full Case Study and explore the design process.',
        projects: [
          {
            id: 'bridgework-au',
            number: '01',
            brandName: 'BridgeWork AU',
            fullTitle: 'BridgeWork AU — Student Employment Support Platform',
            subtitle: 'Student Employment Support Platform',
            period: '2026.08 – Present',
            projectType: 'Five-person university course team project',
            responsibilitiesLabel: 'Main Responsibilities',
            responsibilities:
              'Page visual and interaction design, user research and competitor analysis.',
            contributions: [
              'Conducted two rounds totalling 11 user interviews as part of the team, identifying needs around job comparison, reusable application information and privacy.',
              'Analysed BOSS Zhipin as a competitor and considered business-model implications when defining prototype priorities.',
              'Translated information reuse and privacy requirements into editable profile information, field-level sharing and pre-submission preview concepts.',
              'Organised job discovery and comparison around keyword/location search, sidebar filters and two-column job cards.',
              'Prioritised job title, salary, working arrangements and application deadlines in the information hierarchy.',
              'Used warm-white surfaces and muted green accents, with consistent spacing, card styles and button states.',
            ],
            workspaceDestination: 'bridgework-au',
            workspaceCtaLabel: 'Open Case Study',
          },
          {
            id: 'zero-line',
            number: '02',
            brandName: 'ZERO//LINE',
            fullTitle:
              'ZERO//LINE — Official Game Concept Website UI/UX Design and Frontend Implementation',
            subtitle: 'Official Game Concept Website UI/UX Design & Frontend',
            period: '2026.09 – Present',
            projectType: 'Individual concept project',
            responsibilitiesLabel: 'Primary Responsibilities',
            responsibilities:
              'Website UI/UX design, information architecture, visual design and brand consistency, interactive webpage implementation, responsive design and iteration.',
            contributions: [
              'Designed and implemented the official concept website for an original 5v5 hero-based competitive FPS game across five core sections: HOME, NEWS, HEROES, STORE, and ABOUT.',
              'Established a distinctive game brand identity using deep charcoal surfaces (#202522), sage-green (#557E69), warm-gold (#C6AD7D) highlights, and bright ivory typography.',
              'Structured interactive hero profiles (NOVA, VESPER, RONIN) with character switching, lore background, and ability descriptions.',
              'Organised seasonal update communication (NEWS), three-tier store entry architecture (Buy Game, Game Credits, Item Store), and The 2037 Collapse worldbuilding narrative.',
              'Refined responsive layouts and interaction states across desktop and mobile viewports (with earlier FPS client Figma UI documented separately as related exploration).',
            ],
            externalUrl: 'https://utopia-scarlet.github.io/ZERO-LINE/',
            externalLinkLabel: 'Visit Live Website ↗',
            workspaceDestination: 'zero-line',
            workspaceCtaLabel: 'Open Case Study',
          },
          {
            id: 'lovestory',
            number: '03',
            brandName: 'LoveStory',
            fullTitle: 'LoveStory — Shared Memories & Life Journal Web Platform',
            subtitle: 'Shared Memories & Life Journal Web Platform',
            period: '2026.08 – Present',
            projectType: 'Individual project',
            responsibilitiesLabel: 'Responsibilities',
            responsibilities: 'UI/UX design and ongoing experience iteration.',
            contributions: [
              'Designed flows for joining shared spaces, creating memories, browsing albums and navigating timelines.',
              'Defined content entry points and permission cues to distinguish ordinary/shared records from private content.',
              'Applied serif headings and sans-serif interface text to distinguish editorial content from operational UI.',
              'Established light/dark visual hierarchy while preserving original photo colours.',
              'Adapted desktop timeline, gallery and editing interactions for smaller screens.',
              'Transformed desktop sidebar editing into grouped fullscreen mobile forms with bottom save actions.',
              'Distinguished loading, empty, failure and normal content states, with appropriate feedback and retry entry points.',
              'Iterated interface behaviour using actual feedback about invisible shared content and inconsistent timeline display.',
            ],
            externalUrl: 'https://love-story-archive-production.up.railway.app',
            externalLinkLabel: 'Visit Live Website ↗',
            workspaceDestination: 'lovestory',
            workspaceCtaLabel: 'Open Case Study',
          },
        ],
        workHeading: 'Work Experience',
        workLead:
          'Chronological industry experience in game operations, player feedback analysis, community activities, and casual game design.',
        workEntries: [
          {
            id: 'taihe',
            companyZh: '北京钛核互动',
            companyEn: 'Beijing Taihe Interactive',
            role: 'Game Operations',
            period: '2025.08 – 2025.09',
            highlights: [
              'Collected player feedback for 极无双 2 across mainland Chinese and overseas servers.',
              'Coordinated with development teams to support issue resolution.',
              'Participated in version activity releases, configuration acceptance checks and content reviews.',
            ],
          },
          {
            id: 'zichen',
            companyZh: '北京紫辰乐游',
            companyEn: 'Beijing Zichen Leyou (Descriptive translation)',
            role: 'Game Operations',
            period: '2024.12 – 2025.08',
            highlights: [
              'Supported community building and user participation flows for three IAA products.',
              'Combined channel acquisition and community activities, contributing to growth of 500+ community users.',
              'Collected player feedback and monitored community discussions.',
              'Planned player activities for 欢乐消消消.',
              'During the activity period, relevant topic post volume increased by 30%, and more than 10 quality UGC posts were accumulated.',
            ],
          },
          {
            id: 'tianxie',
            companyZh: '成都天蝎互娱',
            companyEn: 'Chengdu Scorpio Interactive (Descriptive translation)',
            role: 'Game Design / Operations',
            period: '2023.08 – 2024.01',
            highlights: [
              'Participated in the design of casual Douyin games, including spot-the-difference and interactive narrative experiences.',
              'Defined gameplay rules and interaction logic, prepared proposals and collaborated with developers on implementation.',
            ],
          },
        ],
      },
      skills: {
        sectionTitle: 'Skills',
        sectionSubtitle: 'Grouped capabilities across UI design, UX research & flows, and design implementation',
        categories: [
          {
            id: 'ui-design',
            title: 'UI Design',
            subtitle: 'Interface craft, visual hierarchy, and component systems',
            skills: [
              'Figma',
              'High-fidelity interface design',
              'Visual hierarchy',
              'Colour and typography systems',
              'Primary and secondary actions',
              'Components and Variants',
            ],
          },
          {
            id: 'ux-design',
            title: 'UX Design',
            subtitle: 'Research synthesis, structure, and interactive states',
            skills: [
              'User interviews',
              'Competitor analysis',
              'Requirements synthesis',
              'Information architecture',
              'User flows',
              'Interactive prototypes',
              'UI states and feedback',
            ],
          },
          {
            id: 'design-implementation',
            title: 'Design Implementation',
            subtitle: 'Responsive verification, walkthroughs, and frontend alignment',
            skills: [
              'Responsive layouts',
              'Prototype preview',
              'Interface walkthroughs',
              'Feedback-driven iteration',
              'Understanding frontend implementation',
              'Reviewing how design is rendered in working interfaces',
            ],
          },
        ],
      },
      additionalProjects: {
        sectionTitle: 'Additional Projects',
        sectionSubtitle: 'Earlier game prototyping and academic research projects during undergraduate studies',
        entries: [
          {
            id: '3d-shooter',
            title: '3D Shooter Game Prototype',
            period: '2023.04 – 2023.06',
            summary:
              'Created a prototype involving character movement, basic combat and environment interactions to demonstrate player controls and feedback in a 3D game.',
          },
          {
            id: 'ai-game-research',
            title: 'AI & Game Design Research',
            period: '2023.06 – 2023.07',
            summary:
              'Completed a 2D game prototype involving gameplay and level design. The research results were published at an international conference.',
          },
        ],
      },
      honoursAndLanguages: {
        sectionTitle: 'Honours & Languages',
        sectionSubtitle: 'Academic recognitions and English language qualifications',
        honoursTitle: 'Honours & Awards',
        honoursList: [
          {
            title: 'University-level Three-Good Student (2022)',
            detail: 'Dalian Minzu University academic & conduct recognition',
          },
          {
            title: 'Third Prize, Speexx English Speaking Competition',
            detail: 'Recognised for spoken English communication',
          },
        ],
        languagesTitle: 'Languages & Examinations',
        examBadges: ['CET-4', 'CET-6', 'IELTS 6.0'],
        languageCapabilityNote:
          'Able to read English materials and communicate in everyday English.',
      },
      contact: {
        sectionTitle: 'Contact',
        sectionSubtitle: 'Direct channels for UI/UX and Interaction Design internship inquiries',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        phoneHiddenNote: 'Available upon request',
        locationLabel: 'Job-Search Location',
        locationValue: 'Beijing',
        availabilityLabel: 'Availability',
        availabilityValue: 'To be discussed',
        liveProjectsLabel: 'Verified Project Links',
        emailCtaLabel: 'Send Email',
        pdfDownloadLabel: 'Download PDF Resume',
        pdfUnavailableNote:
          'PDF resume file is not bundled in this repository; please reach out via email for the latest PDF copy.',
      },
    },
    caseStudyChapters: [
      {
        number: '01',
        id: 'cs-01',
        title: 'Project Overview',
        scopeNote: 'Official game concept website positioning, 5-section scope, timeline, and core UI/UX responsibilities.',
        contentPlaceholder: 'Project overview and context narrative will be added here.',
        mediaPlaceholderLabel: 'Project overview visual placeholder.',
        mediaAspect: 'wide',
      },
      {
        number: '02',
        id: 'cs-02',
        title: 'Target Users',
        scopeNote: 'Three scenario-based website visitor segments inferred from official game portal product contexts.',
        contentPlaceholder: 'Target user context and scenario notes will be added here.',
        mediaPlaceholderLabel: 'Target user context diagram placeholder.',
        mediaAspect: 'compact',
      },
      {
        number: '03',
        id: 'cs-03',
        title: 'Research & Discovery',
        scopeNote: 'Official game website design requirements, evidence classification, and pending research notes.',
        contentPlaceholder: 'Research evidence will be added here.',
        mediaPlaceholderLabel: 'Research synthesis diagram placeholder.',
        mediaAspect: 'split',
      },
      {
        number: '04',
        id: 'cs-04',
        title: 'Problem Definition',
        scopeNote: 'Central website UX challenge and six supporting structural and visual problems.',
        contentPlaceholder: 'Problem framing and key design challenges will be added here.',
        mediaPlaceholderLabel: 'Problem framing visual placeholder.',
        mediaAspect: 'compact',
      },
      {
        number: '05',
        id: 'cs-05',
        title: 'Competitive Analysis',
        scopeNote: 'Reference candidates (Overwatch & VALORANT official sites), evaluation criteria, and research placeholder.',
        contentPlaceholder: 'Competitive analysis findings will be added here.',
        mediaPlaceholderLabel: 'Competitive comparison matrix placeholder.',
        mediaAspect: 'split',
      },
      {
        number: '06',
        id: 'cs-06',
        title: 'Design Goals',
        scopeNote: 'Four actionable website design goals across brand recognition, discoverability, CTAs, and responsiveness.',
        contentPlaceholder: 'Design goals and priority mapping will be added here.',
        mediaPlaceholderLabel: 'Design goals & priority framework placeholder.',
        mediaAspect: 'compact',
      },
      {
        number: '07',
        id: 'cs-07',
        title: 'Information Architecture',
        scopeNote: 'Five principal website sections: HOME, NEWS, HEROES (NOVA, VESPER, RONIN), STORE, and ABOUT.',
        contentPlaceholder: 'Information architecture documentation will be added here.',
        mediaPlaceholderLabel: 'Information architecture diagram placeholder.',
        mediaAspect: 'wide',
      },
      {
        number: '08',
        id: 'cs-08',
        title: 'User Flows & Interaction Design',
        scopeNote: 'Website browsing journeys (Flows A–D) distinguishing implemented frontend interactions from conceptual steps.',
        contentPlaceholder: 'User flow and interaction design notes will be added here.',
        mediaPlaceholderLabel: 'User flow diagram placeholder.',
        mediaAspect: 'wide',
      },
      {
        number: '09',
        id: 'cs-09',
        title: 'UI Design & Design System',
        scopeNote: 'Official website typography, colour palette, section modules, interaction states, and related client UI note.',
        contentPlaceholder: 'UI design system and component specifications will be added here.',
        mediaPlaceholderLabel: 'Website visual system & component specification placeholder.',
        mediaAspect: 'wide',
      },
      {
        number: '10',
        id: 'cs-10',
        title: 'Prototyping & Iteration',
        scopeNote: 'Documented website iterations across seasonal typography, card contrast, navigation, and responsive layouts.',
        contentPlaceholder: 'Prototype walkthrough and iteration notes will be added here.',
        mediaPlaceholderLabel: 'UI prototype preview.',
        mediaAspect: 'wide',
      },
      {
        number: '11',
        id: 'cs-11',
        title: 'Outcomes & Reflection',
        scopeNote: 'Delivered official concept website artefacts, design reflections, and future enhancement roadmap.',
        contentPlaceholder: 'Project outcomes and design reflections will be added here.',
        mediaPlaceholderLabel: 'Final interface showcase placeholder.',
        mediaAspect: 'split',
      },
    ],
    projects: {
      'bridgework-au': {
        id: 'bridgework-au',
        number: '01',
        title: 'BridgeWork AU',
        fullTitle: 'BridgeWork AU — Student Employment Support Platform',
        category: 'Student Employment Support Platform',
        period: '2026.08 – Present',
        projectType: 'Five-person university course team project',
        statusBadge: 'Case Study Structure · Student Employment UX',
        summary:
          'A student employment support platform designed within a five-person university course team, focusing on job discovery and comparison, reusable application profiles, field-level privacy controls, and pre-submission previews.',
        responsibilitiesLabel: 'My Main Responsibilities',
        responsibilities:
          'Page visual and interaction design, user research and competitor analysis.',
        heroPreviewLabel: 'BridgeWork AU — Hero Interface & Job Discovery Preview Slot',
        heroPreviewSubnote:
          'Warm-white surface palette with muted sage-green accents · Two-column job cards, sidebar filters & field-level sharing controls',
        accentTheme: 'bridgework',
        designFocus: [
          'Two-round team user interviews (11 participants) & BOSS Zhipin competitor analysis',
          'Editable profile reuse, field-level sharing & pre-submission preview concepts',
          'Keyword/location search, sidebar filters & two-column job comparison hierarchy',
        ],
        verifiedContributions: [
          'Conducted two rounds totalling 11 user interviews as part of the team, identifying needs around job comparison, reusable application information and privacy.',
          'Analysed BOSS Zhipin as a competitor and considered business-model implications when defining prototype priorities.',
          'Translated information reuse and privacy requirements into editable profile information, field-level sharing and pre-submission preview concepts.',
          'Organised job discovery and comparison around keyword/location search, sidebar filters and two-column job cards.',
          'Prioritised job title, salary, working arrangements and application deadlines in the information hierarchy.',
          'Used warm-white surfaces and muted green accents, with consistent spacing, card styles and button states.',
        ],
      },
      'zero-line': {
        id: 'zero-line',
        number: '02',
        title: 'ZERO//LINE',
        fullTitle:
          'ZERO//LINE — Official Game Concept Website UI/UX Design and Frontend Implementation',
        category:
          'Original 5v5 Hero-Based Competitive FPS · Official Game Concept Website',
        period: '2026.09 – Present',
        projectType: 'Individual concept project',
        statusBadge: 'Deployed Official Concept Website · Game Web UI/UX',
        summary:
          'ZERO//LINE is an official concept website design project built around an original fictional 5v5 hero-based competitive FPS game setting. Centred on five core content sections—brand establishment (HOME), seasonal news communication (NEWS), hero character showcase (HEROES: NOVA, VESPER, RONIN), store entry structure (STORE), and worldbuilding (ABOUT: The 2037 Collapse)—the project explores how to translate a game’s visual language into an official website experience with clear information hierarchy, interactive feedback, and responsive adaptation.',
        responsibilitiesLabel: 'Primary Responsibilities',
        responsibilities:
          'Website UI/UX design, information architecture, visual design and brand consistency, interactive webpage implementation, responsive design and iteration.',
        heroPreviewLabel:
          'ZERO//LINE — Official Game Concept Website (HOME · NEWS · HEROES · STORE · ABOUT)',
        heroPreviewSubnote:
          'Deep charcoal-green surfaces (#202522), sage green (#557E69) & warm gold (#C6AD7D) · 5 Website Sections & 3 Showcased Heroes (NOVA, VESPER, RONIN)',
        accentTheme: 'zeroline',
        externalUrl: 'https://utopia-scarlet.github.io/ZERO-LINE/',
        externalLinkLabel:
          'Visit Live Concept Website (utopia-scarlet.github.io/ZERO-LINE) ↗',
        designFocus: [
          'Five-section official website architecture (HOME, NEWS, HEROES, STORE, ABOUT)',
          'Interactive hero showcase (NOVA, VESPER, RONIN), seasonal cards & store entry structure',
          'Game brand identity (#202522 / #557E69 / #C6AD7D) & responsive frontend implementation',
        ],
        verifiedContributions: [
          'Designed and implemented the deployed five-section official concept website (HOME, NEWS, HEROES, STORE, ABOUT) at utopia-scarlet.github.io/ZERO-LINE.',
          'Established a cohesive game brand identity using deep charcoal (#202522), sage green (#557E69), warm gold (#C6AD7D), and editorial display typography.',
          'Built interactive hero profiles for NOVA, VESPER, and RONIN with character switching, lore background, and ability descriptions.',
          'Structured seasonal news cards (Season Update, Competitive/Ranked Changes, New Content, Limited-Time Events) and store entries (Buy Game, Game Credits, Item Store).',
          'Crafted The 2037 Collapse worldbuilding narrative in ABOUT and verified responsive layout behaviour across desktop and mobile.',
        ],
      },
      lovestory: {
        id: 'lovestory',
        number: '03',
        title: 'LoveStory',
        fullTitle: 'LoveStory — Shared Memories & Life Journal Web Platform',
        category: 'Shared Memories & Life Journal Web Platform',
        period: '2026.08 – Present',
        projectType: 'Individual project',
        statusBadge: 'Live Web Platform · Ongoing Experience Iteration',
        summary:
          'An individual web platform designed for joining shared spaces, creating memories, browsing albums, and navigating timelines, featuring clear permission cues, editorial serif/sans typography, photo-preserving light/dark hierarchy, and mobile fullscreen form flows.',
        responsibilitiesLabel: 'Responsibilities',
        responsibilities: 'UI/UX design and ongoing experience iteration.',
        heroPreviewLabel: 'LoveStory — Shared Space, Timeline & Mobile Form Preview Slot',
        heroPreviewSubnote:
          'Editorial serif headings with sans-serif operational UI · Photo-true light/dark hierarchy & fullscreen mobile editing forms',
        accentTheme: 'lovestory',
        externalUrl: 'https://love-story-archive-production.up.railway.app',
        externalLinkLabel: 'Visit Live Website (love-story-archive-production.up.railway.app) ↗',
        designFocus: [
          'Shared space onboarding, memory creation, album browsing & timeline flows',
          'Permission cues distinguishing shared records from private content',
          'Desktop-to-mobile responsive adaptation & state feedback iteration',
        ],
        verifiedContributions: [
          'Designed flows for joining shared spaces, creating memories, browsing albums and navigating timelines.',
          'Defined content entry points and permission cues to distinguish ordinary/shared records from private content.',
          'Applied serif headings and sans-serif interface text to distinguish editorial content from operational UI.',
          'Established light/dark visual hierarchy while preserving original photo colours.',
          'Adapted desktop timeline, gallery and editing interactions for smaller screens.',
          'Transformed desktop sidebar editing into grouped fullscreen mobile forms with bottom save actions.',
          'Distinguished loading, empty, failure and normal content states, with appropriate feedback and retry entry points.',
          'Iterated interface behaviour using actual feedback about invisible shared content and inconsistent timeline display.',
        ],
      },
    },
    zeroLineExperience: {
      hero: {
        protocolBadge: '02 // SELECTED PROJECT',
        genreTag: '5V5 HERO-BASED COMPETITIVE FPS',
        titlePrefix: 'ZERO',
        titleSuffix: 'LINE',
        deliverableHeading:
          'Official Game Concept Website',
        subtitle:
          'Designed around an original 5v5 hero-based competitive FPS game setting, creating an official website experience that balances brand expression, hero exploration, and news discovery.',
        positioningStatement:
          'Individual concept project · UI/UX Design & Frontend Implementation · 2026.09 – Present',
        exploreActCta: 'Explore Case Study',
        liveSiteCta: 'Visit Official Concept Website ↗',
        characterSlotBadge: 'HERO KEY ART · NOVA',
        characterSlotTitle: 'NOVA',
        characterSlotSpec:
          'Character Key Art',
        transitionCharacterLabel:
          'ZERO//LINE Character Cutout Slot (/public/zeroline/zeroline-character-slash.webp)',
        transitionCharacterSubnote:
          'Stage B static character layer ready for 1600 × 1800 px transparent WebP/PNG cutout.',
        transitionTagline:
          'Official Game Concept Website',
        telemetry: [
          { label: 'Type', value: 'Individual Concept Project' },
          { label: 'Role', value: 'UI/UX Design & Frontend' },
          { label: 'Period', value: '2026.09 – Present' },
        ],
        paletteTokens: [
          { name: 'Charcoal Core', hex: '#202522', role: '--black' },
          { name: 'Tactical Surface', hex: '#2B312E', role: '--black-soft' },
          { name: 'Card Elevation', hex: '#353C38', role: '--black-card' },
          { name: 'Brand Sage', hex: '#557E69', role: '--brand-green' },
          { name: 'Warm Gold', hex: '#C6AD7D', role: '--gold' },
          { name: 'Warm Ivory', hex: '#F1EEE5', role: '--white' },
        ],
      },
      sidebar: {
        worldModeBadge: 'ZERO//LINE WEBSITE CASE STUDY',
        actNavigationLabel: 'NARRATIVE ACTS & CHAPTERS (01–11)',
        progressLabel: 'CASE STUDY PROGRESSION',
      },
      acts: [
        {
          actNumber: 'ACT 01',
          actCode: 'THE WORLD',
          actTitle: 'ACT 01 — THE WORLD',
          actSubtitle:
            'Official game concept website positioning, five-section scope, primary responsibilities, and scope boundaries.',
          layoutVariant: 'world-dossier',
          chapterIds: ['cs-01'],
        },
        {
          actNumber: 'ACT 02',
          actCode: 'THE PLAYERS',
          actTitle: 'ACT 02 — THE PLAYERS',
          actSubtitle:
            'Scenario-based website visitor segments, official game portal requirements, and the central website UX challenge.',
          layoutVariant: 'player-intel',
          chapterIds: ['cs-02', 'cs-03', 'cs-04'],
        },
        {
          actNumber: 'ACT 03',
          actCode: 'THE STRATEGY',
          actTitle: 'ACT 03 — THE STRATEGY',
          actSubtitle:
            'Comparable hero-shooter website reference candidates (Overwatch, VALORANT) and four website design goals.',
          layoutVariant: 'strategic-matrix',
          chapterIds: ['cs-05', 'cs-06'],
        },
        {
          actNumber: 'ACT 04',
          actCode: 'THE SYSTEM',
          actTitle: 'ACT 04 — THE SYSTEM',
          actSubtitle:
            'Five-section website information architecture (HOME, NEWS, HEROES, STORE, ABOUT) and website browsing flows.',
          layoutVariant: 'system-blueprint',
          chapterIds: ['cs-07', 'cs-08'],
        },
        {
          actNumber: 'ACT 05',
          actCode: 'THE INTERFACE',
          actTitle: 'ACT 05 — THE INTERFACE',
          actSubtitle:
            'Website typography, hero showcase (NOVA, VESPER, RONIN), seasonal cards, store architecture, and separate related client UI note.',
          layoutVariant: 'interface-showcase',
          chapterIds: ['cs-09'],
        },
        {
          actNumber: 'ACT 06',
          actCode: 'THE EVOLUTION',
          actTitle: 'ACT 06 — THE EVOLUTION',
          actSubtitle:
            'Real visual and layout iterations from project history, verified deployed outputs, and future enhancement roadmap.',
          layoutVariant: 'evolution-log',
          chapterIds: ['cs-10', 'cs-11'],
        },
      ],
      overviewPositioningQuote:
        'ZERO//LINE is an original fictional 5v5 hero-based competitive FPS concept. This project designs and implements its official concept website—translating the game’s world, character roster, and seasonal structure into a clear, interactive web experience.',
      primaryResponsibilitiesHeading: 'My Role & Responsibilities',
      primaryResponsibilities: [
        'Website UI/UX design and information architecture',
        'Brand visual direction and typography system',
        'Interactive frontend implementation (utopia-scarlet.github.io/ZERO-LINE)',
        'Desktop and mobile responsive adaptation',
      ],
      scopeBoundaryHeading:
        'Deliverable & Scope',
      scopeBoundaryItems: [
        'Primary Deliverable: Deployed official concept website covering HOME, NEWS, HEROES, STORE, and ABOUT, with interactive hero profiles for NOVA, VESPER, and RONIN.',
        'Concept Boundary: Focuses on the official web portal experience; does not include a playable game client executable, matchmaking server, or live payment backend.',
        'Related Exploration: Earlier FPS game-client UI practice in Figma is documented separately in Chapter 09 as supporting background work.',
      ],
      userSegmentsNotice:
        'Note: These three visitor groups are scenario-based design assumptions defined for an official game portal rather than empirical personas from formal interviews.',
      userSegments: [
        {
          id: 'prospective-players',
          code: '01 · FIRST-TIME VISITORS',
          title: 'Prospective Players',
          profile: 'Visitors discovering the ZERO//LINE concept for the first time.',
          primaryGoalLabel: 'Primary Goal',
          primaryGoal:
            'Quickly grasp the 5v5 hero-FPS genre, world tone, and core roster appeal.',
          typicalTaskLabel: 'Typical Website Task',
          typicalTask:
            'Scan the first-screen hero, preview operative identities, and read the core setting.',
          designConsiderationLabel: 'Design Consideration',
          designConsideration:
            'Pair immediate genre positioning on HOME with direct paths into HEROES and ABOUT.',
          areasLabel: 'Key Sections',
          areas: ['HOME', 'HEROES', 'ABOUT'],
        },
        {
          id: 'engaged-returning',
          code: '02 · RETURNING VISITORS',
          title: 'Engaged / Returning Players',
          profile:
            'Players familiar with the concept who want seasonal updates or operative details.',
          primaryGoalLabel: 'Primary Goal',
          primaryGoal:
            'Check seasonal changes and compare operative abilities without friction.',
          typicalTaskLabel: 'Typical Website Task',
          typicalTask:
            'Browse seasonal update cards in NEWS and switch between NOVA, VESPER, and RONIN.',
          designConsiderationLabel: 'Design Consideration',
          designConsideration:
            'Use in-place hero switching and high-contrast seasonal cards for fast scanning.',
          areasLabel: 'Key Sections',
          areas: ['NEWS', 'HEROES'],
        },
        {
          id: 'purchase-intent',
          code: '03 · STORE VISITORS',
          title: 'Purchase-Intent Visitors',
          profile:
            'Visitors evaluating game access editions, credits, or cosmetic store entries.',
          primaryGoalLabel: 'Primary Goal',
          primaryGoal:
            'Understand how game access, currency, and item entries are separated.',
          typicalTaskLabel: 'Typical Website Task',
          typicalTask:
            'Compare Buy Game, Game Credits, and Item Store options and locate primary CTAs.',
          designConsiderationLabel: 'Design Consideration',
          designConsideration:
            'Visually separate edition access, currency packs, and cosmetic items in STORE.',
          areasLabel: 'Key Sections',
          areas: ['STORE', 'Primary CTA'],
        },
      ],
      requirementsHeading: 'Core Website Design Requirements',
      requirementsItems: [
        {
          code: '01',
          title: 'Game Identity Communication',
          reasoning:
            'Establish the 5v5 hero-FPS genre and tactical tone on the first screen through key art and display typography.',
        },
        {
          code: '02',
          title: 'Hero Information Discoverability',
          reasoning:
            'Let visitors switch between NOVA, VESPER, and RONIN in place to inspect lore and abilities without page reloads.',
        },
        {
          code: '03',
          title: 'Seasonal Content Organisation',
          reasoning:
            'Group updates into scannable cards (Season Update, Ranked Changes, New Content, Limited-Time Events).',
        },
        {
          code: '04',
          title: 'Navigation & CTA Hierarchy',
          reasoning:
            'Keep top-level navigation persistent while separating the primary START GAME CTA from secondary browsing.',
        },
        {
          code: '05',
          title: 'Store Entry Clarity',
          reasoning:
            'Distinguish Buy Game, Game Credits, and Item Store so visitors immediately understand each entry point.',
        },
        {
          code: '06',
          title: 'Responsive Presentation',
          reasoning:
            'Maintain readable typography, card hierarchy, and interactive controls across desktop and mobile viewports.',
        },
      ],
      evidenceClassificationHeading:
        'Design Basis & Limitations',
      evidenceClassificationItems: [
        {
          category: 'Exploratory Design Analysis',
          status: 'Scenario & Reference',
          detail:
            'Requirements were defined by analysing hero-shooter portal scenarios and editorial game web typography.',
        },
        {
          category: 'Implementation Walkthroughs',
          status: 'Browser Verified',
          detail:
            'Navigation states, hero switching, card contrast, and responsive layouts were verified directly in the live frontend.',
        },
        {
          category: 'Empirical User Research',
          status: 'Not Yet Conducted',
          detail:
            'No formal participant interviews, surveys, or quantitative usability tests were conducted during this concept phase.',
        },
      ],
      futureValidationHeading: 'Future User Validation Plan',
      futureValidationNote:
        'Next step: conduct moderated walkthroughs with 5–8 FPS players to test first-screen genre comprehension, hero ability scanning, and store category clarity.',
      centralProblemLabel: 'CENTRAL UX QUESTION',
      centralProblemStatement:
        'How can an official concept website for an original hero-based FPS communicate its identity, organise varied game information and guide visitors to the right content without sacrificing visual impact or usability?',
      supportingChallengesLabel: 'KEY DESIGN CHALLENGES',
      supportingChallenges: [
        '01. Visual Impact vs. Readability — Pairing expressive character art and display titles with legible body copy.',
        '02. Multi-Section Coherence — Unifying five distinct content types under one predictable navigation structure.',
        '03. Interactive Character Inspection — Presenting hero lore and abilities without overwhelming the layout.',
        '04. Store & Action Clarity — Differentiating primary game CTAs from edition, credit, and item store entries.',
      ],
      competitorNotice:
        'Reference Note: Overwatch and VALORANT official websites are identified as genre reference candidates. Because a formal comparative audit was not completed, the evaluation criteria below serve as a structured reference placeholder.',
      competitorCandidates: [
        {
          name: 'VALORANT Official Website',
          positioning: '5v5 tactical hero shooter portal',
          relevance:
            'Reference candidate for bold editorial typography, agent roster switching, and seasonal update framing.',
        },
        {
          name: 'Overwatch Official Website',
          positioning: 'Team-based hero shooter portal',
          relevance:
            'Reference candidate for readable ability breakdowns, event card hierarchy, and edition/store CTAs.',
        },
      ],
      competitorCriteriaLabel: 'REFERENCE EVALUATION DIMENSIONS (PLACEHOLDER)',
      competitorCriteria: [
        'First-screen identity',
        'Navigation hierarchy',
        'Hero ability interaction',
        'Seasonal news layout',
        'Store CTA clarity',
        'Responsive adaptation',
      ],
      designGoals: [
        {
          code: 'GOAL 01',
          title: 'Brand Recognition',
          description:
            'Establish an immediate tactical identity on HOME through hero key art, display typography, and the charcoal, sage-green, and warm-gold palette.',
        },
        {
          code: 'GOAL 02',
          title: 'Content Discoverability',
          description:
            'Connect HOME, NEWS, HEROES, STORE, and ABOUT through a persistent top navigation bar and scannable section headers.',
        },
        {
          code: 'GOAL 03',
          title: 'Clear Primary Actions',
          description:
            'Separate the primary START GAME CTA and store tier actions (Buy Game, Game Credits, Item Store) from standard browsing links.',
        },
        {
          code: 'GOAL 04',
          title: 'Cross-Device Consistency',
          description:
            'Preserve visual atmosphere, card hierarchy, and interactive switching across desktop and mobile viewports.',
        },
      ],
      websiteIaHeading:
        'Five-Section Website Architecture',
      websiteIaLead:
        'Each top-level section serves a distinct visitor intent on the official concept website:',
      websiteIaSections: [
        {
          code: '01 · HOME',
          name: 'HOME',
          role: 'Establish game identity and direct exploration',
          elements: [
            'Hero key visual & genre positioning',
            'Primary START GAME CTA',
            'Global 5-section navigation',
          ],
          statusNote: 'Implemented on live site',
        },
        {
          code: '02 · NEWS',
          name: 'NEWS',
          role: 'Organise seasonal information and updates',
          elements: [
            'Season Update & Ranked Changes',
            'New Content & Limited-Time Events',
          ],
          statusNote: 'Card grid implemented',
        },
        {
          code: '03 · HEROES',
          name: 'HEROES',
          role: 'Support character discovery and ability exploration',
          elements: [
            'Showcased heroes: NOVA, VESPER, RONIN',
            'In-place character & ability switching',
          ],
          statusNote: 'Interactive switching live',
        },
        {
          code: '04 · STORE',
          name: 'STORE',
          role: 'Distinguish game editions, credits and item entries',
          elements: [
            'Buy Game · Game Credits · Item Store',
            'Category selection feedback',
          ],
          statusNote: 'Entry UI implemented',
        },
        {
          code: '05 · ABOUT',
          name: 'ABOUT',
          role: 'Communicate the game’s world and background',
          elements: [
            'The 2037 Collapse setting',
            'Frontier conflict & closing CTA',
          ],
          statusNote: 'Implemented on live site',
        },
      ],
      websiteFlowsHeading:
        'Core Website Browsing Flows',
      websiteFlowsLead:
        'Four browsing tasks structure visitor movement across the website, separating live frontend interactions from conceptual downstream actions:',
      websiteFlows: [
        {
          id: 'flow-a',
          code: 'FLOW 01 · HERO DISCOVERY',
          title: 'Discovering and Switching Heroes',
          path: [
            'HOME',
            'HEROES',
            'Switch NOVA / VESPER / RONIN',
            'Inspect Lore & Abilities',
          ],
          implementedStatus: 'Implemented in Frontend',
          boundaryNote:
            'In-place character switching updates artwork, identity, and ability descriptions dynamically.',
        },
        {
          id: 'flow-b',
          code: 'FLOW 02 · SEASONAL UPDATES',
          title: 'Exploring Seasonal Information',
          path: [
            'HOME',
            'NEWS',
            'Scan Seasonal Cards',
            'Select Update Entry',
          ],
          implementedStatus: 'Cards Implemented · Article Route Conceptual',
          boundaryNote:
            'Seasonal category cards and interactive states are live; standalone full-article pages remain conceptual.',
        },
        {
          id: 'flow-c',
          code: 'FLOW 03 · STORE NAVIGATION',
          title: 'Navigating Store Categories',
          path: [
            'HOME',
            'STORE',
            'Select Buy Game / Game Credits / Item Store',
          ],
          implementedStatus:
            'Entry UI Implemented · Checkout Conceptual',
          boundaryNote:
            'Visually separates the three store tiers with selection feedback; no live payment checkout exists.',
        },
        {
          id: 'flow-d',
          code: 'FLOW 04 · WORLDBUILDING',
          title: 'Reading Worldbuilding Content',
          path: [
            'HOME',
            'ABOUT',
            'Read The 2037 Collapse',
            'Return via Closing CTA',
          ],
          implementedStatus: 'Implemented in Frontend',
          boundaryNote:
            'Closing CTA loops visitors back to active exploration after reading the lore.',
        },
      ],
      interfaceShowcase: {
        eyebrow: 'OFFICIAL CONCEPT WEBSITE SHOWCASE',
        heading:
          'Five-Section Website UI Showcase',
        description:
          'Select a section to inspect its design objective, key UI/UX decisions, and website screenshot.',
        objectiveLabel: 'Design Objective',
        decisionsLabel: 'Key UI/UX Decisions',
        enlargeLabel: 'Enlarge Screenshot',
        closePreviewLabel: 'Close enlarged screenshot',
        openLiveSectionLabel: 'Open Live Website ↗',
        tabs: [
          {
            id: 'home',
            code: '01',
            sectionName: 'HOME',
            label: 'HOME',
            objective:
              'Establish the 5v5 hero-FPS brand identity on the first screen and direct visitors toward primary actions.',
            decisions: [
              'Pairs full-bleed character key art with high-contrast ZERO//LINE display typography to communicate genre and tone immediately.',
              'Separates the warm-gold START GAME primary CTA from the five-section top navigation bar.',
              'Uses dark charcoal-green framing (#202522) so hero imagery and ivory headlines remain legible without visual clutter.',
            ],
            screenshotAlt:
              'ZERO//LINE official concept website HOME section showing first-screen branding, hero key art, and START GAME CTA.',
            missingScreenshotTitle:
              'HOME Section Screenshot Slot',
            missingScreenshotNote:
              'Awaiting authentic desktop screenshot of the HOME section (first-screen branding, hero imagery, and primary CTA).',
          },
          {
            id: 'news',
            code: '02',
            sectionName: 'NEWS',
            label: 'NEWS',
            objective:
              'Organise seasonal updates and event announcements into a scannable, high-contrast card grid.',
            decisions: [
              'Groups updates into four clear categories: Season Update, Ranked Changes, New Content, and Limited-Time Events.',
              'Refines Season Update display typography and steps card surface brightness (#2B312E to #353C38) to separate cards from the dark background.',
              'Applies warm-gold (#C6AD7D) hover and focus borders to guide returning players across update entries.',
            ],
            screenshotAlt:
              'ZERO//LINE official concept website NEWS section showing Season Update typography and four seasonal update cards.',
            missingScreenshotTitle:
              'NEWS Section Screenshot Slot',
            missingScreenshotNote:
              'Awaiting authentic desktop screenshot of the NEWS section (Season Update heading and seasonal card grid).',
          },
          {
            id: 'heroes',
            code: '03',
            sectionName: 'HEROES',
            label: 'HEROES',
            objective:
              'Enable in-place character discovery and ability inspection across the showcased operatives.',
            decisions: [
              'Supports interactive switching between NOVA, VESPER, and RONIN without leaving the current viewport.',
              'Separates large operative artwork from the structured character identity, lore background, and ability breakdown panel.',
              'Highlights the active operative and selected ability states using sage-green (#557E69) and warm-gold (#C6AD7D) accents.',
            ],
            screenshotAlt:
              'ZERO//LINE official concept website HEROES section showing NOVA, VESPER, and RONIN character and ability switching.',
            missingScreenshotTitle:
              'HEROES Section Screenshot Slot',
            missingScreenshotNote:
              'Awaiting authentic desktop screenshot of the HEROES section (NOVA, VESPER, and RONIN character showcase).',
          },
          {
            id: 'store',
            code: '04',
            sectionName: 'STORE',
            label: 'STORE',
            objective:
              'Distinguish game access editions, currency packs, and cosmetic store entries with clear action hierarchy.',
            decisions: [
              'Structures the store into three distinct entry modules: Buy Game, Game Credits, and Item Store.',
              'Uses clear card headers, tier labels, and primary/secondary button hierarchy so visitors immediately understand each entry point.',
              'Provides interactive selection feedback across store categories while keeping conceptual checkout boundaries transparent.',
            ],
            screenshotAlt:
              'ZERO//LINE official concept website STORE section showing Buy Game, Game Credits, and Item Store tiers.',
            missingScreenshotTitle:
              'STORE Section Screenshot Slot',
            missingScreenshotNote:
              'Awaiting authentic desktop screenshot of the STORE section (Buy Game, Game Credits, and Item Store modules).',
          },
          {
            id: 'about',
            code: '05',
            sectionName: 'ABOUT',
            label: 'ABOUT',
            objective:
              'Communicate the game’s worldbuilding narrative with readable editorial pacing and a closing exploration loop.',
            decisions: [
              'Frames The 2037 Collapse and frontier conflict using constrained line lengths and high-contrast warm-ivory typography.',
              'Balances narrative blocks with atmospheric dark surfaces so worldbuilding copy remains comfortable to read.',
              'Places a closing exploration CTA at the end of the narrative to guide visitors back to HEROES or STORE.',
            ],
            screenshotAlt:
              'ZERO//LINE official concept website ABOUT section showing The 2037 Collapse worldbuilding narrative and closing CTA.',
            missingScreenshotTitle:
              'ABOUT Section Screenshot Slot',
            missingScreenshotNote:
              'Awaiting authentic desktop screenshot of the ABOUT section (The 2037 Collapse worldbuilding narrative).',
          },
        ],
      },
      relatedClientExploration: {
        badge: 'RELATED BACKGROUND WORK',
        title: 'Earlier FPS Game Client UI Practice in Figma',
        description:
          'Before designing the official concept website, I practiced in-game FPS client UI in Figma. It is kept separate from the website deliverable:',
        points: [
          'Designed a game client lobby layout centred on a primary PLAY button and secondary utility nav.',
          'Practiced Figma Components and Variants across a 9-hero grid and 4 role-filter states.',
        ],
      },
      iterationHeaders: {
        issue: 'Previous Issue',
        change: 'Design Change',
        result: 'Result Visible in the Interface',
      },
      iterationItems: [
        {
          id: 'iter-01',
          code: '01',
          title: 'Season Update Typography Refinement',
          issue:
            'Early NEWS headings lacked scale contrast against card body copy, slowing down scanning.',
          change:
            'Increased display title weight and tightened metadata spacing inside Season Update headers.',
          result:
            'Seasonal headlines anchor the NEWS section immediately while keeping update summaries easy to read.',
        },
        {
          id: 'iter-02',
          code: '02',
          title: 'Seasonal Card Visual Differentiation',
          issue:
            'Uniform dark card backgrounds made the four NEWS categories blend into the #202522 page canvas.',
          change:
            'Stepped surface brightness (#2B312E to #353C38) and added warm-gold (#C6AD7D) active/hover borders.',
          result:
            'Season Update, Ranked Changes, New Content, and Limited-Time Events are visually distinct at a glance.',
        },
        {
          id: 'iter-03',
          code: '03',
          title: 'Character Presentation Adjustments',
          issue:
            'Large hero illustrations competed with ability descriptions in the HEROES section.',
          change:
            'Separated character key art framing from a structured right-hand identity and ability panel for NOVA, VESPER, and RONIN.',
          result:
            'Visitors can appreciate full-height operative art while reading lore and skills without overlap.',
        },
        {
          id: 'iter-04',
          code: '04',
          title: 'Navigation & CTA Hierarchy Improvements',
          issue:
            'Top-level section links and primary action buttons initially carried similar visual weight.',
          change:
            'Styled START GAME and primary store actions with warm-gold accents while keeping section nav restrained.',
          result:
            'Visitors can immediately distinguish content navigation from primary actions.',
        },
        {
          id: 'iter-05',
          code: '05',
          title: 'Desktop & Mobile Layout Refinement',
          issue:
            'Multi-column hero, news, and store grids felt compressed on narrow viewports.',
          change:
            'Refined responsive breakpoints, stacked card grids cleanly, and adjusted padding for touch targets.',
          result:
            'All five sections maintain brand atmosphere and legibility across desktop and mobile screens.',
        },
      ],
      outcomesComparison: {
        completedHeading: 'Completed Outputs',
        completedItems: [
          'Deployed interactive official concept website (utopia-scarlet.github.io/ZERO-LINE).',
          'Five structured sections: HOME, NEWS, HEROES, STORE, and ABOUT.',
          'Interactive hero showcase for NOVA, VESPER, and RONIN with lore and ability switching.',
          'Four-pillar seasonal news grid and three-tier store entry architecture (Buy Game, Game Credits, Item Store).',
          'Cohesive charcoal, sage-green, and warm-gold visual system with responsive desktop and mobile layouts.',
        ],
        futureHeading: 'Future Improvements',
        futureItems: [
          'Build dedicated article detail views for seasonal update cards in NEWS.',
          'Strengthen contextual CTAs connecting ABOUT lore and NEWS updates to HEROES and STORE.',
          'Conduct moderated usability testing with FPS players to validate navigation and store comprehension.',
          'Expand the HEROES roster with additional operatives and ability preview media.',
        ],
      },
      chapterDetails: {
        'cs-01': {
          chapterId: 'cs-01',
          tacticalTag: '01 · OVERVIEW',
          lead: 'ZERO//LINE is an original 5v5 hero-based competitive FPS concept. I designed and built its official concept website to establish the game’s brand identity and organise player-facing content.',
          keyPoints: [],
          visualSlotTitle:
            'Official Concept Website Overview',
          visualSlotSpec:
            'Composite overview of the deployed website across HOME, NEWS, HEROES, STORE, and ABOUT.',
        },
        'cs-02': {
          chapterId: 'cs-02',
          tacticalTag: '02 · TARGET USERS',
          lead: 'Unlike an in-game lobby built for queuing matches, an official game website serves visitors evaluating the game, checking updates, or exploring store options.',
          keyPoints: [],
          visualSlotTitle:
            'Visitor Segment to Website Section Mapping',
          visualSlotSpec:
            'Diagram connecting the three visitor scenarios to their primary website sections.',
        },
        'cs-03': {
          chapterId: 'cs-03',
          tacticalTag: '03 · DISCOVERY',
          lead: 'Discovery focused on what an official hero-shooter portal must communicate at each stage of a visitor’s browsing session.',
          keyPoints: [],
          visualSlotTitle:
            'Website Requirements & Priority Structure',
          visualSlotSpec:
            'Summary diagram of the six core communication and usability requirements.',
        },
        'cs-04': {
          chapterId: 'cs-04',
          tacticalTag: '04 · PROBLEM DEFINITION',
          lead: 'Game websites often struggle to balance atmospheric worldbuilding with fast, scannable information access.',
          keyPoints: [],
          visualSlotTitle:
            'Visual Impact vs. Usability Balance',
          visualSlotSpec:
            'Diagram illustrating how atmospheric art direction is balanced with clear UI hierarchy.',
        },
        'cs-05': {
          chapterId: 'cs-05',
          tacticalTag: '05 · COMPETITIVE ANALYSIS',
          lead: 'Official portals for hero-based shooters like VALORANT and Overwatch provide relevant benchmarks for roster presentation, seasonal news, and store CTAs.',
          keyPoints: [],
          visualSlotTitle:
            'Comparable Hero-FPS Website Reference Matrix (Placeholder)',
          visualSlotSpec:
            'Placeholder for side-by-side comparative screenshots and analysis notes.',
        },
        'cs-06': {
          chapterId: 'cs-06',
          tacticalTag: '06 · DESIGN GOALS',
          lead: 'Four design objectives guided layout, typography, and interaction decisions across the website:',
          keyPoints: [],
          visualSlotTitle:
            'Design Goals to Interface Mapping',
          visualSlotSpec:
            'Diagram linking the four design goals to specific website modules.',
        },
        'cs-07': {
          chapterId: 'cs-07',
          tacticalTag: '07 · INFORMATION ARCHITECTURE',
          lead: 'The website is structured around five top-level sections so visitors can move predictably between brand introduction, updates, roster details, store options, and lore.',
          keyPoints: [],
          visualSlotTitle:
            'Five-Section Information Architecture Diagram',
          visualSlotSpec:
            'Structural map of HOME, NEWS, HEROES, STORE, and ABOUT.',
        },
        'cs-08': {
          chapterId: 'cs-08',
          tacticalTag: '08 · USER FLOWS',
          lead: 'Four core browsing flows guide visitors through character inspection, seasonal updates, store tiers, and worldbuilding.',
          keyPoints: [],
          visualSlotTitle:
            'Website Browsing Flows (Implemented vs. Conceptual)',
          visualSlotSpec:
            'Flow diagram showing live frontend interactions and conceptual downstream steps.',
        },
        'cs-09': {
          chapterId: 'cs-09',
          tacticalTag: '09 · UI & DESIGN SYSTEM',
          lead: 'The visual system combines deep charcoal surfaces (#202522), sage-green accents (#557E69), and warm-gold highlights (#C6AD7D) to frame character art while keeping UI text crisp.',
          keyPoints: [],
          visualSlotTitle:
            'Official Website UI System & Section Captures',
          visualSlotSpec:
            'High-resolution captures of typography, colour tokens, hero cards, and store components.',
        },
        'cs-10': {
          chapterId: 'cs-10',
          tacticalTag: '10 · ITERATION',
          lead: 'During frontend implementation and browser walkthroughs, five targeted iterations improved typography, card contrast, character framing, and responsive behaviour:',
          keyPoints: [],
          visualSlotTitle:
            'Before / After Iteration Comparisons',
          visualSlotSpec:
            'Visual comparison of seasonal card contrast, typography hierarchy, and mobile adaptation.',
        },
        'cs-11': {
          chapterId: 'cs-11',
          tacticalTag: '11 · OUTCOMES & REFLECTION',
          lead: 'The completed project delivers a live, responsive official concept website while identifying clear next steps for content depth and user testing.',
          keyPoints: [],
          visualSlotTitle:
            'Deployed Official Concept Website Showcase',
          visualSlotSpec:
            'Desktop and mobile views of utopia-scarlet.github.io/ZERO-LINE.',
        },
      },
    },
    loveStoryExperience: {
      navigation: {
        storyThreadAria: 'LoveStory six-scene story navigation',
        progressLabel: 'Story Thread',
        mobileSceneSelectLabel: 'Story Scene',
        openingBoundaryNote:
          'Continuous gold story thread · LS-02 handwritten wordmark extension anchor',
      },
      scenes: [
        {
          id: 'ls-scene-01',
          number: '01',
          shortLabel: 'The Story',
          title: 'The Story',
          kicker: 'Scene 01 · Dark Archive',
          surfaceTheme: 'dark-archive',
          summary:
            'Project origin, shared two-person archive positioning, and live scope boundaries.',
        },
        {
          id: 'ls-scene-02',
          number: '02',
          shortLabel: 'Needs',
          title: 'Understanding the Needs',
          kicker: 'Scene 02 · Paper & Ink',
          surfaceTheme: 'paper-ink',
          summary:
            'Core user needs connected to design requirements, interface decisions, and visual evidence.',
        },
        {
          id: 'ls-scene-03',
          number: '03',
          shortLabel: 'Connections',
          title: 'Connecting the Experience',
          kicker: 'Scene 03 · Paper & Ink',
          surfaceTheme: 'paper-ink',
          summary:
            'Organic memory constellation across Moments, Timeline, Memory Map, Private Archive, and Future Plans.',
        },
        {
          id: 'ls-scene-04',
          number: '04',
          shortLabel: 'Memories',
          title: 'Experience the Memories',
          kicker: 'Scene 04 · Dark Archive',
          surfaceTheme: 'dark-archive',
          summary:
            'Immersive Dark Archive exhibition stage for gallery, timeline, map, and private archive workflows.',
        },
        {
          id: 'ls-scene-05',
          number: '05',
          shortLabel: 'System',
          title: 'Visual & Interaction System',
          kicker: 'Scene 05 · Paper & Ink + Dark Archive',
          surfaceTheme: 'paper-ink',
          summary:
            'Dual-surface atmosphere, serif × sans typography, mobile fullscreen form adaptation, and state feedback.',
        },
        {
          id: 'ls-scene-06',
          number: '06',
          shortLabel: 'Built & Beyond',
          title: 'Built & Beyond',
          kicker: 'Scene 06 · Dark Archive',
          surfaceTheme: 'dark-archive',
          summary:
            'Frontend + FastAPI / SQLite implementation milestones, real-feedback iterations, and next directions.',
        },
      ],
      scene01Story: {
        eyebrow: '03 · Interactive Memory Archive Case Study',
        title: 'LoveStory',
        positioningLead:
          'A personal, interactive digital memory archive for two people — preserving shared moments across time and place, planning future experiences, and safeguarding private records.',
        narrativeBody:
          'Everyday chat threads and general cloud photo albums scatter shared memories across noisy chronological feeds. LoveStory was designed and built as a quiet, two-person web space where moments, locations, timelines, future plans, and private records remain connected along a single continuous thread.',
        liveCtaLabel: 'Visit Live Archive',
        metadata: [
          {
            label: 'Role',
            value: 'UI/UX Design & Ongoing Frontend Iteration',
          },
          {
            label: 'Period',
            value: '2026.08 – Present',
          },
          {
            label: 'Architecture',
            value: 'Web Frontend + FastAPI / SQLite Backend',
          },
          {
            label: 'Scope Status',
            value: 'Core Archive Live · Selected Modules in Prototype / Planned',
          },
        ],
        heroStageLabel:
          'LoveStory — Dark Archive Shared Space & Memory Canvas Stage',
        heroStageSubnote:
          'Reserved exhibition frame for authentic product captures across Moments, Timeline, Memory Map, and Mobile Grouped Editing.',
        scopeTransparencyNote:
          'Scope Note: LoveStory is an actively evolving personal product. Core shared-space onboarding, memory creation, gallery browsing, timeline navigation, and permission cues are implemented; extended map correlation and future-planning views include prototype and planned stages.',
      },
      scene02Needs: {
        lead: 'Designing a shared archive for two people requires more than storing image files. Each interface decision was traced from a concrete everyday need to a clear structural requirement.',
        explorerSlotBadge: 'Requirements Explorer Foundation',
        explorerSlotNote:
          'Structured foundation linking user needs to design requirements, interface decisions, and product evidence.',
        columnLabels: {
          userNeed: 'User Need',
          requirement: 'Design Requirement',
          decision: 'Interface Decision',
          evidence: 'Visual Evidence Slot',
        },
        items: [
          {
            id: 'need-01',
            number: '01',
            needTitle: 'Joining & Seeing a Shared Space Together',
            userContext:
              'When two partners link accounts or accept an invitation, both people need immediate confirmation of which space they are viewing and which records are shared.',
            designRequirement:
              'Establish unambiguous onboarding, invitation pairing, and shared-visibility indicators so newly created memories never appear missing to the other partner.',
            designDecision:
              'Designed explicit space-joining flows and visibility status cues in Profile, Accounts & Invitations, refined directly after real usage revealed invisible shared entries.',
            evidenceSlotLabel:
              'Shared Space Onboarding & Visibility Cue Evidence Slot',
          },
          {
            id: 'need-02',
            number: '02',
            needTitle: 'Exploring Memories Across Time and Place',
            userContext:
              'Shared memories are recalled both chronologically ("last autumn") and spatially ("the trip by the coast"), requiring more than a single flat photo grid.',
            designRequirement:
              'Connect album browsing with chronological Timeline anchors and geographic Memory Map coordinates without overwhelming the screen with dashboard chrome.',
            designDecision:
              'Structured Moments / Memory Gallery, Timeline, and Memory Map as linked views sharing consistent date, location, and story metadata.',
            evidenceSlotLabel:
              'Moments Gallery, Timeline & Memory Map Connection Slot',
          },
          {
            id: 'need-03',
            number: '03',
            needTitle: 'Distinguishing Shared Records from Private Archive',
            userContext:
              'Even within a two-person archive, users need a clear boundary between everyday shared moments and sensitive personal notes or private keepsakes.',
            designRequirement:
              'Provide calm, unmistakable permission cues and entry boundaries between ordinary shared records and the Private Archive.',
            designDecision:
              'Separated Private Archive entry points with dedicated lock/permission indicators and Dark Archive surface framing so users always know which privacy context is active.',
            evidenceSlotLabel:
              'Shared vs. Private Archive Permission Boundary Slot',
          },
          {
            id: 'need-04',
            number: '04',
            needTitle: 'Recording Moments Effortlessly on Mobile',
            userContext:
              'Most real memories are captured on a phone in the moment, where multi-column desktop sidebars feel cramped and error-prone.',
            designRequirement:
              'Adapt desktop editing panels into touch-friendly mobile flows and communicate loading, empty, failure, and normal states clearly.',
            designDecision:
              'Transformed desktop sidebar editing into grouped fullscreen mobile forms with fixed bottom save actions, paired with explicit retry entry points for failed requests.',
            evidenceSlotLabel:
              'Desktop Sidebar to Mobile Fullscreen Form Adaptation Slot',
          },
        ],
      },
      scene03Connections: {
        lead: 'Rather than isolating features inside rigid utility tabs, LoveStory organizes its eight modules around a shared memory core where time, place, plans, and privacy connect.',
        constellationTitle: 'Connected Memory Constellation (IA Foundation)',
        constellationSubnote:
          'Organic architectural map connecting Our World, Moments, Timeline, Memory Map, Future Plans, Anniversary Countdown, Private Archive, and Profile & Invitations.',
        hubLabel: 'Our World',
        hubSublabel: 'Shared Two-Person Space Core',
        statusLegend: {
          implemented: 'Implemented',
          prototype: 'Prototype',
          planned: 'Planned',
        },
        modules: [
          {
            id: 'mod-moments',
            name: 'Moments / Memory Gallery',
            nameSub: 'Photo & Story Archive',
            roleDescription:
              'Primary visual gallery for browsing shared photographs, stories, and curated albums with unshifted original photo colours.',
            statusBadge: 'Implemented',
            statusTone: 'implemented',
            connectedTo: ['Timeline', 'Memory Map', 'Our World'],
          },
          {
            id: 'mod-timeline',
            name: 'Timeline',
            nameSub: 'Chronological Thread',
            roleDescription:
              'Chronological stream ordering shared moments across months and milestones with consistent date anchoring.',
            statusBadge: 'Implemented',
            statusTone: 'implemented',
            connectedTo: ['Moments / Memory Gallery', 'Anniversary Countdown'],
          },
          {
            id: 'mod-map',
            name: 'Memory Map',
            nameSub: 'Spatial Footprints',
            roleDescription:
              'Geographic exploration linking recorded memories to real-world places and travel footprints.',
            statusBadge: 'Prototype',
            statusTone: 'prototype',
            connectedTo: ['Moments / Memory Gallery', 'Timeline'],
          },
          {
            id: 'mod-private',
            name: 'Private Archive',
            nameSub: 'Permission-Guarded Vault',
            roleDescription:
              'Dedicated private space with explicit permission cues separating sensitive keepsakes from ordinary shared records.',
            statusBadge: 'Implemented · Iterating',
            statusTone: 'implemented',
            connectedTo: ['Our World', 'Profile, Accounts & Invitations'],
          },
          {
            id: 'mod-plans',
            name: 'Future Plans',
            nameSub: 'Shared Wishlists & Trips',
            roleDescription:
              'Forward-looking space for planning upcoming experiences that can transition into recorded memories once completed.',
            statusBadge: 'Prototype',
            statusTone: 'prototype',
            connectedTo: ['Our World', 'Anniversary Countdown'],
          },
          {
            id: 'mod-anniversary',
            name: 'Anniversary Countdown',
            nameSub: 'Recurring Milestones',
            roleDescription:
              'Tracks meaningful shared dates and upcoming anniversaries alongside the chronological timeline.',
            statusBadge: 'Planned / Prototype',
            statusTone: 'planned',
            connectedTo: ['Timeline', 'Future Plans'],
          },
          {
            id: 'mod-profile',
            name: 'Profile, Accounts & Invitations',
            nameSub: 'Space Pairing & Permissions',
            roleDescription:
              'Manages account authentication, partner invitation pairing, and shared-space visibility settings.',
            statusBadge: 'Implemented',
            statusTone: 'implemented',
            connectedTo: ['Our World', 'Private Archive'],
          },
        ],
        pathwaysHeading: 'Core Connected User Pathways',
        pathways: [
          {
            id: 'flow-01',
            code: 'Pathway A',
            title: 'Shared Space Pairing & Visibility Verification',
            stepsSummary:
              'Account Sign-In → Send / Accept Partner Invitation → Enter Our World → Confirm Shared Record Visibility',
            scopeNote:
              'Implemented flow refined after resolving cross-account visibility discrepancies.',
          },
          {
            id: 'flow-02',
            code: 'Pathway B',
            title: 'Memory Creation (Desktop Sidebar vs. Mobile Fullscreen Form)',
            stepsSummary:
              'Select Create Memory → Upload Photo & Story → Set Date, Place & Visibility (Shared / Private) → Bottom-Pinned Save Action',
            scopeNote:
              'Implemented responsive creation flow with grouped mobile form fields.',
          },
          {
            id: 'flow-03',
            code: 'Pathway C',
            title: 'Browsing Across Moments, Timeline & Memory Map',
            stepsSummary:
              'Browse Moments Gallery → Jump to Chronological Timeline Node → Inspect Place Context in Memory Map',
            scopeNote:
              'Gallery and Timeline navigation implemented; cross-linked Map inspection in prototype refinement.',
          },
          {
            id: 'flow-04',
            code: 'Pathway D',
            title: 'Private Archive Boundary & State Recovery',
            stepsSummary:
              'Enter Private Archive → Verify Permission Cue → View Normal / Empty / Loading / Retry States',
            scopeNote:
              'Implemented permission boundary and four-state UI feedback.',
          },
        ],
      },
      scene04Memories: {
        lead: 'In Dark Archive (#10110F), interface chrome recedes into warm shadow and muted gold hairlines so photographs and personal stories hold the viewer’s full attention.',
        stageBadge: 'Dark Archive Exhibition Stage',
        stageSubnote:
          'Spacious product showcase foundation reserved for high-resolution interface captures and interactive demonstrations.',
        primaryStage: {
          id: 'stage-moments-timeline',
          code: 'Exhibition 01 · Core Archive',
          title: 'Moments Gallery & Chronological Timeline',
          subtitle: 'Photo-True Dark Archive Framing (#20211E) with Gold Thread Milestones',
          statusBadge: 'Implemented Core Workflow',
          description:
            'Frames shared photography on neutral dark surfaces (#171815 / #20211E) without colour-cast distortion, connecting album browsing directly to chronological timeline milestones.',
          visualFrameLabel:
            'Moments Gallery & Timeline Exhibition Frame',
          visualFrameSpec:
            'Primary product stage for Moments album view, photo detail modal, and synchronized Timeline stream.',
        },
        supportingStages: [
          {
            id: 'stage-map-plans',
            code: 'Exhibition 02 · Time × Place',
            title: 'Memory Map & Future Plans',
            subtitle: 'Connecting Past Footprints with Upcoming Experiences',
            statusBadge: 'Prototype Module Stage',
            description:
              'Links spatial pins with chronological moments and future wishlists so planned destinations can evolve into archived memories.',
            visualFrameLabel:
              'Memory Map & Future Plans Stage',
            visualFrameSpec:
              'Secondary product stage for spatial memory pins and future plan cards.',
          },
          {
            id: 'stage-private-mobile',
            code: 'Exhibition 03 · Privacy & Mobile Form',
            title: 'Private Archive & Mobile Fullscreen Editor',
            subtitle: 'Permission Cues & Grouped Touch-Friendly Recording',
            statusBadge: 'Implemented UX Adaptation',
            description:
              'Pairs clear Private Archive permission indicators with the grouped fullscreen mobile creation form and fixed bottom save bar.',
            visualFrameLabel:
              'Private Archive & Mobile Editor Stage',
            visualFrameSpec:
              'Secondary product stage comparing desktop sidebar editing with mobile fullscreen grouped forms.',
          },
        ],
      },
      scene05System: {
        lead: 'LoveStory’s visual language balances two distinct surfaces: Dark Archive for immersive memory viewing, and Paper & Ink for calm reading, reflection, and structured editing.',
        dualSurfaceHeading: 'Dual-Surface Colour System',
        dualSurfaceLead:
          'Both surfaces use neutral, low-saturation undertones so user-uploaded photographs retain their true natural colours.',
        darkArchiveCard: {
          badge: 'Dark Archive · Immersive Viewing',
          title: 'Obsidian, Warm Parchment & Fine Gold',
          description:
            'Used for the main memory gallery, timeline immersion, and private archive views where photography takes centre stage.',
          tokensPreview: [
            { name: '--archive-bg', hex: '#10110F', usage: 'Primary archive canvas' },
            { name: '--archive-surface', hex: '#171815', usage: 'Elevated archive surface' },
            { name: '--archive-photo-frame', hex: '#20211E', usage: 'Neutral photo mat' },
            { name: '--archive-text', hex: '#E8E3D8', usage: 'Warm parchment text' },
            { name: '--archive-gold', hex: '#B79A62', usage: 'Story thread & active node' },
            { name: '--archive-danger', hex: '#A47C69', usage: 'Restrained alert / retry cue' },
          ],
        },
        paperInkCard: {
          badge: 'Paper & Ink · Editorial & Analytical',
          title: 'Warm Archival Paper & Deep Carbon Ink',
          description:
            'Used for story reading, design analysis, and structured form organisation with crisp hairline dividers.',
          tokensPreview: [
            { name: '--bg', hex: '#F3EFE7', usage: 'Warm archival paper' },
            { name: '--bg-deep', hex: '#EAE5DA', usage: 'Recessed paper well' },
            { name: '--warm-white', hex: '#F5F1EB', usage: 'Elevated sheet surface' },
            { name: '--dark / --ink', hex: '#111111', usage: 'Primary editorial ink' },
            { name: '--muted', hex: '#8B8883', usage: 'Secondary metadata & captions' },
          ],
        },
        typographyHeading: 'Editorial Serif × Operational Sans Typography',
        typographySerifLabel: 'Editorial Serif — Memory Titles, Dates & Story Chapters',
        typographySerifSample: 'Every shared place leaves a quiet coordinate in time.',
        typographySerifNote:
          'High-contrast serif headings give dates, memory titles, and narrative milestones the warmth of a printed keepsake book.',
        typographySansLabel: 'Operational Sans — Navigation, Permissions & Form Controls',
        typographySansSample: 'Shared Space · Visible to Partner · Saved to Timeline',
        typographySansNote:
          'Clean sans-serif UI text keeps permission badges, filter controls, mobile form inputs, and error recovery states immediately legible.',
        interactionAdaptationHeading: 'Responsive & State-Resilient Interaction Design',
        interactionAdaptationLead:
          'Instead of shrinking desktop panels onto mobile screens, LoveStory restructures editing and state feedback for real-world use:',
        adaptationPoints: [
          {
            title: 'Desktop Sidebar → Mobile Fullscreen Grouped Form',
            detail:
              'Replaces narrow side-drawer inputs on small screens with grouped fullscreen sections and a pinned bottom save action bar.',
          },
          {
            title: 'Photo-True Light / Dark Hierarchy',
            detail:
              'Avoids tinted colour overlays on user photos, using neutral frames (#20211E / #F5F1EB) and subtle 1px borders.',
          },
          {
            title: 'Shared vs. Private Permission Signposting',
            detail:
              'Places clear visibility badges at both the creation entry point and the card header so privacy context is never ambiguous.',
          },
        ],
        stateSystemHeading: 'Four-State Interface Feedback Architecture',
        stateItems: [
          {
            stateName: 'Loading State',
            behavior:
              'Calm skeleton placeholders preserving photo aspect ratios to prevent layout shift.',
          },
          {
            stateName: 'Empty State',
            behavior:
              'Editorial prompt guiding partners to record their first moment or connect an invitation.',
          },
          {
            stateName: 'Failure State',
            behavior:
              'Plain-language explanation paired with an immediate retry entry point (--archive-danger #A47C69).',
          },
          {
            stateName: 'Normal Content State',
            behavior:
              'Uncluttered photo and story presentation with consistent date and permission cues.',
          },
        ],
      },
      scene06Built: {
        lead: 'LoveStory is built with a web frontend connected to a FastAPI and SQLite backend. Iterating on the live product exposed real multi-user edge cases that shaped the interface.',
        architectureHeading: 'Technical & Product Implementation Foundation',
        architectureSummary:
          'The frontend communicates with a FastAPI REST backend backed by SQLite persistence, handling account sessions, partner space invitations, memory CRUD operations, and visibility filtering.',
        iterationsHeading: 'Verified Iterations from Real Usage Feedback',
        iterations: [
          {
            code: 'Iteration 01 · Shared Visibility',
            title: 'Resolving Invisible Shared Content Across Linked Accounts',
            feedbackTrigger:
              'During real usage, memories created by one user occasionally appeared missing when viewed from the partner’s account due to ambiguous space-binding and visibility defaults.',
            designResponse:
              'Clarified shared-space status indicators, explicit Shared vs. Private creation defaults, and account-pairing states so both partners see synchronized records reliably.',
          },
          {
            code: 'Iteration 02 · Timeline Consistency',
            title: 'Stabilizing Chronological Timeline Display & Ordering',
            feedbackTrigger:
              'Entries with different date formats or creation timestamps vs. event dates caused inconsistent ordering between the Moments gallery and the Timeline view.',
            designResponse:
              'Unified event-date normalization and chronological grouping headers so Timeline nodes and Gallery cards reflect a consistent temporal order.',
          },
          {
            code: 'Iteration 03 · Mobile Editing Ergonomics',
            title: 'Refactoring Desktop Sidebar Editing into Fullscreen Mobile Forms',
            feedbackTrigger:
              'Editing multi-field memory records inside a compressed sidebar on mobile viewports caused scroll friction and hidden save buttons.',
            designResponse:
              'Introduced grouped fullscreen mobile forms with a sticky bottom action bar, improving touch target clarity and completion confidence.',
          },
        ],
        boundariesHeading: 'Honest Scope & Next Evolution Steps',
        implementedListTitle: 'Implemented & Live in Product',
        implementedItems: [
          'Shared space onboarding, account sign-in, and partner invitation pairing flows.',
          'Memory creation, album browsing, and chronological timeline navigation.',
          'Permission cues distinguishing shared records from Private Archive content.',
          'Dark Archive and Paper & Ink visual hierarchy with photo-true framing.',
          'Responsive desktop-to-mobile adaptation and four-state feedback (Loading, Empty, Failure, Normal).',
        ],
        plannedListTitle: 'In Prototype & Planned Next Steps',
        plannedItems: [
          'Deeper interactive coupling between Timeline scrolling and Memory Map spatial pins.',
          'Completing Future Plans to Moments conversion workflows when planned trips are fulfilled.',
          'Expanding Anniversary Countdown reminders and batch photo upload progress feedback.',
        ],
        closingReflection:
          'Designing and maintaining LoveStory as a live two-person archive demonstrated that emotional products rely on operational trust: clear permissions, resilient error recovery, and consistent temporal ordering are what allow personal memories to feel safe and enduring.',
      },
    },
  },

  'zh-CN': {
    meta: {
      landingTitle: 'Jianshuo Liu (刘建硕) — UI/UX 与交互设计师',
      workspaceTitle: '刘建硕 (Jianshuo Liu) — 作品集工作台与个人简历',
      skipToMain: '跳转至主要内容',
    },
    identity: {
      nameEn: 'Jianshuo Liu',
      firstNameUpper: 'JIANSHUO',
      lastNameUpper: 'LIU',
      lastNameDisplay: 'LIU.',
      supportingNameZh: '刘建硕',
      role: 'UI/UX 与交互设计师',
      supportingCopy: '专注于游戏界面与数字产品的深度交互体验设计。',
      disciplineLine: '游戏 UI/UX · 数字产品设计 · 交互系统',
      focusHeading: '专业探索方向',
      interests: [
        '游戏 UI/UX 设计',
        '数字产品设计',
        '交互式 Web 体验',
        '用户体验与交互系统',
      ],
      portraitBadge: '人像图层槽位 · 支持透明 PNG/WebP',
      portraitBadgeTooltip:
        '请将透明背景 WebP/PNG 人像放置于 public/portrait/jianshuo-portrait.webp（建议尺寸 1200 × 1500 px）',
      portraitAriaLabel: '刘建硕 (Jianshuo Liu) 视觉人像剪影占位图层',
      portraitCompactAriaLabel: '刘建硕 (Jianshuo Liu) 人像头像',
      heroHeadingAria: 'Jianshuo Liu (刘建硕) — UI/UX 与交互设计师',
    },
    nav: {
      primaryAria: '主导航',
      work: '作品',
      about: '关于',
      contact: '联系',
      themeLightLabel: '浅色 · 视觉志',
      themeDarkLabel: '深色 · 工作室',
      switchToLightAria: '切换至浅色模式（当前：深色）',
      switchToDarkAria: '切换至深色模式（当前：浅色）',
      langSwitcherAria: '语言切换',
      langEnLabel: 'EN',
      langZhLabel: '中文',
      switchToEnAria: 'Switch language to English (切换为英文)',
      switchToZhAria: '切换语言为简体中文',
      menuToggleLabel: '菜单',
      menuCloseLabel: '关闭',
      menuOpenAria: '打开导航菜单',
      menuCloseAria: '关闭导航菜单',
      mobileDrawerAria: '移动端导航菜单',
      themeLightShort: '浅色',
      themeDarkShort: '深色',
    },
    landingBottom: {
      selectedProjectsLabel: '精选项目：',
      selectedProjectsValue: 'BridgeWork AU · ZERO//LINE · LoveStory',
      architectureLabel: '系统架构：',
      architectureValue: '交互式作品集与个人履历档案',
      viewWorkCta: '浏览作品',
      enterPortfolioCta: '进入作品集',
    },
    workspace: {
      sidebarAria: '作品集工作台导航',
      resumeGroupAria: '个人简历章节导航',
      resumeGroupLabel: '个人简历档案',
      projectsGroupAria: '精选作品导航',
      projectsGroupLabel: '精选作品 (Selected Work)',
      caseStudyChaptersAria: '案例研究章节导航',
      caseStudyChaptersLabel: '案例研究目录 (11 章节)',
      caseStudyProjectSwitcherLabel: '切换项目案例',
      mobileChapterSelectLabel: '跳转至案例章节',
      expandSidebar: '展开侧栏',
      collapseSidebar: '收起侧栏',
      expandSidebarAria: '展开侧栏',
      collapseSidebarAria: '收起侧栏',
      profileOverviewAria: '前往个人概览 — 刘建硕 (Jianshuo Liu)',
      returnToCover: '返回封面',
      backToResume: '返回简历',
      backToResumeShort: '返回简历',
      breadcrumbRoot: '作品集工作台',
      breadcrumbResumePrefix: '个人简历',
      breadcrumbCaseStudyPrefix: '项目案例研究',
      openCaseStudyLabel: '查看案例研究',
      openCaseStudyAria: (projectName: string) =>
        `打开 ${projectName} 案例研究`,
      interactiveStageTitle: '交互架构与状态预览',
      stateTabsAria: '项目状态视图切换',
      designFocusHeading: '主要职责与核心设计范畴',
      verifiedContributionsHeading: '已验证项目职责与设计产出',
      caseStudyPlaceholderBadge: '图文与视觉槽位',
      nextProjectLabel: '浏览下一个项目案例',
    },
    resume: {
      sectionNav: [
        { id: 'overview', label: '个人概览', shortLabel: '概览' },
        { id: 'education', label: '教育背景', shortLabel: '教育' },
        { id: 'experience', label: '实践经历', shortLabel: '经历' },
        { id: 'skills', label: '专业技能', shortLabel: '技能' },
        {
          id: 'additional-projects',
          label: '其他项目',
          shortLabel: '其他项目',
        },
        {
          id: 'honours',
          label: '荣誉与语言',
          shortLabel: '荣誉语言',
        },
        { id: 'contact', label: '联系方式', shortLabel: '联系' },
      ],
      overview: {
        sectionTitle: '个人概览',
        eyebrow: '交互式个人简历与作品集档案',
        nameDisplay: '刘建硕',
        nameSecondary: 'Jianshuo Liu',
        positioning: 'UI/UX 设计实习生｜交互设计实习生',
        summary:
          '昆士兰大学交互设计硕士在读，软件工程本科。围绕学生求职、游戏与生活记录产品开展 UI/UX 设计，能够将用户研究转化为信息架构、视觉层级和交互方案，结合原型预览与使用反馈持续迭代。',
        quickJumpLabel: '快速定位章节：',
        keyExpertiseTitle: '核心能力概览',
        keyExpertiseItems: [
          '用户访谈、竞品分析与核心需求梳理提炼',
          '信息架构 (IA)、用户任务流与多维界面状态反馈',
          'Figma 高保真界面设计、组件化与变体规范 (Components & Variants)',
          '响应式布局适配、原型预览走查与基于反馈的持续迭代',
        ],
        educationSnapshotTitle: '教育背景概览',
        educationSnapshotItems: [
          {
            institution: '昆士兰大学 (University of Queensland)',
            program: '交互设计 · 硕士在读',
            period: '2026.07 – 至今',
          },
          {
            institution: '大连民族大学 (Dalian Minzu University)',
            program: '软件工程 · 本科',
            period: '2019.09 – 2023.06',
          },
        ],
        experienceSnapshotTitle: '工作经历概览',
        experienceSnapshotItems: [
          {
            company: '北京钛核互动',
            role: '游戏运营',
            period: '2025.08 – 2025.09',
          },
          {
            company: '北京紫辰乐游',
            role: '游戏运营',
            period: '2024.12 – 2025.08',
          },
          {
            company: '成都天蝎互娱',
            role: '游戏策划 / 运营',
            period: '2023.08 – 2024.01',
          },
        ],
        featuredProjectsTitle: '精选项目案例研究',
        featuredProjectsLead:
          '点击任一项目进入独立的 11 章节 UI/UX 深度案例研究页面。',
        viewInResumeLabel: '打开案例研究 →',
      },
      education: {
        sectionTitle: '教育背景',
        sectionSubtitle: '交互设计硕士在读与软件工程本科背景',
        entries: [
          {
            id: 'uq-master',
            institution: '昆士兰大学',
            institutionSecondary: 'University of Queensland',
            degree: '交互设计 · 硕士在读 (Master of Interaction Design)',
            period: '2026.07 – 至今',
            details: [
              '相关学习：用户研究、交互设计、网页界面设计与原型构建 (User Research, Interaction Design, Web Interface Design and Prototyping)',
            ],
          },
          {
            id: 'dlnu-bachelor',
            institution: '大连民族大学',
            institutionSecondary: 'Dalian Minzu University',
            degree: '软件工程 · 本科 (Bachelor of Software Engineering)',
            period: '2019.09 – 2023.06',
            details: [
              '大三学年综合成绩专业年级排名第 19 名',
              '获评校级“三好学生”荣誉称号',
              '担任班级班长',
            ],
          },
        ],
      },
      experience: {
        sectionTitle: '实践经历',
        sectionSubtitle: '划分为「项目经历」与「工作经历」两个独立模块',
        projectsTabLabel: 'A · 项目经历 (03)',
        workTabLabel: 'B · 工作经历 (03)',
        projectsHeading: '项目经历',
        projectsLead:
          '点击任一项目条目，进入独立案例研究页面查看完整的 UI/UX 设计推导流程。',
        projects: [
          {
            id: 'bridgework-au',
            number: '01',
            brandName: 'BridgeWork AU',
            fullTitle: 'BridgeWork AU — 学生求职支持平台',
            subtitle: '学生求职支持平台',
            period: '2026.08 – 至今',
            projectType: '五人高校课程团队项目',
            responsibilitiesLabel: '个人主要职责',
            responsibilities: '页面视觉与交互设计、用户研究与竞品分析。',
            contributions: [
              '作为团队成员参与两轮共 11 人次用户访谈，识别出学生在职位对比、求职信息复用与隐私保护方面的核心需求。',
              '针对 BOSS 直聘开展竞品分析，并在确定原型功能优先级时综合考量商业模式影响。',
              '将信息复用与隐私需求转化为可编辑个人资料、字段级信息授权分享及投递前预览等交互方案。',
              '围绕关键词/地点搜索、侧边栏筛选与双栏职位卡片构建职位发现与对比体验。',
              '在卡片与详情信息层级中优先突出职位名称、薪资范围、工作方式与申请截止日期。',
              '采用暖白表面与低饱和绿点缀色，建立统一的间距规范、卡片样式与按钮交互状态。',
            ],
            workspaceDestination: 'bridgework-au',
            workspaceCtaLabel: '查看案例研究',
          },
          {
            id: 'zero-line',
            number: '02',
            brandName: 'ZERO//LINE',
            fullTitle: 'ZERO//LINE — 原创英雄竞技 FPS 游戏官方概念网站设计',
            subtitle: '原创英雄竞技 FPS 游戏官方概念网站设计',
            period: '2026.09 – 至今',
            projectType: '个人概念设计项目',
            responsibilitiesLabel: '主要职责',
            responsibilities:
              '网站 UI/UX 设计、信息架构规划、视觉设计与品牌一致性、交互式网页前端实现、响应式设计与迭代。',
            contributions: [
              '围绕原创 5v5 英雄竞技 FPS 游戏设定，设计并实现包含 HOME、NEWS、HEROES、STORE、ABOUT 五大板块的官方概念网站。',
              '采用深炭绿基底 (#202522)、品牌鼠尾草绿 (#557E69)、战术暖金 (#C6AD7D) 与暖象牙白排版构建鲜明的游戏品牌视觉体系。',
              '设计并实现 NOVA、VESPER、RONIN 三位已上线展示英雄的角色切换、背景故事与技能说明交互。',
              '规划赛季资讯卡片 (NEWS)、三类商店入口结构 (Buy Game / Game Credits / Item Store) 与“2037 崩塌 (The 2037 Collapse)”世界观叙事板块。',
              '完成桌面端与移动端响应式适配与交互细节打磨（早期 Figma 游戏客户端 UI 练习作为关联探索独立归档）。',
            ],
            externalUrl: 'https://utopia-scarlet.github.io/ZERO-LINE/',
            externalLinkLabel: '访问线上概念官网 ↗',
            workspaceDestination: 'zero-line',
            workspaceCtaLabel: '查看案例研究',
          },
          {
            id: 'lovestory',
            number: '03',
            brandName: 'LoveStory',
            fullTitle: 'LoveStory — 共同记忆与生活记录网页平台',
            subtitle: '共同记忆与生活记录网页平台',
            period: '2026.08 – 至今',
            projectType: '个人独立项目',
            responsibilitiesLabel: '个人职责',
            responsibilities: 'UI/UX 设计与持续体验迭代。',
            contributions: [
              '设计加入共享空间、创建记忆记录、浏览相册与时间轴导航等核心交互流程。',
              '定义内容创建入口与权限视觉提示，清晰区分普通/共享记录与私密内容。',
              '运用衬线标题与无衬线界面正文的字体对比，区分叙事内容与功能操作界面。',
              '建立浅色/深色主题视觉层级，同时保持原始照片色彩还原不受干扰。',
              '将桌面端的时间轴、画廊与编辑交互适配至小屏移动设备。',
              '将桌面端侧边栏编辑重构为分组式全屏移动端表单，并配备底部固定保存操作栏。',
              '明确区分加载中、空状态、失败状态与正常内容状态，提供对应的状态反馈与重试入口。',
              '结合实际使用过程中关于“共享内容不可见”及“时间轴显示不一致”的真实反馈持续迭代界面行为。',
            ],
            externalUrl: 'https://love-story-archive-production.up.railway.app',
            externalLinkLabel: '访问线上网站 ↗',
            workspaceDestination: 'lovestory',
            workspaceCtaLabel: '查看案例研究',
          },
        ],
        workHeading: '工作经历',
        workLead:
          '按时间倒序排列的游戏运营、玩家反馈统筹、社群活动策划及休闲游戏策划实践经历。',
        workEntries: [
          {
            id: 'taihe',
            companyZh: '北京钛核互动',
            companyEn: 'Beijing Taihe Interactive',
            role: '游戏运营',
            period: '2025.08 – 2025.09',
            highlights: [
              '收集《极无双 2》中国大陆服与海外服玩家反馈。',
              '对接并协同研发团队跟进玩家问题排查与解决。',
              '参与版本活动上线发布、配置验收检查与内容审核工作。',
            ],
          },
          {
            id: 'zichen',
            companyZh: '北京紫辰乐游',
            companyEn: 'Beijing Zichen Leyou',
            role: '游戏运营',
            period: '2024.12 – 2025.08',
            highlights: [
              '支持 3 款 IAA 产品的社群建设与用户参与流程运营。',
              '结合渠道拉新与社群活动运营，助力社群累计增长 500+ 用户。',
              '收集整理玩家反馈并日常监测社群讨论动态。',
              '策划《欢乐消消消》玩家社群活动。',
              '活动期间相关话题发帖量提升 30%，并沉淀超过 10 篇优质玩家 UGC 内容。',
            ],
          },
          {
            id: 'tianxie',
            companyZh: '成都天蝎互娱',
            companyEn: 'Chengdu Scorpio Interactive',
            role: '游戏策划 / 运营',
            period: '2023.08 – 2024.01',
            highlights: [
              '参与抖音休闲小游戏设计，涵盖找茬玩法与互动叙事体验。',
              '制定核心玩法规则与交互逻辑，撰写策划方案并协同开发人员推进功能实现。',
            ],
          },
        ],
      },
      skills: {
        sectionTitle: '专业技能',
        sectionSubtitle: '按 UI 视觉设计、UX 交互设计与设计还原落地三大方向分类整理',
        categories: [
          {
            id: 'ui-design',
            title: 'UI 设计 (UI Design)',
            subtitle: '高保真界面视觉、色彩版式体系与组件化规范',
            skills: [
              'Figma',
              '高保真界面设计 (High-fidelity interface design)',
              '视觉层级构建 (Visual hierarchy)',
              '色彩与版式体系 (Colour and typography systems)',
              '主次操作层级规划 (Primary and secondary actions)',
              '组件与变体规范 (Components and Variants)',
            ],
          },
          {
            id: 'ux-design',
            title: 'UX 设计 (UX Design)',
            subtitle: '用户研究转化、信息架构与状态反馈设计',
            skills: [
              '用户访谈 (User interviews)',
              '竞品分析 (Competitor analysis)',
              '需求梳理与提炼 (Requirements synthesis)',
              '信息架构 (Information architecture)',
              '用户任务流 (User flows)',
              '交互原型设计 (Interactive prototypes)',
              '界面状态与反馈机制 (UI states and feedback)',
            ],
          },
          {
            id: 'design-implementation',
            title: '设计实现与走查 (Design Implementation)',
            subtitle: '响应式布局验证、原型走查与前端还原跟进',
            skills: [
              '响应式布局适配 (Responsive layouts)',
              '原型预览与校验 (Prototype preview)',
              '界面交互走查 (Interface walkthroughs)',
              '基于反馈的持续迭代 (Feedback-driven iteration)',
              '理解前端实现逻辑 (Understanding frontend implementation)',
              '核验设计在真实界面中的渲染还原效果 (Reviewing rendered interfaces)',
            ],
          },
        ],
      },
      additionalProjects: {
        sectionTitle: '其他项目',
        sectionSubtitle: '本科阶段完成的 3D 游戏原型开发与 AI 游戏设计研究项目',
        entries: [
          {
            id: '3d-shooter',
            title: '3D 射击游戏原型 (3D Shooter Game Prototype)',
            period: '2023.04 – 2023.06',
            summary:
              '构建包含角色移动、基础战斗与环境交互的 3D 游戏原型，用于展示并验证 3D 游戏中的玩家操作控制与即时反馈机制。',
          },
          {
            id: 'ai-game-research',
            title: 'AI 与游戏设计研究 (AI & Game Design Research)',
            period: '2023.06 – 2023.07',
            summary:
              '完成包含核心玩法与关卡设计的 2D 游戏原型，相关研究成果已发表于国际学术会议。',
          },
        ],
      },
      honoursAndLanguages: {
        sectionTitle: '荣誉与语言',
        sectionSubtitle: '本科阶段荣誉表彰与英语能力证书',
        honoursTitle: '荣誉奖项',
        honoursList: [
          {
            title: '校级“三好学生”（2022）',
            detail: '大连民族大学校级综合表彰',
          },
          {
            title: 'Speexx 英语口语比赛三等奖',
            detail: '英语口语表达与沟通能力奖项',
          },
        ],
        languagesTitle: '语言与考试资质',
        examBadges: ['CET-4', 'CET-6', 'IELTS 6.0'],
        languageCapabilityNote: '能够阅读英文专业资料并进行日常英语沟通交流。',
      },
      contact: {
        sectionTitle: '联系方式',
        sectionSubtitle: '欢迎就 UI/UX 设计实习与交互设计实习机会与我联系',
        emailLabel: '电子邮箱',
        phoneLabel: '联系电话',
        phoneHiddenNote: '可邮件索取联系电话',
        locationLabel: '求职意向城市',
        locationValue: '北京 (Beijing)',
        availabilityLabel: '到岗时间',
        availabilityValue: '具体时间可沟通 (To be discussed)',
        liveProjectsLabel: '线上项目链接',
        emailCtaLabel: '发送邮件联系',
        pdfDownloadLabel: '下载 PDF 简历',
        pdfUnavailableNote:
          '当前代码仓库未内置 PDF 简历附件，如需最新 PDF 版本简历欢迎直接通过邮箱联系获取。',
      },
    },
    caseStudyChapters: [
      {
        number: '01',
        id: 'cs-01',
        title: '项目概览',
        scopeNote: '官方概念网站立项定位、五大核心内容板块、项目周期与个人主要职责。',
        contentPlaceholder: '此处将补充项目概览与背景说明。',
        mediaPlaceholderLabel: '项目主视觉与界面概览占位区域。',
        mediaAspect: 'wide',
      },
      {
        number: '02',
        id: 'cs-02',
        title: '目标用户',
        scopeNote: '基于官方网站使用场景推导的三类目标访客群体（非实证访谈画像）。',
        contentPlaceholder: '此处将补充目标用户特征与使用场景说明。',
        mediaPlaceholderLabel: '目标用户与使用场景图示占位区域。',
        mediaAspect: 'compact',
      },
      {
        number: '03',
        id: 'cs-03',
        title: '用户研究与需求洞察',
        scopeNote: '官方游戏网站设计需求维度、证据类型界定与待开展研究说明。',
        contentPlaceholder: '此处将补充用户研究与需求洞察证据材料。',
        mediaPlaceholderLabel: '用户研究整理与洞察图表占位区域。',
        mediaAspect: 'split',
      },
      {
        number: '04',
        id: 'cs-04',
        title: '问题定义',
        scopeNote: '概念官网核心 UX 挑战及六项具体信息组织与视觉平衡难题。',
        contentPlaceholder: '此处将补充核心问题定义与设计挑战拆解。',
        mediaPlaceholderLabel: '问题定义与体验痛点拆解图占位区域。',
        mediaAspect: 'compact',
      },
      {
        number: '05',
        id: 'cs-05',
        title: '竞品分析',
        scopeNote: '同类英雄竞技游戏官网参考候选（Overwatch、VALORANT）、七项对比维度与研究占位说明。',
        contentPlaceholder: '此处将补充竞品分析结论与对比维度。',
        mediaPlaceholderLabel: '竞品功能与交互对比矩阵占位区域。',
        mediaAspect: 'split',
      },
      {
        number: '06',
        id: 'cs-06',
        title: '设计目标',
        scopeNote: '围绕品牌识别、内容可发现性、主次操作区分与跨端一致性的四大设计目标。',
        contentPlaceholder: '此处将补充设计目标与方案优先级规划。',
        mediaPlaceholderLabel: '设计目标与优先级推导框架占位区域。',
        mediaAspect: 'compact',
      },
      {
        number: '07',
        id: 'cs-07',
        title: '信息架构',
        scopeNote: '概念官网五大主导航板块：HOME、NEWS、HEROES（NOVA / VESPER / RONIN）、STORE、ABOUT。',
        contentPlaceholder: '此处将补充信息架构说明与层级图。',
        mediaPlaceholderLabel: '信息架构图 (IA Diagram) 占位区域。',
        mediaAspect: 'wide',
      },
      {
        number: '08',
        id: 'cs-08',
        title: '用户流程与交互设计',
        scopeNote: '官方网站四大核心浏览路径（Flows A–D），明确区分已实现前端交互与概念阶段步骤。',
        contentPlaceholder: '此处将补充用户流程与交互设计推导说明。',
        mediaPlaceholderLabel: '用户任务流程图 (User Flow) 占位区域。',
        mediaAspect: 'wide',
      },
      {
        number: '09',
        id: 'cs-09',
        title: '界面设计与设计系统',
        scopeNote: '官方配色体系、游戏感排版、英雄切换、赛季卡片、商店结构及独立归档的早期客户端探索。',
        contentPlaceholder: '此处将补充高保真界面设计与组件规范详情。',
        mediaPlaceholderLabel: '官网视觉设计系统与板块规范预览占位区域。',
        mediaAspect: 'wide',
      },
      {
        number: '10',
        id: 'cs-10',
        title: '原型验证与设计迭代',
        scopeNote: '项目真实迭代记录：赛季标题排版、卡片明度对比、主题色彩校准、导航层级与响应式调优。',
        contentPlaceholder: '此处将补充交互原型预览走查与迭代改版记录。',
        mediaPlaceholderLabel: 'UI 交互原型预览占位区域。',
        mediaAspect: 'wide',
      },
      {
        number: '11',
        id: 'cs-11',
        title: '设计成果与复盘',
        scopeNote: '已部署上线的概念官网交付成果汇总，以及后续优化方向与反思。',
        contentPlaceholder: '此处将补充最终设计产出总结与项目复盘。',
        mediaPlaceholderLabel: '最终界面成果展示占位区域。',
        mediaAspect: 'split',
      },
    ],
    projects: {
      'bridgework-au': {
        id: 'bridgework-au',
        number: '01',
        title: 'BridgeWork AU',
        fullTitle: 'BridgeWork AU — 学生求职支持平台',
        category: '学生求职支持平台',
        period: '2026.08 – 至今',
        projectType: '五人高校课程团队项目',
        statusBadge: '案例研究框架 · 学生求职产品 UX',
        summary:
          '五人高校课程团队合作开展的学生求职支持平台设计项目，围绕职位发现与对比、求职资料复用、字段级隐私授权分享以及投递前预览构建核心体验。',
        responsibilitiesLabel: '个人主要职责',
        responsibilities: '页面视觉与交互设计、用户研究与竞品分析。',
        heroPreviewLabel: 'BridgeWork AU — 核心界面与职位发现双栏卡片预览槽位',
        heroPreviewSubnote:
          '暖白表面与低饱和绿点缀色视觉体系 · 关键词/地点搜索、侧边栏筛选与字段级授权投递预览',
        accentTheme: 'bridgework',
        designFocus: [
          '团队两轮共 11 人次用户访谈与 BOSS 直聘竞品分析',
          '可编辑资料复用、字段级信息授权分享与投递前预览交互',
          '关键词/地点搜索、侧边栏筛选与双栏职位卡片信息层级',
        ],
        verifiedContributions: [
          '作为团队成员参与两轮共 11 人次用户访谈，识别出学生在职位对比、求职信息复用与隐私保护方面的核心需求。',
          '针对 BOSS 直聘开展竞品分析，并在确定原型功能优先级时综合考量商业模式影响。',
          '将信息复用与隐私需求转化为可编辑个人资料、字段级信息授权分享及投递前预览等交互方案。',
          '围绕关键词/地点搜索、侧边栏筛选与双栏职位卡片构建职位发现与对比体验。',
          '在卡片与详情信息层级中优先突出职位名称、薪资范围、工作方式与申请截止日期。',
          '采用暖白表面与低饱和绿点缀色，建立统一的间距规范、卡片样式与按钮交互状态。',
        ],
      },
      'zero-line': {
        id: 'zero-line',
        number: '02',
        title: 'ZERO//LINE',
        fullTitle: 'ZERO//LINE — 原创英雄竞技 FPS 游戏官方概念网站设计',
        category: '原创 5v5 英雄竞技 FPS · 官方概念网站 UI/UX 设计与前端实现',
        period: '2026.09 – 至今',
        projectType: '个人概念设计项目',
        statusBadge: '线上概念官网已部署 · 游戏概念站 UI/UX',
        summary:
          'ZERO//LINE 是一个基于原创 5v5 英雄竞技 FPS 游戏设定的官方概念网站设计项目。项目围绕游戏品牌建立、赛季资讯传播、英雄角色展示、商店入口及世界观介绍五个核心内容板块，探索如何将游戏视觉语言转化为具有信息层级、交互反馈和响应式适配能力的官方网站体验。',
        responsibilitiesLabel: '主要职责',
        responsibilities:
          '网站 UI/UX 设计、信息架构规划、视觉设计与品牌一致性、交互式网页前端实现、响应式设计与迭代。',
        heroPreviewLabel:
          'ZERO//LINE — 官方概念网站五大板块预览槽位 (HOME · NEWS · HEROES · STORE · ABOUT)',
        heroPreviewSubnote:
          '深炭绿表面 (#202522)、鼠尾草绿 (#557E69) 与暖金 (#C6AD7D) 品牌视觉 · 五大核心内容板块与三位展示英雄 (NOVA / VESPER / RONIN)',
        accentTheme: 'zeroline',
        externalUrl: 'https://utopia-scarlet.github.io/ZERO-LINE/',
        externalLinkLabel:
          '访问线上官方概念网站 (utopia-scarlet.github.io/ZERO-LINE) ↗',
        designFocus: [
          '五大核心板块官方概念网站信息架构（HOME / NEWS / HEROES / STORE / ABOUT）',
          '三位英雄角色展示与切换（NOVA、VESPER、RONIN）、赛季资讯卡片与商店入口层级',
          '原创游戏品牌视觉体系（#202522 / #557E69 / #C6AD7D）与响应式前端实现',
        ],
        verifiedContributions: [
          '基于原创 5v5 英雄竞技 FPS 游戏设定，完成包含 HOME、NEWS、HEROES、STORE、ABOUT 五大板块的官方概念网站设计与前端部署。',
          '建立深炭绿 (#202522)、鼠尾草绿 (#557E69)、暖金 (#C6AD7D) 与暖象牙白 (#F1EEE5) 的原创品牌视觉规范。',
          '在 HEROES 板块实现 NOVA、VESPER、RONIN 三位角色的立绘展示、身份背景与技能介绍切换交互。',
          '在 NEWS 与 STORE 板块构建赛季更新卡片层级及“Buy Game / Game Credits / Item Store”三类商店入口结构，并在 ABOUT 板块呈现“The 2037 Collapse”世界观叙事。',
          '围绕赛季卡片字号、卡片明度对比、导航与 CTA 层级及桌面/移动端响应式表现开展多轮真实迭代。',
        ],
      },
      lovestory: {
        id: 'lovestory',
        number: '03',
        title: 'LoveStory',
        fullTitle: 'LoveStory — 共同记忆与生活记录网页平台',
        category: '共同记忆与生活记录网页平台',
        period: '2026.08 – 至今',
        projectType: '个人独立项目',
        responsibilitiesLabel: '个人职责',
        responsibilities: 'UI/UX 设计与持续体验迭代。',
        statusBadge: '线上版本已部署 · 持续体验迭代中',
        summary:
          '围绕加入共享空间、创建记忆、浏览相册与时间轴导航设计的个人 Web 平台，明确区分共享与私密内容权限提示，结合衬线/无衬线字体层级、保护原片色彩的浅/深色主题，以及针对移动端的全屏分组表单适配。',
        heroPreviewLabel: 'LoveStory — 共享记忆空间、时间轴与移动端全屏表单预览槽位',
        heroPreviewSubnote:
          '叙事感衬线标题与无衬线界面正文 · 保护照片原色的浅/深色主题层级与移动端分组式表单',
        accentTheme: 'lovestory',
        externalUrl: 'https://love-story-archive-production.up.railway.app',
        externalLinkLabel: '访问线上网站 (love-story-archive-production.up.railway.app) ↗',
        designFocus: [
          '共享空间加入、记忆创建、相册浏览与时间轴导航全流程',
          '普通/共享记录与私密内容的入口及权限视觉提示区分',
          '桌面至移动端响应式重构与多状态反馈迭代',
        ],
        verifiedContributions: [
          '设计加入共享空间、创建记忆记录、浏览相册与时间轴导航等核心交互流程。',
          '定义内容创建入口与权限视觉提示，清晰区分普通/共享记录与私密内容。',
          '运用衬线标题与无衬线界面正文的字体对比，区分叙事内容与功能操作界面。',
          '建立浅色/深色主题视觉层级，同时保持原始照片色彩还原不受干扰。',
          '将桌面端的时间轴、画廊与编辑交互适配至小屏移动设备。',
          '将桌面端侧边栏编辑重构为分组式全屏移动端表单，并配备底部固定保存操作栏。',
          '明确区分加载中、空状态、失败状态与正常内容状态，提供对应的状态反馈与重试入口。',
          '结合实际使用过程中关于“共享内容不可见”及“时间轴显示不一致”的真实反馈持续迭代界面行为。',
        ],
      },
    },
    zeroLineExperience: {
      hero: {
        protocolBadge: '02 // 精选项目',
        genreTag: '原创 5V5 英雄竞技 FPS',
        titlePrefix: 'ZERO',
        titleSuffix: 'LINE',
        deliverableHeading:
          '原创英雄竞技 FPS 游戏官方概念网站设计',
        subtitle:
          '基于原创 5v5 英雄竞技 FPS 游戏设定，设计兼顾品牌展示、角色探索与资讯浏览的官方网站体验。',
        positioningStatement:
          '个人概念设计项目 · 网站 UI/UX 设计与前端实现 · 2026.09 – 至今',
        exploreActCta: '浏览案例研究',
        liveSiteCta: '访问官方概念网站 ↗',
        characterSlotBadge: '角色主视觉 · NOVA',
        characterSlotTitle: 'NOVA',
        characterSlotSpec:
          '角色主视觉区域',
        transitionCharacterLabel:
          'ZERO//LINE 转场角色立绘槽位 (/public/zeroline/zeroline-character-slash.webp)',
        transitionCharacterSubnote:
          'Stage B 静态角色图层：放入 1600 × 1800 px 透明 WebP/PNG 角色立绘后自动启用。',
        transitionTagline: 'ZERO//LINE — 原创英雄竞技 FPS 游戏官方概念网站设计',
        telemetry: [
          { label: '项目类型', value: '个人概念设计项目' },
          { label: '主要职责', value: '网站 UI/UX 设计与前端实现' },
          { label: '项目周期', value: '2026.09 – 至今' },
        ],
        paletteTokens: [
          { name: '深炭绿基底', hex: '#202522', role: '--black' },
          { name: '次级战术表面', hex: '#2B312E', role: '--black-soft' },
          { name: '高阶卡片面板', hex: '#353C38', role: '--black-card' },
          { name: '品牌鼠尾草绿', hex: '#557E69', role: '--brand-green' },
          { name: '战术暖金高亮', hex: '#C6AD7D', role: '--gold' },
          { name: '暖象牙白排版', hex: '#F1EEE5', role: '--white' },
        ],
      },
      sidebar: {
        worldModeBadge: 'ZERO//LINE 官方网站案例模式',
        actNavigationLabel: '叙事幕次与案例章节 (01–11)',
        progressLabel: '案例阅读进度',
      },
      acts: [
        {
          actNumber: 'ACT 01',
          actCode: 'THE WORLD',
          actTitle: 'ACT 01 — 世界与定位 (THE WORLD)',
          actSubtitle:
            '明确官方概念网站的核心交付物定位、五大板块范畴、个人主要职责与项目边界。',
          layoutVariant: 'world-dossier',
          chapterIds: ['cs-01'],
        },
        {
          actNumber: 'ACT 02',
          actCode: 'THE PLAYERS',
          actTitle: 'ACT 02 — 访客与问题 (THE PLAYERS)',
          actSubtitle:
            '区分网站访客与局内客户端玩家，梳理三类场景化目标人群、官网设计要求与核心 UX 挑战。',
          layoutVariant: 'player-intel',
          chapterIds: ['cs-02', 'cs-03', 'cs-04'],
        },
        {
          actNumber: 'ACT 03',
          actCode: 'THE STRATEGY',
          actTitle: 'ACT 03 — 策略与目标 (THE STRATEGY)',
          actSubtitle:
            '参考同类英雄射击游戏官方网站（Overwatch、VALORANT）评估维度，确立四大网站设计目标。',
          layoutVariant: 'strategic-matrix',
          chapterIds: ['cs-05', 'cs-06'],
        },
        {
          actNumber: 'ACT 04',
          actCode: 'THE SYSTEM',
          actTitle: 'ACT 04 — 架构与流程 (THE SYSTEM)',
          actSubtitle:
            '基于线上实装站点的五大板块信息架构（HOME / NEWS / HEROES / STORE / ABOUT）与四条核心浏览路径。',
          layoutVariant: 'system-blueprint',
          chapterIds: ['cs-07', 'cs-08'],
        },
        {
          actNumber: 'ACT 05',
          actCode: 'THE INTERFACE',
          actTitle: 'ACT 05 — 界面与视觉系统 (THE INTERFACE)',
          actSubtitle:
            '展示官方网站视觉排版、三位英雄切换（NOVA / VESPER / RONIN）、赛季卡片与商店层级，并独立归档早期客户端 Figma 练习。',
          layoutVariant: 'interface-showcase',
          chapterIds: ['cs-09'],
        },
        {
          actNumber: 'ACT 06',
          actCode: 'THE EVOLUTION',
          actTitle: 'ACT 06 — 迭代与复盘 (THE EVOLUTION)',
          actSubtitle:
            '梳理真实迭代调整记录、已验证的线上网站交付物及未来优化方向。',
          layoutVariant: 'evolution-log',
          chapterIds: ['cs-10', 'cs-11'],
        },
      ],
      overviewPositioningQuote:
        'ZERO//LINE 是一款原创虚构 5v5 英雄战术竞技 FPS 游戏概念。本项目围绕该设定设计与实现了官方概念网站，将游戏的品牌世界观、英雄角色与赛季资讯转化为兼具视觉张力与浏览可用性的 Web 体验。',
      primaryResponsibilitiesHeading: '个人职责',
      primaryResponsibilities: [
        '网站 UI/UX 设计与信息架构规划',
        '品牌视觉调性与排版系统构建',
        '交互式网页前端实现（utopia-scarlet.github.io/ZERO-LINE）',
        '桌面端与移动端响应式适配',
      ],
      scopeBoundaryHeading:
        '交付物与项目范围',
      scopeBoundaryItems: [
        '核心交付物：已部署上线的官方概念网站，包含 HOME、NEWS、HEROES、STORE、ABOUT 五大板块及 NOVA、VESPER、RONIN 三位可切换英雄。',
        '项目边界：聚焦于官方网站浏览体验，不包含可运行的游戏客户端程序、实时匹配服务器或真实支付结算后端。',
        '关联练习区分：前期在 Figma 中开展的 FPS 游戏客户端 UI 练习已在第 09 章底部单独归档，不计入官网主交付物。',
      ],
      userSegmentsNotice:
        '设计说明：以下三类访客群体为基于游戏官网典型访问场景构建的设计假设，而非正式用户访谈得出的实证画像。',
      userSegments: [
        {
          id: 'prospective-players',
          code: '01 · 首次到访访客',
          title: '潜在新玩家',
          profile: '首次接触 ZERO//LINE 概念、评估游戏吸引力的访客。',
          primaryGoalLabel: '核心目标',
          primaryGoal:
            '快速认知 5v5 英雄竞技 FPS 品类定位、世界观基调与核心角色魅力。',
          typicalTaskLabel: '典型浏览任务',
          typicalTask:
            '浏览首屏英雄主视觉，切换预览角色定位，并阅读核心背景设定。',
          designConsiderationLabel: '关键设计考量',
          designConsideration:
            '在 HOME 首屏明确传达品类定位，并提供直达 HEROES 与 ABOUT 的探索引导。',
          areasLabel: '关联板块',
          areas: ['HOME', 'HEROES', 'ABOUT'],
        },
        {
          id: 'engaged-returning',
          code: '02 · 资讯与角色查阅访客',
          title: '回访与核心关注玩家',
          profile: '已了解基本设定、希望查阅赛季改动或角色技能详情的访客。',
          primaryGoalLabel: '核心目标',
          primaryGoal:
            '高效获取最新赛季更新重点，并横向对比不同英雄的技能机制。',
          typicalTaskLabel: '典型浏览任务',
          typicalTask:
            '在 NEWS 中快速扫读四类赛季卡片，并在 HEROES 中切换查阅 NOVA、VESPER 与 RONIN。',
          designConsiderationLabel: '关键设计考量',
          designConsideration:
            '采用同页即时角色切换与高对比度赛季资讯卡片，降低信息查找成本。',
          areasLabel: '关联板块',
          areas: ['NEWS', 'HEROES'],
        },
        {
          id: 'purchase-intent',
          code: '03 · 商店与获取意向访客',
          title: '具备获取与商店意向的访客',
          profile: '关注游戏获取方式、点数配置或外观道具商店结构的访客。',
          primaryGoalLabel: '核心目标',
          primaryGoal:
            '快速厘清游戏本体获取、游戏点数与道具商店三类入口的差异。',
          typicalTaskLabel: '典型浏览任务',
          typicalTask:
            '进入 STORE 对比 Buy Game、Game Credits 与 Item Store，并识别下一步主操作。',
          designConsiderationLabel: '关键设计考量',
          designConsideration:
            '将三类商店入口拆分为层级分明的独立卡片，并与顶部主按钮形成视觉区分。',
          areasLabel: '关联板块',
          areas: ['STORE', '主操作按钮'],
        },
      ],
      requirementsHeading: '核心网站设计需求',
      requirementsItems: [
        {
          code: '01',
          title: '首屏游戏身份传达',
          reasoning:
            '通过高张力角色主视觉与大标题版式，在第一屏即时建立 5v5 英雄竞技 FPS 的品类认知。',
        },
        {
          code: '02',
          title: '英雄信息可发现性',
          reasoning:
            '支持在同一视图内切换 NOVA、VESPER、RONIN，无需跳转页面即可连贯查阅角色背景与技能。',
        },
        {
          code: '03',
          title: '赛季资讯分类组织',
          reasoning:
            '将版本信息归纳为赛季更新、排位改动、新内容与限时活动四类高对比度卡片，便于快速扫读。',
        },
        {
          code: '04',
          title: '导航与主次操作层级',
          reasoning:
            '保持五大板块全局导航常驻，同时以暖金高亮突出 START GAME 主按钮，避免主次操作混淆。',
        },
        {
          code: '05',
          title: '商店入口清晰度',
          reasoning:
            '明确拆分 Buy Game、Game Credits 与 Item Store 三类入口，使访客一眼理解各入口用途。',
        },
        {
          code: '06',
          title: '多端响应式呈现',
          reasoning:
            '在桌面端与移动端视口下兼顾角色立绘的视觉表现力与界面文本、交互控件的清晰可读。',
        },
      ],
      evidenceClassificationHeading:
        '设计依据与研究局限',
      evidenceClassificationItems: [
        {
          category: '探索性设计分析',
          status: '场景与品类参考',
          detail:
            '基于英雄射击游戏门户网站的典型浏览场景与编辑感游戏排版方式推导设计需求。',
        },
        {
          category: '前端实现走查',
          status: '浏览器实机验证',
          detail:
            '在真实前端开发与多端浏览器预览中持续检验导航状态、角色切换、卡片明度与响应式布局。',
        },
        {
          category: '实证用户研究',
          status: '尚未开展',
          detail:
            '当前概念阶段未开展正式用户访谈、问卷调查或定量可用性测试。',
        },
      ],
      futureValidationHeading: '后续用户验证计划',
      futureValidationNote:
        '下一步计划邀请 5–8 名 FPS 玩家开展可用性走查，重点验证首屏定位理解度、英雄技能查阅效率与商店分类清晰度。',
      centralProblemLabel: '核心 UX 问题',
      centralProblemStatement:
        '作为一款原创英雄竞技 FPS 的官方概念网站，如何在传达鲜明游戏身份的同时，清晰组织多类型内容并引导访客顺畅触达目标信息，而不牺牲视觉冲击力与可用性？',
      supportingChallengesLabel: '四项关键设计挑战',
      supportingChallenges: [
        '01. 视觉张力与阅读清晰度平衡 — 在大幅角色立绘与高冲击力标题旁保持界面正文清晰易读。',
        '02. 多板块结构统一 — 将品牌、资讯、英雄、商店与世界观五类内容整合为直观的浏览架构。',
        '03. 英雄信息高效切换 — 在有限视口内呈现角色背景与技能说明，避免长页面滚动疲劳。',
        '04. 商店与行动入口区分 — 厘清主操作按钮与三类商店入口（本体、点数、道具）的视觉层级。',
      ],
      competitorNotice:
        '参考说明：以《VALORANT（无畏契约）》与《Overwatch（守望先锋）》官方网站作为同类门户参考候选。由于当前未完成系统化竞品实证评估，以下评估维度作为竞品对比研究占位呈现。',
      competitorCandidates: [
        {
          name: 'VALORANT 官方网站',
          positioning: '5v5 英雄战术射击官方门户',
          relevance:
            '参考其高张力大标题排版、角色切换展示结构与赛季幕次资讯呈现方式。',
        },
        {
          name: 'Overwatch 官方网站',
          positioning: '团队英雄射击官方门户',
          relevance:
            '参考其英雄定位与技能拆解的可读性、活动卡片层级及商店入口引导方式。',
        },
      ],
      competitorCriteriaLabel: '参考评估维度（研究占位）',
      competitorCriteria: [
        '首屏品类识别',
        '全局导航层级',
        '英雄技能交互',
        '赛季资讯版式',
        '商店操作引导',
        '跨设备响应式',
      ],
      designGoals: [
        {
          code: '目标 01',
          title: '建立品牌识别',
          description:
            '通过英雄主视觉、编辑感标题版式以及深炭绿、鼠尾草绿与暖金配色，在首屏建立鲜明的游戏世界印象。',
        },
        {
          code: '目标 02',
          title: '提升内容可发现性',
          description:
            '通过常驻顶部导航栏与清晰的板块标题层级，让访客顺畅触达 HOME、NEWS、HEROES、STORE 与 ABOUT。',
        },
        {
          code: '目标 03',
          title: '厘清主次操作',
          description:
            '明确区分 START GAME 主行动按钮、三类商店入口（Buy Game / Game Credits / Item Store）与普通浏览链接。',
        },
        {
          code: '目标 04',
          title: '保持跨端体验一致',
          description:
            '在桌面端与移动端视口中保持一致的品牌视觉氛围、卡片信息层级与交互反馈。',
        },
      ],
      websiteIaHeading:
        '五大板块网站信息架构',
      websiteIaLead:
        '每个一级导航板块分别对应网站访客的一类核心探索目标：',
      websiteIaSections: [
        {
          code: '01 · HOME',
          name: 'HOME',
          role: '建立游戏品牌认知并引导核心探索',
          elements: [
            '英雄主视觉与品类定位阐述',
            'START GAME 主操作入口',
            '五板块全局导航栏',
          ],
          statusNote: '线上已实装',
        },
        {
          code: '02 · NEWS',
          name: 'NEWS',
          role: '组织赛季动态与版本更新资讯',
          elements: [
            '赛季更新与排位赛调整',
            '新内容发布与限时活动',
          ],
          statusNote: '卡片矩阵已实装',
        },
        {
          code: '03 · HEROES',
          name: 'HEROES',
          role: '支持英雄角色浏览与技能探索',
          elements: [
            '展示角色：NOVA、VESPER、RONIN',
            '同页角色背景与技能切换',
          ],
          statusNote: '三角色切换已实装',
        },
        {
          code: '04 · STORE',
          name: 'STORE',
          role: '区分版本获取、点数与道具入口',
          elements: [
            'Buy Game · Game Credits · Item Store',
            '分类入口选择反馈',
          ],
          statusNote: '入口层级已实装',
        },
        {
          code: '05 · ABOUT',
          name: 'ABOUT',
          role: '传达世界观背景与冲突设定',
          elements: [
            'The 2037 Collapse 核心设定',
            '边境冲突叙事与收尾探索引导',
          ],
          statusNote: '线上已实装',
        },
      ],
      websiteFlowsHeading:
        '四条核心网站浏览路径',
      websiteFlowsLead:
        '围绕访客的真实浏览任务设计四条核心路径，并明确区分线上已实现交互与概念阶段延伸步骤：',
      websiteFlows: [
        {
          id: 'flow-a',
          code: '路径 01 · 英雄探索',
          title: '浏览与切换英雄角色',
          path: [
            'HOME',
            'HEROES',
            '切换 NOVA / VESPER / RONIN',
            '查阅背景故事与技能说明',
          ],
          implementedStatus: '前端交互已实现',
          boundaryNote:
            '支持在同一板块内即时切换三位英雄，动态更新立绘、定位与技能描述。',
        },
        {
          id: 'flow-b',
          code: '路径 02 · 赛季资讯',
          title: '查阅赛季更新资讯',
          path: [
            'HOME',
            'NEWS',
            '扫读四类赛季卡片',
            '选择资讯条目',
          ],
          implementedStatus: '卡片已实装 · 独立文章页为概念延伸',
          boundaryNote:
            '四类赛季资讯卡片与悬停反馈已上线；独立长文详情路由属于后续扩展方向。',
        },
        {
          id: 'flow-c',
          code: '路径 03 · 商店浏览',
          title: '浏览商店分类入口',
          path: [
            'HOME',
            'STORE',
            '选择 Buy Game / Game Credits / Item Store',
          ],
          implementedStatus: '分类入口已实装 · 支付结算为概念延伸',
          boundaryNote:
            '清晰区分三类商店入口并提供选择状态反馈；概念站点不接入真实支付结算。',
        },
        {
          id: 'flow-d',
          code: '路径 04 · 世界观阅读',
          title: '阅读世界观并返回探索',
          path: [
            'HOME',
            'ABOUT',
            '阅读 The 2037 Collapse 设定',
            '通过收尾按钮返回探索',
          ],
          implementedStatus: '前端交互已实现',
          boundaryNote:
            '在页面尾部设置探索引导按钮，形成从背景阅读回到角色与商店探索的闭环。',
        },
      ],
      interfaceShowcase: {
        eyebrow: '官方概念网站真实界面展示',
        heading:
          '五大网站板块交互展示',
        description:
          '切换下方五大板块标签，查看各模块的界面截图、设计目标与核心 UI/UX 决策。',
        objectiveLabel: '设计目标',
        decisionsLabel: '关键 UI/UX 决策',
        enlargeLabel: '查看大图',
        closePreviewLabel: '关闭大图预览',
        openLiveSectionLabel: '访问线上网站 ↗',
        tabs: [
          {
            id: 'home',
            code: '01',
            sectionName: 'HOME',
            label: 'HOME',
            objective:
              '在首屏建立 5v5 英雄竞技 FPS 的品牌认知，并引导访客触发核心探索操作。',
            decisions: [
              '将大幅角色主视觉与高对比度 ZERO//LINE 大标题排版结合，在第一屏即时传达品类与战术基调。',
              '以暖金高亮突出 START GAME 主操作按钮，与顶部五板块全局导航栏形成清晰的主次层级。',
              '采用深炭绿基底（#202522）与克制的信息留白，兼顾角色立绘冲击力与标题文字可读性。',
            ],
            screenshotAlt:
              'ZERO//LINE 官方概念网站 HOME 板块首屏品牌主视觉与全局导航界面截图',
            missingScreenshotTitle:
              'HOME 板块实机截图槽位',
            missingScreenshotNote:
              '待置入 HOME 板块真实网页截图（首屏品牌认知、角色主视觉与 START GAME 主按钮）。',
          },
          {
            id: 'news',
            code: '02',
            sectionName: 'NEWS',
            label: 'NEWS',
            objective:
              '将赛季更新与活动资讯组织为层次分明、易于快速扫读的卡片系统。',
            decisions: [
              '围绕赛季更新（Season Update）、排位改动、新内容与限时活动四类核心资讯构建卡片布局。',
              '优化 Season Update 标题字重，并通过阶梯式卡片背景明度（#2B312E 至 #353C38）拉开卡片与基底的视觉层次。',
              '为资讯卡片配置暖金（#C6AD7D）悬停与焦点边框，引导回访玩家快速定位重点更新。',
            ],
            screenshotAlt:
              'ZERO//LINE 官方概念网站 NEWS 板块赛季更新标题排版与四类资讯卡片界面截图',
            missingScreenshotTitle:
              'NEWS 板块实机截图槽位',
            missingScreenshotNote:
              '待置入 NEWS 板块真实网页截图（Season Update 标题排版与四类赛季资讯卡片）。',
          },
          {
            id: 'heroes',
            code: '03',
            sectionName: 'HEROES',
            label: 'HEROES',
            objective:
              '支持在同一视图内切换浏览 NOVA、VESPER、RONIN 三位英雄的身份背景与技能机制。',
            decisions: [
              '提供 NOVA、VESPER、RONIN 三位展示角色的即时切换交互，无需跳转页面即可横向对比角色特征。',
              '将大幅角色立绘展示区与右侧身份定位、背景故事及技能说明面板分层排布，避免立绘遮挡核心文本。',
              '使用鼠尾草绿（#557E69）与暖金（#C6AD7D）高亮标识当前选中角色与技能状态。',
            ],
            screenshotAlt:
              'ZERO//LINE 官方概念网站 HEROES 板块 NOVA、VESPER、RONIN 角色切换与技能面板界面截图',
            missingScreenshotTitle:
              'HEROES 板块实机截图槽位',
            missingScreenshotNote:
              '待置入 HEROES 板块真实网页截图（NOVA、VESPER、RONIN 角色立绘与技能切换交互）。',
          },
          {
            id: 'store',
            code: '04',
            sectionName: 'STORE',
            label: 'STORE',
            objective:
              '清晰区分游戏本体购买、游戏点数与道具商店三类入口的信息分组与操作层级。',
            decisions: [
              '将商店板块拆分为 Buy Game、Game Credits、Item Store 三个独立入口模块。',
              '通过清晰的分类标题、内容说明与主次操作按钮层级，帮助访客快速理解各入口用途。',
              '提供各商店分类的选择交互反馈，同时保持概念网站不接入真实支付结算的清晰边界。',
            ],
            screenshotAlt:
              'ZERO//LINE 官方概念网站 STORE 板块 Buy Game、Game Credits、Item Store 三层入口界面截图',
            missingScreenshotTitle:
              'STORE 板块实机截图槽位',
            missingScreenshotNote:
              '待置入 STORE 板块真实网页截图（Buy Game、Game Credits、Item Store 信息分组与 CTA 层级）。',
          },
          {
            id: 'about',
            code: '05',
            sectionName: 'ABOUT',
            label: 'ABOUT',
            objective:
              '以舒适的编辑排版节奏呈现游戏世界观背景，并在阅读收尾处引导访客回流探索。',
            decisions: [
              '围绕 The 2037 Collapse 与边境冲突背景组织叙事段落，控制单行阅读宽度以提升长文可读性。',
              '通过深色表面层级与暖象牙白（#F1EEE5）正文对比，营造沉浸且不刺眼的世界观阅读体验。',
              '在世界观叙事末尾设置探索引导按钮，将访客自然引回角色或商店板块。',
            ],
            screenshotAlt:
              'ZERO//LINE 官方概念网站 ABOUT 板块世界观叙事与收尾探索引导界面截图',
            missingScreenshotTitle:
              'ABOUT 板块实机截图槽位',
            missingScreenshotNote:
              '待置入 ABOUT 板块真实网页截图（The 2037 Collapse 世界观叙事、排版与视觉节奏）。',
          },
        ],
      },
      relatedClientExploration: {
        badge: '关联背景练习',
        title: '早期 FPS 游戏客户端 Figma UI 练习说明',
        description:
          '在设计官方概念网站前，我曾在 Figma 中开展过局内客户端大厅 UI 练习，作为独立背景探索归档于此：',
        points: [
          '围绕大厅 PLAY 主匹配入口与次级工具导航开展了客户端界面布局练习。',
          '使用 Figma Components 与 Variants 构建了 9 英雄网格与 4 类定位筛选状态。',
        ],
      },
      iterationHeaders: {
        issue: '原有问题',
        change: '设计调整',
        result: '界面效果',
      },
      iterationItems: [
        {
          id: 'iter-01',
          code: '01',
          title: '赛季更新标题排版优化',
          issue:
            '早期 NEWS 板块中赛季更新标题与卡片正文字号、字重接近，快速浏览时缺乏视觉锚点。',
          change:
            '强化主标题字重与字号对比，并收紧标签与日期元信息的行距。',
          result:
            '访客进入 NEWS 后可第一时间捕捉赛季核心更新，正文摘要依然保持清晰易读。',
        },
        {
          id: 'iter-02',
          code: '02',
          title: '赛季资讯卡片视觉区分度提升',
          issue:
            '四类资讯卡片起初采用相近的深色背景，与 #202522 页面基底融合度过高。',
          change:
            '拉开卡片表面明度梯度（#2B312E 至 #353C38），并加入暖金 (#C6AD7D) 悬停与选中边框。',
          result:
            '赛季更新、排位改动、新内容与限时活动四类卡片边界清晰，交互反馈更直接。',
        },
        {
          id: 'iter-03',
          code: '03',
          title: '英雄角色展示构图调整',
          issue:
            'HEROES 板块中大幅角色立绘与技能描述文本存在视觉竞争，影响技能阅读。',
          change:
            '将 NOVA、VESPER、RONIN 的角色立绘舞台与右侧背景、技能信息面板做明确分区。',
          result:
            '既保留了角色立绘的视觉张力，又确保角色背景与技能说明在切换时清晰可读。',
        },
        {
          id: 'iter-04',
          code: '04',
          title: '导航栏与主次按钮层级优化',
          issue:
            '顶部板块导航链接与核心操作按钮起初视觉权重相近，主行动入口不够突出。',
          change:
            '以暖金高亮样式强化 START GAME 及核心商店入口按钮，同时收敛普通导航链接的装饰边框。',
          result:
            '浏览型导航与核心行动按钮层级分明，访客可直观识别下一步主操作。',
        },
        {
          id: 'iter-05',
          code: '05',
          title: '桌面端与移动端响应式布局打磨',
          issue:
            '多列英雄、资讯与商店卡片在窄屏视口下出现信息挤压与内边距失衡。',
          change:
            '重调响应式断点下的单列/双列折叠规则，优化移动端触控间距与字号缩放。',
          result:
            '五大板块在桌面端与移动端均保持一致的品牌氛围与舒适的阅读节奏。',
        },
      ],
      outcomesComparison: {
        completedHeading: '已完成交付成果',
        completedItems: [
          '部署上线可交互的官方概念网站（utopia-scarlet.github.io/ZERO-LINE）。',
          '完成 HOME、NEWS、HEROES、STORE、ABOUT 五大板块的信息架构与界面落地。',
          '实装 NOVA、VESPER、RONIN 三位英雄的角色切换、背景故事与技能说明展示。',
          '构建四类赛季更新资讯卡片与三层商店入口架构（Buy Game / Game Credits / Item Store）。',
          '建立深炭绿、鼠尾草绿与暖金品牌视觉规范，并完成桌面端与移动端响应式适配。',
        ],
        futureHeading: '未来优化方向',
        futureItems: [
          '为 NEWS 板块的赛季更新卡片补充独立的文章详情阅读视图。',
          '强化从 ABOUT 世界观与 NEWS 资讯向 HEROES、STORE 的上下文引导链接。',
          '邀请目标 FPS 玩家开展可用性走查，验证导航效率与商店分类理解度。',
          '扩充 HEROES 板块的可选角色数量与技能动态演示媒体。',
        ],
      },
      chapterDetails: {
        'cs-01': {
          chapterId: 'cs-01',
          tacticalTag: '01 · 项目概述',
          lead: 'ZERO//LINE 是一款原创 5v5 英雄竞技 FPS 游戏概念。我独立负责其官方概念网站的 UI/UX 设计与前端实现，构建兼具品牌辨识度与清晰信息架构的官方网站体验。',
          keyPoints: [],
          visualSlotTitle:
            '官方概念网站全景概览',
          visualSlotSpec:
            '展示线上概念网站 HOME、NEWS、HEROES、STORE、ABOUT 五大板块的整体页面视觉。',
        },
        'cs-02': {
          chapterId: 'cs-02',
          tacticalTag: '02 · 目标用户',
          lead: '不同于服务局内匹配队列的游戏客户端大厅，官方网站主要服务于初次了解游戏、查阅版本更新或浏览商店选项的三类访客：',
          keyPoints: [],
          visualSlotTitle:
            '三类访客场景与网站板块映射图',
          visualSlotSpec:
            '展示三类目标访客的核心任务如何对应至五大网站板块。',
        },
        'cs-03': {
          chapterId: 'cs-03',
          tacticalTag: '03 · 需求洞察',
          lead: '围绕“访客在官方概念网站中如何认识游戏、探索角色与查找更新”梳理出六项核心设计需求：',
          keyPoints: [],
          visualSlotTitle:
            '网站设计需求与信息优先级结构',
          visualSlotSpec:
            '梳理六项核心网站设计需求及其对应的界面层级策略。',
        },
        'cs-04': {
          chapterId: 'cs-04',
          tacticalTag: '04 · 问题定义',
          lead: '游戏官方网站需要在“营造强烈的世界观视觉氛围”与“提供清晰高效的信息浏览体验”之间取得平衡。',
          keyPoints: [],
          visualSlotTitle:
            '视觉冲击力与浏览可用性平衡框架',
          visualSlotSpec:
            '呈现角色立绘表现力、大标题排版与清晰信息层级之间的平衡关系。',
        },
        'cs-05': {
          chapterId: 'cs-05',
          tacticalTag: '05 · 竞品参考',
          lead: '同类英雄射击游戏的官方门户网站（如《VALORANT》与《Overwatch》官网）为角色展示、赛季资讯与商店入口设计提供了有价值的参考坐标。',
          keyPoints: [],
          visualSlotTitle:
            '同类英雄射击游戏官方网站参考对比（占位）',
          visualSlotSpec:
            '预留用于补充同类游戏官方网站截图对比与评估记录的视觉占位。',
        },
        'cs-06': {
          chapterId: 'cs-06',
          tacticalTag: '06 · 设计目标',
          lead: '基于核心问题定义，确立了指导全站版式、导航与交互设计的四项核心目标：',
          keyPoints: [],
          visualSlotTitle:
            '四大设计目标与网站模块映射图',
          visualSlotSpec:
            '展示四项设计目标如何落地至具体的导航栏、英雄切换、资讯卡片与商店入口。',
        },
        'cs-07': {
          chapterId: 'cs-07',
          tacticalTag: '07 · 信息架构',
          lead: '网站围绕五个一级导航板块组织内容，使访客能够在品牌认知、版本资讯、角色探索、商店入口与世界观背景之间顺畅切换。',
          keyPoints: [],
          visualSlotTitle:
            '五大板块网站信息架构图',
          visualSlotSpec:
            'HOME、NEWS、HEROES、STORE、ABOUT 五大板块及其子模块结构图。',
        },
        'cs-08': {
          chapterId: 'cs-08',
          tacticalTag: '08 · 用户流程',
          lead: '围绕角色探索、赛季资讯查阅、商店分类选择与世界观阅读设计四条核心浏览路径：',
          keyPoints: [],
          visualSlotTitle:
            '网站核心浏览路径图（实装交互与概念延伸）',
          visualSlotSpec:
            '标注四条浏览路径中的线上已实现前端交互与概念延伸节点。',
        },
        'cs-09': {
          chapterId: 'cs-09',
          tacticalTag: '09 · 视觉与设计系统',
          lead: '网站采用深炭绿（#202522）、鼠尾草绿（#557E69）与暖金（#C6AD7D）构建统一的品牌视觉系统，在烘托角色立绘氛围的同时确保界面文字清晰易读。',
          keyPoints: [],
          visualSlotTitle:
            '官方概念网站视觉系统与五大板块界面展示',
          visualSlotSpec:
            '汇总字体层级、品牌色板、英雄切换卡片与商店入口的高保真画面。',
        },
        'cs-10': {
          chapterId: 'cs-10',
          tacticalTag: '10 · 原型与迭代',
          lead: '在前端实现与多端浏览器走查过程中，围绕字体排版、卡片对比度、角色立绘构图与响应式布局完成了五项关键迭代：',
          keyPoints: [],
          visualSlotTitle:
            '网站关键迭代前后对比展示',
          visualSlotSpec:
            '展示赛季卡片明度、标题排版层级与移动端响应式适配的迭代对比。',
        },
        'cs-11': {
          chapterId: 'cs-11',
          tacticalTag: '11 · 成果与反思',
          lead: '项目最终交付了可在线交互访问的官方概念网站，并明确了后续在内容纵深与真实用户验证上的改进方向。',
          keyPoints: [],
          visualSlotTitle:
            'ZERO//LINE 官方概念网站上线成果展示',
          visualSlotSpec:
            '线上概念网站（utopia-scarlet.github.io/ZERO-LINE）桌面端与移动端实机呈现。',
        },
      },
    },
    loveStoryExperience: {
      navigation: {
        storyThreadAria: 'LoveStory 六幕故事线索导航',
        progressLabel: '故事线索 · Story Thread',
        mobileSceneSelectLabel: '故事章节',
        openingBoundaryNote:
          '连续金线叙事轴 · LS-02 手写体 LoveStory 开幕动画预留锚点',
      },
      scenes: [
        {
          id: 'ls-scene-01',
          number: '01',
          shortLabel: '故事缘起',
          title: '故事缘起与记忆空间',
          kicker: 'Scene 01 · Dark Archive 暗色档案',
          surfaceTheme: 'dark-archive',
          summary:
            '项目创作初衷、双人交互式数字记忆档案馆定位与真实功能边界。',
        },
        {
          id: 'ls-scene-02',
          number: '02',
          shortLabel: '需求洞察',
          title: '理解真实记录需求',
          kicker: 'Scene 02 · Paper & Ink 纸张与墨迹',
          surfaceTheme: 'paper-ink',
          summary:
            '将真实双人记录场景中的用户需求映射至设计需求、界面决策与视觉证据。',
        },
        {
          id: 'ls-scene-03',
          number: '03',
          shortLabel: '体验连接',
          title: '连接时间、地点与记忆',
          kicker: 'Scene 03 · Paper & Ink 纸张与墨迹',
          surfaceTheme: 'paper-ink',
          summary:
            '串联 Moments、Timeline、Memory Map、Private Archive 与 Future Plans 的有机记忆星图。',
        },
        {
          id: 'ls-scene-04',
          number: '04',
          shortLabel: '核心体验',
          title: '沉浸式记忆档案体验',
          kicker: 'Scene 04 · Dark Archive 暗色档案',
          surfaceTheme: 'dark-archive',
          summary:
            '承载相册画廊、时间轴、记忆地图与私密档案交互展示的暗色档案展台。',
        },
        {
          id: 'ls-scene-05',
          number: '05',
          shortLabel: '视觉与交互',
          title: '双境视觉与交互系统',
          kicker: 'Scene 05 · Paper & Ink + Dark Archive',
          surfaceTheme: 'paper-ink',
          summary:
            '暗色档案与纸墨双主题色板、衬线×无衬线字体层级、移动端全屏分组表单与四态反馈。',
        },
        {
          id: 'ls-scene-06',
          number: '06',
          shortLabel: '落地与演进',
          title: '工程实现与未来演进',
          kicker: 'Scene 06 · Dark Archive 暗色档案',
          surfaceTheme: 'dark-archive',
          summary:
            '前端 + FastAPI / SQLite 架构落地、基于真实使用反馈的体验迭代与后续规划。',
        },
      ],
      scene01Story: {
        eyebrow: '03 · 交互式数字记忆档案馆案例研究',
        title: 'LoveStory',
        positioningLead:
          '专为两个人设计的交互式数字记忆档案馆——在时间与空间维度珍藏共同记忆、规划未来心愿，并守护私密记录内容。',
        narrativeBody:
          '日常聊天记录与通用云相册往往将共同经历打散在嘈杂的时间流里。LoveStory 以“一根连续延伸的记忆金线”为核心意象，结合 Web 前端与 FastAPI / SQLite 后端，构建了一个安静、克制的双人数字空间，让照片时刻（Moments）、时间轴（Timeline）、记忆地图（Memory Map）、未来计划（Future Plans）与私密档案（Private Archive）自然相连。',
        liveCtaLabel: '访问线上档案馆',
        metadata: [
          {
            label: '个人职责',
            value: 'UI/UX 设计、双主题视觉系统与前端持续迭代',
          },
          {
            label: '项目周期',
            value: '2026.08 – 至今',
          },
          {
            label: '技术架构',
            value: 'Web 前端 + FastAPI / SQLite 后端',
          },
          {
            label: '当前范围',
            value: '核心档案流已上线 · 部分拓展模块处于原型 / 规划阶段',
          },
        ],
        heroStageLabel:
          'LoveStory — Dark Archive 共享记忆空间与核心画廊主展台',
        heroStageSubnote:
          '预留用于承载 Moments 画廊、Timeline 时间轴、Memory Map 记忆地图与移动端分组表单的真实产品画面展台。',
        scopeTransparencyNote:
          '项目范围说明：LoveStory 是一个持续演进中的真实个人项目。共享空间加入、记忆创建、相册浏览、时间轴导航与私密权限提示已完成落地；空间地图联动与纪念日提醒等拓展能力包含原型与规划阶段内容。',
      },
      scene02Needs: {
        lead: '为两个人设计共同的记忆档案馆，远不止于上传图片。每一项界面决策都源自真实使用情境中的具体痛点，并转化为清晰的设计要求：',
        explorerSlotBadge: '需求探索器基础架构 · Requirements Explorer',
        explorerSlotNote:
          '建立“用户需求 → 设计要求 → 界面决策 → 视觉证据”四维映射结构，为后续交互式需求探索器奠定版式基础。',
        columnLabels: {
          userNeed: '真实用户需求',
          requirement: '核心设计要求',
          decision: '界面与交互决策',
          evidence: '产品视觉证据槽位',
        },
        items: [
          {
            id: 'need-01',
            number: '01',
            needTitle: '双人空间配对与共享内容可见性确认',
            userContext:
              '当两个人通过邀请码绑定共同空间后，双方需要立即确认当前所处的空间状态，以及新创建的记录是否对伴侣可见。',
            designRequirement:
              '建立明确的邀请配对流程与共享可见性状态提示，避免一方创建的记忆在另一方账号下“隐形”。',
            designDecision:
              '在 Profile, Accounts & Invitations 与创建入口增设清晰的空间绑定与可见性标识，直接响应实际使用中发现的“共享内容不可见”问题。',
            evidenceSlotLabel:
              '共享空间加入流程与可见性状态提示视觉证据槽位',
          },
          {
            id: 'need-02',
            number: '02',
            needTitle: '跨越时间与地点维度的记忆回溯',
            userContext:
              '人们回忆共同经历时，既会按时间寻找（“去年秋天”），也会按地点寻找（“海边那次旅行”），单一照片网格难以满足双维检索。',
            designRequirement:
              '在不增加繁琐后台感控件的前提下，将相册浏览与 Timeline 时间节点、Memory Map 地理坐标有机串联。',
            designDecision:
              '围绕统一的日期、地点与故事元数据构建 Moments、Timeline 与 Memory Map 的跨视图连接。',
            evidenceSlotLabel:
              'Moments 画廊、Timeline 时间轴与 Memory Map 联动槽位',
          },
          {
            id: 'need-03',
            number: '03',
            needTitle: '普通共享记录与私密档案（Private Archive）的边界区分',
            userContext:
              '即使在双人空间内，日常相册记录与更具私密性的信件、心愿或受保护内容依然需要清晰的视觉与权限边界。',
            designRequirement:
              '在入口层级与内容卡片上提供克制但明确的权限视觉提示，清晰区分普通共享记录与 Private Archive。',
            designDecision:
              '为 Private Archive 设定独立的锁定标识、权限提示与深色沉浸画框，让用户随时感知当前所处的隐私层级。',
            evidenceSlotLabel:
              '共享记录与 Private Archive 权限边界视觉提示槽位',
          },
          {
            id: 'need-04',
            number: '04',
            needTitle: '移动端的随时记录与多状态容错反馈',
            userContext:
              '大量真实记忆发生在旅途或日常瞬间，手机端若直接照搬桌面端窄侧边栏会导致输入局促、保存按钮被遮挡。',
            designRequirement:
              '将桌面端编辑能力重构为契合移动端单手操作的表单流，并清晰区分加载、空状态、失败与正常内容四类状态。',
            designDecision:
              '将桌面端侧边栏编辑转化为分组式全屏移动端表单，配备底部固定保存栏，并为网络或接口异常提供明确的重试入口。',
            evidenceSlotLabel:
              '桌面端侧边栏至移动端全屏分组表单适配视觉槽位',
          },
        ],
      },
      scene03Connections: {
        lead: '不同于传统后台管理系统的树状方框图，LoveStory 以“Our World（共同空间）”为圆心，将八大功能模块通过连续的记忆金线连接成有机整体：',
        constellationTitle: '有机记忆星图 · Connected Memory Constellation',
        constellationSubnote:
          '连接 Our World、Moments、Timeline、Memory Map、Future Plans、Anniversary Countdown、Private Archive 与 Profile & Invitations 的信息架构基底。',
        hubLabel: 'Our World',
        hubSublabel: '双人共享空间核心枢纽',
        statusLegend: {
          implemented: '已实装落地',
          prototype: '原型阶段',
          planned: '规划演进',
        },
        modules: [
          {
            id: 'mod-moments',
            name: 'Moments / Memory Gallery',
            nameSub: '记忆画廊与相册',
            roleDescription:
              '核心视觉画廊，用于浏览共同照片、故事记录与精选相册，采用中性暗框保护照片原始色彩。',
            statusBadge: '已实装落地',
            statusTone: 'implemented',
            connectedTo: ['Timeline', 'Memory Map', 'Our World'],
          },
          {
            id: 'mod-timeline',
            name: 'Timeline',
            nameSub: '时间轴脉络',
            roleDescription:
              '按年月与关键节点串联共同经历的时间流，统一事件日期归一化与排序逻辑。',
            statusBadge: '已实装落地',
            statusTone: 'implemented',
            connectedTo: ['Moments / Memory Gallery', 'Anniversary Countdown'],
          },
          {
            id: 'mod-map',
            name: 'Memory Map',
            nameSub: '记忆足迹地图',
            roleDescription:
              '将记忆记录映射至真实地理位置，支持按地点回溯共同走过的城市与足迹。',
            statusBadge: '原型阶段',
            statusTone: 'prototype',
            connectedTo: ['Moments / Memory Gallery', 'Timeline'],
          },
          {
            id: 'mod-private',
            name: 'Private Archive',
            nameSub: '私密档案馆',
            roleDescription:
              '带有明确权限提示与访问边界的私密记录空间，将受保护内容与日常相册清晰分离。',
            statusBadge: '已实装 · 持续迭代',
            statusTone: 'implemented',
            connectedTo: ['Our World', 'Profile, Accounts & Invitations'],
          },
          {
            id: 'mod-plans',
            name: 'Future Plans',
            nameSub: '未来共同心愿与计划',
            roleDescription:
              '记录未来想一起完成的旅行与心愿清单，完成后可转化为归档记忆。',
            statusBadge: '原型阶段',
            statusTone: 'prototype',
            connectedTo: ['Our World', 'Anniversary Countdown'],
          },
          {
            id: 'mod-anniversary',
            name: 'Anniversary Countdown',
            nameSub: '纪念日倒计时',
            roleDescription:
              '追踪重要纪念日与周期性节点，与 Timeline 时间轴形成过去与未来的呼应。',
            statusBadge: '规划 / 原型',
            statusTone: 'planned',
            connectedTo: ['Timeline', 'Future Plans'],
          },
          {
            id: 'mod-profile',
            name: 'Profile, Accounts & Invitations',
            nameSub: '账号、邀请配对与权限',
            roleDescription:
              '管理账号登录、伴侣邀请码绑定以及共享空间的可见性默认配置。',
            statusBadge: '已实装落地',
            statusTone: 'implemented',
            connectedTo: ['Our World', 'Private Archive'],
          },
        ],
        pathwaysHeading: '四条核心串联用户路径',
        pathways: [
          {
            id: 'flow-01',
            code: '路径 A',
            title: '共享空间配对与可见性确认路径',
            stepsSummary:
              '账号登录 → 发送/接受伴侣邀请码 → 进入 Our World 共享空间 → 校验双人记录同步可见状态',
            scopeNote:
              '已实装落地，并针对跨账号共享内容不可见问题完成了专项修复。',
          },
          {
            id: 'flow-02',
            code: '路径 B',
            title: '创建与编辑记忆路径（桌面侧边栏 vs 移动端全屏分组表单）',
            stepsSummary:
              '点击创建记忆 → 上传照片与故事文字 → 设定日期、地点与可见权限（共享 / 私密） → 底部固定保存栏提交',
            scopeNote:
              '已实装落地桌面至移动端的响应式表单结构重构。',
          },
          {
            id: 'flow-03',
            code: '路径 C',
            title: 'Moments × Timeline × Memory Map 跨维浏览路径',
            stepsSummary:
              '浏览 Moments 记忆画廊 → 跳转至 Timeline 对应时间节点 → 在 Memory Map 查看地点坐标上下文',
            scopeNote:
              '画廊与时间轴联动已实装；地图空间坐标联动处于原型深化阶段。',
          },
          {
            id: 'flow-04',
            code: '路径 D',
            title: 'Private Archive 权限边界与异常恢复路径',
            stepsSummary:
              '进入 Private Archive → 识别权限视觉提示 → 浏览正常 / 空状态 / 加载中 / 失败重试状态',
            scopeNote:
              '已实装权限提示与四态界面反馈机制。',
          },
        ],
      },
      scene04Memories: {
        lead: '在 Dark Archive（#10110F）暗色档案场景中，界面边框退隐为柔和的暖墨色与细金线，让照片本身的色彩与故事成为视觉中心。',
        stageBadge: 'Dark Archive 核心产品体验展台',
        stageSubnote:
          '具备充足留白与大画幅比例的产品展示基底，预留用于承载真实界面截图与交互式演示。',
        primaryStage: {
          id: 'stage-moments-timeline',
          code: '展台 01 · 核心档案流',
          title: 'Moments 记忆画廊与 Timeline 时间轴',
          subtitle: '保护原片色彩的暗色相框（#20211E）与连续金线时间节点',
          statusBadge: '已实装核心流程',
          description:
            '在无色偏的中性深色画框（#171815 / #20211E）中呈现摄影与文字记录，并将相册浏览与按时间排序的 Timeline 脉络直接相连。',
          visualFrameLabel:
            'Moments 画廊与 Timeline 时间轴主视觉展台',
          visualFrameSpec:
            '承载 Moments 相册视图、记忆详情浮层与 Timeline 时间流的核心展示区域。',
        },
        supportingStages: [
          {
            id: 'stage-map-plans',
            code: '展台 02 · 时间 × 空间',
            title: 'Memory Map 记忆地图与 Future Plans 未来计划',
            subtitle: '连接过去足迹坐标与未来共同心愿',
            statusBadge: '原型拓展模块展台',
            description:
              '将地图上的地点标记与时间轴节点、未来旅行清单串联，让“计划去的地方”自然延续为“共同留下的记忆”。',
            visualFrameLabel:
              'Memory Map 与 Future Plans 视觉展台',
            visualFrameSpec:
              '展示地理足迹坐标与未来心愿卡片的次级产品展台。',
          },
          {
            id: 'stage-private-mobile',
            code: '展台 03 · 隐私边界与移动端记录',
            title: 'Private Archive 私密档案与移动端全屏分组表单',
            subtitle: '清晰权限提示与单手友好的移动端编辑体验',
            statusBadge: '已实装交互适配',
            description:
              '对比展示带有权限标识的 Private Archive 空间，以及由桌面端侧边栏重构而成的移动端全屏分组表单与底部保存操作栏。',
            visualFrameLabel:
              'Private Archive 与移动端全屏表单展台',
            visualFrameSpec:
              '展示私密档案权限提示与桌面/移动端编辑布局对比的次级产品展台。',
          },
        ],
      },
      scene05System: {
        lead: 'LoveStory 的设计语言建立在两套互补的界面材质之上：用于沉浸式看图的 Dark Archive（暗色档案），以及用于平静阅读与编辑的 Paper & Ink（纸张与墨迹）。',
        dualSurfaceHeading: '双境色彩系统 · Dark Archive & Paper & Ink',
        dualSurfaceLead:
          '两套主题均采用低饱和度的暖灰与纸墨底色，避免高饱和背景对用户原始照片造成色偏干扰。',
        darkArchiveCard: {
          badge: 'Dark Archive · 沉浸式档案视图',
          title: '暖曜黑、羊皮纸白与细金线',
          description:
            '应用于主相册画廊、时间轴沉浸浏览与私密档案视图，让摄影画面在深色背景中自然浮现。',
          tokensPreview: [
            { name: '--archive-bg', hex: '#10110F', usage: '暗色档案主画布' },
            { name: '--archive-surface', hex: '#171815', usage: '档案层叠容器表面' },
            { name: '--archive-photo-frame', hex: '#20211E', usage: '无色偏中性照片衬框' },
            { name: '--archive-text', hex: '#E8E3D8', usage: '暖羊皮纸主文字' },
            { name: '--archive-gold', hex: '#B79A62', usage: '连续叙事金线与激活节点' },
            { name: '--archive-danger', hex: '#A47C69', usage: '克制的异常提示与重试强调色' },
          ],
        },
        paperInkCard: {
          badge: 'Paper & Ink · 叙事阅读与分析视图',
          title: '暖调档案纸张与深碳墨迹',
          description:
            '应用于故事阅读、需求梳理与结构化表单编辑，通过纤细墨线分割信息层级。',
          tokensPreview: [
            { name: '--bg', hex: '#F3EFE7', usage: '暖调档案纸张背景' },
            { name: '--bg-deep', hex: '#EAE5DA', usage: '内嵌纸槽与分组底色' },
            { name: '--warm-white', hex: '#F5F1EB', usage: '抬升纸页表面' },
            { name: '--dark / --ink', hex: '#111111', usage: '高对比主墨色正文' },
            { name: '--muted', hex: '#8B8883', usage: '次级元数据与图注说明' },
          ],
        },
        typographyHeading: '叙事衬线标题 × 功能无衬线正文',
        typographySerifLabel: '叙事衬线体（Editorial Serif） — 记忆标题、纪念日期与章节导语',
        typographySerifSample: '每一处共同走过的风景，都在时间里留下了安静的坐标。',
        typographySerifNote:
          '具有人文气息的衬线标题赋予日期、记忆名称与故事章节纸质纪念册般的温度。',
        typographySansLabel: '功能无衬线体（Operational Sans） — 导航控件、权限标签与表单输入',
        typographySansSample: '共享空间 · 伴侣可见 · 已同步至 Timeline 时间轴',
        typographySansNote:
          '干净利落的无衬线界面字体确保权限提示、筛选按钮、移动端表单输入与错误恢复提示一目了然。',
        interactionAdaptationHeading: '响应式适配与四态容错交互规范',
        interactionAdaptationLead:
          '不将桌面端侧边栏生硬缩小塞入手机屏幕，而是针对真实记录场景重构移动端交互与状态反馈：',
        adaptationPoints: [
          {
            title: '桌面端侧边栏 → 移动端全屏分组式表单',
            detail:
              '在小屏设备上将多字段编辑抽屉重构为全屏分组表单，并配备底部固定保存栏，降低单手输入阻力。',
          },
          {
            title: '保护照片原色的浅/深色层级',
            detail:
              '不在用户照片上方叠加彩色遮罩，通过中性相框（#20211E / #F5F1EB）与 1px 细线构建视觉秩序。',
          },
          {
            title: '共享与私密权限的双重视觉锚点',
            detail:
              '在创建入口与内容卡片头部同步展示可见性标识，消除“谁能看到这条记录”的心理不确定感。',
          },
        ],
        stateSystemHeading: '四类界面状态反馈体系',
        stateItems: [
          {
            stateName: '加载中状态（Loading）',
            behavior:
              '保持照片比例的柔和骨架占位，避免图片加载完成时发生页面跳动。',
          },
          {
            stateName: '空状态（Empty）',
            behavior:
              '提供富有温度的引导文案，引导伴侣创建第一条共同记忆或完成空间配对。',
          },
          {
            stateName: '失败状态（Failure）',
            behavior:
              '以直白语言说明原因并提供即时重试入口（--archive-danger #A47C69）。',
          },
          {
            stateName: '正常内容状态（Normal）',
            behavior:
              '克制纯净的照片与故事排版，辅以统一的日期与权限提示。',
          },
        ],
      },
      scene06Built: {
        lead: 'LoveStory 基于 Web 前端与 FastAPI / SQLite 后端构建。在真实使用过程中暴露出的跨账号与时间排序问题，直接推动了产品的关键体验迭代：',
        architectureHeading: '前后端工程架构落地',
        architectureSummary:
          '前端界面通过 REST 接口与 FastAPI / SQLite 后端协同工作，支撑账号会话、伴侣空间邀请配对、记忆增删改查以及共享/私密可见性过滤。',
        iterationsHeading: '基于真实使用反馈的三项核心迭代',
        iterations: [
          {
            code: '迭代 01 · 共享可见性修复',
            title: '解决跨账号下“共享记忆不可见”的可见性断层',
            feedbackTrigger:
              '在实际双人使用中发现，一方创建的记忆记录有时在伴侣账号下无法显示，源于空间绑定状态与默认可见性提示不够明确。',
            designResponse:
              '重构共享空间状态指示器与创建时的“共享 / 私密”默认高亮逻辑，确保双方在配对空间内稳定看到同步内容。',
          },
          {
            code: '迭代 02 · 时间轴一致性',
            title: '统一 Timeline 时间轴与 Moments 画廊的时序显示逻辑',
            feedbackTrigger:
              '不同记录的创建时间戳与实际事件发生日期混用，曾导致相册画廊与时间轴视图的排列顺序不一致。',
            designResponse:
              '统一以事件日期作为时间轴分组基准并规范日期格式展示，使 Timeline 节点与 Moments 相册保持严密的时序一致。',
          },
          {
            code: '迭代 03 · 移动端编辑重构',
            title: '将桌面端侧边栏编辑重构为移动端全屏分组表单',
            feedbackTrigger:
              '在手机屏幕上使用狭窄的侧边栏编辑长文本与多张图片时，滚动冲突明显且保存操作容易被键盘遮挡。',
            designResponse:
              '针对移动端设计了全屏分组式编辑表单与底部固定保存操作栏，显著提升了移动场景下的记录顺畅度。',
          },
        ],
        boundariesHeading: '真实交付边界与下一步演进计划',
        implementedListTitle: '已落地并在线运行的能力',
        implementedItems: [
          '共享空间注册登录、伴侣邀请码配对与空间状态确认流程。',
          '记忆创建、相册画廊浏览与 Timeline 时间轴导航。',
          '区分普通共享记录与 Private Archive 私密内容的权限视觉提示。',
          'Dark Archive 与 Paper & Ink 双境视觉系统及原片色彩保护相框。',
          '桌面至移动端全屏分组表单适配，以及加载/空/失败/正常四态反馈。',
        ],
        plannedListTitle: '原型深化与未来规划方向',
        plannedItems: [
          '深化 Timeline 时间轴滚动与 Memory Map 地图坐标标记的双向交互联动。',
          '完善 Future Plans 未来心愿在达成后一键转化为 Moments 归档记忆的闭环流程。',
          '扩展 Anniversary Countdown 纪念日提醒与批量照片上传的进度反馈体验。',
        ],
        closingReflection:
          '独立设计与迭代 LoveStory 的过程让我切身体会到：越是承载情感与私密记忆的产品，越依赖底层的确定性与秩序感——清晰的权限边界、稳定的时间排序与可靠的错误恢复，才是让珍贵记忆得以安心留存的基石。',
      },
    },
  },
}
