# Itnavideo — Enterprise AI Video Creation & Cloud Rendering Platform

Itnavideo is an enterprise-grade AI video creation and programmatic rendering SaaS platform. It enables content creators, marketing agencies, educators, and businesses to transform spoken audio, raw footage, and scripts into high-retention 9:16 vertical shorts and 16:9 widescreen 1080p documentary videos. Powered by cloud-native transcription, intelligent visual matching, dynamic kinetic typography, and distributed Remotion rendering on AWS Lambda.

---

## 📚 Master Documentation & Architecture

- 📖 **Master Architectural Specification**: [`AGENTS.md`](./AGENTS.md) — Single source of truth for all software engineering rules, zero local compute policies, RLS security, and cloud infrastructure.
- 🌐 **Marketing Homepage Specification**: [`docs/homepage.md`](./docs/homepage.md) — Complete specifications for the homepage conversion funnel, responsive studio pickers, and copy architecture.
- 🎬 **Video Types Master Registry**: [`docs/video-types/README.md`](./docs/video-types/README.md) — Master index and quick reference for all 15 dedicated studio engines.

---

## 🎬 Master Video Types (All 15 Active Studio Engines)

> [!IMPORTANT]
> ### 🚨 Mandatory "Check First, Update After" Policy
> Every studio engine in Itnavideo executes a distinct, isolated processing pipeline and UI workflow.
> 1. **Before Any Code Changes**: Open the dedicated `.md` spec file in [`docs/video-types/`](./docs/video-types/) to review its exact inputs, limits, Remotion composition props, and pipeline steps.
> 2. **After Any Code Changes**: Immediately sync the corresponding `.md` spec file to keep platform documentation 100% accurate.

| # | Video Studio | Spec File | Aspect Ratio | Max Video Duration | Credit Pricing | Core Pipeline & Output |
|:---:|---|---|:---:|:---:|:---:|---|
| 1 | **Faceless Video Generator** | [`faceless-video.md`](./docs/video-types/faceless-video.md) | **16:9 Widescreen** | Up to 5 Min (300s) | 1 Min = 1 Credit | Voiceover → Groq Whisper → Vector storytelling (≤10% stock images, 90%+ 520px procedural SVGs) → Sound effects → 1080p MP4 |
| 2 | **Book Summary Video** | [`book-summary.md`](./docs/video-types/book-summary.md) | **16:9 Widescreen** | Up to 5 Min (300s) | 1 Min = 1 Credit | Book narration audio → Chapter timestamps → Kinetic chapter cards & B-roll |
| 3 | **Image to Video AI** | [`image-to-video-ai.md`](./docs/video-types/image-to-video-ai.md) | **16:9 Widescreen** | Up to 5 Min (300s) | 1 Min = 1 Credit | User photos + narration audio → Smooth Ken Burns motion, 32 kinetic caption styles, in-player live editor & subtitles |
| 4 | **YouTube Subtitles Generator** | [`youtube-subtitles-generator.md`](./docs/video-types/youtube-subtitles-generator.md) | **16:9 Widescreen** | Up to 5 Min (300s) | **FREE • 5 Daily** | Video/Audio → Groq Whisper → Burnt-in scrubber captions + SRT/VTT export |
| 5 | **AI Video Generator** | [`ai-video-generator.md`](./docs/video-types/ai-video-generator.md) | **16:9 Widescreen** | Up to 5 Min (300s) | 1 Min = 1 Credit | Script prompt → AI Scene Director → B-roll cinematic sequencing & kinetic captions |
| 6 | **AI YouTube Video Polisher** | [`ai-video-polisher.md`](./docs/video-types/ai-video-polisher.md) | **16:9 Widescreen** | Up to 5 Min (300s) | 1 Min = 1 Credit | Video shoot → Silence Jump-Cuts, +12% Dynamic Punch-In & PIP Overlay |
| 7 | **Auto Caption Reel Generator** | [`auto-caption-generator.md`](./docs/video-types/auto-caption-generator.md) | **9:16 Vertical** | Up to 90s | **FREE • 5 Daily** | Raw video → Groq Whisper → WhiteStair two-tone single-line captions (11 presets) |
| 8 | **Faceless Shorts** | [`faceless-shorts.md`](./docs/video-types/faceless-shorts.md) | **9:16 Vertical** | Up to 90s | 1 Credit Flat | Voiceover → Faceless Short Visuals, Sound effects & Kinetic subtitles |
| 9 | **Compare Explainer Video** | [`compare-explainer.md`](./docs/video-types/compare-explainer.md) | **9:16 Vertical** | Up to 90s | 1 Credit Flat | Audio + 2 comparison images → Split-screen versus battle + animated stickers |
| 10 | **Whiteboard Animation Video** | [`whiteboard-video.md`](./docs/video-types/whiteboard-video.md) | **9:16 Vertical** | Up to 90s | 1 Credit Flat | Narration → Gemini strategy planner → SVG stickman draw + hand gestures |
| 11 | **Long Video to Viral Clips** | [`long-video-clips.md`](./docs/video-types/long-video-clips.md) | **Output 9:16** | Input: 2 Hours<br/>Output: 30–60s | 1 Credit / Clip | Long horizontal video → AI hook detector → Face center tracking → 9:16 Shorts |
| 12 | **Long Video Promo Teaser** | [`long-video-promo.md`](./docs/video-types/long-video-promo.md) | **9:16 Vertical** | Up to 90s | 1 Credit Flat | YouTube video + thumbnail → High-converting viral teaser reel |
| 13 | **Split-Screen Explainer** | [`split-screen-explainer.md`](./docs/video-types/split-screen-explainer.md) | **9:16 Vertical** | Up to 90s | 1 Credit Flat | 50/50 Dual Zone (Top: visual assets, Bottom: creator talking head) → Zoom pulses & glowing captions |
| 14 | **AI Shorts Polisher** | [`ai-shorts-polisher.md`](./docs/video-types/ai-shorts-polisher.md) | **9:16 Vertical** | Up to 90s | 1 Credit Flat | Smartphone shoot → Silence Jump-Cuts, Dynamic Punch-In & PIP Overlay |
| 15 | **AI Studio Audio Cleaner** | [`ai-audio-cleaner.md`](./docs/video-types/ai-audio-cleaner.md) | **Audio Utility** | Up to 5 Min (300s) | 1 Credit Flat | Denoise (-14dB), auto retake removal, EBU R128 loudness mastering |

---

## 💳 Hybrid Pricing Ladder & Credit Rates

Itnavideo uses a transparent, dual-currency ladder model designed for both short-form creators and long-form YouTube producers:

- **16:9 Long-Form Videos (Up to 5 Min)**: **1 Min = 1 Credit** (1 Min = 1 Cr, 2 Min = 2 Cr, 3 Min = 3 Cr, 4 Min = 4 Cr, 5 Min = 5 Cr).
- **9:16 Short-Form Videos (Up to 90s)**: **1 Credit** flat per video (1080×1920 30 FPS MP4).
- **Long Video Clips**: **1 Credit** per extracted vertical short (1 clip = 1 credit, 5 clips = 5 credits).
- **AI Audio Cleaner**: **1 Credit** per master audio export.
- **Free Daily Quotas**: YouTube Subtitles Generator and Auto Caption Reel include **5 Free Videos daily** (0 credits consumed).

---

## 🎨 Unified Studio UI & Design System

All studio engines and rendering progress views follow a unified **Obsidian Black, Midnight Navy Blue & Mint/Indigo Accent** design system:

- **Canvas & Background**: Obsidian Black (`#09090b` / `zinc-950`).
- **Elevated Surfaces & Cards**: Midnight Navy Slate (`#18181b` / `zinc-900`).
- **Structural Borders**: Translucent fine borders (`border-white/10`).
- **Primary Brand CTAs**: Emerald / Mint (`#10b981`) and Indigo / Violet (`#6366f1`).
- **Typography**: Crisp high-contrast Pure White (`text-white`) with muted captions (`text-zinc-400`).
- **Clean Headline Standard**: Zero eyebrow pill badges or kicker spark chips above section titles.

---

## ⚡ Serverless Cloud Architecture (AWS & GCP Hybrid)

Itnavideo operates a zero-local-compute cloud pipeline:

```
[Client Web Browser / Mobile App]
       │
       ▼ (HTTPS)
[Google Cloud Run (Next.js 16 App Router)] ─── Primary Web & API Server (us-central1)
       │
       ├─► [Groq Whisper Cloud API] ────────── Fast millisecond speech transcription (Fallback: Gemini 2.0 Flash)
       ├─► [Google Cloud Vertex / Gemini API] ─ Whiteboard planning & visual scene direction
       ├─► [Cloudinary CDN] ────────────────── Fast global delivery for website images & video demos
       ├─► [Supabase PostgreSQL] ───────────── User auth, subscription entitlements & credit transactions (RLS enabled)
       │
       ▼ (Job Dispatch)
[AWS Remotion Lambda Cluster] ──────────────── Dedicated serverless 1080p MP4 rendering fleet (us-east-1)
       │
       ▼ (Output Upload)
[AWS S3 Bucket (`itnavideo-media-assets`)] ──── 48-Hour cloud retention lifecycle with presigned URLs
```

---

## 🛠️ Developer Commands

```bash
# Development server (Turbopack)
npm run dev

# Static TypeScript type check (Zero errors required)
npx tsc --noEmit

# Rebuild reusable asset index (public/assets/assets.json)
npm run assets:index

# Deploy Remotion Lambda site & function to AWS
npm run reel:lambda:deploy

# Deploy Next.js web application to Google Cloud Run
npm run deploy:cloud
```

---

## 🔒 Security & Retention Guidelines

1. **48-Hour Retention Lifecycle**: All uploaded source media and rendered 1080p MP4 master files expire and are automatically purged from AWS S3 storage after 48 hours.
2. **Language Policy**: Supports English and Roman script Hinglish subtitles via Groq Whisper. Multi-language Devanagari translation is paused to prevent font clipping.
3. **No Local Heavy Rendering**: The host development machine strictly uses cloud-based Remotion Lambda rendering to prevent memory thrashing.
4. **Mandatory Row Level Security**: All tables in Supabase have RLS enabled, protecting user data and preventing unauthorized access through the public PostgREST API.
