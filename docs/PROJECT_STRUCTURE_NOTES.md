# Itnavideo Project Structure Notes

Last updated: 2026-05-17

These notes are for quickly finding the right folder or file when improving a specific part of the product.

## Current Repo Size

Counts exclude `node_modules`, `.next`, `.git`, `.sandbox`, and `logs`.

- Total folders: `135`
- Total files: `278`

## Top-Level Folder Map

| Folder | Folders | Files | Purpose | Used When |
|---|---:|---:|---|---|
| `app/` | 73 | 63 | Next.js pages and API routes | Website pages, dashboard, upload flow, admin, backend endpoints |
| `components/` | 8 | 25 | Reusable UI components | Navbar, footer, landing sections, dashboard cards, careers UI |
| `services/` | 7 | 30 | Backend/business helper logic | AI planning, Supabase writes, Cloudinary/assets, rendering helpers |
| `render-worker/` | 1 | 15 | Dedicated FFmpeg render worker | Queue, video rendering, fallback MP4, telemetry, cleanup |
| `public/` | 16 | 57 | Static assets | Generated visuals, mode cards, public images/icons |
| `docs/` | 1 | 9 | Technical notes | Pipeline map, guardrails, status, storage strategy |
| `lib/` | 1 | 8 | Shared utilities/config | Supabase clients, video pipeline config, helpers |
| `scripts/` | 0 | 2 | Dev verification scripts | Smoke test and env validation |
| `supabase/` | 0 | 2 | Database schema/docs | Tables for projects, jobs, applications, settings |
| `pages/` | 1 | 1 | Legacy Pages API route | Talking-head compatibility route |
| `types/` | 0 | 2 | TypeScript declarations | Package type fixes |
| `raw_assets/` | 3 | 4 | Local raw media placeholders | Local/dev audio, image, video input storage |
| `processed_assets/` | 5 | 19 | Local processed media placeholders | Audio cuts, overlays, transcriptions, render reports |
| `final_output/` | 0 | 14 | Local render outputs | Smoke/test generated videos |
| `.vercel/` | 0 | 2 | Vercel local metadata | Vercel project linking |

## Important Pages

| File | Purpose |
|---|---|
| `app/page.tsx` | Homepage |
| `app/layout.tsx` | Global layout, providers, analytics, app chrome |
| `app/globals.css` | Global styles and theme |
| `app/dashboard/page.tsx` | Main creator dashboard, upload modal, project list |
| `app/videos/page.js` | User video library |
| `app/careers/page.tsx` | Careers/talent network page |
| `app/pricing/page.tsx` | Pricing and paid-plan positioning |
| `app/billing/page.js` | Billing/Stripe proof page |
| `app/about/page.js` | About page |
| `app/contact/page.js` | Contact page |
| `app/admin/*` | Admin pages |

## Important API Routes

| File | Purpose |
|---|---|
| `app/api/jobs/start/route.ts` | Main job start, preflight, free-tier valve, worker dispatch |
| `app/api/render/route.ts` | Sends render order to the Render worker |
| `app/api/ffmpeg/status/route.ts` | Render status polling |
| `app/api/ffmpeg/status/stream/route.ts` | SSE live render progress |
| `app/api/timeline/route.ts` | Timeline/pipeline handoff |
| `app/api/transcribe/route.ts` | Audio/video transcription |
| `app/api/upload/route.ts` | Cloudinary upload |
| `app/api/upload/signature/route.ts` | Signed upload helper |
| `app/api/careers/apply/route.ts` | Careers application capture |
| `app/api/admin/free-tier/route.ts` | Emergency free-tier render toggle |
| `app/api/cleanup/expired-renders/route.ts` | Old render cleanup |

## Important Components

| File | Purpose |
|---|---|
| `components/layout/Navbar.tsx` | Main navigation |
| `components/layout/Footer.tsx` | Footer, newsletter, careers badge |
| `components/layout/AppChrome.tsx` | Wraps public layout chrome |
| `components/landing/Hero.tsx` | Homepage hero and product mockup visual |
| `components/dashboard/VideoUploadStatus.tsx` | Live render progress card and waiting visual |
| `components/dashboard/VideoCard.js` | Video library/project cards |
| `components/careers/CareersClient.tsx` | Careers roles and application modal |
| `components/auth/AuthContext.tsx` | User auth state |
| `components/admin/AdminContext.tsx` | Admin auth state |

## Render Pipeline Files

| File | Purpose |
|---|---|
| `render-worker/server.mjs` | Express worker, queue, health endpoint, status updates |
| `render-worker/ffmpegRenderer.mjs` | Core FFmpeg render and safe fallback MP4 |
| `render-worker/pipelineGuards.mjs` | Timeline validation, text sanitization, caption wrapping |
| `render-worker/videoPipelineConfig.mjs` | Worker env config: 720p, timeouts, CRF |
| `render-worker/renderWorkspace.mjs` | Temp workspace and cleanup |
| `render-worker/assetBlacklist.mjs` | Bad asset blacklist |
| `render-worker/telemetry.mjs` | Webhook alerts for failures/fallbacks |
| `render-worker/pythonRendererBridge.mjs` | Node to Python render bridge |
| `render-worker/python_renderer.py` | Python-assisted render planner |
| `render-worker/python_talking_head_engine.py` | Face-camera/talking-head logic |

## Services

| Folder/File | Purpose |
|---|---|
| `services/ai/*` | AI planning: timeline, subtitles, scene matching, sound effects |
| `services/assets/*` | Cloudinary, Google Drive, fonts, icons, visual assets |
| `services/rendering/*` | FFmpeg job store, older rendering helpers, templates |
| `services/supabase/projectStore.*` | Supabase project/job/application/settings helpers |

## Static Assets

| Path | Purpose |
|---|---|
| `public/visuals/dashboard-wait-coffee-primary.png` | Render waiting visual |
| `public/visuals/dashboard-wait-coffee-calm.png` | Alternate render waiting visual |
| `public/visuals/homepage-product-mockup.png` | Homepage hero product mockup |
| `public/visuals/dashboard-empty-state.png` | Dashboard empty-state visual |
| `public/visuals/careers-team-visual.png` | Careers hero visual |
| `public/visuals/faceless-mode-guide.png` | Faceless workflow mode card |
| `public/visuals/face-camera-mode-guide.png` | Face-camera workflow mode card |
| `public/mode-cards/*` | Older SVG mode card visuals |
| `public/asset-library/` | Reusable public asset library |

## Config Files

| File | Purpose |
|---|---|
| `.env.local` | Real local secrets/config. Do not share or commit |
| `.env.example` | Example env keys |
| `package.json` | Scripts and dependencies |
| `next.config.mjs` | Next.js config |
| `tsconfig.json` | TypeScript config |
| `ecosystem.config.cjs` | PM2 production process config |
| `Dockerfile` | Container setup |
| `vercel.json` | Vercel config |
| `supabase/schema.sql` | Database tables |

## Database Tables

Defined in `supabase/schema.sql`.

| Table | Purpose |
|---|---|
| `projects` | User project/video metadata |
| `ffmpeg_jobs` | Render job status and progress |
| `blacklisted_assets` | Self-healing bad asset skip list |
| `app_settings` | Admin settings like free-tier render toggle |
| `job_applications` | Careers/talent network submissions |
| `waitlist` | Waitlist leads |
| `newsletter` | Newsletter subscriptions |

## May 17 Updates Added

- Added careers/talent network page at `app/careers/page.tsx`.
- Added careers UI at `components/careers/CareersClient.tsx`.
- Added careers application API at `app/api/careers/apply/route.ts`.
- Added `job_applications` table in Supabase.
- Added emergency free-tier render valve:
  - `app/api/admin/free-tier/route.ts`
  - `app_settings.free_tier_render_enabled`
  - `FREE_TIER_RENDER_ENABLED`
  - `FREE_TIER_QUEUE_LIMIT`
- Added generated UI visuals:
  - Dashboard waiting coffee images
  - Homepage product mockup
  - Dashboard empty-state image
  - Careers team image
  - Faceless mode guide
  - Face-camera mode guide
- Updated dashboard cards to show faceless and face-camera guide visuals.
- Updated render waiting card to show visual anchor under progress.
- Updated homepage hero to use product mockup visual.
- Updated careers page to use team visual.

## Where To Edit Next Time

| Goal | Edit These First |
|---|---|
| Improve dashboard upload UX | `app/dashboard/page.tsx` |
| Improve render progress UI | `components/dashboard/VideoUploadStatus.tsx` |
| Improve homepage hero | `components/landing/Hero.tsx` |
| Improve careers page | `components/careers/CareersClient.tsx` |
| Add/change static images | `public/visuals/` |
| Fix render failures | `render-worker/ffmpegRenderer.mjs`, `render-worker/server.mjs` |
| Fix timeline/caption issues | `render-worker/pipelineGuards.mjs`, `services/ai/*` |
| Change 720p limits/env | `lib/videoPipelineConfig.ts`, `render-worker/videoPipelineConfig.mjs`, `.env.local`, `.env.example` |
| Fix Supabase data issues | `services/supabase/projectStore.*`, `supabase/schema.sql` |
| Add admin controls | `app/api/admin/*`, `app/admin/*` |
| Verify pipeline | `npm run test:smoke`, `npm run build` |

## Common Commands

```bash
npm run test:smoke
npm run build
npm run render-worker
npx tsc --noEmit
```

## Notes

- Vercel should handle the Next.js app and lightweight API orchestration.
- Render worker should handle long FFmpeg jobs.
- Keep video output env-driven, currently standard `720p`.
- Do not run heavy FFmpeg jobs on Vercel.
- Keep generated images in `public/visuals/` with stable file names.
