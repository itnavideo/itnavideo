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
| Category | Creator (Shorts) |

## Purpose

Advanced sibling of Auto Caption. Users pick every visual primitive manually — font, size, weight, case, colors, background, stroke, shadow, rotation, position, alignment, max width. The upload flow and transcription pipeline mirror Auto Caption; only the render props differ.

Auto Caption is for creators who want a preset, done. Caption Studio is for creators who want to design their own look.

## Who Uses It

- Creators who want brand-consistent captions across renders
- Agencies delivering client-specific caption styles
- Advanced users unsatisfied with the 24+ preset library
- Anyone who wants full manual control

## What Problem It Solves

Auto Caption locks users into 24 preset styles. Caption Studio removes that ceiling — every knob is exposed, so brand-color-specific captions or unusual typography choices are possible without asking us to add a new preset.

---

## Required User Inputs

| Input | Type | Required | Notes |
|-------|------|----------|-------|
| Video | Video file (MP4/MOV/WEBM) | Yes | Any aspect ratio; must contain speech |

## Manual Controls (4 panels)

### Text

- Font family (17 curated caption fonts)
- Font size (40–140px, slider)
- Font weight (Regular / Medium / Semibold / Bold / Extra bold / Black)
- Italic (toggle)
- Case (As-is / UPPERCASE / Title Case / lowercase)
- Letter spacing (-0.05em to +0.20em)
- Line height (0.9 to 1.8)

### Color

- Text color (hex / native color picker)
- Active word color
- Background color
- Background opacity (0–100%)
- Background shape (Pill / Rounded box / Square box / None)
- Padding (0–60px)

### Effects

- Stroke width (0–8px)
- Stroke color
- Shadow (None / Soft / Hard)
- Rotation (-15° to +15°)

### Position

- Vertical position (Bottom safe / Center / Top)
- Horizontal align (Left / Center / Right)
- Max width (40–100%)

## Output Details

| Property | Value |
|----------|-------|
| Default size | 1080×1920 (9:16) |
| Supported aspect | 9:16 only |
| Max duration | 90 seconds |
| Min duration | 5 seconds |
| Duration source | Matches uploaded video length |
| Export format | MP4 (H.264 + AAC) |
| Audio handling | User's original video audio plays unchanged |
| Background music | OFF — user's video IS the content |

## Access & Pricing

- **Not available on Free plan.** New users get 1 free watermarked Auto Caption trial only; Caption Studio requires paid credits.
- **Credit cost:** 2 credits per render (compared to Auto Caption's 1 credit).
- Access is naturally gated because free-trial users only have 1 credit, so Caption Studio's 2-credit cost is blocked at the render-access check.

## Caption Rules

- Word-level timing from Groq Whisper (same as Auto Caption).
- English or Roman Hinglish only.
- No subtitle language dropdown.
- Every render gets a fresh transcript from the current upload.
- No AI planning — the composition renders directly from Groq's word timestamps + user manual settings.

## Render Flow

1. Upload video → S3 presigned URL
2. `/api/reels/jobs` — Groq transcription
3. Build render props from user's `studioSettings` + Groq captions
4. Remotion Lambda render (`CAPTION-STUDIO` composition)
5. Poll status → download MP4

No preview step — Caption Studio renders directly like Auto Caption. Preview-first flow is only for Compare.

## What This Template Does NOT Do (Phase 1)

Reserved for future phases:

- **Motion / animation presets** (entry, exit, word emphasis modes) — Phase 2
- **Word-emphasis modes** (color / scale / karaoke fill / underline / box fill) — Phase 2. Phase 1 uses simple color change.
- **Words per group control** — Phase 2. Phase 1 uses Groq's default grouping.
- **Transcript inline edit** — Phase 3
- **Filler word removal** (um, uh) — Phase 3
- **Punctuation toggle** — Phase 3
- **Auto emoji injection** — Phase 4
- **Personal preset save/load** — Phase 4

## Fallback Rules

| Scenario | Behavior |
|----------|----------|
| No speech detected | Render video without captions |
| Transcription fails | Show error to user — don't render silently |
| Video too long (>90s) | Trim to 90s |
| 16:9 video uploaded | Cover-crop to fill 9:16 canvas |
| Free-trial user | Block with clear message: "Caption Studio requires paid credits (2 credits)." |

## QA Checklist

- [ ] All 4 panels expand/collapse correctly
- [ ] All 20 controls change render output as expected
- [ ] Server enforces 2-credit cost on `getRenderAccessForUser({mode: 'captionStudio', creditUnits: 20})`
- [ ] Free-trial users are blocked before upload
- [ ] Paid users with <2 credits are blocked with clear message
- [ ] "Reset all to defaults" restores every setting
- [ ] Rendered MP4 respects all Studio settings exactly

## What to Avoid

- Do not gate the paid workflow behind preview UI complexity
- Do not add AI planning; this template is purely a manual designer
- Do not add background music or sound effects (mirrors Auto Caption spec)
- Do not expose watermark control; paid users always get clean output

## Value Proposition

The Video Type adds value through:

1. **Full manual control** — every visual primitive exposed
2. **Brand-caption support** — creators can dial in exact brand colors and typography
3. **Same fast Groq pipeline** — no compromise on transcription speed
4. **Same 9:16 quality** — no aspect-ratio downgrade

NOT through preset styles, AI planning, or added media.
