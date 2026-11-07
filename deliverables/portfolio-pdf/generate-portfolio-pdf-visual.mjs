#!/usr/bin/env node
/**
 * PORTFOLIO-PDF-02 — Visual-First 8-Page PDF & Contact Sheet Generator
 *
 * 1. Produces unclipped, aspect-matched baseline JPEG crops for Pages 06, 07, and 08 so
 *    every screenshot fills its visual frame cleanly with zero clipped buttons or tall black bands.
 * 2. Renders `portfolio-pdf-visual-source.html` to `Jianshuo_Liu_UIUX_Portfolio_Visual_CN.pdf`
 *    (8 pages, 16:9 Landscape 1600×900, vector text, working hyperlinks, < 5 MB).
 * 3. Renders individual page previews (`visual-pages/page-01.png` .. `page-08.png`) and
 *    composes `Portfolio_PDF_Visual_Contact_Sheet.png` (2 columns × 4 rows).
 */
import fs from 'node:fs'
import path from 'node:path'

const PROJECT_DIR = '/Users/utopia/UIUX-whole-project'
const QA05_DIR = path.join(PROJECT_DIR, 'docs/qa/ls-05')
const WS_DIR = process.env.GEMINI_WORKSPACE_DIR || '/tmp'
const PDF_DIR = path.join(PROJECT_DIR, 'deliverables/portfolio-pdf')
const VISUAL_PAGES_DIR = path.join(PDF_DIR, 'visual-pages')
const ASSETS_DIR = path.join(PDF_DIR, 'assets')

fs.mkdirSync(VISUAL_PAGES_DIR, { recursive: true })
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

    await context.route('http://pdf.local/**', async (route) => {
      const reqUrl = new URL(route.request().url())
      let relPath = decodeURIComponent(reqUrl.pathname)
      if (relPath === '/' || relPath === '') {
        relPath = '/portfolio-pdf-visual-source.html'
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
    await cropPage.goto('http://pdf.local/portfolio-pdf-visual-source.html', {
      waitUntil: 'domcontentloaded',
    })

    // Aspect-matched, unclipped top-left crops for Pages 06, 07, and 08
    const jobs = [
      {
        src: path.join(WS_DIR, 'ls04a_qa/01-desktop-gallery.png'),
        dest: 'ls-gallery-grid-crop.jpg',
        sx: 310, sy: 115, sw: 2260, sh: 1675, maxW: 1320, quality: 0.85,
      },
      {
        src: path.join(WS_DIR, 'ls04a_qa/03-expanded-memory-detail.png'),
        dest: 'ls-gallery-expanded-crop.jpg',
        sx: 310, sy: 115, sw: 2260, sh: 1625, maxW: 1320, quality: 0.85,
      },
      {
        src: path.join(WS_DIR, 'ls04b_qa/01-timeline-selection.png'),
        dest: 'ls-timeline-kyoto-crop.jpg',
        sx: 310, sy: 115, sw: 2260, sh: 1685, maxW: 1320, quality: 0.85,
      },
      {
        src: path.join(WS_DIR, 'ls04b_qa/02-map-selection.png'),
        dest: 'ls-timeline-chengdu-crop.jpg',
        sx: 310, sy: 115, sw: 2260, sh: 1685, maxW: 1320, quality: 0.85,
      },
      {
        src: path.join(WS_DIR, 'ls04c_qa/01-locked-initial-state.png'),
        dest: 'ls-private-locked-crop.jpg',
        sx: 330, sy: 410, sw: 2220, sh: 1350, maxW: 1280, quality: 0.85,
      },
      {
        src: path.join(QA05_DIR, '05-desktop-archive03-private-archive-1440x900.png'),
        dest: 'ls-private-unlocked-crop.jpg',
        sx: 330, sy: 475, sw: 2220, sh: 1315, maxW: 1280, quality: 0.85,
      },
      {
        src: path.join(WS_DIR, 'ls04d_qa/01-desktop-dark-archive-normal.png'),
        dest: 'ls-ds-dark-clean-crop.jpg',
        sx: 350, sy: 445, sw: 2180, sh: 1345, maxW: 1280, quality: 0.85,
      },
      {
        src: path.join(QA05_DIR, '07-desktop-archive04-paper-zh-1440x900.png'),
        dest: 'ls-ds-paper-clean-crop.jpg',
        sx: 350, sy: 445, sw: 2180, sh: 1345, maxW: 1280, quality: 0.85,
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

    // Open a fresh page to render the 8-page Visual PDF and page screenshots
    const page = await context.newPage()
    await page.goto('http://pdf.local/portfolio-pdf-visual-source.html', {
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
        'Broken images in Visual PDF source: ' + imageCheck.brokenImages.join(', ')
      )
    }

    // 1. Capture each of the 8 pages to PNG
    const pageEls = page.locator('.pdf-page')
    const pageCount = await pageEls.count()
    for (let i = 0; i < pageCount; i++) {
      const num = String(i + 1).padStart(2, '0')
      const el = pageEls.nth(i)
      await el.screenshot({
        path: path.join(VISUAL_PAGES_DIR, `page-${num}.png`),
      })
    }

    // 2. Generate Jianshuo_Liu_UIUX_Portfolio_Visual_CN.pdf
    const pdfOutPath = path.join(
      PDF_DIR,
      'Jianshuo_Liu_UIUX_Portfolio_Visual_CN.pdf'
    )
    await page.pdf({
      path: pdfOutPath,
      width: '1600px',
      height: '900px',
      printBackground: true,
      preferCSSPageSize: true,
      tagged: false,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    })

    // 3. Generate Portfolio_PDF_Visual_Contact_Sheet.png (2 columns × 4 rows)
    const sheetPage = await context.newPage()
    await sheetPage.setViewportSize({ width: 1720, height: 2060 })
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
            padding: 34px 44px 38px;
          }
          header {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            padding-bottom: 16px;
            margin-bottom: 22px;
            border-bottom: 1px solid rgba(232, 227, 216, 0.16);
          }
          h1 {
            font-size: 21px;
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
          <h1>Jianshuo_Liu_UIUX_Portfolio_Visual_CN.pdf — 8-Page Visual-First Contact Sheet (16:9)</h1>
          <span class="meta">IMAGES FIRST · 75–85% VISUAL RATIO · ZERO//LINE &amp; LOVESTORY · 2026</span>
        </header>
        <div class="grid">
          ${Array.from({ length: pageCount })
            .map((_, idx) => {
              const num = String(idx + 1).padStart(2, '0')
              const titles = [
                'PAGE 01 · COVER (封面与双代表作速览)',
                'PAGE 02 · ZERO//LINE: VISUAL IDENTITY (角色主导视觉识别)',
                'PAGE 03 · ZERO//LINE: INTERACTION (四帧拔刀转场与模块交互)',
                'PAGE 04 · LOVESTORY: PRODUCT EXPERIENCE (空间中枢与双端原生体验)',
                'PAGE 05 · LOVESTORY: UX DISCOVERY (Problem → Insight → Response)',
                'PAGE 06 · LOVESTORY: MEMORY GALLERY (Gallery Overview → Memory Detail)',
                'PAGE 07 · LOVESTORY: TIMELINE × MAP (Timeline ↔ Map ↔ Memory)',
                'PAGE 08 · PRIVACY, DESIGN SYSTEM & CONTACT (权限边界、双境主题与联系方式)',
              ]
              return `
                <div class="cell">
                  <div class="cell-bar">
                    <strong>${titles[idx]}</strong>
                    <span>1600 × 900 (16:9)</span>
                  </div>
                  <img src="http://pdf.local/visual-pages/page-${num}.png" alt="${titles[idx]}" />
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
      'Portfolio_PDF_Visual_Contact_Sheet.png'
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
