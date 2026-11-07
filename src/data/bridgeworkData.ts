import type { Locale } from './portfolioData'

export type BridgeWorkSectionId =
  | 'bw-01-challenge'
  | 'bw-02-evidence'
  | 'bw-03-difference'
  | 'bw-04-mvp'
  | 'bw-05-learned'

export type BridgeWorkResearchStageId =
  | 'hypothesis'
  | 'test-card'
  | 'evidence'
  | 'learning-card'
  | 'design-decision'

export interface BridgeWorkEntranceCardSpec {
  id: string
  code: string
  role: string
  companyContext: string
  location: string
  pay: string
  arrangement: string
  requirements: string
  flexibility: string
  isShortlisted: boolean
  isSelectedWinner?: boolean
  noiseOffset: { x: number; y: number; rotate: number }
  priorityMatches?: string[]
  privateNotePreview?: string
}

export interface BridgeWorkResearchStageData {
  id: BridgeWorkResearchStageId
  stepNumber: '01' | '02' | '03' | '04' | '05'
  badge: string
  shortTitle: string
  epistemicTag: string
  headline: string
  coreStatement: string
  supportingPoints: {
    label: string
    detail: string
    tone: 'supported' | 'friction' | 'neutral'
  }[]
  methodologyBoundaryNote: string
}

export interface BridgeWorkIterationRecord {
  id: 'iter-01' | 'iter-02' | 'iter-03'
  number: '01' | '02' | '03'
  code: string
  title: string
  themeOrFocus: string
  statusTag: string
  exploredTopics: string[]
  hypothesesOrPatternsHeading: string
  hypothesesOrPatterns: string[]
  keyLearningHeading: string
  keyLearning: string
  epistemicBoundary: string
}

export interface BridgeWorkSecondaryTopicEntry {
  id: string
  code: string
  title: string
  iterationTag: string
  epistemicStatus: string
  observedFinding: string
  productResponse: string
  boundaryNote: string
}

export interface BridgeWorkCompetitorComparisonRow {
  id: string
  platform: string
  typicalRole: string
  strengthObserved: string
  studentWorkflowFriction: string
  bridgeworkContinuityRole: string
}

export interface BridgeWorkBmcBlock {
  id: string
  code: string
  title: string
  validationTag: string
  validationTone: 'observed' | 'hypothesis'
  items: string[]
}

export interface BridgeWorkMvpTier {
  id: 'core' | 'supporting' | 'experimental'
  code: string
  title: string
  statusBadge: string
  statusTone: 'core' | 'supporting' | 'experimental'
  description: string
  features: {
    name: string
    evidenceLink: string
    scopeStatus: string
  }[]
}

export interface BridgeWorkArtefactDistinction {
  code: string
  term: string
  purpose: string
  projectExample: string
}

export interface BridgeWorkLocaleData {
  topbar: {
    backToPortfolio: string
    skipIntro: string
    replayIntro: string
    designVersionBadge: string
    teamContextBadge: string
  }
  entrance: {
    scene01Label: string
    scene01Caption: string
    scene02Label: string
    scene02Caption: string
    scene03Label: string
    scene03Caption: string
    scene04Label: string
    scene04Caption: string
    criteriaHeaderLabel: string
    criteriaPills: [string, string, string, string]
    demoDataDisclaimer: string
    shortlistBadge: string
    selectedBadge: string
    cards: BridgeWorkEntranceCardSpec[]
  }
  hero: {
    eyebrow: string
    title: string
    tagline: string
    positioningLead: string
    workflowLabel: string
    workflowSteps: {
      code: string
      name: string
      detail: string
      isHighlighted?: boolean
    }[]
    metaGrid: {
      label: string
      value: string
    }[]
    honestFramingBanner: {
      badge: string
      text: string
    }
    heroSpecimen: {
      headerCode: string
      headerTitle: string
      headerStatus: string
      activeCriteriaLabel: string
      comparisonNoteLabel: string
      comparisonNoteText: string
      sharingControlLabel: string
      sharingControlValue: string
    }
  }
  sectionNav: {
    ariaLabel: string
    items: {
      id: BridgeWorkSectionId
      number: '01' | '02' | '03' | '04' | '05'
      title: string
      shortTitle: string
    }[]
  }
  section01Challenge: {
    number: '01'
    eyebrow: string
    title: string
    lead: string
    problemCards: {
      code: string
      title: string
      observation: string
      statusTag: string
    }[]
    initialHypothesesHeading: string
    initialHypothesesSubnote: string
    initialHypotheses: {
      code: string
      statement: string
      epistemicStatus: string
    }[]
  }
  section02Evidence: {
    number: '02'
    eyebrow: string
    title: string
    lead: string
    iterationsHeading: string
    iterationsSubnote: string
    iterations: BridgeWorkIterationRecord[]
    featuredExhibit: {
      badge: string
      title: string
      subtitle: string
      stageSelectorAria: string
      metricsHeading: string
      metricsDisclaimer: string
      metrics: {
        id: 'save' | 'compare' | 'priorities' | 'notes'
        code: string
        label: string
        score: string
        numericValue: number
        maxValue: number
        ratingNote: string
        statusTone: 'strong' | 'moderate' | 'friction'
      }[]
      frictionCallout: {
        badge: string
        title: string
        detail: string
      }
      stages: Record<BridgeWorkResearchStageId, BridgeWorkResearchStageData>
      uiBeforeAfterExhibit: {
        heading: string
        subnote: string
        beforeLabel: string
        beforeTitle: string
        beforeIssues: string[]
        afterLabel: string
        afterTitle: string
        afterDecisions: string[]
        unvalidatedRetestNote: string
      }
    }
    secondaryTopicsToggleLabel: string
    secondaryTopicsHideLabel: string
    secondaryTopicsHeading: string
    secondaryTopicsSubnote: string
    secondaryTopics: BridgeWorkSecondaryTopicEntry[]
  }
  section03Difference: {
    number: '03'
    eyebrow: string
    title: string
    lead: string
    comparisonHeading: string
    comparisonSubnote: string
    comparisonHeaders: {
      platform: string
      typicalRole: string
      strengthObserved: string
      studentFriction: string
      bridgeworkRole: string
    }
    comparisonRows: BridgeWorkCompetitorComparisonRow[]
    bmcHeading: string
    bmcSubnote: string
    bmcSummaryPillars: {
      code: string
      title: string
      epistemicBadge: string
      tone: 'observed' | 'hypothesis'
      points: string[]
    }[]
    bmcExpandLabel: string
    bmcCollapseLabel: string
    bmcFullBlocks: BridgeWorkBmcBlock[]
  }
  section04Mvp: {
    number: '04'
    eyebrow: string
    title: string
    lead: string
    artefactDistinctionHeading: string
    artefactDistinctionSubnote: string
    artefactDistinctions: BridgeWorkArtefactDistinction[]
    mvpTiersHeading: string
    mvpTiersSubnote: string
    mvpTiers: BridgeWorkMvpTier[]
    workspaceExhibit: {
      badge: string
      title: string
      honestLabel: string
      tabs: {
        id: 'compare-workspace' | 'profile-sharing' | 'application-tracker'
        code: string
        label: string
        scopeTag: string
        summary: string
        keyUiElements: string[]
      }[]
    }
  }
  section05Learned: {
    number: '05'
    eyebrow: string
    title: string
    lead: string
    keyLearningsHeading: string
    keyLearnings: {
      code: string
      title: string
      detail: string
      epistemicTag: string
    }[]
    unresolvedHeading: string
    unresolvedItems: {
      code: string
      topic: string
      reason: string
    }[]
    myContributionHeading: string
    myContributionSubnote: string
    myContributions: {
      code: string
      area: string
      detail: string
    }[]
    teamAttributionBoundary: string
    footerNextProjectLabel: string
  }
}

export const BRIDGEWORK_DATA: Record<Locale, BridgeWorkLocaleData> = {
  en: {
    topbar: {
      backToPortfolio: 'Back to Portfolio',
      skipIntro: 'Skip Intro',
      replayIntro: 'Replay Demo',
      designVersionBadge: 'WHITE-20261022 SYSTEM',
      teamContextBadge: '5-MEMBER UNIVERSITY TEAM',
    },
    entrance: {
      scene01Label: 'BEAT 01 · DISCOVER',
      scene01Caption: 'Inspecting multi-board listings in one workspace.',
      scene02Label: 'BEAT 02 · SEARCH & FILTER',
      scene02Caption: 'Filtering "UX Designer" roles in Brisbane.',
      scene03Label: 'BEAT 03 · SAVE & COMPARE',
      scene03Caption: 'Shortlisting 2 roles for side-by-side comparison.',
      scene04Label: 'BEAT 04 · SELECT & EXPLORE',
      scene04Caption: 'Expanding selected role into the BridgeWork AU Case Study.',
      criteriaHeaderLabel: 'COMPARISON CRITERIA',
      criteriaPills: ['PAY', 'LOCATION', 'REQUIREMENTS', 'FLEXIBILITY'],
      demoDataDisclaimer:
        'Representative demonstration job cards for UX workflow illustration (not live vacancy offers or automated match scores).',
      shortlistBadge: 'SHORTLISTED',
      selectedBadge: 'SELECTED FIRST',
      cards: [
        {
          id: 'bw-card-01',
          code: 'ROLE 01 · BRISBANE',
          role: 'Junior Product & UX Designer',
          companyContext: 'Education Tech Studio · Early-Career Cohort',
          location: 'Brisbane CBD · Hybrid (2 days remote)',
          pay: '$38 / hr · Casual / Part-time',
          arrangement: '16–24 hrs/wk · Semester flexible',
          requirements: 'Portfolio (2 case studies) · Student visa eligible',
          flexibility: 'High — aligns with lecture timetable',
          isShortlisted: true,
          isSelectedWinner: true,
          noiseOffset: { x: -240, y: -110, rotate: -5.5 },
          priorityMatches: [
            'PAY: Transparent hourly rate',
            'LOCATION: Brisbane hybrid',
            'REQUIREMENTS: Student visa eligible',
            'FLEXIBILITY: 16–24 hrs/wk',
          ],
          privateNotePreview:
            'Private Note: Emphasise UQ interaction design coursework & reusable profile draft B.',
        },
        {
          id: 'bw-card-02',
          code: 'ROLE 02 · MELBOURNE',
          role: 'Graduate UI/UX Designer',
          companyContext: 'Retail Digital Platform · Graduate Intake',
          location: 'Melbourne Docklands · 5 days on-site',
          pay: '$68,000 / yr + Super · Full-time',
          arrangement: '38 hrs/wk · Fixed office hours',
          requirements: 'Completed degree · Full-time work rights required',
          flexibility: 'Low — requires immediate relocation',
          isShortlisted: true,
          isSelectedWinner: false,
          noiseOffset: { x: 250, y: -95, rotate: 4.8 },
          priorityMatches: [
            'PAY: Annual salary listed',
            'REQUIREMENTS: Full-time work rights',
          ],
          privateNotePreview:
            'Private Note: Save for end-of-semester graduation window; on-site schedule conflicts with classes.',
        },
        {
          id: 'bw-card-03',
          code: 'ROLE 04 · SYDNEY',
          role: 'Digital Experience Analyst',
          companyContext: 'Enterprise Consultancy',
          location: 'Sydney CBD · On-site',
          pay: 'Competitive salary (Unlisted)',
          arrangement: 'Full-time · Immediate start',
          requirements: '2+ yrs commercial experience · PR/Citizen only',
          flexibility: 'Unlisted',
          isShortlisted: false,
          noiseOffset: { x: -320, y: 125, rotate: 6.2 },
        },
        {
          id: 'bw-card-04',
          code: 'ROLE 03 · BRISBANE',
          role: 'Student UX Research Assistant',
          companyContext: 'Civic Service Lab · University Partner',
          location: 'South Brisbane · Hybrid (1 day on-site)',
          pay: '$35 / hr · Casual',
          arrangement: '12 hrs/wk · Project-based',
          requirements: 'Qualitative interview synthesis · Enrolled student',
          flexibility: 'High — flexible around exam weeks',
          isShortlisted: true,
          isSelectedWinner: false,
          noiseOffset: { x: 290, y: 130, rotate: -6.2 },
          priorityMatches: [
            'PAY: Transparent casual rate ($35/hr)',
            'LOCATION: South Brisbane hybrid',
            'REQUIREMENTS: Enrolled student eligible',
            'FLEXIBILITY: Exam-week flexible',
          ],
          privateNotePreview:
            'Private Note: Strong fit for qualitative synthesis skills; compare 12 hrs/wk cap against Role 01.',
        },
        {
          id: 'bw-card-05',
          code: 'ROLE 05 · REMOTE AU',
          role: 'Frontend & Design Systems Intern',
          companyContext: 'SaaS Product Team',
          location: 'Remote (AEST hours)',
          pay: '$34 / hr · Fixed-term',
          arrangement: '20 hrs/wk · Async standups',
          requirements: 'Figma tokens + React/CSS · GitHub portfolio',
          flexibility: 'High — async schedule',
          isShortlisted: false,
          noiseOffset: { x: -120, y: 170, rotate: -3.4 },
        },
        {
          id: 'bw-card-06',
          code: 'ROLE 06 · GOLD COAST',
          role: 'Junior Visual Designer',
          companyContext: 'Agency Studio',
          location: 'Gold Coast · On-site',
          pay: 'Unlisted · Contract',
          arrangement: '4 days/wk on-site',
          requirements: '3+ yrs agency experience · Own transport',
          flexibility: 'Low — 75 min commute',
          isShortlisted: false,
          noiseOffset: { x: 145, y: -165, rotate: 3.9 },
        },
      ],
    },
    hero: {
      eyebrow: '01 · EVIDENCE-BASED PRODUCT DISCOVERY & UX CASE STUDY',
      title: 'BridgeWork AU',
      tagline: 'Clear choices. Your control.',
      positioningLead:
        'A five-person university team project helping students and recent graduates in Australia discover, compare, and prepare job applications in one student-controlled workspace.',
      workflowLabel: 'CONNECTED STUDENT WORKFLOW',
      workflowSteps: [
        {
          code: '01',
          name: 'Discover',
          detail: 'Upfront pay, hours & visa eligibility',
        },
        {
          code: '02',
          name: 'Save',
          detail: 'Private shortlist (10/10 positive rating)',
          isHighlighted: true,
        },
        {
          code: '03',
          name: 'Compare',
          detail: 'Side-by-side trade-offs (8/10 positive rating)',
          isHighlighted: true,
        },
        {
          code: '04',
          name: 'Prepare',
          detail: 'Editable profile reuse & sharing control',
        },
        {
          code: '05',
          name: 'Track',
          detail: 'Drafts, submissions & milestones',
        },
      ],
      metaGrid: [
        {
          label: 'PROJECT TYPE',
          value: '5-Person University Team (COMP7110)',
        },
        {
          label: 'TARGET USERS',
          value: 'Students & Recent Graduates in Australia',
        },
        {
          label: 'MY CONTRIBUTIONS',
          value: 'Interviews, Synthesis, Competitor/BMC, Profile & Applications UX',
        },
        {
          label: 'DESIGN SYSTEM',
          value: 'white-20261022 (#ECEBE7 / #FFFFFF / #335D39)',
        },
      ],
      honestFramingBanner: {
        badge: 'RESEARCH CREDIBILITY BOUNDARY',
        text: 'Separates initial hypotheses, Test Cards, 10 supplied Iteration 3 interview records, and Learning Cards from unvalidated commercial and retest assumptions.',
      },
      heroSpecimen: {
        headerCode: 'SHORTLIST SPECIMEN · WHITE-20261022',
        headerTitle: 'Side-by-Side Comparison & Preparation Control',
        headerStatus: '3 ROLES SHORTLISTED',
        activeCriteriaLabel: 'ACTIVE PRIORITIES',
        comparisonNoteLabel: 'PRIVATE WORKSPACE NOTE',
        comparisonNoteText:
          'Prioritising Brisbane hybrid role: transparent pay ($38/hr), student visa eligibility, and 16–24 hrs/wk class flexibility.',
        sharingControlLabel: 'PROFILE SHARING BOUNDARY',
        sharingControlValue:
          'Editable Draft Ready · Academic Transcript set to "Review Before Sharing"',
      },
    },
    sectionNav: {
      ariaLabel: 'BridgeWork AU five-section case study navigation',
      items: [
        {
          id: 'bw-01-challenge',
          number: '01',
          title: 'The Challenge',
          shortTitle: 'Challenge',
        },
        {
          id: 'bw-02-evidence',
          number: '02',
          title: 'From Hypothesis to Evidence',
          shortTitle: 'Evidence',
        },
        {
          id: 'bw-03-difference',
          number: '03',
          title: 'Finding Our Difference',
          shortTitle: 'Difference',
        },
        {
          id: 'bw-04-mvp',
          number: '04',
          title: 'From Research to MVP',
          shortTitle: 'MVP Scope',
        },
        {
          id: 'bw-05-learned',
          number: '05',
          title: 'What We Learned',
          shortTitle: 'Learnings',
        },
      ],
    },
    section01Challenge: {
      number: '01',
      eyebrow: '01 — THE CHALLENGE · TARGET USERS & CORE PROBLEM',
      title: 'Why Student Job Search in Australia Breaks Between Browsing and Applying',
      lead: 'Under the theme of Decent Work and Economic Growth, our five-member team studied how students and recent graduates in Australia decide whether a job is viable and worth preparing for.',
      problemCards: [
        {
          code: 'PROBLEM 01 · SUITABILITY BLIND SPOTS',
          title: 'Evaluating Fit Beyond Salary Alone',
          observation:
            'Students must weigh weekly hours, commute, contract stability, and visa/experience eligibility—details often buried in long job posts.',
          statusTag: 'ITERATION 01 DIRECTION',
        },
        {
          code: 'PROBLEM 02 · SCATTERED COMPARISON',
          title: 'Juggling Tabs, Spreadsheets, and Notes',
          observation:
            'Comparing roles across SEEK, LinkedIn, and Indeed forces students to manually copy details into separate spreadsheets or Notion pages.',
          statusTag: 'ITERATION 02 OBSERVED PATTERN',
        },
        {
          code: 'PROBLEM 03 · REPETITION VS. PRIVACY',
          title: 'Re-Entering Data Without Losing Control',
          observation:
            'Applicants re-type the same background details across forms while needing per-role tailoring and clear control over what employers see.',
          statusTag: 'ITERATION 02 OBSERVED PATTERN',
        },
      ],
      initialHypothesesHeading: 'Starting Team Hypotheses (Iteration 01)',
      initialHypothesesSubnote:
        'Framed as testable assumptions to investigate through customer discovery interviews:',
      initialHypotheses: [
        {
          code: 'H1 · MULTI-CRITERIA FIT',
          statement:
            'Students evaluate early-career roles by flexibility, stability, location, and eligibility—not pay alone.',
          epistemicStatus: 'Exploratory Direction · Guided Iteration 02',
        },
        {
          code: 'H2 · EXPERIENCE BARRIERS',
          statement:
            'Lack of local Australian experience creates friction when interpreting job requirements.',
          epistemicStatus: 'Exploratory Direction · Informed card clarity',
        },
        {
          code: 'H3 · STRUCTURED COMPARISON',
          statement:
            'Side-by-side condition breakdowns can help students shortlist suitable roles with greater confidence.',
          epistemicStatus: 'Tested in Iteration 03 · Saving & Comparing',
        },
      ],
    },
    section02Evidence: {
      number: '02',
      eyebrow: '02 — FROM HYPOTHESIS TO EVIDENCE · THREE-ITERATION RESEARCH TRAIL',
      title: 'How Three Research Iterations Reshaped the Product',
      lead: 'We progressed from broad problem exploration (Iteration 01) to workflow narrowing (Iteration 02) and structured MVP testing across 10 supplied interview records (Iteration 03).',
      iterationsHeading: 'Three-Iteration Progression',
      iterationsSubnote:
        'Each round narrowed scope and separated supported value from unresolved usability friction:',
      iterations: [
        {
          id: 'iter-01',
          number: '01',
          code: 'ITERATION 01 · EXPLORATION',
          title: 'Problem Discovery',
          themeOrFocus:
            'Job quality beyond salary, employment conditions, local experience barriers, and career guidance.',
          statusTag: 'EARLY DIRECTIONS',
          exploredTopics: [
            'Conditions beyond pay',
            'Local experience barriers',
            'Eligibility clarity',
          ],
          hypothesesOrPatternsHeading: 'Focus Areas',
          hypothesesOrPatterns: [
            'Students weigh multiple conditions beyond pay.',
            'Unclear requirements deter early-career applicants.',
          ],
          keyLearningHeading: 'Key Shift',
          keyLearning:
            'Students need upfront clarity on eligibility and conditions before deciding to apply.',
          epistemicBoundary:
            'Treated as early directional input, not universal validation.',
        },
        {
          id: 'iter-02',
          number: '02',
          code: 'ITERATION 02 · PIVOT',
          title: 'Refining Around Student Control',
          themeOrFocus:
            'Multi-site comparison habits, repeated data entry, company trust signals, and optional AI CV review.',
          statusTag: 'STRATEGIC PIVOT',
          exploredTopics: [
            'External spreadsheet comparisons',
            'Reusable editable profiles',
            'Human review over AI output',
          ],
          hypothesesOrPatternsHeading: 'Observed Patterns',
          hypothesesOrPatterns: [
            'Students compare roles across sites using personal notes, spreadsheets, or Notion.',
            'Users want reusable profile fields with per-role editing and explicit sharing controls.',
          ],
          keyLearningHeading: 'Key Shift',
          keyLearning:
            'Pivoted from a broad AI platform to a student-controlled comparison and preparation workspace.',
          epistemicBoundary:
            'Does not claim proven AI effectiveness or quantified time savings.',
        },
        {
          id: 'iter-03',
          number: '03',
          code: 'ITERATION 03 · MVP TESTING',
          title: '10 Supplied Records Across 8 Test Cards',
          themeOrFocus:
            'Five members contributed 2 interview records each (10 total) to test MVP workflows and surface usability gaps.',
          statusTag: '10 RECORDS · 8 TEST CARDS',
          exploredTopics: [
            'Save (10/10) & Compare (8/10)',
            'Priorities (6/10) & Notes (5/10)',
          ],
          hypothesesOrPatternsHeading: 'Observed Results',
          hypothesesOrPatterns: [
            'Strong positive ratings (4–5) for Saving (10/10) and Comparing (8/10).',
            '7 of 10 records noted comparison task difficulty; Priorities (6/10) and Notes (5/10) lacked visibility.',
          ],
          keyLearningHeading: 'Key Shift',
          keyLearning:
            'Froze new features to make priority controls and inline private notes self-explanatory.',
          epistemicBoundary:
            'Scores reflect positive ratings (4 or 5), not task completion rates; UI refinements await retesting.',
        },
      ],
      featuredExhibit: {
        badge: 'INTERACTIVE RESEARCH EXHIBIT · SAVING & COMPARING JOBS',
        title: 'Hypothesis → Test Card → Evidence → Learning Card → Design Decision',
        subtitle:
          'Inspect each stage of the Iteration 03 Saving & Comparing investigation across 10 supplied interview records.',
        stageSelectorAria:
          'Select research stage from Hypothesis to Design Decision',
        metricsHeading:
          'Iteration 03 Positive Ratings (10 Supplied Interview Records)',
        metricsDisclaimer:
          'METRIC DEFINITION: Positive ratings (score 4 or 5 out of 5), NOT task completion rates or proven time savings.',
        metrics: [
          {
            id: 'save',
            code: 'SAVE',
            label: 'Saving Jobs to Shortlist',
            score: '10/10',
            numericValue: 10,
            maxValue: 10,
            ratingNote: 'Positive ratings (4–5) · Shortlist value supported',
            statusTone: 'strong',
          },
          {
            id: 'compare',
            code: 'COMPARE',
            label: 'Comparing Job Conditions',
            score: '8/10',
            numericValue: 8,
            maxValue: 10,
            ratingNote: 'Positive ratings (4–5) · Side-by-side scan valued',
            statusTone: 'strong',
          },
          {
            id: 'priorities',
            code: 'PRIORITIES',
            label: 'Setting Personal Priorities',
            score: '6/10',
            numericValue: 6,
            maxValue: 10,
            ratingNote: 'Positive ratings (4–5) · Unclear card effect',
            statusTone: 'friction',
          },
          {
            id: 'notes',
            code: 'NOTES',
            label: 'Using Private Notes',
            score: '5/10',
            numericValue: 5,
            maxValue: 10,
            ratingNote: 'Positive ratings (4–5) · Entry point overlooked',
            statusTone: 'friction',
          },
        ],
        frictionCallout: {
          badge: 'USABILITY FRICTION · 7 / 10 RECORDS',
          title: 'Positive Ratings Did Not Mean Friction-Free Completion',
          detail:
            '7 of 10 records documented difficulty during comparison (2 lacked a standard stuck answer). Users liked comparing roles but struggled to spot priority controls, see their effect, or find private notes.',
        },
        stages: {
          hypothesis: {
            id: 'hypothesis',
            stepNumber: '01',
            badge: 'STAGE 01 · HYPOTHESIS',
            shortTitle: 'Hypothesis',
            epistemicTag: 'PRE-TEST TEAM BELIEF',
            headline:
              'We believed that saving and comparing 2–3 opportunities, setting priorities, and keeping private notes would help students decide which role to pursue first.',
            coreStatement:
              'After observing students juggle external spreadsheets in Iteration 02, we hypothesised that combining shortlisting, priority weighting, and private notes in one view would clarify early-career decisions.',
            supportingPoints: [
              {
                label: 'Target Behavior',
                detail: 'Shortlist 2–3 roles instead of keeping 10+ job tabs open.',
                tone: 'neutral',
              },
              {
                label: 'Decision Mechanism',
                detail: 'Weight Pay, Location, Requirements, and Flexibility alongside private notes.',
                tone: 'neutral',
              },
              {
                label: 'Key Risk to Test',
                detail: 'Whether users could discover and understand priority and note controls unassisted.',
                tone: 'friction',
              },
            ],
            methodologyBoundaryNote:
              'Epistemic Status: Pre-test hypothesis formulated before Iteration 03.',
          },
          'test-card': {
            id: 'test-card',
            stepNumber: '02',
            badge: 'STAGE 02 · TEST CARD',
            shortTitle: 'Test Card',
            epistemicTag: 'EXECUTED MVP EXPERIMENT',
            headline:
              'Participants explored saving jobs, comparing job conditions, setting personal priorities, and adding private notes.',
            coreStatement:
              'Across 8 Test Card groups in Iteration 03, 5 team members contributed 2 interview records each (10 supplied records total) evaluating the MVP comparison flow.',
            supportingPoints: [
              {
                label: 'Step A · Save & Shortlist',
                detail: 'Save candidate roles from discovery into the comparison shortlist.',
                tone: 'supported',
              },
              {
                label: 'Step B · Compare & Prioritise',
                detail: 'Compare conditions side-by-side and toggle personal priority criteria.',
                tone: 'neutral',
              },
              {
                label: 'Step C · Private Notes',
                detail: 'Record a private note on a shortlisted role to guide preparation.',
                tone: 'friction',
              },
            ],
            methodologyBoundaryNote:
              'Epistemic Status: Test procedure definition; planned thresholds are not treated as achieved outcomes.',
          },
          evidence: {
            id: 'evidence',
            stepNumber: '03',
            badge: 'STAGE 03 · USER EVIDENCE',
            shortTitle: 'Evidence',
            epistemicTag: 'OBSERVED RATINGS & FRICTION (N = 10)',
            headline:
              'SAVE 10/10 · COMPARE 8/10 · PRIORITIES 6/10 · NOTES 5/10 (Positive Ratings, Not Completion)',
            coreStatement:
              'Participants valued saving (10/10) and side-by-side comparison (8/10), but ratings fell on priorities (6/10) and notes (5/10), with 7/10 records noting comparison task friction.',
            supportingPoints: [
              {
                label: 'Validated Value (Save 10/10 · Compare 8/10)',
                detail: 'Strong 4–5 ratings for collecting roles and scanning conditions side-by-side.',
                tone: 'supported',
              },
              {
                label: 'Control Friction (Priorities 6/10 · Notes 5/10)',
                detail: 'Low visibility and unclear feedback caused nearly half of records to rate these below 4.',
                tone: 'friction',
              },
              {
                label: 'Observed Task Difficulty (7/10 Records)',
                detail: '7 records noted difficulty during comparison (2 lacked a standard stuck answer). Zero fabricated quotes.',
                tone: 'friction',
              },
            ],
            methodologyBoundaryNote:
              'Epistemic Status: Direct synthesis of 10 supplied records; does not claim proven time savings.',
          },
          'learning-card': {
            id: 'learning-card',
            stepNumber: '04',
            badge: 'STAGE 04 · LEARNING CARD',
            shortTitle: 'Learning Card',
            epistemicTag: 'TEAM SYNTHESIS',
            headline:
              'Saving and comparison received positive feedback, but students struggled to find or understand priority controls and private notes.',
            coreStatement:
              'The Learning Card separated workflow value from UI discoverability: core comparison solved a real need, but secondary controls were buried and failed to show how they changed the cards.',
            supportingPoints: [
              {
                label: 'Retained Core Anchor',
                detail: 'Keep Discover → Save → Compare as the central MVP spine.',
                tone: 'supported',
              },
              {
                label: 'Identified UI Breakdown',
                detail: 'Priority pills lacked visual row feedback; note triggers blended into metadata.',
                tone: 'friction',
              },
              {
                label: 'Scope Discipline',
                detail: 'Pause feature expansion until core comparison controls are self-explanatory.',
                tone: 'neutral',
              },
            ],
            methodologyBoundaryNote:
              'Epistemic Status: Documented Iteration 03 Learning Card conclusion.',
          },
          'design-decision': {
            id: 'design-decision',
            stepNumber: '05',
            badge: 'STAGE 05 · DESIGN DECISION',
            shortTitle: 'Design Decision',
            epistemicTag: 'UI RESPONSE (PENDING RETEST)',
            headline:
              'Improve control visibility, provide clearer feedback, and prioritise usability refinement over adding more features.',
            coreStatement:
              'We redesigned the comparison header and card layout to make save status, priority row highlighting (#FFF4DC), and inline private notes immediately visible.',
            supportingPoints: [
              {
                label: '01 · Explicit Shortlist Bar',
                detail: 'Persistent saved counter and #335D39 confirmation state.',
                tone: 'supported',
              },
              {
                label: '02 · Self-Explanatory Priority Highlight',
                detail: 'Dedicated priority bar visibly highlights matching rows in #FFF4DC.',
                tone: 'supported',
              },
              {
                label: '03 · Persistent Inline Private Note',
                detail: 'Always-visible private note slot on compared cards, queued for retesting.',
                tone: 'neutral',
              },
            ],
            methodologyBoundaryNote:
              'Epistemic Status: Design response defined from Learning Card; awaits follow-up usability retest.',
          },
        },
        uiBeforeAfterExhibit: {
          heading: 'UI Response: Resolving Priority & Note Friction',
          subnote:
            'Design response translating Iteration 03 Learning Card findings into explicit visual hierarchy (pending retest):',
          beforeLabel: 'ITERATION 03 TESTED UI · OBSERVED FRICTION',
          beforeTitle: 'Buried Priority Chips & Hidden Note Trigger',
          beforeIssues: [
            'Priority chips did not explain how selection changed the comparison cards (6/10 positive rating).',
            'Private notes required a low-contrast secondary click, missed by half of records (5/10 positive rating).',
          ],
          afterLabel: 'POST-LEARNING CARD RESPONSE · PENDING RETEST',
          afterTitle: 'Dedicated Priority Highlight Bar & Inline Note Slot',
          afterDecisions: [
            'Header priority bar explains its role and highlights matching attribute rows in warm #FFF4DC.',
            'Always-visible inline Private Note slot and #335D39 saved badge on every compared card.',
          ],
          unvalidatedRetestNote:
            'Status: Design response defined from Iteration 03 Learning Card; requires a follow-up retest to validate completion gains.',
        },
      },
      secondaryTopicsToggleLabel:
        'View 4 Additional Research Areas & Epistemic Boundaries',
      secondaryTopicsHideLabel: 'Hide Additional Research Areas',
      secondaryTopicsHeading:
        'Additional Research Areas (Iterations 02–03)',
      secondaryTopicsSubnote:
        'Supporting investigations with explicit boundaries between observed preferences and unvalidated assumptions:',
      secondaryTopics: [
        {
          id: 'topic-clarity',
          code: 'AREA A · JOB INFORMATION CLARITY',
          title: 'Upfront Pay, Arrangement & Eligibility Hierarchy',
          iterationTag: 'Iterations 01–03',
          epistemicStatus: 'Observed Preference · Applied to Cards',
          observedFinding:
            'Students were frustrated when pay, hybrid arrangement, or visa eligibility were buried in long job descriptions.',
          productResponse:
            'Two-column cards surface Role, Pay, Arrangement, Requirements, and Deadline upfront.',
          boundaryNote:
            'Reflects frontend card hierarchy, not employer standardisation.',
        },
        {
          id: 'topic-profile-reuse',
          code: 'AREA B · REUSABLE PROFILE & SHARING CONTROL',
          title: 'Editable Drafts & Field-Level Sharing Switches',
          iterationTag: 'Iterations 02–03 (My Focus)',
          epistemicStatus: 'Observed Need · Prototyped in Profile Flow',
          observedFinding:
            'Users disliked re-typing education and experience data but needed per-role edits and privacy control.',
          productResponse:
            'Designed reusable editable profile blocks with field-level sharing toggles and pre-submission preview.',
          boundaryNote:
            'No claim of quantified time-savings or external ATS integration.',
        },
        {
          id: 'topic-reviews',
          code: 'AREA C · CONTEXTUAL COMPANY REVIEWS',
          title: 'Workplace Context Alongside Listings',
          iterationTag: 'Iterations 02–03',
          epistemicStatus: 'Supporting Workflow',
          observedFinding:
            'Students wanted workplace culture and graduate support signals without leaving the comparison flow.',
          productResponse:
            'Integrated company overview and review summaries adjacent to job details.',
          boundaryNote:
            'Review supply and moderation scale remain unvalidated.',
        },
        {
          id: 'topic-ai-cv',
          code: 'AREA D · OPTIONAL AI CV ADVICE',
          title: 'Human-Reviewed Suggestions Only',
          iterationTag: 'Iterations 02–03',
          epistemicStatus: 'Experimental · Unproven Effectiveness',
          observedFinding:
            'Users accepted AI CV tips only as an optional check with full human editing control.',
          productResponse:
            'Kept AI CV feedback strictly optional and subordinate to manual preparation.',
          boundaryNote:
            'Dark navy/cyan in cv-review.css was an isolated animation, not the product brand.',
        },
      ],
    },
    section03Difference: {
      number: '03',
      eyebrow: '03 — FINDING OUR DIFFERENCE · WORKFLOW CONTINUITY & BUSINESS MODEL',
      title: 'Bridging Job Boards and Personal Spreadsheets in One Connected Flow',
      lead: 'BridgeWork AU is not another massive job marketplace. Its differentiation is workflow continuity—connecting Discover → Save → Compare → Prepare → Track so students do not have to bridge job boards and private spreadsheets manually.',
      comparisonHeading:
        'Workflow Continuity vs. Existing Job Boards & Ad-Hoc Notes',
      comparisonSubnote:
        'Grounded in how students combine platforms during early-career search (without claiming unproven superiority):',
      comparisonHeaders: {
        platform: 'Platform / Method',
        typicalRole: 'Primary Role',
        strengthObserved: 'Core Strength',
        studentFriction: 'Continuity Friction for Students',
        bridgeworkRole: 'BridgeWork AU Continuity Role',
      },
      comparisonRows: [
        {
          id: 'comp-linkedin',
          platform: 'LinkedIn',
          typicalRole: 'Networking & broad job feed',
          strengthObserved: 'Large employer network and public profiles.',
          studentWorkflowFriction:
            'Public profiles feel high-stakes when exploring; comparing 2–3 roles requires external notes.',
          bridgeworkContinuityRole:
            'Private workspace to shortlist, compare, and tailor drafts before choosing what to share.',
        },
        {
          id: 'comp-seek',
          platform: 'SEEK',
          typicalRole: 'Australian industry job board',
          strengthObserved: 'High vacancy volume and category filters.',
          studentWorkflowFriction:
            'Students still copy conditions into separate tabs or sheets to weigh trade-offs.',
          bridgeworkContinuityRole:
            'Moves saved roles directly into side-by-side condition comparison and priority highlighting.',
        },
        {
          id: 'comp-indeed',
          platform: 'Indeed',
          typicalRole: 'Aggregated vacancy search',
          strengthObserved: 'Broad part-time and entry-level aggregation.',
          studentWorkflowFriction:
            'Inconsistent listing layouts make hours, visa eligibility, and flexibility hard to compare.',
          bridgeworkContinuityRole:
            'Normalises Pay, Location, Requirements, and Flexibility at the top of cards.',
        },
        {
          id: 'comp-notes',
          platform: 'Spreadsheets & Notion',
          typicalRole: 'Private student comparison & tracking',
          strengthObserved: 'Full personal control and custom notes.',
          studentWorkflowFriction:
            'Manual copy-pasting disconnected from reusable profile data and application drafts.',
          bridgeworkContinuityRole:
            'Unifies side-by-side comparison and private notes with editable application preparation.',
        },
      ],
      bmcHeading: 'Business Model Canvas (Explicitly Labelled Hypotheses)',
      bmcSubnote:
        'Commercial pathways below are framed strictly as unvalidated business hypotheses rather than proven revenue or signed partnerships:',
      bmcSummaryPillars: [
        {
          code: 'PILLAR 01 · STAKEHOLDERS',
          title: 'Users & Ecosystem Groups',
          epistemicBadge: 'STUDENTS TESTED · B2B HYPOTHESISED',
          tone: 'observed',
          points: [
            'Primary Users: Australian students & recent graduates (10 supplied Iteration 3 records).',
            'Employers: Teams offering student-suitable or graduate roles.',
            'Institutional Partners: University career services (hypothesised partner).',
          ],
        },
        {
          code: 'PILLAR 02 · VALUE PROPOSITION',
          title: 'Discover → Save → Compare → Prepare → Track',
          epistemicBadge: 'PARTIALLY SUPPORTED IN MVP',
          tone: 'observed',
          points: [
            'Upfront condition clarity & shortlist saving (10/10 positive rating).',
            'Side-by-side comparison (8/10 positive rating) with priority/note UI refinement.',
            'Reusable, editable profile drafts with field-level sharing control.',
          ],
        },
        {
          code: 'PILLAR 03 · COMMERCIAL DIRECTIONS',
          title: 'Two Unvalidated Revenue Hypotheses',
          epistemicBadge: 'UNVALIDATED HYPOTHESES',
          tone: 'hypothesis',
          points: [
            'Hypothesis A: University-funded cohort pilots for structured career preparation.',
            'Hypothesis B: Employer-funded early-career recruitment workflows.',
            'Boundary: Neither direction has been validated via paid pilots or contracts.',
          ],
        },
      ],
      bmcExpandLabel: 'Inspect Full 9-Block Business Model Canvas',
      bmcCollapseLabel: 'Collapse 9-Block Business Model Canvas',
      bmcFullBlocks: [
        {
          id: 'bmc-segments',
          code: '01 · CUSTOMER SEGMENTS',
          title: 'Users & Potential Customers',
          validationTag: 'Students Tested · B2B Unvalidated',
          validationTone: 'observed',
          items: [
            'Australian students & recent graduates (primary researched users)',
            'University career services (hypothesised institutional customer)',
            'Early-career employers (hypothesised B2B customer)',
          ],
        },
        {
          id: 'bmc-vp',
          code: '02 · VALUE PROPOSITIONS',
          title: 'Student-Controlled Workflow',
          validationTag: 'Core Comparison Tested',
          validationTone: 'observed',
          items: [
            'Connected Discover → Save → Compare → Prepare → Track flow',
            'Side-by-side comparison across Pay, Location, Requirements & Flexibility',
            'Reusable editable profile drafts with explicit sharing controls',
          ],
        },
        {
          id: 'bmc-channels',
          code: '03 · CHANNELS',
          title: 'Reach Pathways',
          validationTag: 'Hypothesis',
          validationTone: 'hypothesis',
          items: [
            'Desktop and mobile web workspace',
            'University employability workshops & society referrals (proposed)',
          ],
        },
        {
          id: 'bmc-relationships',
          code: '04 · CUSTOMER RELATIONSHIPS',
          title: 'Trust & Privacy Control',
          validationTag: 'Observed Priority',
          validationTone: 'observed',
          items: [
            'Private-by-default comparison and notes workspace',
            'Pre-submission confirmation of shared profile fields',
          ],
        },
        {
          id: 'bmc-revenue',
          code: '05 · REVENUE STREAMS',
          title: 'Commercial Hypotheses',
          validationTag: 'Unvalidated Hypothesis',
          validationTone: 'hypothesis',
          items: [
            'Free student workspace to remove adoption friction',
            'Hypothesised university cohort pilots & employer recruitment workflows',
          ],
        },
        {
          id: 'bmc-resources',
          code: '06 · KEY RESOURCES',
          title: 'Product & Design Assets',
          validationTag: 'MVP Prototype Scope',
          validationTone: 'observed',
          items: [
            'Structured condition schema & white-20261022 comparison UI',
            'Reusable student profile & application draft architecture',
          ],
        },
        {
          id: 'bmc-activities',
          code: '07 · KEY ACTIVITIES',
          title: 'Iterative Discovery',
          validationTag: 'Executed in Course',
          validationTone: 'observed',
          items: [
            'Hypothesis testing via Test Cards & Learning Cards',
            'Usability refinement of priority, note, and sharing controls',
          ],
        },
        {
          id: 'bmc-partners',
          code: '08 · KEY PARTNERSHIPS',
          title: 'Ecosystem Allies',
          validationTag: 'Unvalidated Hypothesis',
          validationTone: 'hypothesis',
          items: [
            'University career centres & student clubs (no signed contracts)',
            'Verified graduate & part-time employers (conceptual)',
          ],
        },
        {
          id: 'bmc-costs',
          code: '09 · COST STRUCTURE',
          title: 'Operational Drivers',
          validationTag: 'Hypothesis',
          validationTone: 'hypothesis',
          items: [
            'Web hosting, structured listing curation & privacy-safe storage',
            'Optional AI CV review inference costs (experimental only)',
          ],
        },
      ],
    },
    section04Mvp: {
      number: '04',
      eyebrow: '04 — FROM RESEARCH TO MVP · ARTEFACTS, PRIORITY TIERS & UI EXHIBITS',
      title: 'Connecting Research Evidence to MVP Scope and Interface Decisions',
      lead: 'We separated research validation (Test Cards, Learning Cards) from delivery management (Task Cards, MVP Scope) and structured the white-20261022 prototype into three priority tiers.',
      artefactDistinctionHeading:
        'Four Distinct Project Artefacts',
      artefactDistinctionSubnote:
        'Preventing conflation between planned experiments, user findings, and engineering tasks:',
      artefactDistinctions: [
        {
          code: '01 · TEST CARDS',
          term: 'Test Cards (Validation Plan)',
          purpose: 'Defined the hypothesis under test, participant tasks, and evaluation questions.',
          projectExample: '8 Test Card groups in Iteration 03, including Saving & Comparing.',
        },
        {
          code: '02 · LEARNING CARDS',
          term: 'Learning Cards (Observed Insights)',
          purpose: 'Synthesised participant ratings and task friction into concrete UI priority shifts.',
          projectExample: 'Captured Save (10/10) & Compare (8/10) vs. Priorities (6/10) & Notes (5/10).',
        },
        {
          code: '03 · TASK CARDS',
          term: 'Task Cards (Team Delivery)',
          purpose: 'Tracked UI, frontend, and documentation tasks across the five team members.',
          projectExample: 'Scoped white-20261022 styling, comparison table, and profile flows.',
        },
        {
          code: '04 · MVP SCOPE',
          term: 'MVP (Prototyped Product)',
          purpose: 'The testable workspace organized into Core, Supporting, and Experimental tiers.',
          projectExample: 'Prioritised student-controlled comparison and preparation over auto-matching.',
        },
      ],
      mvpTiersHeading: 'Three-Tier MVP Priority Architecture',
      mvpTiersSubnote:
        'Each tier links directly to findings from Iterations 01–03:',
      mvpTiers: [
        {
          id: 'core',
          code: 'TIER 01 · CORE PRIORITY',
          title: 'Discover, Save & Compare, Private Workspace',
          statusBadge: 'CORE MVP LOOP',
          statusTone: 'core',
          description:
            'The primary loop for inspecting job conditions, shortlisting roles, and comparing trade-offs.',
          features: [
            {
              name: 'Upfront Condition Breakdown',
              evidenceLink: 'Iteration 01–02 need for pay, hours & visa clarity',
              scopeStatus: 'Tested in Iteration 03',
            },
            {
              name: 'Save & Side-by-Side Comparison',
              evidenceLink: 'Save 10/10 · Compare 8/10 positive ratings',
              scopeStatus: 'Tested · Priority UI refined',
            },
            {
              name: 'Private Workspace & Inline Notes',
              evidenceLink: 'Notes 5/10 rating prompted always-visible slot',
              scopeStatus: 'Redesigned for discoverability',
            },
          ],
        },
        {
          id: 'supporting',
          code: 'TIER 02 · SUPPORTING WORKFLOWS',
          title: 'Reusable Profile, Reviews & Application Tracker',
          statusBadge: 'SUPPORTING FLOWS',
          statusTone: 'supporting',
          description:
            'Connected preparation and tracking that cut repetitive typing while preserving privacy.',
          features: [
            {
              name: 'Reusable Profile & Sharing Controls (My Focus)',
              evidenceLink: 'Iteration 02 need for tailored drafts & privacy',
              scopeStatus: 'Prototyped with employer preview',
            },
            {
              name: 'Contextual Company Info & Reviews',
              evidenceLink: 'Supports trust evaluation during comparison',
              scopeStatus: 'Integrated in detail view',
            },
            {
              name: 'Application Progress Tracker',
              evidenceLink: 'Links shortlist to draft and submitted stages',
              scopeStatus: 'Prototyped in applications view',
            },
          ],
        },
        {
          id: 'experimental',
          code: 'TIER 03 · EXPERIMENTAL',
          title: 'Optional AI CV Advice & Automation Concepts',
          statusBadge: 'EXPERIMENTAL ONLY',
          statusTone: 'experimental',
          description:
            'Kept optional after Iteration 02 confirmed students require human review and control.',
          features: [
            {
              name: 'Optional AI CV Suggestions',
              evidenceLink: 'Requires human review; effectiveness unproven',
              scopeStatus: 'Isolated module (cv-review.css)',
            },
            {
              name: 'Auto-Matching / Auto-Apply',
              evidenceLink: 'Deprioritised in favour of student control',
              scopeStatus: 'Excluded from core MVP',
            },
          ],
        },
      ],
      workspaceExhibit: {
        badge: 'RECONSTRUCTED UI EXHIBIT · WHITE-20261022 SYSTEM',
        title: 'Interactive Product Architecture Exhibits',
        honestLabel:
          'TRANSPARENCY NOTE: Reconstructed from the BridgeWork AU white-20261022 token specification and verified coursework workflows.',
        tabs: [
          {
            id: 'compare-workspace',
            code: 'EXHIBIT 01 · CORE LOOP',
            label: 'Discover, Save & Compare Workspace',
            scopeTag: 'Core MVP · Iteration 03 Learning Card Response',
            summary:
              'Pairs structured two-column job cards with side-by-side comparison, explicit #FFF4DC priority highlighting, and persistent inline private notes.',
            keyUiElements: [
              'Upfront Role, Pay, Location/Hybrid arrangement, and Eligibility.',
              'Interactive Priority bar highlighting matching rows in #FFF4DC.',
              'Always-visible Private Note slot on every shortlisted card.',
            ],
          },
          {
            id: 'profile-sharing',
            code: 'EXHIBIT 02 · MY FOCUS',
            label: 'Reusable Profile & Field-Level Sharing',
            scopeTag: 'Supporting Workflow · My Individual UI/UX Focus',
            summary:
              'Enables students to reuse core profile blocks across drafts, tailor details per role, and toggle which sensitive fields employers can view.',
            keyUiElements: [
              'Reusable education, experience, and portfolio blocks with per-role editing.',
              'Field-level sharing switches (Portfolio, Visa Work Rights, Academic Transcript).',
              'Live Pre-Submission Employer Preview before sending.',
            ],
          },
          {
            id: 'application-tracker',
            code: 'EXHIBIT 03 · CONTINUITY',
            label: 'Application Preparation & Progress Tracker',
            scopeTag: 'Connected Flow · Shortlist → Draft → Submitted',
            summary:
              'Carries shortlisted roles, private comparison notes, and tailored profile drafts directly into stage-by-stage tracking.',
            keyUiElements: [
              'Connected stages: Shortlisted & Comparing → Draft Ready → Submitted.',
              'Preserves private comparison notes and tailored draft version per role.',
            ],
          },
        ],
      },
    },
    section05Learned: {
      number: '05',
      eyebrow: '05 — WHAT WE LEARNED · TAKEAWAYS, LIMITATIONS & MY ROLE',
      title: 'Key Takeaways, Research Boundaries, and Individual Attribution',
      lead: 'BridgeWork AU demonstrated how structured hypothesis testing separates genuine workflow value from interface discoverability gaps.',
      keyLearningsHeading: 'Three Core Takeaways',
      keyLearnings: [
        {
          code: 'TAKEAWAY 01 · WORKFLOW CONTINUITY',
          title: 'Connect Browsing, Comparing, and Preparing',
          detail:
            'Unifying Discovery, Saving (10/10), Side-by-Side Comparison (8/10), and Editable Preparation solved a clearer student need than adding another broad vacancy feed.',
          epistemicTag: 'ITERATIONS 02–03',
        },
        {
          code: 'TAKEAWAY 02 · APPEAL VS. USABILITY',
          title: 'Positive Ratings Do Not Guarantee Task Completion',
          detail:
            'Despite 8/10 comparison appeal, 7/10 records hit task friction and rated Priorities (6/10) and Notes (5/10) lower—proving secondary controls must visibly explain their effect.',
          epistemicTag: 'ITERATION 03 LEARNING CARD',
        },
        {
          code: 'TAKEAWAY 03 · STUDENT CONTROL',
          title: 'Efficiency Must Preserve Tailoring and Privacy',
          detail:
            'Students value reusable profile data to avoid re-typing, but require per-role editing and explicit field-level sharing previews before applying.',
          epistemicTag: 'ITERATION 02 SYNTHESIS',
        },
      ],
      unresolvedHeading: 'Research Limitations & Unvalidated Assumptions',
      unresolvedItems: [
        {
          code: 'LIMITATION 01 · PENDING RETEST',
          topic: 'Post-Iteration 03 Priority & Note UI Refinements',
          reason:
            'Our redesigned priority highlight bar and inline note slots respond to Iteration 03 friction but require a follow-up usability retest.',
        },
        {
          code: 'LIMITATION 02 · NO CLAIM OF TIME SAVINGS',
          topic: 'Positive Ratings (4–5) vs. Longitudinal Outcomes',
          reason:
            'The 10 supplied records measured feature ratings and qualitative friction, not quantified time saved or hiring placement rates.',
        },
        {
          code: 'LIMITATION 03 · UNVALIDATED B2B REVENUE',
          topic: 'University Pilots & Employer Workflows',
          reason:
            'Both commercial directions in the Business Model Canvas remain unvalidated hypotheses without signed partnerships.',
        },
      ],
      myContributionHeading:
        'My Contributions Within the Five-Person Team',
      myContributionSubnote:
        'BridgeWork AU was built collaboratively by five team members. My individual contributions were:',
      myContributions: [
        {
          code: '01 · USER INTERVIEWS & DISCOVERY',
          area: 'Interview Execution & Synthesis',
          detail:
            'Conducted user interviews (contributing 2 of the 10 Iteration 3 records) and synthesised student pain points around comparison and privacy.',
        },
        {
          code: '02 · COMPETITOR & BMC ANALYSIS',
          area: 'Competitive & Business-Model Framing',
          detail:
            'Analysed how platforms (BOSS Zhipin, SEEK, LinkedIn, spreadsheets) handle comparison and contact flows, informing our BMC and MVP scope.',
        },
        {
          code: '03 · REQUIREMENTS & CARD HIERARCHY',
          area: 'Research-to-Product Translation',
          detail:
            'Translated Learning Card insights into structured product requirements and the two-column job card hierarchy (Role, Pay, Arrangement, Deadline).',
        },
        {
          code: '04 · PROFILE & APPLICATIONS UX',
          area: 'Reusable Drafts & Sharing Controls (UI/UX)',
          detail:
            'Designed the Student Profile and Applications workflows—reusable editable profile blocks, field-level sharing switches, and pre-submission preview in white-20261022.',
        },
      ],
      teamAttributionBoundary:
        'Team Attribution: Three-iteration research planning, 8 Test Card groups, Business Model Canvas co-creation, and repository integration were shared across all five COMP7110 team members.',
      footerNextProjectLabel: 'Explore Next Case Study',
    },
  },

  'zh-CN': {
    topbar: {
      backToPortfolio: '返回作品集',
      skipIntro: '跳过演示',
      replayIntro: '重播自动演示',
      designVersionBadge: 'WHITE-20261022 视觉系统',
      teamContextBadge: '五人高校课程团队项目',
    },
    entrance: {
      scene01Label: '步骤 01 · 职位发现',
      scene01Caption: '在同一工作台汇集多平台早期职业机会。',
      scene02Label: '步骤 02 · 搜索与筛选',
      scene02Caption: '检索 "UX Designer" 并筛选 Brisbane 地区岗位。',
      scene03Label: '步骤 03 · 收藏与对比',
      scene03Caption: '收藏 2 个契合岗位并开启同屏条件对比。',
      scene04Label: '步骤 04 · 选定与展开',
      scene04Caption: '选定优先岗位并无缝展开 BridgeWork AU 案例研究。',
      criteriaHeaderLabel: '核心对比维度',
      criteriaPills: ['PAY · 薪资', 'LOCATION · 地点', 'REQUIREMENTS · 要求', 'FLEXIBILITY · 灵活度'],
      demoDataDisclaimer:
        '注：演示岗位卡片用于展示 UX 工作流概念，并非真实招聘邀约或自动匹配算法结果。',
      shortlistBadge: '已入候选池',
      selectedBadge: '优先投递目标',
      cards: [
        {
          id: 'bw-card-01',
          code: '岗位 01 · 布里斯班',
          role: 'Junior Product & UX Designer',
          companyContext: '教育科技工作室 · 早期职业项目',
          location: 'Brisbane CBD · 混合办公 (每周 2 天远程)',
          pay: '$38 / 小时 · Casual / 兼职',
          arrangement: '每周 16–24 小时 · 学期课表灵活协调',
          requirements: '作品集 (2 个案例) · 支持学生签证工作权限',
          flexibility: '高 — 可与学校课程时间表错峰排班',
          isShortlisted: true,
          isSelectedWinner: true,
          noiseOffset: { x: -240, y: -110, rotate: -5.5 },
          priorityMatches: [
            'PAY: 透明标注时薪 ($38/hr)',
            'LOCATION: 布里斯班混合办公',
            'REQUIREMENTS: 明确支持学生签证',
            'FLEXIBILITY: 每周 16–24 小时灵活排班',
          ],
          privateNotePreview:
            '私密笔记：优先投递！突出 UQ 交互设计课程研究经历，并调用可编辑个人资料草稿 B。',
        },
        {
          id: 'bw-card-02',
          code: '岗位 02 · 墨尔本',
          role: 'Graduate UI/UX Designer',
          companyContext: '零售数字平台 · 应届生项目',
          location: 'Melbourne Docklands · 每周 5 天现场办公',
          pay: '$68,000 / 年 + Super · 全职',
          arrangement: '每周 38 小时 · 固定坐班时间',
          requirements: '需已取得学位 · 需全职无限制工作权限',
          flexibility: '低 — 需跨城搬迁且与当前学期冲突',
          isShortlisted: true,
          isSelectedWinner: false,
          noiseOffset: { x: 250, y: -95, rotate: 4.8 },
          priorityMatches: [
            'PAY: 明确标注年薪范围',
            'REQUIREMENTS: 需全职工作权限',
          ],
          privateNotePreview:
            '私密笔记：保留至毕业季备选；当前要求全职现场坐班，与本学期课表冲突。',
        },
        {
          id: 'bw-card-03',
          code: '岗位 04 · 悉尼',
          role: 'Digital Experience Analyst',
          companyContext: '企业咨询机构',
          location: 'Sydney CBD · 现场办公',
          pay: '薪资面议 (未公开具体范围)',
          arrangement: '全职 · 需立即入职',
          requirements: '2 年以上商业经验 · 仅限 PR / 公民',
          flexibility: '未说明',
          isShortlisted: false,
          noiseOffset: { x: -320, y: 125, rotate: 6.2 },
        },
        {
          id: 'bw-card-04',
          code: '岗位 03 · 布里斯班',
          role: 'Student UX Research Assistant',
          companyContext: '公共服务创新实验室 · 高校合作项目',
          location: 'South Brisbane · 混合办公 (每周 1 天现场)',
          pay: '$35 / 小时 · Casual',
          arrangement: '每周 12 小时 · 项目制',
          requirements: '定性访谈归纳能力 · 在读学生可申请',
          flexibility: '高 — 考试周可灵活调整工时',
          isShortlisted: true,
          isSelectedWinner: false,
          noiseOffset: { x: 290, y: 130, rotate: -6.2 },
          priorityMatches: [
            'PAY: 透明标注时薪 ($35/hr)',
            'LOCATION: 南布里斯班混合办公',
            'REQUIREMENTS: 在读学生可申请',
            'FLEXIBILITY: 考试周灵活排班',
          ],
          privateNotePreview:
            '私密笔记：契合定性用户研究方向；可与岗位 01 对比每周工时上限（12h vs 24h）。',
        },
        {
          id: 'bw-card-05',
          code: '岗位 05 · 澳洲远程',
          role: 'Frontend & Design Systems Intern',
          companyContext: 'SaaS 产品团队',
          location: '远程办公 (AEST 时区)',
          pay: '$34 / 小时 · 固定期限实习',
          arrangement: '每周 20 小时 · 异步协作为主',
          requirements: 'Figma 令牌 + React/CSS · 需提供代码参考',
          flexibility: '高 — 异步工时安排',
          isShortlisted: false,
          noiseOffset: { x: -120, y: 170, rotate: -3.4 },
        },
        {
          id: 'bw-card-06',
          code: '岗位 06 · 黄金海岸',
          role: 'Junior Visual Designer',
          companyContext: '数字创意代理商',
          location: 'Gold Coast · 现场办公',
          pay: '薪资未标注 · 合同制',
          arrangement: '每周 4 天现场坐班',
          requirements: '3 年以上乙方经验 · 需自备交通工具',
          flexibility: '低 — 单程通勤约 75 分钟',
          isShortlisted: false,
          noiseOffset: { x: 145, y: -165, rotate: 3.9 },
        },
      ],
    },
    hero: {
      eyebrow: '01 · 基于实证研究与假设验证的产品 UX 案例研究',
      title: 'BridgeWork AU',
      tagline: 'Clear choices. Your control.',
      positioningLead:
        '五人高校课程团队项目——面向澳大利亚在读学生与应届毕业生，打造集职位发现、同屏对比、资料准备与投递追踪于一体的学生自主工作台。',
      workflowLabel: '串联式学生自主工作流',
      workflowSteps: [
        {
          code: '01',
          name: 'Discover · 发现',
          detail: '首屏透明呈现薪资、工时与签证要求',
        },
        {
          code: '02',
          name: 'Save · 收藏',
          detail: '私密候选池（获 10/10 正向评分）',
          isHighlighted: true,
        },
        {
          code: '03',
          name: 'Compare · 对比',
          detail: '同屏权衡条件（获 8/10 正向评分）',
          isHighlighted: true,
        },
        {
          code: '04',
          name: 'Prepare · 准备',
          detail: '可编辑资料复用与字段级分享控制',
        },
        {
          code: '05',
          name: 'Track · 追踪',
          detail: '统一管理草稿、已投递与时间节点',
        },
      ],
      metaGrid: [
        {
          label: '项目性质',
          value: '五人高校课程团队 (COMP7110)',
        },
        {
          label: '目标用户',
          value: '澳大利亚在读学生与应届毕业生',
        },
        {
          label: '个人贡献',
          value: '访谈归纳、竞品与 BMC 分析、个人资料与投递流 UI/UX',
        },
        {
          label: '视觉规范',
          value: 'white-20261022 (#ECEBE7 / #FFFFFF / #335D39)',
        },
      ],
      honestFramingBanner: {
        badge: '研究证据边界声明',
        text: '严格区分三轮迭代中的初始假设、测试卡（Test Cards）、10 份受访记录实测反馈、学习卡（Learning Cards）与尚未验证的商业及复测假设。',
      },
      heroSpecimen: {
        headerCode: '候选对比样本 · WHITE-20261022',
        headerTitle: '并排岗位条件对比与准备控制',
        headerStatus: '3 项候选岗位',
        activeCriteriaLabel: '当前激活优先级',
        comparisonNoteLabel: '学生私密对比笔记',
        comparisonNoteText:
          '优先准备布里斯班混合办公岗位：时薪透明 ($38/hr)、支持学生签证，且每周 16–24 小时排班与课表兼容。',
        sharingControlLabel: '资料复用与分享边界',
        sharingControlValue:
          '可编辑草稿就绪 · 成绩单设为“投递前预览确认后分享”',
      },
    },
    sectionNav: {
      ariaLabel: 'BridgeWork AU 五大案例章节导航',
      items: [
        {
          id: 'bw-01-challenge',
          number: '01',
          title: '01 — 问题与初始假设',
          shortTitle: '01 · 问题与假设',
        },
        {
          id: 'bw-02-evidence',
          number: '02',
          title: '02 — 从假设到实证',
          shortTitle: '02 · 假设与实证',
        },
        {
          id: 'bw-03-difference',
          number: '03',
          title: '03 — 差异化与商业模式',
          shortTitle: '03 · 差异与商业',
        },
        {
          id: 'bw-04-mvp',
          number: '04',
          title: '04 — 从研究到 MVP',
          shortTitle: '04 · MVP 落地',
        },
        {
          id: 'bw-05-learned',
          number: '05',
          title: '05 — 复盘与个人贡献',
          shortTitle: '05 · 复盘与贡献',
        },
      ],
    },
    section01Challenge: {
      number: '01',
      eyebrow: '01 — THE CHALLENGE · 目标用户与核心痛点',
      title: '为什么澳洲学生的求职断层发生在“浏览职位”与“准备投递”之间',
      lead: '围绕“体面工作与经济增长”主题，五人团队深入调研了澳大利亚在读学生与应届毕业生如何判断早期岗位是否真正适合自己并值得优先准备。',
      problemCards: [
        {
          code: '痛点 01 · 适配条件不透明',
          title: '评估岗位远不止看薪资数字',
          observation:
            '学生必须同时核对每周工时、混合办公/通勤、合同稳定性与签证要求，而这些信息常被藏在冗长正文中。',
          statusTag: '第一轮探索方向',
        },
        {
          code: '痛点 02 · 跨平台对比割裂',
          title: '在网页标签、备忘录与表格间手工搬运',
          observation:
            '跨 SEEK、LinkedIn、Indeed 筛选时，学生不得不把岗位条件手动复制到电子表格或 Notion 中做横向权衡。',
          statusTag: '第二轮观察模式',
        },
        {
          code: '痛点 03 · 重复填写与隐私顾虑',
          title: '减少重复输入，但保留微调与分享控制',
          observation:
            '学生厌倦反复输入相同背景信息，但每次投递仍需按岗位微调，并希望明确控制雇主可见的隐私字段。',
          statusTag: '第二轮观察模式',
        },
      ],
      initialHypothesesHeading: '团队初始研究假设（Iteration 01）',
      initialHypothesesSubnote:
        '作为后续访谈与原型测试的待检验起点，而非预设结论：',
      initialHypotheses: [
        {
          code: '假设 H1 · 多维条件权衡',
          statement:
            '学生通过排班灵活度、稳定性、地点与资格要求等多维条件评估岗位，而非仅看薪资。',
          epistemicStatus: '早期探索方向 · 引导后续对比设计',
        },
        {
          code: '假设 H2 · 本地经验门槛',
          statement:
            '缺乏澳洲本地相关经验会阻碍学生理解岗位要求并做出投递决策。',
          epistemicStatus: '早期探索方向 · 转化为卡片要求层级',
        },
        {
          code: '假设 H3 · 同屏对比辅助决策',
          statement:
            '清晰的岗位条件拆解与同屏对比工具，能帮助学生更有把握地锁定优先投递目标。',
          epistemicStatus: '进入第三轮实测 · 收藏与对比学习卡',
        },
      ],
    },
    section02Evidence: {
      number: '02',
      eyebrow: '02 — FROM HYPOTHESIS TO EVIDENCE · 三轮研究演进与证据链',
      title: '三轮迭代如何从宽泛假设收敛为实证设计决策',
      lead: '研究历经第一轮问题探索、第二轮价值主张转向，以及第三轮基于 10 份受访记录与 8 组测试卡的 MVP 实测。',
      iterationsHeading: '三轮用户研究演进（Iteration 01 → 03）',
      iterationsSubnote:
        '明确区分每一轮验证的核心价值与暴露出的交互卡点：',
      iterations: [
        {
          id: 'iter-01',
          number: '01',
          code: 'ITERATION 01 · 问题探索',
          title: '多维求职条件探查',
          themeOrFocus:
            '探索薪资以外的工作质量、雇佣条件、本地经验门槛与职业信息渠道。',
          statusTag: '早期研究方向',
          exploredTopics: ['多维雇佣条件', '本地经验门槛', '申请资格透明度'],
          hypothesesOrPatternsHeading: '核心发现',
          hypothesesOrPatterns: [
            '学生需综合工时、地点与资格条件评估岗位。',
            '条件与门槛描述不清会直接阻碍投递。',
          ],
          keyLearningHeading: '方向收敛',
          keyLearning: '求职不仅是浏览列表，首屏必须透明拆解岗位条件与资格。',
          epistemicBoundary: '作为指导后续访谈的早期方向，不作普适定论。',
        },
        {
          id: 'iter-02',
          number: '02',
          code: 'ITERATION 02 · 价值主张转向',
          title: '聚焦学生自主控制感',
          themeOrFocus:
            '调查跨网站对比习惯、重复填写申请资料、企业评价与可选 AI 简历建议。',
          statusTag: '关键方向转型',
          exploredTopics: ['自建表格对比', '可编辑资料复用', 'AI 建议需人工复核'],
          hypothesesOrPatternsHeading: '观察模式',
          hypothesesOrPatterns: [
            '学生常借助备忘录、表格或 Notion 跨平台横向对比岗位。',
            '用户需要复用基础资料，但坚持单次微调与字段级隐私控制。',
          ],
          keyLearningHeading: '方向收敛',
          keyLearning: '放弃宽泛 AI 求职平台，转向学生自主掌控的对比与准备工作台。',
          epistemicBoundary: '未宣称证实 AI 提效幅度或投递时间节省比例。',
        },
        {
          id: 'iter-03',
          number: '03',
          code: 'ITERATION 03 · MVP 实测',
          title: '10 份受访记录与 8 组测试卡验证',
          themeOrFocus:
            '5 名成员各提供 2 份记录（共 10 份），检验核心 MVP 流程并定位可用性卡点。',
          statusTag: '10 份记录 · 8 组测试卡',
          exploredTopics: ['收藏 10/10 · 对比 8/10', '优先级 6/10 · 笔记 5/10'],
          hypothesesOrPatternsHeading: '实测结果',
          hypothesesOrPatterns: [
            '收藏岗位 (10/10) 与对比条件 (8/10) 获高比例正向评分（4–5 分）。',
            '7/10 份记录出现对比任务卡点；优先级 (6/10) 与私密笔记 (5/10) 可发现性不足。',
          ],
          keyLearningHeading: '方向收敛',
          keyLearning: '暂停扩充新功能，优先显式化优先级高亮栏与卡片内嵌私密笔记。',
          epistemicBoundary: '分数代表正向评分（4–5 分）而非完成率；改版待后续复测。',
        },
      ],
      featuredExhibit: {
        badge: '核心交互研究展台 · 收藏与对比岗位 (SAVING & COMPARING)',
        title: 'Hypothesis → Test Card → Evidence → Learning Card → Design Decision',
        subtitle:
          '点击下方阶段节点，查看 Iteration 03 基于 10 份受访记录的完整证据链与界面决策。',
        stageSelectorAria: '切换从研究假设到设计决策的五个阶段',
        metricsHeading: 'Iteration 03 学习卡正向评分（10 份受访记录）',
        metricsDisclaimer:
          '口径说明：以下数值为正向评分占比（4 或 5 分），并非任务完成率或已证实的时间节省。',
        metrics: [
          {
            id: 'save',
            code: 'SAVE · 收藏',
            label: '保存岗位至候选池',
            score: '10/10',
            numericValue: 10,
            maxValue: 10,
            ratingNote: '正向评分 (4–5分) · 候选收拢价值获认可',
            statusTone: 'strong',
          },
          {
            id: 'compare',
            code: 'COMPARE · 对比',
            label: '同屏横向对比条件',
            score: '8/10',
            numericValue: 8,
            maxValue: 10,
            ratingNote: '正向评分 (4–5分) · 并排扫读体验受认可',
            statusTone: 'strong',
          },
          {
            id: 'priorities',
            code: 'PRIORITIES · 优先级',
            label: '设置个人优先级',
            score: '6/10',
            numericValue: 6,
            maxValue: 10,
            ratingNote: '正向评分 (4–5分) · 触发效果不够直观',
            statusTone: 'friction',
          },
          {
            id: 'notes',
            code: 'NOTES · 笔记',
            label: '记录个人私密笔记',
            score: '5/10',
            numericValue: 5,
            maxValue: 10,
            ratingNote: '正向评分 (4–5分) · 入口隐蔽易被忽略',
            statusTone: 'friction',
          },
        ],
        frictionCallout: {
          badge: '可用性卡点 · 7 / 10 份记录',
          title: '高正向评分不等于零卡点的任务完成度',
          detail:
            '10 份记录中有 7 份在对比任务中报告了操作困难（2 份缺少标准卡点回答）：用户认可并排对比，但难以注意到优先级控件、不清楚其高亮作用，或找不到私密笔记入口。',
        },
        stages: {
          hypothesis: {
            id: 'hypothesis',
            stepNumber: '01',
            badge: '阶段 01 · HYPOTHESIS',
            shortTitle: '01 · 研究假设',
            epistemicTag: '测试前团队假设',
            headline:
              '我们认为：收藏并对比 2–3 个工作机会、设置优先级并记录私密笔记，能帮助学生决定优先准备哪一个岗位。',
            coreStatement:
              '基于 Iteration 02 对学生自建表格对比的观察，团队假设将候选收藏、优先级标记与私密笔记整合进同一对比视图，能简化早期投递决策。',
            supportingPoints: [
              {
                label: '目标行为',
                detail: '收敛 2–3 个候选岗位并排对比，替代十几个分散标签页。',
                tone: 'neutral',
              },
              {
                label: '权衡机制',
                detail: '结合薪资、地点、要求、灵活度优先级与私密笔记做取舍。',
                tone: 'neutral',
              },
              {
                label: '待测风险',
                detail: '用户能否在无提示下发现并理解优先级与私密笔记控件。',
                tone: 'friction',
              },
            ],
            methodologyBoundaryNote:
              '证据属性：Iteration 03 测试前制定的待验证假设。',
          },
          'test-card': {
            id: 'test-card',
            stepNumber: '02',
            badge: '阶段 02 · TEST CARD',
            shortTitle: '02 · 测试卡',
            epistemicTag: 'MVP 实测方案',
            headline:
              '受访者在 MVP 原型中实际体验收藏岗位、对比条件、设置个人优先级与添加私密笔记。',
            coreStatement:
              'Iteration 03 共设 8 组测试卡，5 名成员各提供 2 份受访记录（共 10 份记录），走查从收藏到同屏对比的完整流程。',
            supportingPoints: [
              {
                label: '任务 A · 收藏候选',
                detail: '将意向岗位从列表保存至对比候选池。',
                tone: 'supported',
              },
              {
                label: '任务 B · 对比与设置优先级',
                detail: '横向对照岗位条件并切换个人优先级维度。',
                tone: 'neutral',
              },
              {
                label: '任务 C · 私密笔记',
                detail: '在候选卡片上记录仅自己可见的求职备忘。',
                tone: 'friction',
              },
            ],
            methodologyBoundaryNote:
              '证据属性：测试任务定义；预设达标线不视为既定结果。',
          },
          evidence: {
            id: 'evidence',
            stepNumber: '03',
            badge: '阶段 03 · EVIDENCE',
            shortTitle: '03 · 实测证据',
            epistemicTag: '10 份受访记录实测结果',
            headline:
              'SAVE 10/10 · COMPARE 8/10 · PRIORITIES 6/10 · NOTES 5/10（正向评分占比，非完成率）',
            coreStatement:
              '收藏（10/10）与对比条件（8/10）获高度正向评价，但优先级（6/10）与私密笔记（5/10）评分明显偏低，且 7/10 份记录出现对比操作卡点。',
            supportingPoints: [
              {
                label: '核心价值获认可（收藏 10/10 · 对比 8/10）',
                detail: '受访者对收拢候选并同屏扫读核心条件普遍给出 4–5 分。',
                tone: 'supported',
              },
              {
                label: '次级控件分值走低（优先级 6/10 · 笔记 5/10）',
                detail: '入口隐蔽且缺乏状态反馈，导致近半数记录未给出高分。',
                tone: 'friction',
              },
              {
                label: '7/10 份记录出现任务卡点（零虚构引语）',
                detail: '7 份记录报告了对比过程中的困惑（2 份缺标准回答），严格依据真实记录归纳。',
                tone: 'friction',
              },
            ],
            methodologyBoundaryNote:
              '证据属性：10 份受访记录直接汇总；不宣称证实时间节省。',
          },
          'learning-card': {
            id: 'learning-card',
            stepNumber: '04',
            badge: '阶段 04 · LEARNING CARD',
            shortTitle: '04 · 学习卡',
            epistemicTag: '团队归因结论',
            headline:
              '收藏与对比获得了正向反馈，但学生依然难以找到或理解优先级控件与私密笔记。',
            coreStatement:
              '学习卡区分了“需求价值”与“界面可用性”：同屏对比切中了真实痛点，但优先级与私密笔记视觉层级过弱且缺乏自解释反馈。',
            supportingPoints: [
              {
                label: '保留核心主轴',
                detail: '坚定以“发现 → 收藏 → 同屏对比”作为 MVP 核心闭环。',
                tone: 'supported',
              },
              {
                label: '定位交互缺陷',
                detail: '优先级缺少行高亮说明，私密笔记触发器淹没在次要信息中。',
                tone: 'friction',
              },
              {
                label: '克制功能扩张',
                detail: '在核心对比控件实现自解释前，不盲目叠加复杂新功能。',
                tone: 'neutral',
              },
            ],
            methodologyBoundaryNote:
              '证据属性：Iteration 03 学习卡正式复盘结论。',
          },
          'design-decision': {
            id: 'design-decision',
            stepNumber: '05',
            badge: '阶段 05 · DESIGN DECISION',
            shortTitle: '05 · 设计决策',
            epistemicTag: '界面响应方案（待复测）',
            headline:
              '提升控件可见性、强化状态反馈，并将核心可用性打磨置于新增功能之上。',
            coreStatement:
              '重构对比工作台头部与卡片底部：显式化收藏计数、用 #FFF4DC 暖色高亮直观说明优先级作用，并将私密笔记改为卡片常驻槽位。',
            supportingPoints: [
              {
                label: '01 · 显式候选状态栏',
                detail: '突出展示已收藏数量与 #335D39 确认态。',
                tone: 'supported',
              },
              {
                label: '02 · 自解释优先级高亮',
                detail: '独立优先级栏直接以 #FFF4DC 高亮对应条件行。',
                tone: 'supported',
              },
              {
                label: '03 · 卡片内嵌常驻私密笔记',
                detail: '每张对比卡片底部常驻私密笔记框，列入下轮复测。',
                tone: 'neutral',
              },
            ],
            methodologyBoundaryNote:
              '证据属性：基于学习卡制定的设计响应，待新一轮可用性复测验证。',
          },
        },
        uiBeforeAfterExhibit: {
          heading: '界面响应对照：修复优先级与私密笔记可发现性',
          subnote:
            '针对 Iteration 03 学习卡结论构建的层级改版示意（待后续复测验证）：',
          beforeLabel: 'ITERATION 03 受测状态 · 暴露卡点',
          beforeTitle: '优先级作用不明 & 笔记入口隐蔽',
          beforeIssues: [
            '优先级标签未说明点击后如何改变对比卡片（正向评分 6/10）。',
            '私密笔记需点击低对比度次级按钮，半数记录忽略（正向评分 5/10）。',
          ],
          afterLabel: '学习卡驱动改版 · 待复测方案',
          afterTitle: '顶置优先级高亮栏 & 卡片常驻私密笔记',
          afterDecisions: [
            '顶部独立优先级栏明确说明作用，并以 #FFF4DC 暖色高亮匹配条件行。',
            '每张对比卡片底部常驻私密笔记槽位与 #335D39 收藏状态标识。',
          ],
          unvalidatedRetestNote:
            '状态说明：基于 Iteration 03 学习卡制定的界面响应；尚待新一轮复测验证完成率提升。',
        },
      },
      secondaryTopicsToggleLabel:
        '查看其余 4 项研究议题与证据边界',
      secondaryTopicsHideLabel: '收起其余研究议题',
      secondaryTopicsHeading: '其余核心研究议题（Iterations 02–03）',
      secondaryTopicsSubnote:
        '围绕信息清晰度、资料复用、企业评价与 AI 辅助的同步探索及证据边界：',
      secondaryTopics: [
        {
          id: 'topic-clarity',
          code: '议题 A · 岗位信息清晰度',
          title: '首屏突出薪资、工作方式与申请要求',
          iterationTag: 'Iterations 01–03',
          epistemicStatus: '观察偏好 · 已落实于卡片层级',
          observedFinding:
            '学生反感薪资、混合办公或签证门槛被藏在冗长正文中。',
          productResponse:
            '双栏卡片顶层直接呈现职位、薪资、办公方式、要求与截止日。',
          boundaryNote:
            '体现前端信息层级优化，不代表外部雇主会统一发帖标准。',
        },
        {
          id: 'topic-profile-reuse',
          code: '议题 B · 资料复用与分享控制',
          title: '可编辑草稿与字段级授权开关',
          iterationTag: 'Iterations 02–03（个人重点负责）',
          epistemicStatus: '观察诉求 · 已构建资料与投递流原型',
          observedFinding:
            '学生希望减少重复填表，但要求按岗位微调并掌控雇主可见字段。',
          productResponse:
            '设计可复用且可单次编辑的资料模块、字段级开关与投递前预览。',
          boundaryNote:
            '不宣称证实具体时间节省比例或外部企业 ATS 接入。',
        },
        {
          id: 'topic-reviews',
          code: '议题 C · 上下文企业评价',
          title: '在岗位旁提供企业背景与评价参考',
          iterationTag: 'Iterations 02–03',
          epistemicStatus: '支撑工作流',
          observedFinding:
            '学生希望在对比条件时同步查看企业口碑，减少跳出搜索。',
          productResponse:
            '将企业简介与评价摘要作为支撑模块整合进详情视图。',
          boundaryNote:
            '真实评价冷启动与审核机制仍属未验证运营假设。',
        },
        {
          id: 'topic-ai-cv',
          code: '议题 D · 可选 AI 简历建议',
          title: '坚持人工复核优先的可选辅助',
          iterationTag: 'Iterations 02–03',
          epistemicStatus: '实验性功能 · 未宣称提效实证',
          observedFinding:
            '用户仅接受 AI 作为查漏补缺参考，拒绝黑盒自动投递。',
          productResponse:
            '定位为可选实验模块，从属于学生自主编辑流程。',
          boundaryNote:
            'cv-review.css 中的深蓝/亮青色仅为局部扫描动效，非产品主视觉。',
        },
      ],
    },
    section03Difference: {
      number: '03',
      eyebrow: '03 — FINDING OUR DIFFERENCE · 工作流差异化与商业模式',
      title: '连接招聘网站与私人表格：打通 Discover → Save → Compare → Prepare → Track',
      lead: 'BridgeWork AU 不是另一个大众招聘卖场，而是填补招聘平台（LinkedIn、SEEK、Indeed）与学生私人表格之间的连续性断层。',
      comparisonHeading: '与现有招聘平台及私人表格的连续性对比',
      comparisonSubnote:
        '基于学生多工具并用的真实习惯进行定位对照（不作无根据的优劣断言）：',
      comparisonHeaders: {
        platform: '平台 / 方式',
        typicalRole: '典型定位',
        strengthObserved: '成熟优势',
        studentFriction: '学生跨工具求职断层',
        bridgeworkRole: 'BridgeWork AU 连续性价值',
      },
      comparisonRows: [
        {
          id: 'comp-linkedin',
          platform: 'LinkedIn',
          typicalRole: '职业社交与行业职位流',
          strengthObserved: '雇主网络庞大，公开档案曝光度高。',
          studentWorkflowFriction:
            '公开档案对探索多方向的学生有顾虑；横向对比仍需外部笔记。',
          bridgeworkContinuityRole:
            '提供私密工作台，先对比与微调草稿，再自主选择公开字段。',
        },
        {
          id: 'comp-seek',
          platform: 'SEEK',
          typicalRole: '澳洲主流综合招聘板',
          strengthObserved: '职位数量庞大，行业与地点筛选成熟。',
          studentWorkflowFriction:
            '筛出岗位后仍需手动复制条件到表格或备忘录中权衡。',
          bridgeworkContinuityRole:
            '收藏后直接进入同屏条件对比与优先级高亮视图。',
        },
        {
          id: 'comp-indeed',
          platform: 'Indeed',
          typicalRole: '聚合型职位搜索',
          strengthObserved: '广泛覆盖兼职、实习与初级岗位。',
          studentWorkflowFriction:
            '各帖格式不一，工时灵活度与签证要求难以并排对照。',
          bridgeworkContinuityRole:
            '在卡片顶层统一结构化呈现薪资、地点、要求与灵活度。',
        },
        {
          id: 'comp-notes',
          platform: '个人表格 / Notion',
          typicalRole: '自建对比表与投递备忘',
          strengthObserved: '完全私密，可自由记录个人权衡。',
          studentWorkflowFriction:
            '纯手工搬运岗位信息，且与可复用资料及投递草稿脱节。',
          bridgeworkContinuityRole:
            '将同屏对比、私密笔记与可编辑投递草稿连接在同一空间。',
        },
      ],
      bmcHeading: '商业模式画布（明确标注未验证商业假设）',
      bmcSubnote:
        '以下商业化方向严格界定为课程阶段的待验证商业假设，而非已签约合作或证实收入：',
      bmcSummaryPillars: [
        {
          code: '模块 01 · 核心群体',
          title: '用户与生态相关方',
          epistemicBadge: '学生端已实测 · 机构端为假设',
          tone: 'observed',
          points: [
            '核心用户：澳洲在读学生与应届毕业生（10 份 Iteration 3 受访记录）。',
            '招聘方：提供早期或适合学生岗位的雇主。',
            '潜在合作方：高校职业发展中心（假设机构合作对象）。',
          ],
        },
        {
          code: '模块 02 · 价值主张',
          title: 'Discover → Save → Compare → Prepare → Track',
          epistemicBadge: '核心收藏与对比获正向反馈',
          tone: 'observed',
          points: [
            '透明条件拆解与候选收藏（10/10 正向评分）。',
            '同屏条件对比（8/10 正向评分）及优先级/笔记易用性打磨。',
            '可复用、可编辑申请草稿与投递前字段级分享控制。',
          ],
        },
        {
          code: '模块 03 · 商业化方向',
          title: '两条未验证商业假设',
          epistemicBadge: '未验证商业假设',
          tone: 'hypothesis',
          points: [
            '假设 A：高校资助的学生求职准备试点项目（University-funded pilots）。',
            '假设 B：雇主付费的早期人才招聘工作流（Employer-funded workflows）。',
            '边界：两条方向均未经过付费试点或合同验证。',
          ],
        },
      ],
      bmcExpandLabel: '展开完整 9 格商业模式画布 (9-Block BMC)',
      bmcCollapseLabel: '收起 9 格商业模式画布',
      bmcFullBlocks: [
        {
          id: 'bmc-segments',
          code: '01 · 客户细分',
          title: '核心用户与潜在付费方',
          validationTag: '学生端已访谈 · B2B 待验证',
          validationTone: 'observed',
          items: [
            '澳洲高校在读学生与应届毕业生（核心研究用户）',
            '高校就业指导中心（假设机构客户）',
            '招聘早期人才的雇主（假设企业客户）',
          ],
        },
        {
          id: 'bmc-vp',
          code: '02 · 价值主张',
          title: '学生自主掌控的连续求职流',
          validationTag: '收藏与对比经实测',
          validationTone: 'observed',
          items: [
            'Discover → Save → Compare → Prepare → Track 连续体验',
            '薪资、地点、要求与灵活度同屏对比与私密笔记',
            '可复用、可微调的申请草稿与字段分享开关',
          ],
        },
        {
          id: 'bmc-channels',
          code: '03 · 渠道通路',
          title: '触达路径',
          validationTag: '商业假设',
          validationTone: 'hypothesis',
          items: [
            '桌面与移动端 Web 工作台',
            '高校就业工作坊与社团推荐（设想）',
          ],
        },
        {
          id: 'bmc-relationships',
          code: '04 · 客户关系',
          title: '隐私安全与控制感',
          validationTag: '访谈观察诉求',
          validationTone: 'observed',
          items: [
            '默认私密的对比与笔记空间',
            '投递前显式确认分享字段',
          ],
        },
        {
          id: 'bmc-revenue',
          code: '05 · 收入来源',
          title: '潜在商业路径',
          validationTag: '未验证商业假设',
          validationTone: 'hypothesis',
          items: [
            '学生端核心功能免费，降低使用门槛',
            '假设：高校试点资助与雇主结构化招聘流付费',
          ],
        },
        {
          id: 'bmc-resources',
          code: '06 · 核心资源',
          title: '产品与设计资产',
          validationTag: 'MVP 原型范畴',
          validationTone: 'observed',
          items: [
            '结构化岗位条件模型与 white-20261022 界面体系',
            '可复用资料库与投递前预览架构',
          ],
        },
        {
          id: 'bmc-activities',
          code: '07 · 关键业务',
          title: '迭代研究与打磨',
          validationTag: '课程内已执行',
          validationTone: 'observed',
          items: [
            '基于 Test Cards 与 Learning Cards 的假设检验',
            '优先级、私密笔记与分享流程的可用性优化',
          ],
        },
        {
          id: 'bmc-partners',
          code: '08 · 重要合作',
          title: '潜在生态伙伴',
          validationTag: '未验证商业假设',
          validationTone: 'hypothesis',
          items: [
            '高校职业中心与学生社团（未签约）',
            '透明标注条件的初级人才雇主（概念阶段）',
          ],
        },
        {
          id: 'bmc-costs',
          code: '09 · 成本结构',
          title: '运营成本因素',
          validationTag: '商业假设',
          validationTone: 'hypothesis',
          items: [
            'Web 托管、岗位结构化维护与隐私存储',
            '可选 AI 简历建议推理成本（保持实验性）',
          ],
        },
      ],
    },
    section04Mvp: {
      number: '04',
      eyebrow: '04 — FROM RESEARCH TO MVP · 制品区分、优先级分层与界面展台',
      title: '连接研究发现与产品决策：清晰划分验证卡片与 MVP 范围',
      lead: '团队严格区分研究制品（Test Cards、Learning Cards）与交付制品（Task Cards、MVP Scope），并将 white-20261022 原型划分为三层优先级。',
      artefactDistinctionHeading: '四类项目制品的职责区分',
      artefactDistinctionSubnote:
        '避免将计划测试或开发分工混淆为已证实的用户结论：',
      artefactDistinctions: [
        {
          code: '01 · TEST CARDS',
          term: 'Test Cards（测试卡）',
          purpose: '定义待检验假设、受访者原型任务与观察问题。',
          projectExample: 'Iteration 03 共 8 组测试卡（含收藏与对比岗位）。',
        },
        {
          code: '02 · LEARNING CARDS',
          term: 'Learning Cards（学习卡）',
          purpose: '归纳实测评分与操作卡点，转化为下一步界面改版决策。',
          projectExample: '提炼收藏 (10/10)、对比 (8/10) 与优先级 (6/10)、笔记 (5/10) 差距。',
        },
        {
          code: '03 · TASK CARDS',
          term: 'Task Cards（任务卡）',
          purpose: '追踪五名成员在设计、前端与文档上的具体工程分工。',
          projectExample: '推进 white-20261022 组件、对比表与个人资料视图实现。',
        },
        {
          code: '04 · MVP SCOPE',
          term: 'MVP（原型范围）',
          purpose: '按核心优先级、支撑工作流与实验性功能组织的可测试产品范围。',
          projectExample: '优先保障发现、收藏对比与资料准备，弱化自动匹配。',
        },
      ],
      mvpTiersHeading: '研究驱动的 MVP 三层优先级架构',
      mvpTiersSubnote:
        '每一层功能均对应 Iteration 01–03 的具体研究证据：',
      mvpTiers: [
        {
          id: 'core',
          code: '第一层 · 核心优先级',
          title: '职位发现 · 收藏与同屏对比 · 私密工作台',
          statusBadge: 'MVP 核心闭环',
          statusTone: 'core',
          description:
            '支撑学生看清岗位条件、收拢候选并横向权衡的核心链路。',
          features: [
            {
              name: '关键条件首屏拆解',
              evidenceLink: '响应 Iteration 01–02 对薪资、工时与签证透明的诉求',
              scopeStatus: '已构建并参与 Iteration 03 实测',
            },
            {
              name: '收藏与同屏条件对比',
              evidenceLink: '收藏 10/10 · 对比 8/10 正向评分',
              scopeStatus: '已实测 · 优先级交互持续优化',
            },
            {
              name: '私密工作台与常驻笔记',
              evidenceLink: '针对笔记 5/10 评分改为卡片内嵌常驻槽位',
              scopeStatus: '已完成可发现性改版方案',
            },
          ],
        },
        {
          id: 'supporting',
          code: '第二层 · 支撑工作流',
          title: '可复用资料与分享控制 · 企业评价 · 进度追踪',
          statusBadge: '支撑工作流',
          statusTone: 'supporting',
          description:
            '减少重复填表负担，同时保留单次投递微调与隐私分享预览。',
          features: [
            {
              name: '可复用资料与字段分享开关（个人重点负责）',
              evidenceLink: '响应 Iteration 02 资料复用与隐私控制诉求',
              scopeStatus: '已构建含雇主视角预览的原型流',
            },
            {
              name: '上下文企业信息与评价',
              evidenceLink: '辅助学生在对比岗位时评估企业可信度',
              scopeStatus: '整合于详情与对比视图',
            },
            {
              name: '申请进度追踪面板',
              evidenceLink: '串联候选收藏、草稿准备与已投递状态',
              scopeStatus: '已构建状态流转视图',
            },
          ],
        },
        {
          id: 'experimental',
          code: '第三层 · 实验性功能',
          title: '可选 AI 简历建议与自动化概念',
          statusBadge: '实验性模块',
          statusTone: 'experimental',
          description:
            '基于 Iteration 02“人工复核优先”结论，严格限制在可选辅助地位。',
          features: [
            {
              name: '可选 AI 简历建议',
              evidenceLink: '需人工复核；未宣称 AI 提效已获实证',
              scopeStatus: '独立实验模块 (cv-review.css)',
            },
            {
              name: '自动匹配 / 自动投递概念',
              evidenceLink: '让位于学生自主权衡原则',
              scopeStatus: '排除在核心 MVP 之外',
            },
          ],
        },
      ],
      workspaceExhibit: {
        badge: '重构界面展台 · WHITE-20261022 规范',
        title: 'BridgeWork AU 核心与支撑工作流交互展台',
        honestLabel:
          '透明声明：基于 BridgeWork AU white-20261022 视觉令牌规范与课程工作流定义重构。',
        tabs: [
          {
            id: 'compare-workspace',
            code: '展台 01 · 核心闭环',
            label: '职位发现、收藏与同屏对比工作台',
            scopeTag: '核心 MVP · 融入 Iteration 03 学习卡改版',
            summary:
              '结合双栏职位卡片、同屏对比面板、#FFF4DC 优先级行高亮与常驻私密笔记槽位。',
            keyUiElements: [
              '首屏直接呈现职位、时薪/年薪、混合办公方式与申请要求。',
              '自解释优先级栏：点击即以 #FFF4DC 高亮匹配条件行。',
              '每张对比卡片内嵌常驻私密笔记框。',
            ],
          },
          {
            id: 'profile-sharing',
            code: '展台 02 · 个人负责模块',
            label: '可复用个人资料与字段级分享控制',
            scopeTag: '支撑工作流 · 个人 UI/UX 重点贡献',
            summary:
              '支持跨投递复用教育、经历与作品集模块，按岗位单独微调草稿，并在提交前切换字段级可见性。',
            keyUiElements: [
              '可复用但可按岗位编辑的个人资料模块。',
              '字段级分享开关（作品集、签证工作权限、成绩单 PDF）。',
              '投递前“雇主可见视角”实时预览。',
            ],
          },
          {
            id: 'application-tracker',
            code: '展台 03 · 连续追踪',
            label: '投递草稿与进度追踪面板',
            scopeTag: '连续闭环 · 收藏对比 → 草稿 → 已投递',
            summary:
              '将候选岗位、私密对比笔记与定制草稿无缝带入进度看板，替代外部手动表格。',
            keyUiElements: [
              '三阶段看板：候选对比中 → 草稿就绪 → 已投递追踪。',
              '自动继承对比阶段的私密笔记与所选资料草稿版本。',
            ],
          },
        ],
      },
    },
    section05Learned: {
      number: '05',
      eyebrow: '05 — WHAT WE LEARNED · 核心复盘、研究局限与个人贡献',
      title: '关键收获、未验证边界与五人团队中的个人贡献',
      lead: 'BridgeWork AU 让我们在真实迭代中学会区分“有研究支撑的核心价值”与“尚待复测的界面及商业假设”。',
      keyLearningsHeading: '三项核心收获',
      keyLearnings: [
        {
          code: '复盘 01 · 连续工作流价值',
          title: '打通“筛选对比”到“资料准备”的断层',
          detail:
            '串联职位发现、收藏（10/10）、同屏对比（8/10）与可编辑资料准备，比单纯堆砌职位列表更能回应学生痛点。',
          epistemicTag: 'ITERATIONS 02–03',
        },
        {
          code: '复盘 02 · 正向评分不等于零卡点',
          title: '区分“方向受认可”与“控件易发现”',
          detail:
            '尽管对比获 8/10 好评，仍有 7/10 份记录出现操作卡点，且优先级（6/10）与笔记（5/10）偏低——次级控件必须具备自解释反馈。',
          epistemicTag: 'ITERATION 03 学习卡',
        },
        {
          code: '复盘 03 · 自主控制感优先',
          title: '信息复用必须保留单次编辑与分享预览',
          detail:
            '学生需要复用基础信息以减少重复输入，但坚持按岗位微调草稿并明确预览雇主可见字段。',
          epistemicTag: 'ITERATION 02 访谈归纳',
        },
      ],
      unresolvedHeading: '研究局限与尚未验证的假设',
      unresolvedItems: [
        {
          code: '局限 01 · 改版待复测',
          topic: '优先级栏与常驻私密笔记改版尚未完成新一轮测试',
          reason:
            '针对 Iteration 03 学习卡完成的界面优化方案，仍需后续可用性复测来检验卡点是否下降。',
        },
        {
          code: '局限 02 · 未作时间节省实证',
          topic: '正向态度评分（4–5 分）不等同于量化提效',
          reason:
            '10 份受访记录衡量的是功能正向评分与定性卡点，不宣称已证实节省投递时间或提升录用率。',
        },
        {
          code: '局限 03 · B2B 商业假设待验证',
          topic: '高校资助试点与雇主付费招聘流尚未签约验证',
          reason:
            '商业模式画布中的两条收入路径仍属课程阶段假设，未开展真实商业试点。',
        },
      ],
      myContributionHeading: '五人团队中的个人具体贡献',
      myContributionSubnote:
        'BridgeWork AU 由五名成员协作完成；我在团队中具体负责并完成了以下部分：',
      myContributions: [
        {
          code: '01 · 用户访谈与问题归纳',
          area: '访谈执行与客户探索汇总',
          detail:
            '参与多轮用户访谈（贡献 Iteration 3 中 2 份受访记录），提炼学生在跨平台对比、重复填表与隐私控制上的痛点。',
        },
        {
          code: '02 · 竞品与商业模式分析',
          area: '竞品调研与 BMC 优先级权衡',
          detail:
            '开展针对 BOSS 直聘、SEEK、LinkedIn 与个人表格的对比分析，协助评估商业模式画布演进与 MVP 范围取舍。',
        },
        {
          code: '03 · 需求转化与卡片信息层级',
          area: '从学习卡洞察到双栏卡片规范',
          detail:
            '协助将访谈与学习卡发现转化为产品需求，确立突出职位、薪资、工作方式与截止日期的双栏职位卡片层级。',
        },
        {
          code: '04 · 个人资料与申请工作流设计',
          area: 'Student Profile & Applications UI/UX',
          detail:
            '重点设计个人资料与申请管理工作流——在 white-20261022 规范下构建可复用且可编辑的资料模块、字段级分享开关与投递前预览。',
        },
      ],
      teamAttributionBoundary:
        '团队归属声明：三轮研究框架、8 组测试卡汇总、商业模式画布共创与代码仓库集成由 COMP7110 五名团队成员共同完成。',
      footerNextProjectLabel: '浏览下一个项目案例',
    },
  },
}
