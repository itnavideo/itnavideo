# AI Presentation Pipeline — Requirements

## Overview

A shared, extensible AI pipeline that converts raw audio/video transcripts into structured presentation plans. Each video type (template) plugs into this pipeline and only handles rendering — not content intelligence.

The pipeline must handle video types that don't exist yet, with varying visual needs (images, clips, icons, typography, animations, B-roll, etc).

---

## Core Requirements

### R1: Universal Scene Plan Output
The pipeline MUST produce a standardized `ScenePlan[]` that any template can consume. Each scene contains:
- `id` — unique scene identifier
- `start` / `end` — timing in seconds (from Groq transcript)
- `intent` — what this scene is trying to do (hook, explain, compare, prove, transition, conclude, cta)
- `text` — the spoken words for this timeframe
- `emphasis` — which word/phrase is most important
- `visualType` — what should be shown (typography, image, video_clip, icon, screenshot, animation, b_roll, split_screen, sticker, none)
- `visualDirection` — brief description of what the visual should communicate
- `mood` — emotional tone (neutral, urgent, inspiring, warning, celebratory, questioning)
- `pacing` — hold duration hint (quick_flash, normal, slow_emphasis)
- `assets` — array of asset references if applicable

### R2: Pipeline Stages (Sequential)
1. **Transcript Ingestion** — accepts Groq output (transcript, words[], segments[], durationSeconds)
2. **Script Analysis** — understands content structure, identifies topic shifts, detects questions/answers/comparisons/lists/facts
3. **Scene Segmentation** — groups transcript into logical scenes (minimum 3s hold, maximum 8s per scene)
4. **Visual Assignment** — decides what visual type each scene needs based on content analysis
5. **Asset Resolution** — matches available assets (user uploads, stock, generated) to scenes that need them
6. **Plan Validation** — ensures timing gaps are covered, no overlaps, pacing is smooth

### R3: Template Adapter Interface
Each template MUST implement a `TemplateAdapter` that:
- Accepts `ScenePlan[]` as input
- Returns template-specific `inputProps` for Remotion rendering
- Can reject scenes it doesn't support (graceful fallback to simpler visual)
- Defines its `capabilities` (what visual types it can render)

### R4: Template Capability Declaration
Each template declares what it can render:
```
capabilities: {
  visualTypes: ['typography', 'image', 'video_clip', 'icon', 'sticker'],
  maxScenesPerMinute: 12,
  supportsTransitions: true,
  supportsSplitScreen: false,
  supportsCharacter: true,
  aspectRatio: '9:16',
}
```
The planner uses these capabilities to constrain its output.

### R5: No Fixed Template List
The pipeline MUST NOT hardcode template names or assume specific video types exist. Templates register themselves with:
- A unique ID
- Their capabilities
- Their adapter function

### R6: Graceful Degradation
If the AI planner fails (Gemini down, rate limit, timeout):
- Fall back to a deterministic scene planner
- Never block the render
- Log the failure for monitoring

### R7: Provider Agnostic AI Layer
The planning AI call MUST be abstracted behind an interface:
- Primary: Gemini 2.0 Flash (free)
- Fallback: deterministic local planner
- Future: can swap to any LLM without pipeline changes

### R8: Cost Control
- Maximum 1 AI call per render (the scene planning call)
- Prompt must be under 4000 tokens
- Response expected under 2000 tokens
- Total AI latency budget: under 5 seconds

### R9: Existing Video Types Compatibility
- **Auto Caption** — skips the pipeline entirely (no scene planning needed)
- **Long Video Promo** — skips the pipeline entirely (deterministic layout)
- **Compare Explainer** — uses the pipeline for sticker planning only (already implemented via `compareStickerPlanner.ts`)
- New explanation-focused types — full pipeline

### R10: Extensibility for Unknown Future Types
The pipeline must handle video types that:
- Use only typography (no images)
- Use only B-roll clips
- Mix user-uploaded clips with AI-selected stock
- Have multiple characters/stickers
- Need split-screen layouts
- Need whiteboard/handwritten styles
- Need data visualizations (charts, stats)
- Need before/after comparisons
- Need step-by-step tutorials

---

## Non-Requirements (Out of Scope)
- Asset generation (creating new images/icons) — just reference/match existing
- Real-time preview of the pipeline output — preview happens at template level
- Multi-language planning — pipeline works in English/Hinglish only (per subtitle rules)
- Video editing features (trimming, cropping) — handled before pipeline

---

## Success Criteria
1. Adding a new video type requires ONLY: a Remotion template + a TemplateAdapter (no changes to shared pipeline)
2. A 60-second explainer video gets planned in under 5 seconds
3. The plan is deterministic for the same input (no randomness in structure)
4. Fallback planner produces usable (not great, but renderable) output without AI
