# Reference Note

This is a detailed Video Type spec. Start with `docs/ITNAVIDEO_MASTER_DOC.md` for the latest source of truth, then use this file for Caption Studio implementation details.

# Caption Studio

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Caption Studio |
| Internal ID | `CAPTION_STUDIO` |
| Composition ID | `CAPTION-STUDIO` |
| Dashboard Mode | `captionStudio` |
| Category | Short Videos |
| Output | 1080×1920, 9:16 MP4 |
| Max duration | 90 seconds |
| Credits | 2 credits per render |

## Purpose

Full manual caption designer. Every visual primitive is exposed — font, size, weight, case, colors, background, stroke, shadow, rotation, position, alignment, animation, emphasis mode. For creators who need brand-specific captions that presets can't satisfy.

**Auto Caption** = pick a preset, done (1 credit).  
**Caption Studio** = design your own look from scratch (2 credits).

## Who Uses It

- Creators who want brand-consistent captions across all renders
- Agencies delivering client-specific caption styles
- Advanced users unsatisfied with the 23+ preset library
- Anyone who wants pixel-perfect control over caption appearance

## Dashboard Layout (Current)

**Desktop:** Split-screen — live preview left, settings right (side-by-side).  
**Mobile:** Preview sticky at top, settings scroll below.

### Settings Panels (collapsible)

1. **Text** (open by default)
   - Font family (17 curated fonts: Inter, Poppins, Montserrat, Space Grotesk, Manrope, Anton, Bebas Neue, Oswald, Impact, Arial Black, Playfair Display, DM Serif Display, Bodoni, Vollkorn, Georgia, JetBrains Mono, Courier New)
   - Font size (40–140px slider)
   - Font weight (Regular → Black)
   - Case (As-is / UPPERCASE / Title Case / lowercase)
   - Letter spacing (-0.05em to +0.20em)
   - Line height (0.9 to 1.8)
   - Italic toggle

2. **Color** (collapsed by default)
   - Text color (native color picker)
   - Active word color
   - Background color + opacity (0–100%)
   - Background shape (Pill / Rounded / Square / None)
   - Padding (0–60px)

3. **Effects** (collapsed by default)
   - Stroke width (0–8px) + stroke color
   - Shadow (None / Soft / Hard)
   - Rotation (-15° to +15°)

4. **Position** (collapsed by default)
   - Vertical (Bottom safe / Center / Top)
   - Horizontal align (Left / Center / Right)
   - Max width (40–100%)

5. **Motion & emphasis** (collapsed by default)
   - Entry animation (None / Fade / Slide-up / Pop)
   - Active word emphasis (Color / Scale / Box / Underline / None)
   - Words per group (1–5)

### Live Preview

- Shows a demo video (Cloudinary `content-creator-after.mp4`) when user hasn't uploaded yet
- Switches to user's uploaded video once file is selected
- Uses `@remotion/player` rendering the actual `CAPTION-STUDIO` composition
- Updates in real-time as settings change
- Plays on loop, muted

## No Title/Topic Input

Caption Studio does NOT show the "Reel topic/title" input field. It's purely a caption designer — no AI planning or topic detection involved.

## Render Flow

1. Upload video → S3 presigned URL
2. `/api/reels/jobs` — Groq transcription (word-level)
3. Build render props from `studioSettings` object + Groq captions
4. Remotion Lambda render (`CAPTION-STUDIO` composition)
5. Poll status → download MP4

No preview-first step. Renders directly.

## Access & Pricing

- **Not on Free plan** — requires paid credits
- **2 credits per render** (vs Auto Caption's 1 credit)
- Free-trial users are blocked before render with clear message

## Caption Rules

- Same Groq Whisper pipeline as Auto Caption
- English or Roman Hinglish only
- Fresh transcript from current upload only
- No AI planning — renders directly from word timestamps + manual settings
