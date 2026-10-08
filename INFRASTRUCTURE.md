# ITNAVIDEO Infrastructure & Domain Architecture

This document defines the official hosting, cloud infrastructure, storage, and domain routing rules for **Itnavideo**. All developers and AI agents must strictly follow these rules.

---

## 1. Primary Domain & SEO Canonical
- **Primary Domain**: `https://www.itnavideo.com`
- **Apex Domain (itnavideo.com)**: Must **always 301 permanently redirect** to `https://www.itnavideo.com`.
- **Reason**: 100+ SEO blog articles, Google Instant Indexing API, Bing IndexNow, Search Console properties, and sitemaps are registered under `www.itnavideo.com`. Canonical must never be switched away from `www`.

---

## 2. Cloud Infrastructure & Hosting (100% AWS)

### A. AWS Region
- **Primary Region**: `us-east-1` (Mumbai, India)
- **Target Audience**: Indian & Global creator economy with low-latency media processing.

### B. Web App & Backend Hosting
- **Platform**: AWS ECS / Fargate (Containerized Next.js 16 Standalone Engine via `Dockerfile`)
- **Container Port**: `8080` / `3000`
- **Node Environment**: Node.js 20 Alpine, standalone output mode (`.next/standalone`)

### C. Serverless Video Rendering Engine
- **Engine**: AWS Lambda (`@remotion/lambda`) in `us-east-1` (Mumbai)
- **Architecture**: Serverless parallel rendering via Remotion Lambda (up to 3008MB memory, 900s timeout, 300 frames per lambda chunk)
- **Zero Local Rendering**: No local Chromium rendering on developer machine (4GB RAM / HDD). 100% cloud rendering on AWS Lambda.

---

## 3. Storage & Static Asset Architecture

### A. Render Files & Media Assets (AWS S3)
- **Provider**: AWS S3
- **Primary Region**: `us-east-1` (Mumbai)
- **Buckets**:
  - `itnavideo-media-assets`: Reusable production render assets, audio stems, SFX, and stickman visuals.
  - `remotionlambda-useast1-*`: Raw user uploads (`uploads/raw/`) and final rendered MP4s (`renders/final/`).
- **Lifecycle Policy**: Temporary user uploads and render files automatically expire and delete after 48 hours (2 days) to optimize storage costs.
- **CORS**: Direct browser-to-S3 presigned URL uploads configured via `scripts/setup-s3-temp-cors.mjs`.

### B. Website Images, UI Graphics & Demo Videos (Cloudinary)
- **Provider**: Cloudinary (Cloud Name: `dhouh9idx`)
- **Usage**: Strictly dedicated for website hero visuals, UI badges, blog post covers, and marketing demo videos.
- **Advantage**: Edge CDN caching, automatic WebP/AVIF compression, and rapid global delivery for web visitors without burdening S3.

---

## 4. Google Cloud Platform (Strict AI Scope)

### A. Region
- **Region**: `asia-south1` (Mumbai, India)

### B. Restricted Scope (AI APIs Only)
- **Permitted Workloads**:
  - Google Gemini 2.0 Flash / Vertex AI for scene planning, whiteboard stickman prompts, and script generation.
  - Google Instant Indexing API for automated SEO URL submission.
- **Strictly Forbidden on GCP**:
  - ❌ **No Web Hosting**: Google Cloud Run hosting for `itnavideo-web` is migrated to AWS.
  - ❌ **No Video Rendering**: No local or GCP container video encoding.
  - ❌ **No User Media Storage**: GCS is not used for user uploads or render outputs (all on AWS S3).

---

## 4. Speech Transcription & AI Engine Architecture

### A. Primary Transcriber: Groq Whisper Cloud API
- **Audio Extraction First**: Heavy raw videos are never sent directly to Groq. Audio is extracted as 16kHz mono MP3/WAV (~8MB to 11MB for 12 minutes) before transmission, staying well within Groq's 25MB payload limit.
- **Speed**: Transcribes 3-minute reels in ~2 seconds and 12-minute long videos in ~10 seconds with millisecond word timestamps.

### B. Mandatory Fallback: Google Gemini 2.0 Flash (`asia-south1`)
- If Groq Whisper experiences rate-limits, 5xx errors, or timeout, the pipeline seamlessly falls back to Gemini 2.0 Flash for audio transcription and timestamp recovery.

---

## 5. Master Video Duration Guardrails

| Video Category | Aspect Ratio | Maximum Duration | Render Pipeline | Audio & Transcription Strategy |
| :--- | :---: | :---: | :--- | :--- |
| **All Short-Form Videos** (TikTok, Reels, Shorts) | **9:16** | **3 Minutes (180s)** | AWS Remotion Lambda (18 parallel chunks, ~45s render) | Extracted audio → Groq Whisper (Fallback: Gemini) |
| **All Long-Form Videos** (YouTube Long Videos) | **16:9** | **12 Minutes (720s)** | AWS Remotion Lambda (72 parallel chunks, ~4m render) | Extracted 16kHz audio (~9MB) → Groq Whisper (Fallback: Gemini) |
| **Long Video to Viral Clips** (`longvideoclips`) | **Source: 16:9 / 9:16**<br/>**Output: 9:16** | **Input: Up to 3 Hours** (10,800s)<br/>**Output: 30s–60s Clips** | Full video is NEVER rendered. Only selected 30s–60s clips rendered on Lambda. | Audio extracted, split into 20m chunks → Parallel Groq (Fallback: Gemini) → AI Hook Detector → Snippet Render |

---

## 6. Deployment Commands & Verification

### A. Remotion Lambda Render Engine Deployment
To deploy or update Remotion Lambda functions and Remotion site bundle to AWS Mumbai (`us-east-1`):
```bash
node scripts/remotion-lambda-deploy.mjs
```
*(Or via npm script: `npm run reel:lambda:deploy`)*

### B. Web Container Deployment (AWS ECS / Fargate)
Build and deploy the Next.js production container (`Dockerfile`) to AWS ECR and ECS in `us-east-1`:
```powershell
.\deploy.ps1
```

### C. AWS S3 Bucket Configuration
Setup CORS and 48-hour lifecycle policy on the S3 bucket:
```bash
node scripts/setup-s3-temp-cors.mjs
node scripts/setup-s3-temp-lifecycle.mjs
```

### D. Static Verification (Local Machine)
Always verify TypeScript compilation with zero errors before deployment:
```bash
npx tsc --noEmit
```
