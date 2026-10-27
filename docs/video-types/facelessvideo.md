# Faceless Video Generator (`facelessvideo.md`)

> **Single Source of Truth** for the 16:9 Long-Form Faceless Video Generation Workflow in Itnavideo.
> Optimized for automated YouTube Cash Cow channels, educational essayists, and documentary storytelling creators.

---

## 1. Overview & Purpose

**Faceless Video Generator** turns voiceover narration audio (strictly up to 5 minutes / 300s) into a complete 16:9 Full HD widescreen video (`1920×1080` @ 30 FPS MP4).

The pipeline provides:
- Word-level cloud transcription via Groq Whisper with Gemini 2.0 Flash fallback.
- Interactive transcript approval & sentence-level scrubber.
- Semantic scene planning & storyboard review.
- SVG-first, per-scene visuals: every scene has an SVG graphic and supporting text; the AI selects a typed plan grounded in the approved transcript.
- Reusable layouts are preferred: allocation, comparison, metric, sequence, concept map, and growth/time-series charts. Custom scenes use only approved SVG primitives; AI never supplies raw SVG markup.
- Finance chart values, time points, labels, and relationships must be supported by the approved transcript. If evidence is insufficient, choose a non-numeric layout.
- Storyboard graphics are preview-only; creators do not edit visual types or chart data there. Invalid AI plans use a deterministic safe SVG fallback.
- Dynamic background music auto-ducking and synchronized sound effects.
- High-contrast kinetic subtitles.

---

## 2. Key Specifications & Limits

| Attribute | Master Specification |
| :--- | :--- |
| **Video Type ID** | `faceless-video` / `FACELESS_VIDEO` |
| **Composition ID** | `FACELESS-VIDEO` (Wraps `FACELESS-LONG-VIDEO`) |
| **Template Location** | `remotion/templates/FACELESS_VIDEO/template.tsx` & `FACELESS_LONG_VIDEO` |
| **Dashboard Route** | `/dashboard/faceless-video` |
| **Studio Component** | `components/dashboard/FacelessVideoStudio.tsx` |
| **Planning Endpoint** | `POST /api/reels/plan-faceless-video` |
| **Render Endpoint** | `POST /api/reels/jobs` |
| **Aspect Ratio** | **16:9 Widescreen Cinema Only (`1920×1080` @ 30 FPS MP4)** |
| **Max Duration** | **Up to 5 Minutes (300s)** strictly per Rule 4.1 |
| **Credit Rate** | **1 Min = 1 Credit** (1m=1, 5m=5 Cr) |
| **Transcription** | Primary: Groq Whisper Cloud API · Fallback: Google Gemini 2.0 Flash (`asia-south1`) |
| **Audio Ducking** | BGM volume dynamically interpolates to 0.12 during active speech, rising to 0.28 during speech pauses |
| **Render Cloud** | AWS Lambda via Remotion |

---

### Local Font Library
- The Faceless studio offers 120 self-hosted Latin font families for heading and supporting text.
- Font files live under public/assets/reusable/fonts/faceless/ and are included in the reusable asset index for cloud packaging.
- Selected font files load from Remotion static assets before video frames render; missing files fall back to the browser's sans-serif stack.
- Font selections are headingFont, subheadingFont, and bodyFont; the supporting-text picker applies the selected family to subheading and body.
## 3. Standard Operating Procedure (SOP) & Video Quality Checklist

Every rendered Faceless Video must strictly adhere to the following quality rules before user delivery:

### A. Pure White Canvas Guarantee (Ali Abdaal Benchmark)
- [ ] **Pure White Canvas**: Faceless Video permanently renders on a clean white canvas (`#FFFFFF`). No dark gradients, textures, or background selectors are exposed to users.
- [ ] **Contrast Enforcement**: White backgrounds strictly receive high-contrast Obsidian Slate (`#111827`) or Slate 700 (`#374151`) typography with signature Yellow Marker Tape (`#FFE600`) and Coral accents (`#EA580C`).
- [ ] **White Space as an Asset**: Intentional open margins (`120px` safe margin X, `80px` safe margin Y) give explanatory graphics breathing room without visual clutter.

### B. Strict Composition Rule: Max 10% Stock Images & 90%+ Vector/Typography Storytelling
- [ ] **Maximum 10% Image Usage**: Stock photography may occupy at most 10% of the video's visual timeline. Stock imagery is used only for beats where authentic photographic realism is genuinely more impactful than vector illustration.
- [ ] **Remaining 90%+ Explanatory Visuals**: The vast majority of the video explains narration through:
  - Large procedural SVG illustrations (`DrawingStoryScene` with 520px+ vector drawings).
  - Editorial split screens with 380px vector badges & kinetic typography (`CardConceptScene`).
  - Expressive headline typography (`TypographyScene`) synchronized with voiceover beats.
  - Procedural diagrams, metrics, bars, and sequences (`FacelessGraphicScene`).
- [ ] **Zero Modulo Image Cycling**: Images are strictly assigned to specific beats within the 10% budget. The pipeline never repeats or cycles a single image across non-image scenes.
- [ ] **Fundamental Distinction from Image-to-Video**: Faceless Video is an animated explainer driven by typography and SVG illustrations, NOT an image slideshow. Image-to-Video remains the dedicated feature for image-centric videos.
- [ ] Never invent statistics or labels while generating vector graphics.

### B2. Image Hygiene When Image Visuals Are Re-enabled
- [ ] **Strict 1-to-1 Mapping**: No image or video clip may appear more than once in a single video.
- [ ] **Deduplication Set**: The asset matcher must track assigned URLs and IDs across all scenes. If a query matches an already-used image, the next unique candidate must be selected.
- [ ] **Graceful Clean Typography Fallback**: If unique assets cannot be reliably produced, use dynamic high-contrast typographic scenes rather than inventing facts or inserting irrelevant stock assets.
- [ ] **Asset Hygiene**: Development screenshots, debug images (`test.png`), and localhost captures are strictly ineligible for production rendering.

### C. Mandatory Visual Motion & Calibrated Springs
- [ ] **Calm Editorial Motion**: Remotion springs calibrated to `{ damping: 16, mass: 0.8, stiffness: 130 }` for cards and list items.
- [ ] **Scene-Local Timing**: All animations compute against the scene's local frame (`sceneFrame = frame - sceneStartFrame`).
- [ ] **Continuous Ambient Drift**: Cards feature subtle 1.018x drift over duration to maintain canvas vitality.

### D. Semantic Scene Selection & Context-Aware Subtitles
- [ ] **Semantic Scene Roles**: AI routes scenes based on narration meaning:
  - Chapter titles $\rightarrow$ `ChapterTitleScene` (Fraunces/Outfit, 56px, orange eyebrow pill).
  - Time-blocking & scheduling $\rightarrow$ `CalendarGridScene` (7-column pastel schedule blocks).
  - AI prompts & technical queries $\rightarrow$ `PromptWindowScene` (macOS header, mono text, `[...]` yellow brackets).
  - Progressive financial/skill milestones $\rightarrow$ `MilestoneLadderScene` (4-step staircase ladder, active milestone in emerald/amber with yellow tape).
  - Outreach scripts & communication templates $\rightarrow$ `ScriptBubbleScene` (chat/SMS bubble card, word-for-word copyable template).
  - Conceptual contrasts $\rightarrow$ `ComparisonScene` (2-column layout: Left Rose/Old vs Right Mint/AI).
  - Quotes & principles $\rightarrow$ `QuoteScene` (italic serif text, quote attribution).
- [ ] **Speech-Adequacy Subtitle Suppression**: Subtitles are suppressed ONLY when on-screen text adequately represents spoken narration ($\ge 75\%$ match or direct sentence representation). Subtitles remain visible during diagrams and explanations.

### E. Audio & Dynamic Ducking
- [ ] **Music Default ON**: Background music defaults to ON when a licensed track mood is chosen, with an explicit user toggle.
- [ ] **Speech Priority**: Dynamic volume ducking holds music volume at 0.10–0.12 during voiceover narration and smoothly swells during pauses.
- [ ] **Selective SFX**: Subtle pops, clicks, and riser whooshes trigger intentionally at major narrative beats.

---

## 4. 3-Phase Creator Studio Workflow

The Faceless Video Studio provides creators complete editorial control before cloud rendering:

### Phase 1: Upload & Voiceover Setup
1. **Audio Ingestion**: Creator uploads voiceover audio (MP3, WAV, M4A up to 5 minutes / 300s).
2. **Visuals**: Generated from the approved narration with animated SVG graphics. Stock and uploaded scene images are paused.
3. **Theme & Palette**: Selects from 12 Creator Core Colors or 28 animated themes.
4. **Audio & Subtitles**: Choose subtitle preset (`decodingyt`, `netflix-yellow`, `handwriting`, `stacy-pill`), BGM mood (`mystery`, `lofi`, `tech`, `none`), and SFX toggle.
5. **Action**: Click *"Transcribe Voiceover & Plan"* to trigger cloud transcription and structured scene generation.

### Phase 2: Transcript Review & Edit
1. **Audio Scrubber**: Review recognized words with synchronized audio playback.
2. **Segment Editor**: Edit any sentence to correct proper nouns, technical terms, or brands.
3. **Alignment Engine**: Validates sentence edits against audio duration and re-interpolates word timestamps without timeline drifting.
4. **Action**: Click *"Approve Transcript & View Storyboard"*.

### Phase 3: Storyboard & Scene Confirmation
1. **Scene Timeline Cards**: Inspect scene number, duration, assigned layout badge, transition type, and visual thumbnail preview.
2. **Graphic Review**: Preview each scene's SVG and supporting text. Visual type, labels, and values are not editable in the storyboard.
3. **Action**: Click *"Confirm Storyboard & Render Video"* to submit the confirmed blueprint to AWS Lambda.

---

## 5. Scene Transition Rules (Graphic-to-Graphic Motion)

Transitions between scenes are applied intentionally based on narrative rhythm:

| Transition Type | Motion Mechanics | Recommended Editorial Usage |
| :--- | :--- | :--- |
| **Cut** | Instantaneous 0-frame switch | Fast conversational beats, everyday edits, rapid sequential points |
| **Crossfade / Dissolve** | Smooth 10-frame opacity blend | Documentary passages, historical storytelling, calm narrative shifts |
| **Slide / Wipe** | Horizontal push (50px ➔ 0px) with fade | Chapter changes, numbered checklist steps, comparison points |
| **Zoom Transition** | Camera scale punch (1.08 ➔ 1.0) | Major hook revelations, key statistical cards, surprise shifts |
| **Fade to Black** | Dips through black overlay | Major act breaks, conclusions, topic transitions |

---

## 6. 7-Layer Visual Composition Stack

Faceless Video executes a broadcast-grade 7-layer visual composition stack inside `remotion/templates/FACELESS_LONG_VIDEO/template.tsx`:

| Layer | Depth | Component | Visual Function |
| :--- | :---: | :--- | :--- |
| **Layer 1** | `z: 1` | `Background` | Base atmospheric motion canvas (selected theme gradient / solid creator color). |
| **Layer 2** | `z: 3` | Deep Ambient Media Underlay | `blur(38px)` scaled footage underlay for split-screen scenes (disabled on light canvas). |
| **Layer 3** | `z: 15` | Dynamic Scene Layouts | Active scene composition (Full-Bleed Ken Burns, Split Screen, Stats, Workflows, Roadmaps). |
| **Layer 4** | `z: 30` | Subject Cutout & Stickers | Contextual stickers, floating cutout overlays, and product mockups. |
| **Layer 5** | `z: 40` | Broadcast HUD | Top edge Flame Orange progress indicator, topic kicker pill, and chapter lower-thirds. |
| **Layer 6** | `z: 50` | Word-Synced Kinetic Karaoke | High-contrast `UniversalCaptionLayer` with Flame Orange / Neon Yellow highlight boxes. |
| **Layer 7** | `z: 55` | Cinematic Finishing Scrim | Subtle edge vignette and cinema grading overlay. |

---

## 7. Master File Inventory (Complete Numbered Registry: #1 to #63)

> [!CAUTION]
> ### 🛑 STRICT FILE GOVERNANCE DIRECTIVE (FOUNDER MANDATE)
> 1. **MANDATORY INVENTORY REGISTRATION**: Whenever ANY new file is created, modified, or added for Faceless Video, registering it in this numbered master list is **100% COMPULSORY**. No unindexed or shadow files are allowed.
> 2. **END-TO-END EXECUTION INTEGRITY**: When a user inputs their idea, uploads audio, and clicks "Generate", the pipeline relies on the 61 runtime files and 2 product decision documents. If an AI or developer focuses only on a few files and neglects others (e.g. ignoring scene renderers, sound engines, or contrast handlers), the output video degrades.
> 3. **SEQUENTIAL PIPELINE MONITORING**: Every stage must pick its corresponding files on schedule:
>    - **Phase 1 Ingestion**: Files `#1` to `#11`, `#54`
>    - **Phase 2 Planning & SVG Graphic Selection**: Files `#12` to `#24`, #61
>    - **Phase 3 Storyboard & Layout**: Files `#28` to `#53`, #60
>    - **Phase 4 Remotion Lambda Render**: Files `#25` to `#27`, `#55` to `#60`

---

### 📁 7.1 Frontend Studio UI (#1 – #4)
| # | File Path | Role | Description |
| :---: | :--- | :--- | :--- |
| **#1** | [`components/dashboard/FacelessVideoStudio.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/FacelessVideoStudio.tsx) | Studio Wizard | 3-Phase Faceless Studio Wizard: Phase 1 Setup, Phase 2 Transcript Editor, Phase 3 Storyboard Review. |
| **#2** | [`components/dashboard/subpages/FacelessVideoPageClient.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/subpages/FacelessVideoPageClient.tsx) | Page Client | Client state orchestrator, audio presigned upload via S3, render polling, and error recovery. |
| **#3** | [`components/dashboard/BackgroundPicker.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/BackgroundPicker.tsx) | Theme Picker | Interactive background picker for 12 Creator Core Colors, 28 animated themes, and custom uploads. |
| **#4** | [`app/dashboard/faceless-video/page.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/dashboard/faceless-video/page.tsx) | Route Page | Next.js Server Component page mounting the studio at `/dashboard/faceless-video`. |

### ⚙️ 7.2 Backend API Routes (#5 – #11)
| # | File Path | Role | Description |
| :---: | :--- | :--- | :--- |
| **#5** | [`app/api/reels/plan-faceless-video/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/plan-faceless-video/route.ts) | Planning API (`POST`) | Transcribes audio via Groq/Gemini, aligns sentences, plans structured blueprint & matches media. |
| **#6** | [`app/api/reels/jobs/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/route.ts) | Render API (`POST`) | Assembles Remotion `inputProps`, validates preflight checks, resolves fallbacks, and dispatches Lambda. |
| **#7** | [`app/api/reels/jobs/status/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/status/route.ts) | Status API (`GET`) | Polls Lambda render progress, checks cancellation registry, and returns MP4 download URL. |
| **#8** | [`app/api/reels/jobs/cancel/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/cancel/route.ts) | Cancel API (`POST`) | Cancels in-flight render jobs and registers cancellation state. |
| **#9** | [`app/api/media/presign/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/media/presign/route.ts) | Presign API (`POST`) | Generates secure presigned S3 URLs for voiceover audio and custom background uploads. |
| **#10** | [`app/api/reels/jobs/presign/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/presign/route.ts) | Compatibility Route | Backwards-compatibility re-export route forwarding legacy presign calls to `/api/media/presign`. |
| **#11** | [`lib/jobs/cancellationRegistry.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/lib/jobs/cancellationRegistry.ts) | State Registry | Server-side cancellation registry that survives process restarts. |

### 🧠 7.3 AI Planning, Alignment & Cloud Transcription (#12 – #17)
| # | File Path | Role | Description |
| :---: | :--- | :--- | :--- |
| **#12** | [`services/ai/aiScenePlanner.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/aiScenePlanner.ts) | Scene Planner | Plans structured scene blueprints (`SceneBlueprintItem[]`), visual intents, and transitions. |
| **#13** | [`services/ai/transcriptAlignment.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/transcriptAlignment.ts) | Text Alignment | Validates and re-interpolates sentence edits against audio duration without timeline drift. |
| **#14** | [`services/ai/groqTranscription.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/groqTranscription.ts) | Groq Whisper | Primary speech-to-text cloud transcription engine with millisecond-precision word timestamps. |
| **#15** | [`services/ai/geminiTranscription.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/geminiTranscription.ts) | Gemini Fallback | Cloud fallback speech-to-text engine using Google Gemini 2.0 Flash (`asia-south1`). |
| **#16** | [`services/ai/sceneBlueprintTypes.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/sceneBlueprintTypes.ts) | Type Definitions | TypeScript interfaces for scenes, typography hierarchies, and narrative segments. |
| **#17** | [`services/ai/reelPlanner.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/reelPlanner.ts) | Video Registry | Master registry configuration for `FACELESS_VIDEO` defining limits, format, and composition ID. |
| **#61** | services/ai/facelessGraphicPlanner.ts | SVG Visual Planner | Uses AI-selected typed layouts and source-validated chart points/steps, with deterministic transcript-derived fallback. |

### 🖼️ 7.4 Legacy Asset Matching & Paused Stock Media Engines (#18 – #22)
| # | File Path | Role | Description |
| :---: | :--- | :--- | :--- |
| **#18** | [`services/ai/aiImageLibraryMatcher.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/aiImageLibraryMatcher.ts) | Library Matcher | Semantic matcher for curated Cloudinary ChatGPT image library with usage penalty tracking. |
| **#19** | [`services/ai/smartMediaMatcher.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/smartMediaMatcher.ts) | Upload Matcher | Matches creator-uploaded photos/clips to scenes based on script keywords and vision tags. |
| **#20** | [`services/ai/pexelsImages.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/pexelsImages.ts) | Legacy Pexels client, paused for this video mode | Searches 1080p Full HD MP4 video clips and high-resolution landscape photography. |
| **#21** | [`services/ai/visionAutoTagger.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/visionAutoTagger.ts) | Vision Auto-Tagger | Auto-tags uploaded images with semantic labels and descriptions using vision AI. |
| **#22** | [`constants/itnavideoStockAssets.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/constants/itnavideoStockAssets.ts) | Asset URL Helper | Normalizes relative asset paths to absolute AWS S3 URLs (`toAbsoluteS3AssetUrl`). |

### 🎵 7.5 Sound Design & Audio Assets (#23 – #24)
| # | File Path | Role | Description |
| :---: | :--- | :--- | :--- |
| **#23** | [`services/ai/sfxEngine.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/sfxEngine.ts) | Sound Design Engine | Automatically maps scene transitions and numeric callouts to synchronized SFX events. |
| **#24** | [`public/assets/reusable/sound-effects/`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/public/assets/reusable/sound-effects/) | Reusable Audio | 50 reusable 48kHz WAV audio files (whooshes, pops, mouse clicks, bells, cash registers). |

### 🎬 7.6 Remotion Compositions & Engine (#25 – #27)
| # | File Path | Role | Description |
| :---: | :--- | :--- | :--- |
| **#25** | [`remotion/templates/FACELESS_VIDEO/template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_VIDEO/template.tsx) | Master Composition | Defines `<Composition id="FACELESS-VIDEO">` strictly at 16:9 (`1920×1080`) @ 30 FPS up to 300s. |
| **#26** | [`remotion/templates/FACELESS_LONG_VIDEO/template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | Visual Template Engine | 7-layer visual template engine, audio ducking, HUD, and scene timeline coordinator. |
| **#27** | [`remotion/index.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/index.tsx) | Remotion Root | Central Remotion registry registering `FacelessVideoComposition` for Lambda. |

### 🎨 7.7 Modular Scene Renderers (#28 – #44)
| # | File Path | Scene Mode | Visual Description |
| :---: | :--- | :--- | :--- |
| **#28** | [`FullBleedVisualScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/FullBleedVisualScene.tsx) | Full Bleed Media | Full-bleed 1080p media with directional continuous Ken Burns pan/zoom motion. |
| **#29** | [`CardConceptScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/CardConceptScene.tsx) | Concept Scene | Editorial concept scene featuring sticker cutout media, contextual emoji, and marker tape takeaway. |
| **#30** | [`StatScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/StatScene.tsx) | Stat Callout | Validated numeric callout scene with animated spring counter and frosted media background. |
| **#31** | [`ComparisonScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ComparisonScene.tsx) | Comparison Arena | Neil Patel VS Battle Arena and Stacy La dual-phone comparison showcase. |
| **#32** | [`WorkflowScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/WorkflowScene.tsx) | Workflow Pipeline | 4-node AI Employee workflow pipeline (Calls ➔ Active Agent ➔ Knowledge ➔ Booking). |
| **#33** | [`RoadmapScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/RoadmapScene.tsx) | Roadmap Timeline | 4-step milestone roadmap scene with connecting gradient beam and competency badges. |
| **#34** | [`GoalTargetScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/GoalTargetScene.tsx) | Goal & Finance | Ankur Warikoo benchmark personal finance goal scene: 50/30/20 breakdown card and easel. |
| **#35** | [`ChartScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ChartScene.tsx) | Studio Analytics | YouTube Creator Studio analytics growth scene with animated SVG curve. |
| **#36** | [`ScreenshotScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ScreenshotScene.tsx) | Search & Video Card | DecodingYT typing search bar and tilted YouTube video card mockups. |
| **#37** | [`EcosystemScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/EcosystemScene.tsx) | Framework Hub | Sandeep Swadia "Framework in a Box" ecosystem scene with central hub and orbiting cards. |
| **#38** | [`HookScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/HookScene.tsx) | High-Energy Hook | High-impact opening hook scene with spring scale and Flame Orange keyword highlight. |
| **#39** | [`ChapterTitleScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ChapterTitleScene.tsx) | Chapter Divider | Topic and milestone section divider scene. |
| **#40** | [`ListScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ListScene.tsx) | Step Checklist | Numbered step-by-step checklist scene with staggered entrance animations. |
| **#41** | [`QuoteScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/QuoteScene.tsx) | Editorial Quote | Quotation typography card with author attribution and quotation marks. |
| **#42** | [`TypographyScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/TypographyScene.tsx) | Kinetic Typography | Kinetic typography scene for punchline emphasis without media distraction. |
| **#43** | [`ImageTextScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ImageTextScene.tsx) | Side-by-Side Text | Side-by-side visual and narrative text scene. |
| **#44** | [`ConclusionScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ConclusionScene.tsx) | Outro CTA | Summary and call-to-action outro scene. |

### 🧩 7.8 Visual Components & Micro-Interactions (#45 – #54)
| # | File Path | Component | Description |
| :---: | :--- | :--- | :--- |
| **#45** | [`HighlightText.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/HighlightText.tsx) | Marker Highlighter | DecodingYT marker-tape box highlighter with Flame Orange and Neon Yellow spring entrance. |
| **#46** | [`DualPhoneShowcase.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/DualPhoneShowcase.tsx) | Phone Mockups | Stacy La benchmark dual-phone 3D tilted smartphones with sales chart and revenue pills. |
| **#47** | [`DecodingCardMockup.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/DecodingCardMockup.tsx) | Card Mockup | White outline sticker cutout styling, typing search bar, and tilted video cards. |
| **#48** | [`SplitScreenLayout.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/SplitScreenLayout.tsx) | Split Layout | 50/50 cinematic composition with image on one side and frosted typography on the other. |
| **#49** | [`ResponsiveTypography.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/ResponsiveTypography.tsx) | Adaptive Scaler | Adaptive typography engine balancing line wraps and font sizes to avoid container clipping. |
| **#50** | [`StatBadge.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/StatBadge.tsx) | Metric Badge | Micro-badge displaying metric pills and tags. |
| **#51** | [`Heading.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/Heading.tsx) | Section Heading | Section heading component with typography hierarchy. |
| **#52** | [`Connector.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/Connector.tsx) | Flow Connector | Connecting SVG curves, dashed lines, and flow arrows between module nodes. |
| **#53** | [`BrowserMockupFrame.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/BrowserMockupFrame.tsx) | Browser Frame | Minimal browser mockup frame for website demonstrations and screenshots. |
| **#54** | [`Background.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/Background.tsx) | Pass-Through | Re-export forwarding to shared deterministic background renderer. |

### 🌐 7.9 Shared Visual Layers (Subtitles, Backgrounds, HUD) (#55 – #60)
| # | File Path | Shared Layer | Description |
| :---: | :--- | :--- | :--- |
| **#55** | [`remotion/components/backgrounds/Background.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/backgrounds/Background.tsx) | Background Engine | Deterministic, Remotion-native background renderer for all solid colors and animated SVG gradients. |
| **#56** | [`remotion/components/backgrounds/BackgroundCatalog.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/backgrounds/BackgroundCatalog.ts) | Theme Catalog | Master catalog of 12 Creator Core Colors, 28 background themes, and `getBackgroundPalette()` tokens. |
| **#57** | [`remotion/components/library/UniversalCaptionLayer.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/library/UniversalCaptionLayer.tsx) | Caption Engine | Word-synced karaoke subtitles with presets (`decodingyt`, `handwriting`, `stacy-pill`, `bouncy`). |
| **#58** | [`remotion/components/library/UniversalLowerThird.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/library/UniversalLowerThird.tsx) | Chapter Lower-Third | Animated chapter lower-third cards triggered by transcript milestones. |
| **#59** | [`remotion/components/library/UniversalStickerLayer.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/library/UniversalStickerLayer.tsx) | Sticker Overlay | Floating sticker and icon overlay layer. |
| **#60** | remotion/templates/FACELESS_LONG_VIDEO/scenes/FacelessGraphicScene.tsx | SVG Scene Renderer | Animated transcript-led allocation, comparison, sequence, metric, concept, and growth/time-series SVG scenes. |

---

## 8. Standard Operating Procedure (SOP) & Master Quality Checklist

> [!IMPORTANT]
> The single source of truth for the complete engineering and editorial standards is documented in [**`docs/SOP_FACELESS_VIDEO.md`**](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/docs/SOP_FACELESS_VIDEO.md).
> Every video planned, edited, and rendered under the Faceless Video workflow MUST strictly comply with this SOP.

> [!CAUTION]
> ### 🛑 FOUNDER DIRECTIVES (NON-NEGOTIABLE)
> 1. **Zero Website SaaS Cards**: No floating rounded card containers (`borderRadius: 36px`, `backdrop-filter: blur(28px)`) trapping visuals or text like a SaaS landing page. Render pure full-bleed 1920×1080 cinema footage, split screens, and direct typography scrims.
> 2. **100% Background Loyalty**: User-chosen background (white, cream, black, gradient) MUST be the exact background across the entire video. Scene root containers must be transparent (`backgroundColor: 'transparent'`), never masked with `#020617` or blueish radial gradients.
> 3. **Senior Human Editor Standard (No Robotic AI Feel)**: Smooth dynamic Ken Burns camera motion via `sceneFrame`, zero image repetition, organic sound ducking (12% voice / 26% pause), and Marker Tape subtitle highlights.

### 📋 Pre-Flight Quality Gates Checklist (15/15 Mandatory)

#### A. Ingestion & Limits
- [ ] **GATE 1**: Video Duration is strictly <= 300s (5 Minutes) at 30 FPS MP4.
- [ ] **GATE 2**: Aspect Ratio is strictly 16:9 Widescreen (`1920×1080`).
- [ ] **GATE 3**: Voiceover audio is extracted to 16kHz mono before Groq Whisper transcription.

#### B. Visual & Semantic Integrity
- [ ] **GATE 4**: Every scene has a transcript-derived SVG plan. Numeric chart values and time points must occur in the approved narration.
- [ ] **GATE 5**: Stock, Pexels, custom scene uploads, and custom image backgrounds are disabled.
- [ ] **GATE 6**: Every scene has a complete thought ($3.0\text{s}$ to $7.5\text{s}$ duration).

#### C. Remotion Motion & Canvas Engine
- [ ] **GATE 7**: SVG motion uses Remotion scene-local frames and stays inside the 16:9 safe area.
- [ ] **GATE 8**: Graphic motion is scene-local and explanatory: lines draw, bars fill, nodes reveal, metrics enter, and chart points stagger within the scene duration.
- [ ] **GATE 9**: Zero CSS transitions (`transition: transform ...`) — all motion uses Remotion math.
- [ ] **GATE 10**: User-selected background theme is 100% visible (no opaque `#020617` scene masks).
- [ ] **GATE 11**: On white/light backgrounds, captions and text render in high-contrast Obsidian Slate (`#0F172A`).
- [ ] **GATE 12**: No floating website card containers (`borderRadius: 36px` web boxes) in scene layouts.

#### D. Audio & Sound Design
- [ ] **GATE 13**: Voiceover volume is normalized to 1.35; background music ducked to 0.12 during speech.
- [ ] **GATE 14**: Ducking transitions smoothly with a 6-frame exponential window (no abrupt audio pops).
- [ ] **GATE 15**: Sound effects trigger selectively on key narrative transitions.

---

## 9. Historical Verified Changes & Milestone Log

<details>
<summary><strong>Click to expand historical engineering changes and verified fixes</strong></summary>

| Target Component | Modification Summary |
| :--- | :--- |
| [`BackgroundCatalog.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/backgrounds/BackgroundCatalog.ts) | Added `decoding-grid` (Halftone Dotted Grid) and `youtube-dark` (Creator Studio Slate) background themes. |
| [`Background.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/backgrounds/Background.tsx) | Implemented deterministic Remotion renderers for `decoding-grid` and `youtube-dark` themes. |
| [`BackgroundPicker.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/BackgroundPicker.tsx) | Added live visual card previews for DecodingYT Dotted Grid and YouTube Studio Dark backgrounds. |
| [`FacelessVideoStudio.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/FacelessVideoStudio.tsx) | Added `warikoo-yellow` with solid neon yellow box & Rupee symbol; added `handwriting-story`; added `stacy-pill`. |
| [`GoalTargetScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/GoalTargetScene.tsx) | Created Ankur Warikoo benchmark personal finance goal scene: Monthly Salary 50/30/20 card alongside Physical Target Easel. |
| [`UniversalCaptionLayer.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/library/UniversalCaptionLayer.tsx) | Upgraded `animationStyle === 'handwriting'` with Google Fonts `Caveat` & `Kalam` and wavy ink underlines; added `capsule` / `stacy-pill`. |
| [`template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | Integrated `pen-writing.wav` and `page-flip.wav` auto-triggers for handwriting and storytelling cues. |
| [`DualPhoneShowcase.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/DualPhoneShowcase.tsx) | Created Stacy La benchmark dual-phone showcase featuring two 3D tilted smartphones, sales chart, and floating revenue pills. |
| [`ComparisonScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ComparisonScene.tsx) | Integrated `DualPhoneShowcase` for contextual mobile app comparison alongside Neil Patel VS Battle Arena. |
| [`WorkflowScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/WorkflowScene.tsx) | Created Neil Patel benchmark 4-node "AI Employee" workflow pipeline. |
| [`RoadmapScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/RoadmapScene.tsx) | Created Maddy Zhang benchmark 4-step accelerated roadmap scene with glowing numbered milestone nodes. |
| [`HighlightText.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/HighlightText.tsx) | Added automatic solid Crimson Red block highlight (`#EF4444`) for anti-pattern keywords. |
| [`sound-effects/`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/public/assets/reusable/sound-effects/) | Verified and indexed 50 reusable 48kHz WAV sound effects in `public/assets/assets.json`. |
| [`DecodingCardMockup.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/DecodingCardMockup.tsx) | Created white outline sticker cutouts, tilted YouTube cards, typing search bar, and Stripe payment toast alerts. |
| [`template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | Built automated `resolvedSfxEvents` pipeline auto-mapping scene narrative transitions to sound effects. |
| [`ChartScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ChartScene.tsx) | Upgraded into YouTube Creator Studio Analytics Growth Card with animated SVG curve. |
| [`EcosystemScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/EcosystemScene.tsx) | Created Sandeep Swadia style "Framework in a Box" ecosystem scene. |
| [`ComparisonScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ComparisonScene.tsx) | Upgraded with Neil Patel-style dynamic battle arena with Flame Orange energy VS badge. |
| [`ScreenshotScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ScreenshotScene.tsx) | Integrated DecodingYT search bar and tilted YouTube video card mockups. |
| [`CardConceptScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/CardConceptScene.tsx) | Applied 4px white outline sticker styling with 3D tilt and HighlightText marker tape effect. |
| [`UniversalCaptionLayer.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/library/UniversalCaptionLayer.tsx) | Added DecodingYT marker / highlighter karaoke subtitle preset. |
| [`HighlightText.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/HighlightText.tsx) | Guarded `highlightedWords` with `filter(Boolean)` and safe string matching. |
| [`groqTranscription.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/groqTranscription.ts) | Guarded `safeFileName(fileName)` against undefined/null filenames. |
| [`FacelessVideoPageClient.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/subpages/FacelessVideoPageClient.tsx) | Fixed `onRetry` passing SyntheticEvent as payload; guarded `plannedTitle` and audio filename replace calls. |
| [`responsiveLayoutEngine.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/typography/responsiveLayoutEngine.ts) | Added safe string coercion in `balanceLineWraps` and `extractStatistic`. |
| [`jobs/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/route.ts) | Guarded `validateLocalImageSource` and `uploadLocalAssetToS3` against non-string inputs. |
| [`aiScenePlanner.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/aiScenePlanner.ts) | Restored true multi-layout mapping in `normalizeVisualLayout`. |
| [`template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | Built 7-Layer visual engine with ambient media underlay, broadcast HUD, and multi-layout rendering. |
| [`FullBleedVisualScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/FullBleedVisualScene.tsx) | Implemented 3 varied layout positions to prevent visual monotony. |
| [`cancellationRegistry.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/lib/jobs/cancellationRegistry.ts) | Created persistent cancellation registry surviving server restarts. |
| [`transcriptAlignment.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/transcriptAlignment.ts) | Created transcript validation & word boundary alignment engine. |
| [`plan-faceless-video/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/plan-faceless-video/route.ts) | Dedicated planning endpoint for speech transcription & storyboard generation. |
| [`smartMediaMatcher.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/smartMediaMatcher.ts) | Fixed bug where score-0 uploaded images were forced into unrelated scenes. |
| [`aiScenePlanner.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/aiScenePlanner.ts) | Implemented intelligent transition mapping (cut, dissolve, slide, zoom, fade_to_black). |
| [`template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | Implemented full transition styles, fade-to-black overlay, strictly 16:9 caption offsets & 300s limit. |
| [`Background.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/Background.tsx) | Fixed hardcoded FPS: 60 watermark to read actual composition fps. |
| [`template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_VIDEO/template.tsx) | Strictly 16:9 format (`1920×1080`), removed 9:16 fallback logic. |
| [`jobs/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/route.ts) | Reuses confirmed `sceneBlueprint`, `brollUrls`, and `approvedCaptions` with 100% fidelity. |
| [`FacelessVideoStudio.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/FacelessVideoStudio.tsx) | Redesigned with premium white UI, 3-step wizard, audio playback, and storyboard review. |
| [`FacelessVideoPageClient.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/subpages/FacelessVideoPageClient.tsx) | Switched to centralized `uploadFileViaPresign` from `@/lib/media/presignedUpload`. |
| [`presign/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/media/presign/route.ts) | Added on-demand S3 read URL generation via `action: 'read'` with `createReadUrl`. |
| [`plan-faceless-video/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/plan-faceless-video/route.ts) | Auto-resolves raw S3 `mediaKey` and uploaded image keys using `createReadUrl`. |
| [`FullBleedVisualScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/FullBleedVisualScene.tsx) | Rebuilt with full-bleed 1920x1080 Ken Burns continuous scale/pan and removed bulky gray card container. |
| [`StatScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/StatScene.tsx) | Added full-bleed media background with dark frosted glass overlay; added direct fallback to FullBleedVisualScene. |
| [`assetPlanner.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/assetPlanner.ts) | Enriched `generateCleanConceptHeading` with comprehensive Hinglish and English conceptual mappings. |
| [`pexelsImages.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/pexelsImages.ts) | Integrated Pexels API (`PEXELS_API_KEY`) for high-resolution stock photography and video clips. |
| [`jobs/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/route.ts) | Implemented confirmed storyboard fast-path directly reusing client transcript and approved scenes. |
| [`FacelessVideoPageClient.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/subpages/FacelessVideoPageClient.tsx) | Added `lastStoryboardPayloadRef` caching so retry attempts preserve all approved scenes. |
</details>

## Related Product Decisions

- #62: [Faceless Video Visual Planning Glossary](./01-faceless-video/GLOSSARY.md)
- #63: [Transcript-Grounded SVG Visuals ADR](./01-faceless-video/ADR-001-faceless-svg-visuals.md)
