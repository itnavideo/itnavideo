# Standard Operating Procedure (SOP): 16:9 Faceless Video Generation

> **Authoritative Specification, Multi-Disciplinary Framework & Master Quality Gate Checklist**  
> **Target Format**: 16:9 Widescreen Cinema (`1920×1080` @ 30 FPS MP4) · Up to 5 Minutes (300s)  
> **Rendering Engine**: Remotion on AWS Lambda · Cloud Transcription via Groq Whisper & Gemini 2.0 Flash  
> **Credit Pricing**: 1 Minute = 1 Credit (1m = 1, 5m = 5 Credits, 5-minute maximum)

---

## 0. FOUNDER DIRECTIVES: THE TWO NON-NEGOTIABLE CORE RULES

> [!CAUTION]
> ### 🛑 RULE 1: VIDEO MUST NEVER LOOK LIKE A WEBSITE (Zero SaaS Cards + 100% Background Fidelity)
> 1. **BAN ON WEBSITE UI CARDS**: In earlier renders, videos felt like browsing a SaaS website because visuals, metrics, and text were repeatedly trapped inside floating rounded cards (`borderRadius: 36px`, `backdrop-filter: blur(28px)`, blueish slate boxes). **This is permanently forbidden.** 
>    - A video is not a web page. Visuals must be **Full-Bleed 1920×1080** cinema shots, clean 50/50 split-screens, or organic cutouts.
>    - Text and metrics must sit directly over the visual media or base canvas, backed by subtle directional gradient scrims (`linear-gradient(to top, rgba(2, 6, 23, 0.7), transparent)`), NOT boxed containers.
> 2. **100% USER BACKGROUND LOYALTY**: The background selected by the user in Phase 1 (e.g. `solid-white`, `studio-white`, `decoding-grid`, `solid-cream`, `flame-dark`) **MUST be the exact background seen across the entire video**.
>    - Root scene containers must NEVER hardcode `#020617` or blueish radial gradients over the user's canvas. They must be transparent (`backgroundColor: 'transparent'`).
>    - Layer 2 dark ambient underlay must be bypassed on all solid and light themes so the user's canvas is never polluted by a dark blue haze.

> [!CAUTION]
> ### 🛑 RULE 2: ZERO ROBOTIC / AI-GENERATED VIBE (Advanced Human Editor Benchmark)
> 1. **CRAFTED BY A SENIOR HUMAN EDITOR**: The output must look and feel like it was crafted by an elite documentary video editor (Vox, Magnates Media, Johnny Harris, DecodingYT, Dhruv Rathee).
> 2. **CONTINUOUS GRAPHIC MOTION**: SceneFrame-driven motion animates every SVG diagram, metric, and typography treatment.
> 3. **SVG FIRST**: Stock and uploaded scene images are paused. Generate explanatory visuals from approved narration and never invent chart values.
> 4. **ORGANIC EDITORIAL SOUND & TIMING**: Audio ducking must feel organic (12% during narration with smooth 6-frame easing, 26% on pauses), with intentional SFX puncturing key moments rather than mechanical noise.

> [!CAUTION]
> ### 🛑 RULE 3: STRICT FILE GOVERNANCE & 61-FILE PIPELINE VIGILANCE (Founder Mandate)
> 1. **MANDATORY INVENTORY REGISTRATION**: Whenever ANY new file is created for Faceless Video, registering it immediately in the numbered master inventory ([`docs/video-types/facelessvideo.md`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/docs/video-types/facelessvideo.md) Section 7) is **100% COMPULSORY**. No unindexed or shadow files are allowed.
> 2. **ALL-FILE VIGILANCE ON GENERATE**: When a user uploads an idea and clicks "Generate", the video generation is driven by the entire cohesive chain of these 61 numbered files. You must keep full vigilance over ALL files across the 4 execution phases:
>    - **Phase 1 Ingestion UI & APIs** (`#1` to `#11`, `#54`)
>    - **Phase 2 Planning and Alignment**: Files #12 to #24, plus #61
>    - **Phase 3 Storyboard Scene Renderers and Typography**: Files #28 to #53, plus #60
>    - **Phase 4 Remotion Cloud Composition and Audio Layers**: Files #25 to #27 and #55 to #60
> 3. **ZERO ISOLATED SHORTCUTS**: Focusing on a few files while neglecting the rest breaks the video output. Every required component must be monitored, maintained with proper numbers, and picked on schedule.

---

## 1. Executive Multi-Disciplinary AI Inquiry (The 4 Expert Prompts)

To build an ironclad SOP that eliminates quality degradation, prevents bugs, and ensures every single generated video meets broadcast-grade YouTube documentary standards, we interrogate the problem through **4 distinct advanced expert personas**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        THE 4-PILLAR EXPERT INQUIRY MATRIX                              │
├─────────────────────────┬──────────────────────────┬───────────────────────────────────┤
│ 1. SENIOR VIDEO EDITOR  │ 2. AI / ML VISION        │ 3. PRINCIPAL SYSTEMS &            │ 4. YOUTUBE RETENTION &  │
│    & RETENTION LEAD     │    ARCHITECT             │    REMOTION ARCHITECT             │    GROWTH STRATEGIST    │
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┼─────────────────────────┤
│ • 3-5s Pacing Grammar   │ • Script-to-B-Roll Match │ • Deterministic Scene Time Math   │ • 0-10s Hook Retention  │
│ • Ken Burns Camera Math │ • Zero-Duplicate Memory  │ • Layer Isolation & Canvas Engine │ • Pattern Interrupts    │
│ • No SaaS Web Cards     │ • Whisper Token Boundary │ • Dynamic Color Contrast System   │ • Micro-Pacing Dynamics │
│ • Audio Ducking Curves  │ • Semantic Fallback Plan │ • Zero-CSS Jitter Cloud Lambda    │ • Visual Payoffs & Flow │
└─────────────────────────┴──────────────────────────┴───────────────────────────────────┴─────────────────────────┘
```

---

### Prompt 1: Senior Documentary Video Editor & Lead Retention Cutter

> **Persona**: Senior Video Editor with 10+ years cutting high-retention documentary YouTube videos (Vox, Magnates Media, Johnny Harris, DecodingYT, SunnyV2).  
> **Question**: *"What are the non-negotiable editing rules for a 16:9 faceless video to look like a $5,000 human-edited documentary instead of cheap AI slop? Address image motion, text overlays, container cards, audio ducking, and transition rhythm."*

#### Expert Reply & Core Findings:
1. **The 3-to-5 Second Visual Shift Rule**:
   - The human brain habituates to any static visual within 3.5 seconds. If a frame does not change, zoom, pan, or reveal a new element within 4 seconds, viewer drop-off spikes exponentially.
   - **Continuous Motion (No Frozen Frames)**: Even during a single 6-second scene, the visual MUST have continuous sub-pixel motion (Ken Burns pan/zoom). A frozen picture is an instant signal of amateur automation.
2. **Eliminate "Website UI Cards" in Videos**:
   - Software developers often treat video frames like web pages, wrapping images and stats inside floating rounded boxes (`borderRadius: 36px`, `backdrop-filter: blur(28px)`).
   - In cinema and broadcast editing, **we do not put website cards on screen**. Visuals must be full-bleed (`1920×1080`), split-screen, or raw cutouts sitting directly in 3D camera space. Text legibility is solved through **subtle directional gradient scrims** (`rgba(2, 6, 23, 0.65)` falloff), not gray boxes.
3. **Typography as Art, Not UI Labels**:
   - Text on screen must be bold, intentional, and editorial. Use the **Marker Tape Highlighter** (Flame Orange `#FF5722` or Neon Yellow `#FFE600`) with spring entrance physics.
   - Core metrics (stats, money, percentages) must be oversized hero numbers ($110\text{px}$–$140\text{px}$) with active counter animations, dominating the screen.
4. **Audio Ducking Curves (The Voiceover Spine)**:
   - Voiceover is king. The voice track must be crisp, normalized, and set to `1.35` relative volume.
   - Background music must dynamically duck: **0.10 – 0.12** during active speech, smoothly swelling to **0.25 – 0.28** during speech pauses (>1.2s). Abrupt volume step changes destroy immersion; ducking must use smooth 6-frame exponential easing.
5. **Sound Design Discipline**:
   - SFX must punctuate narrative milestones (whoosh on scene transitions, metallic riser on statistics, cash register on monetary reveals). Repetitive ticking loops are forbidden.

---

### Prompt 2: Legacy Stock-Media Matching Reference (Paused)

> **Persona**: Staff AI/ML Engineer specializing in multimodal NLP, speech-to-text alignment, and semantic vector matching.  
> **Question**: *"How do we guarantee that AI-selected stock images and B-roll clips accurately represent script concepts without hallucinations, repetition, or irrelevant visual mismatches? Design the data pipeline."*

#### Expert Reply & Core Findings:
1. **Zero-Repeat Semantic Deduplication (Session-Level Memory)**:
   - When generating a 5-minute video (40–60 scenes), simple keyword search inevitably returns the same top-ranked Pexels stock photo 4 or 5 times.
   - **Architecture**: The planning engine must maintain a job-scoped `usedMediaUrls` set. When an image query returns candidate photos, the matcher computes:
     $$\text{Candidate} = \text{photos.find}(p \implies !usedMediaUrls.\text{has}(p.\text{url}))$$
   - If all returned candidates have already been used, the system must trigger query expansion (synonyms, conceptual abstractions) or fall back to an editorial typography or roadmap layout. An image must **NEVER appear twice in the same video**.
2. **Forced Word-Level Alignment (Groq Whisper Cloud)**:
   - Transcription must provide millisecond-accurate word boundaries (`words: [{ word, start, end }]`).
   - Sentence segmentation must respect natural grammatical pauses ($3.0\text{s}$ to $7.5\text{s}$ per scene). If a user edits a sentence in the Phase 2 transcript editor, the system must re-distribute timestamps proportionally across the segment's verified audio duration, preventing timestamp drift.
3. **Concept Extraction over Keyword Matching**:
   - Do not query stock libraries with raw conversational stopwords (e.g., "And then I realized that maybe...").
   - Extract the **Visual Hero Noun** and **Action Verb** (e.g., "Wall Street trading floor chaos", "solitary programmer late night coffee").
4. **Hardcoded Blacklist for Quality Assurance**:
   - Blacklist all development artifacts, debug screenshots, low-resolution placeholders (`test.png`, `audit_*.png`), and vertical 9:16 assets from 16:9 Faceless Video matching.

---

### Prompt 3: Principal Systems & Remotion Cloud Architect

> **Persona**: Principal Software Engineer & Remotion Systems Architect responsible for 1080p cloud rendering pipelines on AWS Lambda.  
> **Question**: *"Why do images freeze in multi-scene Remotion compositions, why do user background selections get masked, and how do we build a deterministic, fail-safe 16:9 rendering pipeline?"*

#### Expert Reply & Core Findings:
1. **The Scene-Local Frame Law (Root Cause of Frozen Images)**:
   - In Remotion, `useCurrentFrame()` returns the composition's absolute timeline frame (e.g., frame 350).
   - If a scene component computes motion using `interpolate(frame, [0, 150], [1.0, 1.12], { extrapolateRight: 'clamp' })`, then for any scene starting after frame 150, the motion is **permanently clamped at 1.12 from the very first frame**. The image appears completely frozen.
   - **The Strict Solution**: Every scene component must receive and use `sceneFrame = Math.max(0, frame - sceneStartFrame)`. Every interpolation, spring, and counter must measure time relative to `sceneFrame`.
2. **Eliminate CSS Transitions in Remotion**:
   - CSS transitions (`transition: transform 0.1s ease-out`) are non-deterministic during headless Chromium frame capture and introduce frame-dropping jitter. All motion must be driven purely by mathematical Remotion interpolation functions (`interpolate`, `spring`).
3. **Background Canvas Isolation (The Double-Masking Bug)**:
   - The user selects a background theme in Phase 1 (e.g., `solid-white`, `studio-white`, `decoding-grid`).
   - In `template.tsx`, Layer 2 (`Deep Ambient Media Underlay`, `z-index: 3`) applies heavy blur and `rgba(2, 6, 23, 0.72)` dark tints. Furthermore, scene containers often contain hardcoded `backgroundColor: '#020617'`.
   - When a user picks white, this dark layer completely obliterates the white background, producing a muddy dark canvas.
   - **The Strict Solution**: Layer 2 must be **bypassed completely** when `palette.isDark === false` or on solid/minimal themes. Scene root containers must be transparent (`backgroundColor: 'transparent'`).
4. **Canvas-Aware Dynamic Contrast Engine**:
   - The composition root must pass the resolved `BackgroundColorPalette` down to every child scene and to `UniversalCaptionLayer`.
   - If `palette.isDark === false`:
     - Default caption text switches from white to **Obsidian Slate (`#0F172A`)**.
     - Heading text switches to high-contrast slate with Flame Orange accents.
     - White text on white background is rendered mathematically impossible.

---

### Prompt 4: YouTube Retention & Creator Economy Lead

> **Persona**: Creator Growth Strategist who has analyzed 500M+ views across top educational, finance, and storytelling YouTube channels.  
> **Question**: *"What narrative and visual pacing rules separate a video with 20% Average View Duration (AVD) from one with 65%+ AVD? How must this be codified into our automated storyboard pipeline?"*

#### Expert Reply & Core Findings:
1. **The 0–10s Hook Architecture**:
   - The first 10 seconds dictate the video's viral trajectory. Scene 1 must NEVER be a generic intro title or slow establishing shot.
   - Scene 1 must use **Split-Screen** or **High-Energy Full-Bleed** with a rapid Ken Burns zoom ($1.00 \rightarrow 1.14$), an animated Marker Tape question hook, and an immediate sound effect (Whoosh + Bass hit).
2. **Rhythmic Pattern Interrupts (The 4-Scene Rotation)**:
   - Never show 3 full-bleed photo scenes in a row. Viewers get visual fatigue.
   - Maintain a dynamic rhythm across scenes:
     - *Scene A*: Full-Bleed Cinematic B-Roll (Zoom In).
     - *Scene B*: Split-Screen with Editorial Marker Tape Headline.
     - *Scene C*: Oversized Hero Statistic (`StatScene`) or Visual Breakdown (`WorkflowScene`).
     - *Scene D*: Full-Bleed B-Roll (Pan Left) or Kinetic Typography.
3. **Curiosity Loops & Visual Payoffs**:
   - When the voiceover asks a question or states a mystery, the visual must NOT give away the answer immediately. Display a teaser graphic or question highlight, followed by the reveal on the next sentence beat.
4. **Subtitles as Retention Hooks (Karaoke Subtitles)**:
   - Subtitles must be centered in the bottom third (`bottom: 120px` to `160px`), styled with active word-by-word karaoke boxes (DecodingYT marker preset). Word grouping should stay short (max 4–7 words on screen at any instant) so the viewer actively reads without visual fatigue.

---

## 2. Synthesized Standard Operating Procedure (SOP)

Based on the 4 expert inquiries, the following 6-phase procedure must be executed for every Faceless Video project without exception:

### Phase 1: Script & Audio Ingestion SOP
1. **Audio Validation**:
   - Audio must be processed through presigned S3 upload (`/api/media/presign`).
   - Maximum audio duration: **300 seconds (5 minutes)**. Jobs exceeding 300s are rejected immediately.
2. **Groq Whisper Transcription**:
   - Primary: Groq Whisper Cloud API (`whisper-large-v3`).
   - Mandatory Fallback: Gemini 2.0 Flash (`asia-south1`) if Groq encounters rate-limits or network downtime.
   - Output must contain full word-level timestamp array (`words: [{ word, start, end }]`).

### Phase 2: Transcript-to-SVG Graphic Planning SOP
1. Segment approved narration into short, coherent scenes with verified timestamps.
2. The AI selects a typed visual layout and transcript-grounded data for every scene.
3. Prefer reusable SVG templates: allocation, comparison, metric, sequence, concept map, and growth/time-series chart.
4. When no template fits, compose a custom scene only from approved SVG primitives. Never accept raw AI SVG markup.
5. Chart numbers, time points, labels, and relationships must be explicitly supported by the approved transcript. If evidence is insufficient, use a non-numeric layout.
6. Storyboard shows a preview only. Creators cannot edit the visual type or its data there.
7. If AI planning fails or returns invalid data, use a safe deterministic SVG fallback and keep the render pipeline recoverable.
8. Keep stock and uploaded scene-image matching disabled for this video type.
### Phase 3: Remotion Scene Composition & Motion Math SOP
1. **The Scene-Local Frame Law**:
   - In `template.tsx`, calculate `sceneStartFrame = Math.round(scene.start * fps)`.
   - Compute `sceneFrame = Math.max(0, frame - sceneStartFrame)`.
   - Pass `sceneFrame` into every scene component (`FullBleedVisualScene`, `StatScene`, `CardConceptScene`, etc.).
   - All springs, interpolations, and counter animations inside scenes must use `sceneFrame`.
2. **Directional Ken Burns Cycle**:
   - Scene index determines camera direction:
     - `index % 4 === 0`: Zoom In ($1.00 \rightarrow 1.12$).
     - `index % 4 === 1`: Zoom Out ($1.14 \rightarrow 1.02$).
     - `index % 4 === 2`: Pan Left ($0\text{px} \rightarrow -40\text{px}$, scale $1.08$).
     - `index % 4 === 3`: Pan Right ($-40\text{px} \rightarrow 0\text{px}$, scale $1.08$).
   - Image base scale must be $\ge 1.06$ to guarantee zero edge letterboxing.
3. **Elimination of SaaS Web Boxes**:
   - Banned: Floating rounded cards with web dashboard containers (`borderRadius: 36px`, `width: 1240px`).
   - Approved: Direct full-bleed visuals, split-screen layouts, sticker cutouts with white outlines, and direct typography scrims.

### Phase 4: Contrast & Typography Hierarchy SOP
1. **Palette Inheritance**:
   - Remotion root retrieves palette: `palette = getBackgroundPalette(activeBackgroundTheme)`.
   - Pass `palette` into all scenes and `UniversalCaptionLayer`.
2. **Light Canvas Contrast Rule**:
   - If `palette.isDark === false` (`solid-white`, `studio-white`, `solid-cream`):
     - Bypass Layer 2 underlay completely.
     - Set caption inactive word color to **Obsidian Slate (`#0F172A`)**.
     - Set heading colors to `#0F172A` with `#FF5722` accent highlights.
     - Scene container `backgroundColor` must be `transparent`.
3. **Dark Canvas Contrast Rule**:
   - If `palette.isDark === true`:
     - Text renders in `#FFFFFF` / `#F8FAFC`.
     - Accent highlights render in Flame Orange (`#FF5722`) or Neon Yellow (`#FFE600`).

### Phase 5: Audio Mastering & Sound Design SOP
1. **Voiceover**: Source audio relative volume clamped to `1.35`.
2. **Dynamic BGM Ducking**:
   - Speech active: Volume ducked to **0.12**.
   - Speech pause (>1.2s): Volume smoothly swells to **0.26**.
   - Transition smoothing: Minimum 6-frame exponential window.
3. **SFX Placement**:
   - Trigger `whoosh.wav` on scene transitions where layout changes.
   - Trigger `cash-register.wav` on monetary/growth keywords.
   - Trigger `riser.wav` on statistical reveals.

### Phase 6: Cloud Render Validation SOP
1. **AWS Lambda Dispatch**:
   - Validate payload schema before dispatching Lambda job.
   - Ensure `frameRange: [0, totalFrames - 1]` matches detected audio duration.
2. **Zero-Paging Host Laptop Safety**:
   - Strictly 0 local Remotion renders on developer machine (4GB RAM / HDD).
   - All rendering executes in cloud AWS Lambda.

---

## 3. Master Video Quality Gate Checklist

Every Faceless Video render job must pass this 15-point checklist before completion:

```markdown
### 📋 PRE-FLIGHT QUALITY GATES (MUST PASS 15/15)

#### A. Ingestion & Limits
- [ ] GATE 1: Video Duration is strictly <= 300s (5 Minutes) at 30 FPS MP4.
- [ ] GATE 2: Aspect Ratio is strictly 16:9 Widescreen (`1920×1080`).
- [ ] GATE 3: Voiceover audio is extracted to 16kHz mono before Groq Whisper transcription.

#### B. Visual & Semantic Integrity
- [ ] GATE 4: Every scene has a transcript-derived SVG plan; numerical chart values must occur in the approved narration.
- [ ] GATE 5: Stock, Pexels, custom scene uploads, and custom image backgrounds are disabled.
- [ ] GATE 6: Every scene has a complete thought ($3.0\text{s}$ to $7.5\text{s}$ duration).

#### C. Remotion Motion & Canvas Engine
- [ ] GATE 7: SVG motion uses Remotion scene-local frames and stays inside the 16:9 safe area.
- [ ] GATE 8: Graphic motion is scene-local and explanatory: lines draw, bars fill, nodes reveal, metrics enter, and chart points stagger within the scene duration.
- [ ] GATE 9: Zero CSS transitions (`transition: transform ...`) — all motion uses Remotion math.
- [ ] GATE 10: User-selected background theme is 100% visible (no opaque `#020617` scene masks).
- [ ] GATE 11: On white/light backgrounds, captions and text render in high-contrast Obsidian Slate (`#0F172A`).
- [ ] GATE 12: No floating website card containers (`borderRadius: 36px` web boxes) in scene layouts.

#### D. Audio & Sound Design
- [ ] GATE 13: Voiceover volume is normalized to 1.35; background music ducked to 0.12 during speech.
- [ ] GATE 14: Ducking transitions smoothly with a 6-frame exponential window (no abrupt audio pops).
- [ ] GATE 15: Sound effects trigger selectively on key narrative transitions.
```

---

## 4. Code Implementation Mapping & File Governance

| SOP Quality Gate | Enforcing Code File & Function | Concrete Mechanism |
| :--- | :--- | :--- |
| **Motion Continuity** | [`remotion/templates/FACELESS_LONG_VIDEO/template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | Computes `sceneFrame = Math.max(0, frame - sceneStartFrame)` and passes into scenes. |
| **Camera Movement** | [`FullBleedVisualScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/FullBleedVisualScene.tsx) | Drives Ken Burns pan/zoom via `sceneFrame`; cycles directional modes 0..3 without CSS transitions. |
| **Asset Deduplication** | [`services/ai/pexelsImages.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/pexelsImages.ts) | Maintains `usedMediaUrls` set; skips already-assigned photos and videos. |
| **Background Loyalty** | [`template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | Disables Layer 2 ambient underlay on light/solid themes; removes `#020617` hardcoded masks. |
| **White Canvas Contrast** | [`UniversalCaptionLayer.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/library/UniversalCaptionLayer.tsx) | Reads `palette.isDark`; dynamically assigns `#0F172A` to inactive text on light backgrounds. |
| **No SaaS Cards** | [`CardConceptScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/CardConceptScene.tsx) & [`StatScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/StatScene.tsx) | Replaces boxed card wrappers with full-bleed editorial layouts & direct glowing typography. |
| **Audio Ducking** | [`template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | `dynamicMusicVolume` clamps BGM to 0.12 during active captions, swelling to 0.26 on pauses. |
| **Duration Limit** | [`app/api/reels/jobs/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/route.ts) | Enforces `MAX_FACELESS_VIDEO_SECONDS = 300` (5 minutes) strictly per user standard. |
