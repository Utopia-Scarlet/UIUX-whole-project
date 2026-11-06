# Personal Portrait Asset Directory

Place the authorised transparent personal portrait of **Jianshuo Liu** in this folder so the hero composition (`PortraitLayer.tsx`) automatically loads it in place of the architectural studio silhouette placeholder:

- **Primary Path**: `public/portrait/jianshuo-portrait.webp`
- **Fallback Path**: `public/portrait/jianshuo-portrait.png`
- **Recommended Dimensions**: `1200 × 1500 px` (`4:5` portrait aspect ratio)
- **Background**: Transparent background (clean alpha mask around head, hair, and shoulders) so `"JIANSHUO"` passes behind the upper subject while `"LIU"` and selected foreground strokes layer cleanly in front.
