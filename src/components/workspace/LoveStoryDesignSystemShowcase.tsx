import React, { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { LOVE_STORY_ASSET_SPEC } from '../../data/portfolioData'

export type DesignSystemSpecimenTheme = 'dark' | 'paper'
export type DesignSystemComponentState = 'normal' | 'loading' | 'empty' | 'error'
type SpecimenNavTab = 'all' | '2026' | 'brisbane'

interface TokenSpec {
  hex: string
  roleEn: string
  roleZh: string
  cssVar: string
}

const DARK_ARCHIVE_TOKENS: ReadonlyArray<TokenSpec> = [
  {
    hex: '#10110F',
    roleEn: 'Archive Background',
    roleZh: '馆藏深色背景',
    cssVar: '--archive-bg',
  },
  {
    hex: '#171815',
    roleEn: 'Elevated Surface',
    roleZh: '主容器表面',
    cssVar: '--archive-surface',
  },
  {
    hex: '#20211E',
    roleEn: 'Photo Frame Mount',
    roleZh: '原色相纸画框',
    cssVar: '--archive-photo-frame',
  },
  {
    hex: '#E8E3D8',
    roleEn: 'Warm Ivory Text',
    roleZh: '暖象牙白正文',
    cssVar: '--archive-text',
  },
  {
    hex: '#B79A62',
    roleEn: 'Archive Gold',
    roleZh: '馆藏古铜金',
    cssVar: '--archive-gold',
  },
  {
    hex: '#C8AD75',
    roleEn: 'Highlight Gold',
    roleZh: '高光香槟金',
    cssVar: '--archive-gold-bright',
  },
]

const PAPER_INK_TOKENS: ReadonlyArray<TokenSpec> = [
  {
    hex: '#F3EFE7',
    roleEn: 'Editorial Paper BG',
    roleZh: '暖色纸本背景',
    cssVar: '--bg',
  },
  {
    hex: '#EAE5DA',
    roleEn: 'Deep Paper Surface',
    roleZh: '深层纸张表面',
    cssVar: '--bg-deep',
  },
  {
    hex: '#F5F1EB',
    roleEn: 'Warm White Sheet',
    roleZh: '暖白卡片内页',
    cssVar: '--warm-white',
  },
  {
    hex: '#111111',
    roleEn: 'Primary Ink Text',
    roleZh: '深墨主标题与正文',
    cssVar: '--dark',
  },
  {
    hex: '#8B8883',
    roleEn: 'Muted Archival Ink',
    roleZh: '次级纪年灰墨',
    cssVar: '--muted',
  },
]

interface LoveStoryDesignSystemShowcaseProps {
  isZh: boolean
}

export const LoveStoryDesignSystemShowcase: React.FC<
  LoveStoryDesignSystemShowcaseProps
> = ({ isZh }) => {
  const prefersReducedMotion = Boolean(useReducedMotion())

  // Scoped strictly to this specimen — never alters the global Portfolio theme
  const [specimenTheme, setSpecimenTheme] =
    useState<DesignSystemSpecimenTheme>('dark')
  const [componentState, setComponentState] =
    useState<DesignSystemComponentState>('normal')
  const [activeNavTab, setActiveNavTab] = useState<SpecimenNavTab>('all')
  const [isFavorite, setIsFavorite] = useState<boolean>(true)
  const [noteInputValue, setNoteInputValue] = useState<string>(
    'Riverwalk Evening Walk · Brisbane'
  )
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)
  const [showTokensStrip, setShowTokensStrip] = useState<boolean>(false)
  const [isUxRationaleOpen, setIsUxRationaleOpen] = useState<boolean>(false)

  const activeTokens =
    specimenTheme === 'dark' ? DARK_ARCHIVE_TOKENS : PAPER_INK_TOKENS

  const activeMemoryPreview =
    activeNavTab === 'brisbane'
      ? {
          titleEn: 'Botanic Glasshouse Conservatory',
          titleZh: '植物园玻璃温室的午后光影',
          datePlaceEn: 'AUG 24, 2026 · CITY BOTANIC GARDENS, BRISBANE',
          datePlaceZh: '2026年8月24日 · 布里斯班城市植物园',
          storyEn:
            'Afternoon light filtering through the curved conservatory glass dome after a warm shower.',
          storyZh:
            '阵雨初歇后的午后暖阳穿透弧形玻璃穹顶，落在湿润的石径与植物叶片上。',
          badgeEn: 'Everyday · Favorite',
          badgeZh: '日常点滴 · 精选收藏',
          photo: LOVE_STORY_ASSET_SPEC.memories.brisbaneBotanic,
        }
      : {
          titleEn: 'Riverwalk Evening Walk',
          titleZh: '布里斯班河畔暮色漫步',
          datePlaceEn: 'SEP 18, 2026 · NEW FARM RIVERWALK, BRISBANE',
          datePlaceZh: '2026年9月18日 · 布里斯班 New Farm 河畔步道',
          storyEn:
            'Walked along the Brisbane River boardwalk as the city bridge lights reflected across the water.',
          storyZh:
            '沿着布里斯班河木栈道缓步前行，暮色中的桥拱与暖金色灯光倒映在水面。',
          badgeEn: 'Milestone · 2 Photos',
          badgeZh: '重要里程碑 · 2 张照片',
          photo: LOVE_STORY_ASSET_SPEC.memories.brisbaneRiverwalk,
        }

  const motionTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }

  const stateOptions: ReadonlyArray<{
    id: DesignSystemComponentState
    labelEn: string
    labelZh: string
  }> = [
    { id: 'normal', labelEn: 'Normal', labelZh: '正常态 (Normal)' },
    { id: 'loading', labelEn: 'Loading', labelZh: '加载态 (Loading)' },
    { id: 'empty', labelEn: 'Empty', labelZh: '空状态 (Empty)' },
    {
      id: 'error',
      labelEn: 'Validation Error',
      labelZh: '校验错误 (Validation Error)',
    },
  ]

  return (
    <section
      className="ls-ds-interactive-showcase"
      aria-labelledby="ls-ds-showcase-heading"
      data-specimen-theme={specimenTheme}
      data-specimen-state={componentState}
    >
      {/* Top Header & Compact Controls */}
      <header className="ls-dsi-header">
        <div className="ls-dsi-title-cluster">
          <div className="ls-dsi-eyebrow-row">
            <span className="ls-dsi-demo-badge">
              {isZh
                ? '交互式设计系统样本 · 双境主题与四态反馈'
                : 'INTERACTIVE DESIGN SYSTEM SPECIMEN · DUAL THEME & 4-STATE UI'}
            </span>
            <span className="ls-dsi-scope-note">
              {isZh
                ? '独立作用域预览 · 不影响全局作品集主题'
                : 'SCOPED SPECIMEN PREVIEW · INDEPENDENT OF GLOBAL PORTFOLIO THEME'}
            </span>
          </div>
          <h3 id="ls-dsi-showcase-heading" className="ls-dsi-heading">
            {isZh
              ? '同一套语义化组件，如何在 Dark Archive 与 Paper & Ink 双境中自然切换'
              : 'One Semantic Interface: Switch themes and component states to inspect live adaptation'}
          </h3>
        </div>

        <div className="ls-dsi-utility-toggles">
          <button
            type="button"
            className={`ls-dsi-secondary-toggle ${
              showTokensStrip ? 'is-open' : ''
            }`}
            data-ds-tokens-toggle="true"
            aria-expanded={showTokensStrip}
            onClick={() => setShowTokensStrip((prev) => !prev)}
          >
            <span>
              {isZh ? '色彩与字体规范令牌' : 'Colour & Typography Tokens'}
            </span>
            <span aria-hidden="true">{showTokensStrip ? '−' : '+'}</span>
          </button>

          <button
            type="button"
            className={`ls-dsi-ux-toggle ${
              isUxRationaleOpen ? 'is-open' : ''
            }`}
            data-ux-insight-toggle="design-system"
            aria-expanded={isUxRationaleOpen}
            aria-controls="ls-dsi-ux-rationale-panel"
            onClick={() => setIsUxRationaleOpen((prev) => !prev)}
          >
            <span className="ls-dsi-ux-dot" aria-hidden="true" />
            <span>
              {isZh ? '设计系统 UX 考量' : 'Why this design system?'}
            </span>
            <span aria-hidden="true">{isUxRationaleOpen ? '−' : '+'}</span>
          </button>
        </div>
      </header>

      {/* Collapsed-by-Default UX Rationale Drawer */}
      <AnimatePresence initial={false}>
        {isUxRationaleOpen ? (
          <motion.div
            id="ls-dsi-ux-rationale-panel"
            className="ls-dsi-ux-drawer"
            role="region"
            aria-label={
              isZh ? '设计系统 UX 考量解析' : 'Design system UX rationale'
            }
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={motionTransition}
          >
            <div className="ls-dsi-ux-grid">
              <div className="ls-dsi-ux-cell">
                <span className="ls-dsi-ux-kicker">
                  {isZh
                    ? '01 · 视觉一致性 (VISUAL CONSISTENCY)'
                    : '01 · VISUAL CONSISTENCY'}
                </span>
                <p className="ls-dsi-ux-text">
                  {isZh
                    ? '所有组件共享同一套语义变量（背景、容器、文字、强调色），切换主题时仅重映射变量，照片画框（#20211E）则始终保持中性不偏色。'
                    : 'Components bind to semantic tokens rather than raw hex rules. Switching themes re-maps surfaces while keeping #20211E photo mounts untinted.'}
                </p>
              </div>
              <div className="ls-dsi-ux-cell">
                <span className="ls-dsi-ux-kicker">
                  {isZh
                    ? '02 · 交互状态反馈 (INTERACTION FEEDBACK)'
                    : '02 · INTERACTION FEEDBACK'}
                </span>
                <p className="ls-dsi-ux-text">
                  {isZh
                    ? '显式定义 Normal、Loading、Empty、Error 四态：空状态提供明确行动入口，错误态提供就地修复操作而非生硬报错弹窗。'
                    : 'Normal, Loading, Empty, and Error states share the same frame geometry—turning empty screens into invitations to act and errors into inline recovery.'}
                </p>
              </div>
              <div className="ls-dsi-ux-cell">
                <span className="ls-dsi-ux-kicker">
                  {isZh ? '03 · 阅读体验 (READABILITY)' : '03 · READABILITY'}
                </span>
                <p className="ls-dsi-ux-text">
                  {isZh
                    ? 'Cormorant Garamond 衬线体负责情感叙事标题，Inter 无衬线体负责日期、坐标与表单控件，正文字宽严格控制在 65 字符以内。'
                    : 'Cormorant Garamond carries narrative titles while Inter handles dates, coordinates, and inputs with comfortable line lengths (<65ch).'}
                </p>
              </div>
              <div className="ls-dsi-ux-cell">
                <span className="ls-dsi-ux-kicker">
                  {isZh
                    ? '04 · 无障碍考量 (ACCESSIBILITY)'
                    : '04 · ACCESSIBILITY CONSIDERATIONS'}
                </span>
                <p className="ls-dsi-ux-text">
                  {isZh
                    ? '在浅色纸本下将香槟金加深为古铜金以维持文本对比度，所有按钮与输入框均配备可见焦点环、aria-live 状态播报与减弱动态支持。'
                    : 'Paper & Ink deepens accent gold for legibility on warm paper, while controls maintain visible focus rings, aria-live status announcements, and reduced-motion support.'}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Compact Control Bar: Theme Switcher + 4-State Switcher */}
      <div className="ls-dsi-control-deck">
        <div
          className="ls-dsi-control-cluster"
          role="group"
          aria-label={
            isZh ? '切换样本主题表面' : 'Switch specimen surface theme'
          }
        >
          <span className="ls-dsi-control-label">
            {isZh ? '主题表面 (THEME)：' : 'SURFACE THEME:'}
          </span>
          <button
            type="button"
            data-select-specimen-theme="dark"
            aria-pressed={specimenTheme === 'dark'}
            className={`ls-dsi-theme-btn ${
              specimenTheme === 'dark' ? 'is-active' : ''
            }`}
            onClick={() => setSpecimenTheme('dark')}
          >
            <span
              className="ls-dsi-theme-swatch"
              style={{ backgroundColor: '#10110F', borderColor: '#C8AD75' }}
              aria-hidden="true"
            />
            <span>Dark Archive (#10110F)</span>
          </button>
          <button
            type="button"
            data-select-specimen-theme="paper"
            aria-pressed={specimenTheme === 'paper'}
            className={`ls-dsi-theme-btn ${
              specimenTheme === 'paper' ? 'is-active' : ''
            }`}
            onClick={() => setSpecimenTheme('paper')}
          >
            <span
              className="ls-dsi-theme-swatch"
              style={{ backgroundColor: '#F3EFE7', borderColor: '#111111' }}
              aria-hidden="true"
            />
            <span>Paper &amp; Ink (#F3EFE7)</span>
          </button>
        </div>

        <div
          className="ls-dsi-control-cluster"
          role="group"
          aria-label={
            isZh ? '切换组件交互状态' : 'Switch interactive component state'
          }
        >
          <span className="ls-dsi-control-label">
            {isZh ? '组件状态 (STATE)：' : 'COMPONENT STATE:'}
          </span>
          {stateOptions.map((st) => {
            const isSelected = componentState === st.id
            return (
              <button
                key={st.id}
                type="button"
                data-select-specimen-state={st.id}
                aria-pressed={isSelected}
                className={`ls-dsi-state-btn ${isSelected ? 'is-active' : ''}`}
                onClick={() => {
                  setComponentState(st.id)
                  setActionFeedback(null)
                }}
              >
                {isZh ? st.labelZh : st.labelEn}
              </button>
            )
          })}
        </div>
      </div>

      {/* ====================================================================
          PRIMARY INTERACTIVE LOVESTORY INTERFACE SPECIMEN
          Adapts immediately to Dark Archive (#10110F) vs Paper & Ink (#F3EFE7)
          and Normal / Loading / Empty / Error states
          ==================================================================== */}
      <div
        className={`ls-dsi-specimen-frame is-theme-${specimenTheme} is-state-${componentState}`}
        data-live-specimen-surface={specimenTheme}
      >
        {/* 1. Specimen Top Navigation & Access Feedback Bar */}
        <div className="ls-spec-topbar">
          <div className="ls-spec-brand-group">
            <span className="ls-spec-wordmark">LOVE / STORY</span>
            <nav
              className="ls-spec-nav"
              aria-label={
                isZh ? '样本内部导航演示' : 'Specimen navigation selection demo'
              }
            >
              {(
                [
                  { key: 'all', labelEn: 'All Memories', labelZh: '全部记忆' },
                  { key: '2026', labelEn: '2026 Archive', labelZh: '2026 馆藏' },
                  { key: 'brisbane', labelEn: 'Brisbane', labelZh: '布里斯班' },
                ] as const
              ).map((tab) => {
                const isTabActive = activeNavTab === tab.key
                return (
                  <button
                    key={tab.key}
                    type="button"
                    data-spec-nav={tab.key}
                    aria-pressed={isTabActive}
                    className={`ls-spec-nav-item ${
                      isTabActive ? 'is-active' : ''
                    }`}
                    onClick={() => {
                      setActiveNavTab(tab.key)
                      if (componentState !== 'normal') {
                        setComponentState('normal')
                      }
                      setActionFeedback(
                        isZh
                          ? `已切换导航筛选至：${tab.labelZh}`
                          : `Navigation filter updated: ${tab.labelEn}`
                      )
                    }}
                  >
                    {isZh ? tab.labelZh : tab.labelEn}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Access Feedback Pill & Specimen Action Buttons */}
          <div className="ls-spec-actions-group">
            <span
              className={`ls-spec-access-pill is-${componentState}`}
              data-spec-access-pill={componentState}
            >
              {componentState === 'normal'
                ? isZh
                  ? '共享空间 · 2 位成员已同步'
                  : 'Shared Space · 2 Members Synced'
                : componentState === 'loading'
                  ? isZh
                    ? '正在同步加密馆藏…'
                    : 'Synchronising Archive…'
                  : componentState === 'empty'
                    ? isZh
                      ? '当前筛选集为空 · 可新建记录'
                      : 'Collection Empty · Ready to Record'
                    : isZh
                      ? '同步暂停 · 需补充必填日期'
                      : 'Sync Paused · Date Required'}
            </span>

            <button
              type="button"
              className="ls-spec-primary-btn"
              data-spec-primary-cta="true"
              disabled={componentState === 'loading'}
              onClick={() => {
                if (componentState !== 'normal') {
                  setComponentState('normal')
                  setActionFeedback(
                    isZh
                      ? '已从当前状态恢复至正常记忆视图。'
                      : 'Restored specimen to Normal memory view.'
                  )
                } else {
                  setActionFeedback(
                    isZh
                      ? '触发主操作按钮 (+ Add Memory)：打开记忆编辑器。'
                      : 'Primary CTA triggered (+ Add Memory): Opens memory composer.'
                  )
                }
              }}
            >
              {componentState === 'loading'
                ? isZh
                  ? '保存中…'
                  : 'Saving…'
                : componentState === 'empty'
                  ? isZh
                    ? '+ 记录第一则记忆'
                    : '+ Record First Memory'
                  : componentState === 'error'
                    ? isZh
                      ? '修复并重试 →'
                      : 'Fix & Retry →'
                    : isZh
                      ? '+ 新增记忆'
                      : '+ Add Memory'}
            </button>
          </div>
        </div>

        {/* 2. Specimen Body: Left Interactive Component Stage + Right Live Typography & Token Readout */}
        <div className="ls-spec-body-split">
          {/* Left Column: Memory Card + Input Control across 4 States */}
          <div className="ls-spec-component-column">
            {/* Interactive Input Field Specimen */}
            <div
              className={`ls-spec-input-group ${
                componentState === 'error' ? 'has-error' : ''
              }`}
            >
              <div className="ls-spec-input-label-row">
                <label
                  htmlFor="ls-specimen-memory-input"
                  className="ls-spec-input-label"
                >
                  {isZh
                    ? '记忆标题与地点快速检索 (INPUT SPECIMEN)'
                    : 'MEMORY TITLE & PLACE INPUT SPECIMEN'}
                </label>
                <span className="ls-spec-input-state-tag">
                  {componentState === 'error'
                    ? 'VALIDATION ERROR'
                    : componentState.toUpperCase()}
                </span>
              </div>

              <div className="ls-spec-input-row">
                <input
                  id="ls-specimen-memory-input"
                  type="text"
                  data-specimen-input="memory-query"
                  value={
                    componentState === 'loading'
                      ? isZh
                        ? '正在拉取 2026 年布里斯班记忆索引…'
                        : 'Fetching 2026 Brisbane memory index…'
                      : componentState === 'empty'
                        ? ''
                        : noteInputValue
                  }
                  placeholder={
                    isZh
                      ? '输入记忆标题、年份或城市坐标…'
                      : 'Enter memory title, year, or city coordinate…'
                  }
                  disabled={componentState === 'loading'}
                  aria-invalid={componentState === 'error'}
                  className="ls-spec-text-input"
                  onChange={(e) => {
                    setNoteInputValue(e.target.value)
                    if (componentState === 'empty') {
                      setComponentState('normal')
                    }
                  }}
                />
                <button
                  type="button"
                  className="ls-spec-ghost-btn"
                  data-spec-fav-btn="true"
                  aria-pressed={isFavorite}
                  disabled={componentState === 'loading'}
                  onClick={() => {
                    setIsFavorite((prev) => !prev)
                    setActionFeedback(
                      !isFavorite
                        ? isZh
                          ? '已加入“精选收藏 (Favorites)”'
                          : 'Added to Favorites collection'
                        : isZh
                          ? '已从“精选收藏”移除'
                          : 'Removed from Favorites'
                    )
                  }}
                >
                  <span>{isFavorite ? '♥' : '♡'}</span>
                  <span>{isZh ? '收藏' : 'Favorite'}</span>
                </button>
              </div>

              {componentState === 'error' ? (
                <p
                  className="ls-spec-input-error-msg"
                  role="alert"
                  data-specimen-error-msg="true"
                >
                  {isZh
                    ? '校验提示：编年时间轴要求填写发生日期（YYYY-MM-DD）。点击右侧“修复并重试”即可恢复。'
                    : 'Validation notice: Event date (YYYY-MM-DD) is required for chronological sorting. Click "Fix & Retry" to resolve.'}
                </p>
              ) : null}
            </div>

            {/* Dynamic 4-State Memory Card Area */}
            <div className="ls-spec-card-stage">
              {componentState === 'normal' ? (
                <motion.article
                  key={`spec-normal-${activeNavTab}`}
                  className="ls-spec-memory-card"
                  data-spec-card-state="normal"
                  initial={{ opacity: 0.85, y: prefersReducedMotion ? 0 : 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={motionTransition}
                >
                  {/* #20211E Photo Frame Mount stays photo-true in both Dark Archive and Paper & Ink */}
                  <div className="ls-spec-photo-frame">
                    <picture>
                      <source
                        srcSet={activeMemoryPreview.photo.webp}
                        type="image/webp"
                      />
                      <img
                        src={activeMemoryPreview.photo.png}
                        alt={
                          isZh
                            ? activeMemoryPreview.titleZh
                            : activeMemoryPreview.titleEn
                        }
                        className="ls-spec-photo-img"
                      />
                    </picture>
                    <span className="ls-spec-photo-badge">
                      {isZh
                        ? activeMemoryPreview.badgeZh
                        : activeMemoryPreview.badgeEn}
                    </span>
                    <span className="ls-spec-mount-token-pill">
                      #20211E Photo Mount
                    </span>
                  </div>

                  <div className="ls-spec-card-content">
                    <span className="ls-spec-card-meta">
                      {isZh
                        ? activeMemoryPreview.datePlaceZh
                        : activeMemoryPreview.datePlaceEn}
                    </span>
                    <h4 className="ls-spec-card-title">
                      {isZh
                        ? activeMemoryPreview.titleZh
                        : activeMemoryPreview.titleEn}
                    </h4>
                    <p className="ls-spec-card-story">
                      {isZh
                        ? activeMemoryPreview.storyZh
                        : activeMemoryPreview.storyEn}
                    </p>
                  </div>
                </motion.article>
              ) : componentState === 'loading' ? (
                <motion.div
                  key="spec-loading"
                  className="ls-spec-state-card is-loading-state"
                  data-spec-card-state="loading"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0.85 }}
                  animate={{ opacity: 1 }}
                  transition={motionTransition}
                >
                  <div className="ls-spec-skeleton-photo" aria-hidden="true" />
                  <div className="ls-spec-skeleton-lines" aria-hidden="true">
                    <span className="ls-spec-skel-line is-short" />
                    <span className="ls-spec-skel-line is-title" />
                    <span className="ls-spec-skel-line is-body" />
                  </div>
                  <p className="ls-spec-state-caption">
                    {isZh
                      ? '加载态 (Loading)：保持 #20211E 画框原始比例占位，避免照片加载完成时产生布局跳动。'
                      : 'Loading State: Reserves exact #20211E aspect-ratio geometry so photographs settle in without layout shift.'}
                  </p>
                </motion.div>
              ) : componentState === 'empty' ? (
                <motion.div
                  key="spec-empty"
                  className="ls-spec-state-card is-empty-state"
                  data-spec-card-state="empty"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0.85 }}
                  animate={{ opacity: 1 }}
                  transition={motionTransition}
                >
                  <span className="ls-spec-state-kicker">
                    {isZh ? 'EMPTY STATE · 空白画框引导' : 'EMPTY STATE · INVITATION TO ACT'}
                  </span>
                  <h4 className="ls-spec-state-heading">
                    {isZh
                      ? '此筛选条件下尚无共同记忆记录。'
                      : 'No shared memories recorded in this view yet.'}
                  </h4>
                  <p className="ls-spec-state-caption">
                    {isZh
                      ? 'LoveStory 将空状态视为温和的行动邀请，而非冰冷的报错——提供唯一主操作入口引导记录第一段故事。'
                      : 'Treats emptiness as a calm invitation rather than a dead end, offering a single clear action to record a moment.'}
                  </p>
                  <button
                    type="button"
                    className="ls-spec-inline-restore-btn"
                    onClick={() => setComponentState('normal')}
                  >
                    {isZh
                      ? '示例操作：载入布里斯班记忆样本 →'
                      : 'Load Sample Brisbane Memory →'}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="spec-error"
                  className="ls-spec-state-card is-error-state"
                  data-spec-card-state="error"
                  role="alert"
                  initial={{ opacity: 0.85 }}
                  animate={{ opacity: 1 }}
                  transition={motionTransition}
                >
                  <span className="ls-spec-state-kicker is-error-kicker">
                    {isZh
                      ? 'VALIDATION ERROR · 就地恢复反馈'
                      : 'VALIDATION ERROR · INLINE RECOVERY'}
                  </span>
                  <h4 className="ls-spec-state-heading">
                    {isZh
                      ? '记忆未能保存：缺少真实发生日期（YYYY-MM-DD）。'
                      : 'Could not save memory: Event date (YYYY-MM-DD) is missing.'}
                  </h4>
                  <p className="ls-spec-state-caption">
                    {isZh
                      ? '错误信息直接说明原因与修复方式，绝不清空用户已填写的故事正文或照片。'
                      : 'Explains what went wrong and how to fix it in the interface’s calm voice without discarding unsaved writing.'}
                  </p>
                  <button
                    type="button"
                    className="ls-spec-inline-restore-btn"
                    onClick={() => setComponentState('normal')}
                  >
                    {isZh
                      ? '自动填充日期并恢复正常态 →'
                      : 'Populate Event Date & Restore Normal State →'}
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column: Live Typography Hierarchy & Active Surface Token Palette */}
          <aside
            className="ls-spec-system-sidebar"
            aria-label={
              isZh
                ? '当前主题下的字体层级与色彩令牌'
                : 'Typography hierarchy and active surface colour tokens'
            }
          >
            {/* Typography Hierarchy Specimen */}
            <div className="ls-spec-type-block">
              <span className="ls-spec-sidebar-kicker">
                {isZh
                  ? 'TYPOGRAPHY HIERARCHY · 双字体系统'
                  : 'TYPOGRAPHY HIERARCHY · DUAL TYPE SYSTEM'}
              </span>

              <div className="ls-spec-type-sample-item">
                <div className="ls-spec-type-meta">
                  <span>Cormorant Garamond · Display Serif</span>
                  <span>clamp(1.35rem, 2.2vw, 2rem)</span>
                </div>
                <p className="ls-spec-serif-display">
                  {isZh
                    ? '每一段共同记忆，皆有时间与坐标。'
                    : 'Every shared memory holds a time and place.'}
                </p>
              </div>

              <div className="ls-spec-type-sample-item">
                <div className="ls-spec-type-meta">
                  <span>Inter · UI, Navigation &amp; Body Sans</span>
                  <span>0.86rem / 1.6 line-height · &lt;65ch</span>
                </div>
                <p className="ls-spec-sans-body">
                  {isZh
                    ? '界面退后一步：在深色馆藏 (#10110F) 下呈现影院级沉浸感，在纸本模式 (#F3EFE7) 下呈现温暖手账质感。'
                    : 'The interface steps back: immersive warmth in Dark Archive (#10110F) and crisp editorial legibility in Paper & Ink (#F3EFE7).'}
                </p>
              </div>

              <div className="ls-spec-type-sample-item">
                <div className="ls-spec-type-meta">
                  <span>Micro Archival Label</span>
                  <span>10px · uppercase · 0.2em tracking</span>
                </div>
                <span className="ls-spec-micro-sample">
                  SEP 18, 2026 · 27.4698° S, 153.0251° E · BRISBANE
                </span>
              </div>
            </div>

            {/* Compact Active Theme Colour Tokens */}
            <div className="ls-spec-tokens-block">
              <div className="ls-spec-tokens-head">
                <span className="ls-spec-sidebar-kicker">
                  {specimenTheme === 'dark'
                    ? isZh
                      ? 'DARK ARCHIVE 官方色彩令牌'
                      : 'DARK ARCHIVE OFFICIAL TOKENS'
                    : isZh
                      ? 'PAPER & INK 官方色彩令牌'
                      : 'PAPER & INK OFFICIAL TOKENS'}
                </span>
                <span className="ls-spec-tokens-count">
                  {activeTokens.length} {isZh ? '个核心色值' : 'Core Hexes'}
                </span>
              </div>

              <div className="ls-spec-compact-token-list">
                {activeTokens.map((tok) => (
                  <div
                    key={tok.hex}
                    className="ls-spec-token-pill"
                    data-token-hex={tok.hex}
                  >
                    <span
                      className="ls-spec-token-swatch"
                      style={{ backgroundColor: tok.hex }}
                      aria-hidden="true"
                    />
                    <div className="ls-spec-token-info">
                      <strong className="ls-spec-token-hex">{tok.hex}</strong>
                      <span className="ls-spec-token-role">
                        {isZh ? tok.roleZh : tok.roleEn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Interaction Feedback Readout */}
            {actionFeedback ? (
              <div
                className="ls-spec-live-feedback-toast"
                role="status"
                aria-live="polite"
              >
                <span>{actionFeedback}</span>
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      {/* Optional Secondary Full Token Comparison Strip (Collapsed unless toggled) */}
      <AnimatePresence initial={false}>
        {showTokensStrip ? (
          <motion.div
            className="ls-dsi-secondary-tokens-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={motionTransition}
          >
            <div className="ls-dsi-dual-palette-summary">
              <div className="ls-dsi-palette-col">
                <span className="ls-dsi-palette-title">
                  Dark Archive (#10110F · #171815 · #20211E · #E8E3D8 · #B79A62 · #C8AD75)
                </span>
                <p>
                  {isZh
                    ? '用于开场门廊、Our Space 空间主页与夜间沉浸式记忆画廊阅览。'
                    : 'Used for the opening threshold, Our Space hub, and immersive evening memory browsing.'}
                </p>
              </div>
              <div className="ls-dsi-palette-col">
                <span className="ls-dsi-palette-title">
                  Paper &amp; Ink (#F3EFE7 · #EAE5DA · #F5F1EB · #111111 · #8B8883)
                </span>
                <p>
                  {isZh
                    ? '用于日间长文阅读、结构化表单编辑与纸质纪念册风格的编年时间轴。'
                    : 'Used for daytime reading, structured form editing, and printed-journal chronology.'}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
