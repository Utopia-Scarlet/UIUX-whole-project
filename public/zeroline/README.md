# ZERO//LINE Public Assets Directory

All `ZERO//LINE` static assets are resolved via `import.meta.env.BASE_URL` so they work in both local Vite development and GitHub Pages subpath deployments.

## 1. Hero & Entry Transition Character Assets (`public/zeroline/`)

- **Hero Character Key Art (Populated)**:
  - `public/zeroline/zeroline-hero-character.webp` (or `.png`)
- **Entry Transition Character Cutout (Optional)**:
  - `public/zeroline/zeroline-character-slash.webp` (or `.png`)

## 2. Chapter 09 Authentic Website Showcase Screenshots (`public/zeroline/showcase/`)

Place genuine desktop screenshots (`1440 × 900` or `1920 × 1080` WebP/PNG captured from `https://utopia-scarlet.github.io/ZERO-LINE/`) in `public/zeroline/showcase/` using these exact filenames:

1. **HOME**: `public/zeroline/showcase/zeroline-home.webp` (or `zeroline-home.png`)
2. **NEWS**: `public/zeroline/showcase/zeroline-news.webp` (or `zeroline-news.png`)
3. **HEROES**: `public/zeroline/showcase/zeroline-heroes.webp` (or `zeroline-heroes.png`)
4. **STORE**: `public/zeroline/showcase/zeroline-store.webp` (or `zeroline-store.png`)
5. **ABOUT**: `public/zeroline/showcase/zeroline-about.webp` (or `zeroline-about.png`)

The Chapter 09 5-module showcase automatically detects each file at runtime (trying `.webp` first, then `.png`) and enables full-width display plus enlarged lightbox inspection.
