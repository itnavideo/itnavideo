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
| Promo Clip | Video/Audio | Yes | The actual media to promote (10-60s) |

## Optional User Inputs

| Input | Type | Notes |
|-------|------|-------|
| Subtitle | Text | Secondary line below title |
| Video Duration | Text (MM:SS) | Shows as badge on thumbnail |

## Inputs NOT Collected (Removed)

These were previously in the form but are no longer rendered:
- Channel name
- Subscriber count
- CTA text
- Channel logo
- Chips/badges

---

## Output Details

| Property | Value |
|----------|-------|
| Default size | 1080×1920 (9:16) |
| Supported aspect | 9:16 only (currently) |
| Max duration | 60 seconds |
| Min duration | 8 seconds |
| Duration source | Matches uploaded media length |
| Export format | MP4 (H.264 + AAC) |
| Audio handling | User's uploaded clip audio plays at full volume |
| Background music | OFF by default (user's clip already has audio) |

---

## Layout Rules

The template renders exactly 3 elements vertically:

```
┌─────────────────────────────┐
│                             │
│      THUMBNAIL (16:9)       │  ← top: 60px, left/right: 40px
│      + play button          │
│      + optional duration    │
│                             │
├─────────────────────────────┤
│                             │
│         TITLE               │  ← top: 650px, centered
│     (optional subtitle)     │
│                             │
├─────────────────────────────┤
│                             │
│      UPLOADED VIDEO         │  ← fills remaining space
│      (promo clip)           │
│                             │
│                             │
└─────────────────────────────┘
```

### Spacing
- Thumbnail: `top: 60px`, `left/right: 40px`
- Title: `top: 650px`, `left/right: 44px`
- Video clip: depends on aspect ratio
  - Landscape (16:9): `top: 820px`, `left/right: 40px`, `bottom: 80px`
  - Portrait (9:16): `top: 790px`, `left/right: 60px`, `bottom: 30px`

### Title Handling
- Max 60 characters (truncated with ellipsis)
- Font size scales: >40 chars = 38px, >28 chars = 44px, else 50px
- Max 2 lines visible (`maxHeight: 2.4em`, `overflow: hidden`)
- No title should ever go outside the screen

### Video Aspect Handling
- 16:9 clip: `objectFit: contain` (fits within frame, no stretching)
- Vertical clip: `objectFit: cover` (fills the space, crops edges)
- Background matches the media (blurred video or blurred thumbnail)

---

## Color and Typography Rules

| Element | Style |
|---------|-------|
| Background | Blurred version of uploaded video/thumbnail |
| Vignette | Radial gradient (transparent center, dark edges) |
| Title color | `#ffffff` with text shadow |
| Subtitle color | `rgba(255,255,255,0.6)` |
| Thumbnail border | `rgba(255,255,255, 0.2-0.35)` with glow pulse |
| Play button | Dark glass circle with white triangle |
| Duration badge | Dark bg, white text, small |
| Caption overlay | Dark pill with white text at bottom |

### What Colors to Avoid
- No bright colored backgrounds
- No gradient borders on the video
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
| Border | Very subtle glow pulse (0.4-0.7 opacity) |
| Background | Static (blurred, no motion needed) |

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
- No sound effects added by default
- Only user-provided media is used
- Thumbnail resolved via `staticFile()` for local, HTTPS for production
- No assets stored inside the template folder

---

## Timeline / Scene Structure

This template is simple — no multi-scene timeline needed.

- Audio source = user's uploaded clip
- Duration = clip length (capped at 60s)
- Captions = word-grouped from Groq transcription (optional, only if speech detected)
- No overlayTimeline-driven scenes (unlike Compare Explainer)
- No AI planning needed

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
| No captions | No caption overlay shown (graceful) |

---

## QA Checklist

- [ ] 16:9 thumbnail renders at top with correct aspect
- [ ] Long title (80+ chars) truncates safely, no overflow
- [ ] Short title (10 chars) displays at large font size
- [ ] 16:9 video clip does not stretch vertically
- [ ] Vertical/reel clip fills remaining space properly
- [ ] Background matches the uploaded media (blurred)
- [ ] No old UI elements visible (no channel name, no subscribe, no badges)
- [ ] Captions appear in safe zone at bottom when available
- [ ] Video audio plays at correct volume
- [ ] Duration badge shows only when user provides it
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
- DO NOT add sound effects

## Template Value Proposition

The template adds value through:
1. **Motion design** — smooth reveal animations, float, shine
2. **Premium layout** — proper spacing, safe zones, clean typography
3. **Smart media handling** — blurred matching background, aspect-aware sizing
4. **Title intelligence** — auto-truncate, font scaling, max-lines
5. **Duration awareness** — renders match clip length exactly

NOT through extra clutter, random UI, or forced text.
