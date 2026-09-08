# Auto Caption Video — Technical Context

## Overview

| Field | Value |
|-------|-------|
| Video Type Name | Auto Caption Video |
| Internal ID | `AUTO_CAPTION_REEL` |
| Composition ID | `AUTO-CAPTION-REEL` |
| Dashboard Mode | `autoCaption` |
| Category | Short Videos |
| Output | 1080×1920, 9:16 MP4 |
| Max duration | 90 seconds |
| Credits | 1 credit per render |

## Purpose

Upload a talking video, pick a caption style, get back a captioned reel with word-level sync. No editing needed. This is the most-used template on Itnavideo.

## User Controls (Dashboard)

| Control | Options |
|---------|---------|
| Caption Style | 23+ presets (Eclipse, Karaoke Fill, Studio Clean, Neon Pulse, etc.) |
| Position | Bottom safe area / Center / Top |
| Size | Small / Medium / Large / Extra large |

**Removed:** Advanced settings (font, text color, highlight color, background color) — these are now only in Caption Studio for users who need full customization.

**Upsell:** "Need full customization? Use Caption Studio" link shown below the controls.

## What It Does NOT Control

- No font family override (preset determines font)
- No color overrides (preset determines colors)
- No background color picker
- No motion/animation settings
- No SFX or background music

Users who need these → **Caption Studio** (2 credits, full manual control).

## Render Pipeline

```
Upload video → S3 presigned URL → /api/reels/jobs →
  Groq Whisper (word-level timestamps) →
  buildCompareCaptionsFromGroq() → caption chunks →
  Beat energy timeline (word onset energy per frame) →
  Remotion Lambda: AUTO-CAPTION-REEL composition →
  Poll status → Download MP4
```

## Template Features

- Full-screen video with subtle Ken Burns motion
- Beat-synced brightness flash on energy peaks
- Word-level caption timing via Groq Whisper
- 23+ caption styles via shared SubtitleRenderer
- Caption entry animations (slide-up, zoom-in, glitch, flip)
- Responsive font sizing (long words/sentences scale down)
- Word emphasis detection (power words get scale/glow)
- No background music, no SFX added

## Caption Styles (23+)

Eclipse, Hustle, Gold Pill, Studio Clean, One Word, Arctic Glow, Karaoke Fill, Shorts Karaoke, Bold Highlight Strip, Shatter Drop, Pill Bounce, Marker Highlight, Metallic Gradient, Neon Pulse, Glass Blur, Cinematic, Hacker Type, Gradient Wave, Retro VHS, Handwritten, Midnight, Pop Candy, Bold Fire.

## Languages

- English → English captions
- Hindi/Hinglish audio → clean Roman Hinglish captions
- No Devanagari script

## File References

- Template: `remotion/templates/AUTO_CAPTION_REEL/template.tsx`
- Subtitle renderer: `remotion/components/SubtitleRenderer.tsx`
- Subtitle types/presets: `remotion/types/subtitles.ts`
- Energy timeline: `lib/audio/energyTimeline.ts`
- Dashboard controls: `app/dashboard/page.tsx` (mode === "autoCaption")
- Jobs route: `app/api/reels/jobs/route.ts` (autoCaption branch)

## Relationship to Caption Studio

| Feature | Auto Caption | Caption Studio |
|---------|-------------|----------------|
| Style presets | 23+ | Not used (manual) |
| Font choice | Preset-locked | 17 fonts manual |
| Color choice | Preset-locked | Full color picker |
| Position | ✅ | ✅ |
| Size | ✅ | ✅ (slider 40-140px) |
| Background shape | Preset-locked | Pill/Rounded/Square/None |
| Effects (stroke/shadow) | None | ✅ |
| Motion/animation | None (uses preset default) | Entry anim + emphasis mode |
| Credits | 1 | 2 |
| Target user | Quick, no decisions | Brand-specific, designers |
