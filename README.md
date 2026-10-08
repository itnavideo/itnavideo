# Itnavideo

AI-powered short video & long video generator for creators. Upload audio/video, get polished reels or 16:9 explainer videos with subtitles, stickers, and animations.

## Live Video Types (10 Active Modes)

> [!IMPORTANT]
> ### ðŸš¨ Mandatory Rule for All Video Types: "Check First, Update After" Policy
> Every video type has completely distinct requirements, inputs, UI steppers, and rendering logic.
> 1. **Before Any Work**: Before modifying, fixing, or improving any video type, **directly open its specific `.md` file first** in [`docs/video-types/`](./docs/video-types/) to review its exact inputs, limits, props, and pipeline architecture.
> 2. **After Any Work**: Whenever any changes, UI tweaks, props adjustments, or improvements are made to a video type, **immediately update its corresponding `.md` file** so documentation always stays 100% in sync with the live code.

| # | Video Type | Spec File (Open First & Update After) | Mode ID | Composition ID | Aspect Ratio | Focus |
|---|---|---|---|---|---|---|
| 1 | **Image to Video AI** | [`imagetovideoai.md`](./docs/video-types/imagetovideoai.md) | `image-to-video` | `IMAGE_TO_VIDEO_AI` | 16:9 | Google AI voices + Ken Burns cinema scenes |
| 2 | **Auto Caption Generator** | [`autocaption.md`](./docs/video-types/autocaption.md) | `auto-caption` | `AUTO_CAPTION_GENERATOR` | 9:16 | Word-level kinetic glowing subtitles |
| 3 | **YouTube Subtitle Generator** | [`youtubesubtitles.md`](./docs/video-types/youtubesubtitles.md) | `youtube-subtitles` | `LONG_CAPTION_PRO` | 16:9 & 9:16 | Broadcast lower-thirds + SRT/VTT export |
| 4 | **Faceless Video Generator** | [`facelessvideo.md`](./docs/video-types/facelessvideo.md) | `faceless-video` | `FACELESS_VIDEO` | 9:16 & 16:9 | Script-to-video AI + 3-tier stock B-roll |
| 5 | **Compare Explainer Video** | [`compareexplainer.md`](./docs/video-types/compareexplainer.md) | `compare-explainer` | `comparisonImages` | 9:16 & 16:9 | Versus split screen + animated stickers |
| 6 | **Kinetic Typography Video** | [`typographyvideo.md`](./docs/video-types/typographyvideo.md) | `typography-video` | `TYPOGRAPHY_VIDEO` | 9:16 | Kinetic text motion + high retention |
| 7 | **Whiteboard Animation** | [`whiteboardvideo.md`](./docs/video-types/whiteboardvideo.md) | `whiteboard-video` | `WHITEBOARD_VIDEO` | 16:9 & 9:16 | Executive board diagrams + SVG stroke draw |
| 8 | **Long Video Promo / Teaser** | [`longvideopromo.md`](./docs/video-types/longvideopromo.md) | `long-video-promo` | `LONG_VIDEO_PROMO` | 9:16 | Hook video + YouTube thumbnail traffic teaser |
| 9 | **Long Video to Viral Clips** | [`longvideoclips.md`](./docs/video-types/longvideoclips.md) | `long-video-clips` | `LONG_VIDEO_CLIPS` | 9:16 | Virality hook detector + 9:16 reframe |
| 10 | **AI Audio Cleaner & Studio** | [`audiocleaner.md`](./docs/video-types/audiocleaner.md) | `audio-cleaner` | Mastering Engine | Audio | Studio denoise, -14 LUFS & retake detection |

## Project Structure

```
app/                    â†’ Next.js App Router (pages + API routes)
app/dashboard/          â†’ User dashboard (template selection, upload, render)
app/api/reels/jobs/     â†’ Main render pipeline (upload â†’ transcribe â†’ plan â†’ render)
components/             â†’ Reusable UI components
remotion/               â†’ Remotion compositions (templates + shared components)
remotion/templates/     â†’ One folder per template (code only, no assets)
remotion/index.tsx      â†’ Composition registry
services/ai/            â†’ Planner, director, and AI services
lib/                    â†’ Shared helpers
scripts/                â†’ Operational scripts (deploy, transcribe, assets)
public/assets/          â†’ Bulk render assets (local indexing only)
public/visuals/         â†’ Website UI visuals
public/brand/           â†’ Brand logos/images
supabase/               â†’ Database schema and setup
```

## Commands

```bash
npm run dev                  # Local Next.js dev server
npm run build                # Build for production
.\deploy.ps1                 # Deploy 100% to Google Cloud Run
npm run assets:index         # Rebuild public/assets/assets.json
npm run lint                 # ESLint
```

## Transcription & Media Pipeline

- **Groq Whisper**: Primary transcription engine for speech recognition across all templates.
- **Resilient Audio Extraction**: Audio is extracted or streamed via S3 signed URLs, with automatic 24MB payload capping for Groq Whisper compliance.
- **Strict Error Handling**: Returns HTTP 422 `NO_SPEECH_DETECTED` on empty/silent audio. No silent fallback to fake or cached captions.

## Current Provider Policy

| Provider | Use | Status |
|----------|-----|--------|
| Groq | Transcription (Whisper) | âœ… Primary |
| Gemini | Long Video Pro Planning Agent, Auto Draw, English repair | âœ… Free, active |
| OpenAI | Planning fallback | â¸ï¸ Paused (key expired) |

## Long Video Pro AI Visual Planning Agent Architecture

Long Video Pro transforms 16:9 explainer creation from rigid template timing into an intelligent **Video Planning Agent**:

1. **Holistic Script Analysis (`services/ai/longVideoProPlanner.ts`)**:
   - Analyzes full transcript to understand narrative flow, statistics, key terminology, and emotional beats.
   - Groups related consecutive sentences into logical visual sections (holding explanatory visuals for 6â€“15 seconds).
2. **8 Core Visual Types**:
   - `IMAGE`: Persons, places, objects, historical events, products.
   - `VIDEO_CLIP`: Demonstrations, processes, sports, travel, nature.
   - `FACE_PERSON`: Public figures and narrative commentators.
   - `TYPOGRAPHY`: Kinetic text cards for definitions, quotes, key takeaways.
   - `CHART_GRAPH`: Numbers, trends, percentages, comparisons, rankings.
   - `DIAGRAM_INFOGRAPHIC`: Conceptual visual layouts for processes and timelines.
   - `B_ROLL`: Supporting ambient visuals.
   - `SIMPLE_BACKGROUND`: Low-complexity visual background with narration focus.
3. **3-Tier Asset Fallback System (`services/ai/assetResolver.ts`)**:
   - Every scene defines `Primary Asset` â†’ `Secondary Asset` â†’ `Fallback Visual`.
   - If stock footage or images are missing, the Asset Resolver automatically executes the 3rd-tier `FallbackVisual` (kinetic typography, animated chart cards, or simple background cards), **guaranteeing zero broken renders or blank screens**.
4. **Structured Video Blueprint (`services/ai/videoBlueprintTypes.ts`)**:
   - Decouples visual intent from asset resolution and Remotion Lambda execution.

## ðŸŒ Universal Video Template & Asset Library

`itnavideo` features a decoupled, modular **Universal Video Template & Asset Library** system (`services/templates/templateLibrary.ts`). Visual styling assets are modularized into reusable library presets that work across all video aspect ratios (9:16 Shorts/Reels, 16:9 Long Video Pro, 1:1 Square):

- **Caption Themes (`captionThemes`)**:
  - `glow-viral`: High-energy glowing active word highlights (yellow/green glow).
  - `box-pill`: Solid rounded pill background behind active spoken words.
  - `neon-cyber`: Cyberpunk high-contrast cyan/magenta subtitles.
  - `minimal-lower-third`: Clean, modern lower-third subtitles for podcasts & documentaries.
- **Sticker & Graphics Packs (`stickerPacks`)**:
  - `stickman-dev`: Animated stickman character PNGs (`public/assets/stickman/`) for coding, idea lightbulb, graph up, confused, etc.
  - `tech-icons`: Animated tech & code terminal vector icons.
- **Layout Frame Presets (`layoutFrames`)**:
  - **16:9 Widescreen**: Split-screen frame, VS Code dark window frame, PiP speaker bubble.
  - **9:16 Vertical**: Top-Bottom split reel frame, Floating glassmorphic card.
- **Lower-Third & Chapter Cards (`lowerThirds`)**:
  - Topic header banners and step counter badges ("01. Mindset", "02. Code Architecture").
- **Progress & Branding Overlays (`brandingOverlays`)**:
  - Animated bottom/top progress bars & brand logo watermarks.
- **Remotion Layer Components (`remotion/components/library/`)**:
  - `UniversalCaptionLayer.tsx`, `UniversalStickerLayer.tsx`, `UniversalLowerThird.tsx`, `UniversalProgressBar.tsx`.
- **Sample Demo Blueprints (`UNIVERSAL_DEMO_PRESETS`)**:
  - `demo-tech-explainer`: Computer Science Explainer ("How Memory Allocation Works: Stack vs Heap") with word-level highlights, stickman graphics, step badges.
  - `demo-founder-podcast`: Founder Story ("0 to 1M Users Founder Blueprint") with clean lower-thirds, speaker tag, top timer.
  - `demo-code-tutorial`: Code Walkthrough ("Building a High-Speed REST API in Express") with VS Code frame, cyan neon captions, terminal icons.

## Production Infrastructure & Deployment Policy (100% Google Cloud)

> [!IMPORTANT]
> Refer to [INFRASTRUCTURE.md](file:///C:/Users/user/.gemini/antigravity/scratch/itnavideo/INFRASTRUCTURE.md) for full architectural guidelines.
> - **Primary Domain**: Always `https://www.itnavideo.com` (Apex `itnavideo.com` 301 redirects to `www.itnavideo.com`).
> - **Cloud Platform**: 100% **Google Cloud Run** in `us-central1` (Iowa, USA) under Project `geometric-hull-501707-m2`. Vercel is strictly cancelled and removed.
> - **Storage & Assets**: **Google Cloud Storage (GCS)** bucket `itnavideo-media-assets`. AWS S3, Cloudinary, and AWS Lambda are permanently replaced.
> - **Deploy**: Run `.\deploy.ps1` or `gcloud run deploy itnavideo-web --region us-central1 --project geometric-hull-501707-m2 --source . --clear-base-image --quiet`.

## Key Rules

- Templates are code-only. No images/fonts/sounds inside `remotion/templates/`.
- Assets live in `public/assets/` (local) and Google Cloud Storage (production).
- `.gcloudignore` excludes `node_modules`, `.next`, `public/renders`, and `public/uploads` â€” keeping cloud uploads ultra-fast.
- Subtitles: Groq Whisper only. English + Hinglish. No paid translation APIs.
- Hindi/Hinglish â†’ clean Roman captions (no Devanagari).
- Each render gets fresh captions from current upload (no cached/old data).
- Media inputs must be HTTPS/signed URLs, not local paths.
- Media uploads and renders expire after ~48 hours.

## Environment

Key env vars (see `.env.example`):
- `GROQ_API_KEY` â€” Transcription (Groq Whisper)
- `GEMINI_API_KEY` â€” Auto Draw planning & Gemini AI
- `GCS_BUCKET_NAME` â€” Google Cloud Storage (`itnavideo-media-assets`)
- `GCS_PROJECT_ID` â€” Google Cloud Project ID (`geometric-hull-501707-m2`)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` â€” Auth + data
