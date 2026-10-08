# Video Simple Explainer

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Video Simple Explainer |
| Internal ID | `VIDEO_SIMPLE_EXPLAINER` |
| Composition ID | `VIDEO-SIMPLE-EXPLAINER` |
| Dashboard Mode | `videoExplainer` |
| Category | Creator |

## Purpose

Present a video or audio recording with an AI-generated visual layout that includes subtitles, a title/topic, and an optional bottom explanation image. It's a simple explainer wrapper around the user's media.

## Who Uses It

- Educators explaining a topic with a screen recording or talking head
- Creators who want a branded layout around their video
- Anyone presenting audio content with a supporting image
- Users who want a "video + notes" style explainer reel

## Viewer Expectation

The viewer sees the creator's video playing at the top with a clean title and captions below it — optionally with a supporting image. It should feel like a polished educational/explainer reel.

## What Problem It Solves

Posting raw video with no context looks amateur. Adding a title, captions, and supporting visual manually requires editing. This wraps the user's content in a clean explainer layout instantly.

## Why User Should Pay

- Professional explainer layout in seconds
- Auto-synced captions from speech
- Title and supporting image placement handled
- No editing software needed
- Clean, branded look for educational content

---

## Required User Inputs

| Input | Type | Required | Notes |
|-------|------|----------|-------|
| Video or Audio | Video/Audio file | Yes | Must contain speech for captions |

## Optional User Inputs

| Input | Type | Notes |
|-------|------|-------|
| Explanation Image | Image (PNG/JPG/WebP) | Shown at bottom as supporting visual |
| Title/Topic | Text | Displayed below the video |

## Inputs NOT Collected

- No comparison images
- No sticker selection
- No background image
- No channel name or branding fields

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
| Audio handling | User's uploaded audio plays at full volume |
| Background music | OFF by default |

---

## Layout Rules

The Video Type arranges content vertically — video at top, info in middle, optional image at bottom:

```
┌─────────────────────────────┐
│                             │
│      USER'S VIDEO           │  ← top portion (~40-50% of canvas)
│      (or audio visualizer)  │
│                             │
├─────────────────────────────┤
│                             │
│      TITLE / TOPIC          │  ← text area
│                             │
├─────────────────────────────┤
│                             │
│      CAPTIONS               │  ← synced to speech
│      (word-grouped)         │
│                             │
├─────────────────────────────┤
│                             │
│      BOTTOM IMAGE           │  ← optional explanation image
│      (user-uploaded only)   │
│                             │
└─────────────────────────────┘
```

### Spacing
- Video: top portion of canvas, proper margins
- Title: below video, centered, readable font size
- Captions: middle/lower area, safe zone placement
- Bottom image: if provided, fills lower section with proper padding

### Video Handling
- User's video fills the top section
- If audio-only, show a visual placeholder or waveform in the video area
- Landscape video: fits within top box (contain)
- Portrait video: crops to fit top box (cover)

### Overlay Timeline
- Uses overlay timeline from local planner for visual arrangement
- Only shows user-uploaded image (never random planner-generated images)

---

## Color and Typography Rules

| Element | Style |
|---------|-------|
| Background | Clean solid or subtle gradient |
| Title text | White or light, bold, readable |
| Caption text | White on semi-transparent dark pill |
| Bottom image | Contained with subtle border/shadow |
| Overall feel | Clean, educational, minimal |

### What Colors to Avoid
- No busy or patterned backgrounds
- No neon colors
- No gradient text
- Background should support readability, not distract

---

## Motion Rules

| Element | Animation |
|---------|-----------|
| Video | Plays normally (no added effects) |
| Title | Fade/slide in at start |
| Captions | Fade per word group |
| Bottom image | Gentle fade in when it appears |

### What Should NOT Animate
- No continuous floating or bouncing
- No zoom effects on the video
- No particle effects
- No spinning or rotating elements
- No typewriter text effect

---

## Asset Rules

- Only user-uploaded image shown at bottom (if provided)
- No stock images or AI-generated images
- No background music
- No sound effects
- No pre-loaded assets
- Template folder is code-only

---

## Timeline / Scene Structure

- Audio source = user's uploaded video/audio
- Duration = media length (capped at 60s)
- Captions = from Groq transcription
- Overlay timeline from local planner determines visual arrangement
- No multi-scene planning needed for basic renders
- Key rule: Only user-uploaded images appear — never random images from planner

## Fallback Rules

| Scenario | Behavior |
|----------|----------|
| No title provided | Hide title area (don't show placeholder text) |
| No bottom image | Hide bottom section, expand caption area |
| Audio-only input | Show clean placeholder in video area |
| Transcription fails | Show error — don't render without captions |
| Media too short (<8s) | Clamp to minimum 8s |
| Media too long (>60s) | Trim to 60s |
| 16:9 video | Contain within top box (letterbox if needed) |
| 9:16 video | Cover-crop to fit top box |
| Hindi/Hinglish audio | Roman Hinglish captions |

---

## QA Checklist

- [ ] User's video renders in top portion without distortion
- [ ] Title displays below video when provided
- [ ] Captions are synced to speech timing
- [ ] Bottom image shows only when user uploaded one
- [ ] No random/AI-generated images appear
- [ ] Audio plays at correct volume
- [ ] Layout elements don't overlap
- [ ] Long title truncates gracefully
- [ ] Safe zones respected (no content behind social UI)
- [ ] Audio-only input renders with clean visual placeholder
- [ ] Hindi/Hinglish produces Roman captions
- [ ] Video aspect ratios handled correctly (16:9 and 9:16)

---

## What to Avoid

- DO NOT show random images from the planner — only user-uploaded images
- DO NOT add background music
- DO NOT add decorative elements (borders, shapes, particles)
- DO NOT stretch the video to fill the entire canvas
- DO NOT use AI-generated images as the bottom visual
- DO NOT add channel branding or logos
- DO NOT show empty image placeholder when no image is provided
- DO NOT add sound effects
- DO NOT use Devanagari for Hindi/Hinglish captions

## Video Type Value Proposition

The Video Type adds value through:
1. **Clean layout** — structured video + title + captions + image arrangement
2. **Auto captions** — synced to speech without manual timing
3. **Simplicity** — upload video, optionally add image, done
4. **Professional look** — proper spacing, typography, safe zones

NOT through AI-generated visuals, fancy effects, or added media the user didn't provide.
