# Faceless Video: Master File Catalog (#1 to #63)

> **All files that power the 16:9 Faceless Video Generation Engine.**  
> Click any link below to jump directly into the code file.

---

## 📁 Phase 1: Frontend Studio & Ingestion UI (#1 – #4)
| # | File | Purpose |
| :-: | :--- | :--- |
| **#1** | [`FacelessVideoStudio.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/FacelessVideoStudio.tsx) | 3-Phase Faceless Studio Wizard (Phase 1 Setup, Phase 2 Transcript Editor, Phase 3 Storyboard Review). |
| **#2** | [`FacelessVideoPageClient.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/subpages/FacelessVideoPageClient.tsx) | Client state orchestrator, audio presigned upload via S3, render polling, and error recovery. |
| **#3** | [`BackgroundPicker.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/components/dashboard/BackgroundPicker.tsx) | Interactive background picker for 12 Creator Core Colors, 28 animated themes, and custom uploads. |
| **#4** | [`page.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/dashboard/faceless-video/page.tsx) | Next.js Server Component page mounting the studio at `/dashboard/faceless-video`. |

---

## ⚙️ Phase 1 Backend API Routes (#5 – #11)
| # | File | Purpose |
| :-: | :--- | :--- |
| **#5** | [`plan-faceless-video/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/plan-faceless-video/route.ts) | Transcribes audio via Groq/Gemini, aligns sentences, plans structured blueprint & matches media. |
| **#6** | [`jobs/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/route.ts) | Assembles Remotion `inputProps`, validates preflight checks, resolves fallbacks, and dispatches Lambda. |
| **#7** | [`jobs/status/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/status/route.ts) | Polls Lambda render progress, checks cancellation registry, and returns MP4 download URL. |
| **#8** | [`jobs/cancel/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/cancel/route.ts) | Cancels in-flight render jobs and registers cancellation state. |
| **#9** | [`media/presign/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/media/presign/route.ts) | Generates secure presigned S3 URLs for voiceover audio and custom background uploads. |
| **#10** | [`jobs/presign/route.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/app/api/reels/jobs/presign/route.ts) | Backwards-compatibility re-export route forwarding legacy presign calls to `/api/media/presign`. |
| **#11** | [`cancellationRegistry.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/lib/jobs/cancellationRegistry.ts) | Server-side cancellation registry that survives process restarts. |

---

## 🧠 Phase 2: AI Planning, Alignment & Transcription (#12 – #17, #61)
| # | File | Purpose |
| :-: | :--- | :--- |
| **#12** | [`aiScenePlanner.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/aiScenePlanner.ts) | Plans structured scene blueprints (`SceneBlueprintItem[]`), visual intents, and transitions. |
| **#13** | [`transcriptAlignment.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/transcriptAlignment.ts) | Validates and re-interpolates sentence edits against audio duration without timeline drift. |
| **#14** | [`groqTranscription.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/groqTranscription.ts) | Primary speech-to-text cloud transcription engine with millisecond-precision word timestamps. |
| **#15** | [`geminiTranscription.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/geminiTranscription.ts) | Cloud fallback speech-to-text engine using Google Gemini 2.0 Flash (`asia-south1`). |
| **#16** | [`sceneBlueprintTypes.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/sceneBlueprintTypes.ts) | TypeScript interfaces for scenes, typography hierarchies, and narrative segments. |
| **#17** | [`reelPlanner.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/reelPlanner.ts) | Master registry configuration for `FACELESS_VIDEO` defining limits, format, and composition ID. |
| **#61** | services/ai/facelessGraphicPlanner.ts | SVG Visual Planner | Uses AI-selected typed layouts plus transcript validation for growth charts, allocations, comparisons, sequences, metrics, and concepts. |

---

## 🖼️ Phase 2: Stock Media Engines & Asset Matching (#18 – #22)
| # | File | Purpose |
| :-: | :--- | :--- |
| **#18** | [`aiImageLibraryMatcher.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/aiImageLibraryMatcher.ts) | Semantic matcher for curated Cloudinary ChatGPT image library with usage penalty tracking. |
| **#19** | [`smartMediaMatcher.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/smartMediaMatcher.ts) | Matches creator-uploaded photos/clips to scenes based on script keywords and vision tags. |
| **#20** | [`pexelsImages.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/pexelsImages.ts) | Searches 1080p Full HD MP4 video clips and high-resolution landscape photography. |
| **#21** | [`visionAutoTagger.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/visionAutoTagger.ts) | Auto-tags uploaded images with semantic labels and descriptions using vision AI. |
| **#22** | [`itnavideoStockAssets.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/constants/itnavideoStockAssets.ts) | Normalizes relative asset paths to absolute AWS S3 URLs (`toAbsoluteS3AssetUrl`). |

---

## 🎵 Phase 2: Sound Design & Audio Assets (#23 – #24)
| # | File | Purpose |
| :-: | :--- | :--- |
| **#23** | [`sfxEngine.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/services/ai/sfxEngine.ts) | Automatically maps scene transitions and numeric callouts to synchronized SFX events. |
| **#24** | [`sound-effects/`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/public/assets/reusable/sound-effects/) | 50 reusable 48kHz WAV audio files (whooshes, pops, mouse clicks, bells, cash registers). |

---

## 🎬 Phase 3 & 4: Remotion Master Compositions (#25 – #27)
| # | File | Purpose |
| :-: | :--- | :--- |
| **#25** | [`FACELESS_VIDEO/template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_VIDEO/template.tsx) | Defines `<Composition id="FACELESS-VIDEO">` strictly at 16:9 (`1920×1080`) @ 30 FPS up to 300s (5 min). |
| **#26** | [`FACELESS_LONG_VIDEO/template.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | 7-layer visual template engine, audio ducking, HUD, and scene timeline coordinator. |
| **#27** | [`remotion/index.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/index.tsx) | Central Remotion registry registering `FacelessVideoComposition` for Lambda. |

---

## 🎨 Phase 3: 17 Modular Scene Renderers (#28 – #44)
| # | File | Purpose |
| :-: | :--- | :--- |
| **#28** | [`FullBleedVisualScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/FullBleedVisualScene.tsx) | Full-bleed 1080p media with directional continuous Ken Burns pan/zoom motion. |
| **#29** | [`CardConceptScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/CardConceptScene.tsx) | Editorial concept scene featuring sticker cutout media, contextual emoji, and marker tape takeaway. |
| **#30** | [`StatScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/StatScene.tsx) | Validated numeric callout scene with animated spring counter and frosted media background. |
| **#31** | [`ComparisonScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ComparisonScene.tsx) | Neil Patel VS Battle Arena and Stacy La dual-phone comparison showcase. |
| **#32** | [`WorkflowScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/WorkflowScene.tsx) | 4-node AI Employee workflow pipeline (Calls ➔ Active Agent ➔ Knowledge ➔ Booking). |
| **#33** | [`RoadmapScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/RoadmapScene.tsx) | 4-step milestone roadmap scene with connecting gradient beam and competency badges. |
| **#34** | [`GoalTargetScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/GoalTargetScene.tsx) | Ankur Warikoo benchmark personal finance goal scene: 50/30/20 breakdown card and easel. |
| **#35** | [`ChartScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ChartScene.tsx) | YouTube Creator Studio analytics growth scene with animated SVG curve. |
| **#36** | [`ScreenshotScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ScreenshotScene.tsx) | DecodingYT typing search bar and tilted YouTube video card mockups. |
| **#37** | [`EcosystemScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/EcosystemScene.tsx) | Sandeep Swadia "Framework in a Box" ecosystem scene with central hub and orbiting cards. |
| **#38** | [`HookScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/HookScene.tsx) | High-impact opening hook scene with spring scale and Flame Orange keyword highlight. |
| **#39** | [`ChapterTitleScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ChapterTitleScene.tsx) | Topic and milestone section divider scene. |
| **#40** | [`ListScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ListScene.tsx) | Numbered step-by-step checklist scene with staggered entrance animations. |
| **#41** | [`QuoteScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/QuoteScene.tsx) | Quotation typography card with author attribution and quotation marks. |
| **#42** | [`TypographyScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/TypographyScene.tsx) | Kinetic typography scene for punchline emphasis without media distraction. |
| **#43** | [`ImageTextScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ImageTextScene.tsx) | Side-by-side visual and narrative text scene. |
| **#44** | [`ConclusionScene.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/ConclusionScene.tsx) | Summary and call-to-action outro scene. |

---

## 🧩 Phase 3: Visual Components & Micro-Interactions (#45 – #54)
| # | File | Purpose |
| :-: | :--- | :--- |
| **#45** | [`HighlightText.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/HighlightText.tsx) | DecodingYT marker-tape box highlighter with Flame Orange and Neon Yellow spring entrance. |
| **#46** | [`DualPhoneShowcase.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/DualPhoneShowcase.tsx) | Stacy La benchmark dual-phone 3D tilted smartphones with sales chart and revenue pills. |
| **#47** | [`DecodingCardMockup.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/DecodingCardMockup.tsx) | White outline sticker cutout styling, typing search bar, and tilted video cards. |
| **#48** | [`SplitScreenLayout.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/SplitScreenLayout.tsx) | 50/50 cinematic composition with image on one side and frosted typography on the other. |
| **#49** | [`ResponsiveTypography.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/ResponsiveTypography.tsx) | Adaptive typography engine balancing line wraps and font sizes to avoid container clipping. |
| **#50** | [`StatBadge.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/StatBadge.tsx) | Micro-badge displaying metric pills and tags. |
| **#51** | [`Heading.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/Heading.tsx) | Section heading component with typography hierarchy. |
| **#52** | [`Connector.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/Connector.tsx) | Connecting SVG curves, dashed lines, and flow arrows between module nodes. |
| **#53** | [`BrowserMockupFrame.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/BrowserMockupFrame.tsx) | Minimal browser mockup frame for website demonstrations and screenshots. |
| **#54** | [`Background.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/Background.tsx) | Re-export forwarding to shared deterministic background renderer. |

---

## 🌐 Phase 4: Shared Visual Layers (#55 – #60)
| # | File | Purpose |
| :-: | :--- | :--- |
| **#55** | [`Background.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/backgrounds/Background.tsx) | Deterministic, Remotion-native background renderer for all solid colors and animated SVG gradients. |
| **#56** | [`BackgroundCatalog.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/backgrounds/BackgroundCatalog.ts) | Master catalog of 12 Creator Core Colors, 28 background themes, and `getBackgroundPalette()` tokens. |
| **#57** | [`UniversalCaptionLayer.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/library/UniversalCaptionLayer.tsx) | Word-synced karaoke subtitles with presets (`decodingyt`, `handwriting`, `stacy-pill`, `bouncy`). |
| **#58** | [`UniversalLowerThird.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/library/UniversalLowerThird.tsx) | Animated chapter lower-third cards triggered by transcript milestones. |
| **#59** | [`UniversalStickerLayer.tsx`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/remotion/components/library/UniversalStickerLayer.tsx) | Floating sticker and icon overlay layer. |
| **#60** | remotion/templates/FACELESS_LONG_VIDEO/scenes/FacelessGraphicScene.tsx | SVG Scene Renderer | Animated transcript-led SVG allocations, comparisons, sequences, metrics, concept maps, and growth/time-series charts. |

## Product Decision Documents
- **#62**: [GLOSSARY.md](./GLOSSARY.md) — visual-planning domain glossary.
- **#63**: [ADR-001-faceless-svg-visuals.md](./ADR-001-faceless-svg-visuals.md) — accepted SVG-first planning decision.