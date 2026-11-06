import React from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  LayersIcon,
} from '../icons/WorkspaceIcons'
import {
  PROJECT_IDS,
  type CaseStudyChapterTemplate,
  type ProjectId,
  type ProjectShellData,
} from '../../data/portfolioData'

interface CaseStudyMediaPlaceholderProps {
  label: string
  subnote?: string
  badgeText: string
  aspect?: 'hero' | 'wide' | 'split' | 'compact'
}

export const CaseStudyMediaPlaceholder: React.FC<
  CaseStudyMediaPlaceholderProps
> = ({ label, subnote, badgeText, aspect = 'wide' }) => {
  if (aspect === 'split') {
    return (
      <div
        className="cs-media-split-grid"
        role="region"
        aria-label={label}
      >
        <div className="cs-media-slot cs-media-slot--split">
          <div className="cs-media-slot-top">
            <span className="cs-media-badge">{badgeText} · A</span>
            <LayersIcon size={16} />
          </div>
          <div className="cs-media-slot-center">
            <p className="cs-media-label">{label}</p>
            {subnote ? <p className="cs-media-subnote">{subnote}</p> : null}
          </div>
        </div>

        <div className="cs-media-slot cs-media-slot--split">
          <div className="cs-media-slot-top">
            <span className="cs-media-badge">{badgeText} · B</span>
            <LayersIcon size={16} />
          </div>
          <div className="cs-media-slot-center">
            <p className="cs-media-label">{label}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`cs-media-slot cs-media-slot--${aspect}`}
      role="region"
      aria-label={label}
    >
      <div className="cs-media-slot-top">
        <span className="cs-media-badge">{badgeText}</span>
        <LayersIcon size={16} />
      </div>

      <div className="cs-media-slot-center">
        <p className="cs-media-label">{label}</p>
        {subnote ? <p className="cs-media-subnote">{subnote}</p> : null}
      </div>
    </div>
  )
}

interface CaseStudyViewProps {
  project: ProjectShellData
  allProjects: Record<ProjectId, ProjectShellData>
  chapters: ReadonlyArray<CaseStudyChapterTemplate>
  activeChapterId: string
  backToResumeLabel: string
  designFocusHeading: string
  placeholderBadgeText: string
  mobileChapterSelectLabel: string
  nextProjectLabel: string
  onBackToResume: () => void
  onSelectChapter: (chapterId: string) => void
  onSelectProject: (projectId: ProjectId) => void
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({
  project,
  allProjects,
  chapters,
  activeChapterId,
  backToResumeLabel,
  designFocusHeading,
  placeholderBadgeText,
  mobileChapterSelectLabel,
  nextProjectLabel,
  onBackToResume,
  onSelectChapter,
  onSelectProject,
}) => {
  const currentIdx = PROJECT_IDS.indexOf(project.id)
  const nextProjectId = PROJECT_IDS[(currentIdx + 1) % PROJECT_IDS.length]
  const nextProject = allProjects[nextProjectId]

  return (
    <article
      className="case-study-article"
      data-project-theme={project.accentTheme}
      aria-labelledby="case-study-main-title"
    >
      {/* Top Action Bar: Back to Resume & Live External Website Link */}
      <div className="cs-top-bar">
        <button
          type="button"
          className="cs-back-resume-btn"
          onClick={onBackToResume}
        >
          <ArrowLeftIcon size={16} />
          <span>{backToResumeLabel}</span>
        </button>

        {project.externalUrl && project.externalLinkLabel ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-external-site-link"
          >
            <span>{project.externalLinkLabel}</span>
            <ArrowUpRightIcon size={15} />
          </a>
        ) : null}
      </div>

      {/* Editorial Case Study Header */}
      <header className="cs-hero-header">
        <div className="cs-meta-eyebrow-row">
          <span className="cs-project-number-pill">
            {project.number} — {project.title}
          </span>
          <span className="cs-project-meta-item">{project.period}</span>
          <span className="cs-project-meta-sep" aria-hidden="true">
            ·
          </span>
          <span className="cs-project-meta-item">{project.projectType}</span>
        </div>

        <h1 id="case-study-main-title" className="cs-hero-title">
          {project.title}
        </h1>
        <p className="cs-hero-category">{project.category}</p>

        <p className="cs-hero-overview">{project.summary}</p>

        {/* Project Responsibilities & Scope Strip (Editorial Typographic Grid, Not Nested Cards) */}
        <div className="cs-hero-specs-grid">
          <div className="cs-spec-column">
            <span className="cs-spec-label">
              {project.responsibilitiesLabel}
            </span>
            <p className="cs-spec-value">{project.responsibilities}</p>
          </div>

          <div className="cs-spec-column">
            <span className="cs-spec-label">{designFocusHeading}</span>
            <ul className="cs-spec-focus-list">
              {project.designFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Project-Scoped Hero Visual Preview Slot */}
        <div className="cs-hero-media-wrap">
          <CaseStudyMediaPlaceholder
            label={project.heroPreviewLabel}
            subnote={project.heroPreviewSubnote}
            badgeText={`${project.title} · Hero Visual Preview`}
            aspect="hero"
          />
        </div>
      </header>

      {/* Mobile & Tablet Compact Chapter Selector (Visible <= 860px) */}
      <div className="cs-mobile-chapter-bar">
        <label htmlFor="cs-mobile-chapter-select" className="cs-mobile-select-label">
          {mobileChapterSelectLabel}
        </label>
        <select
          id="cs-mobile-chapter-select"
          className="cs-mobile-chapter-select"
          value={activeChapterId}
          onChange={(e) => onSelectChapter(e.target.value)}
        >
          {chapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.number}. {ch.title}
            </option>
          ))}
        </select>
      </div>

      {/* 11-Section Structured Case Study Chapters */}
      <div className="cs-chapters-stream">
        {chapters.map((chapter) => {
          const isOverviewChapter = chapter.number === '01'
          return (
            <section
              key={chapter.id}
              id={`cs-chapter-${chapter.id}`}
              className="cs-chapter-section"
              aria-labelledby={`heading-${chapter.id}`}
            >
              <div className="cs-chapter-grid">
                {/* Left Column: Chapter Index, Title & Scope Note */}
                <div className="cs-chapter-meta-col">
                  <span className="cs-chapter-num">{chapter.number}</span>
                  <h2 id={`heading-${chapter.id}`} className="cs-chapter-title">
                    {chapter.title}
                  </h2>
                  <p className="cs-chapter-scope">{chapter.scopeNote}</p>
                </div>

                {/* Right Column: Structured Content Slot & Visual/Diagram Placeholder */}
                <div className="cs-chapter-body-col">
                  {isOverviewChapter ? (
                    <div className="cs-overview-verified-block">
                      <p className="cs-verified-intro">{project.summary}</p>
                      <ul className="cs-verified-scope-list">
                        {project.verifiedContributions.map((contribution) => (
                          <li key={contribution}>{contribution}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="cs-content-placeholder-slot">
                    <span className="cs-placeholder-indicator" aria-hidden="true" />
                    <p className="cs-content-placeholder-text">
                      {chapter.contentPlaceholder}
                    </p>
                  </div>

                  <CaseStudyMediaPlaceholder
                    label={chapter.mediaPlaceholderLabel}
                    badgeText={`${chapter.number} · ${placeholderBadgeText}`}
                    aspect={chapter.mediaAspect ?? 'wide'}
                  />
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* Footer Navigation: Return to Resume or Continue to Next Project Case Study */}
      <footer className="cs-article-footer">
        <button
          type="button"
          className="cs-back-resume-btn"
          onClick={onBackToResume}
        >
          <ArrowLeftIcon size={16} />
          <span>{backToResumeLabel}</span>
        </button>

        <button
          type="button"
          className="cs-next-project-btn"
          onClick={() => onSelectProject(nextProject.id)}
        >
          <div className="cs-next-project-text">
            <span className="cs-next-eyebrow">{nextProjectLabel}</span>
            <strong className="cs-next-name">
              {nextProject.number} — {nextProject.title}
            </strong>
          </div>
          <ArrowRightIcon size={20} />
        </button>
      </footer>
    </article>
  )
}
