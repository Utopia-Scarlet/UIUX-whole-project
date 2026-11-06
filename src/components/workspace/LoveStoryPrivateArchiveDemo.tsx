import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { LOVE_STORY_ASSET_SPEC } from '../../data/portfolioData'

export type PrivateArchiveDemoRole =
  | 'no-access'
  | 'viewer'
  | 'editor'
  | 'creator'

export type AudiencePresetKey = 'only' | 'selected' | 'everyone'
export type PartnerPermissionLevel = 'none' | 'viewer' | 'editor'

interface PrivateDemoRecord {
  id: 'priv-01' | 'priv-02'
  indexLabel: string
  titleEn: string
  titleZh: string
  dateEn: string
  dateZh: string
  placeEn: string
  placeZh: string
  weatherMoodEn: string
  weatherMoodZh: string
  addedByEn: string
  addedByZh: string
  defaultNoteEn: string
  defaultNoteZh: string
   alternateNoteEn: string
  alternateNoteZh: string
  photo: {
    webp: string
    png: string
    aspectRatio: string
    captionEn: string
    captionZh: string
  }
}

const PRIVATE_DEMO_RECORDS: ReadonlyArray<PrivateDemoRecord> = [
  {
    id: 'priv-01',
    indexLabel: '01',
    titleEn: 'Anniversary Letter & First Riverwalk Keyring',
    titleZh: '周年手写信与河畔漫步纪念钥匙扣',
    dateEn: '18 November 2025 · 21:15',
    dateZh: '2025年11月18日 · 21:15',
    placeEn: 'Brisbane, Australia',
    placeZh: '澳大利亚 · 布里斯班',
    weatherMoodEn: 'Clear · Grateful',
    weatherMoodZh: '晴夜 · 心怀感念',
    addedByEn: 'Added by Jianshuo (Creator) · Protected in Private Archive',
    addedByZh: '由 Jianshuo (创建者) 归档 · 受二级隐私锁保护',
    defaultNoteEn:
      'A quiet handwritten note recorded on the night we started Our Story. Stored inside the Private Archive so personal words remain separate from everyday shared photo browsing.',
    defaultNoteZh:
      '在开启 Our Story 当晚写下的一封长信。封存在私密归档（Private Archive）内，让需要静心阅读的私人话语与日常随时翻阅的共享相册保持清晰边界。',
    alternateNoteEn:
      'A quiet handwritten note recorded on the night we started Our Story — updated with our first Brisbane riverwalk keepsake annotation.',
    alternateNoteZh:
      '在开启 Our Story 当晚写下的一封长信——已补充布里斯班河畔漫步纪念批注。',
    photo: {
      webp: LOVE_STORY_ASSET_SPEC.memories.brisbaneRiverwalk.webp,
      png: LOVE_STORY_ASSET_SPEC.memories.brisbaneRiverwalk.png,
      aspectRatio: '3 / 2',
      captionEn: 'Privacy-safe demonstration visual · Brisbane dusk frame',
      captionZh: '隐私安全演示影像 · 布里斯班暮色画幅',
    },
  },
  {
    id: 'priv-02',
    indexLabel: '02',
    titleEn: 'Rainy Afternoon Postcard in Kuanzhai Alley',
    titleZh: '宽窄巷子听雨午后的手写明信片',
    dateEn: '3 November 2025 · 17:05',
    dateZh: '2025年11月3日 · 17:05',
    placeEn: 'Chengdu, China',
    placeZh: '中国 · 成都',
    weatherMoodEn: 'Rainy · Peaceful',
    weatherMoodZh: '微雨 · 安宁平和',
    addedByEn: 'Added by Jianshuo (Creator) · Protected in Private Archive',
    addedByZh: '由 Jianshuo (创建者) 归档 · 受二级隐私锁保护',
    defaultNoteEn:
      'Two paragraphs written on the back of a teahouse postcard while sheltering from autumn rain. Kept private with explicit per-person access control.',
    defaultNoteZh:
      '在竹院茶舍避雨时写在明信片背面的两段话。通过按成员独立授权的访问控制，仅对指定伴侣开放阅读。',
    alternateNoteEn:
      'Two paragraphs written on the back of a teahouse postcard while sheltering from autumn rain — updated with autumn tea house timestamp.',
    alternateNoteZh:
      '在竹院茶舍避雨时写在明信片背面的两段话——已添加茶舍秋雨时间戳批注。',
    photo: {
      webp: LOVE_STORY_ASSET_SPEC.memories.chengduTeahouse.webp,
      png: LOVE_STORY_ASSET_SPEC.memories.chengduTeahouse.png,
      aspectRatio: '3 / 2',
      captionEn: 'Privacy-safe demonstration visual · Chengdu courtyard frame',
      captionZh: '隐私安全演示影像 · 成都竹院画幅',
    },
  },
]

interface LoveStoryPrivateArchiveDemoProps {
  isZh: boolean
}

export const LoveStoryPrivateArchiveDemo: React.FC<
  LoveStoryPrivateArchiveDemoProps
> = ({ isZh }) => {
  const prefersReducedMotion = Boolean(useReducedMotion())

  // Initial state: Locked archive, default role set to 'viewer' so visitor can immediately test unlocking or switch to 'no-access' / 'editor' / 'creator'
  const [activeRole, setActiveRole] =
    useState<PrivateArchiveDemoRole>('viewer')
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false)
  const [selectedRecordId, setSelectedRecordId] = useState<
    'priv-01' | 'priv-02'
  >('priv-01')
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false)
  const [editedNotes, setEditedNotes] = useState<
    Record<'priv-01' | 'priv-02', boolean>
  >({
    'priv-01': false,
    'priv-02': false,
  })
  const [audiencePreset, setAudiencePreset] =
    useState<AudiencePresetKey>('selected')
  const [partnerPermission, setPartnerPermission] =
    useState<PartnerPermissionLevel>('viewer')
  const [confirmingStandard, setConfirmingStandard] = useState<boolean>(false)
  const [statusFeedback, setStatusFeedback] = useState<{
    kind: 'neutral' | 'denied' | 'unlocked' | 'read-only' | 'saved' | 'locked'
    messageEn: string
    messageZh: string
  }>({
    kind: 'neutral',
    messageEn:
      'Archive is currently closed. Zero metadata (no counts, titles, or covers) is exposed while locked.',
    messageZh:
      '私密归档当前处于闭合状态。未解锁时不暴露任何记忆数量、标题或封面元数据。',
  })
  const [isUxInsightOpen, setIsUxInsightOpen] = useState<boolean>(false)

  const lockButtonRef = useRef<HTMLButtonElement | null>(null)
  const unlockButtonRef = useRef<HTMLButtonElement | null>(null)
  const prevUnlockedRef = useRef<boolean>(false)

  const activeRecord =
    PRIVATE_DEMO_RECORDS.find((r) => r.id === selectedRecordId) ??
    PRIVATE_DEMO_RECORDS[0]

  const isRecordEdited = editedNotes[activeRecord.id]
  const displayedNote = isZh
    ? isRecordEdited
      ? activeRecord.alternateNoteZh
      : activeRecord.defaultNoteZh
    : isRecordEdited
      ? activeRecord.alternateNoteEn
      : activeRecord.defaultNoteEn

  // Manage focus cleanly when unlocking or relocking
  useEffect(() => {
    if (isUnlocked && !prevUnlockedRef.current) {
      prevUnlockedRef.current = true
      const timer = window.setTimeout(() => {
        lockButtonRef.current?.focus({ preventScroll: true })
      }, 50)
      return () => window.clearTimeout(timer)
    }
    if (!isUnlocked && prevUnlockedRef.current) {
      prevUnlockedRef.current = false
      const timer = window.setTimeout(() => {
        unlockButtonRef.current?.focus({ preventScroll: true })
      }, 50)
      return () => window.clearTimeout(timer)
    }
  }, [isUnlocked])

  // Switch between the 4 demonstration access scenarios
  const handleSelectRole = useCallback(
    (nextRole: PrivateArchiveDemoRole) => {
      setActiveRole(nextRole)
      setIsEditingNote(false)
      setConfirmingStandard(false)

      if (nextRole === 'no-access') {
        if (isUnlocked) {
          setIsUnlocked(false)
          setStatusFeedback({
            kind: 'denied',
            messageEn:
              'Switched to No Access (403): The Private Archive sealed immediately and cleared all private records from the view.',
            messageZh:
              '已切换为“无权限 (403)”：私密归档立即自动闭合，并从界面清空所有受保护内容。',
          })
        } else {
          setStatusFeedback({
            kind: 'denied',
            messageEn:
              'No Access role active: This member is not in the private access list and cannot unlock the archive.',
            messageZh:
              '当前为“无权限”角色：该成员不在私密访问名单中，无法解锁或窥探私密归档。',
          })
        }
        return
      }

      if (isUnlocked) {
        const roleSummaryEn =
          nextRole === 'viewer'
            ? 'Viewer role active: View-only access. Editing and privacy controls are restricted.'
            : nextRole === 'editor'
              ? 'Editor role active: Can read and edit memory notes, while Creator audience settings remain restricted.'
              : 'Creator role active: Full access to edit memories, manage per-person permissions, and move records to Shared Moments.'
        const roleSummaryZh =
          nextRole === 'viewer'
            ? '当前为“浏览者 (Viewer)”：仅可阅读记忆内容，编辑与隐私权限管理受限。'
            : nextRole === 'editor'
              ? '当前为“编辑者 (Editor)”：可阅读并编辑记忆批注，但无权修改创建者专属的访问名单。'
              : '当前为“创建者 (Creator)”：拥有完整权限，可编辑内容、管理成员访问级别，或将记忆移回共享相册。'

        setStatusFeedback({
          kind: 'unlocked',
          messageEn: roleSummaryEn,
          messageZh: roleSummaryZh,
        })
      } else {
        setStatusFeedback({
          kind: 'neutral',
          messageEn: `Ready to test as ${nextRole.toUpperCase()}: Click "Unlock Private Archive" below to experience this role's permissions.`,
          messageZh: `已切换至 ${nextRole.toUpperCase()} 视角：点击下方“解锁私密归档”体验该角色的权限边界。`,
        })
      }
    },
    [isUnlocked]
  )

  const handleUnlockAttempt = useCallback(() => {
    if (activeRole === 'no-access') {
      setIsUnlocked(false)
      setStatusFeedback({
        kind: 'denied',
        messageEn:
          'Unlock denied (403 Restricted): "No Access" members cannot open the Private Archive or see how many memories exist. Switch to Viewer, Editor, or Creator above.',
        messageZh:
          '拒绝解锁 (403 访问受限)：“无权限”角色无法打开私密归档，也无法获知内部记忆数量。请在上方切换至浏览者、编辑者或创建者。',
      })
      return
    }

    setIsUnlocked(true)
    setIsEditingNote(false)
    setConfirmingStandard(false)
    setStatusFeedback({
      kind: 'unlocked',
      messageEn:
        activeRole === 'viewer'
          ? 'Unlocked as Viewer (10-min session window): You can inspect private memories, but editing and permission controls are disabled.'
          : activeRole === 'editor'
            ? 'Unlocked as Editor (10-min session window): You can read and edit memory notes, while Creator audience controls remain hidden.'
            : 'Unlocked as Creator (10-min session window): Full access to memory notes, "Who can access?" ACL presets, and archive boundary actions.',
      messageZh:
        activeRole === 'viewer'
          ? '已以“浏览者”身份解锁（10 分钟会话窗口）：可阅览私密记忆详情，但编辑与权限变更操作已被禁用。'
          : activeRole === 'editor'
            ? '已以“编辑者”身份解锁（10 分钟会话窗口）：可阅读并修改记忆批注，创建者专属的访问权限设置仍受保护。'
            : '已以“创建者”身份解锁（10 分钟会话窗口）：开放完整编辑权限、“谁可以访问？”成员名单管理及移回共享相册操作。',
    })
  }, [activeRole])

  const handleRelock = useCallback(() => {
    setIsUnlocked(false)
    setIsEditingNote(false)
    setConfirmingStandard(false)
    setStatusFeedback({
      kind: 'locked',
      messageEn:
        'Private Archive locked: All private photographs, titles, and counts have been cleared from the screen.',
      messageZh:
        '私密归档已手动锁定：所有受保护照片、标题与数量信息已立即从屏幕清空。',
    })
  }, [])

  const handleAttemptEdit = useCallback(() => {
    if (activeRole === 'viewer') {
      setStatusFeedback({
        kind: 'read-only',
        messageEn:
          'Modification prevented: Viewer access is strictly read-only. Switch to Editor or Creator to modify this memory.',
        messageZh:
          '已拦截修改操作：浏览者（Viewer）处于严格只读模式。请切换至编辑者或创建者以修改记忆批注。',
      })
      return
    }
    setIsEditingNote(true)
  }, [activeRole])

  const handleSaveNoteToggle = useCallback(() => {
    setEditedNotes((prev) => ({
      ...prev,
      [activeRecord.id]: !prev[activeRecord.id],
    }))
    setIsEditingNote(false)
    setStatusFeedback({
      kind: 'saved',
      messageEn: `Memory note updated by ${activeRole === 'creator' ? 'Creator' : 'Editor'} (portfolio demonstration state).`,
      messageZh: `已由${activeRole === 'creator' ? '创建者' : '编辑者'}更新记忆批注（作品集演示状态）。`,
    })
  }, [activeRecord.id, activeRole])

  const handleConfirmMakeStandard = useCallback(() => {
    setConfirmingStandard(false)
    setStatusFeedback({
      kind: 'saved',
      messageEn:
        'Creator boundary action verified: In production, confirming "Make standard" moves the memory to Shared Moments and removes its private ACL.',
      messageZh:
        '已验证创建者边界操作：在实际产品中，确认“移至普通相册”会将该记忆转入共享画廊并清除其私密访问列表。',
    })
  }, [])

  const motionTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }

  const roleOptions: ReadonlyArray<{
    id: PrivateArchiveDemoRole
    code: string
    labelEn: string
    labelZh: string
    summaryEn: string
    summaryZh: string
  }> = [
    {
      id: 'no-access',
      code: '01 · RESTRICTED',
      labelEn: 'No Access',
      labelZh: '无权限 (No Access)',
      summaryEn: 'Cannot unlock or see record count',
      summaryZh: '无法解锁或查看数量',
    },
    {
      id: 'viewer',
      code: '02 · READ-ONLY',
      labelEn: 'Viewer',
      labelZh: '浏览者 (Viewer)',
      summaryEn: 'Unlock & view only',
      summaryZh: '可解锁并只读浏览',
    },
    {
      id: 'editor',
      code: '03 · COLLABORATOR',
      labelEn: 'Editor',
      labelZh: '编辑者 (Editor)',
      summaryEn: 'View & edit memory notes',
      summaryZh: '可查看并编辑记忆批注',
    },
    {
      id: 'creator',
      code: '04 · OWNER ACL',
      labelEn: 'Creator',
      labelZh: '创建者 (Creator)',
      summaryEn: 'Manage privacy & permissions',
      summaryZh: '管理隐私名单与归档边界',
    },
  ]

  return (
    <section
      className="ls-private-archive-demo"
      aria-labelledby="ls-pa-demo-heading"
      data-vault-state={isUnlocked ? 'unlocked' : 'locked'}
      data-active-role={activeRole}
    >
      {/* Top Header & Discreet UX Design Insight Toggle */}
      <header className="ls-pa-header">
        <div className="ls-pa-title-cluster">
          <div className="ls-pa-eyebrow-row">
            <span className="ls-pa-demo-badge">
              {isZh
                ? '交互式作品集原型 · 二级隐私锁与角色权限模拟'
                : 'INTERACTIVE PORTFOLIO PROTOTYPE · PRIVACY GATE & ROLE PERMISSIONS'}
            </span>
            <span className="ls-pa-meta-note">
              {isZh
                ? '无需真实密码 · 模拟四类访问权限边界'
                : 'NO REAL CREDENTIALS REQUIRED · 4 ACCESS BOUNDARY SCENARIOS'}
            </span>
          </div>
          <h4 id="ls-pa-demo-heading" className="ls-pa-heading">
            {isZh
              ? '体验私密归档边界：切换访问角色并测试解锁、只读保护与创建者专属权限'
              : 'Experience Private Archive Boundaries: Switch access roles to test unlocking, read-only protection, and Creator controls'}
          </h4>
        </div>

        <button
          type="button"
          className={`ls-pa-ux-insight-toggle ${
            isUxInsightOpen ? 'is-open' : ''
          }`}
          data-ux-insight-toggle="private-archive"
          aria-expanded={isUxInsightOpen}
          aria-controls="ls-pa-ux-insight-panel"
          onClick={() => setIsUxInsightOpen((prev) => !prev)}
        >
          <span className="ls-pa-ux-dot" aria-hidden="true" />
          <span>
            {isZh
              ? '为什么要区分共享记忆与私密归档？'
              : 'Why separate private and shared memories?'}
          </span>
          <span className="ls-pa-ux-chevron" aria-hidden="true">
            {isUxInsightOpen ? '−' : '+'}
          </span>
        </button>
      </header>

      {/* Collapsible Portfolio UX Insight ("Why separate private and shared memories?") */}
      <AnimatePresence initial={false}>
        {isUxInsightOpen ? (
          <motion.div
            id="ls-pa-ux-insight-panel"
            className="ls-pa-ux-insight-drawer"
            role="region"
            aria-label={
              isZh
                ? '区分共享记忆与私密归档的 UX 设计原理解析'
                : 'Private Archive UX design rationale'
            }
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={motionTransition}
          >
            <div className="ls-pa-ux-insight-grid">
              <div className="ls-pa-ux-cell">
                <span className="ls-pa-ux-kicker">
                  {isZh ? '01 · 用户需求 (USER NEED)' : '01 · USER NEED'}
                </span>
                <p className="ls-pa-ux-text">
                  {isZh
                    ? '伴侣在日常浏览或向亲友展示共享相册时，希望将手写信件或高度私密的纪念时刻单独妥善封存。'
                    : 'Partners want to browse or show their shared album casually without accidentally exposing deeply personal letters or private moments.'}
                </p>
              </div>
              <div className="ls-pa-ux-cell">
                <span className="ls-pa-ux-kicker">
                  {isZh
                    ? '02 · 隐私要求 (PRIVACY REQUIREMENT)'
                    : '02 · PRIVACY REQUIREMENT'}
                </span>
                <p className="ls-pa-ux-text">
                  {isZh
                    ? '未解锁前不得泄露任何私密记忆数量、标题或缩略图；且只有记忆创建者有权调整谁可以查看或编辑。'
                    : 'Zero metadata (no counts, titles, or covers) may leak while locked, and only the Creator can configure who has View or Edit access.'}
                </p>
              </div>
              <div className="ls-pa-ux-cell">
                <span className="ls-pa-ux-kicker">
                  {isZh ? '03 · 设计决策 (DESIGN DECISION)' : '03 · DESIGN DECISION'}
                </span>
                <p className="ls-pa-ux-text">
                  {isZh
                    ? '构建独立二级密码门禁与 10 分钟会话自动锁，结合按成员授权的“仅自己 / 指定成员 / 全体快照”三级权限模型。'
                    : 'Combine a secondary privacy password gate and 10-minute session auto-lock with per-member "Only me / Selected people / Everyone" ACL presets.'}
                </p>
              </div>
              <div className="ls-pa-ux-cell">
                <span className="ls-pa-ux-kicker">
                  {isZh
                    ? '04 · 交互反馈与实装说明 (INTERACTION & PROVENANCE)'
                    : '04 · INTERACTION & PROVENANCE'}
                </span>
                <p className="ls-pa-ux-text">
                  {isZh
                    ? '实装功能：二级密码门禁、零元数据锁定态、顶部一键 Lock 与创建者专属权限表；作品集演示：提供上方四角色切换器以便免密体验权限差异。'
                    : 'Verified in product: second-lock gate, zero-metadata locked state, top-bar Lock button, and Creator ACL presets. Portfolio demo: role switcher simulates access without real passwords.'}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Role Selector Strip: 4 Demonstration Access Scenarios */}
      <div className="ls-pa-role-bar-wrap">
        <div className="ls-pa-role-bar-label-row">
          <span className="ls-pa-role-bar-kicker">
            {isZh
              ? '选择演示访问角色 (DEMONSTRATION ACCESS ROLE)'
              : 'SELECT DEMONSTRATION ACCESS SCENARIO'}
          </span>
          <span className="ls-pa-role-state-indicator">
            {isUnlocked
              ? isZh
                ? '状态：归档已解锁 (10分钟会话窗口)'
                : 'STATUS: ARCHIVE UNLOCKED (10-MIN WINDOW)'
              : isZh
                ? '状态：归档已闭合 (零元数据暴露)'
                : 'STATUS: ARCHIVE LOCKED (ZERO METADATA EXPOSED)'}
          </span>
        </div>

        <div
          className="ls-pa-role-selector"
          role="group"
          aria-label={
            isZh
              ? '切换私密归档演示角色'
              : 'Switch Private Archive demonstration access role'
          }
        >
          {roleOptions.map((role) => {
            const isSelected = activeRole === role.id
            return (
              <button
                key={role.id}
                type="button"
                data-private-role={role.id}
                aria-pressed={isSelected}
                className={`ls-pa-role-btn ${isSelected ? 'is-active' : ''}`}
                onClick={() => handleSelectRole(role.id)}
              >
                <span className="ls-pa-role-code">{role.code}</span>
                <span className="ls-pa-role-name">
                  {isZh ? role.labelZh : role.labelEn}
                </span>
                <span className="ls-pa-role-desc">
                  {isZh ? role.summaryZh : role.summaryEn}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Live Status Feedback Banner */}
      <div
        className={`ls-pa-status-banner is-${statusFeedback.kind}`}
        role="status"
        aria-live="polite"
        data-private-feedback={statusFeedback.kind}
      >
        <span className="ls-pa-status-dot" aria-hidden="true" />
        <p className="ls-pa-status-text">
          {isZh ? statusFeedback.messageZh : statusFeedback.messageEn}
        </p>
      </div>

      {/* Main Stage: Locked Gate vs. Unlocked Role-Aware Archive */}
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          /* ================================================================
             LOCKED INITIAL STATE (Zero Private Content or Counts Exposed)
             ================================================================ */
          <motion.div
            key="ls-pa-locked-gate"
            className={`ls-pa-locked-stage ${
              activeRole === 'no-access' ? 'is-restricted-role' : ''
            }`}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
            transition={motionTransition}
          >
            <div className="ls-pa-locked-chamber">
              <div className="ls-pa-lock-emblem-row">
                <span className="ls-pa-lock-glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      d="M8.4 10.5V8.2a3.6 3.6 0 0 1 7.2 0v2.3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <rect
                      x="5"
                      y="10.5"
                      width="14"
                      height="9.5"
                      rx="1.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </span>
                <span className="ls-pa-locked-eyebrow">
                  {isZh
                    ? 'PRIVATE ARCHIVE · 二级隐私门禁'
                    : 'PRIVATE ARCHIVE · SECOND-LOCK BOUNDARY'}
                </span>
              </div>

              <h3 className="ls-pa-locked-title">
                {isZh
                  ? '受保护的私密记忆需要验证二级隐私密码。'
                  : 'Protected memories require your privacy password.'}
              </h3>

              <p className="ls-pa-locked-copy">
                {isZh
                  ? '私密归档当前处于闭合状态。在解锁之前，这里不会显示任何信息——甚至不会暴露内部存有多少则记忆。解锁状态仅在当前浏览器维持 10 分钟。'
                  : 'Your private memories are closed. Nothing about them — not how many there are — is shown until you open the archive. Unlocking lasts ten minutes for this browser session.'}
              </p>

              {/* Simulated Password Field & Single Clear Unlock Action */}
              <div className="ls-pa-unlock-control-box">
                <div className="ls-pa-simulated-field" aria-hidden="true">
                  <span className="ls-pa-field-label">
                    {isZh ? '二级隐私密码 (演示模拟)' : 'PRIVACY PASSWORD (DEMO SIMULATION)'}
                  </span>
                  <div className="ls-pa-field-dots">
                    <span>••••••••••••</span>
                    <span className="ls-pa-field-role-tag">
                      {activeRole === 'no-access'
                        ? isZh
                          ? '无访问权限'
                          : 'NO ACCESS ACL'
                        : isZh
                          ? `已授权：${activeRole.toUpperCase()}`
                          : `AUTHORISED: ${activeRole.toUpperCase()}`}
                    </span>
                  </div>
                </div>

                <div className="ls-pa-unlock-actions-row">
                  <button
                    ref={unlockButtonRef}
                    type="button"
                    className={`ls-pa-unlock-btn ${
                      activeRole === 'no-access' ? 'is-denied-style' : ''
                    }`}
                    data-private-action="unlock"
                    onClick={handleUnlockAttempt}
                  >
                    <span>
                      {activeRole === 'no-access'
                        ? isZh
                          ? '尝试解锁私密归档 →'
                          : 'Attempt to Unlock Archive →'
                        : isZh
                          ? '解锁私密归档 →'
                          : 'Unlock Private Archive →'}
                    </span>
                  </button>

                  <span className="ls-pa-unlock-hint">
                    {activeRole === 'no-access'
                      ? isZh
                        ? '当前角色将被 403 门禁拦截，不会暴露任何内容。'
                        : 'Current role will be refused (403) without exposing any records.'
                      : isZh
                        ? '点击即可免密进入演示归档，检视当前角色权限。'
                        : 'Click to open the privacy-safe demonstration archive.'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ================================================================
             UNLOCKED PRIVATE ARCHIVE STAGE (Viewer / Editor / Creator)
             ================================================================ */
          <motion.div
            key="ls-pa-unlocked-vault"
            className="ls-pa-unlocked-stage"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
            transition={motionTransition}
          >
            {/* Unlocked Top Chrome Bar with Prominent Lock Button */}
            <div className="ls-pa-vault-topbar">
              <div className="ls-pa-vault-meta">
                <span className="ls-pa-vault-kicker">
                  {isZh
                    ? 'OUR STORY · 私密归档已解锁 (2 则演示记录)'
                    : 'OUR STORY · PRIVATE ARCHIVE UNLOCKED (2 DEMO RECORDS)'}
                </span>
                <span
                  className="ls-pa-active-permission-pill"
                  data-permission-badge={activeRole}
                >
                  {activeRole === 'viewer'
                    ? isZh
                      ? '当前权限：浏览者 (仅查看 · 禁止修改)'
                      : 'Permission: Viewer (View-Only)'
                    : activeRole === 'editor'
                      ? isZh
                        ? '当前权限：编辑者 (可查看与编辑内容)'
                        : 'Permission: Editor (View & Edit)'
                      : isZh
                        ? '当前权限：创建者 (完整管理与权限分配)'
                        : 'Permission: Creator (Owner & Privacy Management)'}
                </span>
              </div>

              <button
                ref={lockButtonRef}
                type="button"
                className="ls-pa-lock-btn"
                data-private-action="lock"
                onClick={handleRelock}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  aria-hidden="true"
                >
                  <path
                    d="M8.4 10.5V8.2a3.6 3.6 0 0 1 7.2 0v2.3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <rect
                    x="5"
                    y="10.5"
                    width="14"
                    height="9.5"
                    rx="1.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <span>{isZh ? '锁定私密归档 (Lock)' : 'Lock Private Archive'}</span>
              </button>
            </div>

            {/* Record Switcher Tabs (2 Privacy-Safe Demo Records) */}
            <div
              className="ls-pa-record-tabs"
              role="group"
              aria-label={
                isZh ? '选择私密记忆演示样本' : 'Select private memory demonstration record'
              }
            >
              {PRIVATE_DEMO_RECORDS.map((rec) => {
                const isSelected = rec.id === activeRecord.id
                return (
                  <button
                    key={rec.id}
                    type="button"
                    data-private-record={rec.id}
                    aria-pressed={isSelected}
                    className={`ls-pa-record-tab ${
                      isSelected ? 'is-active' : ''
                    }`}
                    onClick={() => {
                      setSelectedRecordId(rec.id)
                      setIsEditingNote(false)
                      setConfirmingStandard(false)
                    }}
                  >
                    <span className="ls-pa-record-idx">
                      {isZh ? `私密记录 ${rec.indexLabel}` : `PRIVATE ${rec.indexLabel}`}
                    </span>
                    <span className="ls-pa-record-name">
                      {isZh ? rec.titleZh : rec.titleEn}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Main Two-Column Unlocked Content Split */}
            <div className="ls-pa-unlocked-grid">
              {/* Left Column: #20211E Private Photograph Frame */}
              <figure className="ls-pa-photo-column">
                <div
                  className="ls-pa-photo-frame"
                  style={{ aspectRatio: activeRecord.photo.aspectRatio }}
                >
                  <picture className="ls-pa-picture">
                    <source
                      srcSet={activeRecord.photo.webp}
                      type="image/webp"
                    />
                    <img
                      src={activeRecord.photo.png}
                      alt={isZh ? activeRecord.titleZh : activeRecord.titleEn}
                      className="ls-pa-img"
                    />
                  </picture>
                  <span className="ls-pa-private-seal">
                    {isZh ? '私密归档 · 10分钟自动锁' : 'PRIVATE ARCHIVE · 10-MIN AUTO-LOCK'}
                  </span>
                </div>
                <figcaption className="ls-pa-figcaption">
                  <span>
                    {isZh
                      ? activeRecord.photo.captionZh
                      : activeRecord.photo.captionEn}
                  </span>
                  <span>
                    {isZh ? activeRecord.addedByZh : activeRecord.addedByEn}
                  </span>
                </figcaption>
              </figure>

              {/* Right Column: Private Memory Details + Role-Dependent Actions */}
              <div className="ls-pa-detail-column">
                <div className="ls-pa-detail-meta">
                  <span className="ls-pa-detail-facts">
                    {isZh
                      ? `${activeRecord.dateZh} · ${activeRecord.placeZh} · ${activeRecord.weatherMoodZh}`
                      : `${activeRecord.dateEn} · ${activeRecord.placeEn} · ${activeRecord.weatherMoodEn}`}
                  </span>
                  <h3 className="ls-pa-detail-title">
                    {isZh ? activeRecord.titleZh : activeRecord.titleEn}
                  </h3>
                </div>

                {/* Personal Reflection Note & Editing Demonstration */}
                <div className="ls-pa-note-card">
                  <div className="ls-pa-note-header">
                    <span className="ls-pa-note-kicker">
                      {isZh ? '私密信件与手记内容' : 'PRIVATE LETTER & REFLECTION NOTE'}
                    </span>
                    {isRecordEdited ? (
                      <span
                        className="ls-pa-edited-badge"
                        data-note-edited="true"
                      >
                        {isZh ? '已保存批注更新' : 'Edited in Demo'}
                      </span>
                    ) : null}
                  </div>

                  <p className="ls-pa-note-body" data-private-note-text="true">
                    {displayedNote}
                  </p>

                  {/* Action Bar for Viewing vs. Editing */}
                  <div className="ls-pa-note-actions">
                    {!isEditingNote ? (
                      <button
                        type="button"
                        className={`ls-pa-action-btn ${
                          activeRole === 'viewer' ? 'is-readonly-action' : ''
                        }`}
                        data-private-action="edit-note"
                        onClick={handleAttemptEdit}
                      >
                        <span>
                          {activeRole === 'viewer'
                            ? isZh
                              ? '编辑记忆批注 (浏览者只读受限)'
                              : 'Edit Memory Note (Restricted for Viewer)'
                            : isZh
                              ? '编辑记忆批注 (Edit Memory)'
                              : 'Edit Memory Note'}
                        </span>
                      </button>
                    ) : (
                      <div
                        className="ls-pa-inline-editor"
                        data-inline-editor="open"
                      >
                        <p className="ls-pa-editor-preview">
                          {isZh
                            ? '演示编辑：切换或保存纪念批注时间戳，体验 Editor / Creator 的合法修改权限。'
                            : 'Demonstration edit: Toggle the keepsake timestamp annotation to test permitted Editor / Creator updates.'}
                        </p>
                        <div className="ls-pa-editor-btns">
                          <button
                            type="button"
                            className="ls-pa-save-btn"
                            data-private-action="save-note"
                            onClick={handleSaveNoteToggle}
                          >
                            {isZh ? '保存批注修改' : 'Save Note Update'}
                          </button>
                          <button
                            type="button"
                            className="ls-pa-cancel-btn"
                            onClick={() => setIsEditingNote(false)}
                          >
                            {isZh ? '取消' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Creator-Exclusive Privacy & Audience Control ("Who can access?") */}
                {activeRole === 'creator' ? (
                  <div
                    className="ls-pa-creator-panel"
                    data-creator-controls="visible"
                  >
                    <div className="ls-pa-creator-header">
                      <span className="ls-pa-creator-kicker">
                        {isZh
                          ? '创建者专属控制 · 谁可以访问？ (WHO CAN ACCESS?)'
                          : 'CREATOR-EXCLUSIVE CONTROL · WHO CAN ACCESS?'}
                      </span>
                      <span className="ls-pa-creator-badge">
                        {isZh ? '仅 Owner 可见' : 'Owner Only'}
                      </span>
                    </div>

                    {/* 3 Audience Presets from privacy-audience.js */}
                    <div
                      className="ls-pa-audience-presets"
                      role="radiogroup"
                      aria-label={
                        isZh ? '选择私密记忆访问范围预设' : 'Select private memory audience preset'
                      }
                    >
                      {(
                        [
                          {
                            key: 'only',
                            labelEn: 'Only me',
                            labelZh: '仅自己可见 (Only me)',
                          },
                          {
                            key: 'selected',
                            labelEn: 'Selected people',
                            labelZh: '指定成员 (Selected)',
                          },
                          {
                            key: 'everyone',
                            labelEn: 'Everyone in space',
                            labelZh: '当前空间成员快照',
                          },
                        ] as const
                      ).map((preset) => {
                        const isChecked = audiencePreset === preset.key
                        return (
                          <button
                            key={preset.key}
                            type="button"
                            role="radio"
                            aria-checked={isChecked}
                            data-audience-preset={preset.key}
                            className={`ls-pa-preset-pill ${
                              isChecked ? 'is-active' : ''
                            }`}
                            onClick={() => setAudiencePreset(preset.key)}
                          >
                            {isZh ? preset.labelZh : preset.labelEn}
                          </button>
                        )
                      })}
                    </div>

                    {/* Per-Member Permission Row when not "Only me" */}
                    {audiencePreset !== 'only' ? (
                      <div className="ls-pa-member-acl-row">
                        <span className="ls-pa-member-name">
                          {isZh ? '伴侣 (Partner)' : 'Partner (Space Member)'}
                        </span>
                        <div
                          className="ls-pa-member-perm-group"
                          role="group"
                          aria-label={
                            isZh ? '分配伴侣访问权限' : 'Assign partner permission level'
                          }
                        >
                          {(
                            [
                              {
                                key: 'none',
                                labelEn: 'No access',
                                labelZh: '无权限',
                              },
                              {
                                key: 'viewer',
                                labelEn: 'View',
                                labelZh: '仅查看',
                              },
                              {
                                key: 'editor',
                                labelEn: 'Edit',
                                labelZh: '可编辑',
                              },
                            ] as const
                          ).map((perm) => (
                            <button
                              key={perm.key}
                              type="button"
                              data-partner-permission={perm.key}
                              aria-pressed={partnerPermission === perm.key}
                              className={`ls-pa-perm-chip ${
                                partnerPermission === perm.key
                                  ? 'is-active'
                                  : ''
                              }`}
                              onClick={() => setPartnerPermission(perm.key)}
                            >
                              {isZh ? perm.labelZh : perm.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="ls-pa-only-me-note">
                        {isZh
                          ? '当前设为“仅自己可见”：不写入任何额外访问行，仅创建者本人可解锁阅读。'
                          : 'Set to "Only me": Zero external ACL rows are stored; only the Creator can read this record.'}
                      </p>
                    )}

                    {/* Creator Boundary Action: Move to Shared Moments with Inline Confirmation */}
                    <div className="ls-pa-boundary-actions">
                      {!confirmingStandard ? (
                        <button
                          type="button"
                          className="ls-pa-make-standard-btn"
                          data-private-action="request-make-standard"
                          onClick={() => setConfirmingStandard(true)}
                        >
                          {isZh
                            ? '移出私密归档 → 转为普通共享记忆 (Make standard)'
                            : 'Move to Shared Moments (Make standard)'}
                        </button>
                      ) : (
                        <div
                          className="ls-pa-inline-confirm"
                          data-private-confirm="standard"
                        >
                          <p className="ls-pa-confirm-text">
                            {isZh
                              ? '确认转为普通共享记忆？此记忆将出现在共享画廊中，且其私密访问列表将被移除。'
                              : 'Make this a standard shared memory? It will appear in the shared gallery and its private access list will be removed.'}
                          </p>
                          <div className="ls-pa-confirm-btns">
                            <button
                              type="button"
                              className="ls-pa-confirm-yes"
                              data-private-action="confirm-make-standard"
                              onClick={handleConfirmMakeStandard}
                            >
                              {isZh ? '确认转移' : 'Confirm Move'}
                            </button>
                            <button
                              type="button"
                              className="ls-pa-confirm-no"
                              onClick={() => setConfirmingStandard(false)}
                            >
                              {isZh ? '保留为私密' : 'Keep Private'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="ls-pa-non-creator-boundary-note"
                    data-creator-controls="restricted"
                  >
                    <span className="ls-pa-boundary-kicker">
                      {isZh
                        ? '创建者专属隐私边界 (OWNER-ONLY BOUNDARY)'
                        : 'CREATOR-ONLY PRIVACY BOUNDARY'}
                    </span>
                    <p className="ls-pa-boundary-copy">
                      {activeRole === 'viewer'
                        ? isZh
                          ? '作为浏览者（Viewer），你无法编辑内容，也无法查看或修改“谁可以访问”名单。切换至上方 Creator 角色可体验完整权限管理。'
                          : 'As a Viewer, editing and the "Who can access?" ACL panel are hidden to prevent accidental modification. Switch to Creator above to manage permissions.'
                        : isZh
                          ? '作为编辑者（Editor），你可以更新记忆批注，但无权更改“谁可以访问”名单或将私密记忆转为公开。切换至 Creator 角色可查看权限面板。'
                          : 'As an Editor, you can update the memory note, but cannot alter the "Who can access?" list or move the memory to Shared Moments. Switch to Creator above to inspect owner controls.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
