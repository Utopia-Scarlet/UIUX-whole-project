#!/usr/bin/env node
/**
 * LS-03B — Reusable Playwright Visual Evidence Capture for LoveStory
 *
 * Renders the authentic LoveStory static frontend (mirrored from the live
 * deployment https://love-story-archive-production.up.railway.app) inside
 * Playwright at 1440×900 (desktop) and 390×844 (mobile) with deviceScaleFactor: 2.
 *
 * Strictly privacy-safe: uses non-sensitive architectural/landscape demonstration
 * fixtures (zero personal photographs, zero private user account data, zero
 * private archive contents exposed) and saves both .webp and .png assets into:
 *   public/lovestory/case-study/{index,requirements,architecture,experience,design-system,iterations}/
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');
const CASE_STUDY_DIR = path.join(PROJECT_DIR, 'public/lovestory/case-study');
const WS_DIR = process.env.GEMINI_WORKSPACE_DIR || '/tmp';
const MIRROR_DIR = path.join(WS_DIR, 'lovestory_static_mirror');
const CACHE_JSON_PATH = path.join(WS_DIR, 'lovestory_live_cache/lovestory-network-cache.json');

const SUBDIRS = [
  'index',
  'requirements',
  'architecture',
  'experience',
  'design-system',
  'iterations',
];

for (const sub of SUBDIRS) {
  fs.mkdirSync(path.join(CASE_STUDY_DIR, sub), { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

/**
 * Rich, non-sensitive architectural & landscape SVG compositions so every
 * photograph mount in Moments, Hub, Timeline, and Memory Map looks like a
 * genuine warm archival landscape photograph without exposing any personal photos.
 */
function buildScenicSvg(sceneKey) {
  const scenes = {
    'brisbane-riverwalk': {
      skyTop: '#1A2129',
      skyMid: '#34414E',
      skyBot: '#C89B6E',
      waterTop: '#232B33',
      waterBot: '#121518',
      sunColor: '#E8C594',
      accent: '#C8AD75',
      label: 'BRISBANE RIVERWALK · DUSK ARCHITECTURE',
      kind: 'bridge',
    },
    'brisbane-botanic': {
      skyTop: '#1D2622',
      skyMid: '#33463D',
      skyBot: '#8FA68E',
      waterTop: '#1E2823',
      waterBot: '#111613',
      sunColor: '#DFC99B',
      accent: '#B79A62',
      label: 'CITY BOTANIC CONSERVATORY · AFTERNOON CANOPY',
      kind: 'dome',
    },
    'kyoto-lanterns': {
      skyTop: '#181417',
      skyMid: '#312428',
      skyBot: '#9E6B52',
      waterTop: '#1F181A',
      waterBot: '#110E10',
      sunColor: '#E5B879',
      accent: '#C8AD75',
      label: 'HIGASHIYAMA STONE PATH · EVENING LANTERNS',
      kind: 'pagoda',
    },
    'chengdu-teahouse': {
      skyTop: '#1B1F1E',
      skyMid: '#2E3835',
      skyBot: '#7B8A82',
      waterTop: '#1C2220',
      waterBot: '#111413',
      sunColor: '#D4B98C',
      accent: '#B79A62',
      label: 'COURTYARD PAVILION · BAMBOO & RAIN MIST',
      kind: 'pavilion',
    },
    'hulunbeier-steppe': {
      skyTop: '#1D2530',
      skyMid: '#3E5467',
      skyBot: '#D6B17E',
      waterTop: '#3B4834',
      waterBot: '#1E251A',
      sunColor: '#F0D5A0',
      accent: '#C8AD75',
      label: 'HULUNBEIER HIGHLAND MEADOW · GOLDEN HORIZON',
      kind: 'hills',
    },
    'melbourne-arcade': {
      skyTop: '#1D1A17',
      skyMid: '#3A322A',
      skyBot: '#B69268',
      waterTop: '#241F1B',
      waterBot: '#141210',
      sunColor: '#E6C79C',
      accent: '#C8AD75',
      label: 'ROYAL ARCADE GLASS VAULT · ESPRESSO LIGHT',
      kind: 'arch',
    },
  };

  const s = scenes[sceneKey] || scenes['brisbane-riverwalk'];

  let foregroundMarkup = '';
  if (s.kind === 'bridge') {
    foregroundMarkup = `
      <path d="M0 540 L1200 540 L1200 565 L0 565 Z" fill="#181B1E" opacity="0.92"/>
      <path d="M180 545 L280 310 L380 545 M680 545 L780 280 L880 545" stroke="#181B1E" stroke-width="14" fill="none"/>
      <path d="M0 540 Q280 330 530 540 T1200 520" stroke="${s.accent}" stroke-width="2.5" fill="none" opacity="0.65"/>
      <g opacity="0.55">
        <rect x="265" y="575" width="45" height="6" rx="3" fill="${s.sunColor}"/>
        <rect x="755" y="585" width="60" height="6" rx="3" fill="${s.sunColor}"/>
        <rect x="510" y="610" width="90" height="5" rx="2.5" fill="${s.sunColor}" opacity="0.6"/>
      </g>
    `;
  } else if (s.kind === 'dome') {
    foregroundMarkup = `
      <path d="M160 560 C160 320 460 220 600 220 C740 220 1040 320 1040 560 Z" fill="none" stroke="${s.sunColor}" stroke-width="3" opacity="0.62"/>
      <path d="M260 560 C260 360 480 280 600 280 C720 280 940 360 940 560" fill="none" stroke="${s.accent}" stroke-width="1.8" opacity="0.45"/>
      <line x1="600" y1="220" x2="600" y2="560" stroke="${s.sunColor}" stroke-width="2" opacity="0.4"/>
      <line x1="420" y1="265" x2="420" y2="560" stroke="${s.sunColor}" stroke-width="1.5" opacity="0.35"/>
      <line x1="780" y1="265" x2="780" y2="560" stroke="${s.sunColor}" stroke-width="1.5" opacity="0.35"/>
      <path d="M0 560 C250 510 420 535 620 555 C820 535 1010 510 1200 560 L1200 800 L0 800 Z" fill="#141C17"/>
    `;
  } else if (s.kind === 'pagoda') {
    foregroundMarkup = `
      <path d="M0 580 L460 460 L740 460 L1200 580 L1200 800 L0 800 Z" fill="#161214"/>
      <path d="M470 460 L600 800 M730 460 L600 800" stroke="${s.accent}" stroke-width="2" opacity="0.4"/>
      <circle cx="390" cy="435" r="14" fill="${s.sunColor}" opacity="0.88"/>
      <circle cx="810" cy="435" r="14" fill="${s.sunColor}" opacity="0.88"/>
      <circle cx="465" cy="395" r="9" fill="${s.sunColor}" opacity="0.65"/>
      <circle cx="735" cy="395" r="9" fill="${s.sunColor}" opacity="0.65"/>
    `;
  } else if (s.kind === 'pavilion') {
    foregroundMarkup = `
      <path d="M260 390 Q600 320 940 390 L880 415 Q600 355 320 415 Z" fill="#1C2220" stroke="${s.accent}" stroke-width="2" opacity="0.78"/>
      <line x1="360" y1="410" x2="360" y2="620" stroke="#1C2220" stroke-width="14"/>
      <line x1="840" y1="410" x2="840" y2="620" stroke="#1C2220" stroke-width="14"/>
      <ellipse cx="600" cy="650" rx="340" ry="36" fill="none" stroke="${s.sunColor}" stroke-width="1.5" opacity="0.45"/>
      <ellipse cx="600" cy="650" rx="190" ry="18" fill="none" stroke="${s.sunColor}" stroke-width="1.2" opacity="0.35"/>
    `;
  } else if (s.kind === 'hills') {
    foregroundMarkup = `
      <path d="M0 520 Q320 410 660 495 T1200 460 L1200 800 L0 800 Z" fill="#2A3424" opacity="0.9"/>
      <path d="M0 590 Q420 510 820 575 T1200 555 L1200 800 L0 800 Z" fill="#1B2217"/>
      <path d="M180 780 C380 650 520 610 680 515" fill="none" stroke="${s.sunColor}" stroke-width="4" opacity="0.55"/>
    `;
  } else {
    foregroundMarkup = `
      <path d="M240 680 L240 340 A360 260 0 0 1 960 340 L960 680" fill="none" stroke="${s.sunColor}" stroke-width="4" opacity="0.65"/>
      <path d="M320 680 L320 360 A280 200 0 0 1 880 360 L880 680" fill="none" stroke="${s.accent}" stroke-width="2" opacity="0.45"/>
      <line x1="600" y1="140" x2="600" y2="680" stroke="${s.sunColor}" stroke-width="1.8" opacity="0.3"/>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
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
      <radialGradient id="glow" cx="52%" cy="48%" r="42%">
        <stop offset="0%" stop-color="${s.sunColor}" stop-opacity="0.55"/>
        <stop offset="60%" stop-color="${s.sunColor}" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="${s.sunColor}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="550" fill="url(#sky)"/>
    <rect y="540" width="1200" height="260" fill="url(#water)"/>
    <circle cx="624" cy="390" r="340" fill="url(#glow)"/>
    <circle cx="624" cy="390" r="54" fill="${s.sunColor}" opacity="0.78"/>
    ${foregroundMarkup}
    <rect x="36" y="36" width="1128" height="728" fill="none" stroke="rgba(232,227,216,0.16)" stroke-width="1.5"/>
  </svg>`;
}

/**
 * Curated, non-sensitive demonstration data matching the exact schema of LoveStory's FastAPI backend
 */
const DEMO_MEMORIES_RAW = [
  {
    id: 101,
    date: '2026-09-18',
    time: '18:20',
    title: 'Riverwalk Evening Walk',
    description:
      'Walked along the Brisbane River boardwalk as the city bridge lights reflected across the water. Recorded as a shared milestone in Our Story.',
    location: {
      country: 'Australia',
      city: 'Brisbane',
      placeName: 'New Farm Riverwalk, Brisbane',
      latitude: -27.4698,
      longitude: 153.0251,
    },
    weather: { condition: 'Clear', temperature: 22 },
    mood: 'Peaceful',
    tags: ['Brisbane', 'Riverwalk', 'Evening'],
    collections: ['Everyday', 'Travel'],
    momentType: 'important',
    favorite: true,
    showOnTimeline: true,
    privacyMode: 'standard',
    createdBy: { displayName: 'Jianshuo' },
    createdAt: '2026-09-18T08:30:00Z',
    photos: [
      { id: 1, url: '/uploads/demo-brisbane-riverwalk.svg', order: 0, isCover: true },
      { id: 2, url: '/uploads/demo-brisbane-botanic.svg', order: 1, isCover: false },
    ],
  },
  {
    id: 102,
    date: '2026-08-24',
    time: '15:10',
    title: 'Botanic Glasshouse Conservatory',
    description:
      'Afternoon light filtering through the tropical dome and stone pathways after a warm shower.',
    location: {
      country: 'Australia',
      city: 'Brisbane',
      placeName: 'City Botanic Gardens',
      latitude: -27.4756,
      longitude: 153.0301,
    },
    weather: { condition: 'Sunny', temperature: 24 },
    mood: 'Happy',
    tags: ['Conservatory', 'Botanic', 'Light'],
    collections: ['Everyday'],
    momentType: 'happy',
    favorite: true,
    showOnTimeline: true,
    privacyMode: 'standard',
    createdBy: { displayName: 'Partner' },
    createdAt: '2026-08-24T05:15:00Z',
    photos: [
      { id: 3, url: '/uploads/demo-brisbane-botanic.svg', order: 0, isCover: true },
    ],
  },
  {
    id: 103,
    date: '2026-05-12',
    time: '19:05',
    title: 'Higashiyama Lantern Steps',
    description:
      'Quiet stone alleys lit by warm paper lanterns at twilight, preserved with exact coordinates for the Memory Map.',
    location: {
      country: 'Japan',
      city: 'Kyoto',
      placeName: 'Higashiyama Ward, Kyoto',
      latitude: 34.9977,
      longitude: 135.7812,
    },
    weather: { condition: 'Cloudy', temperature: 18 },
    mood: 'Grateful',
    tags: ['Kyoto', 'Lanterns', 'Spring'],
    collections: ['Travel'],
    momentType: 'trip',
    favorite: true,
    showOnTimeline: true,
    privacyMode: 'standard',
    createdBy: { displayName: 'Jianshuo' },
    createdAt: '2026-05-12T10:15:00Z',
    photos: [
      { id: 4, url: '/uploads/demo-kyoto-lanterns.svg', order: 0, isCover: true },
    ],
  },
  {
    id: 104,
    date: '2026-02-09',
    time: '14:40',
    title: 'Royal Arcade Espresso Pause',
    description:
      'Sheltering from a sudden Melbourne shower beneath the heritage glass vault.',
    location: {
      country: 'Australia',
      city: 'Melbourne',
      placeName: 'Royal Arcade, Melbourne',
      latitude: -37.8146,
      longitude: 144.9642,
    },
    weather: { condition: 'Rainy', temperature: 17 },
    mood: 'Warm',
    tags: ['Melbourne', 'Arcade', 'Coffee'],
    collections: ['Travel'],
    momentType: 'everyday',
    favorite: false,
    showOnTimeline: false,
    privacyMode: 'standard',
    createdBy: { displayName: 'Partner' },
    createdAt: '2026-02-09T04:40:00Z',
    photos: [
      { id: 5, url: '/uploads/demo-melbourne-arcade.svg', order: 0, isCover: true },
    ],
  },
  {
    id: 105,
    date: '2025-11-03',
    time: '16:30',
    title: 'Bamboo Courtyard Tea House',
    description:
      'Listening to rain on clay tiles over jasmine tea in Chengdu — our first shared travel album entry.',
    location: {
      country: 'China',
      city: 'Chengdu',
      placeName: 'Kuanzhai Alley, Chengdu',
      latitude: 30.6698,
      longitude: 104.0531,
    },
    weather: { condition: 'Breezy', temperature: 16 },
    mood: 'Peaceful',
    tags: ['Chengdu', 'Tea', 'Autumn'],
    collections: ['Travel', 'Firsts'],
    momentType: 'first',
    favorite: true,
    showOnTimeline: true,
    privacyMode: 'standard',
    createdBy: { displayName: 'Jianshuo' },
    createdAt: '2025-11-03T08:30:00Z',
    photos: [
      { id: 6, url: '/uploads/demo-chengdu-teahouse.svg', order: 0, isCover: true },
    ],
  },
  {
    id: 106,
    date: '2025-08-19',
    time: '17:45',
    title: 'Hulunbeier Highland Horizon',
    description:
      'Endless golden grassland meeting the late-summer sky across the northern plateau.',
    location: {
      country: 'China',
      city: 'Hulunbeier',
      placeName: 'Morigele River Valley',
      latitude: 49.2153,
      longitude: 119.7581,
    },
    weather: { condition: 'Sunny', temperature: 21 },
    mood: 'Excited',
    tags: ['Hulunbeier', 'Grassland', 'Summer'],
    collections: ['Travel'],
    momentType: 'trip',
    favorite: true,
    showOnTimeline: true,
    privacyMode: 'standard',
    createdBy: { displayName: 'Partner' },
    createdAt: '2025-08-19T09:45:00Z',
    photos: [
      { id: 7, url: '/uploads/demo-hulunbeier-steppe.svg', order: 0, isCover: true },
    ],
  },
];

const DEMO_PLANS_RAW = [
  {
    id: 201,
    title: 'South Island Autumn Roadtrip',
    location: 'Queenstown & Lake Tekapo, New Zealand',
    description:
      'A five-day self-drive route through alpine lakes, stargazing reserves, and quietfjord lookouts.',
    startDate: '2027-04-12',
    endDate: '2027-04-16',
    duration: 5,
    status: 'upcoming',
    transportation: 'Direct flight BNE → ZQN · Compact SUV rental',
    accommodation: 'Lakeside timber cabin in Tekapo & Queenstown hill studio',
    notes: 'Pack tripod for Mount John Observatory night sky session.',
    days: [
      {
        dayNumber: 1,
        date: '2027-04-12',
        activities: [
          { id: 1, text: 'Arrive in Queenstown & sunset walk along Lake Wakatipu' },
          { id: 2, text: 'Dinner by the old steamer wharf' },
        ],
      },
      {
        dayNumber: 2,
        date: '2027-04-13',
        activities: [
          { id: 3, text: 'Morning drive through Lindis Pass to Lake Pukaki' },
          { id: 4, text: 'Evening stargazing at Dark Sky Reserve' },
        ],
      },
      {
        dayNumber: 3,
        date: '2027-04-14',
        activities: [
          { id: 5, text: 'Hooker Valley track morning hike & glacier lookout' },
        ],
      },
    ],
    createdBy: { displayName: 'Jianshuo' },
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 202,
    title: 'Tasmania East Coast Weekend',
    location: 'Hobart & Freycinet, Australia',
    description:
      'Coastal walks, Salamanca Market morning, and Wineglass Bay lookout trail.',
    startDate: '2027-01-22',
    endDate: '2027-01-25',
    duration: 4,
    status: 'upcoming',
    transportation: 'Flight BNE → HBA',
    accommodation: 'Harbourside loft in Battery Point',
    notes: 'Reserve ferry to MONA for Saturday morning.',
    days: [
      {
        dayNumber: 1,
        date: '2027-01-22',
        activities: [{ id: 6, text: 'Battery Point heritage walk & Salamanca harbour' }],
      },
    ],
    createdBy: { displayName: 'Partner' },
    createdAt: '2026-09-20T09:00:00Z',
  },
  {
    id: 203,
    title: 'Noosa Coastal Trail & Everglades',
    location: 'Sunshine Coast, Australia',
    description: 'Completed weekend getaway along the headland boardwalk.',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    duration: 3,
    status: 'completed',
    transportation: 'Coastal drive north from Brisbane',
    accommodation: 'Noosa Sound studio',
    notes: 'Linked to July 2026 Moments album.',
    days: [
      {
        dayNumber: 1,
        date: '2026-07-10',
        activities: [{ id: 7, text: 'Hell’s Gates coastal walk at golden hour' }],
      },
    ],
    createdBy: { displayName: 'Jianshuo' },
    createdAt: '2026-07-01T09:00:00Z',
  },
];

const DEMO_ANNIVERSARIES_RAW = [
  {
    id: 301,
    title: 'Our Archive Began',
    originalDate: '2025-11-18',
    note: 'The day we started recording shared moments and places in one quiet room.',
    createdBy: { displayName: 'Jianshuo' },
    createdAt: '2025-11-18T00:00:00Z',
  },
  {
    id: 302,
    title: 'First Brisbane Riverwalk',
    originalDate: '2026-03-14',
    note: 'Evening walk across the river bridge after arriving in Queensland.',
    createdBy: { displayName: 'Partner' },
    createdAt: '2026-03-14T00:00:00Z',
  },
  {
    id: 303,
    title: 'First Autumn Trip Together',
    originalDate: '2025-08-19',
    note: 'Northern highland meadow journey.',
    createdBy: { displayName: 'Jianshuo' },
    createdAt: '2025-08-19T00:00:00Z',
  },
];

const DEMO_AUTH_SESSION = {
  authenticated: true,
  environment: 'production',
  user: { id: 1, displayName: 'Jianshuo' },
  account: {
    id: 1,
    username: 'jianshuo_design',
    displayName: 'Jianshuo',
    memberSince: '2025-08-01',
  },
  can: { edit: true, invite: true },
  pairingStatus: 'paired',
  spaceCount: 2,
  currentSpace: {
    id: 10,
    name: 'Our Story · Shared Space',
    type: 'group',
    membershipRole: 'creator',
    memberCount: 2,
    pendingJoinRequestCount: 0,
  },
  space: {
    id: 10,
    name: 'Our Story · Shared Space',
    type: 'group',
    membershipRole: 'creator',
    memberCount: 2,
    pendingJoinRequestCount: 0,
  },
  preferences: { theme: null, language: null },
  contact: {
    email: { maskedValue: 'j***o@uq.edu.au', verified: true },
  },
};

const DEMO_SPACES = {
  currentSpaceId: 10,
  spaces: [
    {
      id: 10,
      name: 'Our Story · Shared Space',
      type: 'group',
      membershipRole: 'creator',
      memberCount: 2,
      pendingJoinRequestCount: 0,
    },
    {
      id: 11,
      name: 'My Space',
      type: 'personal',
      membershipRole: 'creator',
      memberCount: 1,
      pendingJoinRequestCount: 0,
    },
  ],
};

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const fallbackPath = path.join(WS_DIR, 'pw-runner/node_modules/playwright/index.mjs');
    return await import(fallbackPath);
  }
}

async function savePngAndWebp(converterPage, subdir, baseName, pngBuffer) {
  const targetDir = path.join(CASE_STUDY_DIR, subdir);
  const pngPath = path.join(targetDir, `${baseName}.png`);
  const webpPath = path.join(targetDir, `${baseName}.webp`);
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
    const dataUrl = canvas.toDataURL('image/webp', 0.9);
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      webpBase64: dataUrl.replace(/^data:image\/webp;base64,/, ''),
    };
  }, pngBase64);

  const webpBuffer = Buffer.from(info.webpBase64, 'base64');
  fs.writeFileSync(webpPath, webpBuffer);
  console.log(
    `[SAVED] ${subdir}/${baseName}.webp (${Math.round(webpBuffer.length / 1024)} KB, ${info.width}×${info.height})`
  );
}

async function main() {
  const { chromium } = await loadPlaywright();
  const execPath = path.join(
    WS_DIR,
    'pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'
  );

  const fontCache = fs.existsSync(CACHE_JSON_PATH)
    ? JSON.parse(fs.readFileSync(CACHE_JSON_PATH, 'utf8'))
    : {};

  const browser = await chromium.launch({
    executablePath: fs.existsSync(execPath) ? execPath : undefined,
    headless: true,
    args: ['--single-process', '--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  });

  try {
    let authMode = 'authenticated'; // 'authenticated' | 'guest'

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });

    await context.route('**/*', async (route) => {
      const reqUrl = route.request().url();
      const parsed = new URL(reqUrl);

      // Serve cached Google Fonts offline
      if (parsed.hostname.includes('googleapis.com') || parsed.hostname.includes('gstatic.com')) {
        if (fontCache[reqUrl]) {
          const c = fontCache[reqUrl];
          await route.fulfill({
            status: c.status,
            headers: c.headers,
            body: Buffer.from(c.bodyBase64, 'base64'),
          });
          return;
        }
        await route.fulfill({ status: 200, contentType: 'text/css', body: '' });
        return;
      }

      if (parsed.hostname !== 'lovestory.local') {
        await route.abort();
        return;
      }

      const pathname = decodeURIComponent(parsed.pathname);

      // Serve non-sensitive scenic SVG photographs
      if (pathname.startsWith('/uploads/demo-') && pathname.endsWith('.svg')) {
        const sceneKey = pathname.replace('/uploads/demo-', '').replace('.svg', '');
        const svg = buildScenicSvg(sceneKey);
        await route.fulfill({
          status: 200,
          contentType: 'image/svg+xml; charset=utf-8',
          body: svg,
        });
        return;
      }

      // Serve mocked privacy-safe API endpoints
      if (pathname.startsWith('/api/')) {
        let jsonBody = {};
        let status = 200;

        if (pathname === '/api/auth/me') {
          jsonBody =
            authMode === 'authenticated'
              ? DEMO_AUTH_SESSION
              : {
                  authenticated: false,
                  user: null,
                  can: { edit: false, invite: false },
                  pairingStatus: 'unpaired',
                  space: null,
                  currentSpace: null,
                  spaceCount: 0,
                  account: null,
                  environment: 'production',
                };
        } else if (pathname === '/api/auth/setup-status') {
          jsonBody = { needsOwnerSetup: false };
        } else if (pathname === '/api/memories') {
          jsonBody = { memories: DEMO_MEMORIES_RAW };
        } else if (pathname === '/api/future-plans') {
          jsonBody = { plans: DEMO_PLANS_RAW };
        } else if (pathname === '/api/anniversaries') {
          jsonBody = { anniversaries: DEMO_ANNIVERSARIES_RAW };
        } else if (pathname === '/api/spaces') {
          jsonBody = DEMO_SPACES;
        } else if (pathname === '/api/spaces/current') {
          jsonBody = {
            space: DEMO_AUTH_SESSION.currentSpace,
            pairingStatus: 'paired',
            pendingInvitation: null,
          };
        } else if (pathname.includes('/members')) {
          jsonBody = {
            members: [
              { userId: 1, displayName: 'Jianshuo', username: 'jianshuo_design', role: 'creator' },
              { userId: 2, displayName: 'Partner', username: 'partner_archive', role: 'admin' },
            ],
          };
        } else if (pathname.includes('/invitations')) {
          jsonBody = {
            invitations: [
              {
                id: 91,
                pairingCode: 'LS-2026-ARCHIVE',
                expiresAt: '2026-11-06T12:00:00Z',
              },
            ],
          };
        } else if (pathname.includes('/join-requests')) {
          jsonBody = { requests: [] };
        } else if (pathname.includes('/private-archive/status') || pathname.includes('/privacy/status')) {
          jsonBody = {
            configured: true,
            unlocked: false,
            unlockedUntil: null,
            timeoutMinutes: 10,
          };
        } else if (pathname.includes('/notifications')) {
          jsonBody = {
            unread: 1,
            unreadCount: 1,
            notifications: [],
          };
        } else if (pathname.includes('/activities')) {
          jsonBody = {
            activities: [
              {
                type: 'memory_created',
                actor: { displayName: 'Jianshuo' },
                memory: { id: 'backend-101', title: 'Riverwalk Evening Walk' },
                createdAt: '2026-11-04T06:00:00Z',
              },
              {
                type: 'partner_joined',
                actor: { displayName: 'Partner' },
                createdAt: '2026-11-03T09:00:00Z',
              },
            ],
          };
        }

        await route.fulfill({
          status,
          contentType: 'application/json; charset=utf-8',
          body: JSON.stringify(jsonBody),
        });
        return;
      }

      // Serve static files from MIRROR_DIR
      let relFile = pathname.replace(/^\//, '');
      if (!relFile || relFile.endsWith('/')) {
        relFile += 'index.html';
      }
      const localFile = path.join(MIRROR_DIR, relFile);
      if (fs.existsSync(localFile) && fs.statSync(localFile).isFile()) {
        const ext = path.extname(localFile).toLowerCase();
        await route.fulfill({
          status: 200,
          contentType: MIME_TYPES[ext] || 'application/octet-stream',
          body: fs.readFileSync(localFile),
        });
        return;
      }

      await route.fulfill({ status: 404, body: 'Not found' });
    });

    const page = await context.newPage();
    const converterPage = await context.newPage();
    await converterPage.setContent('<!doctype html><html><body></body></html>');

    async function setTheme(theme) {
      await page.evaluate((t) => {
        try {
          localStorage.setItem('loveStory.theme', t);
          document.documentElement.setAttribute('data-theme', t);
        } catch {}
      }, theme);
      await page.waitForTimeout(250);
    }

    // =========================================================================
    // 1. PUBLIC ENTRANCE & UNLOCK OVERLAY (gallery/index.html)
    // =========================================================================
    authMode = 'guest';
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://lovestory.local/gallery/index.html', { waitUntil: 'networkidle' });
    await setTheme('dark');
    await page.evaluate(() => {
      document.body.classList.add('is-revealed', 'is-running');
      const op = document.getElementById('opening');
      if (op) op.style.display = 'none';
    });
    await page.waitForTimeout(700);

    // Experience 01c: Public Entrance Film Strips & Gate
    const entranceBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'experience', 'exp-01c-entrance-gate', entranceBuf);

    // Open Unlock Overlay in Dark Archive
    await page.click('#unlockButton');
    await page.waitForTimeout(550);
    const unlockDarkBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'design-system', 'ds-dark-unlock', unlockDarkBuf);

    // Switch Unlock Overlay to Light (Paper & Ink)
    await page.click('#unlockThemeLight');
    await page.waitForTimeout(450);
    const unlockLightBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'design-system', 'ds-light-unlock', unlockLightBuf);

    // Restore Dark theme before moving to authenticated views
    await page.click('#unlockThemeDark');
    await page.waitForTimeout(200);

    // =========================================================================
    // 2. OUR SPACE — MAIN HUB (hub/index.html)
    // =========================================================================
    authMode = 'authenticated';
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://lovestory.local/hub/index.html', { waitUntil: 'networkidle' });
    await setTheme('dark');
    await page.waitForTimeout(900);

    // Architecture Hub & Design System Dark Hub & Index 02
    const hubDarkBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'architecture', 'arch-hub-our-world', hubDarkBuf);
    await savePngAndWebp(converterPage, 'design-system', 'ds-dark-hub', hubDarkBuf);
    await savePngAndWebp(converterPage, 'index', 'ls-index-02-architecture', hubDarkBuf);

    // Trigger Timeline Node hover/focus on Hub to draw the Gold Link to Our World globe
    await page.evaluate(() => {
      const hits = document.querySelectorAll('.timeline__hit');
      if (hits.length > 0) {
        hits[0].focus();
        hits[0].click();
      }
    });
    await page.waitForTimeout(500);
    const hubLinkBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'experience', 'exp-02b-hub-timeline-link', hubLinkBuf);

    // Switch Hub to Paper & Ink (Light) for Design System comparison
    await setTheme('light');
    await page.waitForTimeout(450);
    const hubLightBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'design-system', 'ds-light-hub', hubLightBuf);
    await savePngAndWebp(converterPage, 'index', 'ls-index-04-system', hubLightBuf);

    // Switch back to Dark Archive and open Account & Shared Spaces Drawer
    await setTheme('dark');
    await page.waitForTimeout(300);
    await page.click('#hubAccountButton');
    await page.waitForTimeout(600);
    const sharedSpaceDrawerBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'requirements', 'req-01-shared-space', sharedSpaceDrawerBuf);
    await savePngAndWebp(converterPage, 'iterations', 'iter-01-shared-space-sync', sharedSpaceDrawerBuf);
    await savePngAndWebp(converterPage, 'index', 'ls-index-01-needs', sharedSpaceDrawerBuf);

    // =========================================================================
    // 3. MOMENTS / PHOTO LIBRARY & DETAIL MODAL & ADD MEMORY SHEET
    // =========================================================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://lovestory.local/hub/modules/moments.html', { waitUntil: 'networkidle' });
    await setTheme('dark');
    await page.waitForTimeout(900);

    const momentsDarkBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'architecture', 'arch-node-moments', momentsDarkBuf);
    await savePngAndWebp(converterPage, 'experience', 'exp-01-moments-gallery', momentsDarkBuf);
    await savePngAndWebp(converterPage, 'design-system', 'ds-dark-moments', momentsDarkBuf);

    // Paper & Ink Moments Library
    await setTheme('light');
    await page.waitForTimeout(450);
    const momentsLightBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'design-system', 'ds-light-moments', momentsLightBuf);

    // Back to Dark Archive and open a Memory Detail Frame (#20211E photo-true mount)
    await setTheme('dark');
    await page.waitForTimeout(350);
    await page.click('.frame-item');
    await page.waitForTimeout(600);
    const memoryDetailBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'experience', 'exp-01b-memory-detail', memoryDetailBuf);
    await savePngAndWebp(converterPage, 'index', 'ls-index-03-experience', memoryDetailBuf);

    // Close detail modal and open Desktop Add Memory Sheet
    await page.click('#detailBack');
    await page.waitForTimeout(350);
    await page.click('#libraryAddButton');
    await page.waitForTimeout(600);
    const desktopSheetBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'iterations', 'iter-03-desktop-memory-sheet', desktopSheetBuf);

    // =========================================================================
    // 4. CHRONOLOGICAL TIMELINE (hub/modules/timeline.html)
    // =========================================================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://lovestory.local/hub/modules/timeline.html', { waitUntil: 'networkidle' });
    await setTheme('dark');
    await page.waitForTimeout(900);

    const timelineBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'architecture', 'arch-node-timeline', timelineBuf);
    await savePngAndWebp(converterPage, 'experience', 'exp-02-timeline-stream', timelineBuf);
    await savePngAndWebp(converterPage, 'iterations', 'iter-02-chronological-order', timelineBuf);
    await savePngAndWebp(converterPage, 'index', 'ls-index-05-iterations', timelineBuf);
    await savePngAndWebp(converterPage, 'design-system', 'ds-dark-timeline', timelineBuf);

    // Paper & Ink Timeline (Light Theme)
    await setTheme('light');
    await page.waitForTimeout(450);
    const timelineLightBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'design-system', 'ds-light-timeline', timelineLightBuf);
    await savePngAndWebp(converterPage, 'design-system', 'ds-light-moments', timelineLightBuf);

    // =========================================================================
    // 5. INTERACTIVE MEMORY MAP (hub/memory-map.html)
    // =========================================================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://lovestory.local/hub/memory-map.html?place=Brisbane', {
      waitUntil: 'networkidle',
    });
    await setTheme('dark');
    await page.evaluate(() => {
      const intro = document.getElementById('mapIntro');
      if (intro) intro.hidden = true;
      document.body.classList.remove('map-intro');
      const world = document.getElementById('world');
      if (world) world.hidden = false;
    });
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      if (window.LoveStoryGlobe && typeof window.LoveStoryGlobe.focusPlace === 'function') {
        window.LoveStoryGlobe.focusPlace('Brisbane');
      }
      const btn = document.querySelector('#worldIndex button');
      if (btn && typeof btn.click === 'function') btn.click();
    });
    await page.waitForTimeout(700);

    const mapBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'requirements', 'req-02-time-place', mapBuf);
    await savePngAndWebp(converterPage, 'architecture', 'arch-node-memory-map', mapBuf);
    await savePngAndWebp(converterPage, 'experience', 'exp-03-memory-map-globe', mapBuf);

    // =========================================================================
    // 6. PLAN THE FUTURE (hub/modules/future.html)
    // =========================================================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://lovestory.local/hub/modules/future.html', { waitUntil: 'networkidle' });
    await setTheme('dark');
    await page.waitForTimeout(800);

    const futureListBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'requirements', 'req-04-future-mobile', futureListBuf);
    await savePngAndWebp(converterPage, 'architecture', 'arch-node-future-plans', futureListBuf);

    // Click first plan to open Day-by-Day Itinerary detail view
    const hasPlanRow = await page.locator('.plan-row, .plan-card, #planList button, #planList li').count();
    if (hasPlanRow > 0) {
      await page.locator('#planList button, #planList li').first().click();
      await page.waitForTimeout(550);
    }
    const futureDetailBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'experience', 'exp-03b-future-itinerary', futureDetailBuf);

    // =========================================================================
    // 7. ANNIVERSARY COUNTDOWN (hub/modules/anniversary.html)
    // =========================================================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://lovestory.local/hub/modules/anniversary.html', {
      waitUntil: 'networkidle',
    });
    await setTheme('dark');
    await page.waitForTimeout(800);

    const anniversaryBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'architecture', 'arch-node-countdown', anniversaryBuf);

    // =========================================================================
    // 8. PRIVATE ARCHIVE SECOND-LOCK SCREEN (hub/private/index.html)
    // =========================================================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://lovestory.local/hub/private/index.html', { waitUntil: 'networkidle' });
    await setTheme('dark');
    await page.waitForTimeout(800);

    const privateLockBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'requirements', 'req-03-private-boundary', privateLockBuf);
    await savePngAndWebp(converterPage, 'architecture', 'arch-node-private', privateLockBuf);
    await savePngAndWebp(converterPage, 'experience', 'exp-04-private-lock', privateLockBuf);

    // =========================================================================
    // 9. MOBILE PORTRAIT INTERFACES (390×844)
    // =========================================================================
    await page.setViewportSize({ width: 390, height: 844 });

    // 9a. Mobile Curved Story Thread Home (hub/index.html at 390×844)
    await page.goto('http://lovestory.local/hub/index.html', { waitUntil: 'networkidle' });
    await setTheme('dark');
    await page.evaluate(() => {
      document.documentElement.classList.remove('is-mobile-opening');
      const mo = document.getElementById('mobileOpening');
      if (mo) mo.style.display = 'none';
    });
    await page.waitForTimeout(900);
    const mobileStoryBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'experience', 'exp-04c-mobile-story', mobileStoryBuf);

    // 9b. Mobile Fullscreen 6-Step Memory Composer (hub/modules/moments.html?add=1 at 390×844)
    await page.goto('http://lovestory.local/hub/modules/moments.html?add=1', {
      waitUntil: 'networkidle',
    });
    await setTheme('dark');
    await page.waitForTimeout(700);
    // Ensure Add Memory composer is open on mobile
    await page.evaluate(() => {
      if (window.LoveStoryMemoryForm && typeof window.LoveStoryMemoryForm.open === 'function') {
        const sheet = document.getElementById('addSheet');
        if (!sheet || sheet.hidden) {
          window.LoveStoryMemoryForm.open();
        }
      }
    });
    await page.waitForTimeout(600);
    const mobileComposerBuf = await page.screenshot({ type: 'png' });
    await savePngAndWebp(converterPage, 'experience', 'exp-04b-mobile-composer', mobileComposerBuf);
    await savePngAndWebp(converterPage, 'iterations', 'iter-03b-mobile-composer', mobileComposerBuf);

    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
