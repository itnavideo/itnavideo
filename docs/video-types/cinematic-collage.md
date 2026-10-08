# Cinematic Collage

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Cinematic Collage |
| Internal ID | `IMAGE_STORY_COLLAGE` |
| Composition ID | `IMAGE-STORY-COLLAGE` |
| Dashboard Mode | `imageStoryCollage` |
| Category | Creator |

## Purpose

Turn audio or video into a cinematic visual experience — scene-by-scene imagery with text overlays, slow motion effects, and smooth transitions. Think movie trailer aesthetics applied to any voiceover content.

## Who Uses It

- Storytellers creating visual narratives from voiceover
- Motivational/inspirational content creators
- Podcast creators who want cinematic clip reels
- Anyone turning speech into visual content without face-on-camera

## Viewer Expectation

The viewer sees a cinematic, movie-like sequence of images with text beats appearing in sync with the narration. It should feel premium, emotional, and polished — like a short film or trailer.

## What Problem It Solves

Creating cinematic visual sequences from audio requires finding images, timing them to speech, adding motion effects, and designing text overlays. This automates the entire scene-by-scene assembly from a transcript.

## Why User Should Pay

- Cinematic motion design (slow zoom, pan) applied automatically
- Scene-by-scene planning from transcript
- Text beat overlays timed to speech
- Professional transitions between scenes
- No video editing or image sourcing skill needed

---

## Required User Inputs

| Input | Type | Required | Notes |
|-------|------|----------|-------|
| Audio or Video | Audio/Video file | Yes | Must contain speech for scene planning |

## Optional User Inputs

| Input | Type | Notes |
|-------|------|-------|
| Images | Image files | User can provide images for scenes |
| Topic/Title | Text | Context for scene planning |

## Inputs NOT Collected

- No comparison layout
- No sticker selection
- No caption style selection
- No thumbnail

---

## Output Details

| Property | Value |
|----------|-------|
| Default size | 1080×1920 (9:16) |
| Supported aspect | 9:16 only (currently) |
| Max duration | 60 seconds |
| Min duration | 8 seconds |
| Duration source | Matches uploaded audio/video length |
| Export format | MP4 (H.264 + AAC) |
| Audio handling | User's uploaded audio plays at full volume |
| Background music | OFF by default |

---

## Layout Rules

Each scene fills the full canvas with one strong image and minimal text:

```
┌─────────────────────────────┐
│                             │
│                             │
│    FULL-SCREEN IMAGE        │  ← one image per scene, cover fill
│    (with cinematic motion)  │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│                             │
│    TEXT BEAT OVERLAY         │  ← short text synced to speech
│    (minimal, impactful)     │
│                             │
└─────────────────────────────┘
```

### Scene Structure
- One strong image per scene (not collages or grids)
- Text overlay: short, impactful phrase from speech content
- Scenes transition smoothly (crossfade, slide, or cut)
- Each scene lasts 3-8 seconds based on transcript segments

### Spacing
- Image: fills entire 1080×1920 canvas (cover)
- Text: positioned in lower third or centered, with breathing room
- Text padding: left/right 60px minimum, safe from edges

### Text Beat Handling
- NOT traditional captions — these are scene "beats" / key phrases
- One short text beat per scene (5-15 words max)
- Timed to the most impactful moment in each scene's audio
- Styled cinematically (large, clean, minimal)

---

## Color and Typography Rules

| Element | Style |
|---------|-------|
| Background | Full-screen scene image |
| Vignette | Dark edges for text readability |
| Text color | White with strong shadow or stroke |
| Text font | Clean, bold, cinematic (not handwritten) |
| Transitions | Smooth crossfade or slide between scenes |

### What Colors to Avoid
- No bright colored text (keep white/off-white only)
- No colored overlays on images
- No gradient text
- No busy decorative elements over the images
- Let the images breathe

---

## Motion Rules

| Element | Animation |
|---------|-----------|
| Scene images | Slow zoom in OR slow pan (Ken Burns effect) |
| Text beats | Fade in + subtle scale or slide |
| Transitions | Crossfade between scenes (0.5-1s) |
| Overall | Smooth, slow, cinematic pace |

### What Should NOT Animate
- No fast movements or jerky transitions
- No bouncing or popping effects
- No spinning or rotating
- No particle effects
- No rapid text animations (typewriter, etc.)
- Motion should be SLOW and CINEMATIC — never energetic

---

## Asset Rules

- Images from user uploads or scene planning
- No pre-loaded stock images in template folder
- No background music added by default
- No sound effects
- One strong image per scene — quality over quantity
- Template folder is code-only

---

## Timeline / Scene Structure

Multi-scene timeline driven by transcript:

- Audio source = user's uploaded audio/video
- Duration = media length (capped at 60s)
- Scenes planned from transcript segments
- Each scene: 1 image + 1 text beat + cinematic motion
- No traditional word-level captions — text beats replace them
- Scene transitions: smooth crossfade

## Fallback Rules

| Scenario | Behavior |
|----------|----------|
| Not enough images for scenes | Reuse images with different motion direction |
| No images provided | Use dark gradient backgrounds with text only |
| Transcription fails | Show error — can't plan scenes without transcript |
| Audio too short (<8s) | Clamp to minimum, single scene |
| Audio too long (>60s) | Trim to 60s |
| Scene text too long | Truncate to 15 words max |
| Hindi/Hinglish audio | Roman Hinglish text beats |
| No speech detected | Show error — speech required for scene planning |

---

## QA Checklist

- [ ] Each scene shows one strong full-screen image
- [ ] Images have cinematic motion (slow zoom or pan)
- [ ] Text beats appear synced to speech content
- [ ] Text is readable over images (shadow/vignette working)
- [ ] Transitions between scenes are smooth
- [ ] Audio plays at correct volume throughout
- [ ] No traditional caption subtitles appear (only text beats)
- [ ] Motion is slow and cinematic, never jerky
- [ ] All content stays within safe zones
- [ ] Scene duration feels natural (not too fast, not too slow)
- [ ] Hindi/Hinglish produces Roman script text beats
- [ ] Image cover-fill doesn't distort important content

---

## What to Avoid

- DO NOT add traditional subtitle captions
- DO NOT use multiple images per scene (one image per scene only)
- DO NOT add fast/energetic motion — keep it SLOW and cinematic
- DO NOT add background music
- DO NOT add decorative overlays (borders, frames, shapes)
- DO NOT use tiny text — text beats should be large and impactful
- DO NOT pack too much text into one scene
- DO NOT make scenes shorter than 3 seconds
- DO NOT use low-quality or stretched images
- DO NOT use Devanagari script for Hindi/Hinglish content

## Video Type Value Proposition

The Video Type adds value through:
1. **Cinematic motion** — Ken Burns zoom/pan that makes static images feel alive
2. **Scene planning** — intelligent scene splitting from transcript
3. **Text beats** — impactful phrases timed to speech
4. **Transitions** — smooth professional crossfades
5. **Premium feel** — movie trailer aesthetics from simple audio

NOT through captions, stickers, comparison layouts, or added UI elements.
