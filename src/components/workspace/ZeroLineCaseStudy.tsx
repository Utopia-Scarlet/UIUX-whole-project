import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  LayersIcon,
} from '../icons/WorkspaceIcons'
import {
  PROJECT_IDS,
  ZERO_LINE_ASSET_SPEC,
  type CaseStudyChapterTemplate,
  type ProjectId,
  type ProjectShellData,
  type ZeroLineExperienceData,
  type ZeroLineShowcaseSectionId,
} from '../../data/portfolioData'

interface ZeroLineMediaSlotProps {
  label: string
  title: string
  spec: string
  imageSrc?: string
  imageAlt?: string
  secondaryImageSrc?: string
  secondaryImageAlt?: string
  secondaryTitle?: string
  secondarySpec?: string
}

/**
 * Renders either:
 * 1. A spacious, full-width visual frame preserving natural aspect ratio when
 *    authentic media (`imageSrc`) is available and loaded.
 * 2. A single, compact, restrained placeholder (approx. 104–136px tall) when
 *    media is not yet supplied—avoiding tall empty frames or side-by-side
 *    empty boxes.
 */
const ZeroLineMediaSlot: React.FC<ZeroLineMediaSlotProps> = ({
  label,
  title,
  spec,
  imageSrc,
  imageAlt,
  secondaryImageSrc,
  secondaryImageAlt,
  secondaryTitle,
  secondarySpec,
}) => {
  const [primaryLoaded, setPrimaryLoaded] = useState<boolean>(false)
  const [primaryError, setPrimaryError] = useState<boolean>(false)
  const [secondaryLoaded, setSecondaryLoaded] = useState<boolean>(false)
  const [secondaryError, setSecondaryError] = useState<boolean>(false)

  const hasValidPrimary = Boolean(imageSrc) && !primaryError
  const hasValidSecondary =
    Boolean(secondaryImageSrc) && Boolean(secondaryTitle) && !secondaryError

  if (hasValidPrimary && hasValidSecondary) {
    return (
      <div className="zl-media-split-grid" role="region" aria-label={title}>
        <figure className="zl-media-frame zl-media-frame--loaded">
          <div className="zl-media-image-wrap">
            <img
              src={imageSrc}
              alt={imageAlt ?? title}
              className={`zl-media-img ${primaryLoaded ? 'is-loaded' : ''}`}
              onLoad={() => setPrimaryLoaded(true)}
              onError={() => setPrimaryError(true)}
            />
          </div>
          <figcaption className="zl-media-caption">
            <span className="zl-media-code">{label}</span>
            <strong className="zl-media-title">{title}</strong>
            <p className="zl-media-spec">{spec}</p>
          </figcaption>
        </figure>

        <figure className="zl-media-frame zl-media-frame--loaded">
          <div className="zl-media-image-wrap">
            <img
              src={secondaryImageSrc}
              alt={secondaryImageAlt ?? secondaryTitle ?? title}
              className={`zl-media-img ${secondaryLoaded ? 'is-loaded' : ''}`}
              onLoad={() => setSecondaryLoaded(true)}
              onError={() => setSecondaryError(true)}
            />
          </div>
          <figcaption className="zl-media-caption">
            <span className="zl-media-code">{label}</span>
            <strong className="zl-media-title">{secondaryTitle}</strong>
            {secondarySpec ? (
              <p className="zl-media-spec">{secondarySpec}</p>
            ) : null}
          </figcaption>
        </figure>
      </div>
    )
  }

  if (hasValidPrimary) {
    return (
      <figure
        className="zl-media-frame zl-media-frame--loaded"
        role="region"
        aria-label={title}
      >
        <div className="zl-media-image-wrap">
          <img
            src={imageSrc}
            alt={imageAlt ?? title}
            className={`zl-media-img ${primaryLoaded ? 'is-loaded' : ''}`}
            onLoad={() => setPrimaryLoaded(true)}
            onError={() => setPrimaryError(true)}
          />
        </div>
        <figcaption className="zl-media-caption">
          <div className="zl-media-caption-top">
            <span className="zl-media-code">{label}</span>
            <strong className="zl-media-title">{title}</strong>
          </div>
          <p className="zl-media-spec">{spec}</p>
        </figcaption>
      </figure>
    )
  }

  return (
    <div
      className="zl-media-slot zl-media-slot--empty"
      role="region"
      aria-label={title}
    >
      <div className="zl-media-empty-main">
        <div className="zl-media-empty-header">
          <span className="zl-media-code">{label}</span>
          <span className="zl-media-empty-dot" aria-hidden="true">
            ·
          </span>
          <strong className="zl-media-title">{title}</strong>
        </div>
        <p className="zl-media-spec">{spec}</p>
      </div>
      <span className="zl-media-empty-icon" aria-hidden="true">
        <LayersIcon size={15} />
      </span>
    </div>
  )
}

interface ShowcaseScreenshotState {
  src: string | null
  loaded: boolean
  triedFallback: boolean
}

interface ZeroLineCaseStudyProps {
  project: ProjectShellData
  allProjects: Record<ProjectId, ProjectShellData>
  chapters: ReadonlyArray<CaseStudyChapterTemplate>
  zeroLineData: ZeroLineExperienceData
  activeChapterId: string
  backToResumeLabel: string
  designFocusHeading: string
  mobileChapterSelectLabel: string
  nextProjectLabel: string
  isEnteringBreak: boolean
  onBackToResume: () => void
  onSelectChapter: (chapterId: string) => void
  onSelectProject: (projectId: ProjectId) => void
}

export const ZeroLineCaseStudy: React.FC<ZeroLineCaseStudyProps> = ({
  project,
  allProjects,
  chapters,
  zeroLineData,
  activeChapterId,
  backToResumeLabel,
  mobileChapterSelectLabel,
  nextProjectLabel,
  isEnteringBreak,
  onBackToResume,
  onSelectChapter,
  onSelectProject,
}) => {
  const [activeShowcaseTabId, setActiveShowcaseTabId] =
    useState<ZeroLineShowcaseSectionId>(
      zeroLineData.interfaceShowcase.tabs[0]?.id ?? 'home'
    )
  const [heroImgSrc, setHeroImgSrc] = useState<string | null>(
    ZERO_LINE_ASSET_SPEC.heroCharacterOptWebp
  )
  const [heroImgLoaded, setHeroImgLoaded] = useState<boolean>(false)

  // Track authentic screenshot loading (.webp -> .png -> missing slot) per section
  const [showcaseMediaState, setShowcaseMediaState] = useState<
    Record<ZeroLineShowcaseSectionId, ShowcaseScreenshotState>
  >(() => ({
    home: {
      src: ZERO_LINE_ASSET_SPEC.showcaseScreenshots.home.webp,
      loaded: false,
      triedFallback: false,
    },
    news: {
      src: ZERO_LINE_ASSET_SPEC.showcaseScreenshots.news.webp,
      loaded: false,
      triedFallback: false,
    },
    heroes: {
      src: ZERO_LINE_ASSET_SPEC.showcaseScreenshots.heroes.webp,
      loaded: false,
      triedFallback: false,
    },
    store: {
      src: ZERO_LINE_ASSET_SPEC.showcaseScreenshots.store.webp,
      loaded: false,
      triedFallback: false,
    },
    about: {
      src: ZERO_LINE_ASSET_SPEC.showcaseScreenshots.about.webp,
      loaded: false,
      triedFallback: false,
    },
  }))

  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const closeLightboxBtnRef = useRef<HTMLButtonElement | null>(null)

  const handleHeroImgError = () => {
    if (heroImgSrc === ZERO_LINE_ASSET_SPEC.heroCharacterOptWebp) {
      setHeroImgSrc(ZERO_LINE_ASSET_SPEC.heroCharacterWebp)
    } else if (heroImgSrc === ZERO_LINE_ASSET_SPEC.heroCharacterWebp) {
      setHeroImgSrc(ZERO_LINE_ASSET_SPEC.heroCharacterPng)
    } else {
      setHeroImgSrc(null)
      setHeroImgLoaded(false)
    }
  }

  const handleShowcaseImgLoad = (sectionId: ZeroLineShowcaseSectionId) => {
    setShowcaseMediaState((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        loaded: true,
      },
    }))
  }

  const handleShowcaseImgError = (sectionId: ZeroLineShowcaseSectionId) => {
    setShowcaseMediaState((prev) => {
      const current = prev[sectionId]
      const spec = ZERO_LINE_ASSET_SPEC.showcaseScreenshots[sectionId]
      if (!current.triedFallback) {
        return {
          ...prev,
          [sectionId]: {
            src: spec.png,
            loaded: false,
            triedFallback: true,
          },
        }
      }
      return {
        ...prev,
        [sectionId]: {
          src: null,
          loaded: false,
          triedFallback: true,
        },
      }
    })
  }

  // Close enlarged screenshot lightbox on Escape key
  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    closeLightboxBtnRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen])

  const currentIdx = PROJECT_IDS.indexOf(project.id)
  const nextProjectId = PROJECT_IDS[(currentIdx + 1) % PROJECT_IDS.length]
  const nextProject = allProjects[nextProjectId]

  const chapterMap = new Map<string, CaseStudyChapterTemplate>(
    chapters.map((ch) => [ch.id, ch])
  )

  const showcaseTabs = zeroLineData.interfaceShowcase.tabs
  const activeShowcaseTab =
    showcaseTabs.find((tab) => tab.id === activeShowcaseTabId) ??
    showcaseTabs[0]
  const activeMedia = showcaseMediaState[activeShowcaseTab.id]

  const handleShowcaseTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const count = showcaseTabs.length
    if (count === 0) return

    let nextIndex: number | null = null
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % count
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + count) % count
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = count - 1
    }

    if (nextIndex !== null) {
      e.preventDefault()
      const nextTab = showcaseTabs[nextIndex]
      setActiveShowcaseTabId(nextTab.id)
      tabRefs.current[nextTab.id]?.focus()
    }
  }

  return (
    <article
      className={`zeroline-case-study ${
        isEnteringBreak ? 'is-break-revealing' : ''
      }`}
      data-project-theme="zeroline"
      aria-labelledby="zeroline-hero-title"
    >
      {/* ====================================================================
          STEP 1 + STEP 4B ASYMMETRIC FIRST-SCREEN HERO & NOVA KEY-ART STAGE
          ==================================================================== */}
      <header className="zl-hero-stage">
        {/* Diagonal Slash Trajectory Echo bridging BREAK THE LINE -> Hero */}
        <div className="zl-hero-slash-echo" aria-hidden="true" />

        <div className="zl-hero-grid">
          <div className="zl-hero-narrative-col">
            <div className="zl-hero-primary-copy">
              <h1 id="zeroline-hero-title" className="zl-hero-display-title">
                <span>{zeroLineData.hero.titlePrefix}</span>
                <span className="zl-hero-slash-glyph" aria-hidden="true">
                  //
                </span>
                <span className="sr-only">//</span>
                <span>{zeroLineData.hero.titleSuffix}</span>
              </h1>

              <p className="zl-hero-positioning-title">
                {zeroLineData.hero.deliverableHeading}
              </p>

              <p className="zl-hero-subtitle">{zeroLineData.hero.subtitle}</p>
            </div>

            <div className="zl-hero-bottom-block">
              <dl className="zl-hero-meta-strip">
                {zeroLineData.hero.telemetry.map((item) => (
                  <div key={item.label} className="zl-hero-meta-item">
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>

              {project.externalUrl ? (
                <div className="zl-hero-actions-row">
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="zl-btn-primary-gold"
                  >
                    <span>
                      {zeroLineData.hero.liveSiteCta.replace(/\s*[↗→]$/u, '')}
                    </span>
                    <ArrowUpRightIcon size={16} />
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          <div className="zl-hero-character-col">
            <div className="zl-hero-character-showcase">
              <div className="zl-character-visual-stage">
                {heroImgSrc ? (
                  <img
                    src={heroImgSrc}
                    alt={`${project.title} — ${zeroLineData.hero.characterSlotTitle}`}
                    width={1024}
                    height={1536}
                    decoding="async"
                    fetchPriority="high"
                    className={`zl-hero-character-img ${
                      heroImgLoaded ? 'is-loaded' : 'is-hidden'
                    }`}
                    onLoad={() => setHeroImgLoaded(true)}
                    onError={handleHeroImgError}
                  />
                ) : null}

                <div
                  className="zl-character-stage-vignette"
                  aria-hidden="true"
                />

                <div className="zl-character-hud-callsign" aria-hidden="true">
                  <span className="zl-character-hud-index">01</span>
                  <div className="zl-character-hud-text">
                    <span className="zl-character-slot-badge">
                      {zeroLineData.hero.characterSlotBadge}
                    </span>
                    <span className="zl-character-coord">
                      CALLSIGN // NOVA
                    </span>
                  </div>
                </div>

                {!heroImgLoaded ? (
                  <div className="zl-character-placeholder-art">
                    <div className="zl-character-restrained-caption">
                      <strong className="zl-character-slot-title">
                        {zeroLineData.hero.characterSlotTitle}
                      </strong>
                      <span className="zl-character-slot-spec">
                        {zeroLineData.hero.characterSlotSpec}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Compact Chapter Selector (Visible <= 860px) */}
      <div className="cs-mobile-chapter-bar zl-mobile-chapter-bar">
        <label
          htmlFor="zl-mobile-chapter-select"
          className="cs-mobile-select-label"
        >
          {mobileChapterSelectLabel}
        </label>
        <select
          id="zl-mobile-chapter-select"
          className="cs-mobile-chapter-select"
          value={activeChapterId}
          onChange={(e) => onSelectChapter(e.target.value)}
        >
          {zeroLineData.acts.map((act) => (
            <optgroup key={act.actNumber} label={act.actTitle}>
              {act.chapterIds.map((chId) => {
                const ch = chapterMap.get(chId)
                if (!ch) return null
                return (
                  <option key={ch.id} value={ch.id}>
                    {ch.number}. {ch.title}
                  </option>
                )
              })}
            </optgroup>
          ))}
        </select>
      </div>

      {/* ====================================================================
          VERTICALLY STRUCTURED 6-ACT & 11-CHAPTER PORTFOLIO
          ==================================================================== */}
      <div className="zl-acts-stream">
        {zeroLineData.acts.map((act) => (
          <section
            key={act.actNumber}
            className={`zl-act-block zl-act-block--${act.layoutVariant}`}
            aria-label={act.actTitle}
          >
            {/* Expressive Secondary ACT Divider Header */}
            <div className="zl-act-banner">
              <div className="zl-act-banner-top">
                <span className="zl-act-pill">{act.actNumber}</span>
                <span className="zl-act-code-label">{act.actCode}</span>
              </div>
              <div className="zl-act-banner-main">
                <h2 className="zl-act-heading">{act.actTitle}</h2>
                <p className="zl-act-subtitle">{act.actSubtitle}</p>
              </div>
            </div>

            {/* Vertically Structured Chapters Within This ACT */}
            <div className="zl-act-chapters-group">
              {act.chapterIds.map((chId) => {
                const chapter = chapterMap.get(chId)
                const detail = zeroLineData.chapterDetails[chId]
                if (!chapter || !detail) return null

                return (
                  <section
                    key={chapter.id}
                    id={`cs-chapter-${chapter.id}`}
                    className={`zl-chapter-section ${
                      chapter.id === 'cs-09'
                        ? 'zl-chapter-section--featured'
                        : ''
                    }`}
                    aria-labelledby={`heading-${chapter.id}`}
                  >
                    {/* ======================================================
                        1. CHAPTER KICKER → 2. CHAPTER HEADING → 3. CONCISE INTRO
                        ====================================================== */}
                    <header className="zl-chapter-header">
                      <div className="zl-chapter-kicker-bar">
                        <span className="zl-chapter-num-label">
                          {chapter.number} · {act.actNumber}
                        </span>
                        {detail.evidenceBadge ? (
                          <>
                            <span
                              className="zl-chapter-kicker-sep"
                              aria-hidden="true"
                            >
                              /
                            </span>
                            <span className="zl-evidence-badge">
                              {detail.evidenceBadge}
                            </span>
                          </>
                        ) : null}
                      </div>

                      <h3
                        id={`heading-${chapter.id}`}
                        className="zl-chapter-title"
                      >
                        {chapter.title}
                      </h3>

                      <p className="zl-chapter-lead">{detail.lead}</p>

                      {detail.evidenceNote ? (
                        <p className="zl-chapter-scope-inline">
                          {detail.evidenceNote}
                        </p>
                      ) : null}
                    </header>

                    {/* ======================================================
                        4. DESIGN DECISIONS & VISUAL EVIDENCE
                        ====================================================== */}
                    <div className="zl-chapter-body">
                      {/* CHAPTER 01: PROJECT OVERVIEW */}
                      {chapter.id === 'cs-01' ? (
                        <>
                          <blockquote className="zl-positioning-blockquote">
                            {zeroLineData.overviewPositioningQuote}
                          </blockquote>

                          <div className="zl-editorial-two-col">
                            <div className="zl-editorial-col">
                              <h4 className="zl-sub-heading">
                                {zeroLineData.primaryResponsibilitiesHeading}
                              </h4>
                              <ul className="zl-editorial-list">
                                {zeroLineData.primaryResponsibilities.map(
                                  (item) => (
                                    <li key={item}>{item}</li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div className="zl-editorial-col">
                              <h4 className="zl-sub-heading">
                                {zeroLineData.scopeBoundaryHeading}
                              </h4>
                              <ul className="zl-editorial-list">
                                {zeroLineData.scopeBoundaryItems.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <ZeroLineMediaSlot
                            label={detail.tacticalTag}
                            title={detail.visualSlotTitle}
                            spec={detail.visualSlotSpec}
                          />
                        </>
                      ) : null}

                      {/* CHAPTER 02: TARGET USERS (3 SCENARIO-BASED TARGET GROUPS) */}
                      {chapter.id === 'cs-02' ? (
                        <>
                          <div className="zl-segments-grid">
                            {zeroLineData.userSegments.map((seg) => (
                              <div key={seg.id} className="zl-segment-card">
                                <div className="zl-segment-card-top">
                                  <span className="zl-segment-code">
                                    {seg.code}
                                  </span>
                                  <h4 className="zl-segment-title">
                                    {seg.title}
                                  </h4>
                                  <p className="zl-segment-profile">
                                    {seg.profile}
                                  </p>
                                </div>

                                <dl className="zl-segment-fields">
                                  <div className="zl-segment-field">
                                    <dt className="zl-segment-sublabel">
                                      {seg.primaryGoalLabel}
                                    </dt>
                                    <dd className="zl-segment-field-value">
                                      {seg.primaryGoal}
                                    </dd>
                                  </div>

                                  <div className="zl-segment-field">
                                    <dt className="zl-segment-sublabel">
                                      {seg.typicalTaskLabel}
                                    </dt>
                                    <dd className="zl-segment-field-value">
                                      {seg.typicalTask}
                                    </dd>
                                  </div>

                                  <div className="zl-segment-field">
                                    <dt className="zl-segment-sublabel">
                                      {seg.designConsiderationLabel}
                                    </dt>
                                    <dd className="zl-segment-field-value">
                                      {seg.designConsideration}
                                    </dd>
                                  </div>
                                </dl>

                                <div className="zl-segment-areas">
                                  <span className="zl-segment-sublabel">
                                    {seg.areasLabel}
                                  </span>
                                  <div className="zl-segment-pills">
                                    {seg.areas.map((area) => (
                                      <span
                                        key={area}
                                        className="zl-segment-area-pill"
                                      >
                                        {area}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <p className="zl-epistemic-note-line">
                            {zeroLineData.userSegmentsNotice}
                          </p>

                          <ZeroLineMediaSlot
                            label={detail.tacticalTag}
                            title={detail.visualSlotTitle}
                            spec={detail.visualSlotSpec}
                          />
                        </>
                      ) : null}

                      {/* CHAPTER 03: RESEARCH & DISCOVERY */}
                      {chapter.id === 'cs-03' ? (
                        <>
                          <div className="zl-open-requirements-section">
                            <h4 className="zl-sub-heading">
                              {zeroLineData.requirementsHeading}
                            </h4>
                            <ul className="zl-open-requirements-list">
                              {zeroLineData.requirementsItems.map((req) => (
                                <li
                                  key={req.code}
                                  className="zl-open-requirement-row"
                                >
                                  <span className="zl-open-req-index">
                                    {req.code}
                                  </span>
                                  <div className="zl-open-req-body">
                                    <strong className="zl-open-req-title">
                                      {req.title}
                                    </strong>
                                    <p className="zl-open-req-text">
                                      {req.reasoning}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="zl-evidence-matrix-section">
                            <h4 className="zl-sub-heading">
                              {zeroLineData.evidenceClassificationHeading}
                            </h4>
                            <div className="zl-evidence-matrix-grid">
                              {zeroLineData.evidenceClassificationItems.map(
                                (ev) => (
                                  <div
                                    key={ev.category}
                                    className="zl-evidence-matrix-item"
                                  >
                                    <div className="zl-evidence-card-top">
                                      <strong>{ev.category}</strong>
                                      <span className="zl-evidence-status-tag">
                                        {ev.status}
                                      </span>
                                    </div>
                                    <p>{ev.detail}</p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          <aside
                            className="zl-validation-callout"
                            aria-label={zeroLineData.futureValidationHeading}
                          >
                            <span className="zl-validation-callout-label">
                              {zeroLineData.futureValidationHeading}
                            </span>
                            <p className="zl-validation-callout-text">
                              {zeroLineData.futureValidationNote}
                            </p>
                          </aside>

                          <ZeroLineMediaSlot
                            label={detail.tacticalTag}
                            title={detail.visualSlotTitle}
                            spec={detail.visualSlotSpec}
                          />
                        </>
                      ) : null}

                      {/* CHAPTER 04: PROBLEM DEFINITION */}
                      {chapter.id === 'cs-04' ? (
                        <>
                          <div className="zl-central-challenge-banner">
                            <span className="zl-sub-heading">
                              {zeroLineData.centralProblemLabel}
                            </span>
                            <p className="zl-central-challenge-text">
                              {zeroLineData.centralProblemStatement}
                            </p>
                          </div>

                          <div className="zl-supporting-challenges-section">
                            <h4 className="zl-sub-heading">
                              {zeroLineData.supportingChallengesLabel}
                            </h4>
                            <ul className="zl-supporting-challenges-grid">
                              {zeroLineData.supportingChallenges.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <ZeroLineMediaSlot
                            label={detail.tacticalTag}
                            title={detail.visualSlotTitle}
                            spec={detail.visualSlotSpec}
                          />
                        </>
                      ) : null}

                      {/* CHAPTER 05: COMPETITIVE ANALYSIS */}
                      {chapter.id === 'cs-05' ? (
                        <>
                          <div className="zl-competitor-candidates-grid">
                            {zeroLineData.competitorCandidates.map((cand) => (
                              <div
                                key={cand.name}
                                className="zl-competitor-item"
                              >
                                <span className="zl-competitor-pos">
                                  {cand.positioning}
                                </span>
                                <strong>{cand.name}</strong>
                                <p>{cand.relevance}</p>
                              </div>
                            ))}
                          </div>

                          <div className="zl-competitor-criteria-section">
                            <h4 className="zl-sub-heading">
                              {zeroLineData.competitorCriteriaLabel}
                            </h4>
                            <div className="zl-criteria-pills">
                              {zeroLineData.competitorCriteria.map((crit) => (
                                <span key={crit} className="zl-criteria-pill">
                                  {crit}
                                </span>
                              ))}
                            </div>
                          </div>

                          <p className="zl-epistemic-note-line">
                            {zeroLineData.competitorNotice}
                          </p>

                          <ZeroLineMediaSlot
                            label={detail.tacticalTag}
                            title={detail.visualSlotTitle}
                            spec={detail.visualSlotSpec}
                          />
                        </>
                      ) : null}

                      {/* CHAPTER 06: DESIGN GOALS */}
                      {chapter.id === 'cs-06' ? (
                        <>
                          <div className="zl-goals-grid">
                            {zeroLineData.designGoals.map((goal) => (
                              <div key={goal.code} className="zl-goal-item">
                                <span className="zl-goal-code">
                                  {goal.code}
                                </span>
                                <h4 className="zl-goal-title">{goal.title}</h4>
                                <p className="zl-goal-desc">
                                  {goal.description}
                                </p>
                              </div>
                            ))}
                          </div>

                          <ZeroLineMediaSlot
                            label={detail.tacticalTag}
                            title={detail.visualSlotTitle}
                            spec={detail.visualSlotSpec}
                          />
                        </>
                      ) : null}

                      {/* CHAPTER 07: INFORMATION ARCHITECTURE (5 WEBSITE SECTIONS) */}
                      {chapter.id === 'cs-07' ? (
                        <>
                          <div className="zl-ia-blueprint-section">
                            <div className="zl-ia-header">
                              <h4 className="zl-sub-heading">
                                {zeroLineData.websiteIaHeading}
                              </h4>
                              <p className="zl-ia-lead">
                                {zeroLineData.websiteIaLead}
                              </p>
                            </div>

                            <div className="zl-ia-sections-grid">
                              {zeroLineData.websiteIaSections.map((sec) => (
                                <div
                                  key={sec.name}
                                  className="zl-ia-section-card"
                                >
                                  <div className="zl-ia-card-top">
                                    <span className="zl-ia-code">
                                      {sec.code}
                                    </span>
                                    <strong className="zl-ia-name">
                                      {sec.name}
                                    </strong>
                                  </div>
                                  <p className="zl-ia-role">{sec.role}</p>
                                  <ul className="zl-ia-elements-list">
                                    {sec.elements.map((el) => (
                                      <li key={el}>{el}</li>
                                    ))}
                                  </ul>
                                  <span className="zl-ia-status-note">
                                    {sec.statusNote}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <ZeroLineMediaSlot
                            label={detail.tacticalTag}
                            title={detail.visualSlotTitle}
                            spec={detail.visualSlotSpec}
                          />
                        </>
                      ) : null}

                      {/* CHAPTER 08: USER FLOWS & INTERACTION DESIGN */}
                      {chapter.id === 'cs-08' ? (
                        <>
                          <div className="zl-flows-section">
                            <div className="zl-ia-header">
                              <h4 className="zl-sub-heading">
                                {zeroLineData.websiteFlowsHeading}
                              </h4>
                              <p className="zl-ia-lead">
                                {zeroLineData.websiteFlowsLead}
                              </p>
                            </div>

                            <div className="zl-flows-list">
                              {zeroLineData.websiteFlows.map((flow) => (
                                <div key={flow.id} className="zl-flow-row">
                                  <div className="zl-flow-card-header">
                                    <div>
                                      <span className="zl-flow-code">
                                        {flow.code}
                                      </span>
                                      <h5 className="zl-flow-title">
                                        {flow.title}
                                      </h5>
                                    </div>
                                    <span className="zl-flow-status-badge">
                                      {flow.implementedStatus}
                                    </span>
                                  </div>

                                  <div
                                    className="zl-flow-steps-chain"
                                    aria-label={flow.title}
                                  >
                                    {flow.path.map((step, idx) => (
                                      <React.Fragment key={step}>
                                        <span className="zl-flow-step-node">
                                          {step}
                                        </span>
                                        {idx < flow.path.length - 1 ? (
                                          <span
                                            className="zl-flow-step-arrow"
                                            aria-hidden="true"
                                          >
                                            →
                                          </span>
                                        ) : null}
                                      </React.Fragment>
                                    ))}
                                  </div>

                                  <p className="zl-flow-boundary-note">
                                    {flow.boundaryNote}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <ZeroLineMediaSlot
                            label={detail.tacticalTag}
                            title={detail.visualSlotTitle}
                            spec={detail.visualSlotSpec}
                          />
                        </>
                      ) : null}

                      {/* ======================================================
                          STEP 4A — CHAPTER 09: FIVE-MODULE AUTHENTIC WEBSITE UI SHOWCASE
                          Tabs: HOME | NEWS | HEROES | STORE | ABOUT
                          ====================================================== */}
                      {chapter.id === 'cs-09' ? (
                        <>
                          <div
                            className="zl-interface-showcase"
                            role="region"
                            aria-label={zeroLineData.interfaceShowcase.heading}
                          >
                            <div className="zl-showcase-header">
                              <div className="zl-showcase-header-top">
                                <span className="zl-showcase-eyebrow">
                                  {zeroLineData.interfaceShowcase.eyebrow}
                                </span>
                                {project.externalUrl ? (
                                  <a
                                    href={project.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="zl-showcase-live-link"
                                  >
                                    <span>
                                      {
                                        zeroLineData.interfaceShowcase
                                          .openLiveSectionLabel
                                      }
                                    </span>
                                  </a>
                                ) : null}
                              </div>
                              <h4 className="zl-showcase-title">
                                {zeroLineData.interfaceShowcase.heading}
                              </h4>
                              <p className="zl-showcase-desc">
                                {zeroLineData.interfaceShowcase.description}
                              </p>
                            </div>

                            {/* Five-Module Tab Bar: HOME | NEWS | HEROES | STORE | ABOUT */}
                            <div
                              className="zl-showcase-tabs"
                              role="tablist"
                              aria-label={
                                zeroLineData.interfaceShowcase.heading
                              }
                            >
                              {showcaseTabs.map((tab, idx) => {
                                const isSelected =
                                  tab.id === activeShowcaseTab.id
                                return (
                                  <button
                                    key={tab.id}
                                    ref={(el) => {
                                      tabRefs.current[tab.id] = el
                                    }}
                                    id={`zl-tab-${tab.id}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={isSelected}
                                    aria-controls={`zl-tabpanel-${tab.id}`}
                                    tabIndex={isSelected ? 0 : -1}
                                    className={`zl-showcase-tab-btn ${
                                      isSelected ? 'is-active' : ''
                                    }`}
                                    onClick={() =>
                                      setActiveShowcaseTabId(tab.id)
                                    }
                                    onKeyDown={(e) =>
                                      handleShowcaseTabKeyDown(e, idx)
                                    }
                                  >
                                    <span className="zl-tab-code">
                                      {tab.code}
                                    </span>
                                    <strong className="zl-tab-label">
                                      {tab.label}
                                    </strong>
                                  </button>
                                )
                              })}
                            </div>

                            {/* Active Module Panel: Large Screenshot Stage + Concise Objective & Decisions */}
                            <div
                              id={`zl-tabpanel-${activeShowcaseTab.id}`}
                              role="tabpanel"
                              aria-labelledby={`zl-tab-${activeShowcaseTab.id}`}
                              className="zl-showcase-stage-vertical"
                            >
                              {/* 1. Large Authentic Website Screenshot Stage (or Restrained Missing Slot) */}
                              <div className="zl-showcase-media-viewport">
                                {activeMedia.src ? (
                                  <img
                                    key={activeMedia.src}
                                    src={activeMedia.src}
                                    alt={activeShowcaseTab.screenshotAlt}
                                    className={`zl-showcase-screenshot-img ${
                                      activeMedia.loaded
                                        ? 'is-loaded'
                                        : 'is-hidden'
                                    }`}
                                    onClick={() => {
                                      if (activeMedia.loaded) {
                                        setLightboxOpen(true)
                                      }
                                    }}
                                    onLoad={() =>
                                      handleShowcaseImgLoad(
                                        activeShowcaseTab.id
                                      )
                                    }
                                    onError={() =>
                                      handleShowcaseImgError(
                                        activeShowcaseTab.id
                                      )
                                    }
                                  />
                                ) : null}

                                {activeMedia.loaded && activeMedia.src ? (
                                  <div className="zl-showcase-media-bar">
                                    <span className="zl-showcase-media-caption">
                                      {activeShowcaseTab.code} ·{' '}
                                      {activeShowcaseTab.sectionName}
                                    </span>
                                    <button
                                      type="button"
                                      className="zl-showcase-enlarge-btn"
                                      onClick={() => setLightboxOpen(true)}
                                    >
                                      <span>
                                        {
                                          zeroLineData.interfaceShowcase
                                            .enlargeLabel
                                        }
                                      </span>
                                      <ArrowUpRightIcon size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <div
                                    className="zl-showcase-missing-slot"
                                    role="region"
                                    aria-label={
                                      activeShowcaseTab.missingScreenshotTitle
                                    }
                                  >
                                    <div className="zl-showcase-missing-left">
                                      <div className="zl-showcase-missing-header">
                                        <span className="zl-media-code">
                                          {activeShowcaseTab.code} ·{' '}
                                          {activeShowcaseTab.sectionName}
                                        </span>
                                        <span
                                          className="zl-media-empty-dot"
                                          aria-hidden="true"
                                        >
                                          ·
                                        </span>
                                        <strong className="zl-media-title">
                                          {
                                            activeShowcaseTab.missingScreenshotTitle
                                          }
                                        </strong>
                                      </div>
                                      <p className="zl-media-spec">
                                        {
                                          activeShowcaseTab.missingScreenshotNote
                                        }
                                      </p>
                                    </div>
                                    <span
                                      className="zl-media-empty-icon"
                                      aria-hidden="true"
                                    >
                                      <LayersIcon size={16} />
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* 2. Section Name + Design Objective + 2–3 Specific UI/UX Decisions */}
                              <div className="zl-showcase-stage-info-grid">
                                <div className="zl-showcase-stage-copy">
                                  <div className="zl-showcase-section-heading-row">
                                    <span className="zl-stage-code">
                                      {activeShowcaseTab.code}
                                    </span>
                                    <h5 className="zl-stage-heading">
                                      {activeShowcaseTab.sectionName}
                                    </h5>
                                  </div>
                                  <span className="zl-showcase-meta-label">
                                    {
                                      zeroLineData.interfaceShowcase
                                        .objectiveLabel
                                    }
                                  </span>
                                  <p className="zl-stage-summary">
                                    {activeShowcaseTab.objective}
                                  </p>
                                </div>

                                <div className="zl-showcase-decisions-col">
                                  <span className="zl-showcase-meta-label">
                                    {
                                      zeroLineData.interfaceShowcase
                                        .decisionsLabel
                                    }
                                  </span>
                                  <ul className="zl-stage-specs-list">
                                    {activeShowcaseTab.decisions.map((dec) => (
                                      <li key={dec}>{dec}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Official Brand Colour System Swatches */}
                          <div
                            className="zl-palette-strip zl-palette-strip--chapter"
                            aria-label="ZERO//LINE Official Colour System"
                          >
                            {zeroLineData.hero.paletteTokens.map((token) => (
                              <div key={token.role} className="zl-palette-chip">
                                <span
                                  className="zl-palette-swatch"
                                  style={{ backgroundColor: token.hex }}
                                  aria-hidden="true"
                                />
                                <div className="zl-palette-meta">
                                  <span className="zl-palette-hex">
                                    {token.hex}
                                  </span>
                                  <span className="zl-palette-name">
                                    {token.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <aside
                            className="zl-related-exploration-section"
                            aria-label={
                              zeroLineData.relatedClientExploration.title
                            }
                          >
                            <span className="zl-related-badge">
                              {zeroLineData.relatedClientExploration.badge}
                            </span>
                            <h4 className="zl-related-title">
                              {zeroLineData.relatedClientExploration.title}
                            </h4>
                            <p className="zl-related-desc">
                              {
                                zeroLineData.relatedClientExploration
                                  .description
                              }
                            </p>
                            <ul className="zl-editorial-list">
                              {zeroLineData.relatedClientExploration.points.map(
                                (pt) => (
                                  <li key={pt}>{pt}</li>
                                )
                              )}
                            </ul>
                          </aside>
                        </>
                      ) : null}

                      {/* CHAPTER 10: PROTOTYPING & ITERATION */}
                      {chapter.id === 'cs-10' ? (
                        <>
                          <div className="zl-iterations-list">
                            {zeroLineData.iterationItems.map((it) => (
                              <article
                                key={it.id}
                                className="zl-iteration-row"
                                aria-label={it.title}
                              >
                                <div className="zl-iteration-row-head">
                                  <span className="zl-iteration-code">
                                    {it.code}
                                  </span>
                                  <h4 className="zl-iteration-title">
                                    {it.title}
                                  </h4>
                                </div>

                                <div className="zl-iteration-steps-grid">
                                  <div className="zl-iteration-step">
                                    <span className="zl-iteration-step-label">
                                      {zeroLineData.iterationHeaders.issue}
                                    </span>
                                    <p className="zl-iteration-step-text">
                                      {it.issue}
                                    </p>
                                  </div>

                                  <div className="zl-iteration-step">
                                    <span className="zl-iteration-step-label">
                                      {zeroLineData.iterationHeaders.change}
                                    </span>
                                    <p className="zl-iteration-step-text">
                                      {it.change}
                                    </p>
                                  </div>

                                  <div className="zl-iteration-step zl-iteration-step--result">
                                    <span className="zl-iteration-step-label">
                                      {zeroLineData.iterationHeaders.result}
                                    </span>
                                    <p className="zl-iteration-step-text">
                                      {it.result}
                                    </p>
                                  </div>
                                </div>
                              </article>
                            ))}
                          </div>

                          <ZeroLineMediaSlot
                            label={detail.tacticalTag}
                            title={detail.visualSlotTitle}
                            spec={detail.visualSlotSpec}
                          />
                        </>
                      ) : null}

                      {/* CHAPTER 11: OUTCOMES & REFLECTION */}
                      {chapter.id === 'cs-11' ? (
                        <>
                          <div className="zl-editorial-two-col">
                            <div className="zl-editorial-col">
                              <h4 className="zl-sub-heading">
                                {
                                  zeroLineData.outcomesComparison
                                    .completedHeading
                                }
                              </h4>
                              <ul className="zl-editorial-list">
                                {zeroLineData.outcomesComparison.completedItems.map(
                                  (item) => (
                                    <li key={item}>{item}</li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div className="zl-editorial-col">
                              <h4 className="zl-sub-heading">
                                {zeroLineData.outcomesComparison.futureHeading}
                              </h4>
                              <ul className="zl-editorial-list">
                                {zeroLineData.outcomesComparison.futureItems.map(
                                  (item) => (
                                    <li key={item}>{item}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>

                          <ZeroLineMediaSlot
                            label={detail.tacticalTag}
                            title={detail.visualSlotTitle}
                            spec={detail.visualSlotSpec}
                          />
                        </>
                      ) : null}
                    </div>
                  </section>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ====================================================================
          ACCESSIBLE ENLARGED SCREENSHOT LIGHTBOX MODAL (When Authentic Asset Is Loaded)
          ==================================================================== */}
      {lightboxOpen && activeMedia.loaded && activeMedia.src ? (
        <div
          className="zl-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeShowcaseTab.sectionName} — ${activeShowcaseTab.screenshotAlt}`}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="zl-lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="zl-lightbox-topbar">
              <div className="zl-lightbox-title-group">
                <span className="zl-stage-code">{activeShowcaseTab.code}</span>
                <strong>{activeShowcaseTab.sectionName}</strong>
                <span className="zl-lightbox-sub">
                  {activeShowcaseTab.objective}
                </span>
              </div>
              <button
                ref={closeLightboxBtnRef}
                type="button"
                className="zl-lightbox-close-btn"
                aria-label={zeroLineData.interfaceShowcase.closePreviewLabel}
                onClick={() => setLightboxOpen(false)}
              >
                {zeroLineData.interfaceShowcase.closePreviewLabel} ✕
              </button>
            </div>
            <div className="zl-lightbox-body">
              <img
                src={activeMedia.src}
                alt={activeShowcaseTab.screenshotAlt}
                className="zl-lightbox-img"
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* ====================================================================
          FOOTER NAVIGATION: Return to Resume or Explore Next Case Study
          ==================================================================== */}
      <footer className="zl-article-footer">
        <button
          type="button"
          className="zl-back-resume-btn"
          onClick={onBackToResume}
        >
          <ArrowLeftIcon size={16} />
          <span>{backToResumeLabel}</span>
        </button>

        <button
          type="button"
          className="zl-next-project-btn"
          onClick={() => onSelectProject(nextProject.id)}
        >
          <div className="zl-next-project-text">
            <span className="zl-next-eyebrow">{nextProjectLabel}</span>
            <strong className="zl-next-name">
              {nextProject.number} · {nextProject.title}
            </strong>
          </div>
          <ArrowRightIcon size={18} />
        </button>
      </footer>
    </article>
  )
}
