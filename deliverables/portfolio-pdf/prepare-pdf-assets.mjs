#!/usr/bin/env node
/**
 * PORTFOLIO-PDF-01 — Asset Preparation & Deliberate State Capture Script
 *
 * 1. Optimizes authentic product screenshots from `public/zeroline/` and `public/lovestory/`
 *    into high-clarity JPEGs in `deliverables/portfolio-pdf/assets/`.
 * 2. Captures deliberate interactive states from the local built Portfolio (`dist/`)
 *    using Playwright at 2x Retina scale with navigation chrome hidden so screenshots
 *    have zero overlapping buttons or browser/debug bars.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const PROJECT_DIR = '/Users/utopia/UIUX-whole-project'
const DIST_DIR = path.join(PROJECT_DIR, 'dist')
const PUBLIC_DIR = path.join(PROJECT_DIR, 'public')
const WS_DIR = process.env.GEMINI_WORKSPACE_DIR || '/tmp'
const PDF_DIR = path.join(PROJECT_DIR, 'deliverables/portfolio-pdf')
const ASSETS_DIR = path.join(PDF_DIR, 'assets')

fs.mkdirSync(ASSETS_DIR, { recursive: true })

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
}

async function loadPlaywright() {
  try {
    return await import('playwright')
  } catch {
    const fallbackPath = path.join(
      WS_DIR,
      'pw-runner/node_modules/playwright/index.mjs'
    )
    return await import(fallbackPath)
  }
}

function optimizePngToJpg(srcPng, destJpg, maxWidth = 1800, quality = 88) {
  execFileSync('sips', [
    '-s',
    'format',
    'jpeg',
    '-s',
    'formatOptions',
    String(quality),
    '-Z',
    String(maxWidth),
    srcPng,
    '--out',
    destJpg,
  ])
}

async function setupRoute(context) {
  await context.route('**/*', async (route) => {
    const reqUrl = route.request().url()
    const parsed = new URL(reqUrl)
    if (parsed.hostname !== 'portfolio.local') {
      await route.fulfill({ status: 200, body: '' })
      return
    }
    let pathname = decodeURIComponent(parsed.pathname)
    if (pathname === '/' || !path.extname(pathname)) {
      pathname = '/index.html'
    }
    const filePath = path.join(DIST_DIR, pathname)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase()
      await route.fulfill({
        status: 200,
        contentType: MIME[ext] || 'application/octet-stream',
        body: fs.readFileSync(filePath),
      })
    } else {
      const indexHtml = path.join(DIST_DIR, 'index.html')
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: fs.readFileSync(indexHtml),
      })
    }
  })
}

async function main() {
  console.log('1. Optimizing authentic product screenshots...')
  const staticPairs = [
    // ZERO//LINE authentic showcase screenshots
    {
      src: path.join(PUBLIC_DIR, 'zeroline/showcase/zeroline-home.png'),
      dest: path.join(ASSETS_DIR, 'zl-home.jpg'),
      maxWidth: 1920,
      quality: 90,
    },
    {
      src: path.join(PUBLIC_DIR, 'zeroline/showcase/zeroline-heroes.png'),
      dest: path.join(ASSETS_DIR, 'zl-heroes.jpg'),
      maxWidth: 1600,
      quality: 88,
    },
    {
      src: path.join(PUBLIC_DIR, 'zeroline/showcase/zeroline-news.png'),
      dest: path.join(ASSETS_DIR, 'zl-news.jpg'),
      maxWidth: 1600,
      quality: 86,
    },
    {
      src: path.join(PUBLIC_DIR, 'zeroline/showcase/zeroline-store.png'),
      dest: path.join(ASSETS_DIR, 'zl-store.jpg'),
      maxWidth: 1600,
      quality: 86,
    },
    // LoveStory authentic product screenshots
    {
      src: path.join(
        PUBLIC_DIR,
        'lovestory/case-study/architecture/arch-hub-our-world.png'
      ),
      dest: path.join(ASSETS_DIR, 'ls-hub-dark.jpg'),
      maxWidth: 1920,
      quality: 90,
    },
    {
      src: path.join(
        PUBLIC_DIR,
        'lovestory/case-study/design-system/ds-light-hub.png'
      ),
      dest: path.join(ASSETS_DIR, 'ls-hub-light.jpg'),
      maxWidth: 1600,
      quality: 88,
    },
    {
      src: path.join(
        PUBLIC_DIR,
        'lovestory/case-study/experience/exp-01c-entrance-gate.png'
      ),
      dest: path.join(ASSETS_DIR, 'ls-entrance-gate.jpg'),
      maxWidth: 1500,
      quality: 86,
    },
    {
      src: path.join(
        PUBLIC_DIR,
        'lovestory/case-study/experience/exp-01-moments-gallery.png'
      ),
      dest: path.join(ASSETS_DIR, 'ls-moments-gallery.jpg'),
      maxWidth: 1600,
      quality: 88,
    },
    {
      src: path.join(
        PUBLIC_DIR,
        'lovestory/case-study/experience/exp-01b-memory-detail.png'
      ),
      dest: path.join(ASSETS_DIR, 'ls-memory-detail.jpg'),
      maxWidth: 1600,
      quality: 88,
    },
    {
      src: path.join(
        PUBLIC_DIR,
        'lovestory/case-study/experience/exp-03-memory-map-globe.png'
      ),
      dest: path.join(ASSETS_DIR, 'ls-memory-map-globe.jpg'),
      maxWidth: 1600,
      quality: 88,
    },
    {
      src: path.join(
        PUBLIC_DIR,
        'lovestory/case-study/experience/exp-04-private-lock.png'
      ),
      dest: path.join(ASSETS_DIR, 'ls-private-lock.jpg'),
      maxWidth: 1500,
      quality: 88,
    },
    {
      src: path.join(
        PUBLIC_DIR,
        'lovestory/case-study/experience/exp-04b-mobile-composer.png'
      ),
      dest: path.join(ASSETS_DIR, 'ls-mobile-composer.jpg'),
      maxWidth: 780,
      quality: 88,
    },
    {
      src: path.join(
        PUBLIC_DIR,
        'lovestory/case-study/experience/exp-04c-mobile-story.png'
      ),
      dest: path.join(ASSETS_DIR, 'ls-mobile-story.jpg'),
      maxWidth: 780,
      quality: 88,
    },
    {
      src: path.join(
        PUBLIC_DIR,
        'lovestory/case-study/requirements/req-01-shared-space.png'
      ),
      dest: path.join(ASSETS_DIR, 'ls-shared-space.jpg'),
      maxWidth: 1500,
      quality: 88,
    },
  ]

  for (const item of staticPairs) {
    optimizePngToJpg(item.src, item.dest, item.maxWidth, item.quality)
  }

  console.log('2. Capturing deliberate interactive states via Playwright...')
  const { chromium } = await loadPlaywright()
  const execPath = path.join(
    WS_DIR,
    'pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'
  )

  const browser = await chromium.launch({
    executablePath: fs.existsSync(execPath) ? execPath : undefined,
    headless: true,
    args: ['--single-process', '--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  })

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    })
    await setupRoute(context)

    // 2A. Capture ZERO//LINE Case Study First-Screen Hero Stage (in Simplified Chinese)
    const zlPage = await context.newPage()
    await zlPage.goto('http://portfolio.local/#projects/zero-line', {
      waitUntil: 'networkidle',
    })
    await zlPage.waitForTimeout(450)
    const zhToggle = zlPage.locator('button:has-text("中文")').first()
    if ((await zhToggle.count()) > 0 && (await zhToggle.isVisible())) {
      await zhToggle.click()
      await zlPage.waitForTimeout(350)
    }
    const zlHero = zlPage.locator('.zl-hero-stage')
    if ((await zlHero.count()) > 0) {
      await zlHero.screenshot({
        path: path.join(ASSETS_DIR, 'zl-case-hero-zh.jpg'),
        type: 'jpeg',
        quality: 88,
      })
    }
    await zlPage.close()

    // 2B. Open LoveStory Case Study in a fresh page so initial hash routing mounts directly on Archive Index
    const lsPage = await context.newPage()
    await lsPage.goto('http://portfolio.local/#projects/lovestory', {
      waitUntil: 'networkidle',
    })
    await lsPage.waitForTimeout(450)

    const lsZhBtn = lsPage.locator('button:has-text("中文")').first()
    if ((await lsZhBtn.count()) > 0 && (await lsZhBtn.isVisible())) {
      await lsZhBtn.click()
      await lsPage.waitForTimeout(350)
    }

    // Hide floating topbar for clean element captures
    await lsPage.addStyleTag({
      content: `.ls-standalone-topbar { display: none !important; }`,
    })

    // Capture UX Discovery Canvas with Node 03 (User Research) expanded
    const researchNodeBtn = lsPage
      .locator('[data-ux-node-trigger="ux-node-03"]')
      .first()
    await researchNodeBtn.scrollIntoViewIfNeeded()
    await researchNodeBtn.click()
    await lsPage.waitForTimeout(450)
    const expandedResearchPanel = lsPage.locator('[data-ux-node="ux-node-03"]')
    await expandedResearchPanel.screenshot({
      path: path.join(ASSETS_DIR, 'ls-ux-research-expanded-zh.jpg'),
      type: 'jpeg',
      quality: 88,
    })

    // Navigate to Archive 03 — Experience the Memories
    await lsPage.locator('[data-archive-entry="archive-03"]').click()
    await lsPage.waitForTimeout(500)

    // Capture Interactive Memory Gallery (Overview + Opened #20211E Detail Modal)
    const gallerySection = lsPage.locator('.ls-interactive-memory-gallery')
    await gallerySection.scrollIntoViewIfNeeded()
    await lsPage.waitForTimeout(300)
    await gallerySection.screenshot({
      path: path.join(ASSETS_DIR, 'ls-interactive-gallery-grid-zh.jpg'),
      type: 'jpeg',
      quality: 88,
    })

    // Click mem-101 (Riverwalk Evening Walk) to open its #20211E detail modal
    await lsPage.locator('[data-memory-trigger="mem-101"]').click()
    await lsPage.waitForTimeout(400)
    const detailModal = lsPage.locator('.ls-mg-detail-dialog')
    await detailModal.screenshot({
      path: path.join(ASSETS_DIR, 'ls-interactive-gallery-modal-zh.jpg'),
      type: 'jpeg',
      quality: 90,
    })
    // Close modal
    await lsPage.keyboard.press('Escape')
    await lsPage.waitForTimeout(300)

    // Switch to Area B: Timeline x Memory Map
    await lsPage.locator('[data-exhibition-tab="timeline"]').click()
    await lsPage.waitForTimeout(400)
    const timelineExplorer = lsPage.locator('.ls-timeline-map-explorer')
    await timelineExplorer.scrollIntoViewIfNeeded()
    await lsPage.waitForTimeout(300)

    // State 1: Select Kyoto (mem-103) on Timeline -> highlights Kyoto on Map
    await lsPage.locator('[data-timeline-node="mem-103"]').click()
    await lsPage.waitForTimeout(350)
    await timelineExplorer.screenshot({
      path: path.join(ASSETS_DIR, 'ls-timeline-map-kyoto-zh.jpg'),
      type: 'jpeg',
      quality: 88,
    })

    // State 2: Select Chengdu (mem-105) on Map -> highlights Chengdu on Timeline
    await lsPage.locator('[data-map-marker="mem-105"]').click({ force: true })
    await lsPage.waitForTimeout(350)
    await timelineExplorer.screenshot({
      path: path.join(ASSETS_DIR, 'ls-timeline-map-chengdu-zh.jpg'),
      type: 'jpeg',
      quality: 88,
    })

    // Switch to Area D: Interactive Private Archive
    await lsPage.locator('[data-exhibition-tab="private-mobile"]').click()
    await lsPage.waitForTimeout(400)
    const privateDemo = lsPage.locator('.ls-private-archive-demo')
    await privateDemo.scrollIntoViewIfNeeded()
    await lsPage.waitForTimeout(300)

    // Unlock as Creator and open inline permission controls
    await lsPage.locator('[data-private-role="creator"]').click()
    await lsPage.waitForTimeout(200)
    await lsPage.locator('[data-private-action="unlock"]').click()
    await lsPage.waitForTimeout(350)
    await privateDemo.screenshot({
      path: path.join(ASSETS_DIR, 'ls-private-creator-unlocked-zh.jpg'),
      type: 'jpeg',
      quality: 88,
    })

    // Switch to Archive 04 — Made With Intention
    await lsPage.locator('.ls-thread-node-btn').nth(3).click()
    await lsPage.waitForTimeout(450)
    const dsShowcase = lsPage.locator('.ls-ds-interactive-showcase')
    await dsShowcase.scrollIntoViewIfNeeded()
    await lsPage.waitForTimeout(300)

    // Capture Dark Archive + Validation Error state
    await lsPage.locator('[data-select-specimen-theme="dark"]').click()
    await lsPage.locator('[data-select-specimen-state="error"]').click()
    await lsPage.waitForTimeout(300)
    await dsShowcase.screenshot({
      path: path.join(ASSETS_DIR, 'ls-ds-dark-validation-error-zh.jpg'),
      type: 'jpeg',
      quality: 88,
    })

    // Capture Paper & Ink + Normal state
    await lsPage.locator('[data-select-specimen-theme="paper"]').click()
    await lsPage.locator('[data-select-specimen-state="normal"]').click()
    await lsPage.waitForTimeout(300)
    await dsShowcase.screenshot({
      path: path.join(ASSETS_DIR, 'ls-ds-paper-normal-zh.jpg'),
      type: 'jpeg',
      quality: 88,
    })

    await lsPage.close()
    await context.close()
  } finally {
    await browser.close()
  }

  const files = fs.readdirSync(ASSETS_DIR)
  let totalBytes = 0
  for (const f of files) {
    const st = fs.statSync(path.join(ASSETS_DIR, f))
    totalBytes += st.size
    console.log(`  - ${f}: ${(st.size / 1024).toFixed(1)} KB`)
  }
  console.log(
    `Prepared ${files.length} optimized assets in ${ASSETS_DIR} (${(
      totalBytes /
      (1024 * 1024)
    ).toFixed(2)} MB total)`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
