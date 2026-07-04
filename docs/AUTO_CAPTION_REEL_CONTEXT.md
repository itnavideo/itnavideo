# Reference Note

This document is deep Auto Caption reference material. Please use `docs/ITNAVIDEO_MASTER_DOC.md` as the latest source of truth for overall Itnavideo documentation.

# Auto Caption Reel — Full Technical Context for Improvement Discussion

## What is ItnaVideo?
ItnaVideo (itnavideo.com) is a SaaS that creates professional 9:16 short-form video reels (Instagram Reels, YouTube Shorts, TikTok) from user uploads using AI + Remotion (React-based video rendering on AWS Lambda). Users upload media, AI transcribes and builds render props, Remotion renders a polished video with motion/effects.

## What is the Auto Caption Reel Template?
The **AUTO_CAPTION_REEL** is our most popular template. Users upload a talking-head or any video (up to 60 seconds), and the system:
1. Transcribes speech using **Groq Whisper** (returns word-level timestamps)
2. Groups words into short caption segments (max 6-8 words per chunk)
3. Renders the video fullscreen in 1080×1920 (9:16) with stylized subtitles overlaid
4. Exports a polished MP4 ready for social media

## Current Template Architecture

### Render Pipeline
```
User uploads video → Presigned S3 URL → /api/reels/jobs →
  Groq Whisper (word-level transcript) →
  buildCompareCaptionsFromGroq() groups words into display chunks →
  Remotion Lambda renders with AUTO-CAPTION-REEL composition →
  Poll for progress → Download MP4
```

### Template Component (`remotion/templates/AUTO_CAPTION_REEL/template.tsx`)
- **Video Layer**: `OffthreadVideo` fills the screen with Ken Burns effect (slow 1.0→1.035 zoom + subtle X/Y drift based on active caption index)
- **Frame**: 12px inset with rounded corners (24px radius), 3px semi-transparent white border, inset shadow
- **Vignette**: Bottom-heavy gradient for caption readability
- **Top accent line**: Subtle decorative line at top of video frame
- **Subtitles**: Rendered by shared `SubtitleRenderer` component

### Visual Effects Currently Applied
1. **Ken Burns zoom**: 1.0→1.035 over full video duration
2. **Caption-aware drift**: X/Y position shifts subtly when active caption changes (Math.sin/cos based)
3. **Premium frame**: Rounded border with inset shadow — gives "phone screen" feel
4. **Bottom vignette**: Stronger at bottom (0.55 opacity) for dark background behind captions

### SubtitleRenderer (`remotion/components/SubtitleRenderer.tsx`)
A shared component used across all templates. Has **15 caption styles**:

| Style | Description |
|-------|-------------|
| `highlight` (default) | White text, active word scales up 1.08x with spring animation + color change + glow |
| `word-pop` | Active word springs from 0.6→1 scale, inactive words stay 0.75 opacity |
| `neon` | Active word gets neon glow ramp via spring, others stay dim |
| `one-word` | Shows ONLY the active word, large, springs from 0.5→1 scale |
| `big-bold` | Large bold text with fade-up entry animation |
| `box` | Colored background box behind text, active word highlighted |
| `split-color` | Left/right color split at active word boundary |
| `typewriter` | Characters appear one by one over time |
| `bold-outline` | Thick text outline, active word gets highlight color |
| `gold-pill` | Gold pill-shaped background behind each line |
| `stacked` | Lines stacked vertically, active word highlighted |
| `inline-bg` | Inline background highlight on active word |
| `vollkorn` | Serif font style with word highlighting |
| `normal` | Clean white text, no highlights |
| `none` | No subtitles |

### Word-Level Timing
Groq Whisper returns per-word timestamps. Our `distributeWordTimings()` utility ensures every word in a caption chunk has accurate start/end times. The `getActiveWord()` function determines which word is currently being spoken at any given frame.

### Caption Positions
- `bottom` (default) — 180px from bottom
- `center` — vertically centered
- `top` — 120px from top

### Named Presets (User-facing names in dashboard)
| Preset Name | Style | Font | Highlight Color |
|-------------|-------|------|-----------------|
| Eclipse | highlight | Inter | Purple #7C3AED |
| Hustle | bold-outline | Impact | Red #EF4444 |
| Marigold | normal | Georgia | Amber #F59E0B |
| Gold Pill | gold-pill | Arial Black | Gold #FFD700 |
| Midnight | inline-bg | Inter | Blue #3B82F6 |
| Arctic Glow | neon | sans-serif | Sky blue #38BDF8 |
| Studio Clean | stacked | Inter | Yellow #FACC15 |
| One Word | one-word | Impact | Yellow #FACC15 |
| Vollkorn | vollkorn | Georgia | Cyan #22D3EE |
| Pop Candy | box | sans-serif | Pink #F472B6 |
| Typewriter | typewriter | Courier New | Green #10B981 |
| Bold Fire | big-bold | Impact | Orange #F97316 |

### User Configurable Props (from dashboard)
- `captionStyle` — one of the preset names or style keys
- `captionPosition` — top/center/bottom
- `textColor` — base text color
- `highlightColor` — active word highlight color
- `fontSize` — small/medium/large/xlarge
- `showBackground` — whether to show background behind captions
- `subtitleOutputLanguage` — "en" or "hinglish"

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Video Engine**: Remotion 4.0 (React → MP4 on Lambda)
- **Render**: AWS Lambda (ap-south-1), 3008MB RAM, 2048MB disk, 900s timeout
- **Transcription**: Groq Whisper (whisper-large-v3-turbo)
- **Languages**: English + Hinglish (Hindi in Roman script)
- **Output**: 1080×1920, 30fps, H.264, AAC audio
- **Canvas**: All coordinates/sizes in px (1080 wide, 1920 tall)

## What Competitors Do (CapCut, InShot, Submagic, Captions.ai)
From our reference video analysis:
- **4-6 cuts per 15 seconds** — we don't cut the video, just zoom/drift
- **Multi-word highlight with bounce/pop** — our springs are subtle
- **Background blur + main video inset** — we don't offer this layout yet
- **Emoji reactions synced to words** — not implemented
- **Progress bar at bottom** — not in this template
- **Sound effects on word hits** — not implemented
- **Multiple caption animations** (slide up, typewriter, bounce per word) — we have some but limited
- **Dynamic zoom on specific words** (zoom in on emphasis words) — not implemented
- **Caption shadow/3D effects** — limited

## What We Want to Improve
We want the Auto Caption Reel to be **better than CapCut/InShot** free auto-captioning. Areas to explore:

1. **More dynamic video motion** — currently just slow Ken Burns. Could add: tempo-based zoom pulses on beat, faster zoom resets between segments, parallax layers
2. **Better word highlight animations** — springs are good but could be more dramatic (scale 1.2x? color transitions? 3D transforms?)
3. **Video framing options** — full bleed vs phone frame vs split (video top + captions bottom in separate area)
4. **Progress indicators** — thin animated bar at top/bottom showing video progress
5. **Sound design** — subtle pop/click on each word highlight
6. **Emoji/reaction layer** — auto-detect emotion from transcript, show relevant emoji
7. **Multiple layout modes** — center video with blur background, letterbox with caption area, etc.
8. **Caption entry animations** — each new caption chunk could have a distinct entry (slide, bounce, fade-scale)
9. **Beat sync** — if audio has rhythm, sync zoom/effects to audio energy ✅ DONE
10. **Active word emphasis** — the current word could get a brief zoom on the entire video (like a punch-in effect)

## Beat Sync Implementation (Done)

Beat sync is **live** as of the current build. Here's how it works end-to-end:

### Data Flow
1. **Server-side** (`app/api/reels/jobs/route.ts` → `autoCaption` mode block):
   - `buildEnergyTimeline(words, durationSec, 30)` → `number[]` — one energy value [0–1] per frame
   - `findBeatPeaks(energyTimeline, 0.65, 8)` → `number[]` — frames of local energy maxima
   - Both injected as `inputProps.energyTimeline` and `inputProps.beatPeakFrames`
2. **Render-side** (`remotion/templates/AUTO_CAPTION_REEL/template.tsx`):
   - `getEnergyAtFrame(energyTimeline, frame, 2)` → smooth per-frame energy lookup
   - `beatPulse` scale: `interpolate(energy, [0,1], [1.0, 1.012])` — alive video breathing
   - `beatFlashBrightness`: `interpolate` from `[1.0, 1.12, 1.0]` over 8 frames on each peak
   - `beatFlashOpacity`: `interpolate` to `0.18` white screen overlay on peak frames
   - `finalBrightness = max(wordBrightness, beatFlashBrightness)` — word punch and beat flash don't double-stack

### Energy Algorithm (`lib/audio/energyTimeline.ts`)
- Word onset injection (short words, dense packing, emphasis vocabulary = higher energy)
- 5-frame Gaussian blur to prevent jitter
- Exponential decay (0.82/frame) for natural sustain
- Per-frame normalization to [0–1]

### Fallback
When `energyTimeline` is empty (preview/default props), `beatPulse` falls back to a gentle 1Hz sine wave so motion still feels alive.

## Constraints
- Must work on Remotion Lambda (no FFmpeg post-processing, no canvas API tricks — pure React rendered to frames)
- Must handle 8-60 second videos
- Word timing from Groq Whisper is accurate to ~50ms
- All fonts must be loadable in Lambda (Google Fonts or system fonts)
- Keep render time reasonable (under 2 minutes for 60s video)
- No external APIs during render (all data passed as inputProps)
- Hindi/Hinglish text must display correctly (Roman script only, no Devanagari)

## File References
- Template: `remotion/templates/AUTO_CAPTION_REEL/template.tsx`
- Subtitle renderer: `remotion/components/SubtitleRenderer.tsx`
- Subtitle types/presets: `remotion/types/subtitles.ts`
- Subtitle utilities: `remotion/utils/subtitleUtils.ts`
- Font resolver: `remotion/utils/fonts.ts`
- Render API: `app/api/reels/jobs/route.ts`
- Dashboard (user selects style): `app/dashboard/page.tsx`
