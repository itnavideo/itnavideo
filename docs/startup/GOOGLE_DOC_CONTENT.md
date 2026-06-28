# Itnavideo — Startup Documentation

---

# 1. Startup Overview

## What Itnavideo Does

Itnavideo is an AI-powered short video generator for creators. Users upload audio or video, and the platform automatically generates polished reels with subtitles, stickers, animations, and professional layouts.

## Problem

- Creating short-form video content (Reels, Shorts, TikToks) requires editing skills, time, and expensive tools.
- Most creators, educators, and small businesses cannot afford professional video editors.
- Existing AI video tools produce generic, low-quality output that doesn't feel like real creator content.

## Solution

- Upload audio/video → get a finished reel in under 3 minutes.
- 7 specialized templates designed for different content types.
- AI handles transcription, scene planning, subtitle timing, and visual layout.
- No editing skills required. Output looks like creator-made content.

## Target Users

- Educators — Explain topics with whiteboard/notes reels
- Finance creators — Compare products, explain policies
- News channels — Quick news explainer reels
- Small businesses — Promote products with promo reels
- YouTubers — Promote long videos with short promo clips
- Coaches — Teaching/motivation content

## Current Status

- Live at: https://www.itnavideo.com
- 7 templates fully working in production
- 16 sticker characters for Compare Explainer
- Groq Whisper transcription (free, fast)
- Remotion Lambda serverless rendering (~$0.05/video)
- Razorpay payment integration
- Supabase auth + render history

## Vision

Become the go-to platform for creators who want to turn their voice/ideas into polished short videos without any editing — in any language, for any niche.

---

# 2. Product & Features

## Current Templates (7 Live)

1. Auto Caption Reel — Upload video, get stylish subtitles added automatically
2. Video Simple Explainer — Video/audio + subtitles + title + one bottom image
3. Compare Explainer — Audio + 2 comparison images + sticker presenter
4. Cinematic Collage — Audio/video + AI cinematic text scenes
5. Auto Draw Explainer — Audio/video + AI whiteboard scenes (Gemini planned)
6. Long Video Promo — Promote long YouTube videos with thumbnail + CTA
7. Voice Synced Notes — Audio/video + animated study notes synced to voice

## What Each Template Needs

Auto Caption Reel
- Upload: Video (MP4, MOV, WEBM)
- Options: Caption style (10 styles), position, colors
- Output: Same video with animated subtitles overlay

Video Simple Explainer
- Upload: Video or audio with speech
- Optional: One explanation image
- Output: Video at top + subtitles + image at bottom

Compare Explainer
- Upload: Audio voiceover
- Required: 2 images (left vs right)
- Options: Left/right titles, sticker character (16 options), handle name
- Output: VS comparison with animated sticker presenter

Cinematic Collage
- Upload: Audio or video with speech
- Output: Full-screen cinematic text scenes with Ken Burns motion

Auto Draw Explainer
- Upload: Audio or video with speech
- Planning: Gemini AI plans whiteboard scenes
- Output: Whiteboard-style animated explainer

Long Video Promo
- Upload: Short promo clip (10-30s)
- Optional: YouTube thumbnail image
- Fields: Video title, channel name, subscriber count, CTA text
- Output: Premium promo reel for YouTube long video

Voice Synced Notes
- Upload: Audio or video with speech
- Output: Clean animated study notes synced to voice timing

## Output Format

- Resolution: 1080 × 1920 (9:16 portrait)
- Format: MP4
- Duration: Up to 60 seconds
- FPS: 30

---

# 3. Technical Architecture

## Tech Stack

- Frontend: Next.js 16 (App Router) — Website + Dashboard
- Styling: Tailwind CSS 4
- Auth: Supabase Auth
- Database: Supabase (PostgreSQL) — Render history, settings
- Video Engine: Remotion 4.0.467 — Composition rendering
- Serverless Render: AWS Lambda (Remotion Lambda)
- Transcription: Groq Whisper (whisper-large-v3-turbo)
- AI Planning: Google Gemini (gemini-2.0-flash) — Scene planning for Auto Draw
- Storage: AWS S3 — Temporary uploads + renders
- Payment: Razorpay
- Hosting: Vercel — Frontend + API
- Domain: itnavideo.com

## Render Pipeline

1. User uploads file → Presigned S3 URL
2. /api/reels/jobs POST
3. Groq Whisper transcription
4. Build render props (template-specific)
5. Remotion Lambda render (serverless)
6. Poll /api/reels/jobs/status
7. Return MP4 download URL

## Key Architecture Decisions

- No always-on render server. Lambda renders on-demand (~$0.05/video).
- Transcription before rendering. No transcript = no render.
- S3 is temporary. Uploads and renders expire after ~48 hours.
- Vercel is frontend-only. No heavy processing.
- Two deploys needed for template changes: Vercel + Lambda.

## Cost Per Video (Estimated)

- Remotion Lambda: ~$0.04-0.05
- S3 storage (48h): ~$0.001
- Groq transcription: Free
- Gemini planning: Free
- Total per video: ~$0.05

## Provider Policy

- Groq → Primary transcription (always available)
- Gemini → Auto Draw planning + English repair (free)
- OpenAI → Paused (key expired, will restore later)

---

# 4. Template Rules

## How to Create a New Template (7 Steps)

1. Create remotion/templates/TEMPLATE_NAME/template.tsx with composition
2. Register in remotion/index.tsx
3. Add to REEL_TEMPLATE_REGISTRY in services/ai/reelPlanner.ts
4. Add dashboard card + mode config in app/dashboard/page.tsx
5. Add render flow support in app/api/reels/jobs/route.ts
6. Deploy Lambda: npm run reel:lambda:deploy
7. Deploy frontend: npx vercel --prod

A template is NOT complete until all 7 steps are done.

## Naming Convention

- Official Name: "Auto Caption Reel"
- Folder: remotion/templates/AUTO_CAPTION_REEL/
- Composition ID: AUTO-CAPTION-REEL (dashes only, no underscores)
- Dashboard Card ID: "auto-caption-reel"
- API Mode: "autoCaption" (camelCase)

## Template Behavior Rules

- Every render starts fresh. Never reuse old data.
- Lambda inputs must be HTTPS/signed S3 URLs. Never local paths.
- Templates are code-only folders. No images/fonts/sounds inside remotion/templates/.
- Render stability first — get basic render working before heavy design.
- Each template must clearly show what the user needs to upload.

---

# 5. Subtitle & Language Rules

## Current Policy

- Multi-language translation: PAUSED
- Supported languages: English, Hinglish only
- Transcription provider: Groq Whisper
- Paid translation APIs: NOT used
- Hindi/Hinglish output: Roman script (no Devanagari)

## How Subtitles Work

1. User uploads audio/video
2. Groq Whisper transcribes the speech
3. Returns English or Hinglish depending on detected language
4. Captions are built from transcript word timings
5. No external translation API is called

## DO NOT Rules

- Do NOT use OpenAI/Google/AWS/Azure translation APIs
- Do NOT output Devanagari script in captions
- Do NOT silently fall back to English if transcription fails — show error
- Do NOT reuse old/cached transcript data between renders

## Template Caption Support

- AUTO_CAPTION_REEL: YES — primary feature
- VIDEO_SIMPLE_EXPLAINER: YES — subtitle strip
- COMPARE_EXPLAINER: YES — bottom strip
- IMAGE_STORY_COLLAGE: Optional text overlays
- AUTO_DRAW_EXPLAINER: NO — whiteboard scenes
- VOICE_SYNCED_NOTES: YES — note lines
- LONG_VIDEO_PROMO: Optional

## Future Plan

Multi-language can be added as paid/Pro feature later (Kannada, Tamil, Urdu, Arabic, French, etc.)

---

# 6. Assets & S3 System

## Asset Locations

- Reusable render images: public/assets/reusable/images/ → S3
- Direct/one-time images: public/assets/direct/images/ → S3
- Background music: public/assets/reusable/background-music/ → S3
- Sound effects: public/assets/reusable/sound-effects/ → S3
- Sticker characters: public/assets/stickman/ → Lambda site bundle
- Website UI visuals: public/visuals/ → Vercel
- Brand logos: public/brand/ → Vercel
- Template previews: public/preview/ → Vercel

## S3 Rules

- Temporary uploads expire after ~48 hours
- Rendered videos expire after ~48 hours
- CORS required: run npm run aws:s3:cors
- Storage class: S3 Standard (no Glacier for short-lived files)

## Key Rules

- Do NOT put images/fonts/sounds inside remotion/templates/
- Do NOT deploy public/assets/ to Vercel
- Do NOT move render assets to public/brand/ or public/visuals/
- After adding/removing assets, always run npm run assets:index
- Stickers use staticFile() in Lambda — part of the site bundle

## Sticker System (Compare Explainer)

- 16 sticker characters with 6 poses each
- Poses: welcome, left, right, thinking, warning, success
- Body types: full_body (720×980), half_body (780×860)
- Stored in public/assets/stickman/{character-name}/

---

# 7. Known Issues & Fixes

## Current Issues

- OpenAI API key expired (401) — not blocking, local planner works without it
- Some sticker poses may look too similar visually — code works correctly

## Recently Fixed

- Captions not showing in Auto Caption Reel → fixed prop mismatch
- IMAGE_STORY_COLLAGE blank video → rewrote with inline styles (no Tailwind in Lambda)
- S3 CORS upload failure → applied CORS config
- Sticker transparency → batch-processed PNGs with Python
- Dashboard mobile UX → added auto-scroll on template select
- Video Simple Explainer random images → cleared unused image arrays

## Common Error Patterns

- "Template not available" → Lambda not redeployed (run npm run reel:lambda:deploy)
- "Could not detect clear speech" → Groq returned empty transcript (needs clearer audio)
- "Browser blocked" → S3 CORS not configured (run npm run aws:s3:cors)

---

# 8. Roadmap

## Short-Term

- Verify all 7 templates render correctly on production
- Fix OpenAI billing (restore API key)
- Improve sticker pose distinctness
- Add render error retry

## Future Templates (Ideas)

- Facecam Overlay
- Product Showcase / E-commerce
- Quote/Motivation
- Poll/Quiz Interactive
- Before/After Comparison
- Tutorial Steps

## Paid Features (Future)

- Multi-language subtitles (Pro)
- Custom branding/watermark (Pro)
- Longer videos 2-3 min (Studio)
- Priority rendering (Studio)
- Custom sticker upload (Pro)
- Batch rendering (Studio)

## Milestones

- First 100 paid users → Q3 2026
- YC application → when metrics ready
- 1000 monthly renders → Q4 2026

---

# 9. YC / Investor Notes

## Product Decisions Log

- May 2026: Paused multi-language translation (OpenAI expired, Groq handles English/Hinglish)
- May 2026: Switched to Gemini for Auto Draw planning (free, fast)
- May 2026: Removed old templates, focused on 7 strong ones
- May 2026: Added 16 sticker characters for Compare Explainer
- June 2026: Increased sticker size (user feedback: too small on mobile)
- June 2026: Full codebase cleanup of dead templates

## Demo Priorities

1. Compare Explainer (most visual — sticker + VS layout)
2. Auto Caption Reel (most relatable — everyone needs captions)
3. Show speed: upload → finished video in under 3 minutes
4. Show pricing: $19/mo = 35 videos = ~$0.54/video for user vs $0.05 cost

## Competition

- CapCut → manual editing required
- Pictory → generic AI output, expensive
- InVideo → complex UI, learning curve
- Opus Clip → only clips from long videos
- Itnavideo → template-first, upload-and-done, $0.05 cost

---

Last Updated: June 2026
