# Itnavideo — AI Video Creation & Cloud Rendering Platform

Itnavideo is an enterprise-grade AI video creation suite for creators, agencies, and YouTube publishers. Turn voiceover audio and raw footage into viral 9:16 vertical reels or 1080p Full HD 16:9 widescreen documentary explainers with word-level kinetic typography, intelligent B-roll matching, and serverless cloud rendering.

---

## 🎬 Master Video Types (10 Active Studio Engines)

> [!IMPORTANT]
> ### 🚨 Mandatory "Check First, Update After" Policy
> Every studio engine in Itnavideo executes a distinct, isolated processing pipeline and UI workflow.
> 1. **Before Any Code Changes**: Open the dedicated `.md` spec file in [`docs/video-types/`](./docs/video-types/) to review its exact inputs, limits, Remotion composition props, and pipeline steps.
> 2. **After Any Code Changes**: Immediately sync the corresponding `.md` spec file to keep platform documentation 100% accurate.

| # | Video Studio | Spec File | Aspect Ratio | Max Duration | Credit Pricing | Core Pipeline & Focus |
|---|---|---|:---:|:---:|:---:|---|
| 1 | **Faceless Video Generator** | [`facelessvideo.md`](./docs/video-types/facelessvideo.md) | **16:9 Widescreen** | Up to 10 Min (600s) | 1 Min = 1 Credit | Voiceover → Groq Whisper → AI B-roll matching → Sound effects → 1080p MP4 |
| 2 | **Book Summary Video** | [`booksummary.md`](./docs/video-types/booksummary.md) | **16:9 Widescreen** | Up to 10 Min (600s) | 1 Min = 1 Credit | Book narration audio → Chapter timestamps → Kinetic chapter cards & B-roll |
| 3 | **Image to Video AI** | [`imagetovideoai.md`](./docs/video-types/imagetovideoai.md) | **16:9 Widescreen** | Up to 10 Min (600s) | 1 Min = 1 Credit | User images/photos + audio → Smooth parallax motion & scene pacing |
| 4 | **YouTube Subtitles Generator** | [`youtubesubtitles.md`](./docs/video-types/youtubesubtitles.md) | **16:9 Widescreen** | Up to 10 Min (600s) | 1 Min = 1 Credit | Video/Audio → Groq Whisper → Burnt-in scrubber captions + SRT/VTT download |
| 5 | **Long Video to Viral Clips** | [`longvideoclips.md`](./docs/video-types/longvideoclips.md) | **Output 9:16** | Input: 2 Hours<br/>Output: 30–60s | 2 Credits / Clip | Long horizontal video → AI hook detector → Face center tracking → 9:16 Shorts |
| 6 | **Auto Caption Reel Generator** | [`autocaption.md`](./docs/video-types/autocaption.md) | **9:16 Vertical** | Up to 90s | 1 Credit | Raw video → Groq Whisper → Safe-zone kinetic word subtitles (11 presets) |
| 7 | **Compare Explainer Video** | [`compareexplainer.md`](./docs/video-types/compareexplainer.md) | **9:16 Vertical** | Up to 90s | 1 Credit | Audio + 2 comparison images → Split-screen versus battle + animated stickers |
| 8 | **Kinetic Typography Video** | [`typographyvideo.md`](./docs/video-types/typographyvideo.md) | **9:16 Vertical** | Up to 90s | 1 Credit | Narration audio → Millisecond word kinetics + dynamic camera pulses |
| 9 | **Whiteboard Animation Video** | [`whiteboardvideo.md`](./docs/video-types/whiteboardvideo.md) | **9:16 Vertical** | Up to 90s | 1 Credit | Narration → Gemini strategy planner → SVG stickman draw + hand gestures |
| 10 | **Long Video Promo Teaser** | [`longvideopromo.md`](./docs/video-types/longvideopromo.md) | **9:16 Vertical** | Up to 90s | 1 Credit | YouTube video + thumbnail → High-converting viral teaser reel |
| 11 | **AI Studio Audio Cleaner** | [`audiocleaner.md`](./docs/video-types/audiocleaner.md) | **Audio Utility** | Up to 10 Min (600s) | 1 Credit | Denoise (-14dB), auto retake removal, EBU R128 loudness mastering |

---

## 💳 Hybrid Pricing Ladder & Credit Rates

Itnavideo uses a transparent, dual-currency ladder model designed for both short-form creators and long-form YouTube documentary producers:

- **16:9 Long-Form Videos (Up to 10 Min)**: **1 Min = 1 Credit** (1 Min = 1 Cr, 5 Min = 5 Cr, 10 Min = 10 Cr).
- **9:16 Short-Form Videos (Up to 90s)**: **1 Credit** per video (1080×1920 30 FPS MP4).
- **Long Video Clips**: **2 Credits** per extracted vertical short.
- **AI Audio Cleaner**: **1 Credit** per master audio export.

### Subscription Plans

| Tier | Price (USD / INR) | Monthly Credits | Real-World Video Yield | Quality & Features |
|:---|:---:|:---:|:---|:---|
| **Free Trial** | **$0 / ₹0** | **1 Credit** | 1 Short or Reel (9:16) | 1080p Full HD, No Watermark, Full Studio Access |
| **Basic (Shorts Only)** | **$9 / ₹499** | **25 Credits** | **25 Shorts & Reels** (9:16) | Standard Queue, 90s Max, Commercial License |
| **Growth (Shorts + Long)** | **$19 / ₹999** | **85 Credits** | **35 Shorts + 10 Long Videos (5 min)**<br/>*OR 85 Shorts* | Priority Queue, 16:9 Cinema Widescreen, Up to 5m |
| **Pro Agency** | **$39 / ₹1,999** | **200 Credits** | **60 Shorts + 14 Long Videos (10 min)**<br/>*OR 200 Shorts* | VIP Turbo Queue, 16:9 Cinema Widescreen, Up to 10m |

---

## 🎨 Unified Studio UI & Design System

All studio engines and rendering progress views follow a unified **Obsidian Black, Midnight Navy Blue & Chocolate Slate** design system:

- **Canvas & Background**: Obsidian Black (`#070B14`, `#0B0D13`).
- **Elevated Surfaces & Cards**: Midnight Navy Slate (`#0E1526`, `#0D111D`) and Chocolate Charcoal (`#121624`, `#161C2E`).
- **Structural Borders**: Translucent fine borders (`border-white/10`).
- **Primary Brand Gradient & CTAs**: Flame Orange & Sunset Amber (`#FF5722` → `#FF7043` → `#FFA000`).
- **Typography**: Crisp high-contrast Pure White (`text-white`) with muted slate captions (`text-zinc-400`).
- **Standardized Studio Layout (12-Column Grid)**:
  - **Left 8 Columns**: Inputs (Script / Audio upload / Style selector / Aspect ratio).
  - **Right 4 Columns**: Sticky canvas preview, video specifications, credit cost breakdown, and primary action CTA.

---

## ⚡ Serverless Cloud Architecture (AWS & GCP Hybrid)

Itnavideo operates a zero-local-compute cloud pipeline:

```
[Client Web Browser]
       │
       ▼ (HTTPS)
[Google Cloud Run (Next.js 16 App Router)] ─── Primary Web & API Server
       │
       ├─► [Groq Whisper Cloud API] ────────── Fast millisecond speech transcription (Fallback: Gemini 2.0 Flash)
       ├─► [Google Cloud Vertex / Gemini API] ─ Whiteboard planning & visual scene direction
       ├─► [Cloudinary CDN] ────────────────── Fast global delivery for website images & video demos
       ├─► [Supabase PostgreSQL] ───────────── User auth, subscription entitlements & credit transactions
       │
       ▼ (Job Dispatch)
[AWS Remotion Lambda Cluster] ──────────────── Dedicated serverless 1080p MP4 rendering fleet
       │
       ▼ (Output Upload)
[AWS S3 Bucket (`itnavideo-media-assets`)] ──── 48-Hour cloud retention lifecycle with presigned URLs
```

### Production Services Breakdown
- **Google Cloud Run**: Hosts the Next.js production web server (`itnavideo-web` in `us-central1`, project `geometric-hull-501707-m2`).
- **AWS Lambda & S3**: Remotion Lambda cluster renders 1080p 30/60 FPS video jobs without any host CPU/RAM strain.
- **Cloudinary**: High-speed CDN for all landing page graphic assets and studio video demos.
- **Groq Whisper**: Millisecond-accurate speech recognition with automatic 16kHz mono audio extraction.

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
