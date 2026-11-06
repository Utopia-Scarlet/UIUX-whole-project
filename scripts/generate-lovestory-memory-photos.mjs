#!/usr/bin/env node
/**
 * LS-04A — Generate privacy-safe, authentic demonstration memory photographs
 * (.webp and .png) under public/lovestory/case-study/memories/
 * matching the 6 demonstration memories in LoveStory's Moments gallery & Timeline.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');
const MEMORIES_DIR = path.join(PROJECT_DIR, 'public/lovestory/case-study/memories');
const WS_DIR = process.env.GEMINI_WORKSPACE_DIR || '/tmp';

fs.mkdirSync(MEMORIES_DIR, { recursive: true });

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const fallbackPath = path.join(WS_DIR, 'pw-runner/node_modules/playwright/index.mjs');
    return await import(fallbackPath);
  }
}

const MEMORY_SCENES = [
  {
    baseName: 'mem-01-brisbane-riverwalk',
    width: 1500,
    height: 1000, // 3:2 natural 35mm landscape
    skyTop: '#161D26',
    skyMid: '#2D3A47',
    skyBot: '#C89B6E',
    waterTop: '#202830',
    waterBot: '#101316',
    sunColor: '#EBC999',
    accent: '#C8AD75',
    kind: 'bridge',
  },
  {
    baseName: 'mem-02-brisbane-botanic',
    width: 1200,
    height: 900, // 4:3 medium-format archival print
    skyTop: '#19231E',
    skyMid: '#2F4339',
    skyBot: '#94AC92',
    waterTop: '#1A241F',
    waterBot: '#0F1411',
    sunColor: '#E3CD9F',
    accent: '#B79A62',
    kind: 'dome',
  },
  {
    baseName: 'mem-03-kyoto-lanterns',
    width: 1200,
    height: 900, // 4:3 twilight print
    skyTop: '#171216',
    skyMid: '#322328',
    skyBot: '#A46F55',
    waterTop: '#1D1618',
    waterBot: '#100D0F',
    sunColor: '#E8BC7E',
    accent: '#C8AD75',
    kind: 'pagoda',
  },
  {
    baseName: 'mem-04-melbourne-arcade',
    width: 1280,
    height: 854, // 3:2 heritage interior
    skyTop: '#1A1714',
    skyMid: '#382F27',
    skyBot: '#BA966B',
    waterTop: '#221D19',
    waterBot: '#12100E',
    sunColor: '#E9CA9F',
    accent: '#C8AD75',
    kind: 'arch',
  },
  {
    baseName: 'mem-05-chengdu-teahouse',
    width: 1280,
    height: 854, // 3:2 courtyard mist
    skyTop: '#181C1B',
    skyMid: '#2C3633',
    skyBot: '#809088',
    waterTop: '#191F1D',
    waterBot: '#0F1211',
    sunColor: '#D8BD90',
    accent: '#B79A62',
    kind: 'pavilion',
  },
  {
    baseName: 'mem-06-hulunbeier-steppe',
    width: 1440,
    height: 900, // 16:10 wide horizon
    skyTop: '#1A222D',
    skyMid: '#3B5164',
    skyBot: '#DAB582',
    waterTop: '#384531',
    waterBot: '#1B2217',
    sunColor: '#F2D8A4',
    accent: '#C8AD75',
    kind: 'hills',
  },
];

function buildScenicSvg(s) {
  const w = s.width;
  const h = s.height;
  const horizonY = Math.round(h * 0.675);
  const waterH = h - horizonY;
  const sunCx = Math.round(w * 0.52);
  const sunCy = Math.round(h * 0.485);
  const sunR = Math.round(Math.min(w, h) * 0.068);
  const glowR = Math.round(Math.min(w, h) * 0.44);

  let foregroundMarkup = '';
  if (s.kind === 'bridge') {
    foregroundMarkup = `
      <svg viewBox="0 0 1200 800" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
        <path d="M0 540 L1200 540 L1200 565 L0 565 Z" fill="#16191C" opacity="0.94"/>
        <path d="M180 545 L280 295 L380 545 M680 545 L780 265 L880 545" stroke="#16191C" stroke-width="15" fill="none" stroke-linejoin="round"/>
        <line x1="280" y1="295" x2="120" y2="540" stroke="${s.accent}" stroke-width="1.4" opacity="0.42"/>
        <line x1="280" y1="295" x2="460" y2="540" stroke="${s.accent}" stroke-width="1.4" opacity="0.42"/>
        <line x1="780" y1="265" x2="600" y2="540" stroke="${s.accent}" stroke-width="1.4" opacity="0.42"/>
        <line x1="780" y1="265" x2="960" y2="540" stroke="${s.accent}" stroke-width="1.4" opacity="0.42"/>
        <path d="M0 540 Q280 330 530 540 T1200 520" stroke="${s.accent}" stroke-width="2.6" fill="none" opacity="0.72"/>
        <g opacity="0.62">
          <rect x="262" y="578" width="52" height="5" rx="2.5" fill="${s.sunColor}"/>
          <rect x="752" y="588" width="66" height="5" rx="2.5" fill="${s.sunColor}"/>
          <rect x="505" y="614" width="96" height="4" rx="2" fill="${s.sunColor}" opacity="0.65"/>
          <rect x="560" y="646" width="64" height="3" rx="1.5" fill="${s.sunColor}" opacity="0.4"/>
        </g>
      </svg>
    `;
  } else if (s.kind === 'dome') {
    foregroundMarkup = `
      <svg viewBox="0 0 1200 800" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
        <path d="M160 560 C160 310 450 210 600 210 C750 210 1040 310 1040 560 Z" fill="rgba(227,205,159,0.05)" stroke="${s.sunColor}" stroke-width="3" opacity="0.68"/>
        <path d="M260 560 C260 355 480 272 600 272 C720 272 940 355 940 560" fill="none" stroke="${s.accent}" stroke-width="1.8" opacity="0.5"/>
        <path d="M360 560 C360 400 500 335 600 335 C700 335 840 400 840 560" fill="none" stroke="${s.accent}" stroke-width="1.3" opacity="0.36"/>
        <line x1="600" y1="210" x2="600" y2="560" stroke="${s.sunColor}" stroke-width="2" opacity="0.42"/>
        <line x1="420" y1="258" x2="420" y2="560" stroke="${s.sunColor}" stroke-width="1.5" opacity="0.35"/>
        <line x1="780" y1="258" x2="780" y2="560" stroke="${s.sunColor}" stroke-width="1.5" opacity="0.35"/>
        <path d="M0 560 C250 508 420 534 620 554 C820 534 1010 508 1200 560 L1200 800 L0 800 Z" fill="#131B16"/>
      </svg>
    `;
  } else if (s.kind === 'pagoda') {
    foregroundMarkup = `
      <svg viewBox="0 0 1200 800" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
        <path d="M0 580 L460 455 L740 455 L1200 580 L1200 800 L0 800 Z" fill="#151113"/>
        <path d="M470 455 L340 800 M730 455 L860 800" stroke="${s.accent}" stroke-width="2.2" opacity="0.48"/>
        <line x1="448" y1="515" x2="752" y2="515" stroke="${s.accent}" stroke-width="1.4" opacity="0.32"/>
        <line x1="418" y1="585" x2="782" y2="585" stroke="${s.accent}" stroke-width="1.6" opacity="0.36"/>
        <line x1="382" y1="670" x2="818" y2="670" stroke="${s.accent}" stroke-width="1.8" opacity="0.4"/>
        <circle cx="385" cy="432" r="15" fill="${s.sunColor}" opacity="0.92"/>
        <circle cx="815" cy="432" r="15" fill="${s.sunColor}" opacity="0.92"/>
        <circle cx="462" cy="392" r="10" fill="${s.sunColor}" opacity="0.7"/>
        <circle cx="738" cy="392" r="10" fill="${s.sunColor}" opacity="0.7"/>
      </svg>
    `;
  } else if (s.kind === 'pavilion') {
    foregroundMarkup = `
      <svg viewBox="0 0 1200 800" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
        <path d="M250 385 Q600 312 950 385 L885 414 Q600 350 315 414 Z" fill="#1A201E" stroke="${s.accent}" stroke-width="2.2" opacity="0.84"/>
        <line x1="358" y1="408" x2="358" y2="625" stroke="#1A201E" stroke-width="15"/>
        <line x1="842" y1="408" x2="842" y2="625" stroke="#1A201E" stroke-width="15"/>
        <ellipse cx="600" cy="652" rx="350" ry="38" fill="none" stroke="${s.sunColor}" stroke-width="1.6" opacity="0.48"/>
        <ellipse cx="600" cy="652" rx="195" ry="19" fill="none" stroke="${s.sunColor}" stroke-width="1.2" opacity="0.38"/>
        <ellipse cx="600" cy="652" rx="82" ry="8" fill="none" stroke="${s.sunColor}" stroke-width="1" opacity="0.3"/>
      </svg>
    `;
  } else if (s.kind === 'hills') {
    foregroundMarkup = `
      <svg viewBox="0 0 1200 800" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
        <path d="M0 515 Q320 405 660 492 T1200 455 L1200 800 L0 800 Z" fill="#283222" opacity="0.92"/>
        <path d="M0 588 Q420 508 820 572 T1200 552 L1200 800 L0 800 Z" fill="#192015"/>
        <path d="M175 785 C375 645 520 605 685 512" fill="none" stroke="${s.sunColor}" stroke-width="4.5" opacity="0.62"/>
        <path d="M235 795 C425 665 555 622 702 522" fill="none" stroke="${s.accent}" stroke-width="1.8" opacity="0.38"/>
      </svg>
    `;
  } else {
    foregroundMarkup = `
      <svg viewBox="0 0 1200 800" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
        <path d="M235 685 L235 335 A365 265 0 0 1 965 335 L965 685" fill="rgba(233,202,159,0.04)" stroke="${s.sunColor}" stroke-width="4" opacity="0.7"/>
        <path d="M318 685 L318 358 A282 202 0 0 1 882 358 L882 685" fill="none" stroke="${s.accent}" stroke-width="2" opacity="0.48"/>
        <line x1="600" y1="135" x2="600" y2="685" stroke="${s.sunColor}" stroke-width="1.8" opacity="0.34"/>
        <line x1="235" y1="510" x2="965" y2="510" stroke="${s.accent}" stroke-width="1.4" opacity="0.28"/>
      </svg>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${s.skyTop}"/>
        <stop offset="56%" stop-color="${s.skyMid}"/>
        <stop offset="100%" stop-color="${s.skyBot}"/>
      </linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${s.waterTop}"/>
        <stop offset="100%" stop-color="${s.waterBot}"/>
      </linearGradient>
      <radialGradient id="glow" cx="52%" cy="48%" r="45%">
        <stop offset="0%" stop-color="${s.sunColor}" stop-opacity="0.58"/>
        <stop offset="58%" stop-color="${s.sunColor}" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="${s.sunColor}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${horizonY + 12}" fill="url(#sky)"/>
    <rect y="${horizonY}" width="${w}" height="${waterH}" fill="url(#water)"/>
    <circle cx="${sunCx}" cy="${sunCy}" r="${glowR}" fill="url(#glow)"/>
    <circle cx="${sunCx}" cy="${sunCy}" r="${sunR}" fill="${s.sunColor}" opacity="0.82"/>
    ${foregroundMarkup}
    <rect x="28" y="28" width="${w - 56}" height="${h - 56}" fill="none" stroke="rgba(232,227,216,0.16)" stroke-width="1.5"/>
  </svg>`;
}

async function main() {
  const { chromium } = await loadPlaywright();
  const execPath = path.join(
    WS_DIR,
    'pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'
  );
  const browser = await chromium.launch({
    executablePath: fs.existsSync(execPath) ? execPath : undefined,
    headless: true,
    args: ['--single-process', '--no-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    for (const scene of MEMORY_SCENES) {
      await page.setViewportSize({ width: scene.width, height: scene.height });
      const svgMarkup = buildScenicSvg(scene);
      await page.setContent(
        `<!doctype html><html><body style="margin:0;padding:0;overflow:hidden;background:#10110F;">${svgMarkup}</body></html>`
      );
      const pngBuffer = await page.screenshot({ type: 'png' });
      const pngPath = path.join(MEMORIES_DIR, `${scene.baseName}.png`);
      const webpPath = path.join(MEMORIES_DIR, `${scene.baseName}.webp`);
      fs.writeFileSync(pngPath, pngBuffer);

      const pngBase64 = pngBuffer.toString('base64');
      const webpBase64 = await page.evaluate(async (b64) => {
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
        return canvas.toDataURL('image/webp', 0.92).replace(/^data:image\/webp;base64,/, '');
      }, pngBase64);

      fs.writeFileSync(webpPath, Buffer.from(webpBase64, 'base64'));
      console.log(`[SAVED] memories/${scene.baseName}.webp & .png (${scene.width}×${scene.height})`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
