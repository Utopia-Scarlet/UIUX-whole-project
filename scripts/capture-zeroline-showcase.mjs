#!/usr/bin/env node
/**
 * Automated 1440x900 Screenshot Capture & Verification for ZERO//LINE Showcase (Chapter 09)
 * Captures https://utopia-scarlet.github.io/ZERO-LINE/ across HOME, NEWS, HEROES, STORE, ABOUT
 * and saves .webp + .png assets to public/zeroline/showcase/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');
const SHOWCASE_DIR = path.join(PROJECT_DIR, 'public/zeroline/showcase');
const TARGET_URL = 'https://utopia-scarlet.github.io/ZERO-LINE/';

fs.mkdirSync(SHOWCASE_DIR, { recursive: true });

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const wsDir = process.env.GEMINI_WORKSPACE_DIR || '/tmp';
    const fallbackPath = path.join(wsDir, 'pw-runner/node_modules/playwright/index.mjs');
    return await import(fallbackPath);
  }
}

async function launchBrowser(chromium) {
  const systemPaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ];
  for (const executablePath of systemPaths) {
    if (fs.existsSync(executablePath)) {
      try {
        return await chromium.launch({
          executablePath,
          headless: true,
          args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
        });
      } catch {}
    }
  }
  return await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  });
}

async function savePngAndWebp(converterPage, baseName, pngBuffer) {
  const pngPath = path.join(SHOWCASE_DIR, `${baseName}.png`);
  const webpPath = path.join(SHOWCASE_DIR, `${baseName}.webp`);
  fs.writeFileSync(pngPath, pngBuffer);

  const pngBase64 = pngBuffer.toString('base64');
  const info = await converterPage.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL('image/webp', 0.92);
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      webpBase64: dataUrl.replace(/^data:image\/webp;base64,/, ''),
    };
  }, pngBase64);

  const webpBuffer = Buffer.from(info.webpBase64, 'base64');
  fs.writeFileSync(webpPath, webpBuffer);
  console.log(`[SAVED] ${baseName}.webp (${webpBuffer.length} B, ${info.width}x${info.height}) & ${baseName}.png (${pngBuffer.length} B)`);
}

async function main() {
  const { chromium } = await loadPlaywright();
  const browser = await launchBrowser(chromium);
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    const converterPage = await context.newPage();
    await converterPage.setContent('<!doctype html><html><body></body></html>');

    console.log(`Loading ${TARGET_URL} at 1440x900...`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1500);

    await page.evaluate(async () => {
      const totalHeight = document.documentElement.scrollHeight;
      for (let y = 0; y <= totalHeight; y += 350) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
      const imgs = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        imgs.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((res) => {
            img.addEventListener('load', res, { once: true });
            img.addEventListener('error', res, { once: true });
            setTimeout(res, 3000);
          });
        })
      );
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    });
    await page.waitForTimeout(1000);

    async function scrollToSectionAndCapture(sectionKey, candidates, baseFileName) {
      await page.evaluate(({ sectionKey, candidates }) => {
        if (sectionKey === 'home') {
          window.scrollTo({ top: 0, behavior: 'instant' });
          return;
        }
        const headerEl = document.querySelector('header, nav');
        const headerHeight = headerEl && getComputedStyle(headerEl).position !== 'static'
          ? headerEl.getBoundingClientRect().height
          : 0;

        let targetEl = null;
        for (const id of candidates.ids) {
          const el = document.getElementById(id) || document.querySelector(`section.${id}, .${id}-section`);
          if (el && el.getBoundingClientRect().height > 150) {
            targetEl = el;
            break;
          }
        }
        if (!targetEl) {
          const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
          for (const h of headings) {
            const text = (h.innerText || '').trim().toLowerCase();
            if (candidates.headings.some((kw) => text.includes(kw.toLowerCase()))) {
              targetEl = h.closest('section') || h.parentElement?.parentElement || h;
              break;
            }
          }
        }
        if (!targetEl) return;

        const rect = targetEl.getBoundingClientRect();
        const absTop = rect.top + window.scrollY;
        const height = rect.height;
        const viewportH = window.innerHeight;
        const innerHeadings = Array.from(targetEl.querySelectorAll('h1, h2, h3'));
        const firstHeadingTop = innerHeadings.length > 0
          ? innerHeadings[0].getBoundingClientRect().top + window.scrollY
          : absTop;

        let desiredY = Math.max(0, firstHeadingTop - Math.max(headerHeight + 28, 84));
        if (height <= viewportH - headerHeight) {
          const extraSpace = viewportH - headerHeight - height;
          desiredY = Math.max(0, absTop - headerHeight - Math.round(extraSpace / 2));
        }
        window.scrollTo({ top: desiredY, behavior: 'instant' });
      }, { sectionKey, candidates });

      await page.waitForTimeout(700);
      const buf = await page.screenshot({ type: 'png', fullPage: false });
      await savePngAndWebp(converterPage, baseFileName, buf);
    }

    await scrollToSectionAndCapture('home', { ids: ['home', 'hero'], headings: ['zero//line', 'start game'] }, 'zeroline-home');
    await scrollToSectionAndCapture('news', { ids: ['news', 'updates', 'season'], headings: ['season update', 'news'] }, 'zeroline-news');
    await scrollToSectionAndCapture('heroes', { ids: ['heroes', 'agents', 'roster', 'characters'], headings: ['heroes', 'nova'] }, 'zeroline-heroes');

    async function clickHeroIfAvailable(heroName) {
      return await page.evaluate((name) => {
        const upper = name.toUpperCase();
        const lower = name.toLowerCase();
        const byData = document.querySelector(`[data-hero="${lower}" i], [data-character="${lower}" i], [data-id="${lower}" i]`);
        if (byData) {
          byData.click();
          return true;
        }
        const candidates = Array.from(document.querySelectorAll('button, [role="tab"], a, .hero-btn, .char-btn, .tab, .roster-item, .character-item, div, span'));
        for (const el of candidates) {
          const txt = (el.innerText || '').trim().toUpperCase();
          const style = window.getComputedStyle(el);
          if ((txt === upper || txt.startsWith(upper + '\n')) && (el.tagName === 'BUTTON' || style.cursor === 'pointer')) {
            el.click();
            return true;
          }
        }
        return false;
      }, heroName);
    }

    if (await clickHeroIfAvailable('NOVA')) {
      await page.waitForTimeout(700);
      await savePngAndWebp(converterPage, 'zeroline-heroes', await page.screenshot({ type: 'png' }));
    }
    if (await clickHeroIfAvailable('VESPER')) {
      await page.waitForTimeout(700);
      await savePngAndWebp(converterPage, 'zeroline-heroes-vesper', await page.screenshot({ type: 'png' }));
    }
    if (await clickHeroIfAvailable('RONIN')) {
      await page.waitForTimeout(700);
      await savePngAndWebp(converterPage, 'zeroline-heroes-ronin', await page.screenshot({ type: 'png' }));
    }
    await clickHeroIfAvailable('NOVA');
    await page.waitForTimeout(400);

    await scrollToSectionAndCapture('store', { ids: ['store', 'shop'], headings: ['store', 'buy game', 'game credits', 'item store'] }, 'zeroline-store');
    await scrollToSectionAndCapture('about', { ids: ['about', 'world', 'story', 'lore'], headings: ['the 2037 collapse', '2037', 'about'] }, 'zeroline-about');

    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
