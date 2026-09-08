# Reference Note

This is a detailed Video Type spec. Start with `docs/ITNAVIDEO_MASTER_DOC.md` for the latest source of truth, then use this file for Auto Draw implementation details.

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

Create notes-style explainer pages from a voiceover. The full notes layout is prepared up front across 2-3 paper sheets, then headings, bullets, sketches, icons, underlines, and highlights are revealed one by one in sync with the speech.

## Who Uses It

- Educators explaining concepts visually
- Students creating study content
- Content creators making "draw my life" style videos
- Anyone who wants whiteboard explainer videos without drawing skill

## Viewer Expectation

The viewer sees clean paper sheets where notes appear step by step as the speaker explains something. It should feel like handwritten explainer notes are being built live, but internally all content is already positioned before render and only reveal animations run.

## What Problem It Solves

Whiteboard and notes explainer videos require drawing skill, layout decisions, and hours of timing work. This generates the notes layout automatically from any voiceover and syncs reveal animations to transcript timing.

## Why User Should Pay

- AI generates a prepared notes layout from transcript (no drawing skill needed)
- Synced to speech — prepared elements reveal at the right moment
- Professional paper-notes explainer look
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
- No subtitle language dropdown
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
| Premium style layer | Automatic education-style `styleLock` and sparse reveal-timed `soundCues` |

---

## Layout Rules

Black cinematic safe zones with a pure white notebook canvas in the middle. All content is pre-rendered as SVG/HTML elements on the canvas, starts invisible, and reveals progressively:

```
┌─────────────────────────────┐
│████████ TOP SAFE ZONE ███████│
│   ╭─────────────────────╮   │
│   │   WHITE NOTEBOOK    │   │
│   │   CANVAS            │   │
│   │   NOTE PAGE 1       │   │
│   │                     │   │
│   │   ┌── hidden ───┐  │   │  ← pre-laid-out elements
│   │   │  headings    │  │   │    reveal as speaker talks
│   │   │  bullets     │  │   │
│   │   └──────────────┘  │   │
│   │                     │   │
│   │   labels / text     │   │  ← short labels with drawings
│   │                     │   │
│   ╰─────────────────────╯   │
│██████ BOTTOM SAFE ZONE █████│
└─────────────────────────────┘
```

### Page / Element Structure
- 2 pages by default; 3 pages for longer or denser explainers
- Black top and bottom bars act as cinematic safe zones
- Middle canvas stays pure white with subtle notebook lines/dots
- All headings, bullets, sketches, arrows, icons, circles, underlines, and highlights are positioned before rendering
- Every element starts hidden unless its reveal time is 0
- Normal final renders keep diagnostic page tabs, progress bars, and revealed counts hidden; those overlays appear only when debug flags are enabled
- Long headings and wrapped bullets must stay inside the notes column and never overlap the right-side sketch/arrow area
- Transcript timing drives a `revealTimeline`
- Short text labels may accompany sketches
- SVG is used for sketch/arrow/circle stroke reveals
- HTML is used for text, bullets, headings, and highlight blocks
- Canvas API overlay adds marker/chalk texture during reveal moments

### Spacing
- Canvas: full width with clean margins
- Notes elements: fixed, readable positions inside the sheet
- No clutter — each scene has focused visual content

### Drawing Style
- Handwritten / sketch-note aesthetic
- Simple line art, not photo-realistic
- Clean and readable at mobile size
- Monochrome or limited color palette

---

## Color and Typography Rules

| Element | Style |
|---------|-------|
| Safe zones | Black cinematic bars top + bottom |
| Canvas | Pure white notebook canvas |
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
| Headings | Mask/wipe reveal |
| Bullets | Fade/slide reveal |
| Sketches/icons | Stroke-style reveal |
| Highlights | Highlight sweep + fade/scale |
| Underlines | Marker stroke draw |
| Circles | Circle burst |
| Arrows | Arrow draw |
| Texture overlay | Canvas API chalk/marker grain during reveals |
| Pen tip | Glow follows the active stroke/reveal |
| Page changes | Automatic page switch with page-flip transform based on prepared page timing |

### Premium Style Lock

Auto Draw uses the education-clean style lock by default. The renderer may add low-volume diegetic sounds tied to note events such as paper turns, marker-style reveals, typing, warnings, or final chimes. These cues must remain sparse and beneath the uploaded voiceover.

The premium treatment layer may add very light paper-like grain, vignette, and grade consistency. Camera motion should stay almost invisible; Auto Draw should feel breathable, not shaky.

### What Should NOT Animate
- No real-time drawing generation during render
- No bouncing or floating elements
- No spinning or rotating
- No particle effects
- No 3D effects
- No complex transitions
- Keep motion simple — draw in, done

---

## Asset Rules

- No pre-drawn images stored in template folder
- Notes plan generated from transcript via Gemini AI plus deterministic layout builder
- No stock images used
- No background music
- Subtle automatic diegetic SFX are allowed only from `public/assets/reusable/sound-effects/` through `soundCues`
- Template folder is code-only
- Gemini (free tier) handles scene planning

---

## Timeline / Scene Structure

Prepared notes timeline:

- Audio source = user's uploaded audio/video
- Duration = media length (capped at 60s)
- Scene planning = Gemini AI (free) analyzes transcript
- Layout builder converts scenes into 2-3 note pages
- Each page contains pre-positioned hidden elements
- `revealTimeline` controls when elements become visible
- `transcriptSegmentMapping` links transcript/caption segments to element IDs for diagnostics
- No traditional caption subtitles — the notes ARE the visual
- Do not show subtitle language controls for Auto Draw. Any visible notes/labels should follow the uploaded speech through the supported Groq/Gemini planning pipeline, not a user-selected subtitle language.
- Reveal animations simulate handwriting/auto-draw without generating live drawings

### AI Planning Flow
1. Groq transcribes audio → transcript
2. Gemini plans concise scenes from transcript
3. Deterministic layout builder prepares 2-3 note pages and fixed element positions
4. All elements are initially hidden
5. Remotion reveals elements from `revealTimeline` according to transcript timing

### Required Debug Logs
- `totalPagesGenerated`
- `totalElementsGenerated`
- `hiddenElementsCount`
- `revealTimelineCount`
- `transcriptSegmentMapping`

### Debug / QA Overlay
- Optional on-video debug UI can be enabled for founder/test renders with `debugAutoDraw`, `showDebugPanel`, or `showDebugControls`
- Top-right `Debug` button is visual only in rendered MP4/debug stills
- Debug panel shows total pages, total elements, hidden count, revealed count, reveal timeline count, transcript segment count, current time, active page, and active element
- Per-element tracker uses `✓` for revealed, `▶` for active reveal, and `○` for waiting
- Debug controls show visual `Play`, `Pause`, `Reset`, and speed chips `0.5x / 1x / 1.5x / 2x`
- Rendered MP4 controls are not clickable; they are diagnostic overlays for preview/testing

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
| Gemini returns empty plan | Use local overlay/caption scene builder, then prepared notes layout |

---

## QA Checklist

- [ ] Paper sheets render as background
- [ ] 2-3 pages are generated as needed
- [ ] Elements are pre-positioned and hidden before reveal
- [ ] Elements reveal progressively synced to speech
- [ ] Reveal animation is smooth and readable
- [ ] No traditional caption subtitles shown
- [ ] Page transitions are clean
- [ ] Audio plays at correct volume
- [ ] Gemini scene planning produces relevant notes content
- [ ] Debug logs include page/element/reveal/mapping counts
- [ ] Debug panel tracker shows `✓ / ▶ / ○` states when enabled
- [ ] Debug controls render cleanly when enabled and stay hidden in normal renders
- [ ] Page flip happens at prepared page boundary
- [ ] Pen-tip glow follows active stroke/reveal
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
- DO NOT add loud, continuous, or unrelated sound effects; any SFX must match visible reveal/page events
- DO NOT use dark or colored backgrounds
- DO NOT generate or draw elements in real time during render
- DO NOT clutter pages with too many elements
- DO NOT use photo-realistic imagery
- DO NOT add decorative borders or frames
- DO NOT use paid AI providers (use Gemini only — it's free)
- DO NOT fall back to empty/blank render if AI fails — show error
- DO NOT use OpenAI for any part of this Video Type

## Video Type Value Proposition

The Video Type adds value through:
1. **AI scene planning** — Gemini converts transcript to visual scenes (free)
2. **Prepared notes layout** — deterministic pages reduce render-time mistakes
3. **Reveal animation** — mask/stroke/fade effects give handwritten/auto-draw feel
4. **No drawing skill needed** — AI handles visual decisions
5. **Speech sync** — visuals appear at the right moment
6. **Educational clarity** — notes format is readable and fast to render

NOT through captions, stickers, stock imagery, or manual asset selection.
