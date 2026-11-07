import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type {
  BridgeWorkLocaleData,
  BridgeWorkResearchStageId,
} from '../../data/bridgeworkData'

interface BridgeWorkHypothesisExplorerProps {
  data: BridgeWorkLocaleData['section02Evidence']
  researchBoundaryBanner?: BridgeWorkLocaleData['hero']['honestFramingBanner']
  prefersReducedMotion: boolean
}

const STAGE_ORDER: ReadonlyArray<BridgeWorkResearchStageId> = [
  'hypothesis',
  'test-card',
  'evidence',
  'learning-card',
  'design-decision',
]

/**
 * BW-01 / BW-02D — Section 02: From Hypothesis to Evidence
 *
 * Implements:
 * 1. Research Credibility & Scope Boundary Note (relocated from the Hero in BW-02D
 *    so the Hero remains a clean editorial product presentation while Section 02
 *    preserves full methodological transparency).
 * 2. Three-Iteration Research Progression (Iteration 01 → Iteration 02 → Iteration 03)
 * 3. Featured Interactive Research Exhibit:
 *    HYPOTHESIS → TEST CARD → EVIDENCE → LEARNING CARD → DESIGN DECISION
 *    on "Saving & Comparing Job Opportunities" (SAVE 10/10, COMPARE 8/10, PRIORITIES 6/10, NOTES 5/10)
 * 4. Before / After UI Response Comparison addressing the 7/10 comparison friction
 * 5. Progressive disclosure for the 4 additional research areas
 */
export const BridgeWorkHypothesisExplorer: React.FC<
  BridgeWorkHypothesisExplorerProps
> = ({ data, researchBoundaryBanner, prefersReducedMotion }) => {
  const [activeStageId, setActiveStageId] =
    useState<BridgeWorkResearchStageId>('hypothesis')
  const [showSecondaryTopics, setShowSecondaryTopics] =
    useState<boolean>(false)

  const exhibit = data.featuredExhibit
  const activeStage = exhibit.stages[activeStageId]

  return (
    <section
      id="bw-02-evidence"
      className="bw-section-sheet"
      aria-labelledby="heading-bw-02"
    >
      <div className="bw-section-header">
        <span className="bw-section-eyebrow">{data.eyebrow}</span>
        <h2 id="heading-bw-02" className="bw-section-title">
          {data.title}
        </h2>
        <p className="bw-section-lead">{data.lead}</p>

        {researchBoundaryBanner ? (
          <div className="bw-section-boundary-note">
            <span className="bw-section-boundary-badge">
              {researchBoundaryBanner.badge}
            </span>
            <span className="bw-section-boundary-text">
              {researchBoundaryBanner.text}
            </span>
          </div>
        ) : null}
      </div>

      {/* 1. Three-Iteration Research Progression */}
      <div>
        <div style={{ marginBottom: '12px' }}>
          <h3 className="bw-card-title">{data.iterationsHeading}</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--bw-muted)' }}>
            {data.iterationsSubnote}
          </p>
        </div>

        <div className="bw-iterations-grid">
          {data.iterations.map((iter) => (
            <article
              key={iter.id}
              className={`bw-iteration-card ${
                iter.id === 'iter-03' ? 'is-iter-03' : ''
              }`}
            >
              <div>
                <div className="bw-iteration-top">
                  <span className="bw-card-code">{iter.code}</span>
                  <span className="bw-card-status-tag">{iter.statusTag}</span>
                </div>
                <h4
                  className="bw-card-title"
                  style={{ marginTop: '8px', marginBottom: '6px' }}
                >
                  {iter.title}
                </h4>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--bw-muted)',
                    marginBottom: '10px',
                  }}
                >
                  {iter.themeOrFocus}
                </p>

                <span
                  className="bw-card-code"
                  style={{ display: 'block', marginBottom: '5px' }}
                >
                  {iter.hypothesesOrPatternsHeading}
                </span>
                <ul className="bw-bullet-list">
                  {iter.hypothesesOrPatterns.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="bw-iteration-learning-box">
                  <span
                    className="bw-card-code"
                    style={{
                      display: 'block',
                      color: 'var(--bw-ink)',
                      marginBottom: '3px',
                    }}
                  >
                    {iter.keyLearningHeading}
                  </span>
                  <p style={{ fontSize: '0.81rem', lineHeight: 1.45 }}>
                    {iter.keyLearning}
                  </p>
                </div>
                <p className="bw-epistemic-footnote">
                  {iter.epistemicBoundary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 2. Featured Interactive Research Exhibit: Hypothesis → Test Card → Evidence → Learning Card → Design Decision */}
      <div className="bw-featured-exhibit">
        <div className="bw-exhibit-header">
          <span className="bw-exhibit-badge">{exhibit.badge}</span>
          <h3 className="bw-exhibit-title">{exhibit.title}</h3>
          <p className="bw-exhibit-subtitle">{exhibit.subtitle}</p>
        </div>

        {/* 5-Stage Interactive Stepper */}
        <div
          className="bw-stage-stepper"
          role="tablist"
          aria-label={exhibit.stageSelectorAria}
        >
          {STAGE_ORDER.map((stageKey) => {
            const st = exhibit.stages[stageKey]
            const isSelected = activeStageId === stageKey
            return (
              <button
                key={st.id}
                type="button"
                role="tab"
                id={`bw-tab-${st.id}`}
                aria-selected={isSelected}
                aria-controls={`bw-panel-${st.id}`}
                className={`bw-stage-tab ${isSelected ? 'is-active' : ''}`}
                onClick={() => setActiveStageId(st.id)}
              >
                <span className="bw-stage-tab-num">STEP {st.stepNumber}</span>
                <span className="bw-stage-tab-label">{st.shortTitle}</span>
              </button>
            )
          })}
        </div>

        {/* Main Interactive Stage Detail + 4 Compact Positive-Rating Metrics */}
        <div className="bw-exhibit-body-grid">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              id={`bw-panel-${activeStage.id}`}
              role="tabpanel"
              aria-labelledby={`bw-tab-${activeStage.id}`}
              className="bw-stage-detail-card"
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -4 }
              }
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="bw-stage-meta-row">
                  <span className="bw-stage-pill">{activeStage.badge}</span>
                  <span className="bw-stage-epistemic-tag">
                    {activeStage.epistemicTag}
                  </span>
                </div>

                <blockquote className="bw-stage-quote-headline">
                  {activeStage.headline}
                </blockquote>

                <p className="bw-stage-core-text">
                  {activeStage.coreStatement}
                </p>

                <div className="bw-stage-points-list">
                  {activeStage.supportingPoints.map((pt) => (
                    <div
                      key={pt.label}
                      className={`bw-stage-point-item ${
                        pt.tone === 'supported'
                          ? 'is-supported'
                          : pt.tone === 'friction'
                            ? 'is-friction'
                            : ''
                      }`}
                    >
                      <strong
                        style={{
                          display: 'block',
                          fontFamily: 'var(--bw-font-mono)',
                          fontSize: '0.72rem',
                          marginBottom: '2px',
                        }}
                      >
                        {pt.label}
                      </strong>
                      <span>{pt.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="bw-epistemic-footnote">
                {activeStage.methodologyBoundaryNote}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Right Panel: Four Compact Evidence Values (SAVE 10/10, COMPARE 8/10, PRIORITIES 6/10, NOTES 5/10) */}
          <div className="bw-metrics-panel">
            <div>
              <span
                className="bw-card-code"
                style={{ display: 'block', marginBottom: '6px' }}
              >
                {exhibit.metricsHeading}
              </span>
              <div className="bw-metrics-disclaimer">
                {exhibit.metricsDisclaimer}
              </div>
            </div>

            <div className="bw-metrics-four-grid">
              {exhibit.metrics.map((m) => {
                const pct = Math.round((m.numericValue / m.maxValue) * 100)
                return (
                  <div
                    key={m.id}
                    className={`bw-metric-box ${
                      m.statusTone === 'strong' ? 'is-strong' : 'is-friction'
                    }`}
                  >
                    <div className="bw-metric-top">
                      <span className="bw-metric-code">{m.code}</span>
                      <span className="bw-metric-score">{m.score}</span>
                    </div>
                    <div className="bw-metric-bar-track" aria-hidden="true">
                      <div
                        className="bw-metric-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <strong style={{ fontSize: '0.8rem' }}>{m.label}</strong>
                    <span className="bw-metric-note">{m.ratingNote}</span>
                  </div>
                )
              })}
            </div>

            <div className="bw-friction-callout">
              <strong
                style={{
                  display: 'block',
                  fontFamily: 'var(--bw-font-mono)',
                  fontSize: '0.69rem',
                  color: 'var(--bw-warning)',
                  marginBottom: '3px',
                }}
              >
                {exhibit.frictionCallout.badge}
              </strong>
              <strong style={{ display: 'block', marginBottom: '3px' }}>
                {exhibit.frictionCallout.title}
              </strong>
              <span>{exhibit.frictionCallout.detail}</span>
            </div>
          </div>
        </div>

        {/* 3. UI Response Exhibit: Before vs. After Design Decision */}
        <div>
          <div style={{ marginBottom: '10px' }}>
            <h4 className="bw-card-title">
              {exhibit.uiBeforeAfterExhibit.heading}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--bw-muted)' }}>
              {exhibit.uiBeforeAfterExhibit.subnote}
            </p>
          </div>

          <div className="bw-before-after-grid">
            <div className="bw-ba-card is-before">
              <span
                className="bw-card-code"
                style={{ color: 'var(--bw-warning)' }}
              >
                {exhibit.uiBeforeAfterExhibit.beforeLabel}
              </span>
              <h5 className="bw-card-title">
                {exhibit.uiBeforeAfterExhibit.beforeTitle}
              </h5>
              <ul className="bw-bullet-list">
                {exhibit.uiBeforeAfterExhibit.beforeIssues.map((iss) => (
                  <li key={iss}>{iss}</li>
                ))}
              </ul>
            </div>

            <div className="bw-ba-card is-after">
              <span
                className="bw-card-code"
                style={{ color: 'var(--bw-success)' }}
              >
                {exhibit.uiBeforeAfterExhibit.afterLabel}
              </span>
              <h5 className="bw-card-title">
                {exhibit.uiBeforeAfterExhibit.afterTitle}
              </h5>
              <ul className="bw-bullet-list">
                {exhibit.uiBeforeAfterExhibit.afterDecisions.map((dec) => (
                  <li key={dec}>{dec}</li>
                ))}
              </ul>
            </div>
          </div>

          <p
            className="bw-epistemic-footnote"
            style={{ marginTop: '10px', borderTop: 'none', paddingTop: 0 }}
          >
            {exhibit.uiBeforeAfterExhibit.unvalidatedRetestNote}
          </p>
        </div>
      </div>

      {/* 4. Progressive Disclosure for Additional Research Topics (Iterations 02–03) */}
      <div>
        <button
          type="button"
          className="bw-disclosure-btn"
          aria-expanded={showSecondaryTopics}
          onClick={() => setShowSecondaryTopics((prev) => !prev)}
        >
          <span>
            {showSecondaryTopics
              ? data.secondaryTopicsHideLabel
              : data.secondaryTopicsToggleLabel}
          </span>
          <span aria-hidden="true">{showSecondaryTopics ? '−' : '+'}</span>
        </button>

        {showSecondaryTopics ? (
          <div style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <h3 className="bw-card-title">{data.secondaryTopicsHeading}</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--bw-muted)' }}>
                {data.secondaryTopicsSubnote}
              </p>
            </div>

            <div className="bw-two-col-grid">
              {data.secondaryTopics.map((topic) => (
                <article key={topic.id} className="bw-info-card">
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
                      <span className="bw-card-code">{topic.code}</span>
                      <span className="bw-card-status-tag">
                        {topic.iterationTag}
                      </span>
                    </div>
                    <h4
                      className="bw-card-title"
                      style={{ marginBottom: '8px' }}
                    >
                      {topic.title}
                    </h4>
                    <p
                      className="bw-card-body"
                      style={{ marginBottom: '8px' }}
                    >
                      <strong>Observed: </strong>
                      {topic.observedFinding}
                    </p>
                    <p className="bw-card-body">
                      <strong>Product Response: </strong>
                      {topic.productResponse}
                    </p>
                  </div>

                  <p className="bw-epistemic-footnote">
                    <strong>{topic.epistemicStatus}</strong> ·{' '}
                    {topic.boundaryNote}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
