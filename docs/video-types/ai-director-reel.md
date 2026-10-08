# AI Director Reel

## Purpose

Create a cinematic short-form video where every visual, motion, and transition is intelligently directed by an AI scene planner. The system parses the narration semantically, matches assets to intent, applies cinematic camera movements, and synchronizes everything to word-level timestamps.

## Product Contract

| Field | Value |
|---|---|
| Video Type Name | AI Director Reel |
| Internal ID | `AI_DIRECTOR_REEL` |
| Composition ID | `AI-DIRECTOR-REEL` |
| Dashboard Mode | `aiDirectorReel` |
| Category | Creator |
| Output | 1080×1920, 9:16 H.264/AAC MP4 |
| Maximum duration | 60 seconds |

## Architecture: The Four Strategies

### A. Semantic Script & Scene Planning

The uploaded audio/video is transcribed via Groq Whisper with word-level timestamps. The full transcript + word array is passed to the **Scene Director** (Gemini 2.0 Flash, free tier) which outputs a structured JSON shot list:

```json
{
  "scene": 1,
  "startWord": 0,
  "endWord": 8,
  "startTime": 0,
  "endTime": 3.5,
  "visualType": "cinematic_landscape",
  "motion": "slow_zoom_in",
  "transitionIn": "cross_dissolve",
  "intent": "establish_atmosphere",
  "emphasis": ["powerful"],
  "assetQuery": "dramatic sky sunset"
}
```

The system forces justification: no asset is selected before the director determines **why** it should be there.

Falls back to a deterministic local planner (word-count + pacing intervals) when Gemini is unavailable.

### B. Intelligent Asset Selection

Assets are stored with deep metadata:
- **mood**: energetic, calm, professional, dramatic, playful, somber
- **lighting**: bright, golden_hour, dark, studio, natural, neon
- **style**: minimalist, cinematic, corporate, creative, editorial, abstract
- **tags/keywords**: searchable content descriptors

The Asset Matcher filters the library per scene using:
1. Visual type compatibility (e.g., `cinematic_landscape` prefers `image` or `video` with `cinematic` style)
2. Intent-mood alignment (e.g., `build_tension` prefers `dramatic` or `energetic` mood)
3. Query keyword relevance from the director's `assetQuery`
4. Repetition penalty (already-used assets are deprioritized)

### C. Cinematic Motion & Transition System

Shared motion preset library (`lib/motion/presets.ts`) provides:
- **11 camera movements**: zoom, pan, dolly, Ken Burns, parallax, scale pop, static breathe
- **8 transitions**: hard cut, cross dissolve, soft fade, match cut, slide, zoom through, wipe
- **Emphasis effects**: glow, scale bump, color flash, shake — triggered at the exact word timestamp

Transition logic follows narrative:
- Hard cut → fast information
- Cross dissolve → topic shift
- Soft fade → emotional shift
- Match cut → similar subjects between scenes

### D. Perfect Synchronization (Word Anchoring)

Every visual object is anchored to `startWord` and `endWord` indices, not arbitrary durations. If narration timing changes, visuals adjust because they are parented to the transcript word array.

The emphasis system identifies power words per scene and triggers visual pops (glow/scale/flash) at the exact word timestamp from Groq's word-level output.

## Input and Output

- **Input:** one video or audio file with clear speech (max 60 seconds).
- **Output:** 9:16 cinematic reel with directed visuals, motion, transitions, and captions.
- Source audio stays primary; no replacement narration.
- Background music: optional (plan-selected from mood).
- Captions: word-level from Groq, rendered with the shared `SubtitleRenderer`.

## Provider Usage

- **Groq**: Transcription (word-level timestamps). Always.
- **Gemini 2.0 Flash**: Scene planning. Free tier. Optional — fallback planner works without it.
- **No OpenAI**: Not used for this pipeline.

## Credits

1 video = 1 credit (same as other short-form templates).

## Render Pipeline

1. Upload → S3 presigned URL
2. Groq transcription → word-level timestamps
3. Scene Director (Gemini) → structured shot list JSON
4. Asset Matcher → best asset per scene from indexed library
5. Build render props (scenes + motion + transitions + captions + emphasis)
6. Remotion Lambda render (1080×1920, 30fps)
7. Poll status → download

## Files

- `services/ai/sceneDirector.ts` — Gemini scene planner + fallback
- `services/ai/assetMatcher.ts` — intelligent asset selection
- `lib/motion/presets.ts` — shared motion & transition presets
- `remotion/templates/AI_DIRECTOR_REEL/template.tsx` — renderer (TBD)
- `app/api/reels/jobs/route.ts` — render orchestration (TBD)
- `app/dashboard/page.tsx` — dashboard card (TBD)

## QA Checklist

- [ ] Gemini scene plan produces valid JSON with word-anchored timing
- [ ] Fallback planner produces reasonable scenes without Gemini
- [ ] Asset matcher avoids repetition and respects visual type
- [ ] Motion presets render smoothly at 30fps
- [ ] Transitions between scenes are visually correct
- [ ] Emphasis words trigger visible pop effects at correct timestamps
- [ ] Captions sync to word-level timing
- [ ] Full pipeline works end-to-end: upload → directed reel
