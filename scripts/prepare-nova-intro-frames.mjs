#!/usr/bin/env node
/**
 * Inspects, registers, and normalizes the 4 NOVA intro keyframe images in `public/zeroline/intro/`
 * into consistent 1024x1536 (2:3) .webp (q=0.92) and .png assets for `NovaIntroSequence.tsx`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');
const INTRO_DIR = path.join(PROJECT_DIR, 'public/zeroline/intro');

const REQUIRED_FRAMES = [
  { id: 'ready', baseName: 'nova-01-ready', label: 'FRAME 01 — READY' },
  { id: 'draw', baseName: 'nova-02-draw', label: 'FRAME 02 — DRAW' },
  { id: 'windup', baseName: 'nova-03-windup', label: 'FRAME 03 — WIND-UP' },
  { id: 'strike', baseName: 'nova-04-strike', label: 'FRAME 04 — STRIKE' },
];

function findSourceFile(baseName) {
  const exts = ['.webp', '.png', '.jpg', '.jpeg'];
  for (const ext of exts) {
    const candidate = path.join(INTRO_DIR, `${baseName}${ext}`);
    if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
      return candidate;
    }
  }
  return null;
}

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const wsDir = process.env.GEMINI_WORKSPACE_DIR || '/tmp';
    const fallbackPath = path.join(wsDir, 'pw-runner/node_modules/playwright/index.mjs');
    return await import(fallbackPath);
  }
}

async function normalizeToWebpIfNeeded(foundFrames) {
  let browser = null;
  try {
    const { chromium } = await loadPlaywright();
    browser = await chromium.launch({
      headless: true,
      args: ['--single-process', '--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
    });
    const page = await browser.newPage();

    for (const item of foundFrames) {
      const buf = fs.readFileSync(item.sourcePath);
      const ext = path.extname(item.sourcePath).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      const b64 = buf.toString('base64');

      const result = await page.evaluate(
        async ({ b64, mime }) => {
          const img = new Image();
          img.src = `data:${mime};base64,${b64}`;
          await new Promise((res, rej) => {
            img.onload = res;
            img.onerror = rej;
          });
          const targetW = 1024;
          const targetH = 1536;
          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          // Preserve aspect ratio with centered cover registration
          const scale = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight);
          const drawW = img.naturalWidth * scale;
          const drawH = img.naturalHeight * scale;
          const offsetX = (targetW - drawW) / 2;
          const offsetY = (targetH - drawH) / 2;
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
          const webpUrl = canvas.toDataURL('image/webp', 0.92);
          return {
            origW: img.naturalWidth,
            origH: img.naturalHeight,
            webpB64: webpUrl.replace(/^data:image\/webp;base64,/, ''),
          };
        },
        { b64, mime }
      );

      const outWebpPath = path.join(INTRO_DIR, `${item.baseName}.webp`);
      const outBuf = Buffer.from(result.webpB64, 'base64');
      fs.writeFileSync(outWebpPath, outBuf);
      item.origDims = `${result.origW}x${result.origH}`;
      item.normalizedDims = '1024x1536';
      item.webpBytes = outBuf.length;
    }
  } catch (err) {
    console.warn('Skipping headless WebP normalization:', err.message);
  } finally {
    if (browser) await browser.close();
  }
}

async function main() {
  fs.mkdirSync(INTRO_DIR, { recursive: true });
  const statusReport = [];

  for (const frame of REQUIRED_FRAMES) {
    const src = findSourceFile(frame.baseName);
    statusReport.push({
      ...frame,
      found: Boolean(src),
      sourcePath: src,
      sizeBytes: src ? fs.statSync(src).size : 0,
      origDims: '-',
      normalizedDims: '-',
      webpBytes: 0,
    });
  }

  const foundFrames = statusReport.filter((r) => r.found);
  if (foundFrames.length > 0) {
    await normalizeToWebpIfNeeded(foundFrames);
  }

  console.table(
    statusReport.map((r) => ({
      Frame: r.label,
      Found: r.found ? 'YES' : 'MISSING',
      File: r.sourcePath ? path.basename(r.sourcePath) : `${r.baseName}.webp`,
      OriginalDims: r.origDims,
      NormalizedDims: r.normalizedDims,
      WebpBytes: r.webpBytes || r.sizeBytes,
    }))
  );

  const missing = statusReport.filter((r) => !r.found);
  if (missing.length > 0) {
    console.log(
      `\n[ACTION REQUIRED] Missing ${missing.length} pose file(s) in public/zeroline/intro/:\n` +
        missing.map((m) => `  - public/zeroline/intro/${m.baseName}.webp (or .png / .jpg)`).join('\n')
    );
  } else {
    console.log('\n[READY] All 4 NOVA intro keyframes are registered and normalized in public/zeroline/intro/.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
