# Itnavideo

AI-powered short video & long video generator for creators. Upload audio/video, get polished reels or 16:9 explainer videos with subtitles, stickers, and animations.

## Live Video Types (11)

| Template | Composition ID | Description |
|----------|---------------|-------------|
| AUTO_CAPTION_REEL | AUTO-CAPTION-REEL | Upload video, get stylish subtitles added automatically |
| COMPARE_EXPLAINER | comparisonImages | Audio + 2 comparison images + sticker presenter |
| AUTO_DRAW_EXPLAINER | AUTO-DRAW-EXPLAINER | Audio/video + AI whiteboard scenes (Gemini planned) |
| LONG_VIDEO_PROMO | LONG-VIDEO-PROMO | Promote long YouTube videos with thumbnail + CTA |
| LONG_VIDEO_PRO | LONG-VIDEO-PRO | AI Visual Planning Agent 16:9 explainer with 8 visual types & 3-tier fallback |
| LONG_VIDEO_CLIPS | LONG-VIDEO-CLIPS | Extract best moments from long videos into vertical reels |
| LONG_CAPTION_PRO | LONG-CAPTION-PRO | Preserves 16:9 landscape format with timed word-level captions |
| DYNAMIC_CREATOR_REEL | DYNAMIC-CREATOR-REEL | Creator video + dynamic kinetic typography |
| TYPOGRAPHY_VIDEO | TYPOGRAPHY-VIDEO | Text & typography-focused video with kinetic motion |
| MULTI_IMAGES_VIDEO | MULTI-IMAGES-VIDEO | Multi-image slideshow with smooth transitions and captions |
| CREATOR_BACKGROUND_REPLACE | CREATOR-BACKGROUND-REPLACE | Short creator reel + uploaded background image |

## Project Structure

```
app/                    → Next.js App Router (pages + API routes)
app/dashboard/          → User dashboard (template selection, upload, render)
app/api/reels/jobs/     → Main render pipeline (upload → transcribe → plan → render)
components/             → Reusable UI components
remotion/               → Remotion compositions (templates + shared components)
remotion/templates/     → One folder per template (code only, no assets)
remotion/index.tsx      → Composition registry
services/ai/            → Planner, director, and AI services
lib/                    → Shared helpers
scripts/                → Operational scripts (deploy, render, transcribe, assets)
public/assets/          → Bulk render assets (local indexing only, NOT deployed to Vercel)
public/visuals/         → Website UI visuals (deployed to Vercel)
public/brand/           → Brand logos/images (deployed to Vercel)
supabase/               → Database schema and setup
```

## Commands

```bash
npm run dev                  # Local Next.js dev server
npm run build                # Build for production
npm run reel:studio          # Open Remotion Studio
npm run reel:render          # Local render to MP4
npm run reel:lambda:deploy   # Deploy Lambda function + site bundle
npm run reel:lambda:render   # Start Lambda render from plan
npm run aws:s3:cors          # Apply S3 CORS for browser uploads
npm run aws:s3:lifecycle     # Apply 48-hour S3 cleanup rules
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
| Groq | Transcription (Whisper) | ✅ Primary |
| Gemini | Long Video Pro Planning Agent, Auto Draw, English repair | ✅ Free, active |
| OpenAI | Planning fallback | ⏸️ Paused (key expired) |

## Long Video Pro AI Visual Planning Agent Architecture

Long Video Pro transforms 16:9 explainer creation from rigid template timing into an intelligent **Video Planning Agent**:

1. **Holistic Script Analysis (`services/ai/longVideoProPlanner.ts`)**:
   - Analyzes full transcript to understand narrative flow, statistics, key terminology, and emotional beats.
   - Groups related consecutive sentences into logical visual sections (holding explanatory visuals for 6–15 seconds).
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
   - Every scene defines `Primary Asset` → `Secondary Asset` → `Fallback Visual`.
   - If stock footage or images are missing, the Asset Resolver automatically executes the 3rd-tier `FallbackVisual` (kinetic typography, animated chart cards, or simple background cards), **guaranteeing zero broken renders or blank screens**.
4. **Structured Video Blueprint (`services/ai/videoBlueprintTypes.ts`)**:
   - Decouples visual intent from asset resolution and Remotion Lambda execution.

## 🌐 Universal Video Template & Asset Library

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

## Deployment

- **Vercel** → Frontend + thin API routes (`npx vercel --prod`)
- **Lambda** → Remotion render engine (`npm run reel:lambda:deploy`)
- **AWS Worker** → Heavy Python/FFmpeg processing for Creator Background Replace
- **S3** → Temporary media uploads + render outputs (48-hour lifecycle)

Two deploys needed for template changes: Vercel (frontend) + Lambda (render engine).

## Key Rules

- Templates are code-only. No images/fonts/sounds inside `remotion/templates/`.
- Assets live in `public/assets/` (local) and S3/CDN (production).
- `.vercelignore` excludes `public/assets` — keep Vercel light.
- Subtitles: Groq Whisper only. English + Hinglish. No paid translation APIs.
- Hindi/Hinglish → clean Roman captions (no Devanagari).
- Each render gets fresh captions from current upload (no cached/old data).
- Lambda media inputs must be HTTPS/signed S3 URLs, not local paths.
- S3 uploads and renders expire after ~48 hours.

## Environment

Key env vars (see `.env.example`):
- `GROQ_API_KEY` — Transcription
- `GEMINI_API_KEY` — Auto Draw planning
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — S3 + Lambda
- `REMOTION_LAMBDA_FUNCTION_NAME` — Active Lambda function
- `REMOTION_LAMBDA_BUCKET_NAME` — Render output bucket
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Auth + data
