import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import { LanguageSwitcher } from '../navigation/LanguageSwitcher'
import { PortraitSubjectGraphic } from '../hero/PortraitLayer'
import { ProjectIndex } from './ProjectIndex'
import { CaseStudyView } from './CaseStudyView'
import { ZeroLineCaseStudy } from './ZeroLineCaseStudy'
import { ZeroLineBreakTransition } from './ZeroLineBreakTransition'
import { LoveStoryStandalonePage } from './LoveStoryStandalonePage'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  BoxesIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  CompassIcon,
  FolderKanbanIcon,
  Gamepad2Icon,
  GraduationCapIcon,
  HeartIcon,
  LayoutDashboardIcon,
  MailIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  WrenchIcon,
  type IconProps,
} from '../icons/WorkspaceIcons'
import {
  CONTACT_CONFIG,
  PROJECT_IDS,
  isProjectDestination,
  type ProjectId,
  type ResumeSectionId,
  type WorkspaceDestination,
} from '../../data/portfolioData'
import {
  REDUCED_MOTION_TRANSITION,
  SHARED_LAYOUT_TRANSITION,
} from '../../config/motionConfig'

interface PortfolioWorkspaceProps {
  initialDestination: WorkspaceDestination
  onDestinationChange?: (
    destination: WorkspaceDestination,
    replaceHistory?: boolean
  ) => void
  onReturnToLanding: () => void
  isTransitioning: boolean
  prefersReducedMotion: boolean
}

const RESUME_SECTION_IDS: ReadonlyArray<ResumeSectionId> = [
  'overview',
  'education',
  'experience',
  'skills',
  'additional-projects',
  'honours',
  'contact',
]

const RESUME_SECTION_ICON_MAP: Record<ResumeSectionId, React.FC<IconProps>> = {
  overview: LayoutDashboardIcon,
  education: GraduationCapIcon,
  experience: BriefcaseBusinessIcon,
  skills: WrenchIcon,
  'additional-projects': BoxesIcon,
  honours: AwardIcon,
  contact: MailIcon,
}

const PROJECT_ICON_MAP: Record<ProjectId, React.FC<IconProps>> = {
  'bridgework-au': CompassIcon,
  'zero-line': Gamepad2Icon,
  lovestory: HeartIcon,
}

interface CollapsedTooltipState {
  label: string
  top: number
}

interface SavedResumeScrollState {
  section: ResumeSectionId
  scrollTop: number
  experienceSub: 'projects' | 'work'
}

export const PortfolioWorkspace: React.FC<PortfolioWorkspaceProps> = ({
  initialDestination,
  onDestinationChange,
  onReturnToLanding,
  isTransitioning,
  prefersReducedMotion,
}) => {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const [activeNav, setActiveNav] = useState<WorkspaceDestination>(initialDestination)
  const [activeExperienceSub, setActiveExperienceSub] = useState<'projects' | 'work'>('projects')
  const [activeChapterId, setActiveChapterId] = useState<string>(
    initialDestination === 'lovestory' ? 'ls-scene-01' : 'cs-01'
  )
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const [collapsedTooltip, setCollapsedTooltip] =
    useState<CollapsedTooltipState | null>(null)
  const [isZeroLineBreakActive, setIsZeroLineBreakActive] =
    useState<boolean>(false)
  const [isLoveStoryIntroActive, setIsLoveStoryIntroActive] =
    useState<boolean>(false)

  const sidebarRef = useRef<HTMLElement | null>(null)
  const mainScrollRef = useRef<HTMLDivElement | null>(null)
  const savedResumeStateRef = useRef<SavedResumeScrollState>({
    section: 'experience',
    scrollTop: 0,
    experienceSub: 'projects',
  })
  const pendingRestoreScrollRef = useRef<number | null>(null)

  const layoutTransition = prefersReducedMotion
    ? REDUCED_MOTION_TRANSITION
    : SHARED_LAYOUT_TRANSITION

  const isProjectView = isProjectDestination(activeNav)
  const isZeroLineWorld = activeNav === 'zero-line'
  const isLoveStoryWorld = activeNav === 'lovestory'

  // Clear tooltip whenever sidebar expands
  useEffect(() => {
    if (!isSidebarCollapsed) {
      setCollapsedTooltip(null)
    }
  }, [isSidebarCollapsed])

  const showCollapsedTooltip = useCallback(
    (label: string, target: HTMLElement) => {
      if (!isSidebarCollapsed || !sidebarRef.current) return
      const sidebarRect = sidebarRef.current.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const top = targetRect.top - sidebarRect.top + targetRect.height / 2
      setCollapsedTooltip({ label, top })
    },
    [isSidebarCollapsed]
  )

  const hideCollapsedTooltip = useCallback(() => {
    setCollapsedTooltip(null)
  }, [])

  /**
   * Scrolls ONLY the right main content scroll container (.workspace-scroll-viewport)
   * on desktop (> 860px) rather than calling element.scrollIntoView(), preventing
   * ancestor or browser window scroll jumps and ensuring chapter headings sit
   * cleanly below the stationary Workspace topbar.
   */
  const scrollToElementById = useCallback(
    (elementId: string, smooth = true) => {
      requestAnimationFrame(() => {
        const container = mainScrollRef.current
        const el = document.getElementById(elementId)
        if (!el) return

        const isDesktopFixedShell =
          typeof window !== 'undefined' &&
          window.matchMedia('(min-width: 861px)').matches

        if (container && isDesktopFixedShell) {
          if (elementId === 'section-overview') {
            container.scrollTo({
              top: 0,
              behavior: !smooth || prefersReducedMotion ? 'auto' : 'smooth',
            })
          } else {
            const containerRect = container.getBoundingClientRect()
            const topbarEl =
              container.parentElement?.querySelector('.workspace-topbar')
            const visibleTopEdge = topbarEl
              ? Math.max(
                  containerRect.top,
                  topbarEl.getBoundingClientRect().bottom
                )
              : containerRect.top

            const headerTarget = elementId.startsWith('cs-chapter-')
              ? (el.querySelector(
                  '.zl-chapter-header, .ls-scene-header'
                ) as HTMLElement | null) ?? el
              : el

            const targetRect = headerTarget.getBoundingClientRect()
            const scrollMarginTop = elementId.startsWith('cs-chapter-') ? 36 : 24

            const targetTop = Math.max(
              0,
              container.scrollTop +
                (targetRect.top - visibleTopEdge) -
                scrollMarginTop
            )
            container.scrollTo({
              top: targetTop,
              behavior: !smooth || prefersReducedMotion ? 'auto' : 'smooth',
            })
          }

          if (window.scrollY !== 0) {
            window.scrollTo({ top: 0, behavior: 'auto' })
          }
        } else {
          const topbarEl = document.querySelector('.workspace-topbar')
          const stickyTopbarHeight = topbarEl
            ? topbarEl.getBoundingClientRect().height
            : 64
          const headerTarget = elementId.startsWith('cs-chapter-')
            ? (el.querySelector(
                '.zl-chapter-header, .ls-scene-header'
              ) as HTMLElement | null) ?? el
            : el
          const targetWindowTop = Math.max(
            0,
            window.scrollY +
              headerTarget.getBoundingClientRect().top -
              stickyTopbarHeight -
              28
          )
          window.scrollTo({
            top: targetWindowTop,
            behavior: !smooth || prefersReducedMotion ? 'auto' : 'smooth',
          })
        }
      })
    },
    [prefersReducedMotion]
  )

  // Save current Resume scroll position before entering a Case Study
  const saveCurrentResumePosition = useCallback(() => {
    if (!isProjectDestination(activeNav)) {
      const currentScroll = mainScrollRef.current?.scrollTop ?? window.scrollY
      savedResumeStateRef.current = {
        section: activeNav,
        scrollTop: currentScroll,
        experienceSub: activeExperienceSub,
      }
    }
  }, [activeNav, activeExperienceSub])

  /**
   * Open a Project Case Study via intentional user interaction.
   * When opening `zero-line` from another view, trigger the "BREAK THE LINE"
   * cinematic entry transition while mounting the ZERO//LINE world underneath.
   */
  const handleOpenProject = useCallback(
    (projectId: ProjectId) => {
      if (isZeroLineBreakActive) return

      saveCurrentResumePosition()
      if (projectId === 'zero-line' && activeNav !== 'zero-line') {
        setIsZeroLineBreakActive(true)
      } else {
        setIsZeroLineBreakActive(false)
      }

      if (projectId === 'lovestory' && activeNav !== 'lovestory') {
        setIsLoveStoryIntroActive(true)
      } else if (projectId !== 'lovestory') {
        setIsLoveStoryIntroActive(false)
      }

      setActiveNav(projectId)
      setActiveChapterId(projectId === 'lovestory' ? 'ls-scene-01' : 'cs-01')
      setCollapsedTooltip(null)
      onDestinationChange?.(projectId, false)

      requestAnimationFrame(() => {
        if (mainScrollRef.current) {
          mainScrollRef.current.scrollTo({ top: 0, behavior: 'auto' })
        }
        if (window.scrollY !== 0) {
          window.scrollTo({ top: 0, behavior: 'auto' })
        }
      })
    },
    [activeNav, isZeroLineBreakActive, onDestinationChange, saveCurrentResumePosition]
  )

  const handleCompleteZeroLineBreak = useCallback(() => {
    setIsZeroLineBreakActive(false)
  }, [])

  const handleCompleteLoveStoryIntro = useCallback(() => {
    setIsLoveStoryIntroActive(false)
  }, [])

  // Return from Case Study to Resume and restore previous section & scroll position
  const handleBackToResume = useCallback(() => {
    setIsZeroLineBreakActive(false)
    setIsLoveStoryIntroActive(false)
    const saved = savedResumeStateRef.current
    setActiveNav(saved.section)
    setActiveExperienceSub(saved.experienceSub)
    setCollapsedTooltip(null)
    pendingRestoreScrollRef.current = saved.scrollTop
    onDestinationChange?.(saved.section, false)
  }, [onDestinationChange])

  // Restore saved scrollTop once Resume DOM mounts after leaving a Case Study
  useEffect(() => {
    if (!isProjectView && pendingRestoreScrollRef.current !== null) {
      const targetScroll = pendingRestoreScrollRef.current
      const applyScroll = () => {
        const isDesktopFixedShell =
          typeof window !== 'undefined' &&
          window.matchMedia('(min-width: 861px)').matches
        if (isDesktopFixedShell && mainScrollRef.current) {
          mainScrollRef.current.scrollTo({
            top: targetScroll,
            behavior: 'auto',
          })
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'auto' })
        }
      }

      requestAnimationFrame(applyScroll)
      const clearTimer = window.setTimeout(() => {
        applyScroll()
        pendingRestoreScrollRef.current = null
      }, 90)
      return () => window.clearTimeout(clearTimer)
    }
  }, [isProjectView])

  // Navigate to a resume section or project destination from the sidebar
  const handleSelectNav = (dest: WorkspaceDestination) => {
    if (isProjectDestination(dest)) {
      handleOpenProject(dest)
      return
    }

    setIsZeroLineBreakActive(false)
    const wasProjectView = isProjectDestination(activeNav)
    setActiveNav(dest)
    if (dest === 'experience') {
      setActiveExperienceSub('projects')
    }
    onDestinationChange?.(dest, !wasProjectView)
    scrollToElementById(`section-${dest}`, !wasProjectView)
  }

  // Navigate directly to a subsection inside Experience (Projects or Work Experience)
  const handleJumpToSubsection = (
    sectionId: ResumeSectionId,
    targetElementId: string,
    subType?: 'projects' | 'work'
  ) => {
    setIsZeroLineBreakActive(false)
    const wasProjectView = isProjectDestination(activeNav)
    setActiveNav(sectionId)
    if (subType) {
      setActiveExperienceSub(subType)
    }
    onDestinationChange?.(sectionId, !wasProjectView)
    scrollToElementById(targetElementId, !wasProjectView)
  }

  // Scroll to a specific chapter inside an open Case Study (does NOT replay entry transition)
  const handleSelectCaseStudyChapter = useCallback(
    (chapterId: string) => {
      setActiveChapterId(chapterId)
      scrollToElementById(`cs-chapter-${chapterId}`, true)
    },
    [scrollToElementById]
  )

  // Sync when initialDestination prop changes (e.g., via browser Back/Forward or direct URL load)
  // Note: Does NOT trigger BREAK THE LINE animation on URL load / refresh / Back-Forward
  useEffect(() => {
    setActiveNav((prev) => {
      if (prev === initialDestination) return prev
      return initialDestination
    })

    if (isProjectDestination(initialDestination)) {
      setActiveChapterId(
        initialDestination === 'lovestory' ? 'ls-scene-01' : 'cs-01'
      )
      requestAnimationFrame(() => {
        if (mainScrollRef.current) {
          mainScrollRef.current.scrollTo({ top: 0, behavior: 'auto' })
        }
      })
    } else if (pendingRestoreScrollRef.current === null) {
      const timer = window.setTimeout(() => {
        scrollToElementById(`section-${initialDestination}`, false)
      }, 60)
      return () => window.clearTimeout(timer)
    }
  }, [initialDestination, scrollToElementById])

  // Passive scroll-spy listener tracking either Resume sections OR Case Study chapters (01–11)
  useEffect(() => {
    const container = mainScrollRef.current
    if (!container) return

    const evaluateScrollSpy = () => {
      const isDesktopFixedShell = window.matchMedia('(min-width: 861px)').matches

      if (isProjectView) {
        const trackedItems =
          activeNav === 'lovestory'
            ? t.loveStoryExperience.scenes
            : t.caseStudyChapters
        const firstId = trackedItems[0]?.id ?? 'cs-01'
        const lastId = trackedItems[trackedItems.length - 1]?.id ?? 'cs-11'

        if (isDesktopFixedShell) {
          const containerRect = container.getBoundingClientRect()
          const topbarEl =
            container.parentElement?.querySelector('.workspace-topbar')
          const visibleTopEdge = topbarEl
            ? Math.max(
                containerRect.top,
                topbarEl.getBoundingClientRect().bottom
              )
            : containerRect.top
          const maxScroll = container.scrollHeight - container.clientHeight
          if (maxScroll > 0 && maxScroll - container.scrollTop <= 40) {
            setActiveChapterId(lastId)
            return
          }

          let currentChapter = firstId
          for (const ch of trackedItems) {
            const el = document.getElementById(`cs-chapter-${ch.id}`)
            if (!el) continue
            const headerTarget =
              (el.querySelector(
                '.zl-chapter-header, .ls-scene-header'
              ) as HTMLElement | null) ?? el
            if (headerTarget.getBoundingClientRect().top - visibleTopEdge <= 184) {
              currentChapter = ch.id
            }
          }
          setActiveChapterId(currentChapter)
        } else {
          const docEl = document.documentElement
          if (docEl.scrollHeight - window.scrollY - window.innerHeight <= 48) {
            setActiveChapterId(lastId)
            return
          }
          const topbarEl = document.querySelector('.workspace-topbar')
          const stickyTopbarHeight = topbarEl
            ? topbarEl.getBoundingClientRect().height
            : 64
          let currentChapter = firstId
          for (const ch of trackedItems) {
            const el = document.getElementById(`cs-chapter-${ch.id}`)
            if (!el) continue
            const headerTarget =
              (el.querySelector(
                '.zl-chapter-header, .ls-scene-header'
              ) as HTMLElement | null) ?? el
            if (
              headerTarget.getBoundingClientRect().top <=
              stickyTopbarHeight + 120
            ) {
              currentChapter = ch.id
            }
          }
          setActiveChapterId(currentChapter)
        }
        return
      }

      // Resume 7-section scroll-spy
      if (isDesktopFixedShell) {
        const containerRect = container.getBoundingClientRect()
        const containerTop = containerRect.top
        const maxScroll = container.scrollHeight - container.clientHeight
        const isAtBottom = maxScroll > 0 && maxScroll - container.scrollTop <= 44

        if (isAtBottom) {
          setActiveNav((prev) => (isProjectDestination(prev) ? prev : 'contact'))
          return
        }

        const activationThreshold = 136
        let currentSection: ResumeSectionId = 'overview'

        for (const id of RESUME_SECTION_IDS) {
          const el = document.getElementById(`section-${id}`)
          if (!el) continue
          const relativeTop = el.getBoundingClientRect().top - containerTop
          if (relativeTop <= activationThreshold) {
            currentSection = id
          }
        }

        setActiveNav((prev) =>
          isProjectDestination(prev) ? prev : currentSection
        )

        const workEl = document.getElementById('subsection-work')
        if (workEl) {
          const workOffset = workEl.getBoundingClientRect().top - containerTop
          setActiveExperienceSub(workOffset <= 180 ? 'work' : 'projects')
        }
      } else {
        const docEl = document.documentElement
        const isAtWindowBottom =
          docEl.scrollHeight - window.scrollY - window.innerHeight <= 48

        if (isAtWindowBottom) {
          setActiveNav((prev) => (isProjectDestination(prev) ? prev : 'contact'))
          return
        }

        let currentSection: ResumeSectionId = 'overview'
        for (const id of RESUME_SECTION_IDS) {
          const el = document.getElementById(`section-${id}`)
          if (!el) continue
          if (el.getBoundingClientRect().top <= 160) {
            currentSection = id
          }
        }

        setActiveNav((prev) =>
          isProjectDestination(prev) ? prev : currentSection
        )

        const workEl = document.getElementById('subsection-work')
        if (workEl) {
          setActiveExperienceSub(
            workEl.getBoundingClientRect().top <= 200 ? 'work' : 'projects'
          )
        }
      }
    }

    container.addEventListener('scroll', evaluateScrollSpy, { passive: true })
    window.addEventListener('scroll', evaluateScrollSpy, { passive: true })
    return () => {
      container.removeEventListener('scroll', evaluateScrollSpy)
      window.removeEventListener('scroll', evaluateScrollSpy)
    }
  }, [activeNav, isProjectView, t.caseStudyChapters, t.loveStoryExperience.scenes])

  const activeProjectData = isProjectDestination(activeNav)
    ? t.projects[activeNav]
    : null

  const currentResumeSectionLabel =
    t.resume.sectionNav.find((s) => s.id === activeNav)?.label ??
    t.resume.sectionNav[0].label

  const activeChaptersList = isLoveStoryWorld
    ? t.loveStoryExperience.scenes
    : t.caseStudyChapters
  const currentChapterIndex = Math.max(
    0,
    activeChaptersList.findIndex((c) => c.id === activeChapterId)
  )
  const currentChapterObj =
    activeChaptersList[currentChapterIndex] ?? activeChaptersList[0]
  const chapterProgressPercent = Math.round(
    ((currentChapterIndex + 1) / activeChaptersList.length) * 100
  )

  const chapterMap = new Map(t.caseStudyChapters.map((ch) => [ch.id, ch]))

  const profileTooltipLabel = `${t.resume.sectionNav[0].label} · ${t.identity.nameEn}`
  const sidebarToggleLabel = isSidebarCollapsed
    ? t.workspace.expandSidebar
    : t.workspace.collapseSidebar

  // Standalone Fullscreen LoveStory Experience Boundary:
  // Renders outside the Portfolio Workspace shell (.workspace-layout)
  if (isLoveStoryWorld && activeProjectData) {
    return (
      <LoveStoryStandalonePage
        project={activeProjectData}
        allProjects={t.projects}
        loveStoryData={t.loveStoryExperience}
        playIntroOnMount={isLoveStoryIntroActive}
        prefersReducedMotion={prefersReducedMotion}
        onIntroFinished={handleCompleteLoveStoryIntro}
        onBackToPortfolio={handleBackToResume}
        onSelectProject={handleOpenProject}
      />
    )
  }

  return (
    <div
      className={`workspace-layout ${isSidebarCollapsed ? 'is-collapsed' : ''}`}
      data-workspace-theme={isZeroLineWorld ? 'zeroline' : undefined}
    >
      {/* ====================================================================
          CINEMATIC ENTRY ANIMATION OVERLAY: "BREAK THE LINE" (ZERO//LINE ONLY)
          Plays ONLY when intentionally entering ZERO//LINE from the Portfolio
          ==================================================================== */}
      <ZeroLineBreakTransition
        active={isZeroLineBreakActive}
        prefersReducedMotion={prefersReducedMotion}
        characterSlotLabel={
          t.zeroLineExperience.hero.transitionCharacterLabel
        }
        characterSlotSubnote={
          t.zeroLineExperience.hero.transitionCharacterSubnote
        }
        tagline={t.zeroLineExperience.hero.transitionTagline}
        onComplete={handleCompleteZeroLineBreak}
      />

      {/* ====================================================================
          REGION A: FIXED LEFT SIDEBAR (Adapts Contextually for Resume vs Case Study)
          ==================================================================== */}
      <aside
        ref={sidebarRef}
        className="workspace-sidebar"
        aria-label={t.workspace.sidebarAria}
      >
        {/* Pinned Top Identity Header */}
        <div className="sidebar-header-slot">
          <button
            type="button"
            className="sidebar-identity-card"
            aria-label={
              isProjectView
                ? t.workspace.backToResume
                : t.workspace.profileOverviewAria
            }
            onClick={() =>
              isProjectView ? handleBackToResume() : handleSelectNav('overview')
            }
            onMouseEnter={(e) =>
              showCollapsedTooltip(
                isProjectView ? t.workspace.backToResume : profileTooltipLabel,
                e.currentTarget
              )
            }
            onMouseLeave={hideCollapsedTooltip}
            onFocus={(e) =>
              showCollapsedTooltip(
                isProjectView ? t.workspace.backToResume : profileTooltipLabel,
                e.currentTarget
              )
            }
            onBlur={hideCollapsedTooltip}
          >
            <motion.div
              layoutId="jianshuo-portrait-shared"
              transition={layoutTransition}
              className="sidebar-avatar-box"
            >
              <PortraitSubjectGraphic compact />
            </motion.div>

            <div className="sidebar-identity-text">
              <motion.span
                layoutId="jianshuo-name-shared"
                transition={layoutTransition}
                className="sidebar-identity-name"
              >
                {t.identity.nameEn}
                <span className="sidebar-identity-zh" lang="zh-CN">
                  {' '}
                  · 刘建硕
                </span>
              </motion.span>
              <span className="sidebar-identity-role">
                {t.resume.overview.positioning}
              </span>
            </div>
          </button>
        </div>

        {/* Independently Scrollable Middle Navigation Region */}
        <div className="sidebar-scroll-area" onScroll={hideCollapsedTooltip}>
          {activeProjectData ? (
            /* --------------------------------------------------------------
               CONTEXTUAL CASE STUDY SIDEBAR NAVIGATION
               - For ZERO//LINE: Game-inspired ACT & Chapter tactical navigation
                 with live progression bar
               - For BridgeWork AU / LoveStory: Standard 11-chapter navigation
               -------------------------------------------------------------- */
            <>
              <div className="sidebar-cs-context-group">
                <button
                  type="button"
                  className="sidebar-cs-back-btn"
                  aria-label={t.workspace.backToResume}
                  onClick={handleBackToResume}
                  onMouseEnter={(e) =>
                    showCollapsedTooltip(
                      t.workspace.backToResume,
                      e.currentTarget
                    )
                  }
                  onMouseLeave={hideCollapsedTooltip}
                  onFocus={(e) =>
                    showCollapsedTooltip(
                      t.workspace.backToResume,
                      e.currentTarget
                    )
                  }
                  onBlur={hideCollapsedTooltip}
                >
                  <span className="sidebar-nav-icon" aria-hidden="true">
                    <ArrowLeftIcon size={17} />
                  </span>
                  <span className="sidebar-nav-label">
                    {t.workspace.backToResume}
                  </span>
                </button>

                <div className="sidebar-cs-active-project-card">
                  <span className="sidebar-cs-project-num">
                    {activeProjectData.number} · {t.workspace.breadcrumbCaseStudyPrefix}
                  </span>
                  <strong className="sidebar-cs-project-title">
                    {activeProjectData.title}
                  </strong>
                  <span className="sidebar-cs-project-cat">
                    {activeProjectData.category}
                  </span>

                  {isZeroLineWorld || isLoveStoryWorld ? (
                    <div className="sidebar-zl-progress-block">
                      <div className="sidebar-zl-progress-meta">
                        <span>
                          {isLoveStoryWorld
                            ? t.loveStoryExperience.navigation.progressLabel
                            : t.zeroLineExperience.sidebar.progressLabel}
                        </span>
                        <strong>
                          {currentChapterObj.number} /{' '}
                          {isLoveStoryWorld ? '06' : '11'}
                        </strong>
                      </div>
                      <div
                        className="sidebar-zl-progress-track"
                        aria-hidden="true"
                      >
                        <div
                          className="sidebar-zl-progress-fill"
                          style={{ width: `${chapterProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Case Study Chapter / Scene Navigation */}
              {isZeroLineWorld ? (
                <nav
                  className="sidebar-nav-group sidebar-zl-acts-nav"
                  aria-label={t.workspace.caseStudyChaptersAria}
                >
                  <span className="sidebar-section-label">
                    {t.zeroLineExperience.sidebar.actNavigationLabel}
                  </span>
                  {t.zeroLineExperience.acts.map((act) => (
                    <div key={act.actNumber} className="sidebar-zl-act-group">
                      <span className="sidebar-zl-act-header">
                        <em>{act.actNumber}</em> · {act.actCode}
                      </span>
                      {act.chapterIds.map((chId) => {
                        const ch = chapterMap.get(chId)
                        if (!ch) return null
                        const isChapterActive = activeChapterId === ch.id
                        const tooltipText = `${act.actNumber} · ${ch.number} ${ch.title}`
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            className={`sidebar-nav-item sidebar-cs-chapter-item ${
                              isChapterActive ? 'is-active' : ''
                            }`}
                            aria-current={isChapterActive ? 'true' : undefined}
                            aria-label={tooltipText}
                            onClick={() => handleSelectCaseStudyChapter(ch.id)}
                            onMouseEnter={(e) =>
                              showCollapsedTooltip(tooltipText, e.currentTarget)
                            }
                            onMouseLeave={hideCollapsedTooltip}
                            onFocus={(e) =>
                              showCollapsedTooltip(tooltipText, e.currentTarget)
                            }
                            onBlur={hideCollapsedTooltip}
                          >
                            <span
                              className="sidebar-cs-chapter-badge"
                              aria-hidden="true"
                            >
                              {ch.number}
                            </span>
                            <span className="sidebar-nav-label">{ch.title}</span>
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </nav>
              ) : isLoveStoryWorld ? (
                <nav
                  className="sidebar-nav-group sidebar-ls-scenes-nav"
                  aria-label={t.loveStoryExperience.navigation.storyThreadAria}
                >
                  <span className="sidebar-section-label">
                    {t.loveStoryExperience.navigation.progressLabel}
                  </span>
                  {t.loveStoryExperience.scenes.map((scene) => {
                    const isSceneActive = activeChapterId === scene.id
                    const tooltipText = `${scene.number} · ${scene.title}`
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        className={`sidebar-nav-item sidebar-cs-chapter-item ${
                          isSceneActive ? 'is-active' : ''
                        }`}
                        aria-current={isSceneActive ? 'true' : undefined}
                        aria-label={tooltipText}
                        onClick={() => handleSelectCaseStudyChapter(scene.id)}
                        onMouseEnter={(e) =>
                          showCollapsedTooltip(tooltipText, e.currentTarget)
                        }
                        onMouseLeave={hideCollapsedTooltip}
                        onFocus={(e) =>
                          showCollapsedTooltip(tooltipText, e.currentTarget)
                        }
                        onBlur={hideCollapsedTooltip}
                      >
                        <span
                          className="sidebar-cs-chapter-badge"
                          aria-hidden="true"
                        >
                          {scene.number}
                        </span>
                        <span className="sidebar-nav-label">{scene.title}</span>
                      </button>
                    )
                  })}
                </nav>
              ) : (
                <nav
                  className="sidebar-nav-group"
                  aria-label={t.workspace.caseStudyChaptersAria}
                >
                  <span className="sidebar-section-label">
                    {t.workspace.caseStudyChaptersLabel}
                  </span>
                  {t.caseStudyChapters.map((ch) => {
                    const isChapterActive = activeChapterId === ch.id
                    const tooltipText = `${ch.number} · ${ch.title}`
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        className={`sidebar-nav-item sidebar-cs-chapter-item ${
                          isChapterActive ? 'is-active' : ''
                        }`}
                        aria-current={isChapterActive ? 'true' : undefined}
                        aria-label={tooltipText}
                        onClick={() => handleSelectCaseStudyChapter(ch.id)}
                        onMouseEnter={(e) =>
                          showCollapsedTooltip(tooltipText, e.currentTarget)
                        }
                        onMouseLeave={hideCollapsedTooltip}
                        onFocus={(e) =>
                          showCollapsedTooltip(tooltipText, e.currentTarget)
                        }
                        onBlur={hideCollapsedTooltip}
                      >
                        <span
                          className="sidebar-cs-chapter-badge"
                          aria-hidden="true"
                        >
                          {ch.number}
                        </span>
                        <span className="sidebar-nav-label">{ch.title}</span>
                      </button>
                    )
                  })}
                </nav>
              )}

              {/* Quick Project Switcher at Bottom of Case Study Nav */}
              <nav
                className="sidebar-nav-group"
                aria-label={t.workspace.projectsGroupAria}
              >
                <span className="sidebar-section-label">
                  {t.workspace.caseStudyProjectSwitcherLabel}
                </span>
                {PROJECT_IDS.map((projKey) => {
                  const proj = t.projects[projKey]
                  const isCurrentProj = activeNav === projKey
                  const ProjectIcon = PROJECT_ICON_MAP[projKey]
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      className={`sidebar-nav-item ${
                        isCurrentProj ? 'is-project-selected' : ''
                      }`}
                      aria-current={isCurrentProj ? 'page' : undefined}
                      aria-label={`${proj.number} · ${proj.title}`}
                      onClick={() => handleOpenProject(proj.id)}
                      onMouseEnter={(e) =>
                        showCollapsedTooltip(
                          `${proj.number} · ${proj.title}`,
                          e.currentTarget
                        )
                      }
                      onMouseLeave={hideCollapsedTooltip}
                      onFocus={(e) =>
                        showCollapsedTooltip(
                          `${proj.number} · ${proj.title}`,
                          e.currentTarget
                        )
                      }
                      onBlur={hideCollapsedTooltip}
                    >
                      <span className="sidebar-nav-icon" aria-hidden="true">
                        <ProjectIcon size={17} />
                      </span>
                      <span className="sidebar-nav-label">
                        {proj.number} · {proj.title}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </>
          ) : (
            /* --------------------------------------------------------------
               RESUME DOSSIER SIDEBAR NAVIGATION + SELECTED WORK
               -------------------------------------------------------------- */
            <>
              <nav
                className="sidebar-nav-group"
                aria-label={t.workspace.resumeGroupAria}
              >
                <span className="sidebar-section-label">
                  {t.workspace.resumeGroupLabel}
                </span>
                {t.resume.sectionNav.map((sec) => {
                  const isActive = activeNav === sec.id
                  const SectionIcon = RESUME_SECTION_ICON_MAP[sec.id]
                  return (
                    <React.Fragment key={sec.id}>
                      <button
                        type="button"
                        className={`sidebar-nav-item ${isActive ? 'is-active' : ''}`}
                        aria-current={isActive ? 'true' : undefined}
                        aria-label={sec.label}
                        onClick={() => handleSelectNav(sec.id)}
                        onMouseEnter={(e) =>
                          showCollapsedTooltip(sec.label, e.currentTarget)
                        }
                        onMouseLeave={hideCollapsedTooltip}
                        onFocus={(e) =>
                          showCollapsedTooltip(sec.label, e.currentTarget)
                        }
                        onBlur={hideCollapsedTooltip}
                      >
                        <span className="sidebar-nav-icon" aria-hidden="true">
                          <SectionIcon size={18} />
                        </span>
                        <span className="sidebar-nav-label">{sec.label}</span>
                      </button>

                      {/* Sub-navigation for Experience -> Project Experience & Work Experience */}
                      {sec.id === 'experience' ? (
                        <div
                          className="sidebar-subnav-list"
                          role="group"
                          aria-label={sec.label}
                        >
                          <button
                            type="button"
                            className={`sidebar-subnav-item ${
                              isActive && activeExperienceSub === 'projects'
                                ? 'is-sub-active'
                                : ''
                            }`}
                            aria-label={t.resume.experience.projectsHeading}
                            onClick={() =>
                              handleJumpToSubsection(
                                'experience',
                                'subsection-projects',
                                'projects'
                              )
                            }
                            onMouseEnter={(e) =>
                              showCollapsedTooltip(
                                t.resume.experience.projectsHeading,
                                e.currentTarget
                              )
                            }
                            onMouseLeave={hideCollapsedTooltip}
                            onFocus={(e) =>
                              showCollapsedTooltip(
                                t.resume.experience.projectsHeading,
                                e.currentTarget
                              )
                            }
                            onBlur={hideCollapsedTooltip}
                          >
                            <span
                              className="sidebar-subnav-icon"
                              aria-hidden="true"
                            >
                              <FolderKanbanIcon size={15} />
                            </span>
                            <span className="sidebar-subnav-label">
                              {t.resume.experience.projectsHeading}
                            </span>
                          </button>

                          <button
                            type="button"
                            className={`sidebar-subnav-item ${
                              isActive && activeExperienceSub === 'work'
                                ? 'is-sub-active'
                                : ''
                            }`}
                            aria-label={t.resume.experience.workHeading}
                            onClick={() =>
                              handleJumpToSubsection(
                                'experience',
                                'subsection-work',
                                'work'
                              )
                            }
                            onMouseEnter={(e) =>
                              showCollapsedTooltip(
                                t.resume.experience.workHeading,
                                e.currentTarget
                              )
                            }
                            onMouseLeave={hideCollapsedTooltip}
                            onFocus={(e) =>
                              showCollapsedTooltip(
                                t.resume.experience.workHeading,
                                e.currentTarget
                              )
                            }
                            onBlur={hideCollapsedTooltip}
                          >
                            <span
                              className="sidebar-subnav-icon"
                              aria-hidden="true"
                            >
                              <Building2Icon size={15} />
                            </span>
                            <span className="sidebar-subnav-label">
                              {t.resume.experience.workHeading}
                            </span>
                          </button>
                        </div>
                      ) : null}
                    </React.Fragment>
                  )
                })}
              </nav>

              {/* Selected Work Destinations (BridgeWork AU, ZERO//LINE, LoveStory) */}
              <nav
                className="sidebar-nav-group"
                aria-label={t.workspace.projectsGroupAria}
              >
                <span className="sidebar-section-label">
                  {t.workspace.projectsGroupLabel}
                </span>
                {PROJECT_IDS.map((projKey) => {
                  const proj = t.projects[projKey]
                  const isActive = activeNav === projKey
                  const ProjectIcon = PROJECT_ICON_MAP[projKey]
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      className={`sidebar-nav-item ${isActive ? 'is-active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={`${proj.number} · ${proj.title}`}
                      onClick={() => handleOpenProject(proj.id)}
                      onMouseEnter={(e) =>
                        showCollapsedTooltip(
                          `${proj.number} · ${proj.title}`,
                          e.currentTarget
                        )
                      }
                      onMouseLeave={hideCollapsedTooltip}
                      onFocus={(e) =>
                        showCollapsedTooltip(
                          `${proj.number} · ${proj.title}`,
                          e.currentTarget
                        )
                      }
                      onBlur={hideCollapsedTooltip}
                    >
                      <span className="sidebar-nav-icon" aria-hidden="true">
                        <ProjectIcon size={18} />
                      </span>
                      <span className="sidebar-nav-label">
                        {proj.number} · {proj.title}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </>
          )}
        </div>

        {/* Pinned Bottom Collapse / Expand Sidebar Control */}
        <div className="sidebar-bottom-controls">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            aria-expanded={!isSidebarCollapsed}
            aria-label={sidebarToggleLabel}
            onMouseEnter={(e) =>
              showCollapsedTooltip(sidebarToggleLabel, e.currentTarget)
            }
            onMouseLeave={hideCollapsedTooltip}
            onFocus={(e) =>
              showCollapsedTooltip(sidebarToggleLabel, e.currentTarget)
            }
            onBlur={hideCollapsedTooltip}
          >
            <span className="sidebar-toggle-icon" aria-hidden="true">
              {isSidebarCollapsed ? (
                <PanelLeftOpenIcon size={18} />
              ) : (
                <PanelLeftCloseIcon size={18} />
              )}
            </span>
            <span className="sidebar-footer-label">{sidebarToggleLabel}</span>
          </button>
        </div>

        {/* Floating Unclipped Tooltip for Collapsed Icon Rail (Hover & Keyboard Focus) */}
        {isSidebarCollapsed && collapsedTooltip ? (
          <div
            className="sidebar-rail-tooltip"
            role="tooltip"
            style={{ top: `${collapsedTooltip.top}px` }}
          >
            {collapsedTooltip.label}
          </div>
        ) : null}
      </aside>

      {/* ====================================================================
          RIGHT COLUMN: Stationary Topbar + Independently Scrollable Main Content
          ==================================================================== */}
      <main id="main-content" className="workspace-main" tabIndex={-1}>
        {/* REGION C: STATIONARY RIGHT TOPBAR */}
        <header className="workspace-topbar">
          <div className="workspace-breadcrumb">
            <span>{t.workspace.breadcrumbRoot}</span>
            <span aria-hidden="true">/</span>
            <strong>
              {activeProjectData
                ? `${t.workspace.breadcrumbCaseStudyPrefix} · ${activeProjectData.number} — ${activeProjectData.title} · ${currentChapterObj.number}. ${currentChapterObj.title}`
                : `${t.workspace.breadcrumbResumePrefix} · ${currentResumeSectionLabel}`}
            </strong>
          </div>

          <div className="workspace-topbar-actions">
            <LanguageSwitcher />

            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === 'light'
                  ? t.nav.switchToDarkAria
                  : t.nav.switchToLightAria
              }
              aria-pressed={theme === 'dark'}
            >
              <span className="theme-toggle-dot" aria-hidden="true" />
              <span className="theme-label-full">
                {theme === 'light'
                  ? t.nav.themeLightLabel
                  : t.nav.themeDarkLabel}
              </span>
              <span className="theme-label-compact">
                {theme === 'light'
                  ? t.nav.themeLightShort
                  : t.nav.themeDarkShort}
              </span>
            </button>

            {/* Single Persistent Return to Cover Action in Top-Right Header (Hidden while ZERO//LINE Case Study is active) */}
            {!isZeroLineWorld ? (
              <button
                type="button"
                className="btn-return-cover"
                disabled={isTransitioning}
                onClick={onReturnToLanding}
              >
                <ArrowLeftIcon size={15} />
                <span>{t.workspace.returnToCover}</span>
              </button>
            ) : null}
          </div>
        </header>

        {/* REGION B: INDEPENDENTLY SCROLLABLE RIGHT MAIN CONTENT */}
        <div ref={mainScrollRef} className="workspace-scroll-viewport">
          <div className="workspace-content-container">
            {activeProjectData ? (
              activeProjectData.id === 'zero-line' ? (
                /* ============================================================
                   ZERO//LINE — CINEMATIC GAME-INSPIRED PROJECT EXPERIENCE
                   ============================================================ */
                <ZeroLineCaseStudy
                  project={activeProjectData}
                  allProjects={t.projects}
                  chapters={t.caseStudyChapters}
                  zeroLineData={t.zeroLineExperience}
                  activeChapterId={activeChapterId}
                  backToResumeLabel={t.workspace.backToResume}
                  designFocusHeading={t.workspace.designFocusHeading}
                  mobileChapterSelectLabel={
                    t.workspace.mobileChapterSelectLabel
                  }
                  nextProjectLabel={t.workspace.nextProjectLabel}
                  isEnteringBreak={isZeroLineBreakActive}
                  onBackToResume={handleBackToResume}
                  onSelectChapter={handleSelectCaseStudyChapter}
                  onSelectProject={handleOpenProject}
                />
              ) : (
                /* ============================================================
                   STANDARD 11-SECTION PROJECT CASE STUDY VIEW
                   (BridgeWork AU)
                   ============================================================ */
                <CaseStudyView
                  project={activeProjectData}
                  allProjects={t.projects}
                  chapters={t.caseStudyChapters}
                  activeChapterId={activeChapterId}
                  backToResumeLabel={t.workspace.backToResume}
                  designFocusHeading={t.workspace.designFocusHeading}
                  placeholderBadgeText={t.workspace.caseStudyPlaceholderBadge}
                  mobileChapterSelectLabel={
                    t.workspace.mobileChapterSelectLabel
                  }
                  nextProjectLabel={t.workspace.nextProjectLabel}
                  onBackToResume={handleBackToResume}
                  onSelectChapter={handleSelectCaseStudyChapter}
                  onSelectProject={handleOpenProject}
                />
              )
            ) : (
              /* ==============================================================
                 COMPLETE CONTINUOUS SINGLE-PAGE RESUME
                 ============================================================== */
              <div className="resume-continuous-dossier">
                {/* 1. OVERVIEW / 个人概览 */}
                <section
                  id="section-overview"
                  className="workspace-section resume-overview-section"
                  aria-labelledby="heading-overview"
                >
                  <div className="overview-hero-header">
                    <span className="overview-eyebrow">
                      {t.resume.overview.eyebrow}
                    </span>
                    <div className="overview-identity-line">
                      <h1 id="heading-overview" className="overview-name-title">
                        {t.resume.overview.nameDisplay}
                        <span className="overview-name-secondary">
                          {' '}
                          · {t.resume.overview.nameSecondary}
                        </span>
                      </h1>
                      <span className="overview-role-badge">
                        {t.resume.overview.positioning}
                      </span>
                    </div>

                    <p className="overview-summary-lead">
                      {t.resume.overview.summary}
                    </p>

                    {/* Quick Jump Navigation Bar */}
                    <div className="overview-quick-jump">
                      <span className="overview-jump-label">
                        {t.resume.overview.quickJumpLabel}
                      </span>
                      <div className="overview-jump-pills">
                        <button
                          type="button"
                          className="resume-jump-pill"
                          onClick={() => handleSelectNav('education')}
                        >
                          {t.resume.education.sectionTitle}
                        </button>
                        <button
                          type="button"
                          className="resume-jump-pill"
                          onClick={() =>
                            handleJumpToSubsection(
                              'experience',
                              'subsection-projects',
                              'projects'
                            )
                          }
                        >
                          {t.resume.experience.projectsHeading}
                        </button>
                        <button
                          type="button"
                          className="resume-jump-pill"
                          onClick={() =>
                            handleJumpToSubsection(
                              'experience',
                              'subsection-work',
                              'work'
                            )
                          }
                        >
                          {t.resume.experience.workHeading}
                        </button>
                        <button
                          type="button"
                          className="resume-jump-pill"
                          onClick={() => handleSelectNav('skills')}
                        >
                          {t.resume.skills.sectionTitle}
                        </button>
                        <button
                          type="button"
                          className="resume-jump-pill"
                          onClick={() => handleSelectNav('additional-projects')}
                        >
                          {t.resume.additionalProjects.sectionTitle}
                        </button>
                        <button
                          type="button"
                          className="resume-jump-pill"
                          onClick={() => handleSelectNav('honours')}
                        >
                          {t.resume.honoursAndLanguages.sectionTitle}
                        </button>
                        <button
                          type="button"
                          className="resume-jump-pill"
                          onClick={() => handleSelectNav('contact')}
                        >
                          {t.resume.contact.sectionTitle}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recruiter At-a-Glance Snapshot Grid (Education, Key Expertise, Work Highlights) */}
                  <div className="overview-snapshot-grid">
                    {/* Education Summary */}
                    <div className="overview-snapshot-block">
                      <div className="snapshot-block-header">
                        <h2>{t.resume.overview.educationSnapshotTitle}</h2>
                        <button
                          type="button"
                          className="snapshot-inline-link"
                          onClick={() => handleSelectNav('education')}
                        >
                          ↓
                        </button>
                      </div>
                      <ul className="snapshot-compact-list">
                        {t.resume.overview.educationSnapshotItems.map((item) => (
                          <li
                            key={item.institution}
                            className="snapshot-compact-item"
                          >
                            <div className="snapshot-item-top">
                              <strong>{item.institution}</strong>
                              <span className="snapshot-period">
                                {item.period}
                              </span>
                            </div>
                            <span className="snapshot-sub">{item.program}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Expertise */}
                    <div className="overview-snapshot-block">
                      <div className="snapshot-block-header">
                        <h2>{t.resume.overview.keyExpertiseTitle}</h2>
                        <button
                          type="button"
                          className="snapshot-inline-link"
                          onClick={() => handleSelectNav('skills')}
                        >
                          ↓
                        </button>
                      </div>
                      <ul className="snapshot-bullet-list">
                        {t.resume.overview.keyExpertiseItems.map((exp) => (
                          <li key={exp}>{exp}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Experience Highlights */}
                    <div className="overview-snapshot-block">
                      <div className="snapshot-block-header">
                        <h2>{t.resume.overview.experienceSnapshotTitle}</h2>
                        <button
                          type="button"
                          className="snapshot-inline-link"
                          onClick={() =>
                            handleJumpToSubsection(
                              'experience',
                              'subsection-work',
                              'work'
                            )
                          }
                        >
                          ↓
                        </button>
                      </div>
                      <ul className="snapshot-compact-list">
                        {t.resume.overview.experienceSnapshotItems.map((work) => (
                          <li
                            key={work.company}
                            className="snapshot-compact-item"
                          >
                            <div className="snapshot-item-top">
                              <strong>{work.company}</strong>
                              <span className="snapshot-period">
                                {work.period}
                              </span>
                            </div>
                            <span className="snapshot-sub">{work.role}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Selected Case Studies Preview Strip */}
                  <div className="overview-featured-projects">
                    <div className="overview-featured-header">
                      <h2>{t.resume.overview.featuredProjectsTitle}</h2>
                      <p>{t.resume.overview.featuredProjectsLead}</p>
                    </div>

                    <div className="overview-projects-preview-grid">
                      {t.resume.experience.projects.map((proj) => (
                        <button
                          key={proj.id}
                          type="button"
                          className="overview-project-preview-card"
                          onClick={() => handleOpenProject(proj.id)}
                          aria-label={t.workspace.openCaseStudyAria(
                            proj.brandName
                          )}
                        >
                          <div className="preview-card-top">
                            <span className="preview-project-num">
                              {proj.number} · {proj.period}
                            </span>
                            <h3 className="preview-project-name">
                              {proj.brandName}
                            </h3>
                            <span className="preview-project-type">
                              {proj.subtitle}
                            </span>
                          </div>

                          <div className="preview-card-actions">
                            <span className="preview-action-primary">
                              <span>{t.workspace.openCaseStudyLabel}</span>
                              <ArrowRightIcon size={15} />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 2. EDUCATION / 教育背景 */}
                <section
                  id="section-education"
                  className="workspace-section"
                  aria-labelledby="heading-education"
                >
                  <div className="section-header-row">
                    <div>
                      <h2 id="heading-education" className="section-title">
                        {t.resume.education.sectionTitle}
                      </h2>
                      <p className="section-subtitle">
                        {t.resume.education.sectionSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="education-chronology">
                    {t.resume.education.entries.map((edu) => (
                      <article key={edu.id} className="education-entry">
                        <div className="education-period-col">
                          <span className="chronology-period-badge">
                            {edu.period}
                          </span>
                        </div>

                        <div className="education-body-col">
                          <div className="education-title-row">
                            <h3 className="education-institution">
                              {edu.institution}
                              {edu.institutionSecondary ? (
                                <span className="education-institution-sub">
                                  {' '}
                                  · {edu.institutionSecondary}
                                </span>
                              ) : null}
                            </h3>
                            <span className="education-degree">
                              {edu.degree}
                            </span>
                          </div>

                          <ul className="resume-detail-list">
                            {edu.details.map((detail) => (
                              <li key={detail}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* 3. EXPERIENCE / 实践经历 (Divided into Minimalist Project Index & Work Experience) */}
                <section
                  id="section-experience"
                  className="workspace-section"
                  aria-labelledby="heading-experience"
                >
                  <div className="section-header-row">
                    <div>
                      <h2 id="heading-experience" className="section-title">
                        {t.resume.experience.sectionTitle}
                      </h2>
                      <p className="section-subtitle">
                        {t.resume.experience.sectionSubtitle}
                      </p>
                    </div>

                    <div className="experience-subnav-pills">
                      <button
                        type="button"
                        className={`resume-jump-pill ${
                          activeExperienceSub === 'projects' ? 'is-active' : ''
                        }`}
                        onClick={() =>
                          handleJumpToSubsection(
                            'experience',
                            'subsection-projects',
                            'projects'
                          )
                        }
                      >
                        {t.resume.experience.projectsTabLabel}
                      </button>
                      <button
                        type="button"
                        className={`resume-jump-pill ${
                          activeExperienceSub === 'work' ? 'is-active' : ''
                        }`}
                        onClick={() =>
                          handleJumpToSubsection(
                            'experience',
                            'subsection-work',
                            'work'
                          )
                        }
                      >
                        {t.resume.experience.workTabLabel}
                      </button>
                    </div>
                  </div>

                  {/* SUBSECTION A: MINIMALIST PROJECT EXPERIENCE INDEX */}
                  <div
                    id="subsection-projects"
                    className="experience-subsection"
                    aria-labelledby="heading-sub-projects"
                  >
                    <div className="subsection-banner">
                      <div className="subsection-title-group">
                        <span className="subsection-index-tag">A</span>
                        <h3
                          id="heading-sub-projects"
                          className="subsection-heading"
                        >
                          {t.resume.experience.projectsHeading}
                        </h3>
                      </div>
                      <p className="subsection-lead">
                        {t.resume.experience.projectsLead}
                      </p>
                    </div>

                    <ProjectIndex
                      projects={t.resume.experience.projects}
                      openLabel={t.workspace.openCaseStudyLabel}
                      getOpenAriaLabel={t.workspace.openCaseStudyAria}
                      onSelectProject={handleOpenProject}
                    />
                  </div>

                  {/* SUBSECTION B: WORK EXPERIENCE / 工作经历 (Chronological Vertical Timeline) */}
                  <div
                    id="subsection-work"
                    className="experience-subsection experience-subsection--work"
                    aria-labelledby="heading-sub-work"
                  >
                    <div className="subsection-banner">
                      <div className="subsection-title-group">
                        <span className="subsection-index-tag">B</span>
                        <h3 id="heading-sub-work" className="subsection-heading">
                          {t.resume.experience.workHeading}
                        </h3>
                      </div>
                      <p className="subsection-lead">
                        {t.resume.experience.workLead}
                      </p>
                    </div>

                    <div className="work-vertical-timeline">
                      {t.resume.experience.workEntries.map((work) => (
                        <article key={work.id} className="work-timeline-item">
                          <div
                            className="work-timeline-marker"
                            aria-hidden="true"
                          >
                            <span className="work-timeline-dot" />
                          </div>

                          <div className="work-timeline-content">
                            <div className="work-timeline-header">
                              <div>
                                <h4 className="work-company-name">
                                  <span lang="zh-CN">{work.companyZh}</span>
                                  {work.companyEn ? (
                                    <span className="work-company-en">
                                      {' '}
                                      · {work.companyEn}
                                    </span>
                                  ) : null}
                                </h4>
                                <span className="work-role-badge">
                                  {work.role}
                                </span>
                              </div>

                              <span className="chronology-period-badge">
                                {work.period}
                              </span>
                            </div>

                            <ul className="resume-detail-list">
                              {work.highlights.map((hl) => (
                                <li key={hl}>{hl}</li>
                              ))}
                            </ul>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 4. SKILLS / 专业技能 */}
                <section
                  id="section-skills"
                  className="workspace-section"
                  aria-labelledby="heading-skills"
                >
                  <div className="section-header-row">
                    <div>
                      <h2 id="heading-skills" className="section-title">
                        {t.resume.skills.sectionTitle}
                      </h2>
                      <p className="section-subtitle">
                        {t.resume.skills.sectionSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="skills-category-grid">
                    {t.resume.skills.categories.map((cat) => (
                      <div key={cat.id} className="skill-category-block">
                        <h3 className="skill-category-title">{cat.title}</h3>
                        <p className="skill-category-subtitle">
                          {cat.subtitle}
                        </p>
                        <ul className="skill-capability-list">
                          {cat.skills.map((skill) => (
                            <li key={skill} className="skill-capability-item">
                              <span
                                className="skill-Check-dot"
                                aria-hidden="true"
                              />
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. ADDITIONAL PROJECTS / 其他项目 */}
                <section
                  id="section-additional-projects"
                  className="workspace-section"
                  aria-labelledby="heading-additional-projects"
                >
                  <div className="section-header-row">
                    <div>
                      <h2
                        id="heading-additional-projects"
                        className="section-title"
                      >
                        {t.resume.additionalProjects.sectionTitle}
                      </h2>
                      <p className="section-subtitle">
                        {t.resume.additionalProjects.sectionSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="additional-projects-row">
                    {t.resume.additionalProjects.entries.map((entry) => (
                      <article
                        key={entry.id}
                        className="additional-project-compact-item"
                      >
                        <div className="additional-project-top">
                          <h3 className="additional-project-title">
                            {entry.title}
                          </h3>
                          <span className="chronology-period-badge">
                            {entry.period}
                          </span>
                        </div>
                        <p className="additional-project-summary">
                          {entry.summary}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                {/* 6. HONOURS & LANGUAGES / 荣誉与语言 */}
                <section
                  id="section-honours"
                  className="workspace-section"
                  aria-labelledby="heading-honours"
                >
                  <div className="section-header-row">
                    <div>
                      <h2 id="heading-honours" className="section-title">
                        {t.resume.honoursAndLanguages.sectionTitle}
                      </h2>
                      <p className="section-subtitle">
                        {t.resume.honoursAndLanguages.sectionSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="honours-languages-grid">
                    {/* Honours */}
                    <div className="honours-column">
                      <h3 className="subblock-title">
                        {t.resume.honoursAndLanguages.honoursTitle}
                      </h3>
                      <ul className="honours-recognition-list">
                        {t.resume.honoursAndLanguages.honoursList.map((h) => (
                          <li key={h.title} className="honour-recognition-item">
                            <strong>{h.title}</strong>
                            <span>{h.detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Languages & Examinations */}
                    <div className="languages-column">
                      <h3 className="subblock-title">
                        {t.resume.honoursAndLanguages.languagesTitle}
                      </h3>
                      <div className="language-exam-badges">
                        {t.resume.honoursAndLanguages.examBadges.map((badge) => (
                          <span key={badge} className="language-exam-pill">
                            {badge}
                          </span>
                        ))}
                      </div>
                      <p className="language-capability-note">
                        {t.resume.honoursAndLanguages.languageCapabilityNote}
                      </p>
                    </div>
                  </div>
                </section>

                {/* 7. CONTACT / 联系方式 */}
                <section
                  id="section-contact"
                  className="workspace-section"
                  aria-labelledby="heading-contact"
                >
                  <div className="section-header-row">
                    <div>
                      <h2 id="heading-contact" className="section-title">
                        {t.resume.contact.sectionTitle}
                      </h2>
                      <p className="section-subtitle">
                        {t.resume.contact.sectionSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="contact-dossier-grid">
                    <div className="contact-info-list">
                      <div className="contact-field-row">
                        <span className="contact-field-label">
                          {t.resume.contact.emailLabel}
                        </span>
                        <a
                          href={`mailto:${CONTACT_CONFIG.email}`}
                          className="contact-field-link"
                        >
                          {CONTACT_CONFIG.email}
                        </a>
                      </div>

                      <div className="contact-field-row">
                        <span className="contact-field-label">
                          {t.resume.contact.phoneLabel}
                        </span>
                        {CONTACT_CONFIG.showPhonePublicly ? (
                          <a
                            href={`tel:${CONTACT_CONFIG.phone}`}
                            className="contact-field-link"
                          >
                            {CONTACT_CONFIG.phone}
                          </a>
                        ) : (
                          <span className="contact-field-value">
                            {t.resume.contact.phoneHiddenNote}
                          </span>
                        )}
                      </div>

                      <div className="contact-field-row">
                        <span className="contact-field-label">
                          {t.resume.contact.locationLabel}
                        </span>
                        <span className="contact-field-value">
                          {t.resume.contact.locationValue}
                        </span>
                      </div>

                      <div className="contact-field-row">
                        <span className="contact-field-label">
                          {t.resume.contact.availabilityLabel}
                        </span>
                        <span className="contact-field-value">
                          {t.resume.contact.availabilityValue}
                        </span>
                      </div>
                    </div>

                    <div className="contact-actions-col">
                      <div className="contact-cta-row">
                        <a
                          href={`mailto:${CONTACT_CONFIG.email}`}
                          className="btn-primary-enter"
                        >
                          {t.resume.contact.emailCtaLabel} (
                          {CONTACT_CONFIG.email})
                        </a>

                        {CONTACT_CONFIG.resumePdfPath ? (
                          <a
                            href={CONTACT_CONFIG.resumePdfPath}
                            download
                            className="btn-secondary-work"
                          >
                            {t.resume.contact.pdfDownloadLabel}
                          </a>
                        ) : null}
                      </div>

                      {!CONTACT_CONFIG.resumePdfPath ? (
                        <p className="contact-pdf-note">
                          {t.resume.contact.pdfUnavailableNote}
                        </p>
                      ) : null}

                      <div className="contact-verified-links">
                        <span className="contact-field-label">
                          {t.resume.contact.liveProjectsLabel}
                        </span>
                        <div className="contact-project-links-row">
                          <a
                            href={CONTACT_CONFIG.projectLinks.zeroLine}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-live-link-btn"
                          >
                            ZERO//LINE ↗
                          </a>
                          <a
                            href={CONTACT_CONFIG.projectLinks.loveStory}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-live-link-btn"
                          >
                            LoveStory ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
