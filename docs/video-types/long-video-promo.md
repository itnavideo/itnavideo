# Reference Note

This is a detailed Video Type spec. Start with `docs/ITNAVIDEO_MASTER_DOC.md` for the latest source of truth, then use this file for Long Video Promo implementation details.

# Long Video Promo

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Long Video Promo |
| Internal ID | `LONG_VIDEO_PROMO` |
| Composition ID | `LONG-VIDEO-PROMO` |
| Dashboard Mode | `longVideoPromo` |
| Category | Creator |

## Purpose

Promote a long-form video (YouTube video, podcast episode, lecture, song, noha, munajat, bayan) as a short 9:16 reel that drives viewers to watch the full content.

## Who Uses It

- YouTube creators promoting new videos
- Podcast creators promoting episodes
- Religious content creators (noha, munajat, bayan)
- Educators promoting courses/lectures
- Musicians promoting songs/albums
- Anyone with long content who needs a short promo reel

## Viewer Expectation

The viewer sees a premium promo reel and thinks: "This looks good, I want to watch the full video." It should feel like a movie trailer for the creator's content.

## What Problem It Solves

Creators have long videos but struggle to promote them on short-form platforms (Instagram Reels, YouTube Shorts, TikTok). Manually editing a 30s promo from a 15-minute video takes time and skill.

## Why User Should Pay

- Saves 30-60 minutes of manual editing
- Professional motion design they can't do themselves
- Works with any content type (music, lecture, podcast, YouTube)
- Ready to post immediately

---

## Required User Inputs

| Input | Type | Required | Notes |
|-------|------|----------|-------|
| Thumbnail | Image (PNG/JPG/WebP) | Yes | 16:9 recommended (1280×720) |
| Title | Text | Yes | Max 60 characters displayed |
| Promo Clip | Video | Yes | The actual video clip to promote (10-60s) |

## Optional User Inputs

None. Long Video Promo intentionally stays simple: thumbnail, title, and promo video only.

## Inputs NOT Collected (Removed)

These were previously in the form but are no longer rendered:
- Channel name
- Subscriber count
- CTA text
- Channel logo
- Chips/badges
- Captions/subtitles
- Subtitle language
- Duration badge
- Background music

---

## Output Details

| Property | Value |
|----------|-------|
| Default size | 1080×1920 (9:16) |
| Supported aspect | 9:16 only (currently) |
| Max duration | 60 seconds |
| Min duration | 8 seconds |
| Duration source | Browser-read uploaded media duration, capped to 60s |
| Export format | MP4 (H.264 + AAC) |
| Audio handling | User's uploaded video audio plays at full volume |
| Background music | Not used |
| Premium style layer | Automatic promo/luxury `styleLock` and sparse reveal `soundCues` |

---

## Layout Rules

The Video Type renders exactly 3 elements vertically, but only the top thumbnail is allowed to look framed:

```
┌─────────────────────────────┐
│                             │
│      THUMBNAIL (16:9)       │  ← top: 60px, left/right: 40px
│      + play button          │
│      + optional duration    │
│                             │
├─────────────────────────────┤
│                             │
│         TITLE               │  ← typography integrated into design, no border box
│                             │
├─────────────────────────────┤
│      UPLOADED VIDEO         │  ← borderless cinematic stage, starts below title
│      (promo clip)           │
│                             │
│                             │
└─────────────────────────────┘
```

### Spacing
- Thumbnail: `top: 60px`, `left/right: 40px`
- Title: stacked below thumbnail with a clean `26px` margin
- Video clip: stacked directly below title with a clean `18px` margin
- Do not use fixed video `top` offsets that create blank space between title and video
- Vertical/reel clips may extend toward the bottom naturally
- Landscape, 4:5, and square clips still start immediately below the title
- Border/frame is acceptable for the top thumbnail only
- Do not use a visible border box around the title
- Do not use a hard/thick visible border around the lower video clip
- The lower video should sit in a borderless cinematic media stage with blurred fill behind the preserved-aspect clip

### Title Handling
- Max 60 characters (truncated with ellipsis)
- Font size scales: >40 chars = 38px, >28 chars = 44px, else 50px
- Max 2 lines visible (`maxHeight: 2.4em`, `overflow: hidden`)
- No title should ever go outside the screen

### Video Aspect Handling
- 16:9 clip: `objectFit: contain` (fits within frame, no stretching)
- 4:5 clip: preserved in a 4:5 frame, anchored under the title
- Square clip: preserved in a 1:1 frame, anchored under the title
- Vertical clip: `objectFit: cover` (fills the space, crops edges)
- Background uses the uploaded thumbnail by default for speed; the uploaded video remains the promoted media
- Empty areas around non-vertical clips must be filled with blurred video/thumbnail, not black gaps
- Mixed aspect ratios should feel naturally placed rather than boxed

---

## Color and Typography Rules

| Element | Style |
|---------|-------|
| Background | Blurred uploaded thumbnail by default; avoids repeatedly decoding the same uploaded video |
| Vignette | Radial gradient (transparent center, dark edges) |
| Title background | No hard box. Use typography, soft media-matched glow, underline/accent, spacing, and shadow |
| Title color | Warm off-white (`#F8FAFC`) with text shadow |
| Title accent | Subtle underline/glow only; no bordered container |
| Thumbnail border | `rgba(255,255,255, 0.2-0.35)` with glow pulse |
| Lower clip border | None. Use blurred fill, gradients, soft masks, and drop shadow instead |
| Play button | Dark glass circle with white triangle |

### What Colors to Avoid
- No bright colored backgrounds
- No gradient borders on the video
- No hard border box around the title
- No hard border around the lower clip
- No neon glow
- No colored text (keep white/muted only)
- Background should MATCH the media, not compete with it

---

## Motion Rules

| Element | Animation |
|---------|-----------|
| Thumbnail | Slow zoom in (1.06 → 1.0), fade in 0-14 frames, shine sweep at frame 30-55 |
| Title | Spring slide-up (24px → 0), fades in at frame 10-26 |
| Video clip | Spring scale-in, gentle continuous float (sine wave) |
| Thumbnail border | Very subtle glow pulse (0.4-0.7 opacity) |
| Background | Static (blurred, no motion needed) |

### Premium Style Lock

Long Video Promo receives a deterministic `styleLock` on the fast path. The style lock keeps title treatment, accent color, motion pacing, and sound cues in one premium promo language. Sound cues are limited to moments such as thumbnail reveal, title reveal, promo clip reveal, and outro lift.

The renderer applies LUT-like grade consistency, subtle grain/vignette, media depth, and controlled Ken Burns movement. For stability, the default fast render decodes the uploaded clip only once and uses thumbnail-based blur layers instead of repeated video blur layers. Pacing should leave short breath moments after the title reveal before the promo clip becomes the main focus.

### What Should NOT Animate
- Background should not move or pulse
- No particle effects
- No spinning elements
- No bouncing arrows or text
- No typewriter effect on title (just fade/slide)

---

## Asset Rules

- No random stock images
- No pre-loaded background music
- Subtle automatic promo SFX are allowed through `soundCues`; background music is not used
- Only user-provided media is used
- Thumbnail resolved via `staticFile()` for local, HTTPS for production
- No assets stored inside the template folder

---

## Fast Render Pipeline

This Video Type is simple and uses a deterministic fast path.

- Audio source = user's uploaded video clip
- Duration = clip length from browser metadata (clamped to 8-60s)
- Captions/subtitles = not used in this video type
- Transcription = skipped
- Subtitle language/translation logic = skipped
- AI planning = skipped
- Background music = skipped by default
- Render uses the uploaded thumbnail for blurred background layers so the uploaded clip is decoded only once in the main media stage
- No overlayTimeline-driven scenes (unlike Compare Explainer)
- No FFmpeg planning clip is created for the default path

## Fallback Rules

| Scenario | Behavior |
|----------|----------|
| Missing thumbnail | Dark gradient placeholder shown |
| Missing title | "Watch Full Video" default |
| Missing video clip | Thumbnail echo as placeholder with "▶ Promo clip area" label |
| Long title (>60 chars) | Truncated with ellipsis |
| 16:9 video uploaded | `objectFit: contain` — no stretching |
| Vertical video uploaded | `objectFit: cover` — fills space |
| Short video (<8s) | Duration clamped to minimum 8s |
| 60-second video | Renders full 60s |
| Caption/subtitle request | Ignored; this video type renders thumbnail, title, and promo video only |

---

## QA Checklist

- [ ] 16:9 thumbnail renders at top with correct aspect
- [ ] Long title (80+ chars) truncates safely, no overflow
- [ ] Short title (10 chars) displays at large font size
- [ ] 16:9 video clip does not stretch vertically
- [ ] 16:9 video clip has blurred fill behind it, no black gaps
- [ ] Vertical/reel clip fills remaining space properly
- [ ] 4:5 video clip preserves its aspect ratio without a hard border
- [ ] Square video clip preserves its aspect ratio without a hard border
- [ ] Background matches the uploaded media (blurred)
- [ ] Title is typography-led with no visible bordered title box
- [ ] Lower video area has no hard border or boxed frame
- [ ] No old UI elements visible (no channel name, no subscribe, no badges)
- [ ] No captions/subtitles appear
- [ ] No transcription or AI planning runs in the render path
- [ ] Video audio plays at correct volume
- [ ] Play button visible on thumbnail
- [ ] Shine sweep animation runs once smoothly
- [ ] Title slide-up animation is smooth
- [ ] No content goes outside screen boundaries on mobile preview

---

## What to Avoid

- DO NOT add channel name, subscriber count, or subscribe button
- DO NOT add background music by default (user's clip has its own audio)
- DO NOT add "Full Guide" or "New Video" chips/badges
- DO NOT add random CTA text the user didn't provide
- DO NOT add decorative circles, particles, or glassmorphism
- DO NOT force any text the user did not input
- DO NOT stretch 16:9 content to fill 9:16 canvas
- DO NOT use random stock images as background
- DO NOT add loud or unrelated sound effects; SFX must be sparse and tied to actual reveal/motion events

## Video Type Value Proposition

The Video Type adds value through:
1. **Motion design** — smooth reveal animations, float, shine
2. **Premium layout** — proper spacing, safe zones, clean typography
3. **Smart media handling** — blurred matching background, aspect-aware sizing
4. **Title intelligence** — auto-truncate, font scaling, max-lines
5. **Duration awareness** — renders match clip length exactly

NOT through extra clutter, random UI, or forced text.
