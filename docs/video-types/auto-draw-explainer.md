# Auto Draw Explainer

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Auto Draw Explainer |
| Internal ID | `AUTO_DRAW_EXPLAINER` |
| Composition ID | `AUTO-DRAW-EXPLAINER` |
| Dashboard Mode | `autoDraw` |
| Category | Education |

## Purpose

Create whiteboard-style animated scenes from a voiceover. As the speaker talks, hand-drawn style illustrations appear on a white canvas synced to the speech — like a whiteboard explainer video.

## Who Uses It

- Educators explaining concepts visually
- Students creating study content
- Content creators making "draw my life" style videos
- Anyone who wants whiteboard explainer videos without drawing skill

## Viewer Expectation

The viewer sees a clean white canvas where drawings appear progressively as the speaker explains something. It should feel like watching someone sketch on a whiteboard in real time — educational, engaging, and clear.

## What Problem It Solves

Whiteboard explainer videos require drawing skill, animation software, and hours of work to time illustrations to speech. This generates them automatically from any voiceover using AI scene planning.

## Why User Should Pay

- AI generates scene drawings from transcript (no drawing skill needed)
- Synced to speech — illustrations appear at the right moment
- Professional whiteboard explainer look
- Gemini AI planning is free to run
- No animation software or manual timing needed

---

## Required User Inputs

| Input | Type | Required | Notes |
|-------|------|----------|-------|
| Audio or Video | Audio/Video file | Yes | Must contain speech for scene planning |

## Optional User Inputs

| Input | Type | Notes |
|-------|------|-------|
| Topic/Title | Text | Helps AI plan scenes with better context |

## Inputs NOT Collected

- No images needed (scenes generated from transcript)
- No sticker selection
- No caption style
- No comparison items
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
| AI Provider | Gemini (free) for scene planning |

---

## Layout Rules

White canvas with drawn elements appearing progressively:

```
┌─────────────────────────────┐
│                             │
│   ╭─────────────────────╮   │
│   │                     │   │
│   │   WHITE CANVAS      │   │
│   │                     │   │
│   │   ┌─── drawn ───┐  │   │  ← elements appear as
│   │   │  elements    │  │   │    speaker talks
│   │   │  appear here │  │   │
│   │   └──────────────┘  │   │
│   │                     │   │
│   │   labels / text     │   │  ← short labels with drawings
│   │                     │   │
│   ╰─────────────────────╯   │
│                             │
└─────────────────────────────┘
```

### Scene Structure
- White/clean canvas background
- Drawn elements appear progressively as speech advances
- Each scene corresponds to a transcript segment
- Elements "draw in" (progressive reveal animation)
- Short text labels may accompany drawings

### Spacing
- Canvas: full width with clean margins
- Drawn elements: centered, properly sized
- No clutter — each scene has focused visual content

### Drawing Style
- Hand-drawn / sketch aesthetic
- Simple line art, not photo-realistic
- Clean and readable at mobile size
- Monochrome or limited color palette

---

## Color and Typography Rules

| Element | Style |
|---------|-------|
| Background | White or very light (paper-like) |
| Drawing strokes | Dark (black/dark gray) |
| Labels | Clean, handwritten-style font |
| Accent color | One highlight color for emphasis (optional) |
| Overall | Clean, minimal, whiteboard aesthetic |

### What Colors to Avoid
- No dark backgrounds
- No gradient backgrounds
- No colorful/busy scenes
- No neon or saturated colors
- Keep it clean and paper-like

---

## Motion Rules

| Element | Animation |
|---------|-----------|
| Drawings | Progressive reveal / draw-in effect |
| Labels | Fade in after their associated drawing |
| Scene transitions | Quick fade or wipe to next scene |
| Elements | Appear in sync with speech timing |

### What Should NOT Animate
- No bouncing or floating elements
- No spinning or rotating
- No particle effects
- No 3D effects
- No complex transitions
- Keep motion simple — draw in, done

---

## Asset Rules

- No pre-drawn images stored in template folder
- Scenes generated from transcript via Gemini AI
- No stock images used
- No background music
- No sound effects (no pencil scratching sounds)
- Template folder is code-only
- Gemini (free tier) handles scene planning

---

## Timeline / Scene Structure

AI-planned multi-scene timeline:

- Audio source = user's uploaded audio/video
- Duration = media length (capped at 60s)
- Scene planning = Gemini AI (free) analyzes transcript
- Each scene: drawn elements + optional labels synced to speech segment
- No traditional caption subtitles — the drawings ARE the visual
- Progressive reveal within each scene

### AI Planning Flow
1. Groq transcribes audio → transcript
2. Gemini plans scenes from transcript (what to draw per segment)
3. Scenes rendered with progressive draw-in animations
4. Timed to speech segments

## Fallback Rules

| Scenario | Behavior |
|----------|----------|
| Gemini planning fails | Show error — can't render without scene plan |
| Transcription fails | Show error — can't plan without transcript |
| Audio too short (<8s) | Clamp to minimum, single scene |
| Audio too long (>60s) | Trim to 60s |
| No speech detected | Show error — speech required |
| Too many scenes planned | Merge short scenes together |
| Hindi/Hinglish audio | Roman Hinglish labels if text included |
| Gemini returns empty plan | Show error with retry option |

---

## QA Checklist

- [ ] White/clean canvas renders as background
- [ ] Drawings appear progressively synced to speech
- [ ] Draw-in animation is smooth and readable
- [ ] No traditional caption subtitles shown
- [ ] Scene transitions are clean
- [ ] Audio plays at correct volume
- [ ] Gemini scene planning produces relevant visuals
- [ ] Labels/text are readable at mobile size
- [ ] Each scene has focused content (not cluttered)
- [ ] Elements don't overflow canvas boundaries
- [ ] Hindi/Hinglish audio handled correctly
- [ ] No pre-drawn images or stock photos appear

---

## What to Avoid

- DO NOT use pre-drawn images or stock photos
- DO NOT add traditional subtitle captions
- DO NOT add background music
- DO NOT add sound effects (no pencil sounds)
- DO NOT use dark or colored backgrounds
- DO NOT clutter scenes with too many elements
- DO NOT use photo-realistic imagery
- DO NOT add decorative borders or frames
- DO NOT use paid AI providers (use Gemini only — it's free)
- DO NOT fall back to empty/blank render if AI fails — show error
- DO NOT use OpenAI for any part of this template

## Template Value Proposition

The template adds value through:
1. **AI scene planning** — Gemini converts transcript to visual scenes (free)
2. **Draw-in animation** — progressive reveal gives whiteboard feel
3. **No drawing skill needed** — AI handles visual decisions
4. **Speech sync** — visuals appear at the right moment
5. **Educational clarity** — whiteboard format proven for learning

NOT through captions, stickers, stock imagery, or manual asset selection.
