# Archived / Reference Note

This document is older technical reference material. Please use `docs/ITNAVIDEO_MASTER_DOC.md` as the latest source of truth for Itnavideo.

# Itnavideo — Complete Technical Documentation
## For Investors & Technical Team Onboarding

**Version:** 1.0 | **Date:** June 17, 2026 | **Author:** Founder + AI Engineering Team

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Architecture & Tech Stack](#2-architecture--tech-stack)
3. [Project Structure](#3-project-structure)
4. [Remotion Video Engine](#4-remotion-video-engine)
5. [Template System](#5-template-system)
6. [Render Pipeline (End-to-End)](#6-render-pipeline-end-to-end)
7. [AI & Transcription](#7-ai--transcription)
8. [Multi-Language Subtitles](#8-multi-language-subtitles)
9. [AWS Infrastructure](#9-aws-infrastructure)
10. [Payment & Billing](#10-payment--billing)
11. [SEO & Marketing Pages](#11-seo--marketing-pages)
12. [How to Add a New Template](#12-how-to-add-a-new-template)
13. [Common Errors & Solutions](#13-common-errors--solutions)
14. [Environment Variables](#14-environment-variables)
15. [Deployment Guide](#15-deployment-guide)
16. [Future Roadmap](#16-future-roadmap)

---

## 1. Product Overview

**Itnavideo** is an AI-powered reel/short-video generator that turns audio/video uploads into polished 9:16 vertical videos with subtitles, titles, and visual elements.

**Core Value Proposition:**
- Upload video/audio with speech
- AI transcribes, generates timed subtitles
- Renders a polished vertical reel using Remotion on AWS Lambda
- User downloads MP4 — ready to post on Instagram, YouTube, TikTok

**Business Model:**
- Credit-based: 1 credit = 1 rendered reel
- Plans: Starter ($19/20 credits), Creator ($39/60 credits), Business ($99/180 credits)
- Payment: Razorpay (USD, International enabled)

**Current Templates (3 Live):**
| Template | Input | Output |
|----------|-------|--------|
| Auto Caption Reel | Video | Same video + styled subtitles overlay |
| Video Simple Explainer | Video + Title + Image | Video on top + title + subtitles + bottom image |
| Compare Explainer | Audio + 2-4 Images | Left vs Right comparison + sticker + subtitles |

---

## 2. Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vercel)                         │
│  Next.js 16 + React 19 + Tailwind CSS 4 + Framer Motion     │
│  Pages: Homepage, Dashboard, Templates, Pricing, SEO pages   │
└─────────────┬───────────────────────────────────┬───────────┘
              │                                   │
              ▼                                   ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│   VERCEL API ROUTES     │     │     SUPABASE                 │
│  /api/reels/jobs        │     │  Auth (Google + Email)       │
│  /api/media/presign     │     │  Billing entitlements        │
│  /api/create-order      │     │  Render history              │
│  /api/verify-payment    │     │  Job applications            │
└─────────┬───────────────┘     └──────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS SERVICES                               │
│                                                              │
│  S3: Media upload (presigned URLs) + Render output          │
│  Lambda: Remotion render (3GB RAM, 10min timeout)           │
│  Region: ap-south-1 (Mumbai)                                │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI SERVICES                                  │
│                                                              │
│  Groq: Primary transcription (whisper-large-v3-turbo)       │
│  OpenAI: Fallback transcription + Planning + Translation     │
│  Model: gpt-5-mini for planning/translation                 │
└─────────────────────────────────────────────────────────────┘
```

**Key Technologies:**
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **Video Rendering:** Remotion 4.0.467, AWS Lambda
- **AI:** Groq Whisper, OpenAI GPT-5-mini
- **Auth:** Supabase (Google OAuth + Email/Password)
- **Payments:** Razorpay (USD international)
- **Storage:** AWS S3
- **Deployment:** Vercel (website) + AWS Lambda (rendering)
- **Database:** Supabase PostgreSQL

---

## 3. Project Structure

```
itnavideo/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout (auth, fonts, analytics)
│   ├── dashboard/page.tsx        # Main creation dashboard
│   ├── pricing/page.tsx          # Pricing page
│   ├── templates/                # Dedicated template pages
│   │   ├── auto-caption-reel/    # Auto Caption template page
│   │   ├── video-explainer/      # Video Explainer template page
│   │   └── compare-explainer/    # Compare template page
│   ├── api/                      # API routes
│   │   ├── reels/jobs/route.ts   # Main render orchestration (CRITICAL)
│   │   ├── media/presign/route.ts # S3 upload presign
│   │   ├── create-order/route.ts  # Razorpay order creation
│   │   ├── verify-payment/route.ts # Payment verification
│   │   └── cron/seo/route.ts      # SEO ping cron
│   ├── (seo)/[slug]/page.tsx     # Dynamic SEO landing pages
│   ├── wav-to-mp3/               # Free WAV to MP3 tool
│   └── ...                       # Other pages (about, contact, etc.)
├── remotion/                     # VIDEO RENDERING ENGINE
│   ├── index.tsx                 # Remotion root (registers compositions)
│   ├── templates/
│   │   ├── AUTO_CAPTION_REEL/    # Auto Caption template
│   │   │   └── template.tsx      # Composition + component
│   │   ├── VIDEO_SIMPLE_EXPLAINER/
│   │   │   ├── template.tsx      # Composition definition
│   │   │   └── components/
│   │   │       └── VideoSimpleExplainer.tsx  # Render component
│   │   └── COMPARE_EXPLAINER/
│   │       ├── template.tsx      # Composition + all components
│   │       └── sfxManifest.ts    # Sound effects list
│   └── layers/                   # Shared render layers
├── services/
│   ├── ai/
│   │   ├── reelPlanner.ts        # CORE: Plan generation from transcript
│   │   ├── openaiReelDirector.ts # OpenAI structured planning call
│   │   ├── groqTranscription.ts  # Groq + OpenAI transcription
│   │   ├── assetPicker.ts        # Asset matching for scenes
│   │   ├── visualPlanner.ts      # Visual scene planning
│   │   └── hinglishTranscript.ts # Hindi/Urdu detection
│   ├── billing/                  # Render access & entitlements
│   ├── media/
│   │   └── mediaClipper.ts       # FFmpeg media clipping
│   └── rateLimit/                # In-memory rate limiter
├── components/
│   ├── landing/                  # Homepage sections
│   ├── layout/                   # Navbar, Footer, AppChrome
│   ├── billing/                  # Pricing cards + checkout
│   ├── compare/                  # Compare-specific UI components
│   ├── auth/                     # Auth context + components
│   └── brand/                    # Logo component
├── lib/
│   ├── aws/mediaStorage.ts       # S3 upload/download helpers
│   ├── billing/plans.ts          # Pricing plan definitions
│   ├── payments/razorpay.ts      # Razorpay client
│   ├── seo/public-url-collector.ts # Sitemap URL generator
│   └── seo-pages.ts             # SEO landing page content
├── public/
│   ├── visuals/                  # Deployed images (NOT in .vercelignore)
│   │   ├── previews/            # Template preview images
│   │   ├── stickers/            # Sticker preview images (dashboard)
│   │   └── site-scenes/         # Homepage lifestyle images
│   └── assets/                   # Render assets (IN .vercelignore, NOT deployed)
│       ├── stickman/            # Sticker PNGs for Remotion
│       ├── reusable/            # Fonts, SFX, background music
│       └── compare/             # Default compare images
├── scripts/                      # Build & deploy scripts
│   ├── remotion-lambda-deploy.mjs # Lambda site deploy
│   └── ...
├── .vercelignore                 # Excludes public/assets from Vercel
├── vercel.json                   # Cron config
├── next.config.mjs               # Next.js config
└── package.json                  # Dependencies
```

---

## 4. Remotion Video Engine

### What is Remotion?
Remotion is a React-based video rendering framework. You write video compositions as React components, and Remotion renders them frame-by-frame into MP4 files.

### How We Use It:
1. **Compositions** defined in `remotion/index.tsx` — registers all available templates
2. **Each template** is a React component that receives props (mediaSrc, captions, title, etc.)
3. **AWS Lambda** renders the composition with user's specific props
4. **Output:** 1080x1920 MP4 at 30fps

### Remotion Files:
```
remotion/
├── index.tsx                     # Root — imports all compositions
├── templates/
│   ├── AUTO_CAPTION_REEL/
│   │   └── template.tsx          # Full-screen video + caption overlay
│   ├── VIDEO_SIMPLE_EXPLAINER/
│   │   ├── template.tsx          # Composition wrapper + calculateMetadata
│   │   └── components/
│   │       └── VideoSimpleExplainer.tsx  # 4-layer reel component
│   └── COMPARE_EXPLAINER/
│       ├── template.tsx          # Full compare reel (stickers, VS badge, etc.)
│       └── sfxManifest.ts        # SFX file paths
```

### Key Remotion Concepts Used:
- `<Composition>` — defines a renderable video template
- `<Sequence>` — shows content at specific frame ranges
- `<OffthreadVideo>` — embeds user's video
- `<Audio>` — plays audio track
- `<Img>` — renders images
- `useCurrentFrame()` — current render frame
- `useVideoConfig()` — fps, duration info
- `interpolate()` — frame-based animations
- `staticFile()` — references files from public/assets/
- `calculateMetadata` — dynamic duration based on props

### Render Specs:
- **Resolution:** 1080 × 1920 (9:16 portrait)
- **FPS:** 30
- **Max Duration:** 60 seconds (1800 frames)
- **Codec:** H.264 + AAC audio
- **Output:** MP4

---

## 5. Template System

### Template Registration:
Every template needs:
1. **Remotion composition** in `remotion/templates/TEMPLATE_NAME/template.tsx`
2. **Registry entry** in `services/ai/reelPlanner.ts` → `REEL_TEMPLATE_REGISTRY`
3. **Mode mapping** in `app/api/reels/jobs/route.ts` → `MODE_TO_TEMPLATE`
4. **Presign allowlist** in `app/api/media/presign/route.ts`
5. **Dashboard card** in `app/dashboard/page.tsx` → `templateCards`

### Template: AUTO_CAPTION_REEL
- **Composition ID:** `AUTO-CAPTION-REEL`
- **Input:** Video file with speech
- **Output:** Same video full-screen + styled subtitle overlay at bottom
- **Caption Styles:** bold, neon, minimal, classic
- **Props:** mediaSrc, captions, captionStyle, sourceAudioVolume

### Template: VIDEO_SIMPLE_EXPLAINER
- **Composition ID:** `VIDEO-SIMPLE-EXPLAINER`
- **Input:** Video/Audio + Title + One image
- **Output:** 4-layer reel (video → title with brush highlight → subtitles → image)
- **Props:** mediaSrc, title, captions, explanationImageUrl, sourceAudioVolume

### Template: COMPARE_EXPLAINER (comparisonImages)
- **Composition ID:** `comparisonImages`
- **Input:** Audio + 2-4 comparison images
- **Output:** Left vs Right panels + VS badge + captions + animated sticker
- **Sticker Styles:** 2d, cartoon, explainer (6 poses each)
- **Sticker Pose Logic:** Changes every 3 seconds based on script content (left, right, thinking, welcome, warning, success)
- **Props:** audioUrl, comparisonImageUrls, compareLeftTitle, compareRightTitle, captions, stickerStyle

---

## 6. Render Pipeline (End-to-End)

### Full Flow: User clicks "Create My Reel"

```
STEP 1: PRESIGN & UPLOAD
─────────────────────────
Dashboard → POST /api/media/presign
  → Validates mode, file type, user auth, rate limit
  → Creates S3 presigned upload URL
  → Returns { uploadUrl, key }
Dashboard → PUT to S3 presigned URL (direct browser upload)

STEP 2: START RENDER JOB
─────────────────────────
Dashboard → POST /api/reels/jobs
  Body: { mediaKey, mode, topicTitle, userId, explanationImageKey, subtitleOutputLanguage, ... }
  
  API Route does:
  1. Resolve template (MODE_TO_TEMPLATE mapping)
  2. Check billing access (getRenderAccessForUser)
  3. Create read URL from S3 key
  4. Prepare planning media (clip to 60s if FFmpeg available, else use original)
  5. Transcribe via Groq (primary) → OpenAI (fallback)
  6. Translate transcript to user's chosen language
  7. Create reel plan (createReelPlan → validateAndRepairReelPlan)
  8. Build inputProps for Remotion
  9. Validate props (preflight checks)
  10. Call renderMediaOnLambda (AWS Lambda)
  11. Return { renderId, bucketName, status: 'rendering' }

STEP 3: RENDER ON LAMBDA
─────────────────────────
AWS Lambda:
  → Downloads media from S3 URL
  → Loads Remotion site (bundled compositions)
  → Renders composition frame-by-frame
  → Encodes to H.264 MP4
  → Uploads output to S3
  → Duration: 1-4 minutes typically

STEP 4: POLL STATUS
─────────────────────────
Dashboard polls GET /api/reels/jobs/status?renderId=...
  → Checks Lambda render progress
  → Returns progress %, status, outputFile URL when done

STEP 5: DOWNLOAD
─────────────────────────
User downloads MP4 from S3 signed URL (expires in 48 hours)
```

---

## 7. AI & Transcription

### Transcription Service: `services/ai/groqTranscription.ts`

**Primary: Groq Whisper**
- Model: `whisper-large-v3-turbo`
- Response: verbose_json (word-level timestamps)
- Sends audio as multipart form to Groq API
- Returns: transcript text + word timings + segment timings

**Fallback: OpenAI Whisper**
- Model: `whisper-1`
- Same API pattern but to OpenAI endpoint
- Used only if Groq fails

### Transcript Repair: `repairTranscriptionToLanguage()`

After transcription, OpenAI GPT-5-mini:
1. If output language is English/Hinglish → cleans and fixes finance terms (SIP, RBI, PAN, etc.)
2. If other language (Hindi, Spanish, etc.) → translates entire transcript while preserving timing

### Reel Planning: `services/ai/reelPlanner.ts`

Creates the overlay timeline (scene text, timing, visual directions):
1. `getTimedSegments()` — groups words into time-aligned chunks
2. `buildOverlayTimeline()` — creates overlay scenes from segments
3. `validateAndRepairReelPlan()` — fixes timing, removes invalid scenes
4. `createManagedReelPlan()` via OpenAI — optional AI-enhanced planning

### Finance Glossary (Built-in):
Auto-corrects: sip→SIP, rbi→RBI, pan→PAN, emi→EMI, nifty fifty→Nifty 50, etc.

---

## 8. Multi-Language Subtitles

**Supported Languages:**
English, Hinglish, Hindi (Devanagari), Urdu, Kannada, Tamil, Farsi, Arabic, Spanish, French, German, Portuguese, Indonesian

**Flow:**
1. User selects language in dashboard
2. `subtitleOutputLanguage` sent to API
3. After Groq transcribes (raw), `repairTranscriptionToLanguage()` calls OpenAI
4. OpenAI translates transcript + segments to target language
5. Segment timing preserved (only text changes)
6. Translated text becomes subtitle content in rendered video

---

## 9. AWS Infrastructure

### S3 Bucket: `remotionlambda-apsouth1-m59wp9dklj`
- Media uploads (presigned, temporary)
- Render outputs (private, 3-day auto-delete)
- Remotion site bundle

### Lambda Function: `remotion-render-4-0-467-mem3008mb-disk2048mb-900sec`
- Memory: 3008 MB
- Timeout: 900 seconds (15 min)
- Disk: 2048 MB
- Region: ap-south-1 (Mumbai)
- Runtime: Node.js (Remotion bundled)
- Concurrency: 6-8 per render

### Remotion Lambda Site:
- Bundled JS + public assets uploaded to S3
- Serve URL: `https://remotionlambda-apsouth1-m59wp9dklj.s3.ap-south-1.amazonaws.com/sites/itnavideo-video-explainer/index.html`
- Must re-deploy when templates change: `npm run reel:lambda:deploy`

---

## 10. Payment & Billing

### Razorpay Integration:
- International payments enabled (USD)
- Order creation: `/api/create-order`
- Payment verification: `/api/verify-payment`
- Webhook backup: `/api/razorpay/webhook`

### Plans:
| Plan | Price | Credits | Features |
|------|-------|---------|----------|
| Starter | $19 | 20 reels | All basic templates, HD, no watermark |
| Creator | $39 | 60 reels | All templates, priority render, brand kit |
| Business | $99 | 180 reels | Priority queue, commercial use, agency |

### Billing Storage:
- Supabase `app_settings` table stores entitlements
- Key format: `entitlement:{userId}`
- Server-side check before every render

---

## 11. SEO & Marketing Pages

### Sitemap: Auto-generated from `lib/seo/public-url-collector.ts`
- 38+ pages indexed
- Submitted to Google Search Console

### SEO Landing Pages: `lib/seo-pages.ts`
7 programmatic SEO pages targeting specific keywords:
- /ai-explainer-video-generator
- /audio-to-reels
- /finance-reel-generator
- /hinglish-explainer-video-maker
- /faceless-explainer-video-maker
- /video-to-reel-maker
- /compare-explainer-video-maker

### Template Pages: `/templates/*`
- /templates/auto-caption-reel (interactive caption style picker)
- /templates/video-explainer
- /templates/compare-explainer

### Daily SEO Cron: `/api/cron/seo`
- Pings Google, Bing, IndexNow with sitemap
- Runs at 3 AM daily via Vercel cron

---

## 12. How to Add a New Template

### Step-by-Step:

**1. Create Remotion Template:**
```
remotion/templates/NEW_TEMPLATE/
├── template.tsx          # Composition + component
└── components/           # (optional) sub-components
```

In `template.tsx`:
```tsx
import { Composition } from 'remotion';
import { NewTemplate } from './components/NewTemplate';

export const NewTemplateComposition = () => (
  <Composition
    id="NEW-TEMPLATE-ID"
    component={NewTemplate}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={1800}
    defaultProps={{...}}
    calculateMetadata={({props}) => ({
      durationInFrames: Math.ceil((props.sourceDurationSeconds || 60) * 30),
    })}
  />
);
```

**2. Register in `remotion/index.tsx`:**
```tsx
import { NewTemplateComposition } from './templates/NEW_TEMPLATE/template';
const compositions = [..., NewTemplateComposition];
```

**3. Add to `services/ai/reelPlanner.ts`:**
```tsx
export type ReelTemplateName = '...' | 'NEW_TEMPLATE';
export const REEL_TEMPLATE_REGISTRY = {
  NEW_TEMPLATE: {
    templateName: 'NEW_TEMPLATE',
    compositionId: 'NEW-TEMPLATE-ID',
    allowedMedia: ['video'],
    transcriptRequirement: 'required',
    plannerMode: 'videoExplainer',
    mediaFit: 'videoExplainer',
  },
};
```

**4. Add mode mapping in `app/api/reels/jobs/route.ts`:**
```tsx
type ReelMode = '...' | 'newMode';
const MODE_TO_TEMPLATE = { newMode: 'NEW_TEMPLATE' };
```

**5. Allow in presign route `app/api/media/presign/route.ts`:**
Add check function: `isNewModeWorkflow(workflowMode)`

**6. Add dashboard card in `app/dashboard/page.tsx`:**
Add to `templateCards` array and `modeConfig` object.

**7. Deploy:**
```bash
npx vercel --prod           # Website
npm run reel:lambda:deploy  # Render engine
```

---

## 13. Common Errors & Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| "Could not find composition X" | Lambda has old site | `npm run reel:lambda:deploy` |
| "Could not start render" | Lambda invocation failed (payload too large, props invalid) | Strip heavy props for template, check Lambda logs |
| "This template is not available right now" | Presign route blocks the mode | Add mode to `isAllowedRenderMode()` in presign |
| "No clear speech detected" | Video has no voice (only music) | Upload video with clear speaking voice |
| "durationInFrames of Loop is missing" | Old Loop component on Lambda | Remove Loop, re-deploy Lambda |
| "Lame is not defined" (WAV to MP3) | lamejs npm broken with bundlers | Load via CDN script tag instead |
| "MPEGMode is not defined" | Same lamejs bundler issue | CDN script approach |
| Sticker images not showing | Path references `/assets/` (vercelignored) | Move to `/visuals/stickers/` |
| Template preview images broken | Same `/assets/` issue | Use `/visuals/previews/` path |
| RLS security warning (Supabase) | Row Level Security not enabled | Run `fix-rls-security.sql` |
| Transcription fails for all users | FFmpeg not on Vercel, returns empty URL | Fallback uses original S3 URL directly |

---

## 14. Environment Variables

### Required for Production:

```env
# App
NEXT_PUBLIC_SITE_URL=https://www.itnavideo.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
OPENAI_API_KEY=
GROQ_API_KEY=
GROQ_TRANSCRIPTION_MODEL=whisper-large-v3-turbo

# AWS
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
REMOTION_LAMBDA_FUNCTION_NAME=remotion-render-4-0-467-mem3008mb-disk2048mb-900sec
REMOTION_LAMBDA_SERVE_URL=https://remotionlambda-apsouth1-m59wp9dklj.s3.ap-south-1.amazonaws.com/sites/itnavideo-video-explainer/index.html
REMOTION_LAMBDA_BUCKET_NAME=remotionlambda-apsouth1-m59wp9dklj

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# SEO
SEO_CRON_SECRET=
```

---

## 15. Deployment Guide

### Website (Vercel):
```bash
npx vercel --prod
```
- Deploys Next.js app
- Excludes `public/assets/` (render assets stay on S3/Lambda)
- Auto-builds, generates static pages

### Render Engine (AWS Lambda):
```bash
npm run reel:lambda:deploy
```
- Bundles Remotion compositions + public/assets
- Uploads to S3 as "site"
- Lambda uses this site for rendering
- **MUST run after any template code change**

### Both (after template changes):
```bash
npx vercel --prod && npm run reel:lambda:deploy
```

---

## 16. Future Roadmap

### Immediate (Next 30 Days):
- [ ] Fix Auto Caption Reel render error (Lambda payload issue)
- [ ] Add more caption styles (word-highlight, karaoke)
- [ ] Transcript editor (TipTap) for user corrections before render
- [ ] Video preview before render (Remotion Player)

### Medium Term (60-90 Days):
- [ ] New templates: Talking Head, News Update, Product Showcase
- [ ] Background music library (user picks mood)
- [ ] Custom brand kit (colors, fonts, logo watermark)
- [ ] Bulk render (queue multiple videos)
- [ ] API access for business plan

### Long Term (6 Months):
- [ ] Mobile app (React Native)
- [ ] AI script writer (topic → script → reel)
- [ ] Team/agency dashboard with roles
- [ ] Custom template builder (drag-drop)
- [ ] Multi-platform auto-posting (Instagram, YouTube, TikTok APIs)
- [ ] Analytics dashboard (views, engagement)

---

## Summary

Itnavideo is a **template-driven, AI-powered short-form video generator** built on:
- **Next.js 16** (frontend + API)
- **Remotion 4** (video rendering)
- **AWS Lambda** (serverless rendering at scale)
- **Groq + OpenAI** (transcription + planning + translation)
- **Razorpay** (payments)
- **Supabase** (auth + data)

The system is designed for **predictable, structured output** (not random AI generation). Each template has a defined layout, and user inputs are restricted to what that template supports.

**Key differentiator:** Template-first approach where the visual structure is guaranteed, and AI only handles text (subtitles, timing, translation) — not visual design decisions.

---

*Document prepared for investor technical due diligence. All code is proprietary. © 2026 Itnavideo Inc.*
