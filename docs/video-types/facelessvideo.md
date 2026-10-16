# Faceless Video Generator (`facelessvideo.md`)

## 1. Overview & Purpose
**Faceless Video Generator** powers automated YouTube Cash Cow channels, storytelling accounts, and educational video niches. It turns voiceover audio narration (strictly up to 10 minutes / 600s) into a complete 16:9 Full HD widescreen video complete with word-level speech transcription, interactive transcript approval, scene planning & storyboard review, semantic asset matching, kinetic pan/zoom motion, background music auto-ducking, beat-matched sound effects, and word-synced subtitles.

---

## 2. Key Specifications & Limits

| Attribute | Specification |
| :--- | :--- |
| **Video Type ID** | `faceless-video` / `FACELESS_VIDEO` |
| **Composition ID** | `FACELESS-VIDEO` & `FACELESS-LONG-VIDEO` |
| **Template Location** | `remotion/templates/FACELESS_VIDEO/template.tsx` & `FACELESS_LONG_VIDEO` |
| **Dashboard Studio** | `components/dashboard/FacelessVideoStudio.tsx` |
| **Dashboard Route** | `/dashboard/faceless-video` |
| **Planning Endpoint** | `POST /api/reels/plan-faceless-video` |
| **Aspect Ratio** | **16:9 Widescreen Cinema Only (`1920×1080` @ 30 FPS MP4)** |
| **Max Audio Duration** | **Up to 10 Minutes (600s)** |
| **Primary Category** | 16:9 Widescreen Long-Form |
| **Credit Cost** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) |
| **Design System** | Clean, mobile-responsive white canvas (`bg-white`), dark slate text (`text-slate-900`), light-grey borders (`border-slate-200`), and restrained neutral accents |
| **Transcription Engine**| Extracted 16kHz audio → Groq Whisper Cloud API (Fallback: Google Gemini 2.0 Flash `asia-south1`) |
| **Audio Ducking** | Dynamic BGM volume interpolation (0.13 during speech, smoothly swelling to 0.28 during >1.5s pauses) |
| **Cancellation Registry** | Server-persisted cancellation (`lib/jobs/cancellationRegistry.ts`) checked by `/api/reels/jobs/status` |

---

## 3. 3-Phase Creator Workflow

The Faceless Video Studio implements a structured 3-phase workflow ensuring creators have total control over transcript accuracy and storyboard visuals before cloud rendering:

### Phase 1: Upload & Voiceover Setup
1. **Upload Voiceover Audio**:
   - Upload audio track (MP3, WAV, M4A up to 10 minutes / 600s).
   - Optional topic headline.
2. **Visual B-Roll Media Source**:
   - `Curated Stock Library`: Matches high-definition semantic stock visuals.
   - `Custom Uploads`: Uses only creator-uploaded images & clips.
   - `Mix Both`: Matches uploaded images to relevant beats and fills remaining scenes with curated stock.
3. **Visual Art Direction & Theme**:
   - Style: Realistic Photography, 3D Render, or 2D Vector.
   - Theme: Studio White, Warm Cream, Soft Slate, Midnight Slate, Royal Navy, Studio Purple.
4. **Subtitles & Audio Score**:
   - Subtitle preset: Netflix Yellow, Documentary Serif, Parallax Modern, Minimal Clean, Gold Editorial.
   - Background Music Mood (`mystery`, `lofi`, `tech`, `none`) & Mix Volume slider.
   - Beat Sound Effects (SFX) toggle.
5. **Action**: Click **"Transcribe Voiceover & Plan"** to initiate speech-to-text and scene beat generation.

### Phase 2: Transcript Review & Edit
1. **Audio Playback Scrubber**: Listen to the uploaded voiceover track while reviewing recognized speech.
2. **Sentence Segment Editor**: Edit any sentence to fix recognized names or specialized terminology.
3. **Edit Warning & Alignment**:
   - Detects text changes against original transcript.
   - Warns: *"Original voiceover audio will play unchanged. Your edited text will appear in subtitles and on-screen cards. If words were significantly added or removed, subtitle timing may slightly diverge from spoken voice."*
   - Validates timestamps and re-interpolates word boundaries within the sentence duration without blind drifting.
4. **Action**: Click **"Approve Transcript & View Storyboard"**.

### Phase 3: Storyboard & Scene Confirmation
1. **Scene-by-Scene Cards**:
   - Scene Number & Timing range (e.g., `Scene 1 · 0:00 - 0:08`).
   - Scene Layout Badge (`Stat Card`, `Image + Text`, `Kinetic Typography`, `Split Screen`, `Checklist`, `Quote`).
   - Transition Badge (`Cut`, `Crossfade`, `Slide`, `Zoom`, `Fade to Black`).
   - Matched Visual Thumbnail Preview with swap or remove controls.
2. **Action**: Click **"Confirm Storyboard & Render Video"** to submit the approved blueprint to the cloud render engine.

---

## 4. Scene Transition Rules (Image-to-Image Motion)

Transitions between scenes are applied intentionally based on editorial meaning:

| Transition | Motion Mechanics | When to Use |
| :--- | :--- | :--- |
| **Cut** | Instantaneous switch (0-frame cut, no fade) | Everyday edits, rapid main points, and fast conversational beats |
| **Crossfade / Dissolve** | Smooth 10-frame opacity blend | Normal documentary passages, calm narrative segments, historical photos |
| **Slide / Wipe** | Enters with 50px horizontal push and smooth opacity | Chapter changes, comparison cards, numbered lists, map movements |
| **Zoom Transition** | Camera-like scale (1.08 → 1.0) with smooth easing | Dramatic hook revelations, key statistical cards (never overused) |
| **Fade to Black** | Dips through black overlay at scene transition | Major section breaks, conclusions, time jumps, topic shifts |

---

## 5. Production Rendering Screen

During rendering, the screen provides a calm, reassuring experience:
- **Heading**: **“Creating your video”** with message: *"Our cloud engine is preparing scenes, assembling visuals, and mastering audio for your 16:9 video."*
- **Accurate Progress**:
  - Displays actual percentage ONLY when returned by the cloud render engine (`progress > 0`).
  - While initializing, shows an elegant indeterminate pulse bar. Zero fake percentages or countdowns.
- **4 Clear Production Stages**:
  1. *Preparing scenes & script alignment* (0% - 25%)
  2. *Assembling visual assets & B-roll* (25% - 55%)
  3. *Rendering high-definition video* (55% - 90%)
  4. *Final quality checks & audio mastering* (90% - 100%)
- **Reliable Remaining Time**:
  - Calculated only when `progress >= 0.05` and elapsed time > 5s (`(elapsed / progress) - elapsed`).
- **Cancellation**:
  - Cancel option with confirmation modal.
  - Calls `POST /api/reels/jobs/cancel` to release reserved credits and mark job cancelled in `lib/jobs/cancellationRegistry.ts`.
- **Failure Recovery**:
  - Problem reporting and retry option without exposing internal technology names or logs.
- **Refresh-Safe Persistence**:
  - Active job ID stored in `localStorage.setItem('itnavideo_faceless_active_job', ...)`.
  - On page refresh, status is verified against backend `/api/reels/jobs/status` and resumes live tracking automatically.

---

## 6. Changed Files & Verified Fixes

| File | Change / Fix Description |
| :--- | :--- |
| [`lib/jobs/cancellationRegistry.ts`](file:///c:/Itnavideo/lib/jobs/cancellationRegistry.ts) | Created persistent cancellation registry surviving server restarts |
| [`app/api/reels/jobs/cancel/route.ts`](file:///c:/Itnavideo/app/api/reels/jobs/cancel/route.ts) | Integrated persistent cancellation registry |
| [`app/api/reels/jobs/status/route.ts`](file:///c:/Itnavideo/app/api/reels/jobs/status/route.ts) | Added immediate `isJobCancelled` check returning `{ state: 'cancelled' }` |
| [`services/ai/transcriptAlignment.ts`](file:///c:/Itnavideo/services/ai/transcriptAlignment.ts) | Created transcript validation & word boundary alignment engine |
| [`app/api/reels/plan-faceless-video/route.ts`](file:///c:/Itnavideo/app/api/reels/plan-faceless-video/route.ts) | Dedicated planning endpoint for speech transcription & storyboard generation |
| [`services/ai/smartMediaMatcher.ts`](file:///c:/Itnavideo/services/ai/smartMediaMatcher.ts) | Fixed bug where score-0 uploaded images were forced into unrelated scenes |
| [`services/ai/aiScenePlanner.ts`](file:///c:/Itnavideo/services/ai/aiScenePlanner.ts) | Implemented intelligent transition mapping (cut, dissolve, slide, zoom, fade_to_black) |
| [`remotion/templates/FACELESS_LONG_VIDEO/template.tsx`](file:///c:/Itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | Implemented full transition styles, fade-to-black overlay, strictly 16:9 caption offsets & 600s limit |
| [`remotion/templates/FACELESS_LONG_VIDEO/components/Background.tsx`](file:///c:/Itnavideo/remotion/templates/FACELESS_LONG_VIDEO/components/Background.tsx) | Fixed hardcoded FPS: 60 watermark to read actual composition fps |
| [`remotion/templates/FACELESS_VIDEO/template.tsx`](file:///c:/Itnavideo/remotion/templates/FACELESS_VIDEO/template.tsx) | Strictly 16:9 format (`1920×1080`), removed 9:16 fallback logic |
| [`app/api/reels/jobs/route.ts`](file:///c:/Itnavideo/app/api/reels/jobs/route.ts) | Reuses confirmed `sceneBlueprint`, `brollUrls`, and `approvedCaptions` with 100% fidelity |
| [`components/dashboard/FacelessVideoStudio.tsx`](file:///c:/Itnavideo/components/dashboard/FacelessVideoStudio.tsx) | Redesigned with premium white UI, 3-step wizard, audio playback, and storyboard review |
| [`components/dashboard/subpages/FacelessVideoPageClient.tsx`](file:///c:/Itnavideo/components/dashboard/subpages/FacelessVideoPageClient.tsx) | Switched to centralized `uploadFileViaPresign` from `@/lib/media/presignedUpload`, fixing 404 on `/api/reels/jobs/presign` |
| [`app/api/media/presign/route.ts`](file:///c:/Itnavideo/app/api/media/presign/route.ts) | Added on-demand S3 read URL generation via `action: 'read'` with `createReadUrl` |
| [`app/api/reels/jobs/presign/route.ts`](file:///c:/Itnavideo/app/api/reels/jobs/presign/route.ts) | Created backwards-compatibility re-export route forwarding to `@/app/api/media/presign` |
| [`app/api/reels/plan-faceless-video/route.ts`](file:///c:/Itnavideo/app/api/reels/plan-faceless-video/route.ts) | Auto-resolves raw S3 `mediaKey` and uploaded image keys using `createReadUrl` |
| [`components/dashboard/subpages/FacelessVideoPageClient.tsx`](file:///c:/Itnavideo/components/dashboard/subpages/FacelessVideoPageClient.tsx) | Fixed premature `jobStatus.state = "planning"` unmounting studio wizard into render engine on audio upload; isolated planning states (`planningMessage`, `planningError`) and cached uploaded audio key |
| [`components/dashboard/FacelessVideoStudio.tsx`](file:///c:/Itnavideo/components/dashboard/FacelessVideoStudio.tsx) | Added drag-and-drop audio upload, in-card direct transcribe action, live planning progress banner, and graceful error alerts without component re-mounts |
| [`remotion/templates/FACELESS_LONG_VIDEO/scenes/FullBleedVisualScene.tsx`](file:///c:/Itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/FullBleedVisualScene.tsx) | Rebuilt with full-bleed 1920x1080 Ken Burns continuous scale/pan, subtle dark vignette scrim, and removed bulky gray card container |
| [`remotion/templates/FACELESS_LONG_VIDEO/scenes/StatScene.tsx`](file:///c:/Itnavideo/remotion/templates/FACELESS_LONG_VIDEO/scenes/StatScene.tsx) | Added full-bleed media background with dark frosted glass overlay; added direct fallback to FullBleedVisualScene when statValue lacks real numeric digits |
| [`remotion/templates/FACELESS_LONG_VIDEO/template.tsx`](file:///c:/Itnavideo/remotion/templates/FACELESS_LONG_VIDEO/template.tsx) | Enforced full-bleed priority for all visual scenes (`card_concept`, `split_screen`, `image_text`), eliminating boxy PowerPoint slide appearance |
| [`services/ai/aiScenePlanner.ts`](file:///c:/Itnavideo/services/ai/aiScenePlanner.ts) | Normalized all visual scene layouts to `full_bleed_visual`; restricted stat_card layout strictly to verified numeric metrics, eliminating fake words ('VOH', 'KEEP') |
| [`services/ai/assetPlanner.ts`](file:///c:/Itnavideo/services/ai/assetPlanner.ts) | Enriched `generateCleanConceptHeading` with comprehensive Hinglish and English conceptual mappings (Habits, Goals, Persistence, Mindset, etc.) |
| [`services/ai/pexelsImages.ts`](file:///c:/Itnavideo/services/ai/pexelsImages.ts) | Integrated Pexels API (`PEXELS_API_KEY`) for high-resolution stock photography and video clips |
| [`app/api/reels/jobs/route.ts`](file:///c:/Itnavideo/app/api/reels/jobs/route.ts) | Implemented confirmed storyboard fast-path that directly reuses client transcript, approved captions, and scene blueprint without redundant Groq Whisper calls or 429 rate limits |
| [`components/dashboard/subpages/FacelessVideoPageClient.tsx`](file:///c:/Itnavideo/components/dashboard/subpages/FacelessVideoPageClient.tsx) | Added `lastStoryboardPayloadRef` caching so retry attempts preserve all approved scenes, captions, and media |
