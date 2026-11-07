#!/usr/bin/env node
/**
 * PORTFOLIO-PDF-01 — PDF & Contact Sheet Generator Script
 *
 * 1. Uses an offscreen HTML5 <canvas> in Playwright to crop exact top-left (sx, sy, sw, sh)
 *    interactive regions and re-encode all PDF assets as clean, metadata-free baseline JPEGs
 *    so the final PDF lands squarely in the 3–5 MB target range (< 5 MB) with zero clipped UI labels.
 * 2. Loads `portfolio-pdf-source.html` and generates `Jianshuo_Liu_UIUX_Portfolio_CN.pdf`
 *    with real vector text, vector SVGs, and embedded clickable hyperlinks.
 * 3. Renders all 10 pages to `pages/page-01.png` .. `pages/page-10.png` and composes
 *    `Portfolio_PDF_Contact_Sheet.png`.
 */
import fs from 'node:fs'
import path from 'node:path'

const PROJECT_DIR = '/Users/utopia/UIUX-whole-project'
const PUBLIC_DIR = path.join(PROJECT_DIR, 'public')
const QA05_DIR = path.join(PROJECT_DIR, 'docs/qa/ls-05')
const WS_DIR = process.env.GEMINI_WORKSPACE_DIR || '/tmp'
const PDF_DIR = path.join(PROJECT_DIR, 'deliverables/portfolio-pdf')
const PAGES_DIR = path.join(PDF_DIR, 'pages')
const ASSETS_DIR = path.join(PDF_DIR, 'assets')

fs.mkdirSync(PAGES_DIR, { recursive: true })
fs.mkdirSync(ASSETS_DIR, { recursive: true })

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
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

async function main() {
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
      viewport: { width: 1600, height: 900 },
      deviceScaleFactor: 2,
    })

    // Serve any file from PROJECT_DIR, WS_DIR, or PDF_DIR on http://pdf.local/
    await context.route('http://pdf.local/**', async (route) => {
      const reqUrl = new URL(route.request().url())
      let relPath = decodeURIComponent(reqUrl.pathname)
      if (relPath === '/' || relPath === '') {
        relPath = '/portfolio-pdf-source.html'
      }
      let filePath = path.join(PDF_DIR, relPath)
      if (relPath.startsWith('/__abs__/')) {
        filePath = relPath.slice('/__abs__'.length)
      }
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase()
        await route.fulfill({
          status: 200,
          contentType: MIME[ext] || 'application/octet-stream',
          body: fs.readFileSync(filePath),
        })
      } else {
        await route.fulfill({ status: 404, body: 'Not found: ' + filePath })
      }
    })

    const cropPage = await context.newPage()
    await cropPage.goto('http://pdf.local/portfolio-pdf-source.html', {
      waitUntil: 'domcontentloaded',
    })

    // Exact top-left (sx, sy, sw, sh) crops & baseline JPEG encoding jobs
    // Tuned to keep UI labels razor-sharp while landing total PDF size at ~3.8–4.3 MB (< 5 MB)
    const jobs = [
      {
        src: path.join(PUBLIC_DIR, 'zeroline/showcase/zeroline-home.png'),
        dest: 'zl-home.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 1440, quality: 0.82,
      },
      {
        src: path.join(PUBLIC_DIR, 'zeroline/showcase/zeroline-heroes.png'),
        dest: 'zl-heroes.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 1320, quality: 0.82,
      },
      {
        src: path.join(PUBLIC_DIR, 'zeroline/showcase/zeroline-news.png'),
        dest: 'zl-news.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 1200, quality: 0.80,
      },
      {
        src: path.join(PUBLIC_DIR, 'zeroline/showcase/zeroline-store.png'),
        dest: 'zl-store.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 1320, quality: 0.82,
      },
      {
        src: path.join(PUBLIC_DIR, 'zeroline/intro/nova-01-ready.webp'),
        dest: 'zl-pose-01.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 420, quality: 0.80,
      },
      {
        src: path.join(PUBLIC_DIR, 'zeroline/intro/nova-02-draw.webp'),
        dest: 'zl-pose-02.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 420, quality: 0.80,
      },
      {
        src: path.join(PUBLIC_DIR, 'zeroline/intro/nova-03-windup.webp'),
        dest: 'zl-pose-03.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 420, quality: 0.80,
      },
      {
        src: path.join(PUBLIC_DIR, 'zeroline/intro/nova-04-strike.webp'),
        dest: 'zl-pose-04.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 420, quality: 0.80,
      },
      {
        src: path.join(PUBLIC_DIR, 'lovestory/case-study/architecture/arch-hub-our-world.png'),
        dest: 'ls-hub-dark.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 1440, quality: 0.84,
      },
      {
        src: path.join(PUBLIC_DIR, 'lovestory/case-study/experience/exp-01c-entrance-gate.png'),
        dest: 'ls-entrance-gate.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 1200, quality: 0.82,
      },
      {
        src: path.join(PUBLIC_DIR, 'lovestory/case-study/experience/exp-04b-mobile-composer.png'),
        dest: 'ls-mobile-composer.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 600, quality: 0.84,
      },
      {
        src: path.join(PUBLIC_DIR, 'lovestory/case-study/experience/exp-04c-mobile-story.png'),
        dest: 'ls-mobile-story.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 600, quality: 0.84,
      },
      {
        src: path.join(PUBLIC_DIR, 'lovestory/case-study/discovery/comp-01-apple-shared-albums.png'),
        dest: 'ls-comp-01.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 1320, quality: 0.84,
      },
      {
        src: path.join(PUBLIC_DIR, 'lovestory/case-study/requirements/req-01-shared-space.png'),
        dest: 'ls-shared-space.jpg',
        sx: 0, sy: 0, sw: 0, sh: 0, maxW: 1280, quality: 0.84,
      },
      // Cropped interactive states from 2880x1800 Retina captures (exact top-left sx, sy, sw, sh!)
      {
        src: path.join(QA05_DIR, '01-desktop-archive-index-1440x900.png'),
        dest: 'ls-ux-index-crop.jpg',
        sx: 220, sy: 600, sw: 2440, sh: 910, maxW: 1320, quality: 0.84,
      },
      {
        src: path.join(WS_DIR, 'ls04a_qa/01-desktop-gallery.png'),
        dest: 'ls-gallery-grid-crop.jpg',
        sx: 330, sy: 340, sw: 2220, sh: 1430, maxW: 1320, quality: 0.84,
      },
      {
        src: path.join(WS_DIR, 'ls04a_qa/03-expanded-memory-detail.png'),
        dest: 'ls-gallery-expanded-crop.jpg',
        sx: 330, sy: 460, sw: 2220, sh: 1230, maxW: 1320, quality: 0.85,
      },
      {
        src: path.join(WS_DIR, 'ls04b_qa/01-timeline-selection.png'),
        dest: 'ls-timeline-kyoto-crop.jpg',
        sx: 330, sy: 350, sw: 2220, sh: 1430, maxW: 1320, quality: 0.84,
      },
      {
        src: path.join(WS_DIR, 'ls04b_qa/02-map-selection.png'),
        dest: 'ls-timeline-chengdu-crop.jpg',
        sx: 330, sy: 350, sw: 2220, sh: 1430, maxW: 1320, quality: 0.84,
      },
      {
        src: path.join(WS_DIR, 'ls04c_qa/01-locked-initial-state.png'),
        dest: 'ls-private-locked-crop.jpg',
        sx: 330, sy: 410, sw: 2220, sh: 1350, maxW: 1280, quality: 0.84,
      },
      {
        src: path.join(QA05_DIR, '05-desktop-archive03-private-archive-1440x900.png'),
        dest: 'ls-private-unlocked-crop.jpg',
        sx: 330, sy: 510, sw: 2220, sh: 1270, maxW: 1280, quality: 0.84,
      },
      {
        src: path.join(QA05_DIR, '06-desktop-archive04-validation-error-1440x900.png'),
        dest: 'ls-ds-validation-error-crop.jpg',
        sx: 336, sy: 875, sw: 2208, sh: 900, maxW: 1320, quality: 0.85,
      },
      {
        src: path.join(QA05_DIR, '07-desktop-archive04-paper-zh-1440x900.png'),
        dest: 'ls-ds-paper-zh-crop.jpg',
        sx: 336, sy: 655, sw: 2208, sh: 1120, maxW: 1320, quality: 0.85,
      },
    ]

    for (const job of jobs) {
      const dataUrl = await cropPage.evaluate(async (j) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = 'http://pdf.local/__abs__' + j.src
        })
        const sx = j.sx || 0
        const sy = j.sy || 0
        const sw = j.sw || img.naturalWidth
        const sh = j.sh || img.naturalHeight
        const scale = sw > j.maxW ? j.maxW / sw : 1
        const dstW = Math.round(sw * scale)
        const dstH = Math.round(sh * scale)
        const canvas = document.createElement('canvas')
        canvas.width = dstW
        canvas.height = dstH
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#10110F'
        ctx.fillRect(0, 0, dstW, dstH)
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dstW, dstH)
        return canvas.toDataURL('image/jpeg', j.quality)
      }, job)

      const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '')
      fs.writeFileSync(path.join(ASSETS_DIR, job.dest), Buffer.from(base64, 'base64'))
    }
    await cropPage.close()

    // Now open a fresh page to render the 10-page PDF and page screenshots
    const page = await context.newPage()
    await page.goto('http://pdf.local/portfolio-pdf-source.html', {
      waitUntil: 'networkidle',
    })
    await page.waitForTimeout(500)

    const imageCheck = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'))
      const broken = imgs
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.getAttribute('src'))
      const links = Array.from(document.querySelectorAll('a[href]')).map((a) =>
        a.getAttribute('href')
      )
      return {
        totalImages: imgs.length,
        brokenImages: broken,
        totalPages: document.querySelectorAll('.pdf-page').length,
        uniqueLinks: Array.from(new Set(links)),
      }
    })

    if (imageCheck.brokenImages.length > 0) {
      throw new Error(
        'Broken images in PDF source: ' + imageCheck.brokenImages.join(', ')
      )
    }

    // 1. Capture each of the 10 pages to PNG for visual QA and contact sheet
    const pageEls = page.locator('.pdf-page')
    const pageCount = await pageEls.count()
    for (let i = 0; i < pageCount; i++) {
      const num = String(i + 1).padStart(2, '0')
      const el = pageEls.nth(i)
      await el.screenshot({
        path: path.join(PAGES_DIR, `page-${num}.png`),
      })
    }

    // 2. Generate the vector PDF with real text and embedded hyperlinks
    const pdfOutPath = path.join(PDF_DIR, 'Jianshuo_Liu_UIUX_Portfolio_CN.pdf')
    await page.pdf({
      path: pdfOutPath,
      width: '1600px',
      height: '900px',
      printBackground: true,
      preferCSSPageSize: true,
      tagged: false,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    })

    // 3. Generate Portfolio_PDF_Contact_Sheet.png (2 columns × 5 rows)
    const sheetPage = await context.newPage()
    await sheetPage.setViewportSize({ width: 1720, height: 2560 })
    const sheetHtml = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1720px;
            background: #141413;
            color: #F3EFE7;
            font-family: 'Inter', 'Helvetica Neue', 'STHeiti', 'Heiti SC', sans-serif;
            padding: 36px 44px 40px;
          }
          header {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            padding-bottom: 18px;
            margin-bottom: 24px;
            border-bottom: 1px solid rgba(232, 227, 216, 0.16);
          }
          h1 {
            font-size: 22px;
            font-weight: 600;
            letter-spacing: 0.02em;
            color: #E8E3D8;
          }
          .meta {
            font-family: monospace;
            font-size: 12px;
            color: #C8AD75;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 22px 26px;
          }
          .cell {
            background: #1C1D1A;
            border: 1px solid rgba(200, 173, 117, 0.28);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .cell-bar {
            padding: 7px 12px;
            font-family: monospace;
            font-size: 11px;
            color: #C8AD75;
            background: #121311;
            border-bottom: 1px solid rgba(232, 227, 216, 0.1);
            display: flex;
            justify-content: space-between;
          }
          .cell img {
            width: 100%;
            height: auto;
            display: block;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>Jianshuo_Liu_UIUX_Portfolio_CN.pdf — 10-Page Contact Sheet (16:9 Landscape)</h1>
          <span class="meta">LIU JIANSHUO · SELECTED WORKS (ZERO//LINE &amp; LOVESTORY) · 2026</span>
        </header>
        <div class="grid">
          ${Array.from({ length: pageCount })
            .map((_, idx) => {
              const num = String(idx + 1).padStart(2, '0')
              const titles = [
                'PAGE 01 · COVER (封面)',
                'PAGE 02 · SELECTED PROJECTS (精选项目总览)',
                'PAGE 03 · ZERO//LINE: VISUAL DESIGN (视觉识别与构图)',
                'PAGE 04 · ZERO//LINE: INTERACTION DESIGN (拔刀转场与交互)',
                'PAGE 05 · LOVESTORY: PRODUCT OVERVIEW (产品定位与空间中枢)',
                'PAGE 06 · LOVESTORY: UX RESEARCH (研究推演与需求链)',
                'PAGE 07 · LOVESTORY: MEMORY GALLERY (记忆画廊与原色画框)',
                'PAGE 08 · LOVESTORY: TIMELINE × MEMORY MAP (时空双向联动)',
                'PAGE 09 · LOVESTORY: PRIVACY & DESIGN SYSTEM (隐私边界与双境系统)',
                'PAGE 10 · FINAL PROJECT LINKS (核心总结与在线入口)',
              ]
              return `
                <div class="cell">
                  <div class="cell-bar">
                    <strong>${titles[idx]}</strong>
                    <span>1600 × 900 (16:9)</span>
                  </div>
                  <img src="http://pdf.local/pages/page-${num}.png" alt="${titles[idx]}" />
                </div>
              `
            })
            .join('')}
        </div>
      </body>
      </html>
    `
    await sheetPage.setContent(sheetHtml, { waitUntil: 'networkidle' })
    await sheetPage.waitForTimeout(400)
    const contactSheetPath = path.join(
      PDF_DIR,
      'Portfolio_PDF_Contact_Sheet.png'
    )
    await sheetPage.screenshot({
      path: contactSheetPath,
      fullPage: true,
    })

    const pdfStat = fs.statSync(pdfOutPath)
    const sheetStat = fs.statSync(contactSheetPath)

    console.log(
      JSON.stringify(
        {
          pdfPath: pdfOutPath,
          pdfBytes: pdfStat.size,
          pdfMB: Number((pdfStat.size / (1024 * 1024)).toFixed(2)),
          contactSheetPath,
          contactSheetBytes: sheetStat.size,
          contactSheetMB: Number((sheetStat.size / (1024 * 1024)).toFixed(2)),
          ...imageCheck,
        },
        null,
        2
      )
    )
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
