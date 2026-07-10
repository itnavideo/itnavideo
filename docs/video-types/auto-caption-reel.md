# Reference Note

This is a detailed Video Type spec. Start with `docs/ITNAVIDEO_MASTER_DOC.md` for the latest source of truth, then use this file for Auto Caption implementation details.

# Auto Caption Reel

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Auto Caption Reel |
| Internal ID | `AUTO_CAPTION_REEL` |
| Composition ID | `AUTO-CAPTION-REEL` |
| Dashboard Mode | `autoCaption` |
| Category | Creator |

## Purpose

Add stylish, word-level animated captions/subtitles to a user's existing video. The user uploads their video and gets it back with professional captions overlaid — nothing else changes.

## Who Uses It

- Instagram/TikTok creators who want captions on their reels
- Podcast clip creators who need subtitles for social
- Educators posting video lessons
- Anyone who wants accessible, engaging captions without manual editing

## Viewer Expectation

The viewer sees the creator's original video with clean, animated captions that make it easier to follow along — especially on mute. It should feel native, like the creator edited them in professionally.

## What Problem It Solves

Adding word-level animated captions manually takes 15-30 minutes per video using tools like CapCut or Premiere. This does it instantly with style options.

## Why User Should Pay

- Saves 15-30 minutes of manual captioning per video
- Word-level timing synced to speech (not sentence blocks)
- Multiple professional caption styles to choose from
- No editing skill required
- Ready to post immediately

---

## Required User Inputs

| Input | Type | Required | Notes |
|-------|------|----------|-------|
| Video | Video file (MP4/MOV/WebM) | Yes | Any aspect ratio, must contain speech |

## Optional User Inputs

| Input | Type | Notes |
|-------|------|-------|
| Caption Style | Selection | Choose from available styles (Studio Clean default, Karaoke Fill, Gold Pill, etc.) |
| Caption Position | Selection | Bottom safe area, center, or top |
| Caption Size | Selection | Small, medium, large, or extra-large |
| Subtitle Language | Not shown | No language dropdown. Captions follow the uploaded video's spoken language as produced by the supported Groq transcription pipeline |

### Dashboard Caption Style Picker

- Caption style cards should use lightweight React/CSS mini 9:16 reel previews, not plain text swatches.
- Each preview should place sample captions in the bottom safe area so users understand the final reel look before rendering.
- Preview frames may use reusable creator/talking-head UI images from `public/visuals`; these are dashboard-only preview assets and are not passed into Remotion renders.
- Preview styling should reuse the shared subtitle preset tokens from `remotion/types/subtitles.ts` wherever possible.
- Selected style must remain visually obvious with a highlighted border and checkmark.
- Dashboard does not show separate font, text color, highlight color, or background controls; the selected style preset owns those values.

## Inputs NOT Collected

- No images needed
- No text/title input
- No audio-only uploads
- No thumbnail
- No topic or description

---

## Output Details

| Property | Value |
|----------|-------|
| Default size | 1080×1920 (9:16) |
| Supported aspect | 9:16 only (currently) |
| Max duration | 60 seconds |
| Min duration | 5 seconds |
| Duration source | Matches uploaded video length |
| Export format | MP4 (H.264 + AAC) |
| Audio handling | User's original video audio plays unchanged |
| Background music | OFF — user's video IS the content |

---

## Layout Rules

The Video Type renders one element only — the user's video as full-screen background with captions on top:

```
┌─────────────────────────────┐
│                             │
│                             │
│    USER'S VIDEO             │  ← full screen, objectFit: cover
│    (full 9:16 canvas)       │
│                             │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│   ┌─────────────────────┐   │
│   │  ANIMATED CAPTIONS  │   │  ← bottom safe zone (~70-85% down)
│   │  (word by word)     │   │
│   └─────────────────────┘   │
└─────────────────────────────┘
```

### Spacing
- Video: fills entire 1080×1920 canvas
- Captions: positioned in bottom third, safe zone for social media UI
- Caption padding: sufficient margins from edges (left/right: 40-60px)

### Caption Handling
- Word-level timing from Groq transcript
- No subtitle language dropdown. If the user uploads English speech, captions should be English; if the user uploads Hindi/Urdu/Hinglish speech, captions should follow the supported Roman Hindi/Urdu/Hinglish output.
- Do not promise translation/conversion to another language from this Video Type.
- Each word animates in (style-dependent: pop, fade, highlight)
- Active word highlighted, previous words remain visible in group
- Shorts Karaoke highlights only the currently spoken word by timestamp/index; previously spoken words return to normal gray text
- Groups of 3-5 words shown together (not one word at a time)

### Video Aspect Handling
- 9:16 video: fills perfectly
- 16:9 video: `objectFit: cover` (crops sides to fill)
- Square video: `objectFit: cover` (crops top/bottom)

---

## Color and Typography Rules

| Element | Style |
|---------|-------|
| Background | User's video (full-screen) |
| Caption text | Style-dependent (white, yellow, etc.) |
| Caption shadow | Drop shadow or stroke for readability |
| Active word | Highlighted color per style |
| Inactive words | Slightly dimmed or base color |

### Caption Styles Available
- 24 dashboard-visible styles: Eclipse, Hustle, Gold Pill, Studio Clean, One Word, Arctic Glow, Karaoke Fill, Shorts Karaoke, Reels Clean, Bold Highlight Strip, Shatter Drop, Pill Bounce, Marker Highlight, Metallic Gradient, Floating Serif, Cinematic, Hacker Type, Vollkorn, Midnight, Marigold, Pop Candy, Bold Fire, Typewriter, Split Color
- `Studio Clean` — Default stacked caption card, white text, yellow active word, dark compact background
- `Karaoke Fill` — Words fill left-to-right using the active highlight color
- `Shorts Karaoke` — YouTube Shorts-style white capsule, full phrase visible, active word dark/bold
- `Reels Clean` — native Reels-style clean white caption with subtle active-word emphasis
- `Bold Highlight Strip` — high-energy orange/yellow highlight strip for hook-heavy clips
- `Gold Pill` / `Pill Bounce` — Compact pill-style caption treatments
- `Marker Highlight` — Organic highlighter stroke behind each word, good for educational/finance explainers that need emphasis without a heavy box
- `Metallic Gradient` — Premium silver-gold gradient text for polished business, finance, and product-style clips
- `Floating Serif` — Calm no-background serif captions for premium, lifestyle, and trustworthy business videos
- `One Word` / `Bold Fire` — Single active word emphasis styles
- `Cinematic` / `Vollkorn` — calmer serif subtitle treatments
- All styles must stay inside the safe caption zone

### What Colors to Avoid
- No colored backgrounds behind the video
- No gradient overlays on the video
- No neon glow effects on captions
- Captions must be readable over any video content

---

## Motion Rules

| Element | Animation |
|---------|-----------|
| Video | Plays as-is (no zoom, no motion added) |
| Caption words | Pop/scale/fade in per word timing |
| Active word | Highlight animation (scale bump or color change) |
| Word groups | Smooth transition between groups |

### What Should NOT Animate
- The video itself — no zoom, pan, or effects added
- No intro/outro animations
- No title cards or overlays
- No transitions between "scenes" (there's only one scene)
- No particle effects or decorative motion
- No progress bar, click sound, split layout, blurred layout, or decorative frame

---

## Asset Rules

- No stock images
- No background music
- No sound effects
- No pre-loaded assets of any kind
- Only the user's uploaded video is used
- Caption styles defined in code, not as image assets

---

## Timeline / Scene Structure

Single-scene Video Type — no multi-scene timeline needed.

- Audio source = user's uploaded video audio
- Duration = video length (capped at 60s)
- Captions = word-level from Groq transcription
- No subtitle language selector in the dashboard; uploaded speech language drives the visible caption text through the supported Groq pipeline
- No AI planning needed — captions come directly from transcript word timing
- No overlayTimeline or scene planner
- Dashboard must not expose video layout, progress bar, or sound effect controls for this Video Type
- Caption preset selection should apply the preset's text, highlight, background, font, and size settings automatically
- Auto Caption skips the review/edit preview step and starts the final render directly after upload and style selection.
- Final Lambda render input props preserve `captionStyle`, `captionPosition`, and `fontSize`; font, text color, highlight color, and background color resolve from the selected preset unless an older/debug payload explicitly provides overrides.

## Fallback Rules

| Scenario | Behavior |
|----------|----------|
| No speech detected in video | Render video without captions (no error) |
| Transcription fails | Show error to user — don't render silently |
| Video too short (<5s) | Clamp to minimum duration |
| Video too long (>60s) | Trim to 60s |
| 16:9 video uploaded | Cover-crop to fill 9:16 canvas |
| No caption style selected | Use default style (Studio Clean) |
| Hindi/Hinglish audio | Produce Roman Hinglish captions (no Devanagari) |

---

## QA Checklist

- [ ] User's video renders full-screen without distortion
- [ ] Captions appear synced to speech (word-level timing)
- [ ] Active word is visually distinct from surrounding words
- [ ] Captions stay within safe zone (not behind social media UI)
- [ ] No extra visual elements appear (no titles, no cards, no overlays)
- [ ] Audio is unchanged from original video
- [ ] Caption style selection works and renders correctly
- [ ] Preset colors in the dashboard match the rendered output
- [ ] 16:9 video fills canvas properly (cover crop)
- [ ] 9:16 video fills canvas without letterboxing
- [ ] Long words don't overflow caption container
- [ ] Hindi/Hinglish audio produces Roman script captions
- [ ] Video with no speech renders cleanly (no broken caption UI)

---

## What to Avoid

- DO NOT add title cards, intro screens, or any text besides captions
- DO NOT add background music or sound effects
- DO NOT add explainer cards or visual elements
- DO NOT zoom, pan, or apply effects to the user's video
- DO NOT add a logo, watermark, or branding overlay
- DO NOT show captions in Devanagari script for Hindi audio
- DO NOT use sentence-level timing (must be word-level)
- DO NOT add transitions or scene breaks
- DO NOT use AI planning — this is a deterministic caption overlay
- DO NOT crop or resize the video differently per scene (there's one scene)
- DO NOT add progress bars, click sounds, video zoom, video drift, blur-background mode, split layout, or decorative video frames

## Video Type Value Proposition

The Video Type adds value through:
1. **Word-level sync** — precise timing from Groq transcript, not manual alignment
2. **Style variety** — multiple caption looks without editing software
3. **Speed** — instant captions vs. 15-30 min manual work
4. **Readability** — proper positioning, shadows, and safe zones

NOT through visual effects, AI-generated content, or added media.
