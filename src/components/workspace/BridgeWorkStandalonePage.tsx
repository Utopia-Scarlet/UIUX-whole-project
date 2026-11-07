import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { useLanguage } from '../../context/LanguageContext'
import { ArrowLeftIcon, ArrowRightIcon } from '../icons/WorkspaceIcons'
import {
  BRIDGEWORK_DATA,
  type BridgeWorkSectionId,
} from '../../data/bridgeworkData'
import type { ProjectId, ProjectShellData } from '../../data/portfolioData'
import {
  BridgeWorkEntrance,
  SHARED_CARD_HERO_SPRING,
  type BridgeWorkCriterionKey,
} from './BridgeWorkEntrance'
import { BridgeWorkHypothesisExplorer } from './BridgeWorkHypothesisExplorer'
import '../../styles/bridgework-standalone.css'

export type BridgeWorkEntranceState = 'playing' | 'entered'

interface BridgeWorkStandalonePageProps {
  project: ProjectShellData
  allProjects: Record<ProjectId, ProjectShellData>
  /** True only when user intentionally entered BridgeWork AU from Portfolio/Resume */
  playIntroOnMount: boolean
  prefersReducedMotion: boolean
  onIntroFinished: () => void
  onBackToPortfolio: () => void
  onSelectProject: (projectId: ProjectId) => void
}

declare global {
  interface Window {
    __getBridgeWorkState?: () => {
      entranceState: BridgeWorkEntranceState
      activeSectionId: BridgeWorkSectionId
      selectedCardId: string
    }
  }
}

const HERO_CRITERIA_KEYS: ReadonlyArray<BridgeWorkCriterionKey> = [
  'PAY',
  'LOCATION',
  'REQUIREMENTS',
  'FLEXIBILITY',
]

/**
 * BW-01 through BW-02D — BridgeWork AU Standalone Fullscreen Case Study
 *
 * BW-02D Hero Redesign:
 * - Replaces the previous asymmetric two-column dashboard Hero with a balanced
 *   two-level editorial product-case-study Hero:
 *   1. Upper Level (Brand & Product Narrative):
 *      - Strong `BridgeWork AU` typography (`Bricolage Grotesque`)
 *      - Restrained green tagline (`Clear choices. Your control.`)
 *      - One concise sentence explaining the product
 *      - Compact metadata pills (`UX Research`, `Product Design`, `MVP Testing`, `5-Person Team Project`)
 *   2. Lower Level (Wide Product Showcase — `Discover → Save → Compare`):
 *      - A wide, visually dominant comparison interface showcasing two clearly
 *        differentiated Brisbane UX opportunity cards (`bw-card-01` and `bw-card-04`),
 *        clean comparison attributes (`Pay`, `Location`, `Requirements`, `Flexibility`),
 *        and restrained `Saved ✓` / `Selected` feedback.
 * - Preserves continuous shared-element transition (`LayoutGroup` + `layoutId`)
 *   from the autonomous cursor demo directly into the wide Hero product showcase.
 */
export const BridgeWorkStandalonePage: React.FC<
  BridgeWorkStandalonePageProps
> = ({
  allProjects,
  playIntroOnMount,
  prefersReducedMotion,
  onIntroFinished,
  onBackToPortfolio,
  onSelectProject,
}) => {
  const { locale, setLocale } = useLanguage()
  const isZh = locale === 'zh-CN'
  const bw = BRIDGEWORK_DATA[locale]
  const effectiveReducedMotion =
    prefersReducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  const [entranceState, setEntranceState] = useState<BridgeWorkEntranceState>(
    () =>
      playIntroOnMount && !effectiveReducedMotion ? 'playing' : 'entered'
  )
  const [selectedCardId, setSelectedCardId] = useState<string>('bw-card-01')
  const [activeSectionId, setActiveSectionId] =
    useState<BridgeWorkSectionId>('bw-01-challenge')
  const [showFullBmc, setShowFullBmc] = useState<boolean>(false)
  const [activeExhibitTab, setActiveExhibitTab] = useState<
    'compare-workspace' | 'profile-sharing' | 'application-tracker'
  >('compare-workspace')

  // Shared priority filter across Entrance, Hero Showcase, and Section 04 Workspace Exhibit
  const [activePriorityFilter, setActivePriorityFilter] =
    useState<BridgeWorkCriterionKey>('FLEXIBILITY')
  const [shareTranscript, setShareTranscript] = useState<boolean>(false)
  const [shareVisaDetails, setShareVisaDetails] = useState<boolean>(true)
  const [sharePortfolio, setSharePortfolio] = useState<boolean>(true)

  const heroTitleRef = useRef<HTMLHeadingElement | null>(null)

  // If reduced motion was active on intentional entry, notify parent immediately
  useEffect(() => {
    if (playIntroOnMount && effectiveReducedMotion) {
      onIntroFinished()
    }
  }, [effectiveReducedMotion, onIntroFinished, playIntroOnMount])

  const focusHeroTitleAfterEntry = useCallback(() => {
    const focusDelay = effectiveReducedMotion ? 40 : 480
    window.setTimeout(() => {
      heroTitleRef.current?.focus({ preventScroll: true })
    }, focusDelay)
  }, [effectiveReducedMotion])

  const handleSelectCardFromEntrance = useCallback(
    (cardId: string) => {
      setSelectedCardId(cardId)
      setEntranceState('entered')
      onIntroFinished()
      window.scrollTo({ top: 0, behavior: 'auto' })
      focusHeroTitleAfterEntry()
    },
    [focusHeroTitleAfterEntry, onIntroFinished]
  )

  const handleSkipEntrance = useCallback(() => {
    setEntranceState('entered')
    onIntroFinished()
    window.scrollTo({ top: 0, behavior: 'auto' })
    focusHeroTitleAfterEntry()
  }, [focusHeroTitleAfterEntry, onIntroFinished])

  const handleReplayEntrance = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setEntranceState('playing')
  }, [])

  // Keyboard accessibility: Escape skips entrance immediately
  useEffect(() => {
    if (entranceState !== 'playing') return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleSkipEntrance()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [entranceState, handleSkipEntrance])

  // Expose QA state
  useEffect(() => {
    window.__getBridgeWorkState = () => ({
      entranceState,
      activeSectionId,
      selectedCardId,
    })
    return () => {
      delete window.__getBridgeWorkState
    }
  }, [activeSectionId, entranceState, selectedCardId])

  // Scroll-spy for the 5 primary sections
  useEffect(() => {
    if (entranceState !== 'entered') return
    const sectionIds: ReadonlyArray<BridgeWorkSectionId> = [
      'bw-01-challenge',
      'bw-02-evidence',
      'bw-03-difference',
      'bw-04-mvp',
      'bw-05-learned',
    ]

    const handleScroll = () => {
      let current: BridgeWorkSectionId = 'bw-01-challenge'
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= 170) {
          current = id
        }
      }
      setActiveSectionId(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [entranceState])

  const handleJumpToSection = useCallback(
    (sectionId: BridgeWorkSectionId) => {
      setActiveSectionId(sectionId)
      const el = document.getElementById(sectionId)
      if (!el) return
      el.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    },
    [prefersReducedMotion]
  )

  // Two clearly differentiated Brisbane opportunities for the wide Hero product showcase
  const primaryHeroCard =
    bw.entrance.cards.find((c) => c.id === 'bw-card-01') ??
    bw.entrance.cards[0]
  const secondaryHeroCard =
    bw.entrance.cards.find((c) => c.id === 'bw-card-04') ??
    bw.entrance.cards[1]
  const heroComparisonCards = [primaryHeroCard, secondaryHeroCard]

  const heroMetaTags = isZh
    ? [
        'UX Research · 用户研究',
        'Product Design · 产品设计',
        'MVP Testing · 10 份实测记录',
        'Team Project · 五人高校团队项目',
      ]
    : [
        'UX Research',
        'Product Design',
        'MVP Testing (10 Records)',
        '5-Person Team Project',
      ]

  const currentExhibitTabObj =
    bw.section04Mvp.workspaceExhibit.tabs.find(
      (t) => t.id === activeExhibitTab
    ) ?? bw.section04Mvp.workspaceExhibit.tabs[0]

  return (
    <main
      id="main-content"
      className="bw-standalone-world"
      data-project-theme="bridgework"
      data-standalone-world="bridgework-au"
      data-entrance-state={entranceState}
      data-selected-card={selectedCardId}
    >
      {/* ====================================================================
          MINIMAL STANDALONE TOPBAR (Back to Portfolio · EN / 中文 · Skip/Replay)
          ==================================================================== */}
      <header className="bw-standalone-topbar">
        <div className="bw-topbar-inner">
          <div className="bw-topbar-left">
            <button
              type="button"
              className="bw-back-portfolio-btn"
              onClick={onBackToPortfolio}
            >
              <ArrowLeftIcon size={15} />
              <span>{bw.topbar.backToPortfolio}</span>
            </button>

            <span className="bw-topbar-brand-tag">
              <span className="bw-topbar-dot" aria-hidden="true" />
              <span>BRIDGEWORK AU</span>
              <span aria-hidden="true">·</span>
              <span>{bw.topbar.teamContextBadge}</span>
            </span>
          </div>

          <div className="bw-topbar-right">
            {entranceState === 'playing' ? (
              <button
                type="button"
                className="bw-action-btn"
                onClick={handleSkipEntrance}
                aria-label={bw.topbar.skipIntro}
              >
                <span>{bw.topbar.skipIntro}</span>
                <kbd className="bw-action-kbd">ESC</kbd>
              </button>
            ) : (
              <button
                type="button"
                className="bw-action-btn"
                onClick={handleReplayEntrance}
              >
                <span>{bw.topbar.replayIntro}</span>
              </button>
            )}

            <div
              className="bw-lang-switch"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                className={`bw-lang-btn ${locale === 'en' ? 'is-active' : ''}`}
                aria-pressed={locale === 'en'}
                onClick={() => setLocale('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={`bw-lang-btn ${
                  locale === 'zh-CN' ? 'is-active' : ''
                }`}
                aria-pressed={locale === 'zh-CN'}
                onClick={() => setLocale('zh-CN')}
              >
                中文
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          CONTINUOUS SPATIAL LAYOUT GROUP:
          The Demo Product Frame (`layoutId="bw-product-showcase-frame"`) and
          the two compared opportunity cards (`bw-card-surface-bw-card-01`,
          `bw-card-surface-bw-card-04`) smoothly expand into the redesigned
          two-level Case Study Hero.
          ==================================================================== */}
      <LayoutGroup id="bw-continuous-spatial-world">
        {entranceState === 'playing' ? (
          <BridgeWorkEntrance
            data={bw.entrance}
            initialSelectedCardId={selectedCardId}
            activeCriterion={activePriorityFilter}
            onCriterionChange={setActivePriorityFilter}
            prefersReducedMotion={effectiveReducedMotion}
            onSelectCard={handleSelectCardFromEntrance}
            onSkipIntro={handleSkipEntrance}
          />
        ) : (
          /* ==================================================================
             FULLSCREEN EDITORIAL CASE STUDY (REDESIGNED HERO + 5 SECTIONS)
             ================================================================== */
          <div className="bw-case-study-container">
            {/* ==============================================================
                BW-02D REDESIGNED TWO-LEVEL CASE STUDY HERO
                Upper Level: Editorial Brand & Product Narrative + Metadata Pills
                Lower Level: Wide Product Showcase (Discover → Save → Compare)
                ============================================================== */}
            <section
              className="bw-hero-sheet"
              aria-labelledby="bw-hero-main-title"
            >
              {/* UPPER LEVEL — Brand & Product Narrative */}
              <motion.div
                className="bw-hero-editorial-top"
                initial={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.42,
                  delay: prefersReducedMotion ? 0 : 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="bw-hero-meta-pills" aria-label="Project metadata">
                  {heroMetaTags.map((tag, i) => (
                    <span
                      key={tag}
                      className={`bw-hero-meta-pill ${
                        i === 0 ? 'is-primary-pill' : ''
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="bw-hero-headline-stack">
                  <div className="bw-hero-title-line">
                    <h1
                      id="bw-hero-main-title"
                      ref={heroTitleRef}
                      tabIndex={-1}
                      className="bw-hero-title"
                    >
                      {bw.hero.title}
                    </h1>
                    <span className="bw-hero-tagline">{bw.hero.tagline}</span>
                  </div>

                  <p className="bw-hero-lead">{bw.hero.positioningLead}</p>
                </div>
              </motion.div>

              {/* LOWER LEVEL — Wide, Visually Dominant Product Showcase (Discover → Save → Compare) */}
              <motion.div
                layout
                layoutId="bw-product-showcase-frame"
                transition={
                  prefersReducedMotion
                    ? { duration: 0.01 }
                    : SHARED_CARD_HERO_SPRING
                }
                className="bw-hero-showcase-frame"
              >
                {/* Showcase Top Bar: Connected Workflow Steps + Interactive Priority Pills */}
                <div className="bw-hero-showcase-bar">
                  <div className="bw-hero-showcase-flow">
                    <span className="bw-showcase-flow-step">
                      {isZh ? '01 · Discover 发现' : '01 · Discover'}
                    </span>
                    <span className="bw-showcase-flow-arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="bw-showcase-flow-step is-saved-step">
                      {isZh ? '02 · Save 收藏 (2)' : '02 · Save (2)'}
                    </span>
                    <span className="bw-showcase-flow-arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="bw-showcase-flow-step is-active-step">
                      {isZh ? '03 · Compare 同屏对比' : '03 · Compare'}
                    </span>
                  </div>

                  <div
                    className="bw-hero-showcase-criteria"
                    role="group"
                    aria-label={bw.entrance.criteriaHeaderLabel}
                  >
                    <span className="bw-showcase-criteria-label">
                      {isZh ? '高亮对比条件:' : 'Highlight criterion:'}
                    </span>
                    {HERO_CRITERIA_KEYS.map((crit) => {
                      const isCritActive = activePriorityFilter === crit
                      return (
                        <button
                          key={crit}
                          type="button"
                          aria-pressed={isCritActive}
                          className={`bw-showcase-crit-pill ${
                            isCritActive ? 'is-active' : ''
                          }`}
                          onClick={() => setActivePriorityFilter(crit)}
                        >
                          {crit}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Wide Two-Card Opportunity Comparison Grid */}
                <div className="bw-hero-showcase-grid">
                  {heroComparisonCards.map((card, idx) => {
                    const isPrimarySelected = card.id === selectedCardId
                    const isCard01 = card.id === 'bw-card-01'
                    return (
                      <motion.article
                        key={card.id}
                        layout
                        layoutId={`bw-card-surface-${card.id}`}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0.01 }
                            : SHARED_CARD_HERO_SPRING
                        }
                        data-showcase-card={card.id}
                        className={`bw-hero-opportunity-card ${
                          isPrimarySelected ? 'is-primary-selected' : 'is-secondary-compared'
                        }`}
                        onClick={() => setSelectedCardId(card.id)}
                      >
                        <motion.div
                          layoutId={`bw-card-header-${card.id}`}
                          className="bw-hero-opp-header"
                          transition={
                            prefersReducedMotion
                              ? { duration: 0.01 }
                              : SHARED_CARD_HERO_SPRING
                          }
                        >
                          <div className="bw-hero-opp-top-row">
                            <span className="bw-hero-opp-code">
                              {idx === 0
                                ? isZh
                                  ? '候选岗位 01 · BRISBANE CBD'
                                  : 'OPPORTUNITY 01 · BRISBANE CBD'
                                : isZh
                                  ? '候选岗位 02 · SOUTH BRISBANE'
                                  : 'OPPORTUNITY 02 · SOUTH BRISBANE'}
                            </span>

                            <div className="bw-hero-opp-badges">
                              <span className="bw-hero-saved-pill">
                                {isZh ? '已收藏 ✓' : 'Saved ✓'}
                              </span>
                              <span
                                className={`bw-hero-decision-pill ${
                                  isPrimarySelected ? 'is-selected' : ''
                                }`}
                              >
                                {isPrimarySelected
                                  ? isZh
                                    ? '优先准备投递'
                                    : 'Selected to Prepare First'
                                  : isZh
                                    ? '同屏候选对比'
                                    : 'Shortlisted for Comparison'}
                              </span>
                            </div>
                          </div>

                          <h2 className="bw-hero-opp-title">{card.role}</h2>
                          <p className="bw-hero-opp-company">
                            {card.companyContext}
                          </p>
                        </motion.div>

                        {/* 4-Attribute Comparison Grid */}
                        <motion.div
                          layoutId={`bw-card-attrs-${card.id}`}
                          className="bw-hero-opp-attrs-grid"
                          transition={
                            prefersReducedMotion
                              ? { duration: 0.01 }
                              : SHARED_CARD_HERO_SPRING
                          }
                        >
                          <div
                            className={`bw-hero-opp-attr ${
                              activePriorityFilter === 'PAY'
                                ? 'is-highlighted'
                                : ''
                            }`}
                          >
                            <span className="bw-hero-opp-attr-label">PAY</span>
                            <strong className="bw-hero-opp-attr-val">
                              {card.pay}
                            </strong>
                          </div>

                          <div
                            className={`bw-hero-opp-attr ${
                              activePriorityFilter === 'LOCATION'
                                ? 'is-highlighted'
                                : ''
                            }`}
                          >
                            <span className="bw-hero-opp-attr-label">
                              LOCATION
                            </span>
                            <strong className="bw-hero-opp-attr-val">
                              {card.location}
                            </strong>
                          </div>

                          <div
                            className={`bw-hero-opp-attr ${
                              activePriorityFilter === 'REQUIREMENTS'
                                ? 'is-highlighted'
                                : ''
                            }`}
                          >
                            <span className="bw-hero-opp-attr-label">
                              REQUIREMENTS
                            </span>
                            <strong className="bw-hero-opp-attr-val">
                              {card.requirements}
                            </strong>
                          </div>

                          <div
                            className={`bw-hero-opp-attr ${
                              activePriorityFilter === 'FLEXIBILITY'
                                ? 'is-highlighted'
                                : ''
                            }`}
                          >
                            <span className="bw-hero-opp-attr-label">
                              FLEXIBILITY
                              {isCard01 ? (
                                <span className="bw-hero-attr-advantage">
                                  {isZh ? ' · 16–24h/周' : ' · 16–24 hrs/wk'}
                                </span>
                              ) : (
                                <span className="bw-hero-attr-cap">
                                  {isZh ? ' · 12h/周上限' : ' · 12 hrs/wk cap'}
                                </span>
                              )}
                            </span>
                            <strong className="bw-hero-opp-attr-val">
                              {card.flexibility}
                            </strong>
                          </div>
                        </motion.div>
                      </motion.article>
                    )
                  })}
                </div>

                {/* Minimal Provenance & Decision Caption Footer */}
                <div className="bw-hero-showcase-footer">
                  <span className="bw-hero-showcase-summary">
                    {isZh
                      ? '同屏对比将薪资、办公方式、签证要求与课表灵活度并排对齐，帮助学生明确优先准备哪一份申请。'
                      : 'Side-by-side comparison aligns pay, hybrid arrangement, visa eligibility, and class flexibility so students can decide which application to prepare first.'}
                  </span>
                  <span className="bw-hero-showcase-provenance">
                    {isZh
                      ? '基于课程设计规范重构的产品对比界面示意'
                      : 'Product comparison interface · Reconstructed from coursework specification'}
                  </span>
                </div>
              </motion.div>
            </section>

            {/* STICKY 5-SECTION CASE STUDY NAVIGATION */}
            <nav
              className="bw-section-nav-bar"
              aria-label={bw.sectionNav.ariaLabel}
            >
              {bw.sectionNav.items.map((item) => {
                const isActive = activeSectionId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`bw-section-nav-btn ${
                      isActive ? 'is-active' : ''
                    }`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => handleJumpToSection(item.id)}
                  >
                    <span className="bw-section-nav-num">{item.number}</span>
                    <span>{item.shortTitle}</span>
                  </button>
                )
              })}
            </nav>

            {/* ================================================================
                SECTION 01 — THE CHALLENGE
                ================================================================ */}
            <section
              id="bw-01-challenge"
              className="bw-section-sheet"
              aria-labelledby="heading-bw-01"
            >
              <div className="bw-section-header">
                <span className="bw-section-eyebrow">
                  {bw.section01Challenge.eyebrow}
                </span>
                <h2 id="heading-bw-01" className="bw-section-title">
                  {bw.section01Challenge.title}
                </h2>
                <p className="bw-section-lead">{bw.section01Challenge.lead}</p>
              </div>

              <div className="bw-three-col-grid">
                {bw.section01Challenge.problemCards.map((card) => (
                  <article key={card.code} className="bw-info-card">
                    <div>
                      <span className="bw-card-code">{card.code}</span>
                      <h3
                        className="bw-card-title"
                        style={{ marginTop: '6px', marginBottom: '8px' }}
                      >
                        {card.title}
                      </h3>
                      <p className="bw-card-body">{card.observation}</p>
                    </div>
                    <span className="bw-card-status-tag">{card.statusTag}</span>
                  </article>
                ))}
              </div>

              <div>
                <div style={{ marginBottom: '12px' }}>
                  <h3 className="bw-card-title">
                    {bw.section01Challenge.initialHypothesesHeading}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--bw-muted)' }}>
                    {bw.section01Challenge.initialHypothesesSubnote}
                  </p>
                </div>

                <div className="bw-three-col-grid">
                  {bw.section01Challenge.initialHypotheses.map((hyp) => (
                    <article key={hyp.code} className="bw-info-card is-accent">
                      <div>
                        <span className="bw-card-code">{hyp.code}</span>
                        <p
                          className="bw-card-body"
                          style={{ marginTop: '8px', fontWeight: 500 }}
                        >
                          {hyp.statement}
                        </p>
                      </div>
                      <span className="bw-card-status-tag">
                        {hyp.epistemicStatus}
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* ================================================================
                SECTION 02 — FROM HYPOTHESIS TO EVIDENCE (Interactive Exhibit +
                Relocated Research Credibility Boundary Note)
                ================================================================ */}
            <BridgeWorkHypothesisExplorer
              data={bw.section02Evidence}
              researchBoundaryBanner={bw.hero.honestFramingBanner}
              prefersReducedMotion={prefersReducedMotion}
            />

            {/* ================================================================
                SECTION 03 — FINDING OUR DIFFERENCE (Competitors & BMC)
                ================================================================ */}
            <section
              id="bw-03-difference"
              className="bw-section-sheet"
              aria-labelledby="heading-bw-03"
            >
              <div className="bw-section-header">
                <span className="bw-section-eyebrow">
                  {bw.section03Difference.eyebrow}
                </span>
                <h2 id="heading-bw-03" className="bw-section-title">
                  {bw.section03Difference.title}
                </h2>
                <p className="bw-section-lead">{bw.section03Difference.lead}</p>
              </div>

              {/* Competitor & Student Tracking Methods Table */}
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <h3 className="bw-card-title">
                    {bw.section03Difference.comparisonHeading}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--bw-muted)' }}>
                    {bw.section03Difference.comparisonSubnote}
                  </p>
                </div>

                <div className="bw-table-scroll-wrap">
                  <table className="bw-comparison-table">
                    <thead>
                      <tr>
                        <th>
                          {bw.section03Difference.comparisonHeaders.platform}
                        </th>
                        <th>
                          {bw.section03Difference.comparisonHeaders.typicalRole}
                        </th>
                        <th>
                          {
                            bw.section03Difference.comparisonHeaders
                              .strengthObserved
                          }
                        </th>
                        <th>
                          {
                            bw.section03Difference.comparisonHeaders
                              .studentFriction
                          }
                        </th>
                        <th>
                          {
                            bw.section03Difference.comparisonHeaders
                              .bridgeworkRole
                          }
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bw.section03Difference.comparisonRows.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <strong>{row.platform}</strong>
                          </td>
                          <td>{row.typicalRole}</td>
                          <td>{row.strengthObserved}</td>
                          <td>{row.studentWorkflowFriction}</td>
                          <td className="is-bw-col">
                            {row.bridgeworkContinuityRole}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Visually Simplified Business Model Canvas + 9-Block Progressive Disclosure */}
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <h3 className="bw-card-title">
                    {bw.section03Difference.bmcHeading}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--bw-muted)' }}>
                    {bw.section03Difference.bmcSubnote}
                  </p>
                </div>

                <div className="bw-three-col-grid">
                  {bw.section03Difference.bmcSummaryPillars.map((pillar) => (
                    <article
                      key={pillar.code}
                      className={`bw-info-card ${
                        pillar.tone === 'hypothesis' ? 'is-accent' : ''
                      }`}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '8px',
                            flexWrap: 'wrap',
                            marginBottom: '6px',
                          }}
                        >
                          <span className="bw-card-code">{pillar.code}</span>
                          <span
                            className="bw-card-status-tag"
                            style={
                              pillar.tone === 'hypothesis'
                                ? {
                                    color: 'var(--bw-warning)',
                                    borderColor: 'var(--bw-warning-border)',
                                  }
                                : undefined
                            }
                          >
                            {pillar.epistemicBadge}
                          </span>
                        </div>
                        <h4
                          className="bw-card-title"
                          style={{ marginBottom: '10px' }}
                        >
                          {pillar.title}
                        </h4>
                        <ul className="bw-bullet-list">
                          {pillar.points.map((pt) => (
                            <li key={pt}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>

                <div style={{ marginTop: '14px' }}>
                  <button
                    type="button"
                    className="bw-disclosure-btn"
                    aria-expanded={showFullBmc}
                    onClick={() => setShowFullBmc((prev) => !prev)}
                  >
                    <span>
                      {showFullBmc
                        ? bw.section03Difference.bmcCollapseLabel
                        : bw.section03Difference.bmcExpandLabel}
                    </span>
                    <span aria-hidden="true">{showFullBmc ? '−' : '+'}</span>
                  </button>

                  {showFullBmc ? (
                    <div
                      className="bw-bmc-nine-grid"
                      style={{ marginTop: '14px' }}
                    >
                      {bw.section03Difference.bmcFullBlocks.map((blk) => (
                        <div
                          key={blk.id}
                          className={`bw-info-card ${
                            blk.validationTone === 'hypothesis'
                              ? 'is-accent'
                              : ''
                          }`}
                        >
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '6px',
                                flexWrap: 'wrap',
                                marginBottom: '4px',
                              }}
                            >
                              <span className="bw-card-code">{blk.code}</span>
                              <span className="bw-card-status-tag">
                                {blk.validationTag}
                              </span>
                            </div>
                            <h5
                              className="bw-card-title"
                              style={{
                                fontSize: '0.96rem',
                                marginBottom: '8px',
                              }}
                            >
                              {blk.title}
                            </h5>
                            <ul className="bw-bullet-list">
                              {blk.items.map((it) => (
                                <li key={it}>{it}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            {/* ================================================================
                SECTION 04 — FROM RESEARCH TO MVP (Artefacts, Priorities & Exhibits)
                ================================================================ */}
            <section
              id="bw-04-mvp"
              className="bw-section-sheet"
              aria-labelledby="heading-bw-04"
            >
              <div className="bw-section-header">
                <span className="bw-section-eyebrow">
                  {bw.section04Mvp.eyebrow}
                </span>
                <h2 id="heading-bw-04" className="bw-section-title">
                  {bw.section04Mvp.title}
                </h2>
                <p className="bw-section-lead">{bw.section04Mvp.lead}</p>
              </div>

              {/* 1. Separating Test Cards, Learning Cards, Task Cards, and MVP */}
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <h3 className="bw-card-title">
                    {bw.section04Mvp.artefactDistinctionHeading}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--bw-muted)' }}>
                    {bw.section04Mvp.artefactDistinctionSubnote}
                  </p>
                </div>

                <div className="bw-four-col-grid">
                  {bw.section04Mvp.artefactDistinctions.map((art) => (
                    <article key={art.code} className="bw-info-card">
                      <div>
                        <span className="bw-card-code">{art.code}</span>
                        <h4
                          className="bw-card-title"
                          style={{
                            fontSize: '0.98rem',
                            marginTop: '6px',
                            marginBottom: '6px',
                          }}
                        >
                          {art.term}
                        </h4>
                        <p className="bw-card-body">{art.purpose}</p>
                      </div>
                      <p className="bw-epistemic-footnote">
                        {art.projectExample}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              {/* 2. Three MVP Priority Tiers (Core, Supporting, Experimental) */}
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <h3 className="bw-card-title">
                    {bw.section04Mvp.mvpTiersHeading}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--bw-muted)' }}>
                    {bw.section04Mvp.mvpTiersSubnote}
                  </p>
                </div>

                <div className="bw-three-col-grid">
                  {bw.section04Mvp.mvpTiers.map((tier) => (
                    <article
                      key={tier.id}
                      className={`bw-iteration-card ${
                        tier.id === 'core' ? 'is-iter-03' : ''
                      }`}
                    >
                      <div>
                        <div className="bw-iteration-top">
                          <span className="bw-card-code">{tier.code}</span>
                          <span className="bw-card-status-tag">
                            {tier.statusBadge}
                          </span>
                        </div>
                        <h4
                          className="bw-card-title"
                          style={{ marginTop: '8px', marginBottom: '6px' }}
                        >
                          {tier.title}
                        </h4>
                        <p
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--bw-muted)',
                            marginBottom: '12px',
                          }}
                        >
                          {tier.description}
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          {tier.features.map((feat) => (
                            <div
                              key={feat.name}
                              style={{
                                padding: '9px 11px',
                                borderRadius: 'var(--bw-radius-sm)',
                                backgroundColor: 'var(--bw-bg)',
                                border: '1px solid var(--bw-border)',
                              }}
                            >
                              <strong
                                style={{
                                  display: 'block',
                                  fontSize: '0.83rem',
                                  marginBottom: '2px',
                                }}
                              >
                                {feat.name}
                              </strong>
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: '0.76rem',
                                  color: 'var(--bw-muted)',
                                }}
                              >
                                {feat.evidenceLink}
                              </span>
                              <span
                                style={{
                                  display: 'inline-block',
                                  marginTop: '4px',
                                  fontFamily: 'var(--bw-font-mono)',
                                  fontSize: '0.67rem',
                                  color: 'var(--bw-success)',
                                  fontWeight: 600,
                                }}
                              >
                                {feat.scopeStatus}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* 3. Reconstructed Design Exhibit */}
              <div className="bw-featured-exhibit">
                <div className="bw-exhibit-header">
                  <span className="bw-exhibit-badge">
                    {bw.section04Mvp.workspaceExhibit.badge}
                  </span>
                  <h3 className="bw-exhibit-title">
                    {bw.section04Mvp.workspaceExhibit.title}
                  </h3>
                  <div className="bw-metrics-disclaimer">
                    {bw.section04Mvp.workspaceExhibit.honestLabel}
                  </div>
                </div>

                <div className="bw-exhibit-tabs-bar" role="tablist">
                  {bw.section04Mvp.workspaceExhibit.tabs.map((tab) => {
                    const isSelected = activeExhibitTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        className={`bw-exhibit-tab-btn ${
                          isSelected ? 'is-active' : ''
                        }`}
                        onClick={() => setActiveExhibitTab(tab.id)}
                      >
                        {tab.code} · {tab.label}
                      </button>
                    )
                  })}
                </div>

                <div className="bw-interactive-mockup-frame">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--bw-border)',
                    }}
                  >
                    <div>
                      <span className="bw-card-code">
                        {currentExhibitTabObj.code}
                      </span>
                      <h4 className="bw-card-title">
                        {currentExhibitTabObj.label}
                      </h4>
                    </div>
                    <span className="bw-card-status-tag">
                      {currentExhibitTabObj.scopeTag}
                    </span>
                  </div>

                  <p className="bw-card-body">{currentExhibitTabObj.summary}</p>

                  {activeExhibitTab === 'compare-workspace' ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '14px',
                        backgroundColor: 'var(--bw-surface)',
                        border: '1px solid var(--bw-border)',
                        borderRadius: 'var(--bw-radius-sm)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span className="bw-card-code">
                          CLICK PRIORITY CRITERION TO TEST EXPLICIT ROW HIGHLIGHT
                          (#FFF4DC):
                        </span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {HERO_CRITERIA_KEYS.map((crit) => (
                            <button
                              key={crit}
                              type="button"
                              className={`bw-criteria-pill ${
                                activePriorityFilter === crit
                                  ? 'is-highlighted'
                                  : ''
                              }`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setActivePriorityFilter(crit)}
                            >
                              {crit}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bw-two-col-grid">
                        {bw.entrance.cards
                          .filter((c) => c.isShortlisted)
                          .slice(0, 2)
                          .map((card) => (
                            <div
                              key={card.id}
                              className={`bw-job-card ${
                                card.isSelectedWinner ? 'is-selected-winner' : ''
                              }`}
                            >
                              <div>
                                <div className="bw-job-card-top">
                                  <span className="bw-job-card-code">
                                    {card.code}
                                  </span>
                                  <span
                                    className={`bw-job-status-pill ${
                                      card.isSelectedWinner ? 'is-winner' : ''
                                    }`}
                                  >
                                    {card.isSelectedWinner
                                      ? bw.entrance.selectedBadge
                                      : bw.entrance.shortlistBadge}
                                  </span>
                                </div>
                                <h5 className="bw-job-role-title">{card.role}</h5>
                                <p className="bw-job-company-sub">
                                  {card.companyContext}
                                </p>
                              </div>

                              <div className="bw-job-attrs-grid">
                                <div
                                  className={`bw-job-attr-cell ${
                                    activePriorityFilter === 'PAY'
                                      ? 'is-priority-hit'
                                      : ''
                                  }`}
                                >
                                  <span className="bw-job-attr-label">PAY</span>
                                  <span className="bw-job-attr-val">
                                    {card.pay}
                                  </span>
                                </div>
                                <div
                                  className={`bw-job-attr-cell ${
                                    activePriorityFilter === 'LOCATION'
                                      ? 'is-priority-hit'
                                      : ''
                                  }`}
                                >
                                  <span className="bw-job-attr-label">
                                    LOCATION
                                  </span>
                                  <span className="bw-job-attr-val">
                                    {card.location}
                                  </span>
                                </div>
                                <div
                                  className={`bw-job-attr-cell ${
                                    activePriorityFilter === 'REQUIREMENTS'
                                      ? 'is-priority-hit'
                                      : ''
                                  }`}
                                >
                                  <span className="bw-job-attr-label">
                                    REQUIREMENTS
                                  </span>
                                  <span className="bw-job-attr-val">
                                    {card.requirements}
                                  </span>
                                </div>
                                <div
                                  className={`bw-job-attr-cell ${
                                    activePriorityFilter === 'FLEXIBILITY'
                                      ? 'is-priority-hit'
                                      : ''
                                  }`}
                                >
                                  <span className="bw-job-attr-label">
                                    FLEXIBILITY
                                  </span>
                                  <span className="bw-job-attr-val">
                                    {card.flexibility}
                                  </span>
                                </div>
                              </div>

                              {card.privateNotePreview ? (
                                <div className="bw-job-note-strip">
                                  {card.privateNotePreview}
                                </div>
                              ) : null}
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : activeExhibitTab === 'profile-sharing' ? (
                    <div
                      className="bw-two-col-grid"
                      style={{
                        padding: '14px',
                        backgroundColor: 'var(--bw-surface)',
                        border: '1px solid var(--bw-border)',
                        borderRadius: 'var(--bw-radius-sm)',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'var(--bw-bg)',
                          border: '1px solid var(--bw-border)',
                          borderRadius: 'var(--bw-radius-sm)',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <span className="bw-card-code">
                          FIELD-LEVEL SHARING CONTROLS (TOGGLE TO PREVIEW EMPLOYER
                          VIEW)
                        </span>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            backgroundColor: 'var(--bw-surface)',
                            borderRadius: 'var(--bw-radius-xs)',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                          }}
                        >
                          <span>
                            <strong>Portfolio &amp; Case Studies</strong> (UQ
                            Interaction Design)
                          </span>
                          <input
                            type="checkbox"
                            checked={sharePortfolio}
                            onChange={(e) => setSharePortfolio(e.target.checked)}
                          />
                        </label>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            backgroundColor: 'var(--bw-surface)',
                            borderRadius: 'var(--bw-radius-xs)',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                          }}
                        >
                          <span>
                            <strong>Visa Work-Rights Summary</strong> (Student
                            Visa Eligible)
                          </span>
                          <input
                            type="checkbox"
                            checked={shareVisaDetails}
                            onChange={(e) =>
                              setShareVisaDetails(e.target.checked)
                            }
                          />
                        </label>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            backgroundColor: 'var(--bw-surface)',
                            borderRadius: 'var(--bw-radius-xs)',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                          }}
                        >
                          <span>
                            <strong>Full Academic Transcript PDF</strong>{' '}
                            (Sensitive Document)
                          </span>
                          <input
                            type="checkbox"
                            checked={shareTranscript}
                            onChange={(e) => setShareTranscript(e.target.checked)}
                          />
                        </label>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--bw-bg)',
                          border: '1.5px solid var(--bw-success)',
                          borderRadius: 'var(--bw-radius-sm)',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <span
                          className="bw-card-code"
                          style={{ color: 'var(--bw-success)' }}
                        >
                          PRE-SUBMISSION EMPLOYER PREVIEW · JUNIOR PRODUCT &amp;
                          UX DESIGNER
                        </span>
                        <p style={{ fontSize: '0.81rem' }}>
                          <strong>Applicant Draft:</strong> Reusable Student
                          Profile (Tailored for Education Tech Studio)
                        </p>
                        <ul className="bw-bullet-list">
                          <li>
                            Portfolio Links:{' '}
                            <strong>
                              {sharePortfolio
                                ? 'Shared with Employer'
                                : 'Hidden (Private)'}
                            </strong>
                          </li>
                          <li>
                            Work Rights:{' '}
                            <strong>
                              {shareVisaDetails
                                ? 'Shared (16–24 hrs/wk Eligible)'
                                : 'Hidden (Private)'}
                            </strong>
                          </li>
                          <li>
                            Academic Transcript:{' '}
                            <strong>
                              {shareTranscript
                                ? 'Attached to Submission'
                                : 'Withheld until interview stage'}
                            </strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="bw-three-col-grid">
                      <div className="bw-info-card">
                        <span className="bw-card-code">
                          STAGE 01 · SHORTLISTED &amp; COMPARING
                        </span>
                        <strong className="bw-card-title">
                          Graduate UI/UX Designer (Melbourne)
                        </strong>
                        <p className="bw-card-body">
                          $68k/yr · On-site · Saved with private note: hold until
                          end-of-semester graduation window.
                        </p>
                      </div>
                      <div
                        className="bw-info-card"
                        style={{
                          borderColor: 'var(--bw-success)',
                          backgroundColor: 'var(--bw-success-soft)',
                        }}
                      >
                        <span
                          className="bw-card-code"
                          style={{ color: 'var(--bw-success)' }}
                        >
                          STAGE 02 · DRAFT READY FOR SUBMISSION
                        </span>
                        <strong className="bw-card-title">
                          Junior Product &amp; UX Designer (Brisbane)
                        </strong>
                        <p className="bw-card-body">
                          $38/hr · Hybrid · Tailored profile draft B + field-level
                          sharing preview verified.
                        </p>
                      </div>
                      <div className="bw-info-card is-accent">
                        <span
                          className="bw-card-code"
                          style={{ color: 'var(--bw-warning)' }}
                        >
                          STAGE 03 · SUBMITTED &amp; TRACKED
                        </span>
                        <strong className="bw-card-title">
                          Student UX Research Assistant (Brisbane)
                        </strong>
                        <p className="bw-card-body">
                          $35/hr · Casual · Application snapshot archived with
                          submission date &amp; private interview notes.
                        </p>
                      </div>
                    </div>
                  )}

                  <ul className="bw-bullet-list">
                    {currentExhibitTabObj.keyUiElements.map((el) => (
                      <li key={el}>{el}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ================================================================
                SECTION 05 — WHAT WE LEARNED (Findings, Limitations & My Role)
                ================================================================ */}
            <section
              id="bw-05-learned"
              className="bw-section-sheet"
              aria-labelledby="heading-bw-05"
            >
              <div className="bw-section-header">
                <span className="bw-section-eyebrow">
                  {bw.section05Learned.eyebrow}
                </span>
                <h2 id="heading-bw-05" className="bw-section-title">
                  {bw.section05Learned.title}
                </h2>
                <p className="bw-section-lead">{bw.section05Learned.lead}</p>
              </div>

              {/* 1. Key Learnings */}
              <div>
                <h3
                  className="bw-card-title"
                  style={{ marginBottom: '12px' }}
                >
                  {bw.section05Learned.keyLearningsHeading}
                </h3>
                <div className="bw-three-col-grid">
                  {bw.section05Learned.keyLearnings.map((item) => (
                    <article key={item.code} className="bw-info-card">
                      <div>
                        <span className="bw-card-code">{item.code}</span>
                        <h4
                          className="bw-card-title"
                          style={{ marginTop: '6px', marginBottom: '8px' }}
                        >
                          {item.title}
                        </h4>
                        <p className="bw-card-body">{item.detail}</p>
                      </div>
                      <span className="bw-card-status-tag">
                        {item.epistemicTag}
                      </span>
                    </article>
                  ))}
                </div>
              </div>

              {/* 2. Unresolved Hypotheses & Limitations */}
              <div>
                <h3
                  className="bw-card-title"
                  style={{ marginBottom: '12px' }}
                >
                  {bw.section05Learned.unresolvedHeading}
                </h3>
                <div className="bw-three-col-grid">
                  {bw.section05Learned.unresolvedItems.map((lim) => (
                    <article key={lim.code} className="bw-info-card is-accent">
                      <div>
                        <span
                          className="bw-card-code"
                          style={{ color: 'var(--bw-warning)' }}
                        >
                          {lim.code}
                        </span>
                        <h4
                          className="bw-card-title"
                          style={{ marginTop: '6px', marginBottom: '8px' }}
                        >
                          {lim.topic}
                        </h4>
                        <p className="bw-card-body">{lim.reason}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* 3. Clearly Attributed Individual Contributions */}
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <h3 className="bw-card-title">
                    {bw.section05Learned.myContributionHeading}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--bw-muted)' }}>
                    {bw.section05Learned.myContributionSubnote}
                  </p>
                </div>

                <div className="bw-contributions-grid">
                  {bw.section05Learned.myContributions.map((contrib) => (
                    <article key={contrib.code} className="bw-info-card">
                      <div>
                        <span
                          className="bw-card-code"
                          style={{ color: 'var(--bw-success)' }}
                        >
                          {contrib.code}
                        </span>
                        <h4
                          className="bw-card-title"
                          style={{ marginTop: '4px', marginBottom: '6px' }}
                        >
                          {contrib.area}
                        </h4>
                        <p className="bw-card-body">{contrib.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <p
                  className="bw-epistemic-footnote"
                  style={{ marginTop: '12px' }}
                >
                  {bw.section05Learned.teamAttributionBoundary}
                </p>
              </div>
            </section>

            {/* CASE STUDY FOOTER NAVIGATION */}
            <footer className="bw-case-footer">
              <button
                type="button"
                className="bw-back-portfolio-btn"
                onClick={onBackToPortfolio}
              >
                <ArrowLeftIcon size={15} />
                <span>{bw.topbar.backToPortfolio}</span>
              </button>

              <div className="bw-footer-projects-row">
                <span
                  style={{
                    fontFamily: 'var(--bw-font-mono)',
                    fontSize: '0.73rem',
                    color: 'var(--bw-muted)',
                  }}
                >
                  {bw.section05Learned.footerNextProjectLabel}:
                </span>
                <button
                  type="button"
                  className="bw-action-btn"
                  onClick={() => onSelectProject('zero-line')}
                >
                  <span>02 · {allProjects['zero-line'].title}</span>
                  <ArrowRightIcon size={14} />
                </button>
                <button
                  type="button"
                  className="bw-action-btn"
                  onClick={() => onSelectProject('lovestory')}
                >
                  <span>03 · {allProjects.lovestory.title}</span>
                  <ArrowRightIcon size={14} />
                </button>
              </div>
            </footer>
          </div>
        )}
      </LayoutGroup>
    </main>
  )
}
