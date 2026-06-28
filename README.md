# Itnavideo

AI-powered short video generator for creators. Upload audio/video, get polished reels with subtitles, stickers, and animations.

## Live Templates (6)

| Template | Composition ID | Description |
|----------|---------------|-------------|
| AUTO_CAPTION_REEL | AUTO-CAPTION-REEL | Upload video, get stylish subtitles added automatically |
| COMPARE_EXPLAINER | comparisonImages | Audio + 2 comparison images + sticker presenter |
| AUTO_DRAW_EXPLAINER | AUTO-DRAW-EXPLAINER | Audio/video + AI whiteboard scenes (Gemini planned) |
| LONG_VIDEO_PROMO | LONG-VIDEO-PROMO | Promote long YouTube videos with thumbnail + CTA |
| DYNAMIC_CREATOR_REEL | DYNAMIC-CREATOR-REEL | Creator video + dynamic typography |
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

## Current Provider Policy

| Provider | Use | Status |
|----------|-----|--------|
| Groq | Transcription (Whisper) | ✅ Primary |
| Gemini | Auto Draw scene planning, English repair | ✅ Free, active |
| OpenAI | Planning fallback | ⏸️ Paused (key expired) |

## Deployment

- **Vercel** → Frontend + thin API routes (`npx vercel --prod`)
- **Lambda** → Remotion render engine (`npm run reel:lambda:deploy`)
- **AWS Worker** → Heavy Python/FFmpeg processing for Creator Background Replace
- **S3** → Temporary media uploads + render outputs (48-hour lifecycle)

Two deploys needed for template changes: Vercel (frontend) + Lambda (render engine).
Do not run Python/FFmpeg background removal on Vercel. Vercel should pass signed S3 URLs and user settings to the AWS worker through `CREATOR_BG_REPLACE_WORKER_URL`.
Creator Background Replace is capped to shorts/reels only, max 60 seconds, to keep AWS cost low.

## Key Rules

- Templates are code-only. No images/fonts/sounds inside `remotion/templates/`.
- Assets live in `public/assets/` (local) and S3/CDN (production).
- `.vercelignore` excludes `public/assets` — keep Vercel light.
- Heavy processing stays on AWS. Vercel must not host the Creator Background Replace Python worker.
- Subtitles: Groq Whisper only. English + Hinglish. No paid translation APIs.
- Hindi/Hinglish → clean Roman captions (no Devanagari).
- Each render gets fresh captions from current upload (no cached/old data).
- Lambda media inputs must be HTTPS/signed S3 URLs, not local paths.
- S3 uploads and renders expire after ~48 hours.

## Adding a New Template

1. Create `remotion/templates/TEMPLATE_NAME/template.tsx` with composition
2. Register in `remotion/index.tsx`
3. Add to `REEL_TEMPLATE_REGISTRY` in `services/ai/reelPlanner.ts`
4. Add dashboard card + mode config in `app/dashboard/page.tsx`
5. Add render flow support in `app/api/reels/jobs/route.ts`
6. Deploy Lambda: `npm run reel:lambda:deploy`
7. Deploy frontend: `npx vercel --prod`

## Environment

Key env vars (see `.env.example`):
- `GROQ_API_KEY` — Transcription
- `GEMINI_API_KEY` — Auto Draw planning
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — S3 + Lambda
- `REMOTION_LAMBDA_FUNCTION_NAME` — Active Lambda function
- `REMOTION_LAMBDA_BUCKET_NAME` — Render output bucket
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Auth + data
- `CREATOR_BG_REPLACE_WORKER_URL` — AWS worker endpoint for background replacement
- `CREATOR_BG_REPLACE_WORKER_SECRET` — optional bearer secret shared with AWS worker

AWS worker-only env vars:
- `CREATOR_BG_REPLACE_PYTHON`
- `PYTHON_PATH`
- `CREATOR_BG_REPLACE_MAX_SECONDS`
- `NUMBA_CACHE_DIR`
- `FFMPEG_PATH`
