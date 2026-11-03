# Faceless AI Shorts Generator (`faceless-shorts.md`)

**ID**: `FACELESS_SHORTS` / `facelessShorts`
**Aspect Ratio**: **9:16 Vertical Only (`1080×1920` @ 30 FPS MP4)**
**Max Duration**: **Up to 90 Seconds (90s)**
**Credit Cost**: **1 Credit per video**

## Overview
The Faceless AI Shorts Generator automates the creation of vertical, high-retention 9:16 short videos (up to 90 seconds). Instead of chopping audio at arbitrary fixed intervals (like 4s or 7s), it generates a **detailed Scene-by-Scene JSON Blueprint** aligned to natural spoken sentences and thoughts, selecting the ideal vertical scene layout, structured data, and vector illustration for every beat.

## Pipeline Architecture
1. **Natural Sentence Timeline Builder (`services/ai/sentenceTimelineBuilder.ts`)**:
   - Builds one scene per natural spoken sentence or complete thought (`buildSentenceScenes`).
   - Cuts occur strictly at real sentence punctuation (`. ! ? ।`) or natural speaker pauses (`>= 0.45s`), never slicing sentences mid-phrase with arbitrary 4s/7s timers.
2. **Scene-by-Scene JSON Director (`services/ai/aiScenePlanner.ts`)**:
   - Receives `aspectRatio: '9:16'` and `videoType: 'facelessShorts'`.
   - Produces a rich Scene-by-Scene JSON (`SceneBlueprintItem[]`) for each sentence containing:
     - `sceneNumber`, `startSec`, `endSec`, `durationSec`, `narrationText`, `englishMeaning`
     - `sceneType`, `layoutType`, `categoryPill`, `heading`, `supportingText`, `highlightedWords`
     - `vectorDrawingId` (rotating across 16 vector illustrations with zero back-to-back repeats)
     - Structured layout data: `comparisonItems`, `listItems`, `timelineSteps`, `checklistItems`, `statValue`, `statLabel`, `statTrend`, `chartItems`, `donutSlices`, `chatMessages`, `quoteAuthor`
     - `sfx`, `transition`, and `graphicPlan`
3. **Strictly 9:16 Decoupled Backend (`app/api/reels/plan-faceless-video/route.ts` & `app/api/reels/jobs/route.ts`)**:
   - Passes `aspectRatio: '9:16'`, `videoType: 'facelessShorts'`, and word-level timestamps (`words`) directly into `generateStructuredSceneBlueprint`.
4. **Dedicated 9:16 Remotion Composition (`remotion/templates/FACELESS_SHORTS/template.tsx`)**:
   - Renders specifically at `1080×1920` inside vertical safe-zones.
   - **Priority Scene Routing**:
     1. Specialized narrative & structured scenes (`ChapterTitleScene`, `CalendarGridScene`, `PromptWindowScene`, `MilestoneLadderScene`, `ScriptBubbleScene`, `HorizontalProcessStepsScene`, `QuoteScene`, `ComparisonScene`, `StatScene`, `WorkflowScene`, `RoadmapScene`, `GoalTargetScene`, `ChartScene`, `ScreenshotScene`, `EcosystemScene`) execute first when selected by the JSON blueprint.
     2. Explicit `drawing_story` or `vectorDrawingId` routes to `DrawingStoryScene`.
     3. Explicit `FacelessGraphicScene` (`allocation` / `growth` multi-item SVG charts).
     4. Core editorial layouts (`HookScene`, `ListScene`, `SplitScreenLayout`, `CardConceptScene`, `TypographyScene`, `ConclusionScene`).
5. **Dashboard Studio & User Experience**:
   - Clean White Studio design (`bg-white`, `border-slate-200`, `text-slate-900`, `bg-slate-50`).
   - **Multi-Asset Media Ingest**: Users can upload multiple images AND video clips (PNG, JPG, WEBP, MP4, MOV).
   - **20 Master YouTube 9:16 Caption Styles**: Comprehensive caption gallery with category filter tabs and active word highlight.
   - **AWS S3 Background Music Catalog**: 13+ production tracks with play/pause audition, custom BGM upload, and a volume slider defaulting to 12% (`0.12`).
   - **Spoken Narration Editorial Transcript Editor**: In-place markdown/text editor to fix spoken words, brand names, and typos.
   - **Compulsory 9:16 Live Preview Gate**: Users must preview vertical safe-zones and confirm before the render button unlocks.

## Core Rules & Constraints
- **Aspect Ratio & Credit Rate**: Strictly 9:16 Vertical (`1080×1920` @ 30 FPS MP4), max 90 seconds, **Flat 1 Credit per video** per Rule 4.1.
- **Natural Sentence Boundaries Only**: Never force arbitrary 4s or 7s scene cuts. Every scene corresponds to a complete spoken sentence/thought.
- **Pure White Background**: Canvas defaults to clean white (`#FAFAFA` / `#FFFFFF`) with subtle dot-grid patterning and ambient light.
- **No Repeated Vector Drawings**: `DrawingStoryScene` honors `scene.vectorDrawingId` and rotates across all 16 vector illustrations so consecutive scenes never show the same drawing.
- **Strict 9:16 Separation**: `FACELESS_SHORTS` is strictly 9:16 vertical (`1080×1920`, max 90s, 1 Credit).
- **Zero Local Heavy Compute**: Renders execute exclusively on AWS Lambda.
