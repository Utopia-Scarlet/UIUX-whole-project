# ZERO//LINE — NOVA 4-Keyframe Cinematic Intro Sequence Assets

Place the four genuine NOVA sword-attack sequence illustrations in this directory (`public/zeroline/intro/`):

1. **`nova-01-ready.webp`** (or `.png` / `.jpg`) — **FRAME 01 (READY, 0.00s–0.35s)**: NOVA stands facing forward with both hands gripping the greatsword planted vertically into the ground. *(Already populated from `zeroline-hero-character-opt.webp`)*
2. **`nova-02-draw.webp`** (or `.png` / `.jpg`) — **FRAME 02 (DRAW, 0.35s–0.85s)**: NOVA lifts the greatsword upward off the ground with both arms in front of her chest, blade tilted diagonally.
3. **`nova-03-windup.webp`** (or `.png` / `.jpg`) — **FRAME 03 (WIND-UP, 0.85s–1.35s)**: NOVA raises both arms overhead, greatsword extended diagonally toward the upper-left, torso twisted in anticipation.
4. **`nova-04-strike.webp`** (or `.png` / `.jpg`) — **FRAME 04 (STRIKE, 1.35s–1.70s + 1.70s–2.20s Cut)**: NOVA leans forward with bent knees, unleashing a diagonal crimson sword-energy slash that cuts open the interface.

## Automatic Normalization & Registration

If you place `.png`, `.jpg`, or `.webp` files in `public/zeroline/intro/`, run:

```bash
node scripts/prepare-nova-intro-frames.mjs
```

to inspect dimensions, register canvas framing (`1024 × 1536`, `2:3`), and export optimized `.webp` + `.png` pairs.
