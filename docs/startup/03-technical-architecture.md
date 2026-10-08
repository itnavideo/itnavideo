# Archived / Reference Note

This document is archived/reference material. Please use `docs/ITNAVIDEO_MASTER_DOC.md` as the latest source of truth for Itnavideo.

# Technical Architecture

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16 (App Router) | Website + Dashboard |
| Styling | Tailwind CSS 4 | UI styling |
| Auth | Supabase Auth | User login/signup |
| Database | Supabase (PostgreSQL) | Render history, settings |
| Video Engine | Remotion 4.0.467 | Composition rendering |
| Serverless Render | AWS Lambda (Remotion Lambda) | Production video rendering |
| Transcription | Groq Whisper (whisper-large-v3-turbo) | Speech-to-text |
| AI Planning | Google Gemini (gemini-2.0-flash) | Scene planning for Auto Draw |
| Storage | AWS S3 | Temporary uploads + renders |
| Payment | Razorpay | India payments |
| Hosting | Vercel | Frontend + API hosting |
| Domain | itnavideo.com | Production domain |

## Render Pipeline (End-to-End)

```
User uploads file
    ↓
Presigned S3 URL (browser → S3 direct)
    ↓
/api/reels/jobs POST
    ↓
Groq Whisper transcription
    ↓
Build render props (template-specific)
    ↓
Remotion Lambda render (serverless)
    ↓
Poll /api/reels/jobs/status
    ↓
Return MP4 download URL
```

## Key Architecture Decisions

- **No always-on render server.** Lambda renders on-demand (~$0.05/video).
- **Transcription before rendering.** No transcript = no render (show error).
- **S3 is temporary.** Uploads and renders expire after ~48 hours.
- **Vercel is frontend-only.** No heavy processing on Vercel (free plan limits).
- **Two deploys needed.** Template changes require both Vercel + Lambda deploy.

## Deployment Flow

| What | Command | Deploys To |
|------|---------|-----------|
| Frontend + API | `npx vercel --prod` | Vercel |
| Render engine | `npm run reel:lambda:deploy` | AWS Lambda |
| S3 CORS | `npm run aws:s3:cors` | S3 bucket |

## Supabase Tables

- `waitlist` — Early signups
- `newsletter` — Newsletter subscribers
- `job_applications` — Careers applications
- `app_settings` — Site configuration
- `render_history` — 48-hour render metadata (cross-device history)

## Last Updated

June 2026
