# Faceless Video Engine — Master Index & Locked Decisions

**Read this file first.** It explains how the spec files fit together, which decisions are final (so no two files contradict), and why your current output looks plain.

---

## 1. How to use these files

| File | Audience | Purpose |
|---|---|---|
| `00_INDEX_AND_DECISIONS.md` | Everyone | Locked values, glossary, diagnosis, build order |
| `01_LAYOUT_CATALOG.md` | AI planner + developer + editor | Every scene layout: triggers, slots, geometry, choreography, duration |
| `02_AI_PLANNER_AND_ROUTER.md` | AI engineer / prompt writer | How the AI picks layouts, fills slots, avoids monotony; full prompts; validators |
| `03_DESIGN_SYSTEM_AND_POLISH.md` | Designer + front-end dev | Tokens, typography, captions, backgrounds, depth, motion, SFX wiring |
| `04_IMPLEMENTATION_GUIDE.md` | Developer | Folder structure, schemas, Remotion code, step-by-step build, testing, debugging |

**Rule:** if a number (margin, spring, ducking %, etc.) appears in more than one file, the value in section 3 of THIS file wins. Do not redefine values elsewhere; reference the token name.

**How to give these to an AI coding agent (Cursor, Claude Code, etc.):** give it file 00 + the one file for the task. Do not paste all five at once for a small task. Example: "Implement StatScene using 00 and 01 (section L03) and 04 (section 5)."

---

## 2. Diagnosis: why only a few elements show and output looks unpolished

Your spec defines layers, assets, and fonts, but the *connection* between "what the AI decides" and "what the renderer draws" is weak. These are the most likely root causes. Verify each one in your code.

1. **The scene schema allows too little.** If the AI output per scene is `{ heading, text, svgId }`, the renderer can only ever draw a heading, text, and one SVG. Fix: scenes must contain an `elements[]` array with slots (see file 01 and 04).
2. **Layouts are named but not enforced.** The planner outputs `layoutId: "StatScene"`, but the renderer falls back to a default component when slots are missing or the ID is unknown. Fix: a strict layout registry plus validation that rejects unknown IDs and under-filled scenes (file 02, section 7).
3. **The planner prompt does not contain the layout catalog.** The LLM cannot choose layouts it has never seen with their slots. Fix: inject a compact catalog into the prompt (file 02, section 4).
4. **No density rule.** Nothing says "a 6-second scene needs at least N elements and M visual beats", so the model takes the lazy path (heading + body + stickman). Fix: density budget per duration (file 01, section 2).
5. **Asset registry is too small.** When `usedAssetIds` runs out, the fallback silently reuses the stickman. Fix: fallback ladder that generates procedural graphics or switches layout, never reuses (file 02, section 8).
6. **Everything enters at scene start.** Without anchoring to word timestamps, the scene feels like a slide. Fix: elements enter on the spoken keyword (`anchorWordIndex`), see file 01 section 3.
7. **SFX defined but not played.** Usually the cue list never reaches the composition props, the audio URL is not publicly reachable from Lambda, or the `<Audio>` is inside a `<Sequence>` with the wrong `from`. Checklist in file 04, section 9.
8. **Flat background + no depth.** Layer 1–2 are plain; there is no shadow, no parallax, no ambient drift. Fix in file 03.

---

## 3. Locked decisions (single source of truth)

### Canvas and timing
- Resolution: **1920×1080**, 16:9, **30 FPS**, H.264 MP4, AAC 192 kbps.
- Max duration: **300 s = 9,000 frames**.
- All JSON timing stored in **milliseconds**. Never store frame numbers in AI output.
- Frame conversion: compute scene **boundaries** with `Math.round(ms * 30 / 1000)`, and set each scene's end frame equal to the next scene's start frame. This prevents rounding gaps/overlaps. (The old per-value `floor` formula can cause 1-frame gaps.)
- Scene-local time: each scene is wrapped in a Remotion `<Sequence from={startFrame} durationInFrames={n}>`, so `useCurrentFrame()` inside the scene is already scene-local.

### Safe area
- Margins: **120 px left/right, 80 px top/bottom.** (This replaces the earlier 96/54 value.)
- Content box: x 120→1800, y 80→1000 (1680×920).
- Captions sit in the bottom band: y 860→1000 (never overlap hero content; layouts reserve this band).

### Layout system
- Visual coverage: **at least 85%** of scene time must have vector/typography/chart/UI-mockup content as the dominant visual; photos/stock video are supporting. (Replaces the 80% vs 90% conflict.)
- No two consecutive scenes may use the same `layoutId`. Also no layout may appear more than **3 times per 60 s** unless the catalog has fewer than 8 suitable layouts for the content.
- No asset (SVG, icon, stickman pose, image) may be used twice in one video.

### Motion tokens
- `spring.snappy = { damping: 16, mass: 0.8, stiffness: 130 }` (default for entrances)
- `spring.soft = { damping: 22, mass: 1, stiffness: 90 }` (large panels, backgrounds)
- `spring.bouncy = { damping: 10, mass: 0.8, stiffness: 150 }` (badges, emojis, stat pops)
- Ambient drift: scale from **1.00 to 1.018** across the scene duration on background/B-roll layers.
- Stagger step between sibling elements: **120 ms** (range 80–180 ms).
- Max static time with zero motion: **2.5 s** (tightened from 4 s; 4 s feels dead in explainers).

### Audio
- BGM ducking: **12% while speaking**, **26% in pauses longer than 600 ms**. Attack (duck down) **150 ms**, release (rise) **500 ms**. Tolerance bands are removed; use these exact numbers.
- J-cut: SFX or incoming ambient starts **6–9 frames** before a visual cut. L-cut: ambient tail continues **9–12 frames** after. These apply to SFX/ambient only, because the voiceover is one continuous file.
- Transitions: crossfade **12 frames**, slide **10 frames** with 50 px offset, zoom punch **9 frames** from 1.08 to 1.0.

### Overlap rule (clarified)
- Scene time ranges never overlap in the scene plan. Visual transitions use **handle frames**: the outgoing scene renders up to 6 frames past its end and the incoming scene starts 6 frames early, inside the transition window only.

### Layer order (bottom to top, visual only)
1. Base background plate
2. Ambient gradient / mesh / grain
3. B-roll / AI image / stock (with drift)
4. Images and UI screenshots
5. Illustrations and vector graphics
6. Charts and data visualization
7. Foreground cards, PiP, device mockups
8. Transition and mask plates
9. VFX (vignette, grain, glow, particles) — applies to layers 1–7 only
10. Callouts, arrows, highlights, spotlights
11. Pop-ins, emojis, badges
12. Scene headings and stat text (Font 1)
13. Kinetic captions (Font 2)
14. Brand watermark/logo (always above content, below captions only if it would collide; default position top-right at 60% opacity)

**Audio is not a visual layer.** It is a separate multi-track stack: VO, BGM, SFX, ambient.

### Directors (reduced and clarified)
Use **5 AI directors** and **code validators**:
- AI: Story Director (macro), Layout Director (micro + slot filling), Asset Director (images/SVG/icons), Motion Director (choreography), Sound Director (SFX cues).
- Code (deterministic, not AI): timestamp validator, asset HTTP checker, density checker, safe-area checker, overlap checker, font loader checker, credit/duration checker.

### Quran / Arabic
- Arabic text rendered on screen must come from a **verified Quran text database** matched to the transcription (surah:ayah, with diacritics), never directly from speech-to-text output. If confidence is low, show the audio's romanized transcription or skip the Arabic card.

### Languages
- English and Hinglish are first-class. Devanagari fonts (Noto Sans Devanagari / Hind) are part of Font 2 fallback chain. Mixed-script captions must render without tofu boxes.

---

## 4. Glossary (short)

- **Beat:** a unit of narration (one idea) that gets one visual event.
- **Scene:** a time block (typically 3–10 s) with one layout and several elements.
- **Layout:** a template of slots and choreography (e.g. `StatScene`).
- **Slot:** a named position/role in a layout (e.g. `hero`, `label`, `support-1`).
- **Element:** a drawable thing placed in a slot (text, number, icon, svg, chart, image).
- **Anchor word:** the spoken word that triggers an element's entrance.
- **Composition:** the full arrangement of elements in a scene, including timing.
- **A-roll:** the voiceover. **B-roll:** every supporting visual.

---

## 5. Build order (recommended)

1. **Foundation:** auth, S3 presigned upload, job queue, status tracking, render history, credit refund. Without this, paid users get broken videos.
2. **Timeline core:** transcription → word timestamps → frame conversion → empty scenes rendering with captions and audio. Confirm sync before adding visuals.
3. **Layout gallery:** a Remotion preview composition that renders every layout with fixture data (file 04, section 6). **Build this before the AI planner.** You cannot judge polish by watching full AI videos.
4. **Five layouts first:** `HookTypographyScene`, `StatScene`, `ComparisonScene`, `CardConceptScene`, `ListScene`. Polish until they look professional.
5. **Planner v1:** feed the catalog, enforce validators, repair loop.
6. **Remaining layouts**, one at a time, each with fixtures and acceptance tests.
7. **Sound and polish pass:** SFX wiring, ducking, depth, grain, drift.
8. **Quran module, Hinglish captions, extra caption themes.**
9. **QA automation and analytics.**

---

## 6. Definition of "done" for a scene (acceptance summary)

A scene is shippable only if all are true:
- Uses a registered layout with all required slots filled.
- Meets the element budget for its duration (file 01, section 2).
- Has at least one visual event every 2.5 s.
- Hero element enters within 200 ms of its anchor word.
- No element outside the safe area; no text overlaps another element.
- Contrast ratio of text vs its local background is at least 4.5:1.
- No reused asset, and layout differs from the previous scene.
- Captions are either visible or intentionally suppressed (section 3 of file 03).

